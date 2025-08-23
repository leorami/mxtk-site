export const uniswapV4FactoryAbi = [
    {
        "type": "function", "name": "getPool", "stateMutability": "view", "inputs": [
            { "name": "tokenA", "type": "address" }, { "name": "tokenB", "type": "address" }, { "name": "fee", "type": "uint24" }
        ], "outputs": [{ "name": "pool", "type": "address" }]
    }
] as const

// Arbitrum Uniswap v4 factory
export const UNISWAP_V4_FACTORY = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c'
