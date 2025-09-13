import '@/app/styles/design-tokens.scss';
import BrandThemeProvider from '@/components/BrandThemeProvider';
import Favicons from '@/components/Favicons';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Script from "next/script";
// FooterChatBarMountEffect removed - chat moved to drawer
import BasePathProvider from '@/components/BasePathProvider';
import PageChromeVars from '@/components/chrome/PageChromeVars';
import ExperienceProvider from '@/components/experience/ExperienceProvider';
import { getServerBasePath } from '@/lib/routing/serverBasePath';

import GuideHost from '@/components/ai/GuideHost';
import GuideBootStyle from '@/components/chrome/GuideBootStyle';
import JsonLd from '@/components/seo/JsonLd';
import { getBasePathUrl } from '@/lib/basepath';
import type { Metadata } from 'next';
import { Roboto, Space_Grotesk } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import './styles/guide-drawer.css';
import './styles/home-widgets.css';
import './styles/minerals.css';
import './styles/mobile-footer.css';
import './styles/mobile-menu.css';
import './styles/motion.css';
import './styles/page-scaffold.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'MXTK — Mineral Token',
  description: 'Digitizing verified mineral interests with transparent, governed market plumbing.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const serverDetected = await getServerBasePath();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || serverDetected || '';
  const cookieStore = await cookies();
  const hasHome = Boolean(cookieStore.get('mxtk_home_id')?.value)

  return (
    <html lang="en" className={`${roboto.variable} ${roboto.className} ${grotesk.variable}`} suppressHydrationWarning>
      <head>
        <GuideBootStyle />
        <Favicons />
        {/* Ensure preloaded fonts carry crossorigin hints to satisfy Chrome */}
        <Script id="font-preload-cors" strategy="beforeInteractive">{`
          try {
            (function ensureFontPreloadCORS(){
              var links = document.querySelectorAll('link[rel="preload"][as="font"]');
              for (var i=0;i<links.length;i++) {
                var l = links[i];
                if (!l.getAttribute('crossorigin')) l.setAttribute('crossorigin', 'anonymous');
              }
            })();
            document.addEventListener('DOMContentLoaded', function(){
              var links = document.querySelectorAll('link[rel="preload"][as="font"]');
              for (var i=0;i<links.length;i++) {
                var l = links[i];
                if (!l.getAttribute('crossorigin')) l.setAttribute('crossorigin', 'anonymous');
              }
            });
          } catch {}
        `}</Script>
        {/* Recover gracefully from dev-time chunk load failures (ngrok idle, HMR) */}
        <Script id="chunk-recovery" strategy="beforeInteractive">{`
          (function(){
            try {
              var key = 'mxtk.chunk.recovered.' + Date.now();
              var reloadCount = parseInt(sessionStorage.getItem('mxtk.reload.count') || '0');
              
              function reloadOnce(reason){
                if (reloadCount >= 3) {
                  console.error('[MXTK] Too many reloads, stopping recovery for', reason);
                  return;
                }
                sessionStorage.setItem('mxtk.reload.count', String(reloadCount + 1));
                setTimeout(function() {
                  sessionStorage.removeItem('mxtk.reload.count');
                }, 30000); // Reset after 30s
                
                var url = new URL(window.location.href);
                url.searchParams.set('_r', String(Date.now()));
                console.warn('[MXTK] Reloading due to', reason, '(attempt', reloadCount + 1, ')');
                window.location.replace(url.href);
              }
              
              // Handle chunk load errors
              window.addEventListener('error', function(e){
                var msg = (e && (e.message || e.error && e.error.message)) || '';
                if (/ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module/i.test(msg)) {
                  console.error('[MXTK] Chunk load error:', msg);
                  reloadOnce('ChunkLoadError: ' + msg.substring(0, 100));
                }
              });
              
              // Handle promise rejections
              window.addEventListener('unhandledrejection', function(e){
                var msg = '' + (e && (e.reason && (e.reason.message || e.reason) || e));
                if (/ChunkLoadError|Loading chunk .* failed|Failed to fetch dynamically imported module/i.test(msg)) {
                  console.error('[MXTK] Chunk load promise error:', msg);
                  reloadOnce('ChunkLoadError (promise): ' + msg.substring(0, 100));
                }
              });
              
              // Override webpack chunk loading to handle 404s gracefully
              if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.f && __webpack_require__.f.j) {
                var originalChunkLoader = __webpack_require__.f.j;
                __webpack_require__.f.j = function(chunkId, promises) {
                  try {
                    return originalChunkLoader.call(this, chunkId, promises);
                  } catch (err) {
                    console.warn('[MXTK] Chunk load failed for', chunkId, '- attempting recovery');
                    reloadOnce('Webpack chunk failure: ' + chunkId);
                    return Promise.reject(err);
                  }
                };
              }
            } catch (err) {
              console.warn('[MXTK] Chunk recovery setup failed:', err);
            }
          })();
        `}</Script>
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            var saved = localStorage.getItem('theme') || localStorage.getItem('mxtk.theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (saved === 'dark' || (!saved && prefersDark)) document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          } catch {}
        `}</Script>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MXTK (Mineral Token)",
            "url": process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://mineral-token.com",
            "logo": getBasePathUrl('/logo-horizontal.png'),
            "sameAs": []
          }}
        />
      </head>
      <body className="page min-h-dvh flex flex-col" suppressHydrationWarning>
        <BasePathProvider value={basePath}>
        <ExperienceProvider>
          <PageChromeVars />
          <SiteHeader hasHome={hasHome} />
          <main data-shiftable-root style={{ overflowX: "visible" }} className="relative z-10 flex-1 min-h-0">
            <div className="site-container mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <BrandThemeProvider>
                {children}
              </BrandThemeProvider>

            </div>
          </main>
          <SiteFooter />
          {/* FooterChatBarMountEffect removed - chat moved to drawer */}
          {/* Lift overlay behind content (driven by html[data-lift]) */}
          <div aria-hidden className="page-lift" />
          {/* Dev switcher moved to footer */}
          {/* Wave 4/5: Drawer host only (top-right panel disabled) */}
          <GuideHost />
        </ExperienceProvider>
        </BasePathProvider>
      </body>
    </html>
  )
}