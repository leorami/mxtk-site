import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        message: 'Debug route working',
        timestamp: new Date().toISOString(),
        env: {
            hasRpcUrl: !!process.env.ARBITRUM_RPC_URL,
            nodeEnv: process.env.NODE_ENV,
        }
    })
}





