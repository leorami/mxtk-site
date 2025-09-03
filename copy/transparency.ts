import type { PageCopy } from "./types";

export const transparencyCopy: PageCopy = {
  heroTitle: {
    learn:   "See what backs MXTK—no guessing, just proof.",
    build:   "Attestations, identifiers, and versioned reports.",
    operate: "Observable lineage, oracle freshness, and policy objects.",
  },
  heroSub: {
    learn:
      "Every MXTK token links to real-world documents and independent experts. You can read what was verified, by whom, and when.",
    build:
      "Stable IDs, validator signatures, and machine-readable references make provenance easy to fetch and embed in your systems.",
    operate:
      "Asset ID + batch IDs + attestation IDs; DON-served freshness windows; custody policy objects for supervision and audit.",
  },

  pillars: [
    {
      title: {
        learn:  "Independent validators",
        build:  "Signed reports + hashes",
        operate:"Versioned lineage",
      },
      body: {
        learn:
          "Geologists and qualified professionals verify reserves. Reports are published so you can read them yourself.",
        build:
          "Reports are hashed and signed; the hash anchors to on-chain references. Anyone can verify integrity.",
        operate:
          "Updates publish new attestation IDs; previous versions remain queryable to retain full history.",
      },
    },
    {
      title: {
        learn:  "Clear links to tokens",
        build:  "Stable asset identifiers",
        operate:"Deterministic reconciliation",
      },
      body: {
        learn:
          "Tokens include pointers to the documents that support them, so proof and value stay connected.",
        build:
          "A stable asset ID represents the class; batch IDs represent reserve lots; attestations are versioned.",
        operate:
          "Mint/burn/lock events carry IDs so ledgers and risk systems reconcile state the same way every time.",
      },
    },
    {
      title: {
        learn:  "Always up to date",
        build:  "APIs + SDK for provenance",
        operate:"Oracle/DON freshness windows",
      },
      body: {
        learn:
          "When new information arrives, the record updates. You can see the latest view and what changed.",
        build:
          "Simple endpoints: getAttestation(id), getPolicy(assetId), listLineage(assetId).",
        operate:
          "Freshness SLAs expose staleness; alerts fire when a window is exceeded so flows can be gated.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What you can check—right now",
        build:   "Data model for provenance",
        operate: "Supervisory observability",
      },
      paragraphs: {
        learn: [
          "For any MXTK you can follow a trail: reserve description, validator identity, survey dates, and conclusions. You don’t have to take our word for it—the documents are there.",
          "You’ll also see custody details and policy basics, so you know how the asset is handled and what protections apply.",
        ],
        build: [
          "Lineage includes: asset ID (class), batch IDs (reserve lots), attestation IDs (versioned), policy objects (custody/controls), and event logs (mint/burn/lock).",
          "All identifiers are stable and designed to be stored in your ledgers and risk engines.",
        ],
        operate: [
          "Dashboards surface stale oracle windows, policy deviations, and signing anomalies. All state transitions are exportable for audit and regulatory reporting.",
          "Exception queues and webhooks allow ops to intervene or pause flows when freshness or policy checks fail.",
        ],
      },
      highlight: {
        learn:
          "Plainly: MXTK keeps the proof attached to the value so anyone can understand what it represents.",
        build:
          "Provenance is not a PDF graveyard—it’s structured data you can query and rely on.",
        operate:
          "You can monitor, report, and explain the asset’s state at any moment in time.",
      },
    },
    {
      heading: {
        learn:   "How updates work",
        build:   "Versioning strategy",
        operate: "Change control & rollbacks",
      },
      paragraphs: {
        learn: [
          "When new validator information arrives, we don’t overwrite history—we add a new version and keep the old one available.",
        ],
        build: [
          "Attestations are immutable records keyed by a versioned ID. Tokens reference the attestation active at mint (or current, if policy requires).",
        ],
        operate: [
          "Change control is ticketed and signed. If a version must be rolled back, the lineage remains visible and the rollback is recorded.",
        ],
      },
    },
    {
      heading: {
        learn:   "Why this matters",
        build:   "For your users and auditors",
        operate: "For your risk and regulators",
      },
      paragraphs: {
        learn: [
          "Trust comes from clarity. By exposing the full picture, MXTK helps everyone make informed decisions.",
        ],
        build: [
          "You can show your users and auditors exactly what backs your positions without assembling materials by hand.",
        ],
        operate: [
          "Supervisors get consistent answers. Reports, identifiers, and events line up across teams and systems.",
        ],
      },
    },
  ],
};


