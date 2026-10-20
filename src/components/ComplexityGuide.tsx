import React, { useState } from 'react';
import { BookOpen, Layers, BarChart3, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComplexityEntry {
  notation: string;
  name: string;
  example: string;
  color: string;
  badgeBg: string;
  description: string;
  practicalScale: string;
}

const COMPLEXITY_CLASSES: ComplexityEntry[] = [
  {
    notation: 'O(1)',
    name: 'Constant',
    example: 'Array indexing, hash map lookup (avg), stack push/pop',
    color: '#15803d',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Execution time remains identical regardless of whether the dataset contains 10 items or 10 billion items.',
    practicalScale: 'Excellent — instant response regardless of input scale.',
  },
  {
    notation: 'O(log n)',
    name: 'Logarithmic',
    example: 'Binary search, balanced binary search tree lookups',
    color: '#059669',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'Each step halves or divides the remaining problem space. For n = 1,000,000, requires roughly ~20 operations.',
    practicalScale: 'Very Good — scales effortlessly to massive datasets.',
  },
  {
    notation: 'O(n)',
    name: 'Linear',
    example: 'Array traversal, linear search, finding minimum/maximum',
    color: '#4f46e5',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Execution time grows in direct proportion to input size. Doubling n doubles the operations.',
    practicalScale: 'Fair — practical for millions of items with light per-element work.',
  },
  {
    notation: 'O(n log n)',
    name: 'Linearithmic',
    example: 'Merge sort, Heapsort, standard library quicksort (avg)',
    color: '#d97706',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Common in efficient divide-and-conquer algorithms. The theoretical lower bound for general comparison sorts.',
    practicalScale: 'Good — widely used standard for sorting up to very large arrays.',
  },
  {
    notation: 'O(n²)',
    name: 'Quadratic',
    example: 'Pairwise nested loops, bubble sort, selection sort',
    color: '#ea580c',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Every element is compared or paired with every other element. Tenfold increase in n results in 100x operations.',
    practicalScale: 'Caution — viable for n <= 5,000, stalls dramatically for large n.',
  },
  {
    notation: 'O(2^n)',
    name: 'Exponential',
    example: 'Naive recursive Fibonacci, generating all subsets, brute-force TSP',
    color: '#b91c1c',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Operations double with every single additional input element. Completely infeasible for n > 40 without pruning.',
    practicalScale: 'Severe — intractable for moderate or large input sizes.',
  },
];

export const ComplexityGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');

  return (
    <section id="reference-guide" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Algorithmic Complexity Reference Guide
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard Big-O growth classes, canonical examples, and asymptotic scaling characteristics.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'table' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reference Table
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'chart' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Growth Curves
          </button>
        </div>
      </div>

      {activeTab === 'table' ? (
        /* Reference Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Complexity</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Typical Example</th>
                <th className="py-3 px-4">Behavior & Scaling</th>
                <th className="py-3 px-4">Practical Feasibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPLEXITY_CLASSES.map((cls) => (
                <tr key={cls.notation} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-sm">
                    <span className={`inline-block px-2.5 py-1 rounded-md border font-mono ${cls.badgeBg}`}>
                      {cls.notation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {cls.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {cls.example}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-xs">
                    {cls.description}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-snug">
                    {cls.practicalScale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Responsive SVG Growth Curves Chart View */
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">Asymptotic Growth Rate Comparison: Operations f(n) vs Input Size (n)</span>
              <span>Theoretical Curves</span>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full aspect-[16/9] max-h-72 relative">
              <svg
                viewBox="0 0 600 320"
                className="w-full h-full select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Grid lines */}
                <line x1="60" y1="20" x2="60" y2="280" stroke="#334155" strokeWidth="2" />
                <line x1="60" y1="280" x2="580" y2="280" stroke="#334155" strokeWidth="2" />

                <line x1="60" y1="215" x2="580" y2="215" stroke="#1e293b" strokeDasharray="4" />
                <line x1="60" y1="150" x2="580" y2="150" stroke="#1e293b" strokeDasharray="4" />
                <line x1="60" y1="85" x2="580" y2="85" stroke="#1e293b" strokeDasharray="4" />

                {/* Axes labels */}
                <text x="25" y="150" fill="#94a3b8" fontSize="11" transform="rotate(-90 25 150)" textAnchor="middle">
                  Operations (Time)
                </text>
                <text x="320" y="305" fill="#94a3b8" fontSize="11" textAnchor="middle">
                  Input Elements (n) →
                </text>

                {/* O(1) Constant - flat line near bottom */}
                <path d="M 60 270 L 570 270" fill="none" stroke="#15803d" strokeWidth="3" />
                <text x="520" y="262" fill="#22c55e" fontSize="11" fontWeight="bold">O(1)</text>

                {/* O(log n) Logarithmic - slight curve */}
                <path d="M 60 270 Q 180 250, 570 230" fill="none" stroke="#0d9488" strokeWidth="3" />
                <text x="520" y="222" fill="#14b8a6" fontSize="11" fontWeight="bold">O(log n)</text>

                {/* O(n) Linear - diagonal */}
                <path d="M 60 275 L 570 140" fill="none" stroke="#6366f1" strokeWidth="3" />
                <text x="520" y="132" fill="#818cf8" fontSize="11" fontWeight="bold">O(n)</text>

                {/* O(n log n) Linearithmic - slightly steeper */}
                <path d="M 60 275 Q 320 200, 520 70" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <text x="470" y="62" fill="#fbbf24" fontSize="11" fontWeight="bold">O(n log n)</text>

                {/* O(n²) Quadratic - parabola */}
                <path d="M 60 275 Q 240 260, 340 30" fill="none" stroke="#f97316" strokeWidth="3" />
                <text x="320" y="25" fill="#fb923c" fontSize="11" fontWeight="bold">O(n²)</text>

                {/* O(2^n) Exponential - near vertical rise */}
                <path d="M 60 275 Q 120 270, 160 30" fill="none" stroke="#ef4444" strokeWidth="3" />
                <text x="145" y="25" fill="#f87171" fontSize="11" fontWeight="bold">O(2^n)</text>
              </svg>
            </div>
          </div>

          {/* Color legend pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {COMPLEXITY_CLASSES.map((cls) => (
              <div key={cls.notation} className="flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cls.color }} />
                <span className="font-mono font-bold text-slate-800">{cls.notation}</span>
                <span className="text-slate-500">({cls.name})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900">Asymptotic Caveat: </strong>
          The table and curves illustrate standard asymptotic theoretical classes as <span className="font-mono">n → ∞</span>. In concrete real-world code, hardware caching, constant factor coefficients, memory access strides, and branch prediction can cause an <span className="font-mono">O(n)</span> implementation to outperform an <span className="font-mono">O(1)</span> lookup for small input sizes.
        </p>
      </div>
    </section>
  );
};
