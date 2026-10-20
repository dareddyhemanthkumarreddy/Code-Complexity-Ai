import React from 'react';
import { ArrowDown, Clock, Database, Lightbulb, Zap } from 'lucide-react';

interface HeroProps {
  onScrollToEditor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToEditor }) => {
  return (
    <section className="bg-gradient-to-b from-indigo-50/50 via-slate-50 to-slate-50 border-b border-slate-200/80 pt-8 pb-10 sm:pt-10 sm:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold mb-4 border border-indigo-200/60 shadow-2xs">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Asymptotic Algorithm Analyzer</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Understand Your Code&apos;s Complexity.
        </h1>

        {/* Description */}
        <p className="mt-3.5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          Analyze algorithms with AI-powered time and space complexity predictions, clear explanations, and practical optimization insights.
        </p>

        {/* 3 Compact Feature Indicators */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Time Complexity</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Asymptotic upper, average, and best-case Big-O bounds with loop & recursion tracing.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Space Complexity</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Auxiliary scratchpad storage and call stack depth evaluation excluding input size.
              </p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Optimization Insights</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Actionable algorithmic improvements, trade-offs, and pattern detection.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-7">
          <button
            onClick={onScrollToEditor}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition transform active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
          >
            <span>Start Analyzing Code</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
