import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock experience context
vi.mock('@/components/experience/ClientExperience', () => ({
  useExperience: vi.fn().mockReturnValue({ mode: 'learn', setMode: vi.fn() })
}));

// Import component after mocking
import ModeBroker from '@/components/ai/ModeBroker';

describe('ModeBroker', () => {
  beforeEach(() => {
    // Mock timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing (invisible component)', () => {
    const { container } = render(<ModeBroker />);
    expect(container.firstChild).toBeNull();
  });

  it('renders component without crashing', () => {
    expect(() => render(<ModeBroker />)).not.toThrow();
  });

  it('renders as invisible component', () => {
    const { container } = render(<ModeBroker />);
    expect(container.firstChild).toBeNull();
  });
});
