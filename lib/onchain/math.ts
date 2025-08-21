// Convert sqrtPriceX96 -> price of token1 per token0
export function priceFromSqrtPriceX96(sqrtPriceX96: bigint, decimals0: number, decimals1: number) {
    // price = (sqrtP^2 / 2^192) * 10^(decimals0 - decimals1)
    const numerator = sqrtPriceX96 * sqrtPriceX96
    const Q192 = (1n << 192n)
    const ratio = Number(numerator) / Number(Q192) // ok for display; not for trading precision
    const decimalAdj = 10 ** (decimals0 - decimals1)
    return ratio * decimalAdj
}

export function formatUSD(n?: number) {
    if (n == null || Number.isNaN(n)) return '—'
    return n >= 1 ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
        : `$${n.toFixed(6)}`
}
