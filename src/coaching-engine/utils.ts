// Utility functions for Coaching Engine

import type {
  ContextType,
  ContextAnalysisResult,
  ResponseSuggestion,
  UserPreferences,
  ScenarioTemplate
} from './interfaces';

/**
 * Detect conversation context using AI
 */
export async function detectContext(
  situation: string,
  ai: any
): Promise<ContextAnalysisResult> {
  const prompt = `Analyze this communication situation and respond with JSON only (no markdown, no preamble):

Situation: "${situation}"

Classify the context, detect emotional tone, and identify key elements.

Respond with this exact JSON structure:
{
  "context": "work" | "friendship" | "relationship",
  "confidence": 0.0-1.0,
  "emotionalTone": "brief_description_with_underscores",
  "keyElements": ["element1", "element2", "element3"]
}`;

  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3
    });

    const text = response.response || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      context: result.context || 'work',
      confidence: result.confidence || 0.7,
      emotionalTone: result.emotionalTone || 'neutral',
      keyElements: result.keyElements || ['communication challenge']
    };
  } catch (error) {
    console.error('Context detection error:', error);
    // Fallback to simple keyword detection
    return detectContextFallback(situation);
  }
}

/**
 * Fallback context detection using keywords
 */
function detectContextFallback(situation: string): ContextAnalysisResult {
  const lower = situation.toLowerCase();
  let context: ContextType = 'work';
  
  if (lower.match(/friend|buddy|pal|hangout|social/)) {
    context = 'friendship';
  } else if (lower.match(/partner|spouse|girlfriend|boyfriend|husband|wife|relationship|date|romantic|love/)) {
    context = 'relationship';
  } else if (lower.match(/work|job|coworker|colleague|boss|manager|office|team|project|meeting/)) {
    context = 'work';
  }
  
  return {
    context,
    confidence: 0.65,
    emotionalTone: 'uncertain',
    keyElements: ['communication challenge', 'interpersonal dynamics']
  };
}

/**
 * Analyze emotional tone indicators
 */
export function analyzeEmotionalTone(situation: string): string[] {
  const lower = situation.toLowerCase();
  const emotions: string[] = [];
  
  if (lower.match(/angry|mad|furious|upset|annoyed|irritated/)) {
    emotions.push('frustration');
  }
  if (lower.match(/sad|hurt|disappointed|depressed|down/)) {
    emotions.push('sadness');
  }
  if (lower.match(/anxious|worried|nervous|afraid|scared|concerned/)) {
    emotions.push('anxiety');
  }
  if (lower.match(/confused|unsure|don't know|uncertain/)) {
    emotions.push('confusion');
  }
  if (lower.match(/happy|excited|glad|pleased|satisfied/)) {
    emotions.push('positivity');
  }
  if (lower.match(/professional|calm|composed/)) {
    emotions.push('composure');
  }
  
  return emotions.length > 0 ? emotions : ['neutral'];
}

/**
 * Extract key conflict elements
 */
export function extractKeyElements(situation: string, context: ContextType): string[] {
  const lower = situation.toLowerCase();
  const elements: string[] = [];
  
  // Communication patterns
  if (lower.match(/not listen|ignor|dismiss/)) elements.push('communication breakdown');
  if (lower.match(/credit|recogni|acknowledg/)) elements.push('attribution concerns');
  if (lower.match(/respect|value|appreciat/)) elements.push('respect and recognition');
  if (lower.match(/boundary|limit|space/)) elements.push('boundary setting');
  if (lower.match(/conflict|disagree|argument|fight/)) elements.push('conflict resolution');
  if (lower.match(/trust|honest|truth|lie/)) elements.push('trust issues');
  if (lower.match(/time|deadline|busy|overwhelm/)) elements.push('time management');
  if (lower.match(/help|support|assist/)) elements.push('support needs');
  
  // Context-specific elements
  if (context === 'work') {
    elements.push('professional dynamics');
  } else if (context === 'friendship') {
    elements.push('social connection');
  } else {
    elements.push('emotional intimacy');
  }
  
  // Ensure at least 2 elements
  if (elements.length === 0) {
    elements.push('interpersonal communication', 'relationship dynamics');
  }
  
  return elements.slice(0, 4);
}

/**
 * Generate multiple response suggestions with different tones
 */
export async function generateMultipleResponses(
  situation: string,
  context: ContextType,
  ai: any,
  preferences?: UserPreferences,
  scenarios?: ScenarioTemplate[]
): Promise<ResponseSuggestion[]> {
  // Build context from similar scenarios
  const scenarioContext = scenarios && scenarios.length > 0
    ? `\n\nSimilar situations:\n${scenarios.map(s => `- ${s.title}: ${s.description}`).join('\n')}`
    : '';
  
  const preferencesContext = preferences
    ? `\n\nUser preferences: Prefers ${preferences.preferredTone} tone, assertiveness level ${preferences.defaultAssertiveness}/10`
    : '';

  const prompt = `You are a communication coach. Generate 3 different response suggestions for this situation.

Situation: "${situation}"
Context: ${context}${scenarioContext}${preferencesContext}

Provide 3 responses with these tones:
1. Calm and Professional - Composed, measured, maintains boundaries
2. Empathetic - Warm, understanding, acknowledges emotions
3. Direct but Kind - Clear, honest, respectful

Respond ONLY with this JSON structure (no markdown, no preamble):
{
  "responses": [
    {
      "id": "resp_1",
      "tone": "Calm and Professional",
      "text": "the actual response text here",
      "explanation": "why this approach works"
    },
    {
      "id": "resp_2",
      "tone": "Empathetic",
      "text": "the actual response text here",
      "explanation": "why this approach works"
    },
    {
      "id": "resp_3",
      "tone": "Direct but Kind",
      "text": "the actual response text here",
      "explanation": "why this approach works"
    }
  ]
}`;

  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    const text = response.response || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result.responses || generateFallbackResponses(context);
    
  } catch (error) {
    console.error('Response generation error:', error);
    return generateFallbackResponses(context);
  }
}

