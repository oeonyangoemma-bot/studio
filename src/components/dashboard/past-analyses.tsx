

'use client';

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const demoAnalyses: AnalysisResult[] = [
    {
        id: 'demo-1',
        userId: 'anonymous-user',
        imageUrl: PlaceHolderImages.find(p => p.id === 'feature-analysis')?.imageUrl || 'https://picsum.photos/seed/demo1/600/400',
        analysisResult: 'Maize Streak Virus Detected',
        confidenceLevel: 0.92,
        suggestedActions: 'Control leafhopper vectors. Remove and destroy infected plants. Plant resistant varieties in the next season.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        additionalDetails: 'Corn (maize) leaves showing characteristic streaking.'
    },
    {
        id: 'demo-2',
        userId: 'anonymous-user',
        imageUrl: PlaceHolderImages.find(p => p.id === 'analysis-placeholder')?.imageUrl || 'https://picsum.photos/seed/demo2/600/400',
        analysisResult: 'Black Sigatoka on Banana Plant',
        confidenceLevel: 0.88,
        suggestedActions: 'Prune affected leaves to reduce inoculum. Apply appropriate systemic fungicides. Ensure good drainage.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
        id: 'demo-3',
        userId: 'anonymous-user',
        imageUrl: PlaceHolderImages.find(p => p.id === 'feature-dashboard')?.imageUrl || 'https://picsum.photos/seed/demo3/600/400',
        analysisResult: 'Healthy Cassava Crop',
        confidenceLevel: 0.98,
        suggestedActions: 'Maintain current weeding and pest management schedule. Monitor for signs of mosaic virus.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        additionalDetails: 'Crop appears vigorous. No visible signs of leaf discoloration.'
    },
    {
        id: 'demo-4',
        userId: 'anonymous-user',
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-7c1808d54afd?q=80&w=600&auto=format&fit=crop',
        analysisResult: 'Coffee Leaf Rust Detected',
        confidenceLevel: 0.95,
        suggestedActions: 'Apply copper-based fungicides. Prune trees for better air circulation. Use resistant cultivars where possible.',
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
