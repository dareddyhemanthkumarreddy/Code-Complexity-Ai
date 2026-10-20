import { describe, it, expect } from 'vitest';
import { EXAMPLE_PROGRAMS } from '../src/data/examples';
import type { SupportedLanguage } from '../src/types/analysis';

describe('Canonical Algorithm Examples', () => {
  const languages: SupportedLanguage[] = ['python', 'cpp', 'c', 'java'];

  it('contains all 6 required canonical algorithm classes', () => {
    expect(EXAMPLE_PROGRAMS.length).toBe(6);
    const ids = EXAMPLE_PROGRAMS.map((p) => p.id);
    expect(ids).toContain('constant-access');
    expect(ids).toContain('linear-search');
    expect(ids).toContain('binary-search');
    expect(ids).toContain('nested-pairs');
    expect(ids).toContain('merge-sort');
    expect(ids).toContain('recursive-fibonacci');
  });

  it('each example contains valid, non-empty code for Python, C++, C, and Java', () => {
    for (const example of EXAMPLE_PROGRAMS) {
      expect(example.title).toBeTruthy();
      expect(example.expectedComplexity.time).toMatch(/^O\(/);
      expect(example.expectedComplexity.space).toMatch(/^O\(/);

      for (const lang of languages) {
        const code = example.codeByLanguage[lang];
        expect(code, `Code for ${example.id} in ${lang} must exist`).toBeDefined();
        expect(code.trim().length).toBeGreaterThan(20);
      }
    }
  });
});
