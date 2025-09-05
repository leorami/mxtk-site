'use client';

// Wave 4: Guide dock and ModeBroker moved into GuideDrawer
import WhatsNext from '@/components/ai/WhatsNext';
import { getBasePathUrl } from '@/lib/basepath';
import AppImage from '@/components/ui/AppImage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JourneyBootstrap() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Simple client-side effect
  useEffect(() => {
    setIsClient(true);
    
    // Check for existing journey ID
    try {
      const existingId = localStorage.getItem('mxtkJourneyId');
      if (existingId && !hasNavigated) {
        setHasNavigated(true);
        router.push(getBasePathUrl(`/journey/${existingId}`));
        return;
      }
    } catch (error) {
      console.warn('localStorage not available:', error);
    }
  }, [router, hasNavigated]);

  // Show loading state during navigation check
  if (!isClient || hasNavigated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // Render the adaptive home shell
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your MXTK Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start exploring MXTK with AI guidance. Ask questions, build knowledge, and track your progress.
          </p>
        </div>

        {/* What's Next Strip (heuristic-first) */}
        <div className="mb-8">
          <WhatsNext />
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Ready to Begin?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">
              Your AI guide is ready to help you explore MXTK. Ask your first question to start building your personalized journey.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
              <AppImage src="icons/ui/icon-lightbulb.svg" alt="" width={16} height={16} className="w-4 h-4" />
              Tip: Try asking "What is MXTK?" or "How do validator incentives work?"
            </div>
            <div className="mt-6">
              <button
                onClick={() => {
                  try { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt: 'What is MXTK?' } })) } catch {}
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                aria-label="Open Sherpa"
              >
                <AppImage src="icons/ai/icon-sherpa.svg" alt="" width={16} height={16} className="w-4 h-4" />
                Open Sherpa
              </button>
            </div>
          </div>
        </div>
        {/* Wave 4: Drawer is mounted globally via GuideHost */}
      </div>
    </div>
  );
}
