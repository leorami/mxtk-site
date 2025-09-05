import fetch from 'node-fetch';
import { describe, expect, it } from 'vitest';

const BASE = process.env.BASE_URL || 'http://localhost:2000';

describe('journey API', () => {
  it('creates and retrieves journey', async () => {
    const add = await fetch(`${BASE}/api/ai/journey/add`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        journeyId: null,
        block: {
          id: 'tmp',
          topicKey: 'validators',
          section: 'overview',
          title: 'Validators',
          body: 'body with a@b.com',
          citations: ['X#0'],
          confidence: 0.8
        }
      })
    });
    
    expect(add.ok).toBeTruthy();
    const aj = await add.json();
    const id = aj.id;
    
    const r = await fetch(`${BASE}/api/ai/journey/${id}`);
    const j = await r.json();
    
    expect(j.ok).toBe(true);
    expect(j.journey.blocks[0].body).not.toMatch(/@/);
  }, 20000);
});
