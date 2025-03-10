"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteMcq } from "@/app/actions/mcq-actions";

export function AdminMcqsList({ mcqs = [], mcqSetId }) {
  const router = useRouter();

  const handleDeleteMcq = async (id) => {
    if (
      confirm(
        "Are you sure you want to delete this MCQ? This action cannot be undone."
      )
    ) {
      const result = await deleteMcq(id);

      if (result.success) {
        console.log("MCQ deleted successfully");
        router.refresh();
      } else {
        console.log(
          "Error deleting MCQ:",
          result.error || "Failed to delete MCQ"
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      {mcqs.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="w-[100px]">Options</TableHead>
                <TableHead className="w-[100px]">Correct Answer</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mcqs.map((mcq) => (
                <TableRow key={mcq.id}>
                  <TableCell className="font-medium">{mcq.question}</TableCell>
                  <TableCell>{mcq.options.length}</TableCell>
                  <TableCell>{Number(mcq.correct_answer) + 1}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/mcq-sets/${mcqSetId}/mcqs/${mcq.id}/edit`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteMcq(mcq.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No MCQs found for this set.</p>
          <p className="mt-2">
            Click &quot;Add MCQ&quot; to create your first question.
          </p>
        </div>
      )}
    </div>
  );
}
