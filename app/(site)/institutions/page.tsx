"use client";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import OnchainSummary from "@/components/live/OnchainSummary";
import PoolTable from "@/components/live/PoolTable";
import Card from "@/components/ui/Card";
import { FeatureRow } from "@/components/ui/List";
import BackgroundPhoto from "@/components/visuals/BackgroundPhoto";

export default function InstitutionsPage() {
  return (
    <>
      <BackgroundPhoto variant="institutions" />
      <PageHero>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Institutions</h1>
        <p className="opacity-90">Compliance & custody built for scale.</p>
      </PageHero>

      <SectionWrapper>
        <Card tint="amber">
          <h2 className="text-2xl font-semibold mb-6">Token Information</h2>
          <OnchainSummary />
        </Card>
      </SectionWrapper>

      <SectionWrapper>
        <Card tint="teal">
          <h2 className="text-2xl font-semibold mb-6">Liquidity & On-chain Addresses</h2>
          <PoolTable />
        </Card>
      </SectionWrapper>

      <SectionWrapper>
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

      <SectionWrapper>
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

      <SectionWrapper>
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
    </>
  );
}