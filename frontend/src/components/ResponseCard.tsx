import React, { useState } from "react";
import type { ResponseSuggestion, ContextType } from "../types";
import { motion } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    onSave(response.id, response.text, response.tone);
  };

  // Gradient based on tone
  const getToneGradient = (tone: string) => {
    if (tone.toLowerCase().includes('calm') || tone.toLowerCase().includes('professional')) {
      return 'from-blue-500 to-cyan-500';
    } else if (tone.toLowerCase().includes('empathetic')) {
      return 'from-purple-500 to-pink-500';
    } else {
      return 'from-indigo-500 to-purple-500';
    }
  };

  const getToneIcon = (tone: string) => {
    if (tone.toLowerCase().includes('calm')) {
      return '🧘';
    } else if (tone.toLowerCase().includes('empathetic')) {
      return '💙';
    } else {
      return '🎯';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-2xl p-6 transition-all duration-300 ${
        selected
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 shadow-2xl"
          : "bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl"
      }`}
    >
      {/* Glow effect on hover */}
      {isHovered && !selected && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-xl -z-10" />
      )}

      {/* Success confetti effect */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5 }}
          className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Tone badge with icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getToneGradient(response.tone)} text-white shadow-md`}>
          <span className="text-lg">{getToneIcon(response.tone)}</span>
          <span className="font-bold text-sm">{response.tone}</span>
        </div>
        
        {/* Copy button */}
        <button
          onClick={() => navigator.clipboard.writeText(response.text)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
          title="Copy to clipboard"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Response text with better typography */}
      <div className="relative mb-4">
        <svg className="absolute -left-2 -top-2 w-8 h-8 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-gray-900 text-lg leading-relaxed pl-6 pr-2 font-medium">
          {response.text}
        </p>
      </div>

      {/* Explanation box with icon */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-l-4 border-indigo-400 p-4 mb-5 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900 mb-1">Why this works</p>
            <p className="text-sm text-indigo-700 leading-relaxed">
              {response.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Action button with enhanced design */}
      <button
        onClick={handleSelect}
        disabled={saving || selected}
        className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 transform ${
          selected
            ? "bg-green-500 text-white cursor-default shadow-lg"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {selected ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved to Memory
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Use This Response
          </span>
        )}
      </button>
    </motion.div>
  );
};