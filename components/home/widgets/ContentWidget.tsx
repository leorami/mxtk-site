"use client";

type ContentWidgetData = {
  title?: string
  paragraphs?: string[]
}

export default function ContentWidget({ id, data }: { id?: string; data?: ContentWidgetData }) {
  const title = data?.title || 'What exactly is MXTK?'
  const paragraphs = Array.isArray(data?.paragraphs) && data!.paragraphs!.length
    ? data!.paragraphs!
    : [
        'MXTK is a digital token backed 1:1 by validator‑attested mineral reserves. Independent experts verify the reserves and we link that documentation to every token so anyone can inspect the evidence.',
        'Why this matters: value tied to real assets can move faster with clear receipts and auditability—preserving trust while improving usability.'
      ]

  return (
    <div className="space-y-3 text-[color:var(--ink-strong)] wframe-frameless">
      <h3 className="text-xl md:text-2xl font-semibold opacity-95 mb-1">{title}</h3>
      <div className="space-y-3 text-sm leading-relaxed opacity-95">
        {paragraphs.map((p, i) => (
          <p key={`${id || 'cw'}-p-${i}`} className="text-muted">{p}</p>
        ))}
      </div>
      {/* Plain summary bar */}
      <div className="mt-2 rounded-lg px-3 py-2 bg-[rgba(255,255,255,0.10)] dark:bg-[rgba(255,255,255,0.06)] text-[13px]">
        Plainly: MXTK gives you a digital way to hold and use value that comes from minerals in the ground—with receipts you can read.
      </div>
    </div>
  )
}

export const meta = {
  id: 'content-widget',
  stages: ['training', 'preparing', 'conquer'],
  priority: 0.5,
  mobileFriendly: true,
  categories: ['Resources']
} as const


