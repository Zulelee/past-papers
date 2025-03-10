"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Remove this line: import { useToast } from "@/hooks/use-toast"
import { deletePaper } from "@/app/actions/paper-actions"
import { useRouter } from "next/navigation"

export function AdminPapersList({ papers = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  // Replace: const { toast } = useToast()
  // With: // const router = useRouter()
  const router = useRouter()

  // Filter papers based on search term and board filter
  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBoard = boardFilter === "all" || paper.board?.name === boardFilter
    return matchesSearch && matchesBoard
  })

  const handleDeletePaper = async (id: string) => {
    if (confirm("Are you sure you want to delete this paper? This action cannot be undone.")) {
      const result = await deletePaper(id)

      if (result.success) {
        // Replace:
        //   toast({
        //     title: "Paper deleted",
        //     description: "The paper has been deleted successfully",
        //   })
        // With:
        //   console.log("Paper deleted successfully")
        console.log("Paper deleted successfully")
        router.refresh()
      } else {
        // Replace:
        //   toast({
        //     title: "Error",
        //     description: result.error || "Failed to delete paper",
        //     variant: "destructive",
        //   })
        // With:
        //   console.log("Error deleting paper:", result.error || "Failed to delete paper")
        console.log("Error deleting paper:", result.error || "Failed to delete paper")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search papers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={boardFilter} onValueChange={setBoardFilter}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filter by board" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Boards</SelectItem>
            <SelectItem value="Punjab">Punjab</SelectItem>
            <SelectItem value="Lahore">Lahore</SelectItem>
            <SelectItem value="Gujranwala">Gujranwala</SelectItem>
            <SelectItem value="Sindh">Sindh</SelectItem>
            <SelectItem value="KPK">KPK</SelectItem>
            <SelectItem value="Federal">Federal</SelectItem>
            <SelectItem value="AJK">AJK</SelectItem>
            <SelectItem value="Balochistan">Balochistan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Board</TableHead>
              <TableHead className="hidden md:table-cell">Class</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Year</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPapers.length > 0 ? (
              filteredPapers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{paper.title}</div>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">
                      {paper.board?.name} • {paper.class?.name} • {paper.subject?.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{paper.board?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{paper.class?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{paper.subject?.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{paper.year}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        paper.status === "Published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {paper.status}
                    </div>
                  </TableCell>
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
                          <Link href={`/admin/papers/${paper.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={() => handleDeletePaper(paper.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No papers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

