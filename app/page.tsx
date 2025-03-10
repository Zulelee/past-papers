import Link from "next/link"
import { BookOpen, GraduationCap, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  // Update the boards array to include Lahore and Gujranwala
  const boards = [
    { name: "Punjab", mcqs: 1240, icon: "🏛️" },
    { name: "Lahore", mcqs: 980, icon: "🏛️" },
    { name: "Gujranwala", mcqs: 860, icon: "🏛️" },
    { name: "Sindh", mcqs: 750, icon: "🏛️" },
    { name: "KPK", mcqs: 680, icon: "🏛️" },
    { name: "Federal", mcqs: 580, icon: "🏛️" },
    { name: "AJK", mcqs: 520, icon: "🏛️" },
    { name: "Balochistan", mcqs: 480, icon: "🏛️" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-green-700">
                  Pakistan Board Exams MCQ Practice
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Practice thousands of MCQs from all Pakistani education boards. Master concepts with our interactive
                  flashcard system and ace your exams.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/mcq-practice"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Start Practice
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium">5000+ MCQs</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                      <GraduationCap className="h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium">All Boards</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                      <BookOpen className="h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium">All Subjects</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                      <Users className="h-8 w-8 text-green-600" />
                      <p className="mt-2 text-sm font-medium">10k+ Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 border-t">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Find MCQs</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Search by board, class, subject, or year to find the exact MCQs you need.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search MCQs..." className="w-full bg-background pl-8 shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boards Section */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Browse by Board</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Select your education board to find relevant MCQs.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
              {boards.map((board) => (
                <Link key={board.name} href={`/mcq-practice?board=${board.name.toLowerCase()}`}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">
                        {board.icon} {board.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <CardDescription>{board.mcqs} MCQs</CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        Practice MCQs
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything you need to excel in your exams
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Our platform provides comprehensive MCQ practice tools to help you prepare effectively for your board
                exams.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flashcard Practice</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Interactive flashcard-style practice with MCQs from past papers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Track your performance and identify areas for improvement.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">All Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Practice MCQs from all subjects in the Pakistani board curriculum.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Offline Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Download MCQs for offline study in low-bandwidth environments.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to start preparing?</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Begin practicing with our MCQ flashcards to improve your exam performance.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/mcq-practice"
                className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Start Practice
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 Pakistan Board Exams MCQ Practice. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

