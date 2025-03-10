"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
// Remove this line: import { useToast } from "@/hooks/use-toast"

export function AdminHeader() {
  const router = useRouter()
  // Replace: const { toast } = useToast()
  // With: // const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      })

      // Replace:
      //   toast({
      //     title: "Logged out",
      //     description: "You have been logged out successfully",
      //   })
      // With:
      console.log("Logged out successfully")

      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.log("Logout error")
    }
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-xl">
            Admin Dashboard
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/papers"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Papers
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

