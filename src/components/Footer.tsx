import React from 'react';
import { Code2, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Code2 className="w-4 h-4" />
              </div>
              <span>CodeComplex AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Understand Your Code. Predict Its Complexity. Educational tool for algorithmic asymptotic time and auxiliary space analysis.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button
              onClick={() => onNavigate('workspace')}
              className="text-slate-300 hover:text-white transition"
            >
              Analyze Workspace
            </button>
            <button
              onClick={() => onNavigate('reference-guide')}
              className="text-slate-300 hover:text-white transition"
            >
              Complexity Guide
            </button>
            <button
              onClick={() => onNavigate('about-project')}
              className="text-slate-300 hover:text-white transition"
            >
              Project Architecture
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            CodeComplex AI — Academic Capstone Project. Powered by Google Gemini 3.8 Flash.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe Source-As-Text Processing</span>
            </span>
            <span>•</span>
            <span>Client-Safe API Token Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
