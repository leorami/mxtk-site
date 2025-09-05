"use client";
import { useExperience } from '@/components/experience/ClientExperience';
import { GuidePanel } from './GuidePanel';

export default function AIExperienceController() {
  const { mode, setMode } = useExperience();
  const isAIMode = mode === 'ai';

  // Handle closing the AI panel - switch back to build mode
  const handleClose = () => {
    setMode('build');
  };

  if (isAIMode) {
    // When in AI mode, show the full panel
    return <GuidePanel onClose={handleClose} />;
  } else {
    // When not in AI mode, don't show anything - AI is now accessed via experience toggle
    return null;
  }
}
