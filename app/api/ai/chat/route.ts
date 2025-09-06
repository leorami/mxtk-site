import { blockFromAnswer } from '@/lib/ai/journey';
import { ChatMessageSchema, getChatModel, getEmbedder, type ChatResponse } from '@/lib/ai/models';
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
    
    // Mock AI response generation (in production, this would use an LLM)
    const answer = generateMockResponse(parsed.message, parsed.mode, similarChunks);
    
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
    
    const res = NextResponse.json({
      ok: true,
      answer,
      citations: sources.map(s => s.source),
      sources,
      journeyBlock: block,
      autoAppend,
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
    const snippet = topChunk.substring(0, 300).trim();
    coreAnswer = `Based on the MXTK documentation: ${snippet}${snippet.length < topChunk.length ? '...' : ''}`;
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
