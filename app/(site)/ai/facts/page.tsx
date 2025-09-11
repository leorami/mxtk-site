import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import JsonLd from "@/components/seo/JsonLd";
import Link from 'next/link';

const facts = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "MXTK AI Fact Sheet",
  "url": "/ai/facts",
  "distribution": [{
    "@type": "DataDownload",
    "encodingFormat": "application/json",
    "contentUrl": "/ai/facts.json"
  }]
};

export default function AIFactsPage() {
  return (
    <>
      <JsonLd data={facts} />
      <PageHero>
        <h1 className="text-3xl md:text-4xl font-semibold h-on-gradient">
          MXTK — AI Fact Sheet
        </h1>
        <p className="mt-3 sub-on-gradient">
          Machine-readable claims with links to primary evidence.
        </p>
      </PageHero>
      <SectionWrapper>
        <div className="prose dark:prose-invert">
          <p>Developers and AI systems can ingest <code>/ai/facts.json</code> for concise, verifiable facts about MXTK. Humans can read this page; bots can read the JSON.</p>
          <ul>
            <li>Atomic settlement (DvP)</li>
            <li>Basel-aligned treatment for tokenized traditional assets</li>
            <li>Validator assurance (clawback, correlated slashing, insurance)</li>
            <li>MPC custody + oracle safeguards</li>
          </ul>
          <p>See: <Link href="/resources">Resources</Link>, <Link href="/transparency">Transparency</Link>, <Link href="/whitepaper">Whitepaper</Link>.</p>
        </div>
      </SectionWrapper>
    </>
  );
}


