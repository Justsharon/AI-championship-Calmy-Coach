import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-40 -top-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute left-1/2 -bottom-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        {/* Main heading with gradient text */}
        <h1 className="text-6xl sm:text-7xl font-black text-white mb-6 tracking-tight">
          Calmly
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8 font-light leading-relaxed">
          Your AI communication coach for difficult conversations
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            ✨ AI-Powered
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            🧠 Context-Aware
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            💬 3 Response Styles
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce mt-8">
          <svg className="w-6 h-6 text-white/70 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};