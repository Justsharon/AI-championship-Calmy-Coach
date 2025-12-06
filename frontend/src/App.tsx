import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { ScenarioInput } from './components/ScenarioInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ResponseCard } from './components/ResponseCard';
import { ErrorAlert } from './components/ErrorAlert';
import { api } from './services/api';
import type { AnalyzeResponse, GenerateResponse, TonePreference } from './types';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <ScenarioInput onSubmit={handleSubmit} loading={loading} />

        {/* Error Alert */}
        {error && (
          <div className="mt-8">
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-12 animate-fadeIn">
            <AnalysisDisplay analysis={analysis} />
          </div>
        )}

        {/* Response Suggestions */}
        {suggestions && (
          <div className="mt-12 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Response Options
                </h2>
                <p className="text-gray-600">
                  Choose the response that feels right for you
                </p>
              </div>
              {savedCount > 0 && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">{savedCount} saved to memory</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {suggestions.responses.map((response, index) => (
                <div key={response.id} className="animate-slideUp" style={{ animationDelay: `${index * 100}ms` }}>
                  <ResponseCard
                    response={response}
                    onSave={handleSaveResponse}
                    situationDescription={currentSituation}
                    detectedContext={analysis?.context || 'work'}
                    saving={saving}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysis && !suggestions && (
          <div className="mt-20 text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to communicate better?
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Describe any difficult conversation above and get AI-powered response suggestions in seconds
            </p>
          </div>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold">Built with</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                Raindrop AI
              </span>
              <span className="text-gray-400">×</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                Vultr
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;