import { flagText } from '@/lib/ai/govern/flag';
import { createFlag, upsertPending } from '@/lib/ai/govern/store';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.AI_VECTOR_DIR || './ai_store';

(async () => {
  const chunksPath = path.join(process.cwd(), base, 'chunks.json');
  const exists = await fs
    .stat(chunksPath)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    console.log('No chunks.json found, nothing to scan.');
    return;
  }
  const chunks = JSON.parse(await fs.readFile(chunksPath, 'utf8')) as any[];
  let flagged = 0;
  for (const c of chunks) {
    const res = await flagText(c.text || '', c.meta || {});
    if (res.risk >= 0.5) {
      flagged++;
      await upsertPending({
        id: c.id,
        meta: c.meta,
        risk: res.risk,
        reasons: res.reasons,
        labels: res.labels,
        textHash:
          String((c.text || '').length) +
          '-' +
          Buffer.from((c.text || '').slice(0, 64)).toString('base64'),
      });
      // Also persist governance flag with optional journey/message references
      const textHash =
        String((c.text || '').length) +
        '-' +
        Buffer.from((c.text || '').slice(0, 64)).toString('base64');
      await createFlag({
        source: 'system',
        reason: (res.reasons || []).join('; ') || 'Flagged during scan',
        labels: res.labels,
        journeyId: (c as any)?.meta?.journeyId,
        messageId: (c as any)?.meta?.messageId,
        metadata: { meta: c.meta, textHash },
      } as any);
    }
  }
  console.log('Scan complete. Flagged:', flagged);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});




