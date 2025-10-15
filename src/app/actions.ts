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
});

export async function performAnalysis(formData: FormData) {
    const rawData = {
        mediaDataUri: formData.get('mediaDataUri'),
        additionalDetails: formData.get('additionalDetails')
    };

    const validatedFields = analysisSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { mediaDataUri, additionalDetails } = validatedFields.data;
    
    // Using a mock user ID
    const userId = "anonymous-user";
    
    try {
        const [analysisResult, imageUrl] = await Promise.all([
             analyzeCropHealth({
                mediaDataUri,
                additionalDetails,
            }),
            uploadImageAndGetUrl(mediaDataUri, userId),
        ]);


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


export async function askChatbot(history: {role: string, content: string}[], question: string) {
    // For simplicity, we only use the last question. A more complex implementation could use the history.
    try {
        const result = await askQuestion({ question });
        return { advice: result.advice };
    } catch (error) {
        console.error("Error with chatbot:", error);
        return { error: "Sorry, I couldn't process that question." };
    }
}
