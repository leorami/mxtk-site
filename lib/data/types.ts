// Data model types for transparency tables and price series

export type TokenRef = {
  address: string;
  symbol: string;
  decimals: number;
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


