/**
 * Lightweight static pattern detection for algorithm source code.
 * Analyzes syntax patterns without code execution to provide quick structural heuristics.
 */

export interface StaticAnalysisSummary {
  loopCount: number;
  maxNestingLevel: number;
  hasRecursion: boolean;
  hasLogarithmicIndicators: boolean;
  hasDynamicAllocations: boolean;
  hasEarlyReturn: boolean;
  observations: string[];
}

export function performStaticAnalysis(code: string, language: string): StaticAnalysisSummary {
  const lines = code.split('\n');
  const observations: string[] = [];

  let loopCount = 0;
  let currentNesting = 0;
  let maxNestingLevel = 0;
  let hasRecursion = false;
  let hasLogarithmicIndicators = false;
  let hasDynamicAllocations = false;
  let hasEarlyReturn = false;

  // Clean comments to avoid false positives
  const sanitized = code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '')
    .replace(/#.*/g, '');

  // Function name detection for recursion check
  const functionNames: string[] = [];
  
  if (language === 'python') {
    const pyFnMatches = sanitized.matchAll(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g);
    for (const match of pyFnMatches) {
      if (match[1]) functionNames.push(match[1]);
    }
  } else {
    // C, C++, Java function definitions
    const cFnMatches = sanitized.matchAll(/(?:void|int|long|double|float|bool|boolean|String|auto|[\w<>[\]]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{/g);
    for (const match of cFnMatches) {
      if (match[1] && !['if', 'for', 'while', 'switch', 'catch'].includes(match[1])) {
        functionNames.push(match[1]);
      }
    }
  }

  // Check for recursion: does the function body invoke itself?
  for (const fn of functionNames) {
    const fnRegex = new RegExp(`\\b${fn}\\s*\\(`, 'g');
    const occurrences = (sanitized.match(fnRegex) || []).length;
    // If the function name appears more than once (once for definition, and inside its body), recursion is probable
    if (occurrences > 1) {
      hasRecursion = true;
      observations.push(`Recursive call pattern detected for function "${fn}".`);
    }
  }

  // Analyze line by line for nesting and loop patterns
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('/*')) continue;

    // Detect loops
    const isFor = /\bfor\b(?:\s*\(|[\s\w,]+in\b)/.test(line);
    const isWhile = /\bwhile\b(?:\s*\(|\s+)/.test(line);

    if (isFor || isWhile) {
      loopCount++;
      currentNesting++;
      if (currentNesting > maxNestingLevel) {
        maxNestingLevel = currentNesting;
      }
    }

    // Check for logarithmic patterns
    if (
      /(?:\/=\s*2|\*=\s*2|>>=\s*1|mid\s*=\s*(?:low|\w+)|high\s*=\s*mid|low\s*=\s*mid|\/\s*2)/i.test(line)
    ) {
      hasLogarithmicIndicators = true;
    }

    // Check for dynamic memory allocations
    if (
      /\b(?:new\s+\w+|malloc\s*\(|calloc\s*\(|vector<|ArrayList|HashMap|HashSet|LinkedList|append\(|push_back\(|list\(|dict\(|set\()\b/.test(line)
    ) {
      hasDynamicAllocations = true;
    }

    // Check for early exit/return in loop
    if (currentNesting > 0 && /\b(?:break|return)\b/.test(line)) {
      hasEarlyReturn = true;
    }

    // Rough brace decrement for C/C++/Java
    if (language !== 'python') {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      if (closeBraces > openBraces && currentNesting > 0) {
        currentNesting = Math.max(0, currentNesting - (closeBraces - openBraces));
      }
    }
  }

  // Synthesize observations
  if (loopCount === 0 && !hasRecursion) {
    observations.push('No loop constructs or direct recursion detected (suggests potential O(1) constant flow if no hidden library iterations).');
  } else if (loopCount === 1 && maxNestingLevel <= 1) {
    observations.push('Single non-nested loop structure observed (often linear O(n) unless step size is non-unit).');
  } else if (maxNestingLevel >= 2) {
    observations.push(`Detected nested loop structure up to depth ${maxNestingLevel} (potential polynomial O(n^k) depending on boundary dependency).`);
  }

  if (hasLogarithmicIndicators) {
    observations.push('Index bisection, halving or doubling patterns detected (indicative of logarithmic O(log n) scaling).');
  }

  if (hasDynamicAllocations) {
    observations.push('Dynamic memory allocations or container expansions detected (indicative of non-constant auxiliary space allocation).');
  } else if (!hasRecursion) {
    observations.push('No obvious heap allocations or unbounded data structures found; likely bounded auxiliary space.');
  }

  if (hasEarlyReturn) {
    observations.push('Early return or loop break statements present (suggests best-case complexity may diverge from worst-case).');
  }

  return {
    loopCount,
    maxNestingLevel,
    hasRecursion,
    hasLogarithmicIndicators,
    hasDynamicAllocations,
    hasEarlyReturn,
    observations,
  };
}
