"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getMcqSets } from "@/app/actions/mcq-actions";

export default function DailyChallengePage() {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load streak from localStorage
    const savedStreak = localStorage.getItem("dailyStreak");
    if (savedStreak) {
      setStreak(Number.parseInt(savedStreak));
    }

    // Check if daily challenge was completed today
    const lastCompletedDate = localStorage.getItem("lastCompletedDate");
    const today = new Date().toDateString();

    if (lastCompletedDate === today) {
      setCompleted(true);
    }

    async function fetchDailyMcqs() {
      try {
        // Fetch all MCQ sets
        const sets = await getMcqSets({ limit: 100 });

        // Collect MCQs from all sets
        let allMcqs = [];
        for (const set of sets) {
          const response = await fetch(`/api/mcqs?setId=${set.id}`);
          const data = await response.json();
          allMcqs = [...allMcqs, ...data];
        }

        // Use the current date as a seed for pseudo-random selection
        // This ensures the same questions appear for all users on the same day
        const today = new Date();
        const seed =
          today.getFullYear() * 10000 +
          (today.getMonth() + 1) * 100 +
          today.getDate();

        // Deterministic shuffle based on the date
        const shuffled = allMcqs.sort((a, b) => {
          const hashA = hashCode(`${a.id}${seed}`);
          const hashB = hashCode(`${b.id}${seed}`);
          return hashA - hashB;
        });

        // Take 5 questions for the daily challenge
        const dailyMcqs = shuffled.slice(0, 5);

        setMcqs(dailyMcqs);
      } catch (error) {
        console.log("Error loading daily MCQs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyMcqs();
  }, []);

  // Simple string hash function for deterministic shuffling
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading daily challenge...
          </p>
        </div>
      </div>
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mcq-practice">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Practice
              </Link>
            </Button>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">No MCQs Available</h2>
              <p className="text-muted-foreground mb-6">
                There are no MCQs available for the daily challenge yet.
              </p>
              <Button asChild>
                <Link href="/mcq-practice">Return to Practice Menu</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If already completed today
  if (completed) {
    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mcq-practice">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Practice
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Daily Challenge Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              You&apos;ve completed today&apos;s challenge!
            </h3>
            <p className="text-muted-foreground mb-2">
              Current streak: {streak} days
            </p>
            <p className="text-muted-foreground mb-6">
              Come back tomorrow for a new set of questions.
            </p>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <Button variant="outline" asChild>
                <Link href="/mcq-practice">Return to Practice Menu</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSelectAnswer = (value) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [mcqs[currentQuestion].id]: value,
    });
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = Object.entries(selectedAnswers).filter(
        ([id, answer]) =>
          answer ===
          mcqs
            .find((mcq) => mcq.id.toString() === id)
            ?.correct_answer.toString()
      ).length;

      // Update streak
      const newStreak =
        correctAnswers >= Math.ceil(mcqs.length / 2) ? streak + 1 : 0;
      setStreak(newStreak);
      localStorage.setItem("dailyStreak", newStreak.toString());

      // Mark as completed for today
      localStorage.setItem("lastCompletedDate", new Date().toDateString());

      setCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    setShowAnswer(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCheckAnswer = () => {
    setShowAnswer(true);
  };

  const currentMcq = mcqs[currentQuestion];
  const selectedAnswer = selectedAnswers[currentMcq.id];
  const isCorrect = selectedAnswer === currentMcq.correct_answer.toString();
  const progress = ((currentQuestion + 1) / mcqs.length) * 100;

  if (completed) {
    const correctAnswers = Object.entries(selectedAnswers).filter(
      ([id, answer]) =>
        answer ===
        mcqs.find((mcq) => mcq.id.toString() === id)?.correct_answer.toString()
    ).length;

    return (
      <div className="container py-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Daily Challenge Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <Trophy className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Your Score: {correctAnswers}/{mcqs.length}
            </h3>
            <p className="text-muted-foreground mb-2">
              You answered {correctAnswers} out of {mcqs.length} questions
              correctly.
            </p>
            <p className="text-muted-foreground mb-2">
              Current streak: {streak} days
            </p>
            <p className="text-muted-foreground mb-6">
              Come back tomorrow for a new set of questions.
            </p>
            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <Button variant="outline" asChild>
                <Link href="/mcq-practice">Return to Practice Menu</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mcq-practice">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Practice
            </Link>
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Question {currentQuestion + 1} of {mcqs.length}
            </span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentMcq.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswer}
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {currentMcq.options.map((option, index) => {
                const optionId = index.toString();
                const isSelected = selectedAnswer === optionId;
                const isCorrectOption =
                  optionId === currentMcq.correct_answer.toString();
                let className =
                  "flex items-center space-x-2 rounded-md border p-3";

                if (showAnswer) {
                  if (isCorrectOption) {
                    className += " border-green-500 bg-green-50";
                  } else if (isSelected && !isCorrectOption) {
                    className += " border-red-500 bg-red-50";
                  }
                } else if (isSelected) {
                  className += " border-primary";
                }

                return (
                  <div key={index} className={className}>
                    <RadioGroupItem
                      value={optionId}
                      id={`option-${index}`}
                      disabled={showAnswer}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option}
                    </Label>
                    {showAnswer && isCorrectOption && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {showAnswer && isSelected && !isCorrectOption && (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div>
              {!showAnswer && selectedAnswer ? (
                <Button onClick={handleCheckAnswer}>Check Answer</Button>
              ) : (
                <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
                  {currentQuestion === mcqs.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
