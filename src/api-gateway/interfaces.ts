// Type definitions for API Gateway

export type ContextType = 'work' | 'friendship' | 'relationship';

export interface AnalyzeRequest {
  situation: string;
  userId?: string;
}

export interface AnalyzeResponse {
  context: ContextType;
  confidence: number;
  emotionalTone: string;
  keyElements: string[];
}

export interface GenerateRequest {
  situation: string;
  context: ContextType;
  userId?: string;
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

export interface RefineRequest {
  responseId: string;
  originalText: string;
  adjustment: string;
  userId?: string;
}

export interface RefineResponse {
  id: string;
  tone: string;
  text: string;
  changes: string[];
}

export interface SaveInteractionRequest {
  userId: string;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount?: number;
}

export interface SaveInteractionResponse {
  interactionId: string;
  saved: boolean;
  queuedForProcessing: boolean;
}

export interface UserPreferences {
  userId: string;
  preferredTone?: string;
  defaultAssertiveness?: number;
  voiceEnabled?: boolean;
  elevenLabsVoiceId?: string;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  context: ContextType;
  description: string;
  suggestedApproaches: string[];
  relevanceScore?: number;
}

export interface SearchScenariosRequest {
  context?: ContextType;
  query?: string;
}

export interface SearchScenariosResponse {
  scenarios: ScenarioTemplate[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface VoiceSynthesisRequest {
  text: string;
  voiceId?: string;
  userId?: string;
}

export interface VoiceSynthesisResponse {
  audioUrl: string;
  duration: number;
  format: string;
}

export interface HealthCheckResponse {
  status: string;
  version: string;
  services: {
    ai: string;
    memory: string;
    storage: string;
  };
}
