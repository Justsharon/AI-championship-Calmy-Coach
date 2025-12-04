import React, { useState } from 'react';
import type { ResponseSuggestion, ContextType } from '../types';

interface ResponseCardProps {
  response: ResponseSuggestion;
  onSave: (responseId: string, text: string, tone: string) => void;
  situationDescription: string;
  detectedContext: ContextType;
  saving: boolean;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  response,
  onSave,
  saving,
}) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    onSave(response.id, response.text, response.tone);
  };

  return (
    <div className={`border rounded-lg p-5 transition-all duration-200 ${
      selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {response.tone}
        </span>
        {selected && (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <p className="text-gray-900 font-medium mb-3 leading-relaxed">
        "{response.text}"
      </p>

      <div className="bg-gray-50 border-l-4 border-blue-400 p-3 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Why this works:</span> {response.explanation}
        </p>
      </div>

      <button
        onClick={handleSelect}
        disabled={saving || selected}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          selected
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {selected ? (
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved to Memory
          </span>
        ) : (
          'Use This Response'
        )}
      </button>
    </div>
  );
};
