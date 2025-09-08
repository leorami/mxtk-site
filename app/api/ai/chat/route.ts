import { blockFromAnswer } from '@/lib/ai/journey';
import { ChatMessageSchema, getChatModel, getEmbedder, getHeaders, type ChatResponse } from '@/lib/ai/models';
import { getBudget, getTodayUSD } from '@/lib/ai/ops/budget';
import { estimateUSD, logCost } from '@/lib/ai/ops/costs';
import { searchSimilar } from '@/lib/ai/vector-store';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const body = await request.json();
    const parsed = ChatMessageSchema.parse(body);
    const requestedTier = (body?.tier as 'suggest' | 'answer' | 'deep' | undefined) || undefined;
    const defaultTier = parsed.mode === 'learn' ? 'suggest' : parsed.mode === 'analyze' ? 'deep' : 'answer';
    let tier: 'suggest' | 'answer' | 'deep' = requestedTier || defaultTier;
    const model = getChatModel(tier);
    // Soft budget guard
    const budget = getBudget();
    const today = await getTodayUSD();
    if (budget.limit > 0 && today >= budget.limit) {
      if (budget.mode === 'degrade' && tier !== 'suggest') {
        tier = 'suggest';
      } else if (budget.mode === 'block') {
        // For public chat, auto-degrade; reserve hard block for admin routes
        tier = 'suggest';
      }
    }

    const embedder = getEmbedder();
    const similarChunks = await searchSimilar(parsed.message, embedder, 5);

    if (similarChunks.length === 0) {
      const fallback = "I don't have specific information about that topic in my knowledge base. Could you try rephrasing your question or ask about MXTK's core features like validator incentives, transparency mechanisms, or institutional features?";
      const inTok0 = Math.ceil((parsed.message || '').length / 4);
      const outTok0 = Math.ceil(fallback.length / 4);
      const usd0 = estimateUSD(inTok0, outTok0, model.pricing);
      await logCost({ ts: new Date().toISOString(), kind: 'chat', model: model.name, tier, tokens: { in: inTok0, out: outTok0 }, usd: usd0, route: '/api/ai/chat' });
      return NextResponse.json({
        ok: true,
        answer: fallback,
        citations: [],
        sources: [],
      });
    }

    // Live LLM when OpenAI key is present (supports OPENAI_API_KEY or openai_api_key) and not in test
    const useLive = Boolean(process.env.OPENAI_API_KEY || (process as any).env?.openai_api_key) && process.env.NODE_ENV !== 'test';
    let answer: string;
    if (useLive) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12_000);
      const context = similarChunks.length
        ? sanitizePublicText(similarChunks.map(s => s.chunk.text).join('\n\n').slice(0, 1800))
        : '';
      const siteOrigin = (process.env.NEXT_PUBLIC_SITE_ORIGIN || 'https://mineral-token.com').trim();
      let siteHost = '';
      try { siteHost = new URL(siteOrigin).host; } catch { }
      const rawLinks: string[] = Array.from(new Set(
        similarChunks
          .map(s => (s as any)?.chunk?.meta?.url as string | undefined)
          .filter((u): u is string => typeof u === 'string' && u.length > 0)
      ));
      const internal: string[] = [];
      const external: string[] = [];
      for (const u of rawLinks) {
        try {
          const h = new URL(u).host;
          if (siteHost && h === siteHost) internal.push(u);
          else external.push(u);
        } catch { external.push(u); }
      }
      const linksList: string[] = [...internal, ...external].slice(0, 6);
      const tone = parsed.mode === 'learn'
        ? 'Be a friendly teacher. Define terms simply, avoid jargon, give short step-by-step explanations, and build understanding layer by layer without sounding condescending.'
        : parsed.mode === 'explore'
          ? 'Be concise and helpful. Focus on concepts and comparisons with light examples.'
          : 'Be precise and structured. State assumptions, trade-offs, and references to context.';
      const domainGuide = 'Explain MXTK using: conservative geology estimates; long extraction timelines; anti-fraud validation; token leverage and stability; tech-driven efficiency; context of minerals-backed assets vs fiat. Never claim features beyond MXTK scope.';
      const formatting = 'Return answers in clean markdown suitable for `remark-gfm`: use short paragraphs, bullet and numbered lists (with proper indentation for nested items), tables only when helpful, and code fences for snippets. Prefer internal site links when relevant.';
      const boundaries = 'Only answer using the provided Context and known MXTK site knowledge. If the answer is not in Context or known MXTK materials, say you do not know and suggest a related, on-track question.';
      const sys = `You are MXTK Sherpa, a trustworthy, experienced guide for Mineral Token (MXTK). Use the Context faithfully and follow the tone.

Context:
${context}

Links:
${linksList.map(u => `- ${u}`).join('\n')}

Guidelines:
- ${tone}
- ${domainGuide}
- ${formatting}
- ${boundaries}
- Only include a link if it directly helps the user.`;
      try {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'content-type': 'application/json', ...(getHeaders() as any) },
          body: JSON.stringify({
            model: getChatModel().name,
            messages: [
              { role: 'system', content: sys },
              { role: 'user', content: parsed.message },
            ],
            temperature: 0.3,
            max_tokens: 400,
          }),
          signal: controller.signal,
        } as any);
        clearTimeout(timer);
        if (!r.ok) throw new Error(`chat ${r.status}`);
        const j = await r.json();
        answer = sanitizePublicText(j.choices?.[0]?.message?.content || '');
        if (!answer) answer = generateMockResponse(parsed.message, parsed.mode, similarChunks);
      } catch {
        answer = generateMockResponse(parsed.message, parsed.mode, similarChunks);
      }
    } else {
      answer = generateMockResponse(parsed.message, parsed.mode, similarChunks);
    }

    // Deduplicate sources and keep highest relevance score for each
    const sourceMap = new Map<string, number>();
    similarChunks.forEach(result => {
      const source = result.chunk.meta?.source || 'Unknown';
      const currentScore = sourceMap.get(source) || 0;
      sourceMap.set(source, Math.max(currentScore, result.score));
    });

    const sources = Array.from(sourceMap.entries()).map(([source, relevance]) => ({
      source,
      relevance,
    }));

    // Infer section from user prompt and create journey block
    let section: 'overview' | 'how-it-works' | 'risks' | 'tokenomics' | 'validation' | 'faq' | 'glossary' | 'resources' = 'overview';
    if (/how\s+it\s+works|architecture|flow/i.test(parsed.message)) section = 'how-it-works';
    if (/risk|attack|threat|failure/i.test(parsed.message)) section = 'risks';
    if (/tokenomics|vesting|distribution/i.test(parsed.message)) section = 'tokenomics';
    if (/validate|validator|attest/i.test(parsed.message)) section = 'validation';
    if (/glossary|define|term/i.test(parsed.message)) section = 'glossary';

    const block = blockFromAnswer(answer, sources.map(s => s.source), { section, confidence: 0.8 });

    const autoAppend = /^(explain|define|teach\s+me)/i.test(parsed.message || '');
    const homeWidget = autoAppend ? { type: 'summary', title: 'MXTK Overview', data: { text: answer.slice(0, 400) } } : null;

    const res = NextResponse.json({
      ok: true,
      answer,
      citations: sources.map(s => s.source),
      sources,
      journeyBlock: block,
      autoAppend,
      meta: { suggestHome: autoAppend === true, homeWidget },
    });
    // Rough usage estimate by characters (dev-mode mock)
    const inTok = Math.ceil((parsed.message || '').length / 4);
    const outTok = Math.ceil(answer.length / 4);
    const usd = estimateUSD(inTok, outTok, model.pricing);
    await logCost({ ts: new Date().toISOString(), kind: 'chat', model: model.name, tier, tokens: { in: inTok, out: outTok }, usd, route: '/api/ai/chat' });
    return res;
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({
      ok: false,
      answer: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}

function sanitizePublicText(text: string): string {
  // Remove common internal/disclaimer phrases and markdown headings
  const forbidden = /(internal\s+draft|confidential|proprietary|do\s*not\s*distribute|internal\s*only|nda|patent\s*claims?)/gi;
  const noHeadings = text.replace(/^\s{0,3}#{1,6}\s+.*$/gm, '').trim();
  const cleaned = noHeadings.replace(forbidden, '').replace(/\s{2,}/g, ' ').replace(/\s+[,.;:]/g, (m) => m.trim().slice(-1));
  return cleaned.trim();
}

function generateMockResponse(
  message: string,
  mode: string,
  chunks: Array<{ chunk: any; score: number }>
): string {
  const lowerMessage = message.toLowerCase();
  const topChunk = chunks[0]?.chunk.text || '';

  // Extract key concepts from the query and chunks
  const isAboutTransparency = lowerMessage.includes('transparency') || topChunk.toLowerCase().includes('transparency');
  const isAboutValidators = lowerMessage.includes('validator') || topChunk.toLowerCase().includes('validator');
  const isAboutOracles = lowerMessage.includes('oracle') || topChunk.toLowerCase().includes('oracle');
  const isAboutTokenization = lowerMessage.includes('tokeniz') || topChunk.toLowerCase().includes('tokeniz');
  const isAboutRisk = lowerMessage.includes('risk') || topChunk.toLowerCase().includes('risk');

  // Generate contextual response based on what we found
  let coreAnswer = '';

  if (isAboutTransparency) {
    coreAnswer = `MXTK ensures transparency through several key mechanisms:

• **Oracle Logs**: All validator decisions and mineral verification processes are logged in real-time
• **IPFS Storage**: Immutable storage of documentation and audit trails
• **Public Aggregates**: OTC trading data is aggregated and made publicly available  
• **Validator Incentives**: Economic incentives align validator behavior with transparency goals

These systems work together to create an auditable, verifiable record of all MXTK operations.`;
  } else if (isAboutValidators) {
    coreAnswer = `MXTK's validator system is designed with sophisticated game theory:

• **Staking Requirements**: Validators must stake MXTK tokens proportional to asset complexity
• **Reputation System**: Multi-faceted, on-chain profiles that resist manipulation
• **Dual Rewards**: Both integrity fees and minting bonuses incentivize honest participation
• **Slashing Penalties**: Dynamic penalties that increase exponentially for coordinated attacks

This creates a self-regulating ecosystem where honest validation is the most profitable strategy.`;
  } else if (isAboutOracles) {
    coreAnswer = `MXTK uses Decentralized Oracle Networks (DONs) to ensure data integrity:

• **Multiple Sources**: Data aggregated from dozens of independent sources
• **Tamper Resistance**: Cryptographic verification prevents manipulation
• **Real-time Updates**: Continuous monitoring of asset valuations and status
• **Insurance Backing**: Specialized oracle manipulation insurance provides additional coverage

This multi-layered approach ensures reliable, verifiable data feeds for all tokenized assets.`;
  } else if (isAboutTokenization) {
    coreAnswer = `MXTK's tokenization process follows institutional-grade standards:

• **Due Diligence**: Comprehensive validation by certified specialists
• **Legal Framework**: Compliant with Basel III and regulatory requirements
• **Atomic Settlement**: Delivery-versus-payment eliminating counterparty risk
• **Provenance Tracking**: Immutable chain of custody from origin to trade

This enables traditional financial institutions to safely interact with tokenized real-world assets.`;
  } else if (isAboutRisk) {
    coreAnswer = `MXTK addresses multiple risk vectors in tokenized assets:

• **Smart Contract Risk**: Mandatory third-party audits from firms like CertiK
• **Custodian Risk**: Only regulated custodians with federal charters and insurance
• **Oracle Risk**: Decentralized networks with manipulation insurance coverage
• **Liquidity Risk**: Professional market makers and institutional-grade pools

Each risk is mitigated through both technical and financial safeguards.`;
  } else {
    // Generic response using actual content
    const raw = topChunk.substring(0, 300).trim();
    const snippet = sanitizePublicText(raw);
    if (snippet.length < 10) {
      coreAnswer = "I don't have specific details to share on that. Could you rephrase or ask a more specific question about MXTK's features (validators, transparency, oracles, or tokenization)?";
    } else {
      coreAnswer = `${snippet}${raw.length < topChunk.length ? '...' : ''}`;
    }
  }

  // Add mode-specific framing
  switch (mode) {
    case 'learn':
      return `${coreAnswer}

These concepts form the foundation of MXTK's approach to institutional-grade tokenized assets.`;

    case 'explore':
      return `${coreAnswer}

Would you like me to dive deeper into any of these mechanisms or explore related aspects?`;

    case 'analyze':
      return `From a technical and market perspective:

${coreAnswer}

This multi-layered approach positions MXTK to bridge traditional finance and decentralized systems effectively.`;

    default:
      return coreAnswer;
  }
}
