import { describe, it, expect } from 'vitest';
import { validateAnalysisResult } from '../src/utils/schema';

describe('Analysis Result Schema Validation', () => {
  it('successfully validates complete structured AI analysis object', () => {
    const samplePayload = {
      language: 'Python',
      summary: 'Linear search traversing array of n items.',
      timeComplexity: {
        worstCase: 'O(n)',
        averageCase: 'O(n)',
        bestCase: 'O(1)',
        explanation: 'Single iteration pass across elements with early exit when target matched.',
      },
      spaceComplexity: {
        auxiliary: 'O(1)',
        explanation: 'Only primitive index variables maintained.',
      },
      inputAssumptions: ['Array contains n items'],
      codePatterns: [
        { type: 'loop', description: 'Iterates through input list' },
        { type: 'early-return', description: 'Returns immediately on match' },
      ],
      optimizationSuggestions: [
        {
          title: 'Hash Set Lookup',
          description: 'If membership checks occur repeatedly, convert collection to hash set.',
          expectedImpact: 'Reduces lookup time from O(n) to O(1) avg with O(n) space trade-off.',
        },
      ],
      limitations: ['Assumes target equality check takes O(1)'],
      confidence: {
        level: 'high',
        reason: 'Deterministic single loop without external API dependencies.',
      },
    };

    const validated = validateAnalysisResult(samplePayload);
    expect(validated.success).toBe(true);
    if (validated.success) {
      expect(validated.data.timeComplexity.worstCase).toBe('O(n)');
      expect(validated.data.confidence.level).toBe('high');
    }
  });

  it('populates default fallbacks for missing optional fields', () => {
    const minimalPayload = {
      timeComplexity: {
        worstCase: 'O(n log n)',
        explanation: 'Merge sort recursion with linear merge operations.',
      },
      spaceComplexity: {
        auxiliary: 'O(n)',
        explanation: 'Requires auxiliary arrays during merge phase.',
      },
    };

    const validated = validateAnalysisResult(minimalPayload);
    expect(validated.success).toBe(true);
    if (validated.success) {
      expect(validated.data.inputAssumptions).toEqual([]);
      expect(validated.data.optimizationSuggestions).toEqual([]);
      expect(validated.data.confidence.level).toBe('medium');
    }
  });

  it('rejects invalid non-object payload', () => {
    const validated = validateAnalysisResult('not an object');
    expect(validated.success).toBe(false);
  });
});
