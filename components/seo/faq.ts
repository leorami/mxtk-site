export type QA = { q: string; a: string };

export function faqJsonLd(pageUrl: string, qa: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": qa.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    })),
    "url": pageUrl
  };
}


