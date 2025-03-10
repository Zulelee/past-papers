import { Suspense } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchResults } from "@/components/search-results";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Search MCQs</h1>
          <p className="text-muted-foreground">
            Search for MCQs by title, board, subject, or year.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search MCQs..."
                defaultValue={query}
                className="pl-10"
              />
            </form>
          </CardContent>
        </Card>

        {query && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Search results for &quot;{query}&quot;
            </h2>
            <Suspense fallback={<div>Loading results...</div>}>
              <SearchResults query={query} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
