"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PaperFilters({
  selectedBoard,
  selectedClass,
  selectedSubject,
  selectedYear,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openBoards, setOpenBoards] = useState(true);
  const [openClasses, setOpenClasses] = useState(true);
  const [openSubjects, setOpenSubjects] = useState(true);
  const [openYears, setOpenYears] = useState(true);

  // Sample filter data
  const boards = [
    { id: "punjab", label: "Punjab" },
    { id: "lahore", label: "Lahore" },
    { id: "gujranwala", label: "Gujranwala" },
    { id: "sindh", label: "Sindh" },
    { id: "kpk", label: "KPK" },
    { id: "federal", label: "Federal" },
    { id: "ajk", label: "AJK" },
    { id: "balochistan", label: "Balochistan" },
  ];

  const classes = [
    { id: "9", label: "9th Class" },
    { id: "10", label: "10th Class" },
    { id: "11", label: "11th Class" },
    { id: "12", label: "12th Class" },
  ];

  const subjects = [
    { id: "mathematics", label: "Mathematics" },
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "biology", label: "Biology" },
    { id: "english", label: "English" },
    { id: "urdu", label: "Urdu" },
    { id: "islamiat", label: "Islamiat" },
    { id: "pak-studies", label: "Pakistan Studies" },
    { id: "computer", label: "Computer Science" },
  ];

  const years = [
    { id: "2023", label: "2023" },
    { id: "2022", label: "2022" },
    { id: "2021", label: "2021" },
    { id: "2020", label: "2020" },
    { id: "2019", label: "2019" },
  ];

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(type) === value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    // Reset to first page when changing filters
    params.delete("page");

    router.push(`/papers?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    // This is handled automatically by the individual filter changes
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Collapsible open={openBoards} onOpenChange={setOpenBoards}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium">
            Education Boards
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 pt-0">
            <div className="space-y-2">
              {boards.map((board) => (
                <div key={board.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={board.id}
                    checked={selectedBoard === board.id}
                    onCheckedChange={() =>
                      handleFilterChange("board", board.id)
                    }
                  />
                  <Label htmlFor={board.id} className="text-sm font-normal">
                    {board.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openClasses} onOpenChange={setOpenClasses}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium border-t">
            Classes
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 pt-0">
            <div className="space-y-2">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cls.id}
                    checked={selectedClass === cls.id}
                    onCheckedChange={() => handleFilterChange("class", cls.id)}
                  />
                  <Label htmlFor={cls.id} className="text-sm font-normal">
                    {cls.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSubjects} onOpenChange={setOpenSubjects}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium border-t">
            Subjects
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 pt-0">
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    checked={selectedSubject === subject.id}
                    onCheckedChange={() =>
                      handleFilterChange("subject", subject.id)
                    }
                  />
                  <Label htmlFor={subject.id} className="text-sm font-normal">
                    {subject.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openYears} onOpenChange={setOpenYears}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium border-t">
            Years
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4 pt-0">
            <div className="space-y-2">
              {years.map((year) => (
                <div key={year.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={year.id}
                    checked={selectedYear === year.id}
                    onCheckedChange={() => handleFilterChange("year", year.id)}
                  />
                  <Label htmlFor={year.id} className="text-sm font-normal">
                    {year.label}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="p-4 border-t">
          <Button className="w-full" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
