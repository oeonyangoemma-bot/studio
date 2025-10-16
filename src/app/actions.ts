'use server';

import { analyzeCropHealth } from "@/ai/flows/ai-analysis-crop-health";
import { askQuestion } from "@/ai/flows/chatbot-agricultural-advice";
import { AnalysisResult } from "@/lib/types";
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
        additionalDetails: formData.get('additionalDetails'),
    };

    const validatedFields = analysisSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { mediaDataUri, additionalDetails } = validatedFields.data;
    
    try {
        const analysisResult = await analyzeCropHealth({
            mediaDataUri,
            additionalDetails,
        });

        // Always return the analysis result directly without saving
        const tempResult: Omit<AnalysisResult, 'id' | 'createdAt' | 'userId'> = {
            imageUrl: mediaDataUri, // Use the data URI as the image URL
            additionalDetails,
            ...analysisResult,
        };

        return { analysis: tempResult };

    } catch (error) {
        console.error("Error performing analysis:", error);
        return { error: "An unexpected error occurred during analysis." };
    }
}

export async function getAnalysisResult(id: string): Promise<AnalysisResult | null> {
    // This function is no longer used for anonymous analysis but kept for potential future use.
    return null;
}

export async function askChatbot(history: any[], question: string) {
    // For simplicity, chatbot is now always anonymous
    const userId = 'anonymous-user';
    try {
        const result = await askQuestion({ question, history, userId });
        return { advice: result.advice };
    } catch (error) {
        console.error("Error with chatbot:", error);
        return { error: "Sorry, I couldn't process that question." };
    }
}
