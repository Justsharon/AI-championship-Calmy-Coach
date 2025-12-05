import React from "react";
import type { AnalyzeResponse } from "../types";
import { SemicircleGauge } from "./SemicircleGauge";

interface AnalysisDisplayProps {
  analysis: AnalyzeResponse;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({
  analysis,
}) => {
  const confidencePercentage = Math.round(analysis.confidence * 100);

  return (
    <div className="backdrop-blur-sm bg-white/50 border border-white/20 p-5 rounded-xl shadow-sm flex flex-col lg:flex-row items-center gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <p className="text-sm text-gray-600 mb-2">
          Context: <strong>{analysis.context}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Tone: <strong>{analysis.emotionalTone.replace("_", " ")}</strong>
        </p>

        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1">Key Elements</div>
          <div className="flex flex-wrap gap-2">
            {analysis.keyElements.map((k) => (
              <span
                key={k}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-44">
        <SemicircleGauge value={confidencePercentage} />
      </div>
    </div>
  );
};
