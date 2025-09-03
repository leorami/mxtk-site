import type { PageCopy } from "./types";

export const contactCopy: PageCopy = {
  heroTitle: {
    learn:   "Get in touch—human answers, plain language.",
    build:   "Integration questions, SDK help, and technical briefings.",
    operate: "Support SLAs, escalation paths, and status updates.",
  },
  heroSub: {
    learn:
      "Whether you’re curious or cautious, we’ll meet you where you are and point to proof you can verify yourself.",
    build:
      "We can pair on flows, review designs, or provide example code. If it’s not documented, we’ll help write it.",
    operate:
      "We run a documented triage process with defined response times and escalation to on-call owners.",
  },

  pillars: [
    {
      title: { learn: "Real people", build: "Hands-on help", operate: "Clear SLAs" },
      body: {
        learn:  "We reply with direct, useful answers instead of canned boilerplate.",
        build:  "Office hours and code reviews available for complex integrations.",
        operate:"We publish response targets and stick to them.",
      },
    },
    {
      title: { learn: "Proof over pitch", build: "Examples first", operate: "Escalation paths" },
      body: {
        learn:  "When we say something, we link to where you can verify it.",
        build:  "We provide minimal, copy-paste samples that map to your use case.",
        operate:"Critical issues have named owners and an on-call rotation.",
      },
    },
    {
      title: { learn: "Respect your time", build: "BasePath-aware links", operate: "Status you can trust" },
      body: {
        learn:  "We avoid back-and-forth by asking for the right context up front.",
        build:  "All links we send work under root and proxy—no hardcoded prefixes.",
        operate:"Outages and maintenance windows are announced with ETAs and postmortems.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "Best way to contact us",
        build:   "What to include for faster help",
        operate: "How tickets flow",
      },
      paragraphs: {
        learn: [
          "Use the contact form or the published inbox on this page. Tell us your role and what you’re trying to accomplish.",
        ],
        build: [
          "Share the endpoint or SDK call, the IDs involved (assetId, batchId, attestationId), and any logs. If under proxy, note the path.",
        ],
        operate: [
          "We triage severity (S1–S4), acknowledge receipt, and set a next-update time. Escalations go to on-call; status is kept current.",
        ],
      },
    },
    {
      heading: {
        learn:   "Security & privacy",
        build:   "Responsible disclosure",
        operate: "Incident communication",
      },
      paragraphs: {
        learn: [
          "Don’t send secrets in tickets. We can arrange a secure channel if needed.",
        ],
        build: [
          "Report vulnerabilities with repro steps. We coordinate fixes and credit researchers who help.",
        ],
        operate: [
          "For incidents, we publish what happened, impact, and remediation. We prefer clear facts to speculation.",
        ],
      },
      highlight: {
        learn:   "You don’t need to know the jargon to get help from us.",
        build:   "If your question reveals a docs gap, we’ll close it.",
        operate: "Honest, timely updates > perfect predictions.",
      },
    },
  ],
};


