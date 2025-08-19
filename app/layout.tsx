import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import CookieConsent from '@/components/CookieConsent'
import Script from 'next/script'

export const metadata={title:'MXTK — Mineral Token',description:'Digitizing verified mineral interests with transparency-first web3 plumbing.'}

export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="en">
      <body>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        <SiteHeader/>
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter/>
        <CookieConsent/>
      </body>
    </html>
  )
}
