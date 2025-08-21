import Card from '@/components/ui/Card'

export default function TermsPage(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Terms (Sample)</h1>
      <Card embedded>
        <p className="text-muted text-sm">
          This site is provided "as is" for informational purposes. Nothing herein constitutes an offer to sell or the
          solicitation of an offer to buy any security, digital asset, or financial instrument. Participation in any program
          may require additional agreements and KYC/AML screening.
        </p>
      </Card>
    </div>
  )
}