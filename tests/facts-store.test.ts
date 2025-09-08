import { describe, it, expect, vi } from 'vitest';
import { computeEtag, getFacts, putFacts, bumpVersion } from '../lib/facts/store';
import type { FactsDoc } from '../lib/facts/types';
import * as fsModule from 'fs';

describe('facts store', () => {
  it('returns minimal default if missing without writing', async () => {
    const doc = await getFacts('/path/does/not/exist.json');
    expect(doc.data.project.name).toBe('MXTK');
  });

  it('atomic write uses rename', async () => {
    const spy = vi.spyOn(fsModule.promises as any, 'rename');
    const tmpFile = `./ai_store/facts.test.${Date.now()}.json`;
    const doc: FactsDoc = { version: 1, updatedAt: Date.now(), data: { project: { name: 'MXTK' } } };
    await putFacts(doc, tmpFile);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('stable ETag for identical content and changes when content changes', () => {
    const base: FactsDoc = { version: 1, updatedAt: 1000, data: { project: { name: 'MXTK' } } };
    const a = computeEtag(base);
    const b = computeEtag({ ...base });
    expect(a).toBe(b);
    const c = computeEtag({ ...base, data: { project: { name: 'MXTK 2' } } });
    expect(c).not.toBe(a);
  });

  it('bumpVersion increments version and updates timestamp', () => {
    const before: FactsDoc = { version: 1, updatedAt: 1, data: { project: { name: 'MXTK' } } };
    const after = bumpVersion(before);
    expect(after.version).toBe(2);
    expect(after.updatedAt).toBeGreaterThan(before.updatedAt);
  });
});


