import Card from '@/components/ui/Card'

export default function PrivacyPage(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Privacy (Sample)</h1>
      <Card embedded>
        <p className="text-muted text-sm">
          We use privacy-friendly analytics and limit data collection to what is necessary to provide this site. Cookies are
          not set until you consent. Contact us to request access or deletion of any personal information we may hold.
        </p>
      </Card>
    </div>
  )
}