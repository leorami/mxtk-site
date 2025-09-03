import type { PageCopy } from "./types";

export const mediaCopy: PageCopy = {
  heroTitle: {
    learn:   "MXTK in plain language—facts, visuals, and the story.",
    build:   "Press kits, diagrams, and verified sources you can cite.",
    operate: "Embargoes, contacts, and attribution guidelines.",
  },
  heroSub: {
    learn:
      "If you’re new, start here. We explain what MXTK is, why it exists, and how to verify claims yourself.",
    build:
      "Download logos, product shots, and diagrams. Reference our attestations and public datasets with stable links.",
    operate:
      "Media requests have a clear path: contacts, response SLAs, and how we handle embargoes.",
  },

  pillars: [
    {
      title: { learn: "One-sentence summary", build: "Assets you can use", operate: "Clear process" },
      body: {
        learn:
          "MXTK is a token that represents verified mineral reserves—with the proof attached.",
        build:
          "Logos (SVG), wordmarks, product screenshots, and diagrams are packaged with usage notes.",
        operate:
          "We respond quickly. Where needed, we can provide background briefings and on-the-record quotes.",
      },
    },
    {
      title: { learn: "Verifiable claims", build: "Stable identifiers", operate: "Attribution & updates" },
      body: {
        learn:
          "We prefer facts you can check yourself: who verified reserves, when, and what changed.",
        build:
          "Cite asset IDs, batch IDs, and attestation IDs—these don’t drift over time.",
        operate:
          "If a detail changes, we publish an update note with a versioned attestation link.",
      },
    },
    {
      title: { learn: "Context you can trust", build: "Quotes & data", operate: "Press contacts" },
      body: {
        learn:
          "We’re careful about language. We avoid hype and explain limits as well as capabilities.",
        build:
          "We can provide quotes and selected metrics with sources, plus pointers to public datasets.",
        operate:
          "A dedicated inbox and timeframe guarantees, plus escalation paths for urgent deadlines.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "Storylines that resonate",
        build:   "Background materials",
        operate: "How we handle requests",
      },
      paragraphs: {
        learn: [
          "People want speed without losing diligence. MXTK brings both by keeping proof attached to value.",
          "Real-world verification sits beside modern rails; it’s not either/or.",
        ],
        build: [
          "Press kit includes: brand guide, logo/wordmark SVGs, screenshots, and simplified diagrams of identifiers and events.",
          "We provide stable links to attestations and policy objects so readers can verify claims.",
        ],
        operate: [
          "Send your questions and deadline. We’ll confirm receipt, share timing, and route to the right subject matter expert.",
          "For embargoes, we document scope, time, and who has access. We never share non-public details without written agreement.",
        ],
      },
      highlight: {
        learn:   "Focus on what’s verifiable and useful to your readers.",
        build:   "If you cite an ID, your link won’t rot.",
        operate: "You’ll always know who’s responding and when.",
      },
    },
    {
      heading: {
        learn:   "What MXTK is not",
        build:   "Boundaries and language",
        operate: "Corrections and follow-ups",
      },
      paragraphs: {
        learn: [
          "It’s not an investment recommendation. It’s a way to represent verified reserves with transparency.",
        ],
        build: [
          "We avoid implying certainty where there is none. Use precise language around verification, custody, and policy.",
        ],
        operate: [
          "If something needs correction, tell us. We’ll respond with a fix or an explanation and update public notes as needed.",
        ],
      },
    },
  ],
};


