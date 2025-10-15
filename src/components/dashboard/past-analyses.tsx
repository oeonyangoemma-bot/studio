'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { AnalysisResult } from "@/lib/types";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";

export function PastAnalyses() {
    const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Using a mock user ID
    const userId = "anonymous-user";

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const q = query(
                    collection(db, "analyses"), 
                    where("userId", "==", userId),
                    orderBy("createdAt", "desc"),
                    limit(12)
                );
                const querySnapshot = await getDocs(q);
                const fetchedAnalyses: AnalysisResult[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedAnalyses.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt.toDate(),
                    } as AnalysisResult);
                });
                setAnalyses(fetchedAnalyses);
            } catch (err) {
                console.error(err);
                setError("Failed to load past analyses.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyses();
    }, [userId]);

    if (loading) {
        return (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardFooter>
                             <Skeleton className="h-4 w-1/2" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }
    
    if (error) {
        return <div className="text-destructive flex items-center gap-2"><AlertCircle/> {error}</div>;
    }

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
                                alt="Analyzed crop" 
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
