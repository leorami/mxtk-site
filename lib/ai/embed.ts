import { getEmbedder } from '@/lib/ai/models';
import { estimateUSD, logCost } from '@/lib/ai/ops/costs';

export async function embedAndLog(texts: string[], route: string) {
  const embedder = getEmbedder() as any;
  const embeddings = texts.length ? await embedder.embed(texts) : [];
  const tokensIn = Math.ceil(texts.join(' ').length / 4);
  const usd = estimateUSD(tokensIn, 0, embedder.pricing);
  await logCost({ ts: new Date().toISOString(), kind: 'embed', model: embedder.name, tier: undefined, tokens: { in: tokensIn, out: 0 }, usd, route });
  return embeddings;
}


