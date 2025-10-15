'use server';

/**
 * @fileOverview Chatbot for agricultural advice.
 *
 * - askQuestion - A function that allows farmers to ask questions and receive AI-generated agricultural advice.
 * - ChatbotAgriculturalAdviceInput - The input type for the askQuestion function.
 * - ChatbotAgriculturalAdviceOutput - The return type for the askQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalysisResult } from '@/lib/types';


const getAnalysesTool = ai.defineTool(
    {
      name: 'getAnalyses',
      description: 'Get a list of past analyses for the user.',
      inputSchema: z.object({
        query: z.string().describe('A query to search for in the analysis results. Can be a crop type, a disease, a pest, etc.'),
        userId: z.string().describe('The ID of the user to get analyses for.'),
      }),
      outputSchema: z.array(z.custom<AnalysisResult>()),
    },
    async ({ query: textQuery, userId }) => {
        const { getDocs, query, collection, where, orderBy, limit } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
        if (!userId || userId === 'anonymous-user') {
            return [];
        }

        const q = query(
            collection(db, "analyses"), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(10)
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

        // This is a simple text search. A more advanced implementation could use a full-text search engine.
        if (textQuery) {
            return fetchedAnalyses.filter(a => 
                a.analysisResult.toLowerCase().includes(textQuery.toLowerCase()) ||
                (a.additionalDetails && a.additionalDetails.toLowerCase().includes(textQuery.toLowerCase()))
            );
        }

        return fetchedAnalyses;
    }
  );


const ChatbotAgriculturalAdviceInputSchema = z.object({
  question: z.string().describe('The agricultural question asked by the farmer.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    }))
  })).optional().describe('The chat history.'),
  userId: z.string().describe('The user ID.'),
});
export type ChatbotAgriculturalAdviceInput = z.infer<typeof ChatbotAgriculturalAdviceInputSchema>;

const ChatbotAgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('The AI-generated agricultural advice.'),
});
export type ChatbotAgriculturalAdviceOutput = z.infer<typeof ChatbotAgriculturalAdviceOutputSchema>;

export async function askQuestion(input: ChatbotAgriculturalAdviceInput): Promise<ChatbotAgriculturalAdviceOutput> {
  return chatbotAgriculturalAdviceFlow(input);
}


const chatbotAgriculturalAdviceFlow = ai.defineFlow(
  {
    name: 'chatbotAgriculturalAdviceFlow',
    inputSchema: ChatbotAgriculturalAdviceInputSchema,
    outputSchema: ChatbotAgriculturalAdviceOutputSchema,
  },
  async (input) => {

    const systemPrompt = input.userId === 'anonymous-user' 
    ? `You are an AI-powered agricultural advisor. A farmer will ask you a question, and you will provide helpful and practical advice. The user is not logged in, so you cannot access their past analyses.`
    : `You are an AI-powered agricultural advisor. A farmer will ask you a question, and you will provide helpful and practical advice.
        
    If the user asks about past analyses, use the getAnalyses tool to retrieve the information. You must provide the userId to the tool.

    User ID: ${input.userId}`;


    const llmResponse = await ai.generate({
        prompt: input.question,
        history: input.history,
        tools: [getAnalysesTool],
        system: systemPrompt,
    });
    
    return { advice: llmResponse.text };
  }
);
