import { describe, it, expect } from 'vitest';
import { mergeBlock, blockFromAnswer } from '../lib/ai/journey';
import type { JourneyDoc } from '../lib/ai/store/fileStore';

describe('mergeBlock', () => {
  it('replaces with higher confidence and preserves pinned', () => {
    const doc: JourneyDoc = {
      id: 'x',
      createdAt: '',
      updatedAt: '',
      blocks: [{
        id: 'a',
        topicKey: 'validators',
        section: 'overview',
        title: 't',
        body: 'b',
        citations: [],
        confidence: 0.5,
        pinned: true
      }]
    };
    
    const blk = blockFromAnswer('new', [], { section: 'overview', topicKey: 'validators', confidence: 0.9 });
    const out = mergeBlock(doc, blk);
    
    expect(out.blocks.length).toBe(1);
    expect(out.blocks[0].confidence).toBe(0.9);
    expect(out.blocks[0].pinned).toBe(true);
  });
});
