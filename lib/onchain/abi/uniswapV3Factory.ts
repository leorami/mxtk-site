export const uniswapV4FactoryAbi = [
    {
        "type": "function", "name": "getPool", "stateMutability": "view", "inputs": [
            { "name": "tokenA", "type": "address" }, { "name": "tokenB", "type": "address" }, { "name": "fee", "type": "uint24" }
        ], "outputs": [{ "name": "pool", "type": "address" }]
    }
] as const

// Arbitrum Uniswap v3 factory (reverted from v4 since MXTK pools exist on v3)
export const UNISWAP_V4_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
