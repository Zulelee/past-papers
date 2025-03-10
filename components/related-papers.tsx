import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPapers } from "@/app/actions/paper-actions"

export async function RelatedPapers({
  paperId,
  boardId,
  subjectId,
  classId,
}: {
  paperId: string
  boardId: string
  subjectId: string
  classId: string
}) {
  // Fetch related papers based on the same board, subject, and class
  const papers = await getPapers({ limit: 5 })

  // Filter out the current paper and papers that match the criteria
  const relatedPapers = papers
    .filter(
      (paper) =>
        paper.id !== paperId &&
        (paper.board_id === boardId || paper.subject_id === subjectId || paper.class_id === classId),
    )
    .slice(0, 4)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Related Papers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {relatedPapers.length > 0 ? (
          <div className="divide-y">
            {relatedPapers.map((paper) => (
              <Link key={paper.id} href={`/papers/${paper.id}`}>
                <div className="p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-medium text-sm">{paper.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{paper.board.name} Board</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No related papers found.</div>
        )}
      </CardContent>
    </Card>
  )
}

