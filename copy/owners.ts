import type { PageCopy } from "./types";

export const ownersCopy: PageCopy = {
  heroTitle: {
    learn:   "Turn verified mineral reserves into a usable digital asset.",
    build:   "Onboard reserves, connect custody, mint MXTK.",
    operate: "Owner workflows: attest → mint → lock → report.",
  },
  heroSub: {
    learn:
      "If you hold verified reserves (like gold), MXTK lets you represent a portion of that value digitally—so you can move it, pledge it, or diversify while keeping a clear record of what backs it.",
    build:
      "We link your validator reports to on-chain identifiers and custody policy, then expose simple APIs/SDKs for mint/burn/lock. Provenance stays attached end-to-end.",
    operate:
      "Operational playbook covers validator attestations, MPC custody/insurance, oracle freshness windows, lifecycle events, and reporting hooks.",
  },

  pillars: [
    {
      title: {
        learn:  "Proof first, then token",
        build:  "Validator → asset model → IDs",
        operate:"Attestation windows & lineage",
      },
      body: {
        learn:
          "Independent experts document your reserves. Only then do we mint, so each token has evidence you can show.",
        build:
          "Reports are hashed, signed, and linked to a stable asset ID and batch IDs to keep versions clear.",
        operate:
          "Oracle/DON publishes freshness windows. Downstream can verify which attestation version a token instance relies on.",
      },
    },
    {
      title: {
        learn:  "Freedom with guardrails",
        build:  "Policy objects & custody",
        operate:"MPC + insured coverage",
      },
      body: {
        learn:
          "You control when and how the tokens are used, with guardrails that prevent mistakes and keep records consistent.",
        build:
          "Custody policy (who can move, limits, lock rules) ships as structured data your systems can enforce.",
        operate:
          "Keys are split (MPC). Coverage is insured. Activity is logged for internal/external audit.",
      },
    },
    {
      title: {
        learn:  "Useful on day one",
        build:  "Mint / burn / lock primitives",
        operate:"Atomic DvP, intraday moves",
      },
      body: {
        learn:
          "Use MXTK as collateral, move it quickly, and see its history any time.",
        build:
          "Simple endpoints and SDKs wire minting, burning, and locking into back-office flows.",
        operate:
          "Lock-transfer-unlock patterns enable intraday mobility with deterministic reconciliation.",
      },
    },
  ],

  sections: [
    {
      heading: {
        learn:   "What you actually get as an owner",
        build:   "From geology to identifiers: the data path",
        operate: "Control plane & observability",
      },
      paragraphs: {
        learn: [
          "MXTK gives you a digital representation of verified value. It’s not a marketing line—it’s a token that points back to real documents and real experts. You can show what backs your asset, not just claim it.",
          "You also gain mobility: pledge MXTK for financing, settle faster with partners, and move value across systems that might not talk to each other well today.",
        ],
        build: [
          "Validator reports are hashed and signed. We assign stable asset IDs, reserve batch IDs, and versioned attestation IDs. These get embedded into token metadata so software can reason about lineage.",
          "Your custody policy (limits, roles, lock rules) is modeled as a policy object. Systems can fetch and enforce it consistently.",
        ],
        operate: [
          "You’ll monitor attestation freshness, lock states, and event streams (mint/burn/lock/unlock) via dashboards or webhooks. Deviations trigger alerts.",
          "Internal audit can replay lineage from current state back to the validator report that supported the mint event.",
        ],
      },
      highlight: {
        learn:
          "In plain words: you unlock modern mobility without losing the trust that comes from real-world verification.",
        build:
          "Identifiers and policy are first-class citizens—so every integration can validate the same truths.",
        operate:
          "Treat MXTK like any supervised asset: policies, logs, SLAs, and escalation paths are built in.",
      },
    },
    {
      heading: {
        learn:   "How onboarding works (step-by-step)",
        build:   "Minimal integration plan",
        operate: "Operational playbook",
      },
      paragraphs: {
        learn: [
          "1) Share validator documentation. 2) Custody is set up with appropriate controls. 3) An initial mint is created and recorded. 4) You can then hold, pledge, or transfer tokens as needed.",
        ],
        build: [
          "Week 1: custody (MPC/insurance) + environment keys. Week 2: attestation ingestion + ID mapping. Week 3: mint/burn/lock endpoints in UAT. Week 4: initial mint and go-live.",
          "All endpoints are simple: createMint, burn, lock/unlock, getAttestation(id), getPolicy(assetId).",
        ],
        operate: [
          "Daily: check oracle/attestation freshness and exception queue. Weekly: review usage reports and locks. Monthly/quarterly: validator rollups and coverage attestations.",
          "Run table-tops for slashing/clawback scenarios; verify signers and recovery procedures.",
        ],
      },
      highlight: {
        learn:
          "Onboarding is guided. You won’t be left guessing what comes next.",
        build:
          "Deliverables are small, testable pieces that fit into existing back-office patterns.",
        operate:
          "Clear rhythms reduce operational risk and make audits straightforward.",
      },
    },
    {
      heading: {
        learn:   "How value shows up (in real life)",
        build:   "Integration patterns that stick",
        operate: "Risk, reporting, and compliance",
      },
      paragraphs: {
        learn: [
          "Faster access to financing, simpler collateral pledges, and cleaner records. Partners can trust what you present because the proof is attached.",
        ],
        build: [
          "Common patterns: pledge MXTK into a facility, lock during settlement, unlock on completion—events feed your ledger and risk stack.",
          "Everything is designed to be boring in production: predictable events, deterministic IDs, stable contracts.",
        ],
        operate: [
          "We map the token’s treatment to the underlying asset. Reports, events, and identifiers are exportable for regulators and auditors.",
          "Your dashboards surface stale data, abnormal flows, and signer issues before they turn into incidents.",
        ],
      },
    },
  ],
};


