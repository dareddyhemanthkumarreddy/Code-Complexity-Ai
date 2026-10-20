import type { ExampleProgram } from '../types/analysis';

export const EXAMPLE_PROGRAMS: ExampleProgram[] = [
  {
    id: 'constant-access',
    title: 'Constant Time Access',
    category: 'Elementary',
    expectedComplexity: {
      time: 'O(1)',
      space: 'O(1)',
    },
    descriptions: 'Retrieves an element from an array by direct index offset. No iterations or recursive steps.',
    codeByLanguage: {
      python: `def get_element_at(arr, index):\n    """Retrieves an element by index with bounds checking."""\n    if 0 <= index < len(arr):\n        return arr[index]\n    return None\n\n# Direct index lookup\nresult = get_element_at([10, 20, 30, 40, 50], 2)`,
      cpp: `#include <vector>\n#include <optional>\n\nstd::optional<int> getElementAt(const std::vector<int>& arr, size_t index) {\n    if (index < arr.size()) {\n        return arr[index]; // Direct memory address offset\n    }\n    return std::nullopt;\n}`,
      c: `#include <stdio.h>\n\nint getElementAt(const int arr[], int size, int index, int* out) {\n    if (index >= 0 && index < size) {\n        *out = arr[index];\n        return 1; // Success\n    }\n    return 0; // Out of bounds\n}`,
      java: `public class ConstantAccess {\n    public static Integer getElementAt(int[] arr, int index) {\n        if (index >= 0 && index < arr.length) {\n            return arr[index]; // O(1) indexed lookup\n        }\n        return null;\n    }\n}`,
    },
  },
  {
    id: 'linear-search',
    title: 'Linear Traversal',
    category: 'Single Loop',
    expectedComplexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    descriptions: 'Traverses each element in an array of length n once to compute the cumulative sum or search.',
    codeByLanguage: {
      python: `def calculate_sum(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total\n\n# Single pass over n elements\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nprint(calculate_sum(data))`,
      cpp: `#include <vector>\n\nlong long calculateSum(const std::vector<int>& numbers) {\n    long long total = 0;\n    for (size_t i = 0; i < numbers.size(); ++i) {\n        total += numbers[i];\n    }\n    return total;\n}`,
      c: `#include <stdio.h>\n\nlong long calculateSum(const int numbers[], int n) {\n    long long total = 0;\n    for (int i = 0; i < n; i++) {\n        total += numbers[i];\n    }\n    return total;\n}`,
      java: `public class LinearTraversal {\n    public static long calculateSum(int[] numbers) {\n        long total = 0;\n        for (int num : numbers) {\n            total += num;\n        }\n        return total;\n    }\n}`,
    },
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Logarithmic',
    expectedComplexity: {
      time: 'O(log n)',
      space: 'O(1)',
    },
    descriptions: 'Repeatedly halves the search space on an already sorted sequence until the target is found or boundaries cross.',
    codeByLanguage: {
      python: `def binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    \n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n            \n    return -1`,
      cpp: `#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0;\n    int high = static_cast<int>(arr.size()) - 1;\n    \n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      c: `int binarySearch(const int arr[], int size, int target) {\n    int low = 0;\n    int high = size - 1;\n    \n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`,
      java: `public class BinarySearch {\n    public static int search(int[] arr, int target) {\n        int low = 0;\n        int high = arr.length - 1;\n        \n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n}`,
    },
  },
  {
    id: 'nested-pairs',
    title: 'Nested-Loop Pair Comparison',
    category: 'Quadratic',
    expectedComplexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
    descriptions: 'Iterates through all distinct pairs (i, j) where j > i to detect duplicates or check differences. Sum of 1 to n-1 equals n(n-1)/2 iterations.',
    codeByLanguage: {
      python: `def has_duplicate_pairs(arr):\n    n = len(arr)\n    # Outer loop runs n times\n    for i in range(n):\n        # Inner loop runs n - 1 - i times\n        for j in range(i + 1, n):\n            if arr[i] == arr[j]:\n                return True\n    return False`,
      cpp: `#include <vector>\n\nbool hasDuplicatePairs(const std::vector<int>& arr) {\n    size_t n = arr.size();\n    for (size_t i = 0; i < n; ++i) {\n        for (size_t j = i + 1; j < n; ++j) {\n            if (arr[i] == arr[j]) return true;\n        }\n    }\n    return false;\n}`,
      c: `#include <stdbool.h>\n\nbool hasDuplicatePairs(const int arr[], int n) {\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] == arr[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}`,
      java: `public class DuplicatePairs {\n    public static boolean hasDuplicate(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] == arr[j]) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n}`,
    },
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    category: 'Divide & Conquer',
    expectedComplexity: {
      time: 'O(n log n)',
      space: 'O(n)',
    },
    descriptions: 'Divide-and-conquer sorting algorithm. Recursively splits array into halves (log n depth) and merges them in linear time O(n).',
    codeByLanguage: {
      python: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n        \n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
      cpp: `#include <vector>\n\nvoid merge(std::vector<int>& arr, int l, int m, int r) {\n    int n1 = m - l + 1;\n    int n2 = r - m;\n    std::vector<int> L(n1), R(n2);\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n}\n\nvoid mergeSort(std::vector<int>& arr, int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`,
      c: `#include <stdlib.h>\n\nvoid merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1;\n    int n2 = r - m;\n    int* L = (int*)malloc(n1 * sizeof(int));\n    int* R = (int*)malloc(n2 * sizeof(int));\n    for (int i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) arr[k++] = L[i++];\n        else arr[k++] = R[j++];\n    }\n    while (i < n1) arr[k++] = L[i++];\n    while (j < n2) arr[k++] = R[j++];\n    free(L);\n    free(R);\n}\n\nvoid mergeSort(int arr[], int l, int r) {\n    if (l < r) {\n        int m = l + (r - l) / 2;\n        mergeSort(arr, l, m);\n        mergeSort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`,
      java: `public class MergeSort {\n    public static void sort(int[] arr, int l, int r) {\n        if (l < r) {\n            int m = l + (r - l) / 2;\n            sort(arr, l, m);\n            sort(arr, m + 1, r);\n            merge(arr, l, m, r);\n        }\n    }\n\n    private static void merge(int[] arr, int l, int m, int r) {\n        int n1 = m - l + 1;\n        int n2 = r - m;\n        int[] L = new int[n1];\n        int[] R = new int[n2];\n        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n        int i = 0, j = 0, k = l;\n        while (i < n1 && j < n2) {\n            if (L[i] <= R[j]) arr[k++] = L[i++];\n            else arr[k++] = R[j++];\n        }\n        while (i < n1) arr[k++] = L[i++];\n        while (j < n2) arr[k++] = R[j++];\n    }\n}`,
    },
  },
  {
    id: 'recursive-fibonacci',
    title: 'Naive Recursive Fibonacci',
    category: 'Exponential',
    expectedComplexity: {
      time: 'O(2^n)',
      space: 'O(n)',
    },
    descriptions: 'Unmemoized dual-branching recursive Fibonacci. Generates an exponential call tree with linear call stack depth.',
    codeByLanguage: {
      python: `def fibonacci(n):\n    """Calculates n-th Fibonacci number without memoization."""\n    if n <= 0:\n        return 0\n    if n == 1:\n        return 1\n    # Two recursive branches per invocation\n    return fibonacci(n - 1) + fibonacci(n - 2)`,
      cpp: `int fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    // Dual branching recursion without caching\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
      c: `long long fibonacci(int n) {\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
      java: `public class Fibonacci {\n    public static long fib(int n) {\n        if (n <= 0) return 0;\n        if (n == 1) return 1;\n        // Exponential tree, linear stack\n        return fib(n - 1) + fib(n - 2);\n    }\n}`,
    },
  },
];
