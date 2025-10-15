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

const ChatbotAgriculturalAdviceInputSchema = z.object({
  question: z.string().describe('The agricultural question asked by the farmer.'),
});
export type ChatbotAgriculturalAdviceInput = z.infer<typeof ChatbotAgriculturalAdviceInputSchema>;

const ChatbotAgriculturalAdviceOutputSchema = z.object({
  advice: z.string().describe('The AI-generated agricultural advice.'),
});
export type ChatbotAgriculturalAdviceOutput = z.infer<typeof ChatbotAgriculturalAdviceOutputSchema>;

export async function askQuestion(input: ChatbotAgriculturalAdviceInput): Promise<ChatbotAgriculturalAdviceOutput> {
  return chatbotAgriculturalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAgriculturalAdvicePrompt',
  input: {schema: ChatbotAgriculturalAdviceInputSchema},
  output: {schema: ChatbotAgriculturalAdviceOutputSchema},
  prompt: `You are an AI-powered agricultural advisor. A farmer will ask you a question, and you will provide helpful and practical advice.

Question: {{{question}}}`,
});

const chatbotAgriculturalAdviceFlow = ai.defineFlow(
  {
    name: 'chatbotAgriculturalAdviceFlow',
    inputSchema: ChatbotAgriculturalAdviceInputSchema,
    outputSchema: ChatbotAgriculturalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
