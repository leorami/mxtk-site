import type { PageCopy } from "./types";

// Stage-aware Home copy (Wave 6)
export type Stage = "training" | "preparing" | "conquer";

export const hero: Record<Stage, { title:string; body:string; cta:string; tertiary:string }> = {
  training:  { title:"Start your MXTK journey", body:"Learn the basics with plain-language guides and Sherpa at your side.", cta:"Explore", tertiary:"How MXTK works" },
  preparing: { title:"Wire it up and test",     body:"Connect wallets, verify data, and dry-run your first positions.",    cta:"Get ready", tertiary:"See transparency tools" },
  conquer:   { title:"Operate with confidence",  body:"Monitor markets, verify proofs, and scale with discipline.",       cta:"Open dashboard", tertiary:"View reports" },
};

export const statusRow: Record<Stage, Array<{ label:string; value:string; icon:string }>> = {
  training:  [{label:"Guides", value:"Getting started", icon:"book"}],
  preparing: [{label:"Checklist", value:"Integration ready", icon:"check"}],
  conquer:   [{label:"Ops", value:"Live monitoring", icon:"activity"}],
};

export const helpers: Record<Stage, { underHero:string }> = {
  training:  { underHero:"Your Home adapts as you learn—pin what helps most." },
  preparing: { underHero:"Refine your plan and verify key assumptions as you go." },
  conquer:   { underHero:"Operate with confidence—monitor risk, verify proofs, and act fast." },
};

// Replace with your actual source of truth for Journey Stage (store, cookie, query, etc.)
export function getCurrentStage(): Stage {
  if (typeof window === "undefined") return "training";
  return (window.sessionStorage.getItem("mxtk_stage") as Stage) || "training";
}

