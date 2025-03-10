"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Download, Loader2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { incrementDownloads } from "@/app/actions/paper-actions"

export function PaperViewer({ paperUrl, paperId }: { paperUrl: string; paperId: string }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Reset state when paper changes
    setCurrentPage(1)
    setLoading(true)

    // In a real implementation, you would use a PDF.js library to get total pages
    // This is a simplified version
    const timer = setTimeout(() => {
      setTotalPages(Math.floor(Math.random() * 10) + 5) // Random number of pages for demo
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [paperUrl])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setLoading(true)
      // Simulate page loading
      setTimeout(() => setLoading(false), 500)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setLoading(true)
      // Simulate page loading
      setTimeout(() => setLoading(false), 500)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25)
    }
  }

  const handleDownload = async () => {
    // Track download
    await incrementDownloads(paperId)

    // Open the PDF in a new tab for download
    window.open(paperUrl, "_blank")

    console.log("Download started")
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center p-2 border-b bg-muted/50">
        <div className="flex items-center gap-1 mb-2 sm:mb-0">
          <Button variant="ghost" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 2}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Paper content */}
      <div className="flex justify-center p-2 sm:p-4 min-h-[70vh] bg-muted/30 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center w-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Loading page...</p>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
            }}
            className="bg-white shadow-md p-4 sm:p-8 w-full max-w-[800px]"
          >
            {/* This would be the actual PDF content in a real app */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-bold">BOARD OF INTERMEDIATE & SECONDARY EDUCATION</h2>
                <h3 className="text-sm sm:text-md font-semibold mt-2">MATHEMATICS - CLASS X</h3>
                <p className="mt-1 text-sm">ANNUAL EXAMINATION 2023</p>
                <p className="mt-1 text-sm">TIME ALLOWED: 3 HOURS</p>
                <p className="mt-1 text-sm">MAXIMUM MARKS: 100</p>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base">SECTION I - MCQs (20 MARKS)</h3>
                <p className="mt-2 text-sm">1. If x² + y² = 25 and xy = 12, then the value of (x + y)² is:</p>
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  <p>a) 25</p>
                  <p>b) 49</p>
                  <p>c) 36</p>
                  <p>d) 64</p>
                </div>

                <p className="mt-4 text-sm">2. The value of sin 30° + cos 60° is:</p>
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  <p>a) 0</p>
                  <p>b) 1</p>
                  <p>c) 2</p>
                  <p>d) 1.5</p>
                </div>

                <p className="mt-4 text-sm">3. If a line has slope m = 2, then its angle of inclination is:</p>
                <div className="ml-6 mt-1 space-y-1 text-sm">
                  <p>a) 30°</p>
                  <p>b) 45°</p>
                  <p>c) 60°</p>
                  <p>d) 63.4°</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base">SECTION II - SHORT QUESTIONS (40 MARKS)</h3>
                <p className="mt-2 text-sm">
                  Attempt any 8 questions from this section. All questions carry equal marks.
                </p>
                <p className="mt-4 text-sm">1. Solve the quadratic equation: 2x² - 5x + 3 = 0</p>
                <p className="mt-4 text-sm">2. Find the distance between the points (3, 4) and (-1, 7).</p>
                <p className="mt-4 text-sm">
                  3. If A = {"{1, 2, 3}"} and B = {"{2, 3, 4, 5}"}, find A ∪ B and A ∩ B.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

