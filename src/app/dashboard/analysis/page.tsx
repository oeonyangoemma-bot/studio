import { AnalysisForm } from "@/components/dashboard/analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function NewAnalysisPage() {
  return (
    <div className="max-w-3xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">New Crop Analysis</CardTitle>
                <CardDescription>Upload an image of a crop to detect diseases, pests, or soil dryness. You can also upload a single frame from a video.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <AnalysisForm />
              </Suspense>
            </CardContent>
        </Card>
    </div>
  );
}
