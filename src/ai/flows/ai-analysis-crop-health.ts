'use server';
/**
 * @fileOverview AI analysis for crop health, detecting diseases, pests, or soil dryness.
 *
 * - analyzeCropHealth - A function that handles the crop health analysis process.
 * - AnalyzeCropHealthInput - The input type for the analyzeCropHealth function.
 * - AnalyzeCropHealthOutput - The return type for the analyzeCropHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCropHealthInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video frame of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalDetails: z.string().optional().describe('Any additional details provided by the user about the crop.'),
});
export type AnalyzeCropHealthInput = z.infer<typeof AnalyzeCropHealthInputSchema>;

const AnalyzeCropHealthOutputSchema = z.object({
  analysisResult: z.string().describe('The analysis result indicating potential diseases, pests, or soil dryness.'),
  confidenceLevel: z.number().describe('The confidence level of the analysis result (0-1).'),
  suggestedActions: z.string().describe('Suggested actions based on the analysis result.'),
});
export type AnalyzeCropHealthOutput = z.infer<typeof AnalyzeCropHealthOutputSchema>;

export async function analyzeCropHealth(input: AnalyzeCropHealthInput): Promise<AnalyzeCropHealthOutput> {
  return analyzeCropHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCropHealthPrompt',
  input: {schema: AnalyzeCropHealthInputSchema},
  output: {schema: AnalyzeCropHealthOutputSchema},
  prompt: `You are an AI assistant specializing in agricultural analysis. Analyze the provided image or video frame of the crop and identify any signs of disease, pests, or soil dryness.

  Here's the information about the crop:
  Additional Details: {{{additionalDetails}}}
  Image/Video Frame: {{media url=mediaDataUri}}

  Based on your analysis, provide the following:
  - analysisResult: A clear and concise description of your findings, including any potential issues identified.
  - confidenceLevel: A numerical value between 0 and 1 indicating your confidence in the analysis result.
  - suggestedActions: Practical steps the farmer can take to address the identified issues.
  Make sure the analysisResult and suggestedActions are easy to understand for someone with limited technical knowledge.
`,
});

const analyzeCropHealthFlow = ai.defineFlow(
  {
    name: 'analyzeCropHealthFlow',
    inputSchema: AnalyzeCropHealthInputSchema,
    outputSchema: AnalyzeCropHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
