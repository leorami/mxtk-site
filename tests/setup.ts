// Minimal React shim for tests so components using the new JSX transform work without explicit import
import * as React from 'react';
// @ts-ignore
(globalThis as any).React = React;

// Polyfill requestAnimationFrame for JSDOM if needed
if (typeof (globalThis as any).requestAnimationFrame === 'undefined') {
  // @ts-ignore
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16) as unknown as number;
  // @ts-ignore
  (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}
