import Link from "next/link"
import { ArrowLeft, Download, FileText, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaperViewer } from "@/components/paper-viewer"
import { RelatedPapers } from "@/components/related-papers"
import { getPaperById } from "@/app/actions/paper-actions"
import { notFound } from "next/navigation"

export default async function PaperPage({ params }: { params: { id: string } }) {
  const paper = await getPaperById(params.id)

  if (!paper) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/papers">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Papers
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{paper.title}</h1>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div>{paper.board.name} Board</div>
            <div>•</div>
            <div>{paper.class.name} Class</div>
            <div>•</div>
            <div>{paper.subject.name}</div>
            <div>•</div>
            <div>
              {paper.session} {paper.year}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="paper">
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="paper" className="flex-1">
                      Paper
                    </TabsTrigger>
                    <TabsTrigger value="mcqs" className="flex-1">
                      MCQs
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="paper" className="p-0">
                    <div className="flex justify-between items-center p-4 border-b">
                      <div className="text-sm text-muted-foreground">
                        Uploaded on {new Date(paper.created_at).toLocaleDateString()} • {paper.downloads} downloads
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`https://api.whatsapp.com/send?text=Check out this past paper: ${encodeURIComponent(paper.title)} ${encodeURIComponent(window.location.href)}`}
                            target="_blank"
                          >
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={paper.file_url} target="_blank">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <PaperViewer paperUrl={paper.file_url} paperId={paper.id} />
                  </TabsContent>
                  <TabsContent value="mcqs" className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Practice MCQs from this paper</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Test your knowledge with interactive MCQ practice based on this paper.
                      </p>
                      <Link href={`/mcq-practice?paper=${paper.id}`}>
                        <Button>Start MCQ Practice</Button>
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <RelatedPapers
              paperId={paper.id}
              boardId={paper.board_id}
              subjectId={paper.subject_id}
              classId={paper.class_id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

