
import Link from "next/link";
import { Button } from "../ui/button";

export function PastAnalyses() {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
            <h3 className="text-xl font-semibold">No Saved Analyses</h3>
            <p className="text-muted-foreground mt-2">Analyses are not saved in this public version. Create an account to save and review your history.</p>
            <Button asChild className="mt-4">
                <Link href="/dashboard/analysis">Start New Analysis</Link>
            </Button>
        </div>
    )
}
