"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMcqSets } from "@/app/actions/mcq-actions";

// Step types
type Step = "board" | "class" | "subject" | "sets";

export default function McqPracticePage() {
  const [step, setStep] = useState<Step>("board");
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [mcqSets, setMcqSets] = useState([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Available boards
  const boards = [
    { id: "punjab", name: "Punjab", icon: "🏛️" },
    { id: "lahore", name: "Lahore", icon: "🏛️" },
    { id: "gujranwala", name: "Gujranwala", icon: "🏛️" },
    { id: "sindh", name: "Sindh", icon: "🏛️" },
    { id: "kpk", name: "KPK", icon: "🏛️" },
    { id: "federal", name: "Federal", icon: "🏛️" },
    { id: "ajk", name: "AJK", icon: "🏛️" },
    { id: "balochistan", name: "Balochistan", icon: "🏛️" },
  ];

  // Available classes
  const classes = [
    { id: "9", name: "9th Class", icon: "📚" },
    { id: "10", name: "10th Class", icon: "📚" },
    { id: "11", name: "11th Class", icon: "📚" },
    { id: "12", name: "12th Class", icon: "📚" },
  ];

  // Fetch MCQ sets
  useEffect(() => {
    async function fetchMcqSets() {
      try {
        const allSets = await getMcqSets({ limit: 100 });
        setMcqSets(allSets);

        // Extract unique subjects
        const uniqueSubjects = [
          ...new Set(allSets.map((set) => set.subject)),
        ].filter(Boolean);
        setSubjects(uniqueSubjects);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching MCQ sets:", error);
        setLoading(false);
      }
    }

    fetchMcqSets();
  }, []);

  // Handle board selection
  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
    setStep("class");
  };

  // Handle class selection
  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    setStep("subject");
  };

  // Handle subject selection
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setStep("sets");
  };

  // Handle back button
  const handleBack = () => {
    if (step === "class") {
      setStep("board");
      setSelectedBoard(null);
    } else if (step === "subject") {
      setStep("class");
      setSelectedClass(null);
    } else if (step === "sets") {
      setStep("subject");
      setSelectedSubject(null);
    }
  };

  // Get subject icon
  const getSubjectIcon = (subject: string) => {
    const icons = {
      Mathematics: "📐",
      Physics: "🔭",
      Chemistry: "🧪",
      Biology: "🧬",
      English: "📚",
      Urdu: "📝",
      Islamiat: "☪️",
      "Pakistan Studies": "🇵🇰",
      "Computer Science": "💻",
    };

    return icons[subject] || "📘";
  };

  // Filter subjects by selected board and class
  const filteredSubjects =
    selectedBoard && selectedClass
      ? [
          ...new Set(
            mcqSets
              .filter(
                (set) =>
                  set.board?.toLowerCase() === selectedBoard.toLowerCase() &&
                  set.class === selectedClass
              )
              .map((set) => set.subject)
          ),
        ]
      : subjects;

  // Filter MCQ sets by selected board, class, and subject
  const filteredSets = mcqSets.filter((set) => {
    const matchesBoard = selectedBoard
      ? set.board?.toLowerCase() === selectedBoard.toLowerCase()
      : true;
    const matchesClass = selectedClass ? set.class === selectedClass : true;
    const matchesSubject = selectedSubject
      ? set.subject === selectedSubject
      : true;
    return matchesBoard && matchesClass && matchesSubject;
  });

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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">MCQ Practice</h1>
          <p className="text-muted-foreground">
            Practice MCQs from past papers in an interactive flashcard format.
          </p>
        </div>

        {/* Step navigation */}
        {step !== "board" && (
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center ml-2 text-sm flex-wrap">
              <span className="text-muted-foreground">Select Board</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span
                className={
                  step === "class" ? "font-medium" : "text-muted-foreground"
                }
              >
                Select Class
              </span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span
                className={
                  step === "subject" ? "font-medium" : "text-muted-foreground"
                }
              >
                Select Subject
              </span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span
                className={
                  step === "sets" ? "font-medium" : "text-muted-foreground"
                }
              >
                Practice Sets
              </span>
            </div>
          </div>
        )}

        {/* Board selection step */}
        {step === "board" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boards.map((board) => (
              <Card
                key={board.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleBoardSelect(board.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl mb-2">{board.icon}</div>
                      <h3 className="font-medium">{board.name} Board</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {
                          mcqSets.filter(
                            (set) =>
                              set.board?.toLowerCase() ===
                              board.id.toLowerCase()
                          ).length
                        }{" "}
                        MCQ sets
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Class selection step */}
        {step === "class" && (
          <>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">
                Select a class for{" "}
                {boards.find((b) => b.id === selectedBoard)?.name} Board
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {classes.map((cls) => {
                const setsCount = mcqSets.filter(
                  (set) =>
                    set.board?.toLowerCase() === selectedBoard.toLowerCase() &&
                    set.class === cls.id
                ).length;

                return (
                  <Card
                    key={cls.id}
                    className={`transition-all ${
                      setsCount > 0
                        ? "cursor-pointer hover:shadow-md"
                        : "opacity-60"
                    }`}
                    onClick={() => setsCount > 0 && handleClassSelect(cls.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl mb-2">{cls.icon}</div>
                          <h3 className="font-medium">{cls.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {setsCount} MCQ sets
                          </p>
                        </div>
                        {setsCount > 0 && (
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Subject selection step */}
        {step === "subject" && (
          <>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">
                Select a subject for{" "}
                {classes.find((c) => c.id === selectedClass)?.name},{" "}
                {boards.find((b) => b.id === selectedBoard)?.name} Board
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject) => {
                  const setsCount = mcqSets.filter(
                    (set) =>
                      set.board?.toLowerCase() ===
                        selectedBoard.toLowerCase() &&
                      set.class === selectedClass &&
                      set.subject === subject
                  ).length;

                  return (
                    <Card
                      key={subject}
                      className="cursor-pointer transition-all hover:shadow-md"
                      onClick={() => handleSubjectSelect(subject)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl mb-2">
                              {getSubjectIcon(subject)}
                            </div>
                            <h3 className="font-medium">{subject}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {setsCount} MCQ sets
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No subjects found for this class and board.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* MCQ sets step */}
        {step === "sets" && (
          <>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">
                {selectedSubject} MCQ Sets for{" "}
                {classes.find((c) => c.id === selectedClass)?.name},{" "}
                {boards.find((b) => b.id === selectedBoard)?.name} Board
              </h2>
            </div>
            <div className="grid gap-4">
              {filteredSets.length > 0 ? (
                filteredSets.map((set) => (
                  <Link key={set.id} href={`/mcq-practice/${set.id}`}>
                    <Card className="transition-all hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{set.title}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                <span>
                                  {typeof set.mcq_count === "object"
                                    ? set.mcq_count.count
                                    : set.mcq_count || 0}{" "}
                                  MCQs
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {set.board} Board • {set.year}
                            </p>
                          </div>
                          <Button size="sm">Practice</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No MCQ sets found
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md">
                    There are no MCQ sets available for {selectedSubject} in{" "}
                    {classes.find((c) => c.id === selectedClass)?.name},{" "}
                    {boards.find((b) => b.id === selectedBoard)?.name} Board.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
