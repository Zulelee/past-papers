"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { deleteMcqSet } from "@/app/actions/mcq-actions"

export function AdminMcqSetsList({ mcqSets = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  const router = useRouter()

  // Filter mcqSets based on search term and board filter
  const filteredMcqSets = mcqSets.filter((set) => {
    const matchesSearch =
      set.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBoard = boardFilter === "all" || set.board === boardFilter
    return matchesSearch && matchesBoard
  })

  const handleDeleteMcqSet = async (id) => {
    if (confirm("Are you sure you want to delete this MCQ set? This action cannot be undone.")) {
      const result = await deleteMcqSet(id)

      if (result.success) {
        console.log("MCQ set deleted successfully")
        router.refresh()
      } else {
        console.log("Error deleting MCQ set:", result.error || "Failed to delete MCQ set")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search MCQ sets..."
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
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Year</TableHead>
              <TableHead className="hidden md:table-cell">MCQs</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMcqSets.length > 0 ? (
              filteredMcqSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{set.title}</div>
                    <div className="md:hidden text-xs text-muted-foreground mt-1">
                      {set.board} • {set.subject} • {set.year}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{set.board}</TableCell>
                  <TableCell className="hidden md:table-cell">{set.subject}</TableCell>
                  <TableCell className="hidden md:table-cell">{set.year}</TableCell>
                  <TableCell className="hidden md:table-cell">{set.mcq_count}</TableCell>
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
                          <Link href={`/admin/mcq-sets/${set.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMcqSet(set.id)}>
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
                <TableCell colSpan={7} className="h-24 text-center">
                  No MCQ sets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

