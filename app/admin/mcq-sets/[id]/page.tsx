import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMcqSetById, getMcqsBySetId } from "@/app/actions/mcq-actions"
import { AdminMcqsList } from "@/components/admin-mcqs-list"
import { notFound } from "next/navigation"

export default async function AdminMcqSetPage({ params }: { params: { id: string } }) {
  const mcqSet = await getMcqSetById(params.id)

  if (!mcqSet) {
    notFound()
  }

  const mcqs = await getMcqsBySetId(params.id)

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Manage MCQs</h1>
          <p className="text-muted-foreground">Add and manage MCQs for {mcqSet.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Set Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Board</dt>
                  <dd>{mcqSet.board}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Class</dt>
                  <dd>{mcqSet.class ? `${mcqSet.class}th Class` : "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Subject</dt>
                  <dd>{mcqSet.subject}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                  <dd>{mcqSet.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">MCQs</dt>
                  <dd>{mcqs.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>MCQs</CardTitle>
                <Link href={`/admin/mcq-sets/${mcqSet.id}/mcqs/new`}>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add MCQ
                  </Button>
                </Link>
              </div>
              <CardDescription>Create and manage multiple-choice questions for this set.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMcqsList mcqs={mcqs} mcqSetId={mcqSet.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

