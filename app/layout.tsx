import '@/app/styles/design-tokens.scss'
import BrandThemeProvider from '@/components/BrandThemeProvider'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import DevThemeSwitcher from '@/components/dev/DevThemeSwitcher'
import BasePathProvider from '@/components/providers/BasePathProvider'
import { getServerPublicPath } from '@/lib/routing/getPublicPathServer'
import { getServerBasePath } from '@/lib/routing/serverBasePath'
import type { Metadata } from 'next'
import { Roboto, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import './styles/minerals.css'
import './styles/motion.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300','400','500','700'],
  display: 'swap',
  variable: '--font-roboto',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400','500','700'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
    title: 'MXTK — Mineral Token',
    description: 'Digitizing verified mineral interests with transparent, governed market plumbing.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const bp = await getServerBasePath()
    const faviconIco = await getServerPublicPath('favicon.ico')
    
    return (
        <html lang="en" className={`${roboto.variable} ${roboto.className} ${grotesk.variable}`} suppressHydrationWarning>
            <head>
                <link rel="icon" type="image/x-icon" href={faviconIco} />
                <link rel="shortcut icon" href={faviconIco} />
                <link rel="apple-touch-icon" href={faviconIco} />
                <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            const saved = localStorage.getItem('theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark')
          } catch {}
        `}</Script>
            </head>
            <body className="page min-h-dvh flex flex-col">
                <BasePathProvider value={bp}>
                    <SiteHeader />
                    <main className="relative z-10 flex-1 min-h-0">
                        <BrandThemeProvider>
                            {children}
                        </BrandThemeProvider>
                    </main>
                    <SiteFooter />
                    {/* Lift overlay behind content */}
                    <div aria-hidden className="page-lift" />
                    {/* Dev switcher (hidden in production) */}
                    <DevThemeSwitcher />
                </BasePathProvider>
            </body>
        </html>
    )
}