/**
 * Fallback responses when AI is unavailable
 */
function generateFallbackResponses(context: ContextType): ResponseSuggestion[] {
  const responses: Record<ContextType, ResponseSuggestion[]> = {
    work: [
      {
        id: 'resp_1',
        tone: 'Calm and Professional',
        text: "I'd appreciate the opportunity to discuss this matter. When would be a good time for us to have a thoughtful conversation?",
        explanation: 'Maintains professionalism while clearly requesting dialogue.'
      },
      {
        id: 'resp_2',
        tone: 'Empathetic',
        text: "I understand we're both under pressure. I'd like to share my perspective and hear yours as well.",
        explanation: 'Acknowledges mutual stress while opening space for discussion.'
      },
      {
        id: 'resp_3',
        tone: 'Direct but Kind',
        text: "I want to address this directly. This situation isn't working for me, and I think we need to discuss it.",
        explanation: 'Clear about the issue while remaining respectful.'
      }
    ],
    friendship: [
      {
        id: 'resp_1',
        tone: 'Calm and Professional',
        text: "I value our friendship and want to talk about something that's been on my mind. Can we find time to chat?",
        explanation: 'Affirms the relationship while requesting conversation.'
      },
      {
        id: 'resp_2',
        tone: 'Empathetic',
        text: "I care about you and our friendship. I've been feeling some concern about this, and I want to understand your perspective too.",
        explanation: 'Leads with care and invites mutual understanding.'
      },
      {
        id: 'resp_3',
        tone: 'Direct but Kind',
        text: "I need to be honest with you about how I'm feeling. This has been bothering me, and I think we should talk about it.",
        explanation: 'Direct about feelings while maintaining warmth.'
      }
    ],
    relationship: [
      {
        id: 'resp_1',
        tone: 'Calm and Professional',
        text: "I'd like to talk about something important. Can we set aside time when we're both calm to discuss this?",
        explanation: 'Creates space for productive conversation.'
      },
      {
        id: 'resp_2',
        tone: 'Empathetic',
        text: "I love you and want us to work through this together. I've been feeling concerned, and I want to understand your feelings too.",
        explanation: 'Leads with love and partnership.'
      },
      {
        id: 'resp_3',
        tone: 'Direct but Kind',
        text: "We need to talk about this. I care about our relationship, and I think addressing this directly will help us both.",
        explanation: 'Combines directness with care for the relationship.'
      }
    ]
  };
  
  return responses[context];
}

