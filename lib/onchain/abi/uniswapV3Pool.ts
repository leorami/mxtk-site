// Minimal ABI for pool-level reads (Uniswap v4)
export const uniswapV4PoolAbi = [
    { "type": "function", "name": "token0", "stateMutability": "view", "outputs": [{ "type": "address" }], "inputs": [] },
    { "type": "function", "name": "token1", "stateMutability": "view", "outputs": [{ "type": "address" }], "inputs": [] },
    { "type": "function", "name": "fee", "stateMutability": "view", "outputs": [{ "type": "uint24" }], "inputs": [] },
    { "type": "function", "name": "liquidity", "stateMutability": "view", "outputs": [{ "type": "uint128" }], "inputs": [] },
    {
        "type": "function", "name": "slot0", "stateMutability": "view", "outputs": [
            { "name": "sqrtPriceX96", "type": "uint160" },
            { "name": "tick", "type": "int24" },
            { "name": "observationIndex", "type": "uint16" },
            { "name": "observationCardinality", "type": "uint16" },
            { "name": "observationCardinalityNext", "type": "uint16" },
            { "name": "feeProtocol", "type": "uint8" },
            { "name": "unlocked", "type": "bool" }
        ], "inputs": []
    }
] as const
