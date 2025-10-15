import { AnalysisForm } from "@/components/dashboard/analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthProvider } from "@/components/auth-provider";

export default function NewAnalysisPage() {
  return (
    <div className="max-w-3xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">New Crop Analysis</CardTitle>
                <CardDescription>Upload an image of a crop to detect diseases, pests, or soil dryness. You can also upload a single frame from a video.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuthProvider>
                <AnalysisForm />
              </AuthProvider>
            </CardContent>
        </Card>
    </div>
  );
}
