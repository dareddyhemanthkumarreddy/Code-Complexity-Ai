import { describe, it, expect } from 'vitest';
import { performStaticAnalysis } from '../src/utils/staticAnalyzer';

describe('Deterministic Static Pattern Analyzer', () => {
  it('identifies constant time O(1) array access without loops or recursion', () => {
    const code = `
def get_element(arr, i):
    if 0 <= i < len(arr):
        return arr[i]
    return None
    `;
    const result = performStaticAnalysis(code, 'python');
    expect(result.loopCount).toBe(0);
    expect(result.hasRecursion).toBe(false);
    expect(result.observations.some((o) => o.includes('No loop constructs'))).toBe(true);
  });

  it('identifies single linear loop O(n)', () => {
    const code = `
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total
    `;
    const result = performStaticAnalysis(code, 'python');
    expect(result.loopCount).toBe(1);
    expect(result.maxNestingLevel).toBe(1);
    expect(result.observations.some((o) => o.includes('Single non-nested loop'))).toBe(true);
  });

  it('identifies nested loops with depth >= 2 for pairwise comparison', () => {
    const code = `
def has_duplicates(arr):
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] == arr[j]:
                return True
    return False
    `;
    const result = performStaticAnalysis(code, 'python');
    expect(result.loopCount).toBe(2);
    expect(result.maxNestingLevel).toBeGreaterThanOrEqual(2);
    expect(result.observations.some((o) => o.includes('nested loop structure'))).toBe(true);
    expect(result.hasEarlyReturn).toBe(true);
  });

  it('detects logarithmic bisection indicators in binary search', () => {
    const code = `
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
    `;
    const result = performStaticAnalysis(code, 'python');
    expect(result.loopCount).toBe(1);
    expect(result.hasLogarithmicIndicators).toBe(true);
    expect(result.observations.some((o) => o.includes('halving or doubling'))).toBe(true);
  });

  it('detects recursion for naive Fibonacci', () => {
    const code = `
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
    `;
    const result = performStaticAnalysis(code, 'python');
    expect(result.hasRecursion).toBe(true);
    expect(result.observations.some((o) => o.includes('Recursive call pattern detected'))).toBe(true);
  });

  it('detects dynamic memory allocations in C++ and Java', () => {
    const cppCode = `
#include <vector>
void test() {
    std::vector<int> dynamicArr;
    int* buffer = (int*)malloc(100 * sizeof(int));
    free(buffer);
}
    `;
    const result = performStaticAnalysis(cppCode, 'cpp');
    expect(result.hasDynamicAllocations).toBe(true);
    expect(result.observations.some((o) => o.includes('Dynamic memory allocations'))).toBe(true);
  });
});
