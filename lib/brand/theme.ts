export type MineralTheme = {
  name: string
  accent: string         // primary accent
  hoverBg: string        // nav/menu hover bg
  photo: string          // /public/minerals/photos/*.svg (decor image)
}

type ThemeRule = { test:(p:string)=>boolean; theme: MineralTheme }

// Route→theme mapping
export const THEME_RULES: ThemeRule[] = [
  { test: p => p === '/' || p.startsWith('/home'), theme: { name:'home',          accent:'#E0932B', hoverBg:'rgba(224,147,43,.14)', photo:'/minerals/photos/amber-crystal.svg' } },
  { test: p => p.startsWith('/owners'),           theme: { name:'owners',        accent:'#E0932B', hoverBg:'rgba(224,147,43,.14)', photo:'/minerals/photos/citrine-crystal.svg' } },
  { test: p => p.startsWith('/institutions'),     theme: { name:'institutions',  accent:'#2E5A88', hoverBg:'rgba(46,90,136,.12)'  , photo:'/minerals/photos/lapis-lazuli-crystal.svg' } },
  { test: p => p.startsWith('/transparency'),     theme: { name:'transparency',  accent:'#8B4513', hoverBg:'rgba(139,69,19,.12)'  , photo:'/minerals/photos/tiger-eye-crystal.svg' } },
  { test: p => p.startsWith('/whitepaper'),       theme: { name:'whitepaper',    accent:'#4A4A4A', hoverBg:'rgba(74,74,74,.12)'  , photo:'/minerals/photos/obsidian-crystal.svg' } },
  { test: p => p.startsWith('/roadmap'),          theme: { name:'roadmap',       accent:'#C97E3D', hoverBg:'rgba(201,126,61,.14)', photo:'/minerals/photos/copper-crystal.svg' } },
  { test: p => p.startsWith('/mxtk-cares'),        theme: { name:'cares',         accent:'#0FBF9F', hoverBg:'rgba(15,191,159,.14)', photo:'/minerals/photos/jade-crystal.svg' } },
  { test: p => p.startsWith('/media'),            theme: { name:'media',         accent:'#0B1C4A', hoverBg:'rgba(11,28,74,.12)'  , photo:'/minerals/photos/onyx-crystal.svg' } },

  // NEW sections
  { test: p => p.startsWith('/ecosystem'),        theme: { name:'ecosystem',     accent:'#0FBF9F', hoverBg:'rgba(15,191,159,.14)', photo:'/minerals/photos/jade-crystal.svg' } },
  { test: p => p.startsWith('/faq'),              theme: { name:'faq',           accent:'#E0932B', hoverBg:'rgba(224,147,43,.14)', photo:'/minerals/photos/quartz-crystal.svg' } },
  { test: p => p.startsWith('/resources'),        theme: { name:'resources',     accent:'#0B1C4A', hoverBg:'rgba(11,28,74,.12)'  , photo:'/minerals/photos/hematite-crystal.svg' } },
  { test: p => p.startsWith('/careers'),          theme: { name:'careers',       accent:'#C97E3D', hoverBg:'rgba(201,126,61,.14)', photo:'/minerals/photos/copper-crystal.svg' } },
  { test: p => p.startsWith('/contact-us'),       theme: { name:'contact',       accent:'#0FBF9F', hoverBg:'rgba(15,191,159,.14)', photo:'/minerals/photos/amber-crystal.svg' } },
  { test: p => p.startsWith('/the-team'),         theme: { name:'team',          accent:'#0B1C4A', hoverBg:'rgba(11,28,74,.12)'  , photo:'/minerals/photos/sapphire-crystal.svg' } },
]

// Current page → theme
export function themeForPath(pathname: string): MineralTheme {
  return (THEME_RULES.find(x => x.test(pathname)) || THEME_RULES[0]).theme
}

// Target page (for nav hover) → theme
export function themeForRoute(href: string): MineralTheme {
  return themeForPath(href)
}
