// server-only types for governance flags and reviews

export type FlagId = string;
export type ReviewId = string;

export type FlagStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed' | 'escalated';

export type FlagCategory =
  | 'pii'
  | 'policy'
  | 'prompt-injection'
  | 'spam'
  | 'abuse'
  | 'hallucination'
  | 'cost-anomaly'
  | 'other';

export type Flag = {
  id: FlagId;
  createdAt: number;
  journeyId?: string;
  messageId?: string;
  source: 'chat' | 'ingest' | 'system';
  category?: FlagCategory;
  reason: string;
  severity?: 1 | 2 | 3;
  metadata?: Record<string, unknown>;
  status: FlagStatus;
  notes?: string[];
  labels?: string[];
  reviewer?: string;
  updatedAt?: number;
};

export type ReviewAction = {
  id: ReviewId;
  flagId: FlagId;
  at: number;
  actor: string;
  action: 'resolve' | 'dismiss' | 'escalate' | 'reopen' | 'annotate';
  payload?: {
    category?: FlagCategory;
    note?: string;
    labels?: string[];
  };
};


