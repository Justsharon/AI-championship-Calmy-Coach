import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import type {
  ContextAnalysisResult,
  ResponseSuggestion,
  GenerateResponsesParams,
  ContextType
} from './interfaces';

/**
 * Coaching Engine - Core AI reasoning for Calmly Coach
 *
 * Responsibilities:
 * - Analyze situations to detect context and emotional tone
 * - Generate contextually appropriate response suggestions
 * - Retrieve user preferences from memory
 * - Query scenario library for similar situations
 */
export default class extends Service<Env> {
  /**
   * Analyze situation context and emotional tone using AI
   */
  async analyzeContext(params: {
    situation: string;
    userId?: string;
  }): Promise<ContextAnalysisResult> {
    const { situation, userId } = params;

    // Build analysis prompt
    const prompt = `Analyze this interpersonal communication situation:

"${situation}"

Determine:
1. Context (work, friendship, or relationship)
2. Confidence level (0.0-1.0)
3. Emotional tone (e.g., "frustrated_but_professional", "anxious_and_hurt", "calm_and_direct")
4. Key elements (3-5 important aspects of the situation)

Respond in JSON format:
{
  "context": "work" | "friendship" | "relationship",
  "confidence": 0.0-1.0,
  "emotionalTone": "descriptive_tone",
  "keyElements": ["element1", "element2", "element3"]
}`;

    try {
      // Call AI inference
      const response = await this.env.AI.run('llama-3.3-70b', {
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in analyzing interpersonal communication situations. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for consistent analysis
        max_tokens: 500
      });

      // Parse AI response
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }
      const result = JSON.parse(content) as ContextAnalysisResult;

      // Log analysis for monitoring
      this.env.logger.info('Context analysis completed', {
        userId,
        context: result.context,
        confidence: result.confidence
      });

      return result;
    } catch (error) {
      this.env.logger.error('Context analysis failed', {
        error: error instanceof Error ? error.message : String(error),
        situation: situation.substring(0, 100)
      });

      // Fallback to default analysis
      return {
        context: 'work',
        confidence: 0.5,
        emotionalTone: 'neutral',
        keyElements: ['communication challenge']
      };
    }
  }

  /**
   * Generate 1-3 response suggestions with different tones
   */
  async generateResponses(params: GenerateResponsesParams): Promise<{
    responses: ResponseSuggestion[];
  }> {
    const { situation, context, userId } = params;

    // Retrieve user preferences if userId provided
    let preferences = null;
    if (userId) {
      try {
        // Try to get user preferences from semantic memory
        const result = await this.env.USER_MEMORY.getSemanticMemory(`user_prefs_${userId}`);
        if (result.success && result.document) {
          preferences = result.document;
        }
      } catch (error) {
        this.env.logger.warn('Could not retrieve user preferences', {
          userId,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Build generation prompt
    const prompt = `You are Calmly, an AI communication coach helping someone respond to an interpersonal situation.

Situation: "${situation}"
Context: ${context}
${preferences ? `User preferences: ${JSON.stringify(preferences)}` : ''}

Generate 3 response suggestions with different tones:
1. Calm and Professional - maintains boundaries while staying constructive
2. Empathetic - shows understanding and emotional intelligence
3. Direct but Kind - clearly states needs while remaining respectful

For each response, provide:
- A specific, actionable response the person can say
- A brief explanation of why this approach works

Respond in JSON format:
{
  "responses": [
    {
      "tone": "Calm and Professional",
      "text": "the actual response text they should say",
      "explanation": "why this works"
    },
    {
      "tone": "Empathetic",
      "text": "the actual response text",
      "explanation": "why this works"
    },
    {
      "tone": "Direct but Kind",
      "text": "the actual response text",
      "explanation": "why this works"
    }
  ]
}`;

    try {
      // Call AI inference with higher creativity
      const response = await this.env.AI.run('llama-3.3-70b', {
        model: 'llama-3.3-70b',
        messages: [
          {
            role: 'system',
            content: 'You are Calmly, an expert communication coach specializing in emotionally intelligent responses. Provide practical, specific suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Higher temperature for creative suggestions
        max_tokens: 1000
      });

      // Parse AI response
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }
      const result = JSON.parse(content) as { responses: Array<{
        tone: string;
        text: string;
        explanation: string;
      }> };

      // Add IDs to responses
      const responsesWithIds: ResponseSuggestion[] = result.responses.map((r, i) => ({
        id: `resp_${Date.now()}_${i}`,
        tone: r.tone,
        text: r.text,
        explanation: r.explanation
      }));

      this.env.logger.info('Responses generated', {
        userId,
        context,
        count: responsesWithIds.length
      });

      return { responses: responsesWithIds };
    } catch (error) {
      this.env.logger.error('Response generation failed', {
        error: error instanceof Error ? error.message : String(error),
        situation: situation.substring(0, 100)
      });

      // Fallback responses
      return {
        responses: [
          {
            id: 'resp_fallback_1',
            tone: 'Calm and Professional',
            text: 'I appreciate you bringing this up. Can we discuss how to move forward constructively?',
            explanation: 'This acknowledges the situation and opens dialogue without confrontation.'
          },
          {
            id: 'resp_fallback_2',
            tone: 'Empathetic',
            text: 'I understand this is difficult. How can we work together to find a solution?',
            explanation: 'This shows understanding while inviting collaboration.'
          }
        ]
      };
    }
  }

  /**
   * Private service - only called by other Raindrop components
   * HTTP fetch not needed for private service
   */
  async fetch(request: Request): Promise<Response> {
    return new Response('Coaching Engine is a private service', { status: 403 });
  }
}
