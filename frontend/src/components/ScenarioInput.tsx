import React, { useState } from 'react';
import type { TonePreference } from '../types';

interface ScenarioInputProps {
  onSubmit: (situation: string, tonePreference: TonePreference) => void;
  loading: boolean;
}

export const ScenarioInput: React.FC<ScenarioInputProps> = ({ onSubmit, loading }) => {
  const [situation, setSituation] = useState('');
  const [tonePreference, setTonePreference] = useState<TonePreference>('calm');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (situation.trim()) {
      onSubmit(situation, tonePreference);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 -mt-16 relative z-10">
      {/* Card header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What's the situation?
        </h2>
        <p className="text-gray-600">
          Describe your communication challenge and we'll help you craft the perfect response
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Situation input with enhanced styling */}
        <div>
          <label htmlFor="situation" className="block text-sm font-semibold text-gray-900 mb-3">
            Your Situation
          </label>
          <div className="relative">
            <textarea
              id="situation"
              value={situation}
              onChange={(e) => setSituation(e.currentTarget.value)}
              placeholder="e.g., My coworker keeps taking credit for my ideas in team meetings. I want to address this professionally without creating conflict..."
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-900 placeholder-gray-400 transition-all duration-200"
              rows={5}
              maxLength={2000}
              disabled={loading}
              required
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
              {situation.length}/2000
            </div>
          </div>
        </div>

        {/* Tone selector with visual cards */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Preferred Communication Style
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'calm', label: 'Calm & Professional', emoji: '🧘', desc: 'Composed and measured' },
              { value: 'empathetic', label: 'Empathetic', emoji: '💙', desc: 'Warm and understanding' },
              { value: 'direct', label: 'Direct but Kind', emoji: '🎯', desc: 'Clear and honest' }
            ].map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => setTonePreference(tone.value as TonePreference)}
                disabled={loading}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  tonePreference === tone.value
                    ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="text-2xl mb-2">{tone.emoji}</div>
                <div className="font-semibold text-sm text-gray-900 mb-1">{tone.label}</div>
                <div className="text-xs text-gray-500">{tone.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit button with enhanced styling */}
        <button
          type="submit"
          disabled={loading || !situation.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing with AI...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Response Suggestions
            </>
          )}
        </button>
      </form>

      {/* Trust indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Powered by Raindrop AI • Your data stays private</span>
      </div>
    </div>
  );
};
