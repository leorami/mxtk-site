import type { PageCopy } from "./types";

export const mxtkCaresCopy: PageCopy = {
  heroTitle: {
    learn:   "Turn verified minerals into verifiable impact.",
    build:   "Program rails for pledges, routing, and transparency.",
    operate: "Controls for compliance, reporting, and recurring grants.",
  },
  heroSub: {
    learn:
      "MXTK Cares channels a portion of activity toward causes you choose. Funding is traceable from source to recipient.",
    build:
      "APIs let you pledge a basis-point share, route to vetted recipients, and publish receipts with proof.",
    operate:
      "Custody policies, geofencing, and beneficiary checks are built-in. Reports export cleanly for boards and auditors.",
  },

  pillars: [
    {
      title: { learn: "Simple pledges", build: "Programmable splits", operate: "Policy-aware" },
      body: {
        learn:
          "Pick a cause, set a percentage, and see how your activity contributes over time.",
        build:
          "Define splits once; flows are applied automatically and logged with identifiers you can reconcile.",
        operate:
          "KYC/AML guardrails and eligibility checks are enforced before funds move, with audit trails.",
      },
    },
    {
      title: { learn: "Vetted partners", build: "Receipts & attestations", operate: "Exports & dashboards" },
      body: {
        learn:
          "Recipients are screened and monitored so impact is real and responsible.",
        build:
          "Each disbursement emits a receipt with time, amount, route, and a hash of the beneficiary confirmation.",
        operate:
          "CSV/JSON exports, board-ready PDFs, and a simple dashboard for trend lines and exceptions.",
      },
    },
    {
      title: { learn: "You’re in control", build: "APIs & webhooks", operate: "Change control" },
      body: {
        learn:
          "Pause, resume, or change your pledge at any time. Transparency is preserved even when settings change.",
        build:
          "Create pledges, list splits, subscribe to webhooks for receipts and exceptions.",
        operate:
          "Any change to recipients or percentages is versioned and logged for review.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "How it works in practice",
        build:   "Data you can store and reconcile",
        operate: "Compliance and reporting",
      },
      paragraphs: {
        learn: [
          "When activity settles, a small portion routes to your chosen causes. You’ll see running totals and where funds go—no guesswork.",
          "Receipts are public by default so donors and communities can see outcomes without sharing sensitive details.",
        ],
        build: [
          "Objects include: pledgeId, split table, recipientId, receiptId, and a hash for beneficiary confirmations. All are stable identifiers.",
          "You can store these alongside your normal transactions; reconciliation becomes trivial.",
        ],
        operate: [
          "Recipients are vetted. Disbursements enforce policy checks for jurisdiction, eligibility, and sanctions. Reports export monthly and on demand.",
          "Exception handling is predictable: failed checks send a webhook and queue the item until resolved.",
        ],
      },
      highlight: {
        learn:
          "Clarity builds trust. You see exactly what changed hands, for whom, and when.",
        build:
          "Identifiers + receipts remove the need for bespoke spreadsheets.",
        operate:
          "The default is compliant by design; reporting isn’t an afterthought.",
      },
    },
    {
      heading: {
        learn:   "Get involved",
        build:   "Integrate in a weekend",
        operate: "Operate with confidence",
      },
      paragraphs: {
        learn: [
          "Choose a cause from our vetted list or propose one. Set a percentage and you’re live.",
        ],
        build: [
          "Use the SDK to create a pledge, define splits, and subscribe to receipts. Add a small status panel to your product to show impact totals.",
        ],
        operate: [
          "Your board will have clear, exportable records. Auditors get identifiers, receipts, and policy checks without manual hunt-and-peck.",
        ],
      },
    },
  ],
};


