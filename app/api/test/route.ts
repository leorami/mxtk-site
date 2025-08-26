import { env } from '@/lib/env'
import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        hasRpcUrl: !!env.ARBITRUM_RPC_URL,
        rpcUrl: env.ARBITRUM_RPC_URL || 'NOT SET',
        tokenAddress: env.MXTK_TOKEN_ADDRESS,
    })
}





