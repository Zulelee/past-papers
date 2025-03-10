"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { createMcq } from "@/app/actions/mcq-actions"

export default function NewMcqPage({ params }: { params: { id: string } }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("0")
  const router = useRouter()

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)

    // Adjust correct answer if needed
    if (Number.parseInt(correctAnswer) >= newOptions.length) {
      setCorrectAnswer((newOptions.length - 1).toString())
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!question.trim()) {
      alert("Please enter a question")
      return
    }

    if (options.some((option) => !option.trim())) {
      alert("Please fill in all options")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("mcq_set_id", params.id)
      formData.append("question", question)
      formData.append("options", JSON.stringify(options))
      formData.append("correct_answer", correctAnswer)

      const result = await createMcq(formData)

      if (result.success) {
        console.log("MCQ created successfully")
        router.push(`/admin/mcq-sets/${params.id}`)
        router.refresh()
      } else {
        console.log("Error creating MCQ:", result.error || "Failed to create MCQ")
      }
    } catch (error) {
      console.log("Error creating MCQ:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/mcq-sets/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to MCQ Set
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Add New MCQ</h1>
          <p className="text-muted-foreground">Create a new multiple-choice question for this set.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>MCQ Details</CardTitle>
              <CardDescription>Enter the question, options, and mark the correct answer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter the question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Options</Label>
                  <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 space-y-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <div className="flex-1">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                          />
                        </div>
                        {options.length > 2 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </RadioGroup>

                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/admin/mcq-sets/${params.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>Create MCQ</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

