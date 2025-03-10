"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getMcqSets } from "@/app/actions/mcq-actions"

export default function SubjectPracticePage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [mcqSets, setMcqSets] = useState([])
  const [subject, setSubject] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        // Convert ID format (e.g., "mathematics") to display format (e.g., "Mathematics")
        const subjectName = params.id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        setSubject(subjectName)

        // Fetch MCQ sets for this subject
        const sets = await getMcqSets({ subject: subjectName, limit: 100 })
        setMcqSets(sets)
      } catch (error) {
        console.log("Error loading subject MCQ sets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading subject MCQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mcq-practice">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Practice
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{subject} MCQs</h1>
          <p className="text-muted-foreground">Practice {subject} MCQs from various boards and years.</p>
        </div>

        <div className="grid gap-4">
          {mcqSets.length > 0 ? (
            mcqSets.map((set) => (
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
                              {typeof set.mcq_count === "object" ? set.mcq_count.count : set.mcq_count || 0} MCQs
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
            <Card className="text-center py-12">
              <CardContent>
                <h2 className="text-xl font-semibold mb-4">No MCQ Sets Available</h2>
                <p className="text-muted-foreground mb-6">There are no MCQ sets available for {subject} yet.</p>
                <Button asChild>
                  <Link href="/mcq-practice">Return to Practice Menu</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

