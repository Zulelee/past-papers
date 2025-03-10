import type React from "react"

interface SearchResult {
  id: string
  title: string
  description: string
  mcq_count?: number | { count: number }
  // Add other properties as needed
}

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!results || results.length === 0) {
    return <div>No results found.</div>
  }

  return (
    <div>
      {results.map((set) => (
        <div key={set.id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
          <h3>{set.title}</h3>
          <p>{set.description}</p>
          <span>{typeof set.mcq_count === "object" ? set.mcq_count.count : set.mcq_count || 0} MCQs</span>
        </div>
      ))}
    </div>
  )
}

export default SearchResults

