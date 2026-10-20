import { z } from 'zod';
import type { AnalysisResult } from '../types/analysis';

export const CodePatternSchema = z.object({
  type: z.string().default('pattern'),
  description: z.string().default('Identified code structure'),
});

export const OptimizationSuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  expectedImpact: z.string().default('Potential efficiency or clarity trade-off'),
});

export const ConfidenceSchema = z.object({
  level: z.enum(['high', 'medium', 'low']).default('medium'),
  reason: z.string().default('Analysis derived from structural algorithm properties and typical assumptions.'),
});

export const TimeComplexitySchema = z.object({
  worstCase: z.string().default('Unknown'),
  averageCase: z.string().nullable().optional().default(null),
  bestCase: z.string().nullable().optional().default(null),
  explanation: z.string().default('No detailed time complexity breakdown provided.'),
});

export const SpaceComplexitySchema = z.object({
  auxiliary: z.string().default('Unknown'),
  explanation: z.string().default('No detailed auxiliary space complexity breakdown provided.'),
});

export const AnalysisResultSchema = z.object({
  language: z.string().default('Code'),
  summary: z.string().default('Algorithm complexity evaluation.'),
  timeComplexity: TimeComplexitySchema.default({
    worstCase: 'Unknown',
    averageCase: null,
    bestCase: null,
    explanation: 'No detailed time complexity breakdown provided.',
  }),
  spaceComplexity: SpaceComplexitySchema.default({
    auxiliary: 'Unknown',
    explanation: 'No detailed auxiliary space complexity breakdown provided.',
  }),
  inputAssumptions: z.array(z.string()).default([]),
  codePatterns: z.array(CodePatternSchema).default([]),
  staticObservations: z.array(z.string()).optional().default([]),
  optimizationSuggestions: z.array(OptimizationSuggestionSchema).default([]),
  limitations: z.array(z.string()).default([]),
  confidence: ConfidenceSchema.default({
    level: 'medium',
    reason: 'Analysis derived from structural algorithm properties and typical assumptions.',
  }),
  analyzedAt: z.string().optional(),
});

/**
 * Validates and safely normalizes raw JSON data from AI or API.
 */
export function validateAnalysisResult(data: unknown): { success: true; data: AnalysisResult } | { success: false; error: string } {
  try {
    const parsed = AnalysisResultSchema.parse(data);
    return { success: true, data: parsed as AnalysisResult };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid analysis response format';
    return { success: false, error: message };
  }
}
