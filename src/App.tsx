import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CodeEditor } from './components/CodeEditor';
import { AnalysisResults } from './components/AnalysisResults';
import { ComplexityGuide } from './components/ComplexityGuide';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { checkServerHealth, analyzeAlgorithm, type HealthStatus } from './services/analysisService';
import type { SupportedLanguage, AnalysisResult } from './types/analysis';
import { EXAMPLE_PROGRAMS } from './data/examples';
import { AlertCircle, XCircle, KeyRound, Sparkles, RefreshCw } from 'lucide-react';

export function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  // Initialize with the linear search canonical example
  const [code, setCode] = useState<string>(
    EXAMPLE_PROGRAMS[1].codeByLanguage.python
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [activeSection, setActiveSection] = useState<string>('workspace');

  const workspaceRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check backend health and Gemini API key status
    checkServerHealth().then((status) => {
      setHealth(status);
    });
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToEditor = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyze = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter source code to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeAlgorithm(trimmed, language);
      setAnalysisResult(result);
      // Smoothly scroll to results dashboard
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please check your network or try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCode = () => {
    setCode('');
    setError(null);
  };

  const handleClearResults = () => {
    setAnalysisResult(null);
    setError(null);
    handleScrollToEditor();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* 4.1 Responsive Header */}
      <Header
        health={health}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* 4.2 Compact Hero Section */}
        <Hero onScrollToEditor={handleScrollToEditor} />

        {/* Global Error Banner if API key missing or request failed */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-950">Analysis Failed</h4>
                  <button
                    onClick={() => setError(null)}
                    className="text-rose-500 hover:text-rose-800 p-1"
                    aria-label="Dismiss error"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-rose-800 leading-relaxed">{error}</p>
                {error.includes('GEMINI_API_KEY') && (
                  <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-rose-600" />
                      <span>How to configure GEMINI_API_KEY:</span>
                    </div>
                    <p className="text-slate-600">
                      Configure your Gemini API key in the AI Studio environment or set <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">GEMINI_API_KEY</code> in your server environment variables.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4.3 Code Analysis Workspace */}
        <div id="workspace" ref={workspaceRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Source Code Analysis Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your language, compose or load an algorithm, and derive asymptotic Big-O bounds.
              </p>
            </div>
            {analysisResult && (
              <button
                onClick={() => {
                  if (resultsRef.current) {
                    resultsRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Jump to Current Results</span>
              </button>
            )}
          </div>

          {/* Code Editor Component */}
          <CodeEditor
            code={code}
            onChange={(val) => {
              setCode(val);
              if (error) setError(null);
            }}
            language={language}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onClear={handleClearCode}
          />

          {/* 4.4 Analysis Results (revealed below editor when complete) */}
          {analysisResult && (
            <div id="results" ref={resultsRef} className="pt-4 scroll-mt-20">
              <AnalysisResults
                result={analysisResult}
                onEditCode={handleScrollToEditor}
                onAnalyzeAgain={handleAnalyze}
                onClearResults={handleClearResults}
              />
            </div>
          )}

          {/* 5. Complexity Reference Guide */}
          <ComplexityGuide />

          {/* 6. About Section */}
          <AboutSection />
        </div>
      </main>

      {/* 7. Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
