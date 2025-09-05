import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock experience context
vi.mock('@/components/experience/ClientExperience', () => ({
  useExperience: vi.fn().mockReturnValue({ mode: 'learn' })
}));

// Mock basepath helper
vi.mock('@/lib/basepath', () => ({
  getBasePathUrl: (path: string) => path
}));

// Mock fetch
global.fetch = vi.fn();

// Import component after mocking
import WhatsNext from '@/components/ai/WhatsNext';

describe('WhatsNext', () => {
  beforeEach(() => {
    // Reset localStorage mock for each test
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn()
      },
      writable: true
    });
    (fetch as any).mockReset();
  });

  it('renders content immediately when deterministic steps are available', () => {
    render(<WhatsNext />);
    expect(screen.getByText('What\'s Next')).toBeDefined();
    expect(screen.getByText('How It Works')).toBeDefined();
    expect(screen.getByText('Glossary')).toBeDefined();
  });

  it('renders basic component structure', () => {
    render(<WhatsNext />);
    expect(screen.getByText('What\'s Next')).toBeDefined();
    expect(screen.getByText('learn mode')).toBeDefined();
  });

  it('renders component without crashing', () => {
    render(<WhatsNext />);
    expect(screen.getByText('What\'s Next')).toBeDefined();
  });
});
