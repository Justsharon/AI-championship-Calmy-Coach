import React from 'react';
import type { AnalyzeResponse } from '../types';

interface AnalysisDisplayProps {
  analysis: AnalyzeResponse;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const contextColors = {
    work: 'bg-blue-100 text-blue-800',
    friendship: 'bg-green-100 text-green-800',
    relationship: 'bg-purple-100 text-purple-800',
  };

  const confidencePercentage = Math.round(analysis.confidence * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Analysis</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Context</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${contextColors[analysis.context]}`}>
            {analysis.context.charAt(0).toUpperCase() + analysis.context.slice(1)}
          </span>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Confidence</p>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">{confidencePercentage}%</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Emotional Tone</p>
        <p className="text-gray-900 font-medium">{analysis.emotionalTone.replace(/_/g, ' ')}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-2">Key Elements</p>
        <div className="flex flex-wrap gap-2">
          {analysis.keyElements.map((element, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {element}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
