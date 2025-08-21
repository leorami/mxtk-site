import { env } from '@/lib/env'
import { createPublicClient, formatUnits, http } from 'viem'
import { arbitrum } from 'viem/chains'

export const publicClient = () => createPublicClient({
    chain: arbitrum,
    transport: http(env.ARBITRUM_RPC_URL, { batch: true }),
})

export function toNumber(bn: bigint, decimals = 18): number {
    return Number(formatUnits(bn, decimals))
}
