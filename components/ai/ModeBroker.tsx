'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useExperience } from '@/components/experience/ClientExperience';

interface ModeBrokerProps {
  onModeChange?: (newMode: string, confidence: number) => void;
  confidenceThreshold?: number;
  debounceMs?: number;
}

export default function ModeBroker({ 
  onModeChange, 
  confidenceThreshold = 0.8, 
  debounceMs = 400 
}: ModeBrokerProps) {
  const { mode, setMode } = useExperience();
  const lastModeRef = useRef(mode);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  // Simulate AI classifier confidence (in real implementation, this would come from AI analysis)
  const getClassifierConfidence = useCallback((userInput: string, currentMode: string): number => {
    // This is a placeholder - in production, this would be AI-driven
    const modeKeywords = {
      learn: ['what', 'how', 'explain', 'understand', 'learn', 'basics', 'concept'],
      build: ['build', 'develop', 'implement', 'code', 'technical', 'api', 'integration'],
      operate: ['operate', 'manage', 'risk', 'validate', 'monitor', 'maintain', 'production']
    };

    const input = userInput.toLowerCase();
    const keywords = modeKeywords[currentMode as keyof typeof modeKeywords] || [];
    
    // Simple keyword matching for demo purposes
    const matches = keywords.filter(keyword => input.includes(keyword)).length;
    return Math.min(0.9, 0.3 + (matches * 0.2)); // Base 0.3 + 0.2 per keyword match
  }, []);

  // Debounced mode change with confidence threshold
  const debouncedModeChange = useCallback((newMode: string, confidence: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (confidence >= confidenceThreshold && newMode !== lastModeRef.current && !isProcessingRef.current) {
        isProcessingRef.current = true;
        
        try {
          setMode(newMode as any);
          lastModeRef.current = newMode;
          onModeChange?.(newMode, confidence);
        } catch (error) {
          console.warn('Mode change failed:', error);
        } finally {
          isProcessingRef.current = false;
        }
      }
    }, debounceMs);
  }, [confidenceThreshold, debounceMs, setMode, onModeChange]);

  // Listen for user interactions that might indicate mode changes
  useEffect(() => {
    const handleUserInteraction = (event: Event) => {
      // Skip if we're already processing a mode change
      if (isProcessingRef.current) return;

      // Analyze user input for mode changes
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        const input = event.target.value;
        if (input.length > 10) { // Only analyze substantial input
          const currentMode = lastModeRef.current;
          
          // Get confidence for potential mode changes
          const modes: Array<'learn' | 'build' | 'operate'> = ['learn', 'build', 'operate'];
          let bestMode = currentMode;
          let bestConfidence = 0;

          modes.forEach(mode => {
            if (mode !== currentMode) {
              const confidence = getClassifierConfidence(input, mode);
              if (confidence > bestConfidence) {
                bestConfidence = confidence;
                bestMode = mode;
              }
            }
          });

          // Only suggest change if confidence is significantly higher
          if (bestConfidence > getClassifierConfidence(input, currentMode) + 0.1) {
            debouncedModeChange(bestMode, bestConfidence);
          }
        }
      }
    };

    // Add event listeners for user input
    document.addEventListener('input', handleUserInteraction);
    document.addEventListener('change', handleUserInteraction);

    return () => {
      document.removeEventListener('input', handleUserInteraction);
      document.removeEventListener('change', handleUserInteraction);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [debouncedModeChange, getClassifierConfidence]);

  // Update lastModeRef when mode changes externally
  useEffect(() => {
    lastModeRef.current = mode;
  }, [mode]);

  // This component doesn't render anything - it's purely for mode management
  return null;
}
