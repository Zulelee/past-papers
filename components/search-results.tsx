import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getMcqSets } from "@/app/actions/mcq-actions";

export async function SearchResults({ query }: { query: string }) {
  const mcqSets = await getMcqSets({ search: query, limit: 20 });

  if (mcqSets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No MCQ sets found matching &quot;{query}&quot;.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try using different keywords or browse MCQs by category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {mcqSets.map((set) => (
        <Link key={set.id} href={`/mcq-practice/${set.id}`}>
          <Card className="transition-all hover:bg-muted/50">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <h3 className="font-medium">{set.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                  <span>{set.board}</span>
                  <span>•</span>
                  <span>{set.subject}</span>
                  <span>•</span>
                  <span>{set.year}</span>
                  <span>•</span>
                  <span>
                    {typeof set.mcq_count === "object"
                      ? set.mcq_count.count
                      : set.mcq_count || 0}{" "}
                    MCQs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
