'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

const demoAnalyses: AnalysisResult[] = [
    {
        id: 'demo-1',
        userId: 'anonymous-user',
        imageUrl: 'https://picsum.photos/seed/corn-rust/600/400',
        analysisResult: 'Common Rust Detected on Corn',
        confidenceLevel: 0.92,
        suggestedActions: 'Apply a recommended fungicide. Consider crop rotation for next season. Monitor nearby plants for spread.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        additionalDetails: 'Leaves showing small, cinnamon-brown pustules.'
    },
    {
        id: 'demo-2',
        userId: 'anonymous-user',
        imageUrl: 'https://picsum.photos/seed/tomato-blight/600/400',
        analysisResult: 'Early Blight on Tomato Plant',
        confidenceLevel: 0.88,
        suggestedActions: 'Prune affected lower leaves. Ensure proper spacing for air circulation. Use a copper-based fungicide if severe.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
        id: 'demo-3',
        userId: 'anonymous-user',
        imageUrl: 'https://picsum.photos/seed/healthy-wheat/600/400',
        analysisResult: 'Healthy Wheat Crop',
        confidenceLevel: 0.98,
        suggestedActions: 'Maintain current irrigation and nutrient schedule. Continue to monitor for pests weekly.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        additionalDetails: 'Crop appears vibrant and green. No visible signs of stress.'
    },
    {
        id: 'demo-4',
        userId: 'anonymous-user',
        imageUrl: 'https://picsum.photos/seed/aphids-lettuce/600/400',
        analysisResult: 'Aphid Infestation on Lettuce',
        confidenceLevel: 0.95,
        suggestedActions: 'Introduce beneficial insects like ladybugs. Apply insecticidal soap or neem oil. Spray with a strong stream of water.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    }
];


export function PastAnalyses() {
    const analyses = demoAnalyses;

    if (analyses.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">No Analyses Yet</h3>
                <p className="text-muted-foreground mt-2">Get started by uploading your first crop image.</p>
                <Button asChild className="mt-4">
                    <Link href="/dashboard/analysis">Start New Analysis</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {analyses.map(analysis => (
                <Link key={analysis.id} href={`/dashboard/analysis/${analysis.id}`} passHref>
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                        <div className="relative aspect-video">
                            <Image 
                                src={analysis.imageUrl} 
                                alt={analysis.analysisResult}
                                fill 
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                             />
                        </div>
                        <CardHeader className="flex-1">
                            <CardTitle className="text-lg truncate">{analysis.analysisResult}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                            </p>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
