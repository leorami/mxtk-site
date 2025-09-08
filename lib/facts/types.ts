export type FactsVersion = number;

export interface FactsDoc {
  version: FactsVersion;
  updatedAt: number;
  etag?: string;
  data: {
    project: {
      name: string;
      tagline?: string;
    };
    assets?: {
      committedUSD?: number;
      categories?: string[];
    };
    governance?: {
      policyUrl?: string;
      contact?: string;
    };
    models?: {
      suggest?: string[];
      answer?: string[];
      deep?: string[];
      embeddings?: string;
    };
    links?: Record<string, string>;
    misc?: Record<string, unknown>;
  };
}


