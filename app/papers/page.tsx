import Link from "next/link"
import { ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaperFilters } from "@/components/paper-filters"
import { getPapers } from "@/app/actions/paper-actions"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default async function PapersPage({
  searchParams,
}: {
  searchParams: {
    board?: string
    class?: string
    subject?: string
    year?: string
    tab?: string
  }
}) {
  const { board, class: classLevel, subject, year, tab = "recent" } = searchParams

  // Fetch papers based on filters
  const papers = await getPapers({
    board,
    class: classLevel,
    subject,
    year: year ? Number.parseInt(year) : undefined,
    limit: 20,
  })

  // Get unique subjects from papers
  const subjects = Array.from(new Set(papers.map((paper) => paper.subject?.name).filter(Boolean))).map((name) => ({
    name,
    papers: papers.filter((p) => p.subject?.name === name).length,
  }))

  return (
    <div className="container py-4 sm:py-8">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Past Papers</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Browse and download past papers from all Pakistani education boards.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Filters sidebar - hidden on mobile, shown in sheet */}
          <div className="hidden md:block md:w-1/4">
            <PaperFilters
              selectedBoard={board}
              selectedClass={classLevel}
              selectedSubject={subject}
              selectedYear={year}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue={tab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="overflow-x-auto">
                  <TabsTrigger value="recent">Recent Papers</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="subjects">By Subject</TabsTrigger>
                </TabsList>

                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 md:hidden">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filters</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                    <div className="py-4">
                      <PaperFilters
                        selectedBoard={board}
                        selectedClass={classLevel}
                        selectedSubject={subject}
                        selectedYear={year}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <TabsContent value="recent" className="mt-4 sm:mt-6">
                <div className="grid gap-4">
                  {papers.length > 0 ? (
                    papers.map((paper) => (
                      <Link key={paper.id} href={`/papers/${paper.id}`}>
                        <Card className="transition-all hover:bg-muted/50">
                          <CardHeader className="p-3 sm:p-4">
                            <CardTitle className="text-sm sm:text-base">{paper.title}</CardTitle>
                          </CardHeader>
                          <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between text-xs sm:text-sm text-muted-foreground">
                            <div>{paper.board?.name} Board</div>
                            <div>{paper.downloads} downloads</div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <p>No papers found matching your filters.</p>
                      <p className="mt-2">Try adjusting your filter criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="mt-4 sm:mt-6">
                <div className="grid gap-4">
                  {papers.length > 0 ? (
                    [...papers]
                      .sort((a, b) => b.downloads - a.downloads)
                      .map((paper) => (
                        <Link key={paper.id} href={`/papers/${paper.id}`}>
                          <Card className="transition-all hover:bg-muted/50">
                            <CardHeader className="p-3 sm:p-4">
                              <CardTitle className="text-sm sm:text-base">{paper.title}</CardTitle>
                            </CardHeader>
                            <CardFooter className="p-3 sm:p-4 pt-0 flex justify-between text-xs sm:text-sm text-muted-foreground">
                              <div>{paper.board?.name} Board</div>
                              <div>{paper.downloads} downloads</div>
                            </CardFooter>
                          </Card>
                        </Link>
                      ))
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <p>No papers found matching your filters.</p>
                      <p className="mt-2">Try adjusting your filter criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="subjects" className="mt-4 sm:mt-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <Link key={subject.name} href={`/papers?subject=${encodeURIComponent(subject.name)}`}>
                        <Card className="h-full transition-all hover:bg-muted/50">
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-sm sm:text-base">{subject.name}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subject.papers} papers</p>
                              </div>
                              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground col-span-full">
                      <p>No subjects found matching your filters.</p>
                      <p className="mt-2">Try adjusting your filter criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

