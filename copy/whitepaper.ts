import type { PageCopy } from "./types";

export const whitepaperCopy: PageCopy = {
  heroTitle: {
    learn:   "MXTK, explained from first principles.",
    build:   "Architecture, data objects, and integration paths.",
    operate: "Risk, policy, market structure, and operations.",
  },
  heroSub: {
    learn:
      "Prefer the full story? The whitepaper walks through what MXTK is, why it exists, and how it stays tied to real-world value.",
    build:
      "You’ll find the asset model, identifiers, attestation scheme, custody policy objects, and integration references.",
    operate:
      "Operational flows, oracle freshness, event models, and governance for changes and recovery are covered in detail.",
  },

  pillars: [
    {
      title: {
        learn:  "Start with the ‘why’",
        build:  "Data model first",
        operate:"Operability matters",
      },
      body: {
        learn:
          "We begin with the problem: moving real value is slow and fragmented. MXTK exists to fix that without erasing diligence.",
        build:
          "The whitepaper treats identifiers, attestations, and policy as first-class so software can reason about truth.",
        operate:
          "Design choices prioritize reliability, observability, and predictable incident response.",
      },
    },
    {
      title: {
        learn:  "Real-world grounding",
        build:  "Practical integration",
        operate:"Risk-aware by design",
      },
      body: {
        learn:
          "The model is anchored to how reserves are actually verified and maintained, not just theory.",
        build:
          "Examples show how to wire custody, eligibility checks, and event capture with minimal custom code.",
        operate:
          "Coverage, MPC, slashing/clawback, and change control are explicit. Nothing is hand-waved.",
      },
    },
    {
      title: {
        learn:  "Read at your pace",
        build:  "Skimmable references",
        operate:"Appendices for depth",
      },
      body: {
        learn:
          "Sections are short and layered. You can read the summaries and come back to details later.",
        build:
          "Diagrams + tables map one-to-one to the SDK/endpoint surface so you aren’t guessing.",
        operate:
          "Appendices document identifiers, event schemas, and supervisory considerations for audit teams.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What the whitepaper is (and isn’t)",
        build:   "Structure you can map to code",
        operate: "Reference for operations",
      },
      paragraphs: {
        learn: [
          "It’s a practical guide: what MXTK represents, how proof stays attached to value, and how people use it day-to-day.",
          "It’s not a hype deck. The emphasis is on clarity and how you can verify claims yourself.",
        ],
        build: [
          "Chapters mirror the data model: asset ID, batches, attestations, policy objects, and lifecycle events with schemas.",
          "Integration notes point directly to SDK helpers and endpoints that implement each concept.",
        ],
        operate: [
          "You’ll find procedures for custody setup, signer rotation, oracle SLAs, exception handling, and incident playbooks.",
          "Event schemas and reporting guidance are provided for reconciliation and regulatory filings.",
        ],
      },
      highlight: {
        learn:
          "If you’re new, read the overview and glossary first. You’ll pick up the vocabulary quickly.",
        build:
          "If you’re a developer, jump to identifiers and events—then wire the SDK samplers.",
        operate:
          "If you run ops, go directly to custody, DvP, and supervision chapters.",
      },
    },
    {
      heading: {
        learn:   "How to read it",
        build:   "From POC to production",
        operate: "Operational readiness checklist",
      },
      paragraphs: {
        learn: [
          "Start with the overview, then the real-world verification section, then usage examples. The glossary helps decode new terms.",
        ],
        build: [
          "Phase 1: custody + attestations. Phase 2: mint/lock/settle + events. Phase 3: dashboards + exception queues.",
        ],
        operate: [
          "Checklist includes: MPC ceremonies & insurance, oracle freshness monitors, alert routing, and audit exports.",
        ],
      },
    },
    {
      heading: {
        learn:   "Where to go next",
        build:   "APIs, SDKs, and examples",
        operate: "Controls & governance",
      },
      paragraphs: {
        learn: [
          "When you’re comfortable with the big picture, skim the developer quick-start or talk to a partner who can host custody for you.",
        ],
        build: [
          "Endpoints and example jobs are linked from the SDK docs. You can copy the samples as-is to get a pilot running.",
        ],
        operate: [
          "Governance covers change control, rollback, and slashing/clawback conditions. Reporting is standardized for internal/external review.",
        ],
      },
    },
  ],
};


