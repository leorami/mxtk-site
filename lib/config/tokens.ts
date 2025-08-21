// Common Arbitrum tokens used to discover pools against MXTK
export const ARB_TOKENS = {
    USDC: { symbol: 'USDC', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 }, // native
    USDCe: { symbol: 'USDC.e', address: '0xFF970A61A04b1cA14834A43f5de4533EbDDB5CC8', decimals: 6 }, // bridged
    USDT: { symbol: 'USDT', address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', decimals: 6 },
    WETH: { symbol: 'WETH', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
    DAI: { symbol: 'DAI', address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', decimals: 18 },
}

export const DEFAULT_STABLES = [ARB_TOKENS.USDC.address, ARB_TOKENS.USDCe.address, ARB_TOKENS.USDT.address, ARB_TOKENS.DAI.address]
export const DEFAULT_FEE_TIERS = [100, 500, 3000, 10000] // 0.01%, 0.05%, 0.3%, 1%
