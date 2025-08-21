import Card from '@/components/ui/Card'

export default function DisclosuresPage(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Disclosures (Sample)</h1>
      <Card embedded>
        <p className="text-muted text-sm">
          Forward-looking statements are subject to risks and uncertainties, including regulatory developments and execution
          risks. Any metrics labeled "preview" or "sample" are not commitments and may change without notice.
        </p>
      </Card>
    </div>
  )
}