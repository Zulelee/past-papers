"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Remove the useToast import
// import { useToast } from "@/hooks/use-toast"
import { createPaper } from "@/app/actions/paper-actions"

export default function NewPaperPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    board: "",
    class: "",
    subject: "",
    year: "",
    session: "",
    status: "Published",
  })
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()
  // Remove the toast destructuring
  // const { toast } = useToast()
  // const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      // Replace the toast notifications with console.log or alert
      // toast({
      //   title: "Error",
      //   description: "Please upload a PDF file",
      //   variant: "destructive",
      // })
      alert("Please upload a PDF file")
      return
    }

    setIsUploading(true)

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("board", formData.board)
      data.append("class", formData.class)
      data.append("subject", formData.subject)
      data.append("year", formData.year)
      data.append("session", formData.session)
      data.append("status", formData.status)
      data.append("file", file)

      const result = await createPaper(data)

      if (result.success) {
        // Replace the toast notifications with console.log or alert
        // toast({
        //   title: "Paper uploaded",
        //   description: "The paper has been uploaded successfully",
        // })
        console.log("Paper uploaded successfully")
        router.push("/admin")
        router.refresh()
      } else {
        // Replace the toast notifications with console.log or alert
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to upload paper",
        //   variant: "destructive",
        // })
        console.log("Error uploading paper:", result.error || "Failed to upload paper")
      }
    } catch (error) {
      // Replace the toast notifications with console.log or alert
      // toast({
      //   title: "Error",
      //   description: "An error occurred while uploading the paper",
      //   variant: "destructive",
      // })
      console.log("Error uploading paper:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Upload New Paper</h1>
          <p className="text-muted-foreground">Add a new past paper to the platform with all relevant metadata.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Paper Details</CardTitle>
              <CardDescription>Enter the details of the past paper you want to upload.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Mathematics 10th Class Annual 2023"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="board">Education Board</Label>
                    <Select
                      value={formData.board}
                      onValueChange={(value) => setFormData({ ...formData, board: value })}
                      required
                    >
                      <SelectTrigger id="board">
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="lahore">Lahore</SelectItem>
                        <SelectItem value="gujranwala">Gujranwala</SelectItem>
                        <SelectItem value="sindh">Sindh</SelectItem>
                        <SelectItem value="kpk">KPK</SelectItem>
                        <SelectItem value="federal">Federal</SelectItem>
                        <SelectItem value="ajk">AJK</SelectItem>
                        <SelectItem value="balochistan">Balochistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="class">Class</Label>
                    <Select
                      value={formData.class}
                      onValueChange={(value) => setFormData({ ...formData, class: value })}
                      required
                    >
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9">9th Class</SelectItem>
                        <SelectItem value="10">10th Class</SelectItem>
                        <SelectItem value="11">11th Class</SelectItem>
                        <SelectItem value="12">12th Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      required
                    >
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="urdu">Urdu</SelectItem>
                        <SelectItem value="islamiat">Islamiat</SelectItem>
                        <SelectItem value="pak-studies">Pakistan Studies</SelectItem>
                        <SelectItem value="computer">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                      required
                    >
                      <SelectTrigger id="year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="session">Session</Label>
                    <Select
                      value={formData.session}
                      onValueChange={(value) => setFormData({ ...formData, session: value })}
                      required
                    >
                      <SelectTrigger id="session">
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Supplementary">Supplementary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      required
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pdf">Upload PDF</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="pdf-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                          <>
                            <div className="text-sm font-medium mb-2">{file.name}</div>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        id="pdf-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>Upload Paper</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

