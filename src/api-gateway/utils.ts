// Utility functions for API Gateway

import type { ContextType } from './interfaces';

/**
 * Validate situation text length (max 2000 chars)
 */
export function validateSituationLength(situation: string): boolean {
  return !!(situation && situation.length > 0 && situation.length <= 2000);
}

/**
 * Validate context is one of allowed types
 */
export function validateContext(context: string): context is ContextType {
  return ['work', 'friendship', 'relationship'].includes(context);
}

/**
 * Validate assertiveness is in range 1-10
 */
export function validateAssertiveness(assertiveness: number): boolean {
  return assertiveness >= 1 && assertiveness <= 10;
}

/**
 * Sanitize user input (basic XSS protection)
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Format error response with CORS headers
 */
export function formatErrorResponse(error: Error, status = 500): Response {
  return new Response(
    JSON.stringify({
      error: error.message || 'Internal server error',
      status
    }),
    {
      status,
      headers: createCorsHeaders('application/json')
    }
  );
}

/**
 * Create CORS headers for responses
 */
export function createCorsHeaders(contentType = 'application/json'): Headers {
  const headers = new Headers();
  headers.set('Content-Type', contentType);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

/**
 * Parse JSON request body safely
 */
export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return await request.json() as T;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Create success JSON response with CORS
 */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: createCorsHeaders()
  });
}
