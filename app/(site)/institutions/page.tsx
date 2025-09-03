"use client";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { useCopy } from "@/components/copy/Copy";
import ModeTextSwap from "@/components/experience/ModeTextSwap";
import PoolTable from "@/components/live/PoolTable";
import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/components/seo/faq";
import PageTheme from "@/components/theme/PageTheme";
import Card from "@/components/ui/Card";
import { FeatureRow } from "@/components/ui/List";
import MarketChart from "@/components/ui/MarketChart";
import PhotoBackdrop from "@/components/visuals/PhotoBackdrop";

export default function InstitutionsPage() {
  const { mode, pageCopy } = useCopy('institutions');
  const faq = faqJsonLd(
    '/institutions',
    [
      { q: 'What does MXTK offer institutions?', a: 'Institution-grade settlement, custody, and transparent attestations.' },
      { q: 'Where can I view token data?', a: 'On the Transparency hub and on-chain summaries.' },
      { q: 'How is risk managed?', a: 'Qualified custody, oracle safeguards, insurance, and transparent change logs.' }
    ]
  );

  return (
    <PageTheme ink="dark" lift="M" glass="soft">
      <JsonLd data={faq} />
      <PhotoBackdrop src="art/photos/institutions_lapis.jpg" />
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <ModeTextSwap
            as="h1"
            depKey={`institutions-hero-title-${mode}`}
            className="text-4xl md:text-6xl font-bold tracking-tight"
            content={pageCopy.heroTitle[mode]}
          />
          <ModeTextSwap
            as="p"
            depKey={`institutions-hero-sub-${mode}`}
            className="text-xl max-w-3xl mx-auto"
            content={pageCopy.heroSub[mode]}
          />
        </SectionWrapper>

        <SectionWrapper index={1}>
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
            <MarketChart />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={2}>
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
            <PoolTable />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={3}>
          <Card tint="navy">
            <h2 className="text-2xl font-semibold mb-6">Infrastructure & Security</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "Token (Arbitrum)", body: "0x3e4F...d9Ba" },
                { title: "Uniswap v4 pool", body: "Coming soon" },
                { title: "LP locker", body: "Coming soon" },
                { title: "Multisig governance", body: "3-of-5" },
                { title: "Timelock", body: "48-hour delay" },
                { title: "Change logs", body: "Transparent upgrades" },
              ]}
            />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={4}>
          <Card tint="amber">
            <h2 className="text-2xl font-semibold mb-6">Trading Features</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "DEX trading", body: "Uniswap v4, concentrated liquidity" },
                { title: "OTC markets", body: "Institutional-grade settlement" },
                { title: "Price feeds", body: "Transparent oracle methodology" },
              ]}
            />
          </Card>
        </SectionWrapper>

        <SectionWrapper index={5}>
          <Card tint="teal">
            <h2 className="text-2xl font-semibold mb-6">Compliance & Custody</h2>
            <FeatureRow
              cols={3}
              items={[
                { title: "KYC/AML compliance" },
                { title: "Qualified custody" },
                { title: "Regulatory reporting" },
                { title: "Insurance coverage" },
                { title: "Audit trails" },
                { title: "Settlement automation" },
              ]}
            />
          </Card>
        </SectionWrapper>

        {/* Mode-aware pillars section */}
        <SectionWrapper index={6}>
          <Card tint="navy">
            <div className="grid md:grid-cols-3 gap-6">
              {pageCopy.pillars?.map((pillar, idx) => (
                <div key={idx} className="glass glass--panel p-6">
                  <ModeTextSwap
                    as="h3"
                    depKey={`institutions-pillar-${idx}-title-${mode}`}
                    className="text-ink font-semibold mb-3"
                    content={pillar.title[mode]}
                  />
                  <ModeTextSwap
                    as="p"
                    depKey={`institutions-pillar-${idx}-body-${mode}`}
                    className="text-ink-subtle"
                    content={pillar.body[mode]}
                  />
                </div>
              ))}
            </div>
          </Card>
        </SectionWrapper>

        {/* Mode-aware sections */}
        {pageCopy.sections?.map((section, idx) => (
          <SectionWrapper key={`section-${idx}-${mode}`} index={7 + idx}>
            <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
              <ModeTextSwap
                as="h2"
                depKey={`institutions-section-${idx}-heading-${mode}`}
                className="text-2xl font-semibold mb-6"
                content={section.heading[mode]}
              />
              <div className="space-y-4">
                {section.paragraphs[mode].map((paragraph, pIdx) => (
                  <ModeTextSwap
                    key={pIdx}
                    as="p"
                    depKey={`institutions-section-${idx}-p-${pIdx}-${mode}`}
                    className="text-muted leading-relaxed"
                    content={paragraph}
                  />
                ))}
              </div>
              {section.highlight?.[mode] && (
                <div className="mt-6 p-4 rounded-lg bg-black/10 dark:bg-white/10">
                  <ModeTextSwap
                    as="p"
                    depKey={`institutions-section-${idx}-highlight-${mode}`}
                    className="text-sm font-medium"
                    content={section.highlight[mode]}
                  />
                </div>
              )}
            </Card>
          </SectionWrapper>
        ))}
      </PageHero>
    </PageTheme>
  );
}