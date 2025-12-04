import React, { useState } from 'react';
import { ScenarioInput } from './components/ScenarioInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ResponseCard } from './components/ResponseCard';
import { ErrorAlert } from './components/ErrorAlert';
import { api } from './services/api';
import type { AnalyzeResponse, GenerateResponse, ContextType, TonePreference } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [suggestions, setSuggestions] = useState<GenerateResponse | null>(null);
  const [currentSituation, setCurrentSituation] = useState('');
  const [savedCount, setSavedCount] = useState(0);

  const userId = 'demo_user_' + Math.random().toString(36).substring(7);

  const handleSubmit = async (situation: string, tonePreference: TonePreference) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSuggestions(null);
    setCurrentSituation(situation);
    setSavedCount(0);

    try {
      // Call both endpoints in parallel
      const [analysisResult, suggestionsResult] = await Promise.all([
        api.analyzeSituation(situation, userId),
        api.generateSuggestions(situation, undefined, userId),
      ]);

      setAnalysis(analysisResult);
      setSuggestions(suggestionsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process your request');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResponse = async (responseId: string, text: string, tone: string) => {
    if (!analysis) return;

    setSaving(true);
    try {
      await api.saveInteraction({
        userId,
        situationDescription: currentSituation,
        detectedContext: analysis.context,
        selectedResponse: text,
        selectedTone: tone,
        refinementCount: 0,
      });
      setSavedCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save response');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Calmly
          </h1>
          <p className="text-gray-600">
            AI-powered communication coach for emotionally intelligent responses
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <ScenarioInput onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="mb-8 animate-fadeIn">
            <AnalysisDisplay analysis={analysis} />
          </div>
        )}

        {/* Response Suggestions */}
        {suggestions && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Response Suggestions
              </h2>
              {savedCount > 0 && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {savedCount} saved
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {suggestions.responses.map((response) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  onSave={handleSaveResponse}
                  situationDescription={currentSituation}
                  detectedContext={analysis?.context || 'work'}
                  saving={saving}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysis && !suggestions && (
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 text-lg">
              Describe a communication challenge to get started
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Built with LiquidMetal AI Raindrop Platform</p>
        </div>
      </div>
    </div>
  );
}

export default App;
