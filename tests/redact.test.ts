import { describe, expect, it } from 'vitest';
import { redactPII } from '../lib/ai/redact';

describe('redactPII', () => {
  it('redacts emails, wallets, phones', () => {
    const s = 'email a@b.com wallet 0x0123456789abcdef0123456789abcdef01234567 phone +1 (555) 123-9876';
    const t = redactPII(s);
    
    expect(t).not.toMatch(/a@b\.com/);
    expect(t).not.toMatch(/0x0123456789abcdef0123456789abcdef01234567/);
    expect(t).not.toMatch(/555/);
  });
  
  it('handles empty strings', () => {
    expect(redactPII('')).toBe('');
    expect(redactPII(null as any)).toBe(null);
  });
  
  it('preserves non-PII content', () => {
    const s = 'This is normal text about MXTK validators and transparency.';
    const t = redactPII(s);
    expect(t).toBe(s);
  });
});
