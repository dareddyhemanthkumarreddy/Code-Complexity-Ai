import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Trash2, 
  BookMarked, 
  Code2, 
  ShieldAlert, 
  Info, 
  Check, 
  Copy, 
  Layers, 
  FileCode,
  Terminal,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { SupportedLanguage } from '../types/analysis';
import { EXAMPLE_PROGRAMS } from '../data/examples';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  onLanguageChange,
  onAnalyze,
  isLoading,
  onClear,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmExampleId, setConfirmExampleId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Line count and character count
  const lineCount = code ? code.split('\n').length : 1;
  const charCount = code.length;

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSelectExample = (exampleId: string) => {
    if (!exampleId) return;
    const example = EXAMPLE_PROGRAMS.find((p) => p.id === exampleId);
    if (!example) return;

    // If user has substantial code written, confirm before replacing
    if (code.trim().length > 30 && code.trim() !== example.codeByLanguage[language]?.trim()) {
      setConfirmExampleId(exampleId);
    } else {
      onChange(example.codeByLanguage[language]);
    }
  };

  const handleConfirmExampleLoad = () => {
    if (!confirmExampleId) return;
    const example = EXAMPLE_PROGRAMS.find((p) => p.id === confirmExampleId);
    if (example) {
      onChange(example.codeByLanguage[language]);
    }
    setConfirmExampleId(null);
  };

  const handleConfirmClear = () => {
    onClear();
    setConfirmClearOpen(false);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to trigger analysis
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && code.trim()) {
        onAnalyze();
      }
    }
    // Tab key indent support
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // When language changes, if the current code matches an existing example's old language code, translate it
  const handleLanguageSwitch = (newLang: SupportedLanguage) => {
    const matchedExample = EXAMPLE_PROGRAMS.find(
      (ex) => ex.codeByLanguage[language]?.trim() === code.trim()
    );
    onLanguageChange(newLang);
    if (matchedExample) {
      onChange(matchedExample.codeByLanguage[newLang]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Workspace Top Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            <span>Workspace</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Non-executing static & AI structural parser
          </span>
        </div>

        {/* Quick Toolbar Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!code}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Copy code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => {
              if (code.trim().length > 0) {
                setConfirmClearOpen(true);
              } else {
                onClear();
              }
            }}
            disabled={!code || isLoading}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear editor code"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout (Desktop ~68% / 32%, Single-column on mobile/tablet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Column: Code Editor (approx 68% / col-span-8) */}
        <div className="lg:col-span-8 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Subheader with Language Tab & Line Info */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">
                {language}
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Press Ctrl+Enter to analyze</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          {/* Editor Area with Line Numbers */}
          <div className="relative flex-1 flex bg-[#0f172a] text-slate-100 font-mono text-sm leading-6 min-h-[360px] sm:min-h-[420px] overflow-hidden">
            {/* Line numbers gutter */}
            <div
              className="py-4 pl-3 pr-2 select-none text-right text-slate-600 bg-[#0b1120] border-r border-slate-800/80 font-mono text-xs w-11 shrink-0 overflow-hidden"
              aria-hidden="true"
            >
              {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
                <div key={i + 1} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={`// Paste or write your ${language.toUpperCase()} algorithm here...\n// e.g., nested loops, binary search, sorting algorithms, recursive calls\n\ndef algorithm(arr):\n    pass`}
              className="flex-1 w-full bg-transparent text-slate-100 placeholder:text-slate-600 p-4 focus:outline-hidden resize-none font-mono text-xs sm:text-sm leading-6 selection:bg-indigo-600/40 tab-size-4 overflow-x-auto whitespace-pre"
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              aria-label="Algorithm source code input"
            />
          </div>

          {/* Bottom Editor Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Tab key indents by 4 spaces</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Max limit: 25,000 characters
            </span>
          </div>
        </div>

        {/* Right Column: Controls, Examples & Specs (approx 32% / col-span-4) */}
        <div className="lg:col-span-4 bg-slate-50/50 p-4 sm:p-5 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Language Selector */}
            <div>
              <label htmlFor="language-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Programming Language
              </label>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2">
                {(
                  [
                    { id: 'python', label: 'Python' },
                    { id: 'cpp', label: 'C++' },
                    { id: 'c', label: 'C' },
                    { id: 'java', label: 'Java' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleLanguageSwitch(lang.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition text-center ${
                      language === lang.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Load Canonical Example */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="example-select" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Preset Algorithms
                </label>
                <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                  <BookMarked className="w-3 h-3" /> 6 Samples
                </span>
              </div>
              <div className="space-y-1.5">
                {EXAMPLE_PROGRAMS.map((item) => {
                  const isSelected = item.codeByLanguage[language]?.trim() === code.trim();
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectExample(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition flex items-center justify-between group ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-medium ring-1 ring-indigo-300/60'
                          : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-100/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">{item.category}</div>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-bold">
                        {item.expectedComplexity.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isLoading || !code.trim()}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 ${
                  isLoading || !code.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-indigo-600/20 transform active:scale-98'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing Algorithm...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Analyze Complexity</span>
                  </>
                )}
              </button>
              {!code.trim() && (
                <p className="text-[11px] text-slate-500 text-center mt-1.5">
                  Enter source code or select an example above to begin.
                </p>
              )}
            </div>
          </div>

          {/* Privacy & Safe Execution Notice */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
              <span>Safe Analysis Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Code is treated strictly as plain text. It is never compiled, sandboxed, or executed on the server. Data is transmitted securely to Google Gemini for asymptotic analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Overwriting Code with Example */}
      {confirmExampleId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Replace Current Code?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  You have custom code in the editor. Loading this example will replace your current editor contents.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmExampleId(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExampleLoad}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Load Example
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clearing Code */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Clear Editor Code?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Are you sure you want to clear the editor? Any unsaved edits will be lost.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Keep Code
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
