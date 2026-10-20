import type { AnalysisResult } from '../types/analysis';

export interface HealthStatus {
  status: string;
  geminiConfigured: boolean;
  model: string;
}

export async function checkServerHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('Server health check error:', err);
    return {
      status: 'offline',
      geminiConfigured: false,
      model: 'unknown',
    };
  }
}

export async function analyzeAlgorithm(code: string, language: string): Promise<AnalysisResult> {
  const trimmed = code.trim();
  if (!trimmed) {
    throw new Error('Please enter source code to analyze.');
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code: trimmed, language }),
  });

  const data = await response.json().catch(() => ({
    error: `Server returned non-JSON response (${response.status} ${response.statusText})`,
  }));

  if (!response.ok) {
    const errorMessage = data.error || data.details || `Analysis request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as AnalysisResult;
}
