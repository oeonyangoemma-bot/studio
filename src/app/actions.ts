'use server';

import { analyzeCropHealth } from "@/ai/flows/ai-analysis-crop-health";
import { askQuestion } from "@/ai/flows/chatbot-agricultural-advice";
import { db, storage } from "@/lib/firebase";
import { AnalysisResult } from "@/lib/types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const analysisSchema = z.object({
    mediaDataUri: z.string().refine(val => val.startsWith('data:image/'), {
        message: 'Must be a data URI for an image.',
    }),
    additionalDetails: z.string().optional(),
    userId: z.string(),
});

// We need a temporary result type because we won't have an ID or createdAt for anon users
type TempAnalysisResult = Omit<AnalysisResult, 'id' | 'createdAt'>;


export async function performAnalysis(formData: FormData) {
    const rawData = {
        mediaDataUri: formData.get('mediaDataUri'),
        additionalDetails: formData.get('additionalDetails'),
        userId: formData.get('userId'),
    };

    const validatedFields = analysisSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { mediaDataUri, additionalDetails, userId } = validatedFields.data;
    
    try {
        const analysisResult = await analyzeCropHealth({
            mediaDataUri,
            additionalDetails,
        });

        // If user is not logged in, just return the result without saving
        if (userId === 'anonymous-user') {
            const imageUrl = mediaDataUri; // Use the data URI as a temporary image URL
            const tempResult: TempAnalysisResult = {
                userId,
                imageUrl,
                additionalDetails,
                ...analysisResult,
            };
            return { analysis: tempResult };
        }
        
        // If user is logged in, save the analysis and image
        const imageUrl = await uploadImageAndGetUrl(mediaDataUri, userId);
        
        const docRef = await addDoc(collection(db, "analyses"), {
            userId: userId,
            imageUrl,
            additionalDetails,
            ...analysisResult,
            createdAt: serverTimestamp(),
        });
        
        revalidatePath('/dashboard');
        
        return { analysisId: docRef.id };

    } catch (error) {
        console.error("Error performing analysis:", error);
        return { error: "An unexpected error occurred during analysis." };
    }
}


async function uploadImageAndGetUrl(dataUri: string, userId: string): Promise<string> {
    const storageRef = ref(storage, `analyses/${userId}/${Date.now()}`);
    const snapshot = await uploadString(storageRef, dataUri, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

export async function getAnalysisResult(id: string): Promise<AnalysisResult | null> {
    const { getDoc, doc } = await import("firebase/firestore");
    const docRef = doc(db, "analyses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt.toDate(),
        } as AnalysisResult;
    } else {
        return null;
    }
}


export async function askChatbot(history: any[], question: string, userId: string) {
    try {
        const result = await askQuestion({ question, history, userId });
        return { advice: result.advice };
    } catch (error) {
        console.error("Error with chatbot:", error);
        return { error: "Sorry, I couldn't process that question." };
    }
}
