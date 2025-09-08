export type SherpaTier = 'suggest' | 'answer' | 'deep';
export type SherpaModel = 'gpt-5-nano' | 'gpt-5-mini' | 'gpt-5';

export interface RouteHints {
    highStakes?: boolean;
    userAskedDeep?: boolean;
    longFormExpected?: boolean;
    toolOrCodeHeavy?: boolean;
    userTier?: 'free' | 'pro' | 'enterprise';
}

export interface RouteDecision {
    tier: SherpaTier;
    model: SherpaModel;
    maxOutputTokens: number;
    reason: string;
}

const ENV = {
    SUGGEST: (process.env.AI_MODEL_TIER_SUGGEST || 'gpt-5-nano') as SherpaModel,
    ANSWER: (process.env.AI_MODEL_TIER_ANSWER || process.env.AI_MODEL || 'gpt-5-mini') as SherpaModel,
    DEEP: (process.env.AI_MODEL_TIER_DEEP || 'gpt-5') as SherpaModel,
};

const DEFAULT_CAPS = {
    suggest: 256,
    answer: 768,
    deep: 2048,
};

export function estimateTokens(str: string): number {
    if (!str) return 0;
    const chars = str.trim().length;
    const approx = Math.ceil(chars / 4);
    return Math.max(1, Math.min(approx, 100_000));
}

function difficultyScore(prompt: string, hints: RouteHints = {}): number {
    let score = 0;
    const tks = estimateTokens(prompt);
    if (tks > 300) score += 1;
    if (tks > 800) score += 2;

    const triggers = [
        'step-by-step', 'formal proof', 'derive', 'optimize', 'trade-offs', 'evaluate',
        'design a system', 'architecture', 'multi-agent', 'constraints', 'edge cases',
        'security', 'compliance', 'legal', 'financial model', 'statistical', 'causal',
        'ablation', 'benchmark', 'experiment', 'rag', 'vector', 'embedding', 'index',
        'scale to', 'sharding', 'slo', 'sla', 'latency', 'throughput', 'token budget',
        'prompt cache', 'cost analysis'
    ];
    const lower = prompt.toLowerCase();
    for (const w of triggers) if (lower.includes(w)) score += 1;

    if (hints.highStakes) score += 3;
    if (hints.userAskedDeep) score += 2;
    if (hints.toolOrCodeHeavy) score += 1;
    if (hints.longFormExpected) score += 1;
    if (hints.userTier === 'enterprise') score += 1;
    return score;
}

export function routeModel(prompt: string, hints: RouteHints = {}): RouteDecision {
    const score = difficultyScore(prompt, hints);
    let tier: SherpaTier = score >= 5 ? 'deep' : score >= 2 ? 'answer' : 'suggest';
    const tks = estimateTokens(prompt);
    if (tks > 1000 && tier !== 'deep') tier = 'deep';
    if (hints.highStakes || hints.userAskedDeep) tier = 'deep';
    if (tks < 120 && !hints.toolOrCodeHeavy && !hints.highStakes && !hints.userAskedDeep) tier = 'suggest';

    const model = (tier === 'deep' ? ENV.DEEP : tier === 'answer' ? ENV.ANSWER : ENV.SUGGEST) as SherpaModel;
    let maxOutputTokens = tier === 'deep' ? DEFAULT_CAPS.deep : tier === 'answer' ? DEFAULT_CAPS.answer : DEFAULT_CAPS.suggest;
    if (hints.userTier === 'enterprise' && tier === 'deep') maxOutputTokens = Math.max(maxOutputTokens, 3072);
    if (hints.longFormExpected && tier !== 'deep') maxOutputTokens = Math.min(maxOutputTokens + 256, 1024);
    const reason = `score=${score}, tokens≈${tks}, tier=${tier}`;
    return { tier, model, maxOutputTokens, reason };
}


