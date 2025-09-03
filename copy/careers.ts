import type { PageCopy } from "./types";

export const careersCopy: PageCopy = {
  heroTitle: {
    learn:   "Join the team that makes real-world value transparent.",
    build:   "Ship verifiable systems—small, typed, and audit-ready.",
    operate: "Run reliable rails with crisp runbooks and ownership.",
  },
  heroSub: {
    learn:
      "We explain plainly, prove claims, and build for people who aren’t experts—because most of the world isn’t.",
    build:
      "We value model-driven design, stable identifiers, and examples that compile. Every change earns a doc.",
    operate:
      "Predictable on-call, clear SLAs, and postmortems that improve controls—not blame individuals.",
  },

  pillars: [
    {
      title: { learn: "Clarity first", build: "Typed contracts", operate: "Boring ops" },
      body: {
        learn:  "We favor simple words and useful diagrams over cleverness.",
        build:  "assetId, batchId, attestationId—contracts you can rely on.",
        operate:"Steady change control and auditable trails by default.",
      },
    },
    {
      title: { learn: "Proof, not pitch", build: "Examples > slides", operate: "Runbooks > heroics" },
      body: {
        learn:  "If we can’t link to evidence, we don’t say it.",
        build:  "Minimal, copy-paste examples accompany new features.",
        operate:"Clear owners, pagers, and procedures for every system.",
      },
    },
    {
      title: { learn: "People over posture", build: "Feedback loops", operate: "Safety culture" },
      body: {
        learn:  "No ego walls. We pair, explain, and improve together.",
        build:  "We ship small and learn from production safely.",
        operate:"Incidents trigger improvements, not finger-pointing.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What kind of work you’ll do",
        build:   "Engineering expectations",
        operate: "Operational expectations",
      },
      paragraphs: {
        learn: [
          "Turn complex financial and geologic ideas into simple product experiences.",
          "Write explainers and UI copy that help newcomers feel smart, not lost.",
        ],
        build: [
          "Own end-to-end slices: schema, API/SDK, tests, docs, and examples.",
          "Ship additive, backward-compatible changes; use flags for big moves.",
        ],
        operate: [
          "Keep runbooks current, tame alert noise, and close the loop after incidents.",
          "Measure what matters: freshness, correctness, and user success.",
        ],
      },
    },
    {
      heading: {
        learn:   "Our interview process",
        build:   "What we look for in code",
        operate: "What we look for in ops",
      },
      paragraphs: {
        learn: [
          "Quick intro → practical exercise you can do async → pair session → team chat → references. Fast, respectful, and transparent.",
        ],
        build: [
          "Readable code, clear types, small abstractions, and tests that describe behavior.",
          "Documentation that teaches the next person, including future-you.",
        ],
        operate: [
          "Evidence of runbooks, postmortems with controls, and good production hygiene.",
          "A bias for guardrails and gradual, reversible change.",
        ],
      },
      highlight: {
        learn:   "We hire for clarity, care, and craft.",
        build:   "If the example isn’t runnable in 5 minutes, we fix the example.",
        operate: "Reliability is a product feature.",
      },
    },
    {
      heading: {
        learn:   "How to apply",
        build:   "Great application signals",
        operate: "Location, timezones, and compensation",
      },
      paragraphs: {
        learn: [
          "Send a short note about why MXTK interests you and what you want to learn.",
        ],
        build: [
          "A small repo, a thoughtful PR, or a short doc explaining how you’ve made systems clearer for others.",
        ],
        operate: [
          "We’re remote-first with overlap windows for pairing. Compensation is market-based with transparent leveling.",
        ],
      },
    },
  ],
};


