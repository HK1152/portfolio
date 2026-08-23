import React from 'react';

export const SectionLoader = ({ title = 'Loading Section', minHeight = '350px' }) => {
  return (
    <div
      style={{ minHeight }}
      className="w-full py-16 px-4 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Subtle pulsing background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary-500/20 border-t-primary-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-400/30 rounded-full animate-ping" />
          </div>
        </div>

        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-400 animate-pulse">
          {title}
        </p>
      </div>
    </div>
  );
};

export default SectionLoader;
