'use client';

// Pin-to-Home removed per UI request
import AddToHomeButton from '@/components/ai/AddToHomeButton';
import AppImage from '@/components/ui/AppImage';
import Card from '@/components/ui/Card';
import { getApiPath, getBasePathUrl } from '@/lib/basepath';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  level?: string;
  block?: any;
}

interface GuidePanelProps {
  className?: string;
  onClose?: () => void;
}

export function GuidePanel({ className, onClose, embedded, prefillPrompt }: GuidePanelProps & { embedded?: boolean; prefillPrompt?: string }) {
  const [isOpen, setIsOpen] = useState(onClose ? true : false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestHome, setSuggestHome] = useState(false);
  const [input, setInput] = useState('');
  // Mode controls removed from panel; keep default context internal
  const [mode] = useState<'learn' | 'explore' | 'analyze'>('learn');
  const [isLoading, setIsLoading] = useState(false);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [quickQuestions, setQuickQuestions] = useState<string[]>([
    'What is MXTK?',
    'How does MXTK ensure transparency?',
    'Who can use MXTK?',
  ]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const messageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    try {
      const scroller = document.querySelector('.guide-drawer .drawer-body') as HTMLElement | null;
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior, block: 'end' });
        // Ensure container also snaps exactly to bottom in case of rounding
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
        return;
      }
      if (scroller) scroller.scrollTo({ top: scroller.scrollHeight, behavior });
    } catch { }
  }, []);

  // Minimal markdown-like formatter (bold, italic, lists, line breaks)
  const formatMessageHtml = (text: string): string => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const bold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const italic = bold.replace(/\*(.+?)\*/g, '<em>$1</em>');
    const lines = italic.split('\n');
    const isList = lines.every(l => !l.trim() || /^[-*]\s+/.test(l.trim()));
    if (isList) {
      const items = lines.filter(l => l.trim()).map(l => l.replace(/^[-*]\s+/, ''));
      return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
    return lines.map(l => `<p>${l || ''}</p>`).join('');
  };

  // Normalize assistant content to ensure lists/paragraphs render as markdown
  function normalizeAssistantContent(input: string): string {
    try {
      let s = String(input || '');
      // 1) Ensure numbers start on new lines: 1. / 1)
      s = s.replace(/(?<!^|\n)(\d+)[\.|\)]\s/g, '\n$1. ');
      // 2) Ensure hyphen bullets start on new lines
      s = s.replace(/(?<!\n)\s-\s/g, '\n- ');
      // 3) Lightly collapse triple+ newlines
      s = s.replace(/\n{3,}/g, '\n\n');
      // 4) Ensure a blank line before any list start for remark-gfm
      s = s.replace(/(^|\n)([^\n\-\d][^\n]*?)\n(-\s|\d+\.\s)/g, (_, a, b, c) => `${a}${b}\n\n${c}`);
      // 5) Indent bullets under immediately preceding numbered list item (4 spaces for CommonMark)
      const lines = s.split('\n');
      let lastWasNumber = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isNumber = /^\s*\d+[\.|\)]\s/.test(line);
        if (!isNumber && /^-\s/.test(line) && lastWasNumber) {
          lines[i] = '    ' + line; // indent nested bullet under number
        }
        if (!line.trim()) {
          lastWasNumber = false;
        } else if (isNumber) {
          lastWasNumber = true;
        } else if (/^\s{4,}-\s/.test(line)) {
          lastWasNumber = true;
        } else if (/^[-*]\s/.test(line)) {
          lastWasNumber = false;
        } else if (!/^\s{2,}/.test(line)) {
          lastWasNumber = false;
        }
      }
      s = lines.join('\n');
      // 6) Add paragraph spacing by ensuring a blank line after non-list paragraphs
      s = s.replace(/([^\n])\n(?!\n)(?!\s*[-*]|\s*\d+\.)/g, '$1\n\n');
      return s;
    } catch {
      return input;
    }
  }

  // Restore journeyId from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mxtkJourneyId');
      if (stored) setJourneyId(stored);
    } catch { }
  }, []);

  // Ensure a stable chat cookie id exists for cross-visit continuity
  useEffect(() => {
    try {
      const hasId = document.cookie.split(';').some(c => c.trim().startsWith('mxtk_chat_id='));
      if (!hasId) {
        const id = (globalThis.crypto?.randomUUID?.() ?? 'c_' + Math.random().toString(36).slice(2));
        document.cookie = `mxtk_chat_id=${id}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch { }
  }, []);

  // Restore chat history
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mxtk_sherpa_chat');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch { }
  }, []);

  // Persist chat history on change
  useEffect(() => {
    try { localStorage.setItem('mxtk_sherpa_chat', JSON.stringify(messages.slice(-100))); } catch { }
  }, [messages]);

  // Apply prefill prompt if provided
  useEffect(() => {
    if (prefillPrompt) setInput(prefillPrompt);
  }, [prefillPrompt]);

  // Rotate/update suggested questions based on conversation
  useEffect(() => {
    try {
      const last = messages[messages.length - 1];
      const seeds: string[] = [];
      const text = (last?.content || '').toLowerCase();
      if (/fraud|kyc|aml|whistle|bounty|acs|validator/.test(text)) {
        seeds.push('How do validators join and stay compliant?');
        seeds.push('What is the Asset Complexity Score?');
        seeds.push('How do rewards and penalties work?');
      }
      if (/token|mint|leverage|stability|back(ed|ing)/.test(text)) {
        seeds.push('How is MXTK backed by minerals?');
        seeds.push('What drives MXTK stability?');
        seeds.push('How does minting and redemption work?');
      }
      if (/transparen|ipfs|oracle|log|otc|aggregate/.test(text)) {
        seeds.push('Where can I see transparency logs?');
        seeds.push('How are oracle updates published?');
        seeds.push('What OTC aggregates are available?');
      }
      if (/owner|wallet|custody|institution|market/.test(text)) {
        seeds.push('How do owners participate?');
        seeds.push('How do institutions integrate with MXTK?');
        seeds.push('What markets list MXTK data?');
      }
      const base = seeds.length ? seeds : [
        'Show me how validation works',
        'Explain MXTK tokenomics simply',
        'What are the main risks and mitigations?',
      ];
      // Deterministic rotation based on interaction count
      let interactions = 0;
      try { interactions = Number(localStorage.getItem('mxtk_sherpa_interactions') || '0'); } catch { }
      const start = interactions % base.length;
      const next = [base[start], base[(start + 1) % base.length], base[(start + 2) % base.length]];
      setQuickQuestions(Array.from(new Set(next)));
    } catch { }
  }, [messages.length]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
      const n = Number(localStorage.getItem('mxtk_sherpa_interactions') || '0') + 1;
      localStorage.setItem('mxtk_sherpa_interactions', String(n));
    } catch { }

    try {
      const response = await fetch(getApiPath('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, mode }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.ok ? data.answer : data.error || 'Sorry, I encountered an error.',
        citations: data.citations || [],
        level: data.level,
        block: data.journeyBlock,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-append to journey if server indicates
      try {
        if (data.journeyBlock && data.autoAppend) {
          const res = await fetch(getApiPath('/api/ai/journey/add'), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ journeyId, block: data.journeyBlock })
          });
          const j = await res.json();
          if (j.ok) {
            setJourneyId(j.id);
            try {
              localStorage.setItem('mxtkJourneyId', j.id);
            } catch { }
          }
        }
      } catch { }

      try {
        if (data?.meta?.suggestHome === true || data?.autoAppend === true) {
          setSuggestHome(true);
        }
        if (data?.meta?.homeWidget) {
          await fetch(getApiPath('/api/ai/home/add'), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ widget: data.meta.homeWidget })
          });
        }
      } catch { }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I couldn\'t connect to the AI service. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [mode, isLoading, journeyId]);

  // Listen for auto-send events from footer
  useEffect(() => {
    const handleAutoSend = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        sendMessage(detail.message);
      }
    };
    window.addEventListener('guide:auto-send', handleAutoSend as EventListener);
    return () => window.removeEventListener('guide:auto-send', handleAutoSend as EventListener);
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  // Scroll behavior: align to top when assistant replies; keep bottom for user sends
  useEffect(() => {
    try {
      const lastIndex = messages.length - 1;
      if (lastIndex < 0) return;
      const last = messages[lastIndex];
      const scroller = document.querySelector('.guide-drawer .drawer-body') as HTMLElement | null;
      if (!scroller) return;
      requestAnimationFrame(() => {
        if (last?.role === 'assistant') {
          const el = messageRefs.current[lastIndex];
          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            try { scroller.scrollTop = Math.max(0, scroller.scrollTop - 8); } catch { }
            try {
              el.classList.add('new-answer');
              window.setTimeout(() => { try { el.classList.remove('new-answer'); } catch { } }, 1400);
            } catch { }
            return;
          }
        }
        scrollToBottom('smooth');
      });
    } catch { }
  }, [messages.length, scrollToBottom, messages]);

  // When drawer opens, snap to bottom
  useEffect(() => {
    const handleOpen = () => scrollToBottom('auto');
    window.addEventListener('mxtk:guide:open', handleOpen as EventListener);
    return () => window.removeEventListener('mxtk:guide:open', handleOpen as EventListener);
  }, [scrollToBottom]);

  // Mobile keyboard detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      // Consider keyboard visible if viewport shrunk by more than 150px
      setKeyboardVisible(heightDiff > 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleViewportChange);
      return () => window.removeEventListener('resize', handleViewportChange);
    }
  }, []);

  // quickQuestions now dynamic

  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-16 w-12 h-12 rounded-full shadow-lg border-2 border-white/20 bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center z-[99]"
        aria-label="Open Sherpa"
        data-embedded-hide
        title="Sherpa - Chat with MXTK AI"
      >
        <AppImage src="icons/ai/icon-sherpa.svg" alt="" width={20} height={20} className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`h-full w-full bg-transparent flex flex-col ${keyboardVisible ? 'pb-2' : ''}`}>

      <div className="min-h-0 flex-1 overflow-y-auto pt-0 px-0 pb-3 flex flex-col">
        <div className="flex-1"></div>
        <div className="conversation space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              ref={(el: HTMLDivElement | null) => { messageRefs.current[index] = el; }}
            >
              <Card
                data-role={message.role}
                className={`p-3 animate-message-in ${message.role === 'user'
                  ? 'bg-blue-700 text-white dark:bg-blue-700/70 ml-8'
                  : 'bg-blue-200/90 text-blue-950 border border-blue-300/60 dark:bg-blue-500/30 dark:text-blue-50 mr-8'
                  }`}
              >
                <div className="text-sm">
                  <strong className="chat-sender-text">
                    {message.role === 'user' ? 'You' : 'Sherpa'}:
                  </strong>
                  <div className={`mt-1 prose prose-sm dark:prose-invert leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ node, ...props }) => <a className="underline text-blue-700 dark:text-blue-300 hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                        table: ({ node, ...props }) => <div className="overflow-auto"><table className="table-auto border-collapse w-full text-sm" {...props} /></div>,
                        th: ({ node, ...props }) => <th className="border px-2 py-1 text-left" {...props} />,
                        td: ({ node, ...props }) => <td className="border px-2 py-1 align-top" {...props} />,
                        code: ({ inline, className, children, ...props }: any) => {
                          const isInline = inline || String(children).includes('`');
                          if (isInline) return <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10" {...props}>{children}</code>;
                          return (
                            <pre className="rounded bg-black/80 text-white p-3 overflow-auto">
                              <code {...props}>{children}</code>
                            </pre>
                          );
                        },
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                      }}
                    >
                      {message.role === 'assistant' ? normalizeAssistantContent(message.content) : message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          {isLoading && (
            <Card className="p-3 bg-gray-50 dark:bg-gray-800 mr-8 animate-message-in">
              <div className="text-sm">
                <strong className="text-gray-900 dark:text-white">Sherpa:</strong>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Thinking...
                </p>
              </div>
            </Card>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Optional helper row to add widgets to Home without blocking typing */}
      {/* <div className="px-3 py-2 text-xs opacity-80 flex gap-2">
        <button onClick={()=>window.dispatchEvent(new CustomEvent('mxtk:home:add',{ detail:{ widget:{ type:'summary', title:'MXTK Overview' } } }))} className="underline">Add Overview</button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('mxtk:home:add',{ detail:{ widget:{ type:'glossary', title:'Glossary' } } }))} className="underline">Add Glossary</button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent('mxtk:home:add',{ detail:{ widget:{ type:'resources', title:'Resources' } } }))} className="underline">Add Resources</button>
      </div> */}

      <div className="border-t border-white/10 bg-glass/70 backdrop-blur px-3 py-2">
        {/* CTA logic: show only when applicable; Open Home hidden on /home */}
        {(() => {
          let onHome = false
          try { onHome = typeof window !== 'undefined' && (location.pathname.endsWith('/home') || location.pathname === '/home') } catch { }
          const canAdd = suggestHome && !onHome
          const canOpenHome = !onHome
          const showCtaRow = canAdd || canOpenHome
          if (!showCtaRow) return null
          return (
            <div className="mb-2 text-xs flex items-center gap-2">
              <span className="opacity-70">Looks useful?</span>
              {canAdd && <AddToHomeButton kind="recent-answers" />}
              {canOpenHome && <Link href={getBasePathUrl('/home')} className="btn btn-sm" aria-label="Open Home">Open Home</Link>}
            </div>
          )
        })()}
        {/* Hide quick suggestions on small screens or when keyboard is visible */}
        <div className={`${keyboardVisible ? 'hidden' : 'hidden sm:flex'} flex-wrap gap-2 mb-2`}>
          {quickQuestions.map((q, i) => (
            <button
              key={q}
              data-testid={`chip-${i}`}
              onClick={() => sendMessage(q)}
              className="text-xs rounded-full px-3 py-1 bg-white text-slate-900 border border-gray-300 hover:bg-gray-100 dark:bg-gray-700/70 dark:text-white dark:border-white/20 dark:hover:bg-gray-600/80"
            >
              {q}
            </button>
          ))}
        </div>
        {/* Hide 'Looks useful?' if neither Add nor Open Home applies */}
        <style jsx>{`
          .guide-drawer .action-open-home[aria-hidden="true"],
          .guide-drawer .action-add-home[aria-hidden="true"] { display: none; }
        `}</style>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            data-testid="guide-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sherpa about MXTK…"
            className="flex-1 rounded-lg px-3 py-2 bg-white text-slate-900 placeholder:text-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:border-gray-600"
          />
          <button
            type="submit"
            className="h-9 px-3 rounded-lg bg-[var(--mxtk-orange)] text-white hover:bg-[var(--mxtk-orange)]/90 disabled:opacity-50 disabled:hover:bg-[var(--mxtk-orange)] transition-colors"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
