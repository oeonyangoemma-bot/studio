import { getAnalysisResult } from "@/app/actions";
import { AnalysisReport } from "@/components/dashboard/analysis-report";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AnalysisReportPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysisResult(params.id);

  if (!analysis) {
    notFound();
  }
  
  return (
    <div>
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
        <AnalysisReport analysis={analysis} />
    </div>
  );
}
