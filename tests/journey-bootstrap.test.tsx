import React from 'react';
import JourneyBootstrap from '@/components/ai/JourneyBootstrap';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock basepath helper
vi.mock('@/lib/basepath', () => ({
  getBasePathUrl: (path: string) => path
}));

// Mock experience context
vi.mock('@/components/experience/ClientExperience', () => ({
  useExperience: vi.fn().mockReturnValue({ mode: 'learn' })
}));

// Mock child components that use useExperience
vi.mock('@/components/ai/GuideDock', () => ({
  default: () => <div data-testid="guide-dock">Guide Dock</div>
}));

vi.mock('@/components/ai/WhatsNext', () => ({
  default: () => <div data-testid="whats-next">What's Next</div>
}));

vi.mock('@/components/ai/ModeBroker', () => ({
  default: () => <div data-testid="mode-broker">Mode Broker</div>
}));

describe('JourneyBootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders journey shell when no journeyId in localStorage', async () => {
    // Mock localStorage to return null
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(<JourneyBootstrap />);

    // Wait for client-side effect
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.getByText('Your MXTK Journey')).toBeDefined();
    expect(screen.getByText('Ready to Begin?')).toBeDefined();
  });

  it('handles localStorage errors gracefully', async () => {
    // Mock localStorage to throw error
    const mockLocalStorage = {
      getItem: vi.fn().mockImplementation(() => {
        throw new Error('localStorage not available');
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(<JourneyBootstrap />);

    // Wait for client-side effect
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(screen.getByText('Your MXTK Journey')).toBeDefined();
  });

  it('renders adaptive home shell with all components', async () => {
    // Mock localStorage to return null
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(<JourneyBootstrap />);

    // Wait for client-side effect
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check main content
    expect(screen.getByText('Your MXTK Journey')).toBeDefined();
    expect(screen.getByText(/Start exploring MXTK with AI guidance/)).toBeDefined();
    expect(screen.getByText('Ready to Begin?')).toBeDefined();
    expect(screen.getByText(/Your AI guide is ready to help/)).toBeDefined();

    // Check for component placeholders (these will be rendered by child components)
    expect(screen.getByTestId('whats-next')).toBeDefined();
    expect(screen.getByTestId('guide-dock')).toBeDefined();
    expect(screen.getByTestId('mode-broker')).toBeDefined();
  });

  it('renders main content structure correctly', async () => {
    // Mock localStorage to return null
    const mockLocalStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

    render(<JourneyBootstrap />);

    // Wait for client-side effect
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check that the component renders without crashing
    expect(screen.getByText('Your MXTK Journey')).toBeDefined();
    expect(screen.getByText('Ready to Begin?')).toBeDefined();
  });
});
