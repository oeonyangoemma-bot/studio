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
import { getAnalysisResult } from '@/app/actions';
import { AnalysisResult } from '@/lib/types';


// Using a mock user ID
const userId = "anonymous-user";
const getAnalysesTool = ai.defineTool(
    {
      name: 'getAnalyses',
      description: 'Get a list of past analyses for the user.',
      inputSchema: z.object({
        query: z.string().describe('A query to search for in the analysis results. Can be a crop type, a disease, a pest, etc.'),
      }),
      outputSchema: z.array(z.custom<AnalysisResult>()),
    },
    async (input) => {
        const { getDocs, query, collection, where, orderBy, limit } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
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
        if (input.query) {
            return fetchedAnalyses.filter(a => 
                a.analysisResult.toLowerCase().includes(input.query.toLowerCase()) ||
                a.additionalDetails?.toLowerCase().includes(input.query.toLowerCase())
            );
        }

        return fetchedAnalyses;
    }
  );


const ChatbotAgriculturalAdviceInputSchema = z.object({
  question: z.string().describe('The agricultural question asked by the farmer.'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).optional().describe('The chat history.'),
});
export type ChatbotAgriculturalAdviceInput = z.infer<typeof ChatbotAgriculturalAdviceInputSchema>;

const ChatbotAgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('The AI-generated agricultural advice.'),
});
export type ChatbotAgriculturalAdviceOutput = z.infer<typeof ChatbotAgriculturalAdviceOutputSchema>;

export async function askQuestion(input: ChatbotAgriculturalAdviceInput): Promise<ChatbotAgriculturalAdviceOutput> {
  return chatbotAgriculturalAdviceFlow(input);
}

const prompt = ai.definePrompt(
    {
        name: 'chatbotAgriculturalAdvicePrompt',
        input: { schema: ChatbotAgriculturalAdviceInputSchema },
        output: { schema: ChatbotAgriculturalAdviceOutputSchema },
        tools: [getAnalysesTool],
        prompt: `You are an AI-powered agricultural advisor. A farmer will ask you a question, and you will provide helpful and practical advice.
        
        If the user asks about past analyses, use the getAnalyses tool to retrieve the information.

        Question: {{{question}}}
        
        {{#if history}}
        Chat History:
        {{#each history}}
        - {{role}}: {{content}}
        {{/each}}
        {{/if}}
        `
    }
);


const chatbotAgriculturalAdviceFlow = ai.defineFlow(
  {
    name: 'chatbotAgriculturalAdviceFlow',
    inputSchema: ChatbotAgriculturalAdviceInputSchema,
    outputSchema: ChatbotAgriculturalAdviceOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output();
    if (!output) {
      throw new Error('No output from language model');
    }
    return output;
  }
);
