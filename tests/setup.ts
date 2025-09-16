// Minimal React shim for tests so components using the new JSX transform work without explicit import
import * as React from 'react';
import '@testing-library/jest-dom';
// @ts-ignore
(globalThis as any).React = React;

// Polyfill requestAnimationFrame for JSDOM if needed
if (typeof (globalThis as any).requestAnimationFrame === 'undefined') {
  // @ts-ignore
  (globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16) as unknown as number;
  // @ts-ignore
  (globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Shim window.matchMedia for components that query media features in tests
if (typeof (globalThis as any).window !== 'undefined' && typeof (globalThis as any).window.matchMedia === 'undefined') {
  // @ts-ignore
  (globalThis as any).window.matchMedia = (query: string) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as any;
  };
}

// Ensure basepath utilities have a stable hook export in tests
import { vi } from 'vitest';
vi.mock('@/lib/basepath', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    useBasePath: () => '',
  };
});

// Mock next/font/google for component tests rendering RootLayout
vi.mock('next/font/google', () => {
  return {
    Roboto: (opts: any) => ({ className: 'font-roboto', variable: '--font-roboto' }),
    Space_Grotesk: (opts: any) => ({ className: 'font-grotesk', variable: '--font-display' }),
  };
});
