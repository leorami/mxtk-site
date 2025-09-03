import type { PageCopy } from "../types";

const same = (s: string) => ({ learn: s, build: s, operate: s });
const sameArray = (arr: string[]) => ({ learn: arr, build: arr, operate: arr });

export const termsCopy: PageCopy = {
  heroTitle: {
    ...same("Terms of Use"),
  },
  heroSub: {
    ...same("Plain-English summary first, then the binding terms. This page explains what MXTK is, what it isn’t, and how you’re allowed to use our services and materials."),
  },

  pillars: [
    {
      title: same("Plain-English summary"),
      body: same("MXTK is a technology + information platform. Nothing here is investment, legal, tax, or accounting advice. Use MXTK only where lawful, and don’t misuse the service."),
    },
    {
      title: same("Your responsibilities"),
      body: same("Follow applicable laws, protect your credentials, and don’t reverse engineer or attack the service. If you find a bug/security issue, report it responsibly."),
    },
    {
      title: same("Our responsibilities"),
      body: same("We strive for accuracy and reliability, but we provide MXTK “as-is” to the fullest extent allowed by law. We may update features, docs, and terms as the product evolves."),
    },
  ],

  sections: [
    {
      heading: same("1. What MXTK is (and isn’t)"),
      paragraphs: sameArray([
        "MXTK is an ERC-20 based system with verification artifacts designed to make claims verifiable. MXTK does not itself sell, broker, or custody assets.",
        "Content on this site is for information only and should not be relied on for investment decisions without independent verification.",
      ]),
    },
    {
      heading: same("2. Eligibility and acceptable use"),
      paragraphs: sameArray([
        "You may use MXTK only if you have capacity to contract and are not prohibited by sanctions or applicable law.",
        "Do not misuse the service: no scraping beyond documented APIs, no denial-of-service, no unauthorized access.",
      ]),
    },
    {
      heading: same("3. No advice; no fiduciary duty"),
      paragraphs: sameArray([
        "MXTK does not provide investment, legal, tax, or accounting advice. You are responsible for your decisions and for complying with your obligations.",
      ]),
    },
    {
      heading: same("4. Disclaimers and limitation of liability"),
      paragraphs: sameArray([
        "MXTK is provided “as-is” and “as-available.” To the maximum extent permitted by law, MXTK and its affiliates are not liable for indirect, incidental, or consequential damages.",
      ]),
    },
    {
      heading: same("5. Changes; contact"),
      paragraphs: sameArray([
        "We may modify these terms as the product and regulations evolve. We’ll timestamp changes and provide a short summary of material updates.",
      ]),
    },
  ],
};


