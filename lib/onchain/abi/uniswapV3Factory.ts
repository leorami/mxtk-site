export const uniswapV3FactoryAbi = [
    {
        "type": "function", "name": "getPool", "stateMutability": "view", "inputs": [
            { "name": "tokenA", "type": "address" }, { "name": "tokenB", "type": "address" }, { "name": "fee", "type": "uint24" }
        ], "outputs": [{ "name": "pool", "type": "address" }]
    }
] as const

// Arbitrum Uniswap v3 factory
export const UNISWAP_V3_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
