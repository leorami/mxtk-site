import type { PageCopy } from "./types";

export const institutionsCopy: PageCopy = {
  heroTitle: {
    learn:   "A simple bridge from real assets to digital mobility.",
    build:   "Programmable, audit-ready collateral for your stack.",
    operate: "Settlement-grade rails for tokenized mineral collateral.",
  },
  heroSub: {
    learn:
      "MXTK represents value backed by verified mineral reserves. It moves like digital cash but remains tied to something real you can diligence.",
    build:
      "Identifiers, attestations, and policy objects make MXTK machine-verifiable. Integration is a few endpoints and events—no heroics.",
    operate:
      "Atomic DvP, intraday mobility, MPC custody/insurance, oracle freshness windows, and complete lineage for supervision.",
  },

  pillars: [
    {
      title: {
        learn:  "Transparent backing",
        build:  "Data you can plug into systems",
        operate:"Deterministic events",
      },
      body: {
        learn:
          "Every token links to independent reports. You can see who verified what, and when.",
        build:
          "Stable IDs, versioned attestations, and structured policy mean your OMS/RMS/ledger can validate the same facts.",
        operate:
          "Mint/burn/lock/unlock events emit with machine-readable payloads for reconciliation.",
      },
    },
    {
      title: {
        learn:  "Fast and familiar",
        build:  "Simple SDKs & APIs",
        operate:"Atomic workflows",
      },
      body: {
        learn:
          "Move value quickly without new ceremony. Custody and controls match institutional norms.",
        build:
          "Mint, burn, and lock primitives; attestation fetches; eligibility checks. Wire them into existing jobs and queues.",
        operate:
          "Pre-validate eligibility, lock on T, settle atomically, and release. Reduce daylight exposure.",
      },
    },
    {
      title: {
        learn:  "Risk-aware by design",
        build:  "Policy objects & supervision",
        operate:"Basel-aligned treatment",
      },
      body: {
        learn:
          "MXTK is built to be inspected. Controls are visible and enforceable.",
        build:
          "Custody limits, signer roles, and escalation paths are encoded so ops can enforce them reliably.",
        operate:
          "Capital treatment follows the underlying. Coverage, attestations, and identifiers support audit and regulatory reporting.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What MXTK unlocks",
        build:   "Integration surface area",
        operate: "Asset model & data objects",
      },
      paragraphs: {
        learn: [
          "Faster collateral movement, cleaner proof of what you hold, and the ability to transact across venues consistently.",
        ],
        build: [
          "Endpoints: createMint, burn, lock/unlock, getAttestation(id), getPolicy(assetId). Events: Minted, Burned, Locked, Unlocked with stable IDs.",
          "SDKs ship with type-safe helpers and sample jobs you can adapt.",
        ],
        operate: [
          "Identifiers include an asset ID (stable), batch IDs (reserve lots), and versioned attestation IDs. Policy objects define custody rules and slashing/clawback.",
          "DON/oracle updates provide freshness windows; supervision can gate flows on staleness.",
        ],
      },
      highlight: {
        learn:
          "In short: you get speed without losing diligence.",
        build:
          "Low-friction integration—ship a useful pilot in weeks, not quarters.",
        operate:
          "Everything necessary for audit and control is explicit, versioned, and exportable.",
      },
    },
    {
      heading: {
        learn:   "How to use it (common scenarios)",
        build:   "Reference flows to copy",
        operate: "Ops notes: custody, DvP, and reporting",
      },
      paragraphs: {
        learn: [
          "Pledge MXTK as collateral in a facility, use it in a repo-like workflow, or move value intraday between desks or venues.",
        ],
        build: [
          "Repo-like flow: eligibility check → lock → atomic settle → unlock. Treasury flow: mint to inventory, allocate, burn on exit with complete event trail.",
        ],
        operate: [
          "MPC key ceremonies with insured coverage; signer rotation playbooks; SLA on oracle updates; alerts on stale attestations.",
          "Event streams feed your ledger and reconciliations automatically.",
        ],
      },
    },
    {
      heading: {
        learn:   "Why now",
        build:   "What your users get",
        operate: "Where it fits in your stack",
      },
      paragraphs: {
        learn: [
          "Digitization finally matches diligence. You can move faster without asking people to take your word for it.",
        ],
        build: [
          "Clients get quicker access to financing, fewer manual checks, and clearer records of what backs every action.",
        ],
        operate: [
          "MXTK sits beside custody, OMS/EMS, risk, and ledgering. It reduces reconciliation drag and adds observability where it was missing.",
        ],
      },
    },
  ],
};


