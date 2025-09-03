import type { PageCopy } from "./types";

export const roadmapCopy: PageCopy = {
  heroTitle: {
    learn:   "What we’re building next—and why it matters.",
    build:   "Identifiers, policy objects, and integrations you can plan around.",
    operate: "Cadence, SLAs, and change control for predictable releases.",
  },
  heroSub: {
    learn:
      "Our roadmap is simple: make MXTK easier to understand and safer to use. We ship in small, verifiable steps.",
    build:
      "Everything ties back to the data model: stable IDs, attestations, custody, and events. Each release maps to SDK helpers.",
    operate:
      "We publish timelines, rollback plans, and SLAs so ops teams can schedule change windows with confidence.",
  },

  pillars: [
    {
      title: { learn: "Clarity first", build: "Model-driven", operate: "Predictable cadence" },
      body: {
        learn:
          "We prioritize features that make MXTK easier to grasp, especially for newcomers.",
        build:
          "New capabilities extend identifiers, attestations, or policy—not ad-hoc code paths.",
        operate:
          "We release in two-week iterations, with notes, rollbacks, and deprecation windows.",
      },
    },
    {
      title: { learn: "Proof attached", build: "APIs + SDKs", operate: "Observability" },
      body: {
        learn:
          "Every feature keeps proof close to value so you can verify what’s behind a token.",
        build:
          "Endpoints and typed helpers land together, with examples you can copy.",
        operate:
          "Metrics, logs, and webhooks ship with features so you can monitor from day one.",
      },
    },
    {
      title: { learn: "Safety by default", build: "Backwards compatibility", operate: "Change control" },
      body: {
        learn:
          "We choose the safer path, even if it takes longer.",
        build:
          "Identifiers are stable; new versions add fields, not break them.",
        operate:
          "Each release has a documented owner, on-call, and rollback plan.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "Near-term (next 4–8 weeks)",
        build:   "Upcoming changes developers can plan for",
        operate: "Operational notes for the next releases",
      },
      paragraphs: {
        learn: [
          "Enhancements to the public explanations and glossary: simpler language, more examples, and inline diagrams.",
          "Improved page-level transparency views so anyone can follow the proof trail from token to attestation.",
        ],
        build: [
          "SDK helpers for asset/batch/attestation lookups with caching and typed results.",
          "Policy objects: first-class custody/policy retrieval with versioning and signatures.",
        ],
        operate: [
          "Release notes with exact schema diffs. Alert templates for oracle-freshness windows and policy exceptions.",
          "Rollback procedures rehearsed on staging; deprecation windows communicated at least one cycle in advance.",
        ],
      },
    },
    {
      heading: {
        learn:   "Mid-term (1–2 quarters)",
        build:   "Interoperability and partner integrations",
        operate: "Scaling supervision and reporting",
      },
      paragraphs: {
        learn: [
          "Educational ‘explainers’ that bridge minerals and markets for non-experts.",
          "Clear user journeys for pledging to causes via MXTK Cares.",
        ],
        build: [
          "Deeper custody integrations (MPC ceremonies, signer rotation tooling).",
          "DON/oracle improvements with explicit freshness SLAs and reference dashboards.",
        ],
        operate: [
          "Standardized exports for audit and regulatory filings.",
          "Broader incident playbooks with simulated drills and runbook automation.",
        ],
      },
    },
    {
      heading: {
        learn:   "How to follow along",
        build:   "Planning with our versions",
        operate: "Change windows & SLAs",
      },
      paragraphs: {
        learn: [
          "We publish short, human-readable notes for each release so you can skim what changed and why.",
        ],
        build: [
          "Minor versions add fields; majors gate behind flags with migration guides. Example code is updated alongside releases.",
        ],
        operate: [
          "We announce maintenance windows ahead of time and target off-hours where possible. SLAs are listed with contact paths.",
        ],
      },
      highlight: {
        learn:   "Small steps, shipped often—so you’re never surprised.",
        build:   "If it’s not in the SDK and docs, it’s not done.",
        operate: "No silent changes: notes, rollbacks, and owners are part of the release.",
      },
    },
  ],
};


