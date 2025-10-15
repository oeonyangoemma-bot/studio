import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { PastAnalyses } from "@/components/dashboard/past-analyses";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your recent crop analyses.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/analysis">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Analysis
          </Link>
        </Button>
      </div>
      
      <Suspense fallback={<PastAnalysesSkeleton />}>
        <PastAnalyses />
      </Suspense>
    </div>
  );
}

function PastAnalysesSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}
