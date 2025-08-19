import type { Config } from 'tailwindcss'
const config: Config = {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{border:'hsl(215 16% 85%)',bg:'#ffffff',surface:'#ffffff',muted:'#5B6572',ink:'#0E1116',brand:{orange:'#E0932B',navy:'#0B1C4A',teal:'#0FBF9F',copper:'#C97E3D',slate:'#4B5563',border:'#E5E9F0',ink:'#0E1116'},dark:{bg:'#0B0E12',surface:'#12161C',border:'#1E2430',ink:'#E6EAF2',muted:'#9AA3AE'}},borderRadius:{xl:'1rem','2xl':'1.25rem'}}},darkMode:'class',plugins:[],}
export default config
