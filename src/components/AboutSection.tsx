import React from 'react';
import { Info, Code2, Target, Cpu, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-project" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            About CodeComplex AI
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic Project — AI-Assisted Algorithm Complexity & Education Engine
          </p>
        </div>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Problem Statement
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Determining the precise time and auxiliary space complexity of software routines requires rigorous evaluation of dependent loops, recursive branching trees, input bounds, and dynamic memory allocations. Beginners often make simplistic mistakes—such as assuming two nested loops always yield <span className="font-mono text-indigo-700 font-semibold">O(n²)</span> even when step sizes double or bounds cross. CodeComplex AI bridges this gap with clear, step-by-step reasoning.
          </p>
        </div>

        {/* Methodology */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            Hybrid Analysis Methodology
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The platform couples local, deterministic pattern analysis (detecting syntax loops, bisection cues, recursion signatures, and dynamic heap growth) with Google&apos;s Gemini 3.8 Flash model. The AI reasons asymptotically over mathematical summations, recurrence relations, and memory footprints, returning strictly typed structured JSON validated via Zod schemas.
          </p>
        </div>
      </div>

      {/* Key Objectives */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
          Core Objectives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Multi-Language Coverage</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Analyze Python, C++, C, and Java source code without requiring local runtime compilers.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Auxiliary Space Clarity</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Explicitly differentiate scratchpad memory and recursion stack frames from the input data size.
            </p>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Actionable Guidance</span>
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Deliver actionable optimization pathways, identifying bottlenecks and asymptotic trade-offs.
            </p>
          </div>
        </div>
      </div>

      {/* Honest Scientific Limitations */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Educational Disclaimer & Scientific Limitations</span>
        </div>
        <p className="leading-relaxed text-amber-800">
          CodeComplex AI is an <strong>educational analysis tool</strong> and not a formal verification proof system. AI-driven asymptotic predictions are probabilistic inferences based on source code syntax and algorithmic heuristics. They do not constitute formal mathematical proofs. Complex dynamic dispatch, obscure third-party library overheads, or ambiguous branch probabilities may introduce uncertainty.
        </p>
      </div>
    </section>
  );
};
