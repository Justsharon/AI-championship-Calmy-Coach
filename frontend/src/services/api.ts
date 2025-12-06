import { mockAnalyze, mockSuggest, mockSaveInteraction } from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const analyzeScenario = async (situation: string, userId?: string) => {
  if (USE_MOCK) {
    return mockAnalyze(situation);
  }
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situation, userId }),
  });
  if (!response.ok) throw new Error('Failed to analyze');
  return response.json();
};

export const generateResponses = async (situation: string, context?: string, userId?: string) => {
  if (USE_MOCK) {
    return mockSuggest(situation);
  }
  const response = await fetch(`${API_BASE_URL}/api/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situation, context, userId }),
  });
  if (!response.ok) throw new Error('Failed to generate');
  return response.json();
};

export const saveInteraction = async (data: any) => {
  if (USE_MOCK) {
    return mockSaveInteraction();
  }
  const response = await fetch(`${API_BASE_URL}/api/memory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to save');
  return response.json();
};

export const api = {
  analyzeSituation: analyzeScenario,
  generateSuggestions: generateResponses,
  saveInteraction,
};
