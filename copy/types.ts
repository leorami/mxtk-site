export type XMode = "ai" | "learn" | "build" | "operate";
export type Quadlet<T = string> = { ai: T; learn: T; build: T; operate: T };

// Legacy support - use Quadlet for new content
// Allow indexing with XMode (including 'ai') while content remains triplet-based.
// At runtime, pages may index with 'ai'; treat it as equivalent to 'learn' in copy sources.
export type Triplet<T = string> = { learn: T; build: T; operate: T } & Partial<Record<'ai', T>>;

export type Pillar = {
  title: Triplet;
  body: Triplet;
};

export type RichSection = {
  heading: Triplet;
  paragraphs: Triplet<string[]>; // multiple paragraphs per mode
  highlight?: Triplet;           // optional pull-quote / key takeaway
};

export type FAQ = {
  q: Triplet;
  a: Triplet<string[]>;
};

export type PageCopy = {
  heroTitle: Triplet;
  heroSub: Triplet;
  adaptTitle?: Triplet;
  adaptSub?: Triplet;
  pillars?: Pillar[];
  learnMore?: Triplet;
  sections?: RichSection[]; // NEW
  faqs?: FAQ[];             // NEW (optional – not rendered yet unless you want)
};


