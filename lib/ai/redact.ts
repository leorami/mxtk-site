export function redactPII(s: string) {
  if (!s) return s;
  let t = s;
  
  // email
  t = t.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');
  
  // wallet-ish (0x + 40 hex)
  t = t.replace(/0x[a-fA-F0-9]{40}\b/g, '[redacted-wallet]');
  
  // phone (rough)
  t = t.replace(/\b\+?\d[\d\s().-]{7,}\b/g, '[redacted-phone]');
  
  return t;
}
