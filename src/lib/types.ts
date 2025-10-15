export interface AnalysisResult {
    id: string;
    userId: string;
    imageUrl: string;
    additionalDetails?: string;
    analysisResult: string;
    confidenceLevel: number;
    suggestedActions: string;
    createdAt: Date;
}
