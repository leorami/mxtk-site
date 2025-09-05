'use client';

// Pin-to-Home removed per UI request
import Card from '@/components/ui/Card';
import { getApiPath } from '@/lib/basepath';
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
  const [input, setInput] = useState('');
  // Mode controls removed from panel; keep default context internal
  const [mode] = useState<'learn' | 'explore' | 'analyze'>('learn');
  const [isLoading, setIsLoading] = useState(false);
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  
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
      const items = lines.filter(l=>l.trim()).map(l => l.replace(/^[-*]\s+/, ''));
      return `<ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
    }
    return lines.map(l => `<p>${l || ''}</p>`).join('');
  };
  
  // Restore journeyId from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mxtkJourneyId');
      if (stored) setJourneyId(stored);
    } catch {}
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
      // Auto-scroll to bottom when a new message arrives
      try {
        requestAnimationFrame(() => {
          const scroller = document.querySelector('.guide-drawer .drawer-body');
          if (scroller) (scroller as HTMLElement).scrollTop = (scroller as HTMLElement).scrollHeight;
        });
      } catch {}
      
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
            } catch {}
          }
        }
      } catch {}
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
  // Scroll on any message change (user or assistant)
  useEffect(() => {
    try {
      const scroller = document.querySelector('.guide-drawer .drawer-body') as HTMLElement | null;
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
      bottomRef.current?.scrollIntoView({ block: 'end' });
    } catch {}
  }, [messages.length]);

  const quickQuestions = [
    'What is MXTK?',
    'How does MXTK ensure transparency?',
    'Who can use MXTK?',
  ];

  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-16 w-12 h-12 rounded-full shadow-lg text-lg border-2 border-white/20 bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center justify-center z-[99]"
        aria-label="Open Sherpa"
        data-embedded-hide
        title="Sherpa - Chat with MXTK AI"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="h-full w-full bg-transparent flex flex-col">

      <div className="flex-1 overflow-y-auto pt-0 px-0 pb-3 space-y-0">
        <div className="hidden md:block suggested-sticky">
          <div className="suggested-header flex items-center justify-between">
            <p className="text-gray-700 dark:text-gray-200 text-xs font-medium">
              Suggested questions:
            </p>
          </div>
          <div className="suggested-list space-y-2">
            {quickQuestions.map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                className="w-full text-left p-2 text-xs bg-white/80 dark:bg-gray-700/60 rounded hover:bg-gray-100 dark:hover:bg-gray-600/80 transition-colors border border-gray-200/60 dark:border-gray-600/60 text-gray-800 dark:text-gray-200"
              >
                {question}
              </button>
            ))}
          </div>
          {/* separator removed per design */}
        </div>
        <div className="conversation space-y-3">
          {messages.map((message, index) => (
            <Card
              key={index}
              data-role={message.role}
              className={`p-3 ${
                message.role === 'user'
                  ? 'bg-blue-700 text-white dark:bg-blue-700/70 ml-8'
                  : 'bg-blue-200/90 text-blue-950 border border-blue-300/60 dark:bg-blue-500/30 dark:text-blue-50 mr-8'
              }`}
            >
              <div className="text-sm">
                <strong className={message.role === 'user' ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-800'}>
                  {message.role === 'user' ? 'You' : 'Sherpa'}:
                </strong>
                <div className={`mt-1 prose prose-sm dark:prose-invert leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-800'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </Card>
          ))}
          <div ref={bottomRef} />
        </div>
        
        {isLoading && (
          <Card className="p-3 bg-gray-50 dark:bg-gray-800 mr-8">
            <div className="text-sm">
              <strong className="text-gray-900 dark:text-white">Sherpa:</strong>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Thinking...
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Input removed - only footer chat now */}
    </div>
  );
}
