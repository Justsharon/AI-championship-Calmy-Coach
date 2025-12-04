// Type definitions for Calmly MCP

export type ContextType = 'work' | 'friendship' | 'relationship';

export interface AnalyzeSituationParams {
  situation: string;
  userId?: string;
}

export interface AnalyzeSituationResult {
  context: ContextType;
  confidence: number;
  emotionalTone: string;
  keyElements: string[];
}

export interface GenerateResponsesParams {
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

export interface GetUserHistoryParams {
  userId: string;
  limit?: number;
  contextFilter?: ContextType;
}

export interface InteractionRecord {
  interactionId: string;
  timestamp: Date;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount: number;
}

export interface UserHistoryResult {
  interactions: InteractionRecord[];
  patterns: {
    mostCommonContext: ContextType;
    preferredTone: string;
    avgRefinements: number;
  };
}

export interface SaveInteractionParams {
  userId: string;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount?: number;
}

export interface SaveInteractionResult {
  interactionId: string;
  saved: boolean;
}

export interface SearchScenariosParams {
  query: string;
  context?: ContextType;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  context: ContextType;
  description: string;
  suggestedApproaches: string[];
  relevanceScore: number;
}

export interface ToolMetadata {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}
