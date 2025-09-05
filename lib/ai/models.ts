import { z } from 'zod';

// Core AI configuration
export const AI_CONFIG = {
  maxTokens: 8192,
  temperature: 0.7,
  maxChunks: 8,
  chunkSize: 4000,
  chunkOverlap: 200,
} as const;

// Types
export interface EmbeddingVector extends Array<number> {}

export interface Chunk {
  id: string;
  text: string;
  meta: {
    source: string;
    section?: string;
    page?: number;
  };
}

export interface ChatMessage {
  message: string;
  mode: 'learn' | 'explore' | 'analyze';
}

export interface ChatResponse {
  ok: boolean;
  answer: string;
  citations?: string[];
  sources?: Array<{
    source: string;
    relevance: number;
  }>;
  error?: string;
}

// Mock embedder for development - in production this would use a real embedding model
export function getEmbedder() {
  return {
    async embed(texts: string[]): Promise<EmbeddingVector[]> {
      // Create deterministic embeddings based on text content
      return texts.map(text => {
        // Simple hash function to create consistent seed from text
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Use seeded random for consistent embeddings
        const seed = Math.abs(hash);
        const seededRandom = (s: number) => {
          const x = Math.sin(s) * 10000;
          return x - Math.floor(x);
        };
        
        const vec = Array.from({ length: 384 }, (_, i) => 
          seededRandom(seed + i) - 0.5
        );
        
        // Add some semantic-like features based on text content
        const lowerText = text.toLowerCase();
        if (lowerText.includes('transparency')) vec[0] += 0.3;
        if (lowerText.includes('validator')) vec[1] += 0.3;
        if (lowerText.includes('oracle')) vec[2] += 0.3;
        if (lowerText.includes('tokeniz')) vec[3] += 0.3;
        if (lowerText.includes('mineral')) vec[4] += 0.3;
        if (lowerText.includes('mxtk')) vec[5] += 0.3;
        if (lowerText.includes('risk')) vec[6] += 0.3;
        if (lowerText.includes('compliance')) vec[7] += 0.3;
        
        // Normalize
        const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
        return vec.map(val => val / norm);
      });
    }
  };
}

// Schema validation
export const ChatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  mode: z.enum(['learn', 'explore', 'analyze']),
});

export const IngestRequestSchema = z.object({
  content: z.string().min(1),
  source: z.string().min(1),
  metadata: z.object({
    section: z.string().optional(),
    page: z.number().optional(),
  }).optional(),
});
