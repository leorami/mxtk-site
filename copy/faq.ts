import type { PageCopy } from "./types";

export const faqCopy: PageCopy = {
  heroTitle: {
    learn:   "Straight answers to common questions.",
    build:   "Implementation details without the fluff.",
    operate: "Operational realities, controls, and responsibilities.",
  },
  heroSub: {
    learn:
      "New to MXTK? Start here. We keep answers short, plain, and linked to proof where possible.",
    build:
      "You’ll find specifics on identifiers, webhooks, and versioning—what to rely on and what might change.",
    operate:
      "Covers custody, policy, alerts, reporting, and how we handle incidents and deprecations.",
  },

  pillars: [
    {
      title: { learn: "Plain language", build: "Precise terms", operate: "Practical guidance" },
      body: {
        learn:  "No jargon walls. If a term appears, we define it in a sentence.",
        build:  "Identifiers and schemas are the source of truth. We avoid ambiguity.",
        operate:"Runbooks and contacts over assumptions. Everything has an owner.",
      },
    },
    {
      title: { learn: "Verifiable claims", build: "Stable contracts", operate: "Auditable trails" },
      body: {
        learn:  "Where possible, we link to public attestations or docs you can check.",
        build:  "APIs and webhooks are versioned. Deprecations come with migration guides.",
        operate:"Receipts, exceptions, and exports add up to a clear paper trail.",
      },
    },
    {
      title: { learn: "Boundaries are explicit", build: "Predictable changes", operate: "Compliance by design" },
      body: {
        learn:  "We’re careful about what MXTK is and isn’t.",
        build:  "We add fields rather than breaking them. Major changes gate behind flags.",
        operate:"KYC/AML guardrails and geographic controls are integrated into flows.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What is MXTK in one sentence?",
        build:   "What object model should I rely on?",
        operate: "What do I monitor day-to-day?",
      },
      paragraphs: {
        learn: [
          "MXTK is a token that represents verified mineral reserves—with the proof attached.",
        ],
        build: [
          "Core identifiers are: assetId (the mineral class), batchId (a specific reserve batch), attestationId (a verification snapshot), and policyId (custody/transfer rules). These are stable and versioned.",
        ],
        operate: [
          "Oracle freshness, custody key rotations, webhook signature verification, exception queues, and monthly exports.",
        ],
      },
    },
    {
      heading: {
        learn:   "How do I verify what backs a token?",
        build:   "How do webhooks and signatures work?",
        operate: "How are exceptions handled?",
      },
      paragraphs: {
        learn: [
          "Open the Transparency page, pick an asset, and follow the links to its attestations. You’ll see who verified what and when.",
        ],
        build: [
          "Webhooks are signed using rotating keys. Verify signatures with the SDK helper; keys are published via a versioned endpoint with effective-from timestamps.",
        ],
        operate: [
          "Failed checks (e.g., ineligible recipient) create an exception with a reason and remediation hints. You’ll receive a webhook and see it queued until resolved.",
        ],
      },
    },
    {
      heading: {
        learn:   "Is MXTK an investment recommendation?",
        build:   "How do upgrades and deprecations work?",
        operate: "How do audits and reports work?",
      },
      paragraphs: {
        learn: [
          "No. MXTK is infrastructure for representing reserves with transparency. Always do your own diligence.",
        ],
        build: [
          "Minor versions are additive (new fields). Major changes gate behind flags with migration guides and a deprecation window. Release notes include schema diffs.",
        ],
        operate: [
          "We publish regular reports and provide exports (CSV/JSON) keyed by the same identifiers used in the APIs. Auditors can follow the same links you do.",
        ],
      },
      highlight: {
        learn:   "We prefer clarity over hype—always.",
        build:   "If an interface changes, you’ll see it coming with examples ready.",
        operate: "The goal is boring, verifiable operations—not surprise audits.",
      },
    },
  ],
};


