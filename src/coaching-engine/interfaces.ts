// Type definitions for Coaching Engine

export type ContextType = 'work' | 'friendship' | 'relationship';

export interface ContextAnalysisResult {
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

export interface GenerateResponsesParams {
  situation: string;
  context: ContextType;
  userId?: string;
}

export interface RefineResponseParams {
  responseId: string;
  originalText: string;
  adjustment: string;
  userId?: string;
}

export interface RefinedResponse {
  id: string;
  tone: string;
  text: string;
  changes: string[];
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

export interface InteractionData {
  userId: string;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount?: number;
  timestamp?: Date;
}

export interface SmartInferenceRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface SmartInferenceResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}
