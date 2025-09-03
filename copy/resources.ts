import type { PageCopy } from "./types";

export const resourcesCopy: PageCopy = {
  heroTitle: {
    learn:   "Everything you need to understand MXTK—clearly and in order.",
    build:   "SDKs, API references, and example flows that actually compile.",
    operate: "Runbooks, SLAs, and checklists for safe day-to-day operation.",
  },
  heroSub: {
    learn:
      "Start with plain-language explainers, then dive deeper at your own pace. No jargon walls, just progressive clarity.",
    build:
      "Typed SDKs, Postman collections, event schemas, and copy-paste samples get you productive fast.",
    operate:
      "Operational guides cover custody policies, oracle freshness, change control, and audit exports.",
  },

  pillars: [
    {
      title: { learn: "Explainers first", build: "Real examples", operate: "Low-drama ops" },
      body: {
        learn:  "Short pages that define terms, show a diagram, and link to proof you can verify yourself.",
        build:  "Minimal boilerplate, clear types, and working snippets for the critical paths.",
        operate:"Simple runbooks with owners, triggers, and “done” conditions—no guesswork.",
      },
    },
    {
      title: { learn: "Glossary that helps", build: "Stable schemas", operate: "Exports that match" },
      body: {
        learn:  "Every term maps to a concrete object in the system—nothing hand-wavy.",
        build:  "Identifiers don’t drift: assetId, batchId, attestationId, policyId.",
        operate:"CSV/JSON exports line up with schemas so reconciliation is trivial.",
      },
    },
    {
      title: { learn: "Proof attached", build: "SDKs + tools", operate: "Monitors + alerts" },
      body: {
        learn:  "We always point to attestations, not press releases.",
        build:  "Node/TypeScript SDK, signed webhooks, and a tiny CLI for quick checks.",
        operate:"Reference dashboards and alert templates for stale data or policy exceptions.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "Start here: your path through the materials",
        build:   "Developer path: from zero to integration",
        operate: "Operator path: from setup to steady state",
      },
      paragraphs: {
        learn: [
          "Begin with the 3-minute overview, then read the short explainers on identifiers, custody, and attestations. Each page is written for non-experts.",
          "When you’re ready, open the Transparency page and follow the links to public attestations—seeing proof unlocks understanding.",
        ],
        build: [
          "Clone the examples repo and run the “hello identifiers” sample. It resolves an assetId, a batchId, and one attestation with types.",
          "Import the Postman collection to try endpoints. When you’re comfortable, wire the SDK flows used by your application.",
        ],
        operate: [
          "Pick a custody policy template, define your change window, and import alert templates for oracle freshness and receipt exceptions.",
          "Schedule monthly exports and keep a short runbook for key rotations and signer checks.",
        ],
      },
    },
    {
      heading: {
        learn:   "What to read next",
        build:   "Schemas & events you’ll touch",
        operate: "Runbooks you’ll use most",
      },
      paragraphs: {
        learn: [
          "Owners and Institutions pages show the same story from different angles—helpful after the overview.",
          "The Whitepaper is there when you want the deeper model behind everything else.",
        ],
        build: [
          "Identifiers: assetId, batchId, attestationId. Events: mint, transfer, pledge, receipt. Each has a minimal JSON example and a typed interface.",
          "Webhooks: receipts, exceptions, policy updates. Signed with rotating keys; verify once and reuse the helper.",
        ],
        operate: [
          "Custody onboarding, oracle freshness checks, exception handling, export & archive—each with a one-page checklist.",
          "Postmortems focus on causes and controls, not blame. Improvements ship as small pull requests you can review easily.",
        ],
      },
      highlight: {
        learn:   "You don’t need a background in finance or crypto—just curiosity.",
        build:   "If a sample doesn’t run in five minutes, we fix the sample.",
        operate: "Predictable, documented change wins over speed without safeguards.",
      },
    },
  ],
};


