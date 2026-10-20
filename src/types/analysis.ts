export type SupportedLanguage = 'python' | 'cpp' | 'c' | 'java';

export interface CodePattern {
  type: string;
  description: string;
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  expectedImpact: string;
}

export interface AnalysisConfidence {
  level: 'high' | 'medium' | 'low';
  reason: string;
}

export interface TimeComplexity {
  worstCase: string;
  averageCase: string | null;
  bestCase: string | null;
  explanation: string;
}

export interface SpaceComplexity {
  auxiliary: string;
  explanation: string;
}

export interface AnalysisResult {
  language: string;
  summary: string;
  timeComplexity: TimeComplexity;
  spaceComplexity: SpaceComplexity;
  inputAssumptions: string[];
  codePatterns: CodePattern[];
  staticObservations?: string[];
  optimizationSuggestions: OptimizationSuggestion[];
  limitations: string[];
  confidence: AnalysisConfidence;
  analyzedAt?: string;
}

export interface ExampleProgram {
  id: string;
  title: string;
  category: string;
  expectedComplexity: {
    time: string;
    space: string;
  };
  descriptions: string;
  codeByLanguage: Record<SupportedLanguage, string>;
}
