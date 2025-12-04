export type ContextType = 'work' | 'friendship' | 'relationship';
export type TonePreference = 'calm' | 'empathetic' | 'direct';

export interface AnalyzeResponse {
  context: ContextType;
  confidence: number;
  emotionalTone: string;
  keyElements: string[];
}

export interface ResponseSuggestion {
  id: string;
  tone: string;
  text: string;
  explanation: string;
}

export interface GenerateResponse {
  responses: ResponseSuggestion[];
}

export interface SaveInteractionResponse {
  interactionId: string;
  saved: boolean;
  queuedForProcessing: boolean;
}

export interface ApiError {
  error: string;
  status: number;
}
