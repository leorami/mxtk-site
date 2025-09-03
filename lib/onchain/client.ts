import { env } from '@/lib/env'
import { createPublicClient, formatUnits, http } from 'viem'
import { arbitrum } from 'viem/chains'

/**
 * Public client with sane fallbacks for development and tunnels.
 * If ARBITRUM_RPC_URL is not provided or the default public RPC is rate-limited,
 * we at least point to a widely available community endpoint so UI never stalls.
 */
export const publicClient = () => {
    const fallback = 'https://arbitrum.llamarpc.com'
    const url = env.ARBITRUM_RPC_URL && env.ARBITRUM_RPC_URL.trim().length > 0
        ? env.ARBITRUM_RPC_URL
        : fallback
    return createPublicClient({
        chain: arbitrum,
        transport: http(url, { batch: true }),
    })
}

export function toNumber(bn: bigint, decimals = 18): number {
    return Number(formatUnits(bn, decimals))
}