/**
 * Refine an existing response based on user adjustment
 */
export async function refineResponse(
  originalText: string,
  adjustment: string,
  context: ContextType,
  ai: any
): Promise<{ text: string; changes: string[] }> {
  const prompt = `You are a communication coach. Refine this response based on the user's request.

Original response: "${originalText}"
Context: ${context}
Adjustment request: "${adjustment}"

Respond ONLY with this JSON structure:
{
  "text": "refined response text",
  "changes": ["change1", "change2", "change3"]
}`;

  try {
    const response = await ai.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.6
    });

    const text = response.response || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
    
  } catch (error) {
    console.error('Response refinement error:', error);
    return {
      text: originalText,
      changes: ['Unable to refine - using original response']
    };
  }
}

/**
 * Get user preferences from SmartMemory
 */
export async function getUserPreferencesFromMemory(
  userId: string,
  memoryService: any
): Promise<UserPreferences | null> {
  try {
    const result = await memoryService.getMemory({
      session_id: userId,
      key: 'user_preferences',
      n_most_recent: 1
    });
    
    if (result && result.length > 0) {
      const content = JSON.parse(result[0].content);
      return {
        userId,
        preferredTone: content.preferredTone || 'balanced',
        defaultAssertiveness: content.defaultAssertiveness || 5,
        voiceEnabled: content.voiceEnabled || false,
        elevenLabsVoiceId: content.elevenLabsVoiceId || null
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return null;
  }
}

/**
 * Store user preferences in SmartMemory
 */
export async function storeUserPreferences(
  preferences: UserPreferences,
  memoryService: any
): Promise<void> {
  try {
    await memoryService.putMemory({
      session_id: preferences.userId,
      content: JSON.stringify({
        preferredTone: preferences.preferredTone,
        defaultAssertiveness: preferences.defaultAssertiveness,
        voiceEnabled: preferences.voiceEnabled,
        elevenLabsVoiceId: preferences.elevenLabsVoiceId
      }),
      key: 'user_preferences',
      timeline: '*userSettings'
    });
  } catch (error) {
    console.error('Error storing user preferences:', error);
    throw error;
  }
}

/**
 * Search for relevant scenarios in SmartBucket
 */
export async function searchScenarios(
  query: string,
  context: ContextType | undefined,
  bucketService: any
): Promise<ScenarioTemplate[]> {
  try {
    const searchQuery = context ? `${context} ${query}` : query;
    
    const results = await bucketService.documentSearch({
      bucket_name: 'scenario-library',
      query: searchQuery,
      threshold: 0.7,
      limit: 5
    });
    
    return results.map((doc: any) => ({
      id: doc.id || `scn_${Date.now()}`,
      title: doc.title || 'Scenario',
      context: doc.context || context || 'work',
      description: doc.description || '',
      suggestedApproaches: doc.suggestedApproaches || [],
      relevanceScore: doc.score || 0.5
    }));
  } catch (error) {
    console.error('Error searching scenarios:', error);
    return [];
  }
}

/**
 * Analyze user interaction patterns
 */
export function analyzeInteractionPatterns(
  interactions: any[]
): { preferredTone: string; avgRefinements: number } {
  if (interactions.length === 0) {
    return { preferredTone: 'balanced', avgRefinements: 0 };
  }
  
  // Count tone preferences
  const toneCounts: Record<string, number> = {};
  let totalRefinements = 0;
  
  for (const interaction of interactions) {
    const tone = interaction.selectedTone || 'balanced';
    toneCounts[tone] = (toneCounts[tone] || 0) + 1;
    totalRefinements += interaction.refinementCount || 0;
  }
  
  // Find most common tone
  let preferredTone = 'balanced';
  let maxCount = 0;
  
  for (const [tone, count] of Object.entries(toneCounts)) {
    if (count > maxCount) {
      maxCount = count;
      preferredTone = tone;
    }
  }
  
  const avgRefinements = totalRefinements / interactions.length;
  
  return { preferredTone, avgRefinements };
}

/**
 * Queue interaction for async processing
 */
export async function queueInteraction(
  interactionData: any,
  queueService: any
): Promise<void> {
  try {
    await queueService.send({
      userId: interactionData.userId,
      interaction: interactionData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error queueing interaction:', error);
    throw error;
  }
}