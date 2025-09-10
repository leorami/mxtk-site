"use client";
import { useEffect, useState } from 'react';

export default function Note() {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load note from localStorage on mount
  useEffect(() => {
    try {
      const savedNote = localStorage.getItem('mxtk_note');
      if (savedNote) setNote(savedNote);
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save note to localStorage
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    setNote(newNote);
    setStatus('saving');
    
    // Simple debounce
    setTimeout(() => {
      try {
        localStorage.setItem('mxtk_note', newNote);
        setStatus('saved');
      } catch (e) {
        // Ignore storage errors
      }
    }, 500);
  };

  return (
    <div>
      <textarea
        className="w-full min-h-[120px] rounded-lg border p-2 bg-white/90 text-slate-900 placeholder:text-slate-500 dark:bg-slate-900/80 dark:text-slate-100 dark:border-white/10"
        placeholder="Write a note here..."
        value={note}
        onChange={handleChange}
      />
      <div className="mt-1 text-xs opacity-70" aria-live="polite">
        {status === 'saving' && 'Saving...'}
        {status === 'saved' && 'Saved'}
      </div>
    </div>
  );
}
