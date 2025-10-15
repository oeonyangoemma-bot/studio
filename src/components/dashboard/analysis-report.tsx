import { AnalysisResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Bug, Droplets, Leaf, Lightbulb, CheckCircle } from "lucide-react";
import Markdown from "react-markdown";

function getAnalysisIcon(result: string) {
    const lowerCaseResult = result.toLowerCase();
    if (lowerCaseResult.includes("pest") || lowerCaseResult.includes("insect") || lowerCaseResult.includes("bug")) {
        return <Bug className="w-6 h-6 text-primary" />;
    }
    if (lowerCaseResult.includes("disease") || lowerCaseResult.includes("blight") || lowerCaseResult.includes("fungus")) {
        return <Leaf className="w-6 h-6 text-primary" />;
    }
    if (lowerCaseResult.includes("dry") || lowerCaseResult.includes("water") || lowerCaseResult.includes("irrigation")) {
        return <Droplets className="w-6 h-6 text-primary" />;
    }
    if (lowerCaseResult.includes("healthy")) {
        return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Lightbulb className="w-6 h-6 text-primary" />;
}

export function AnalysisReport({ analysis }: { analysis: AnalysisResult }) {
    const confidencePercent = Math.round(analysis.confidenceLevel * 100);

    return (
        <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-square">
                    <Image 
                        src={analysis.imageUrl} 
                        alt="Analyzed crop" 
                        fill 
                        className="object-cover"
                    />
                </div>
                <div className="p-6 flex flex-col">
                    <CardHeader className="p-0 mb-4">
                        <div className="flex items-start gap-4">
                            <div>{getAnalysisIcon(analysis.analysisResult)}</div>
                            <div>
                                <CardTitle className="text-2xl font-headline mb-1">{analysis.analysisResult}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Analyzed on {format(new Date(analysis.createdAt), "PPP")}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <div className="space-y-6 flex-1">
                        <div>
                            <h3 className="font-semibold mb-2">Confidence Level</h3>
                            <div className="flex items-center gap-4">
                                <Progress value={confidencePercent} className="w-full" />
                                <span className="font-bold text-lg text-primary">{confidencePercent}%</span>
                            </div>
                        </div>

                        {analysis.additionalDetails && (
                            <div>
                                <h3 className="font-semibold mb-2">Your Notes</h3>
                                <p className="text-sm text-muted-foreground p-3 bg-secondary/50 rounded-md italic">
                                    "{analysis.additionalDetails}"
                                </p>
                            </div>
                        )}
                        
                        <div>
                             <h3 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb /> Suggested Actions</h3>
                             <div className="prose prose-sm max-w-none text-foreground bg-secondary/50 p-4 rounded-md">
                                <Markdown>{analysis.suggestedActions}</Markdown>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
