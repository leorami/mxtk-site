# MXTK Website Update

## &#x20;Strategy, Decisions, and Visual Mockups

## Executive summary

I synthesized the current site, your WIP sandbox, our target personas, and best practices from credible token/RWA launches. The new site will:

- Default to **Light theme** (institutional‑friendly) with a **Dark toggle** for crypto‑native users.
- Put a **Trust & Transparency hub** front and center with proofs on IPFS, an oracle methodology & change log, on‑chain addresses (token, pools, lockers, multisig), and risk factors in plain English.
- Serve key audiences with dedicated pages: **Owners**, **Institutions**, **MXTK Gives**, **Media**, and **Legal**.
- Use an open‑source, team‑friendly stack: **Next.js 14 + TypeScript + Tailwind**, **Directus** for structured content, and **MDX** for long‑form docs (whitepaper/roadmap).
- Label anything not yet live as **“Preview data”** and include data‑source tooltips throughout.

---

## Who we’re building for (and how the site helps)

- **Mineral owners:** Clear intake, accepted standards (JORC/NI 43‑101/SKR), confidentiality and next steps.
- **Institutions & banks:** One‑stop diligence view (governance, oracle method, addresses, liquidity plan, OTC rails).
- **Regulators & skeptics:** Traceable claims (IPFS proofs), change logs, and a risk page; conservative wording.
- **Nonprofits (MXTK Gives):** Program overview, nomination flow, lock/learning/story‑sharing commitments.

---

## Information architecture (routes)

**Home** • **Owners** • **Institutions** • **Transparency** (hub) • **Whitepaper** • **Roadmap** • **MXTK Gives** • **Media** • **Legal** (Terms, Privacy, Disclosures)

---

## Decisions & the “why”

**Platform & tech**

- **Next.js 14 + TS + Tailwind:** enterprise‑grade, fast, a11y‑friendly; design tokens keep the look cohesive.
- **Directus + MDX:** Non‑technical editors manage structured data (proofs, addresses, oracle versions) in Directus; engineers keep long‑form docs versioned in Git via MDX.
- **Arbitrum + wagmi/viem:** Low fees and transparent reads for addresses/pools.
- **Plausible + consent:** Privacy‑first analytics with an explicit banner.

**Trust & transparency**

- **IPFS proofs** with hashes, issuer, scope, date; downloadable.
- **Oracle methodology** + **change log** to document inputs and governance of updates.
- **On‑chain addresses** (token, pool(s), LP locks, multisig, timelock) published as they go live.
- **OTC monthly aggregates** (anonymized) and a candid **risk** section.

**Content & UX**

- **Light default** reassures owners/institutions; **Dark toggle** keeps crypto ergonomics.
- **Data‑source badges** and **Preview** labeling prevent over‑statement before data is live.
- High contrast, keyboard support, and fast loading to meet institutional expectations.

**Integrations (placeholders until finalized)**

- **KYC/AML:** Persona (placeholder).
- **Escrow/Custody:** BitGo (placeholder).
- Deep engineering appendices can live in a gated data room if needed.

---

## Visual mockups (wireframes)

> Note: These are concept visuals to align on layout and content.

### Light theme (default)

**Brand palette (approx.)** — white background with MXTK accents in orange and navy, plus teal/copper for calls‑to‑action.

**![mxtk_palette_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_palette_light.png)Top navigation (Light)**

**![mxtk_nav_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_nav_light.png)Landing (hero + proof tiles, Light)**

**![mxtk_landing_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_landing_light.png)Transparency hub (Light)**

**![mxtk_transparency_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_transparency_light.png)Institutions page (Light)**

**![mxtk_institutions_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_institutions_light.png)Footer (Light)**

![mxtk_footer_light](/Users/leorami/Development/mxtk-site/Mockups/mxtk_footer_light.png)


### Dark theme (optional toggle)

Top nav, landing, transparency, institutions, and footer in Dark for crypto‑native audiences are shown below.

**Top navigation (Dark)**

**![mxtk_nav](/Users/leorami/Development/mxtk-site/Mockups/mxtk_nav.png)Landing (Dark)**

**![mxtk_landing](/Users/leorami/Development/mxtk-site/Mockups/mxtk_landing.png)Transparency hub (Dark)**

**![mxtk_transparency](/Users/leorami/Development/mxtk-site/Mockups/mxtk_transparency.png)Institutions (Dark)**

**Footer (Dark)**




## What ships day one

- **Transparency hub** scaffolding with placeholders clearly labeled; swap to live CIDs and addresses as they’re approved.
- **Owners** and **Institutions** pages with the right language and modules.
- **MXTK Gives** program page + nomination form.
- **Media** page (boilerplate, logo assets) and **Legal** (Terms, Privacy, Disclosures).
- Performance, accessibility, and cookie consent.

---

## Next steps & asks

1. Confirm Directus for CMS and MDX for long‑form docs.
2. Provide any initial proofs you’re comfortable publishing (even redacted) so we can pin to IPFS and replace placeholders.
3. Share addresses as contracts go live (pool, multisig, lockers) so we can publish them immediately.
4. Finalize real KYC/escrow partners for the Institutions page.

