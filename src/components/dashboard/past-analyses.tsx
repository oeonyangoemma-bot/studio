'use client';

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "../auth-provider";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "../ui/skeleton";

export function PastAnalyses() {
    const { user, loading: authLoading } = useAuth();
    const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!user) {
            setLoading(false);
            return;
        };

        const q = query(
            collection(db, "analyses"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
            setLoading(false);
        }, (error) => {
            console.error("Error fetching analyses:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading]);

    if (loading || authLoading) {
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

    if (!user) {
        return (
             <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
                <h3 className="text-xl font-semibold">Login to View Past Analyses</h3>
                <p className="text-muted-foreground mt-2">Create an account to save and review your analysis history.</p>
                <div className="flex gap-2 justify-center mt-4">
                    <Button asChild>
                        <Link href="/signup">Create an Account</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (analyses.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg col-span-full">
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
