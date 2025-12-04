import { Service } from '@liquidmetal-ai/raindrop-framework';
import { Env } from './raindrop.gen';
import {
  validateSituationLength,
  validateContext,
  formatErrorResponse,
  parseJsonBody,
  jsonResponse,
  createCorsHeaders
} from './utils';
import type {
  AnalyzeRequest,
  AnalyzeResponse,
  GenerateRequest,
  GenerateResponse,
  SaveInteractionRequest,
  SaveInteractionResponse,
  SearchScenariosRequest,
  SearchScenariosResponse,
  HealthCheckResponse,
  ContextType
} from './interfaces';

/**
 * API Gateway - Main HTTP entry point for Calmly Coach
 *
 * Endpoints:
 * - POST /api/analyze - Analyze situation context
 * - POST /api/suggest - Generate response suggestions
 * - POST /api/memory - Save interaction for personalization
 * - GET /api/scenarios - Search scenario templates
 * - GET /health - Service health check
 */
export default class extends Service<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: createCorsHeaders() });
    }

    try {
      // Route to appropriate handler
      switch (path) {
        case '/api/analyze':
          return await this.handleAnalyze(request);

        case '/api/suggest':
          return await this.handleSuggest(request);

        case '/api/memory':
          return await this.handleMemory(request);

        case '/api/scenarios':
          return await this.handleScenarios(request);

        case '/health':
          return await this.handleHealth(request);

        default:
          return formatErrorResponse(new Error('Not found'), 404);
      }
    } catch (error) {
      this.env.logger.error('API Gateway error', {
        error: error instanceof Error ? error.message : String(error),
        path
      });
      return formatErrorResponse(error as Error);
    }
  }

  /**
   * POST /api/analyze
   * Analyze situation to detect context and emotional tone
   */
  private async handleAnalyze(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return formatErrorResponse(new Error('Method not allowed'), 405);
    }

    const body = await parseJsonBody<AnalyzeRequest>(request);

    // Validate input
    if (!body.situation || !validateSituationLength(body.situation)) {
      return formatErrorResponse(
        new Error('Invalid situation: must be 1-2000 characters'),
        400
      );
    }

    // Call coaching engine to analyze context
    const result = await this.env.COACHING_ENGINE.analyzeContext({
      situation: body.situation,
      userId: body.userId
    });

    const response: AnalyzeResponse = {
      context: result.context,
      confidence: result.confidence,
      emotionalTone: result.emotionalTone,
      keyElements: result.keyElements
    };

    return jsonResponse(response);
  }

  /**
   * POST /api/suggest
   * Generate 1-3 response suggestions with different tones
   */
  private async handleSuggest(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return formatErrorResponse(new Error('Method not allowed'), 405);
    }

    const body = await parseJsonBody<GenerateRequest>(request);

    // Validate input
    if (!body.situation || !validateSituationLength(body.situation)) {
      return formatErrorResponse(
        new Error('Invalid situation: must be 1-2000 characters'),
        400
      );
    }

    if (body.context && !validateContext(body.context)) {
      return formatErrorResponse(
        new Error('Invalid context: must be work, friendship, or relationship'),
        400
      );
    }

    // Call coaching engine to generate responses
    const result = await this.env.COACHING_ENGINE.generateResponses({
      situation: body.situation,
      context: body.context,
      userId: body.userId
    });

    const response: GenerateResponse = {
      responses: result.responses
    };

    return jsonResponse(response);
  }

  /**
   * POST /api/memory
   * Save user interaction for personalization
   */
  private async handleMemory(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return formatErrorResponse(new Error('Method not allowed'), 405);
    }

    const body = await parseJsonBody<SaveInteractionRequest>(request);

    // Validate required fields
    if (!body.userId || !body.situationDescription || !body.selectedResponse) {
      return formatErrorResponse(
        new Error('Missing required fields: userId, situationDescription, selectedResponse'),
        400
      );
    }

    // Generate interaction ID
    const interactionId = `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Queue interaction for async processing
    await this.env.INTERACTION_QUEUE.send({
      interactionId,
      userId: body.userId,
      situationDescription: body.situationDescription,
      detectedContext: body.detectedContext,
      selectedResponse: body.selectedResponse,
      selectedTone: body.selectedTone,
      refinementCount: body.refinementCount || 0,
      timestamp: Date.now()
    });

    const response: SaveInteractionResponse = {
      interactionId,
      saved: true,
      queuedForProcessing: true
    };

    return jsonResponse(response);
  }

  /**
   * GET /api/scenarios
   * Search scenario template library
   */
  private async handleScenarios(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return formatErrorResponse(new Error('Method not allowed'), 405);
    }

    const url = new URL(request.url);
    const context = url.searchParams.get('context');
    const query = url.searchParams.get('query');

    // Validate context if provided
    if (context && !validateContext(context)) {
      return formatErrorResponse(
        new Error('Invalid context: must be work, friendship, or relationship'),
        400
      );
    }

    // Build search query
    const searchQuery = [context, query].filter(Boolean).join(' ');

    // Search scenario library using SmartBucket
    const results = await this.env.SCENARIO_LIBRARY.search({
      input: searchQuery || 'communication scenarios',
      requestId: `scenario_${Date.now()}`
    });

    const response: SearchScenariosResponse = {
      scenarios: results.results.map((result) => ({
        id: result.chunkSignature || `scn_${Date.now()}`,
        title: result.source?.toString() || 'Untitled',
        context: (context as ContextType) || 'work',
        description: result.text?.substring(0, 200) || '',
        suggestedApproaches: [],
        relevanceScore: result.score
      })),
      pagination: {
        page: results.pagination.page,
        pageSize: results.pagination.pageSize,
        total: results.pagination.total
      }
    };

    return jsonResponse(response);
  }

  /**
   * GET /health
   * Service health check
   */
  private async handleHealth(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return formatErrorResponse(new Error('Method not allowed'), 405);
    }

    // Check service availability
    const response: HealthCheckResponse = {
      status: 'healthy',
      version: '1.0.0',
      services: {
        ai: 'operational',
        memory: 'operational',
        storage: 'operational'
      }
    };

    return jsonResponse(response);
  }
}
