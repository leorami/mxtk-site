// Data model types for transparency tables and price series

export type TokenRef = {
  address: string;
  symbol: string;
  decimals: number;
};

// Canonical on-chain pool shape (adapter-level)
export type Pool = {
  address: string;
  fee?: number; // in bps where available
  token0: TokenRef;
  token1: TokenRef;
};

export type PoolStats = {
  tvlUSD: number | null;
  volume24hUSD: number | null;
  fees24hUSD: number | null;
};

// Lightweight aggregated snapshot from third-party APIs (e.g., Dexscreener)
export type PoolSnapshot = {
  address: string;
  token0: TokenRef;
  token1: TokenRef;
  approxMxtkUSD?: number | null;
  volume24hUSD?: number | null;
  fees24hUSD?: number | null;
  tvlUSD?: number | null;
};

export type PoolRow = {
  address: string;
  source?: 'factory' | 'dexscreener' | 'manual' | 'mock';
  fee?: number;
  token0?: TokenRef;
  token1?: TokenRef;
  approxMxtkUSD?: number | null;
  volume24hUSD?: number | null;
  fees24hUSD?: number | null;
  tvlUSD?: number | null;
  error?: string;
};

export type PricePoint = {
  time: number; // unix ms
  value: number;
};

export type Series = {
  points: PricePoint[];
  // Optional summary helpers for quicker chart domain calculation
  min?: number;
  max?: number;
  start?: number; // first timestamp (ms)
  end?: number; // last timestamp (ms)
};


