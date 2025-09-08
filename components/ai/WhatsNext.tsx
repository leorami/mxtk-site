"use client";
import { useExperience } from '@/components/experience/ClientExperience';
import Card from '@/components/ui/Card';
import { getBasePathUrl } from '@/lib/basepath';
import { useCallback, useEffect, useState } from 'react';

interface Signal {
  viewedSections: string[];
  clicks: string[];
  lastLevel: string;
  timestamp: number;
}

interface NextStep {
  title: string;
  description: string;
  link: string;
  category: string;
  priority: number;
}

export default function WhatsNext() {
  const { mode } = useExperience();
  const [signals, setSignals] = useState<Signal | null>(null);
  const [nextSteps, setNextSteps] = useState<NextStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load signals from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mxtkSignals');
      if (stored) {
        setSignals(JSON.parse(stored));
      }
    } catch (error) {
      // localStorage not available
    }
  }, []);

  // Generate deterministic next steps based on mode
  const generateDeterministicSteps = useCallback((currentMode: string, currentSignals: Signal | null): NextStep[] => {
    const baseSteps: Record<string, NextStep[]> = {
      learn: [
        {
          title: 'How It Works',
          description: 'Understand the core mechanics of MXTK',
          link: '/how-it-works',
          category: 'fundamentals',
          priority: 1
        },
        {
          title: 'Glossary',
          description: 'Learn key terms and concepts',
          link: '/glossary',
          category: 'fundamentals',
          priority: 2
        }
      ],
      build: [
        {
          title: 'How It Works',
          description: 'Deep dive into technical implementation',
          link: '/how-it-works',
          category: 'technical',
          priority: 1
        },
        {
          title: 'Resources',
          description: 'Developer tools and documentation',
          link: '/resources',
          category: 'technical',
          priority: 2
        }
      ],
      operate: [
        {
          title: 'Risk Management',
          description: 'Understand operational risks and mitigation',
          link: '/risks',
          category: 'operational',
          priority: 1
        },
        {
          title: 'Validation',
          description: 'Learn about validation processes',
          link: '/validation',
          category: 'operational',
          priority: 2
        }
      ]
    };

    let steps = baseSteps[currentMode] || [];

    // Apply signal-based filtering if available
    if (currentSignals) {
      // Remove recently viewed sections
      steps = steps.filter(step =>
        !currentSignals.viewedSections.includes(step.link)
      );

      // Rotate categories if we have multiple recent views
      if (currentSignals.viewedSections.length > 2) {
        const recentCategories = currentSignals.viewedSections
          .slice(-3)
          .map(link => steps.find(s => s.link === link)?.category)
          .filter(Boolean);

        // Prioritize different categories
        steps.sort((a, b) => {
          const aRecent = recentCategories.includes(a.category);
          const bRecent = recentCategories.includes(b.category);
          if (aRecent && !bRecent) return 1;
          if (!aRecent && bRecent) return -1;
          return a.priority - b.priority;
        });
      }
    }

    return steps.slice(0, 2); // Show max 2 steps
  }, []);

  // Generate AI-powered next step if no deterministic rules fire
  const generateAIStep = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(getBasePathUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Suggest one specific next step for someone in ${mode} mode. Keep it under 100 words.`,
          mode: 'learn'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.answer) {
          const aiStep: NextStep = {
            title: 'AI Suggestion',
            description: data.answer,
            link: '#',
            category: 'ai-suggested',
            priority: 3
          };
          setNextSteps(prev => [aiStep, ...prev.slice(0, 1)]);
        }
      }
    } catch (error) {
      // Fallback to deterministic steps
    } finally {
      setIsLoading(false);
    }
  }, [mode, isLoading]);

  // Update next steps when mode or signals change
  useEffect(() => {
    const deterministicSteps = generateDeterministicSteps(mode, signals);

    if (deterministicSteps.length > 0) {
      setNextSteps(deterministicSteps);
    } else {
      // No deterministic rules, try AI
      generateAIStep();
    }
  }, [mode, signals, generateDeterministicSteps, generateAIStep]);

  // Capture signal when user interacts
  const captureSignal = useCallback((action: string, value: string) => {
    try {
      const currentSignals = signals || {
        viewedSections: [],
        clicks: [],
        lastLevel: '',
        timestamp: Date.now()
      };

      const updatedSignals: Signal = {
        ...currentSignals,
        timestamp: Date.now()
      };

      if (action === 'view' && !currentSignals.viewedSections.includes(value)) {
        updatedSignals.viewedSections = [...currentSignals.viewedSections, value].slice(-10); // Keep last 10
      } else if (action === 'click') {
        updatedSignals.clicks = [...currentSignals.clicks, value].slice(-10);
      } else if (action === 'level') {
        updatedSignals.lastLevel = value;
      }

      setSignals(updatedSignals);
      localStorage.setItem('mxtkSignals', JSON.stringify(updatedSignals));
    } catch (error) {
      // localStorage not available
    }
  }, [signals]);

  // Handle step click - navigate and capture signal
  const handleStepClick = useCallback((step: NextStep) => {
    captureSignal('click', step.link);
    try {
      window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt: `${step.title}: ${step.description}` } }));
    } catch { }
  }, [captureSignal]);

  // Show error state if something went wrong
  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/20">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">⚠️ Error</div>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </Card>
    );
  }

  if (nextSteps.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">Finding your next steps...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          What's Next
        </h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {mode} mode
        </div>
      </div>

      <div className="space-y-3">
        {nextSteps.map((step, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
            onClick={() => handleStepClick(step)}
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {step.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
            <div className="text-gray-400 dark:text-gray-300">
              →
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
            AI thinking...
          </div>
        </div>
      )}
    </Card>
  );
}
