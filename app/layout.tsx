import '@/app/styles/design-tokens.scss'
import BrandThemeProvider from '@/components/BrandThemeProvider'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import './styles/minerals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300','400','500','700'],
  display: 'swap',
});

export const metadata: Metadata = {
    title: 'MXTK — Mineral Token',
    description: 'Digitizing verified mineral interests with transparent, governed market plumbing.',
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        ],
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={roboto.className} suppressHydrationWarning>
            <head>
                <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            const saved = localStorage.getItem('theme')
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark')
          } catch {}
        `}</Script>
            </head>
            <body className="page min-h-dvh flex flex-col">
                <SiteHeader />
                <main className="flex-1 min-h-0 overflow-y-auto mx-auto w-full max-w-6xl px-4 py-10">
                    <BrandThemeProvider>
                        {children}
                    </BrandThemeProvider>
                </main>
                <SiteFooter />
            </body>
        </html>
    )
}