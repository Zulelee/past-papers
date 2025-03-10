import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMcqSets } from "@/app/actions/mcq-actions"
import AdminMcqSetsList from "@/components/admin/admin-mcq-sets-list"

export default async function AdminDashboard() {
  // Fetch MCQ sets for the dashboard
  const mcqSets = await getMcqSets({ limit: 10 })

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage MCQs for the Pakistani Board Exams platform.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/mcq-sets/new">
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Add MCQ Set
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manage MCQ Sets</CardTitle>
              <Link href="/admin/mcq-sets/new">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add MCQ Set
                </Button>
              </Link>
            </div>
            <CardDescription>Create, edit, and manage MCQ sets for student practice.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminMcqSetsList mcqSets={mcqSets} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

