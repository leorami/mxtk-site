# On-Chain Data Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# REQUIRED
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/<YOUR_KEY>  # or Infura/QuickNode/etc.

# MXTK addresses (update as you discover pools)
MXTK_TOKEN_ADDRESS=0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba
MXTK_POOLS=0xPOOLADDRESS1,0xPOOLADDRESS2

# OPTIONAL (highly recommended for 24h volume/TVL/fees)
UNISWAP_V4_SUBGRAPH_URL_ARBITRUM=https://<thegraph-or-alt>/subgraphs/name/<uniswap-v4-arbitrum>

# UI/dev
CACHE_TTL_SECONDS=45
STABLE_SYMBOLS=USDC,USDT
```

## Required Setup

1. **ARBITRUM_RPC_URL**: Get an RPC endpoint from:
   - [Alchemy](https://www.alchemy.com/) (recommended)
   - [Infura](https://infura.io/)
   - [QuickNode](https://www.quicknode.com/)
   - Or use a public endpoint (not recommended for production)

2. **MXTK_TOKEN_ADDRESS**: The MXTK token contract address on Arbitrum

3. **MXTK_POOLS**: Comma-separated list of Uniswap v4 pool addresses where MXTK is traded

## Optional Setup

1. **UNISWAP_V4_SUBGRAPH_URL_ARBITRUM**: For enhanced metrics (24h volume, TVL, fees)
   - Use The Graph's hosted service or a self-hosted instance
   - Example: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v4`

## Testing

1. Install dependencies: `npm install`
2. Add your environment variables to `.env.local`
3. Start the development server: `npm run dev` or `./smart-build.sh`
4. Visit `/transparency` and `/institutions` to see live data

## Features

- **Token Summary**: Shows MXTK name, symbol, total supply
- **Pool Table**: Displays Uniswap v4 pools with:
  - Pool addresses (linked to Arbiscan)
  - Token pairs and fees
  - Approximate MXTK/USD price (when paired with stables)
  - 24h volume, TVL, and fees (with subgraph)
- **Auto-refresh**: Data updates every 30 seconds
- **Caching**: Server-side caching to reduce RPC calls
- **Error handling**: Graceful fallbacks when data is unavailable

## Notes

- If `MXTK_POOLS` is empty, the table shows "No pools configured"
- Without the subgraph URL, volume/TVL/fees show "—" but price approximation still works
- Price approximation only works when MXTK is paired with stablecoins (USDC, USDT)
- All data is cached for 45 seconds by default (configurable via `CACHE_TTL_SECONDS`)
