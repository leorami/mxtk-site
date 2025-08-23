export const env = {
    ARBITRUM_RPC_URL: process.env.ARBITRUM_RPC_URL || '',

    MXTK_TOKEN_ADDRESS: (process.env.MXTK_TOKEN_ADDRESS || '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba').trim(),
    MXTK_POOLS: (process.env.MXTK_POOLS || '').trim(), // manual seed list "0x...,0x..."

    // Auto-discovery
    AUTO_DISCOVER_POOLS: (process.env.AUTO_DISCOVER_POOLS || '1').trim(), // "1" to enable by default
    DISCOVERY_FEES: (process.env.DISCOVERY_FEES || '').trim(), // e.g. "100,500,3000"
    DISCOVERY_QUOTES: (process.env.DISCOVERY_QUOTES || '').trim(), // override default stables list (comma-separated addresses)

    // Optional indexer fallback
    DEXSCREENER_BASE: (process.env.DEXSCREENER_BASE || 'https://api.dexscreener.com/latest/dex').trim(),

    UNISWAP_V4_SUBGRAPH_URL_ARBITRUM: (process.env.UNISWAP_V4_SUBGRAPH_URL_ARBITRUM || '').trim(),

    STABLE_SYMBOLS: (process.env.STABLE_SYMBOLS || 'USDC,USDC.e,USDT,DAI').split(',').map(s => s.trim().toUpperCase()),
    CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '45', 10),
}

export function assertEnv() {
    if (!env.ARBITRUM_RPC_URL) throw new Error('ARBITRUM_RPC_URL is required')
}
