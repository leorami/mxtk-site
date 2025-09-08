import type { IncomingHttpHeaders } from 'http';
import { z } from 'zod';

export type Tier = 'suggest' | 'answer' | 'deep';
export type ModelMeta = {
  provider: 'openai' | 'openrouter';
  name: string;
  pricing?: { in: number; out: number };
};

function parseList(v?: string) {
  return (v || '')
    .split(/[,|]{1,2}|\|\|/g) // support ',', '|', and '||' as separators
    .map((s) => s.trim())
    .filter(Boolean);
}

const PROVIDER = (process.env.AI_PROVIDER as 'openai' | 'openrouter') || 'openai';
// Defaults prefer GPT‑5 family when env not set, with backward-compatible fallbacks
const DEFAULT_MODELS: Record<Tier, string[]> = {
  suggest: ['gpt-5-nano', 'gpt-4o-mini'],
  answer: ['gpt-5-mini', 'gpt-4o'],
  deep: ['gpt-5', 'gpt-4.1'],
};
const TIERS: Record<Tier, string[]> = {
  suggest: parseList(process.env.AI_MODEL_TIER_SUGGEST) || DEFAULT_MODELS.suggest,
  answer: parseList(process.env.AI_MODEL_TIER_ANSWER) || parseList(process.env.AI_MODEL) || DEFAULT_MODELS.answer,
  deep: parseList(process.env.AI_MODEL_TIER_DEEP) || DEFAULT_MODELS.deep,
};
const EMBEDS = process.env.AI_EMBED_MODEL || 'text-embedding-3-large';

const PRICING: Record<string, { in: number; out: number }> = {
  // Approx placeholders; adjust when official pricing updates
  'gpt-5-nano': { in: 0.05, out: 0.15 },
  'gpt-5-mini': { in: 0.3, out: 0.9 },
  'gpt-5': { in: 5.0, out: 15.0 },
  'gpt-4o-mini': { in: 0.15, out: 0.6 },
  'gpt-4o': { in: 5.0, out: 15.0 },
  'gpt-4.1': { in: 5.0, out: 15.0 },
  'text-embedding-3-large': { in: 0.13, out: 0 },
};

export function getHeaders(): IncomingHttpHeaders {
  if (PROVIDER === 'openrouter')
    return {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
      'HTTP-Referer': process.env.OPENROUTER_SITE || 'https://mxtk',
      'X-Title': 'MXTK Sherpa',
    } as unknown as IncomingHttpHeaders;
  const openaiKey = process.env.OPENAI_API_KEY || process.env.openai_api_key || '';
  return { Authorization: `Bearer ${openaiKey}` } as unknown as IncomingHttpHeaders;
}

export function getChatModel(tier: Tier = 'answer'): ModelMeta {
  const list = TIERS[tier].length ? TIERS[tier] : TIERS.answer;
  const name = list[0];
  return { provider: PROVIDER, name, pricing: PRICING[name] };
}

export function getFallbacks(tier: Tier = 'answer'): string[] {
  return TIERS[tier].slice(1);
}

export function getEmbedder() {
  return {
    provider: PROVIDER,
    name: EMBEDS,
    pricing: { in: 0.02, out: 0 },
    async embed(texts: string[]): Promise<number[][]> {
      const useLive = Boolean(process.env.OPENAI_API_KEY || process.env.openai_api_key) && process.env.NODE_ENV !== 'test';
      if (useLive) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10_000);
        try {
          const r = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              ...(getHeaders() as any),
            },
            body: JSON.stringify({ model: EMBEDS, input: texts }),
            signal: controller.signal,
          } as any);
          clearTimeout(timer);
          if (!r.ok) throw new Error(`embed ${r.status}`);
          const j = (await r.json()) as any;
          const data = Array.isArray(j.data) ? j.data : [];
          return data.map((d: any) => (d.embedding as number[]) || []);
        } catch {
          // fall through to mock on error/timeout
        }
      }
      // Deterministic mock embeddings (dev/test or on failure)
      return texts.map((text) => {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        const seed = Math.abs(hash);
        const seededRandom = (s: number) => {
          const x = Math.sin(s) * 10000;
          return x - Math.floor(x);
        };
        const vec = Array.from({ length: 384 }, (_, i) => seededRandom(seed + i) - 0.5);
        const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
        return vec.map((v) => v / norm);
      });
    },
  } as const;
}

// Back-compat schemas and types used by existing routes
export interface ChatResponse {
  ok: boolean;
  answer: string;
  citations?: string[];
  sources?: Array<{ source: string; relevance: number }>;
  error?: string;
}

export const ChatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  mode: z.enum(['learn', 'explore', 'analyze']),
});

export const IngestRequestSchema = z.object({
  content: z.string().min(1),
  source: z.string().min(1).max(120),
});
