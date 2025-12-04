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

  const handleSituationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSituation(e.currentTarget.value); // use currentTarget instead of target
  };

  const handleToneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTonePreference(e.currentTarget.value as TonePreference); // use currentTarget
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your situation
        </label>
        <textarea
          id="situation"
          value={situation}
          onChange={handleSituationChange}
          placeholder="e.g., My coworker keeps taking credit for my ideas in team meetings..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={2000}
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">{situation.length}/2000 characters</p>
      </div>

      <div>
        <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
          Preferred tone
        </label>
        <select
          id="tone"
          value={tonePreference}
          onChange={handleToneChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="calm">Calm & Professional</option>
          <option value="empathetic">Empathetic</option>
          <option value="direct">Direct but Kind</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || !situation.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing...
          </>
        ) : (
          'Get Response Suggestions'
        )}
      </button>
    </form>
  );
};
