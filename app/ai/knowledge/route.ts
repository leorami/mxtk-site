import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    project: "MXTK — Mineral Token",
    description: "ERC-20 token backed by verified mineral reserves with institution-grade rails",
    token: {
      symbol: "MXTK",
      type: "ERC-20",
      backing: "Verified mineral reserves with validator program"
    },
    pillars: [
      "Attested reserves with validator program",
      "Transparent mint/burn logs",
      "Institutional integrations for liquidity & reporting"
    ],
    features: {
      settlement: "Atomic DvP finalizes in seconds",
      custody: "Institution-grade controls and segregation", 
      transparency: "Independent validators with legal clawback",
      compliance: "KYC/AML compliance and regulatory reporting"
    },
    urls: {
      transparency: "/transparency",
      institutions: "/institutions", 
      owners: "/owners",
      whitepaper: "/whitepaper",
      ecosystem: "/ecosystem"
    },
    contacts: {
      general: "/contact-us",
      careers: "/careers"
    },
    lastUpdated: new Date().toISOString()
  });
}