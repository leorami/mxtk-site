import type { PageCopy } from "../types";
const same = (s: string) => ({ learn: s, build: s, operate: s });
const sameArray = (arr: string[]) => ({ learn: arr, build: arr, operate: arr });

export const disclosuresCopy: PageCopy = {
  heroTitle: same("Disclosures"),
  heroSub:   same("Regulatory posture, risk factors, and important product limitations—summarized up front with links to deeper material."),

  pillars: [
    { title: same("Regulatory posture"), body: same("MXTK is designed to interoperate with existing rails and controls; we publish verifiable artifacts to support compliance workflows.") },
    { title: same("Key risks"), body: same("Market risk, oracle/data freshness, smart-contract risk, and operational dependencies are described with mitigations and controls.") },
    { title: same("Transparency"), body: same("Attestations, receipts, and versioned docs provide an evidence trail for audits and due diligence.") },
  ],

  sections: [
    {
      heading: same("1. Product scope and limits"),
      paragraphs: sameArray([
        "MXTK attaches evidence to claims; it is not a broker, custodian, or exchange. Certain jurisdictions may restrict use.",
      ]),
    },
    {
      heading: same("2. Risk factors"),
      paragraphs: sameArray([
        "Volatility, data latency, third-party dependencies, protocol changes, and regulatory change can affect outcomes.",
      ]),
    },
    {
      heading: same("3. Verification artifacts"),
      paragraphs: sameArray([
        "We publish identifiers, receipts, and attestations designed for machine and human review. Freshness targets and exception handling are documented.",
      ]),
    },
    {
      heading: same("4. Updates & versioning"),
      paragraphs: sameArray([
        "We timestamp releases and keep an archive of prior versions with diffs so that reviews can track change over time.",
      ]),
    },
  ],
};