export const homeCopy: PageCopy = {
  heroTitle: {
    learn:   "Gold in the ground, value in your hands.",
    build:   "Tokenize and mobilize verified mineral value.",
    operate: "Institutional rails for tokenized mineral collateral.",
  },
  heroSub: {
    learn:
      "MXTK turns independently-verified mineral reserves into 1:1-backed digital tokens you can hold and use—guided by clear, AI-powered explanations of how it all works.",
    build:
      "MXTK packages validator-attested reserves with audit-friendly provenance and programmable controls—so you can build custody, settlement, and risk tooling on a familiar, institutional stack.",
    operate:
      "Group-1 friendly RWA with oracle-assured attestations, MPC custody, and atomic DvP workflows—engineered for repo, collateral transformation, and cross-venue mobilization.",
  },
  pillars: [
    {
      title: {
        learn: "Real assets, clearly explained",
        build: "Validator attestations, clean provenance",
        operate: "Assured data, settlement-grade controls",
      },
      body: {
        learn:
          "Each token traces to independent reports and surveys. You can see what was verified, by whom, and when.",
        build:
          "Attestations link to on-chain IDs with signed reports, version history, and machine-readable references.",
        operate:
          "Oracle proofs plus policy objects (slashing/clawback) reduce information asymmetry and support controls.",
      },
    },
    {
      title: {
        learn: "Transparent and secure by design",
        build: "Compliance-first infrastructure",
        operate: "Basel-aligned treatment; MPC + insurance",
      },
      body: {
        learn:
          "Independent checks, clear records, and reputable custody remove the guesswork. You can inspect what you own.",
        build:
          "Regulated custody, audit trails, deterministic upgrades, and policy guards are designed to meet institutional obligations.",
        operate:
          "MPC key ceremonies with insured coverage; tokenized govies remain Group-1; capital treatment follows the underlying.",
      },
    },
    {
      title: {
        learn: "Built to be useful day-one",
        build: "Programmable collateral, simple APIs",
        operate: "Atomic DvP; intraday mobility",
      },
      body: {
        learn:
          "You can move value quickly—no specialist crypto knowledge needed. MXTK is designed for normal people and professionals.",
        build:
          "SDKs and simple endpoints for mint/burn/lock flows, eligibility checks, and attestation lookups.",
        operate:
          "Same-day liquidity with atomic swap/settle patterns removes daylight exposure and end-of-day reconciliation risk.",
      },
    },
  ],
  // deep explainer sections per mode
  sections: [
    {
      heading: {
        learn:   "What exactly is MXTK?",
        build:   "What MXTK represents in a system architecture",
        operate: "Asset model, identifiers, and attestation rails",
      },
      paragraphs: {
        learn: [
          "MXTK is a digital token that represents value backed by verified mineral reserves—like gold—that exist in the real world. Independent experts check and document those reserves. We link that documentation to each token so anyone can see the evidence behind it.",
          "Why do this? Moving value through traditional systems can be slow and expensive. By making a digital version that preserves trust and auditability, value can move faster while still being tied to something real.",
        ],
        build: [
          "At a systems level, MXTK encapsulates (a) validator-attested reserve metadata, (b) custody & policy constraints, and (c) lifecycle events (mint/burn/lock) with provenance. Identifiers are stable and indexable so downstream systems can reconcile state deterministically.",
          "You can treat MXTK as a programmable collateral object: eligibility checks, lock primitives, and attestation reads are all addressable via SDKs and APIs.",
        ],
        operate: [
          "The token maps to a reserve record with signed validator reports (hash-anchored), custody policy (MPC, insured), and an oracle-served proof set. State transitions (mint/burn/lock/unlock) emit machine-readable events for reconciliation and supervision systems.",
          "Identifiers: static asset ID, reserve batch IDs, and versioned attestation IDs allow precise lineage and audit. DONs publish freshness windows; policy objects define slashing/clawback under enumerated failure modes.",
        ],
      },
      highlight: {
        learn:
          "Plainly: MXTK gives you a digital way to hold and use value that comes from minerals in the ground—with receipts you can read.",
        build:
          "MXTK is a composable collateral primitive with documented lineage and predictable integration points.",
        operate:
          "MXTK’s asset model targets settlement reliability and supervisory observability across venues.",
      },
    },
    {
      heading: {
        learn:   "How does it work in practice?",
        build:   "Core flows you’ll implement first",
        operate: "Reference flows and operational notes",
      },
      paragraphs: {
        learn: [
          "You acquire MXTK through a qualified venue or partner. Your wallet or account shows the tokens you hold, and every token is traceable back to documentation about the underlying reserves.",
          "When you want to use it—pledge for a loan, swap, or transfer—your custodian or the platform completes the action and records it so the history stays transparent.",
        ],
        build: [
          "Start with custody integration (MPC, insured), then wire up attestation lookups and eligibility checks. Implement mint/burn/lock flows via SDK or REST. For pricing, subscribe to oracle feeds or your own internal marks.",
          "Emit reconciliation hooks (webhooks/queues) on lifecycle events; map asset IDs to risk buckets; instrument dashboards for stale attestation windows.",
        ],
        operate: [
          "Atomic DvP patterns: pre-validated eligibility, lock on T, simultaneous instruction, on-chain settlement, event capture. Intraday mobility: lock-transfer-unlock with DON freshness gates. Supervisory: alerts on attestation staleness and policy deviations.",
          "Capital treatment follows underlying (e.g., Group-1 for tokenized govies). Establish SLA on oracle updates; test slashing/clawback table-tops with validators and custody.",
        ],
      },
    },
    {
      heading: {
        learn:   "Why it matters",
        build:   "What your users get",
        operate: "Where it fits in your stack",
      },
      paragraphs: {
        learn: [
          "People can finally move value tied to real things—quickly, with clear records. That opens the door to simpler saving, lending, and payments.",
        ],
        build: [
          "Developers get simple primitives to build useful finance: faster collateral movement, fewer manual reconciliations, and clear audit trails.",
        ],
        operate: [
          "MXTK slots beside custody, OMS/EMS, risk, and ledgering. It reduces operational friction in collateral use while improving observability.",
        ],
      },
    },
  ],
};


