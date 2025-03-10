"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { getMcqSets } from "@/app/actions/mcq-actions";

export default function CustomPracticePage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mcqSets, setMcqSets] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [boards, setBoards] = useState([]);

  const [selectedBoard, setSelectedBoard] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedSets, setSelectedSets] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [mode, setMode] = useState("random"); // random, sequential

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const sets = await getMcqSets({ limit: 100 });
        setMcqSets(sets);

        // Extract unique subjects and boards
        const uniqueSubjects = Array.from(
          new Set(sets.map((set) => set.subject))
        );
        const uniqueBoards = Array.from(new Set(sets.map((set) => set.board)));

        setSubjects(uniqueSubjects);
        setBoards(uniqueBoards);
      } catch (error) {
        console.log("Error loading MCQ sets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter MCQ sets based on selected board and subject
  const filteredSets = mcqSets.filter((set) => {
    const matchesBoard = selectedBoard === "all" || set.board === selectedBoard;
    const matchesSubject =
      selectedSubject === "all" || set.subject === selectedSubject;
    return matchesBoard && matchesSubject;
  });

  const handleSetSelection = (setId) => {
    if (selectedSets.includes(setId)) {
      setSelectedSets(selectedSets.filter((id) => id !== setId));
    } else {
      setSelectedSets([...selectedSets, setId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSets.length === filteredSets.length) {
      setSelectedSets([]);
    } else {
      setSelectedSets(filteredSets.map((set) => set.id));
    }
  };

  const handleStartPractice = async () => {
    if (selectedSets.length === 0) {
      alert("Please select at least one MCQ set");
      return;
    }

    setSubmitting(true);

    try {
      // Store the practice configuration in localStorage
      localStorage.setItem(
        "customPractice",
        JSON.stringify({
          setIds: selectedSets,
          questionCount,
          mode,
        })
      );

      // Navigate to the custom practice session
      router.push("/mcq-practice/custom/session");
    } catch (error) {
      console.log("Error starting custom practice:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading MCQ sets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mcq-practice">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Practice
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Custom Practice</h1>
          <p className="text-muted-foreground">
            Create a personalized MCQ practice session.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Practice Settings</CardTitle>
            <CardDescription>
              Configure your custom practice session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Select
                    value={selectedBoard}
                    onValueChange={setSelectedBoard}
                  >
                    <SelectTrigger id="board">
                      <SelectValue placeholder="Select board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Boards</SelectItem>
                      {boards.map((board) => (
                        <SelectItem key={board} value={board}>
                          {board}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>MCQ Sets</Label>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedSets.length === filteredSets.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                  {filteredSets.length > 0 ? (
                    filteredSets.map((set) => (
                      <div key={set.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`set-${set.id}`}
                          checked={selectedSets.includes(set.id)}
                          onCheckedChange={() => handleSetSelection(set.id)}
                        />
                        <Label
                          htmlFor={`set-${set.id}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {set.title} ({set.mcq_count || 0} MCQs)
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No MCQ sets found matching your filters.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="questionCount">
                  Number of Questions: {questionCount}
                </Label>
                <Slider
                  id="questionCount"
                  min={5}
                  max={50}
                  step={5}
                  value={[questionCount]}
                  onValueChange={(value) => setQuestionCount(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Practice Mode</Label>
                <RadioGroup value={mode} onValueChange={setMode}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="random" id="random" />
                    <Label htmlFor="random">Random Order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sequential" id="sequential" />
                    <Label htmlFor="sequential">Sequential Order</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleStartPractice}
              disabled={submitting || selectedSets.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  Start Practice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
