// Type definitions for Interaction Recorder

export type ContextType = 'work' | 'friendship' | 'relationship';

export interface InteractionMessage {
  userId: string;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount?: number;
  timestamp?: Date;
}

export interface InteractionRecord {
  interactionId: string;
  userId: string;
  situationDescription: string;
  detectedContext: ContextType;
  selectedResponse: string;
  selectedTone: string;
  refinementCount: number;
  timestamp: Date;
}

export interface SessionSummary {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  interactionCount: number;
  dominantContext: ContextType;
  tonePreferences: Record<string, number>;
  avgRefinements: number;
  keyThemes: string[];
}

export interface UserPattern {
  userId: string;
  mostCommonContext: ContextType;
  preferredTone: string;
  avgRefinements: number;
  effectiveResponses: Array<{
    situation: string;
    response: string;
    effectiveness: number;
  }>;
}

export interface MemoryEntry {
  content: string;
  metadata: Record<string, any>;
  timeline?: string;
}

export interface SqlInteractionRow {
  id?: number;
  interaction_id: string;
  user_id: string;
  situation_description: string;
  detected_context: string;
  selected_response: string;
  selected_tone: string;
  refinement_count: number;
  created_at: Date;
}
