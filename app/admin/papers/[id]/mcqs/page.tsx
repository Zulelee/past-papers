import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPaperById } from "@/app/actions/paper-actions";
import { getMcqsBySetId } from "@/app/actions/mcq-actions";
import { AdminMcqsList } from "@/components/admin-mcqs-list";
import { notFound } from "next/navigation";

export default async function AdminPaperMcqsPage({
  params,
}: {
  params: { id: string };
}) {
  const paper = await getPaperById(params.id);

  if (!paper) {
    notFound();
  }

  const mcqs = await getMcqsBySetId(params.id);

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
          <p className="text-muted-foreground">
            Add and manage MCQs for {paper.title}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>MCQs</CardTitle>
              <Link href={`/admin/papers/${paper.id}/mcqs/new`}>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add MCQ
                </Button>
              </Link>
            </div>
            <CardDescription>
              Create and manage multiple-choice questions for this paper.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminMcqsList mcqs={mcqs} mcqSetId={paper.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
