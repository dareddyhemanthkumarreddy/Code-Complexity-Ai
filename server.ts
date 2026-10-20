import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { performStaticAnalysis } from './src/utils/staticAnalyzer';
import { validateAnalysisResult } from './src/utils/schema';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''),
    model: 'gemini-3.8-flash',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Code analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter source code to analyze.' });
    }

    if (code.length > 25000) {
      return res.status(400).json({
        error: 'Source code exceeds maximum allowed length of 25,000 characters for analysis.',
      });
    }

    const selectedLang = typeof language === 'string' && language ? language : 'python';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please set your Gemini API key in the environment variables or AI Studio Secrets panel.',
      });
    }

    // Run deterministic static pattern analysis to complement the AI
    const staticSummary = performStaticAnalysis(code, selectedLang.toLowerCase());

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are an expert algorithm analysis assistant. Analyze the provided source code rigorously.
Infer input-size variables, identify important execution patterns, and derive asymptotic time and auxiliary space complexity.
Do not merely count loops. Consider loop bounds, recursion, conditionals, data structures, and relevant assumptions.
Distinguish worst-case, average-case, and best-case behavior only when justified.
If the code is incomplete, ambiguous, or too complex to analyze reliably, identify the uncertainty and explain why in the limitations and confidence fields.
Never invent code behavior. Return only a valid JSON object matching the requested schema.`;

    const userPrompt = `Analyze this ${selectedLang} source code:
\`\`\`${selectedLang}
${code}
\`\`\`

Static analysis observations detected before AI reasoning:
${staticSummary.observations.map(obs => `- ${obs}`).join('\n')}

Derive:
1. Summary description of the algorithm.
2. Time complexity: worst-case (required, e.g. O(1), O(log n), O(n), O(n log n), O(n²), O(2^n)), average-case (if applicable or null), best-case (if applicable or null), and detailed explanation of the steps and mathematical summation/recurrence.
3. Auxiliary space complexity: extra memory excluding the input storage (e.g. O(1), O(n), O(log n)), with explanation of stack frames or heap allocations.
4. Input assumptions (e.g., array length is n, numbers fit in standard integers, random access).
5. Identified code patterns (loops, nested-loops, recursion, bisection, dynamic allocation, early-returns).
6. Actionable optimization suggestions with trade-off analysis (keep empty if algorithm is already optimal for its constraints).
7. Limitations, edge cases, and uncertainties (unbounded inputs, library call overheads, non-deterministic branches).
8. Confidence rating (high, medium, or low) with clear qualitative justification.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            summary: { type: Type.STRING },
            timeComplexity: {
              type: Type.OBJECT,
              properties: {
                worstCase: { type: Type.STRING },
                averageCase: { type: Type.STRING, nullable: true },
                bestCase: { type: Type.STRING, nullable: true },
                explanation: { type: Type.STRING },
              },
              required: ['worstCase', 'explanation'],
            },
            spaceComplexity: {
              type: Type.OBJECT,
              properties: {
                auxiliary: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['auxiliary', 'explanation'],
            },
            inputAssumptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            codePatterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['type', 'description'],
              },
            },
            optimizationSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  expectedImpact: { type: Type.STRING },
                },
                required: ['title', 'description', 'expectedImpact'],
              },
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            confidence: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                reason: { type: Type.STRING },
              },
              required: ['level', 'reason'],
            },
          },
          required: [
            'language',
            'summary',
            'timeComplexity',
            'spaceComplexity',
            'inputAssumptions',
            'codePatterns',
            'optimizationSuggestions',
            'limitations',
            'confidence',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      // Strip any accidental markdown fences if returned
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanJson);
    }

    const validation = validateAnalysisResult(parsedJson);
    if (!validation.success) {
      return res.status(502).json({
        error: 'The AI model returned an unexpected response structure.',
        details: validation.error,
      });
    }

    // Attach static analysis observations and current timestamp
    const finalResult = {
      ...validation.data,
      staticObservations: staticSummary.observations,
      analyzedAt: new Date().toISOString(),
    };

    return res.json(finalResult);
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : String(err);
    console.error('Analysis error:', rawMessage);

    let userFriendlyError = 'Failed to analyze code due to an internal server error or API issue.';
    let statusCode = 500;

    if (rawMessage.includes('503') || rawMessage.includes('high demand') || rawMessage.includes('UNAVAILABLE')) {
      userFriendlyError = 'The AI model is currently experiencing high demand on Google servers. Spikes are temporary—please wait a few seconds and click Analyze again.';
      statusCode = 503;
    } else if (rawMessage.includes('429') || rawMessage.includes('RESOURCE_EXHAUSTED')) {
      userFriendlyError = 'API quota rate limit reached. Please wait a moment before sending another analysis request.';
      statusCode = 429;
    } else if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('403')) {
      userFriendlyError = 'Invalid GEMINI_API_KEY. Please verify your Gemini API key in the environment configuration.';
      statusCode = 403;
    }

    return res.status(statusCode).json({
      error: userFriendlyError,
      details: rawMessage,
    });
  }
});

// Setup dev middleware or static serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodeComplex AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
