"use client";

export default function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      // IMPORTANT: stringify once; avoid functions/dates
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


