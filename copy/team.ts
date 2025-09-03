import type { PageCopy } from "./types";

export const teamCopy: PageCopy = {
  heroTitle: {
    learn:   "The people behind MXTK.",
    build:   "Builders with deep infra, finance, and verification chops.",
    operate: "Governance, disclosure, and how we ship reliably.",
  },
  heroSub: {
    learn:
      "We’re a small team obsessed with clarity: simple explanations, verifiable claims, and safe-by-default choices.",
    build:
      "We’ve shipped production systems across custody, data pipelines, and market rails—and we design for audits from day one.",
    operate:
      "Clear ownership, on-call rotations, and written runbooks. No heroics—just steady, transparent operations.",
  },

  pillars: [
    {
      title: { learn: "Clarity over hype", build: "Model-driven design", operate: "Boring, predictable ops" },
      body: {
        learn:  "We explain what MXTK is—and isn’t—in plain language.",
        build:  "Identifiers, attestations, policy objects. Contracts you can rely on.",
        operate:"Change control, SLAs, and rollbacks documented with every release.",
      },
    },
    {
      title: { learn: "Proof attached", build: "Typed everything", operate: "Audit trails" },
      body: {
        learn:  "We keep the proof next to the value so anyone can check.",
        build:  "SDKs, schemas, and examples that compile, with version history.",
        operate:"Receipts, exceptions, and exports make reviews straightforward.",
      },
    },
    {
      title: { learn: "Service, not spectacle", build: "Interoperable", operate: "Accountable" },
      body: {
        learn:  "We measure success by usefulness, not headlines.",
        build:  "Works with custody, oracles/DONs, and existing ops tools.",
        operate:"Named owners for systems and docs—no mystery teams.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "Principles we work by",
        build:   "Engineering standards",
        operate: "Operational standards",
      },
      paragraphs: {
        learn: [
          "Write it down. Ship in small steps. Prefer clarity to cleverness.",
          "Keep proof close. If a claim can’t be verified, we won’t publish it.",
        ],
        build: [
          "Stable identifiers; additive changes by default. Lint/type gates enforced in CI.",
          "Every feature lands with examples and docs; no “code-only” releases.",
        ],
        operate: [
          "Rotating on-call with runbooks and postmortems. Alert fatigue minimized by clear thresholds.",
          "SLA-backed status comms; deprecations announced with migration guides.",
        ],
      },
    },
    {
      heading: {
        learn:   "Experience that matters",
        build:   "How to contribute",
        operate: "Security & disclosure",
      },
      paragraphs: {
        learn: [
          "Team experience spans market infrastructure, custody, applied cryptography, and regulated operations.",
        ],
        build: [
          "Open issues tagged ‘good first change.’ Contribution guide explains coding style, tests, and review expectations.",
        ],
        operate: [
          "Coordinated disclosure preferred. We triage quickly and credit researchers who help us improve.",
        ],
      },
      highlight: {
        learn:   "We aim to be the most understandable team in this space.",
        build:   "If the example isn’t clear, we fix the example.",
        operate: "Safety beats speed, every time.",
      },
    },
  ],
};


