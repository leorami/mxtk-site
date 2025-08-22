# MXTK Site Task Board

## ✅ Completed Items

### Scaffolding Tasks ✅
- [x] **Next.js** - Set up Next.js 14 scaffold
- [x] **Housekeeping** - Created `.gitignore`, `.nvmrc` with Node 20
- [x] **Install and run** - `npm install` and `npm run dev` working
- [x] **Build** - `npm run build` succeeds
- [x] **Git initialization** - Repository initialized and committed
- [x] **All routes working** - `/owners`, `/institutions`, `/transparency`, `/whitepaper`, `/roadmap`, `/elite-drop`, `/elite-drop/nominate`, `/media`, `/legal/*`
- [x] **Theme toggle** - Light theme default, dark toggle persists between refreshes
- [x] **Logo display** - Header shows logo from `/public/logo.png`
- [x] **Transparency hub** - Includes all expected sections (proofs table, oracle log, ops cost estimator, OTC aggregates, addresses)

### Additional Setup Tasks ✅
- [x] **Security headers** - Added production-only security headers in `next.config.mjs`
- [x] **Robots.txt** - Created `app/robots.ts` with preview vs production rules
- [x] **Sitemap** - Created `app/sitemap.ts` with all routes
- [x] **Plausible analytics hook** - Added analytics script in `app/layout.tsx`
- [x] **Not-found page** - Created `app/not-found.tsx`
- [x] **Redirects** - Added www → apex redirect for future domain
- [x] **Vercel hardening** - All production optimizations implemented

### Authentication, Environment, and Build Tasks ✅
- [x] **Basic Auth middleware** - Created `middleware.ts` with Basic Auth for preview/dev
- [x] **Environment variables** - Set up Basic Auth env vars structure
- [x] **Build & test** - Local testing with Basic Auth working
- [x] **Deploy preparation** - Ready for Vercel deployment with auth

### Additional Items Implemented ✅
- [x] **Docker development environment** - Complete Docker setup with multi-stage builds
- [x] **Environment switching** - Enhanced setup script with dev/staging/prod environments
- [x] **Smart build system** - Intelligent change detection and build optimization
- [x] **Brand styling system** - Glass effects, section tints, dark/light theme
- [x] **Component library** - Reusable UI components with proper TypeScript
- [x] **Development tools** - Hot reload, environment management, build scripts

### Mineral Palette UI Update ✅ (2025-01-20)
- [x] **Sass integration** - Added Sass dependency for design token management
- [x] **Design tokens system** - Created comprehensive SCSS token file with mineral-inspired palette
- [x] **Professional light theme** - Implemented white header with brand navy, quartz background
- [x] **Enhanced glass effects** - Stronger backdrop blur, improved shadows, embedded card variants
- [x] **Section tinting system** - Strategic color coding: amber (warmth), teal (clarity), navy (authority)
- [x] **Sticky layout** - Header stays at top, footer anchored at bottom via flexbox
- [x] **Sun/moon theme switch** - Professional toggle with animated slider and clear iconography
- [x] **Typography polish** - Updated heading styles with proper weights and tracking
- [x] **Page-by-page tint application** - Applied strategic color coding across all major pages:
  - Home: Hero (amber), Proofs (navy), Features (teal)
  - Owners: Consider (amber), Provide (teal), Process (teal), Confidentiality (navy)
  - Institutions: Addresses (navy), OTC (amber), Arbitrum (teal), Risk (navy)
  - Transparency: Proofs (navy), Oracle (amber), Ops (teal), OTC (amber), Addresses (navy), Risk (navy)
- [x] **Mineral sheen effects** - Subtle gradient overlays for visual texture without heavy images
- [x] **Accessible hover states** - Soft orange tints on brand elements, proper contrast ratios

## 🚀 Pre-Launch TODOs

### High Priority
- [ ] **Fix external ngrok access issues** - Critical proxy and hydration problems:
  - [ ] **Hydration mismatch** - Server/client URL prefix inconsistency causing React errors
  - [ ] **404 errors for static assets** - `logo-horizontal.svg`, CSS, JS chunks not accessible via ngrok
  - [ ] **API failures** - Institutions and transparency pages crashing due to API access issues
  - [ ] **Logo aspect ratio warning** - Fix image sizing in SiteHeader.tsx
  - [ ] **Resources menu** - Remove dropdown functionality, make it a simple menu item
- [ ] **Replace placeholder data** in `lib/placeholders.ts`:
  - [ ] Proof CIDs/sha256 hashes (IPFS links)
  - [ ] Oracle log entries
  - [ ] OTC aggregates data
  - [ ] Pool/locker/multisig/timelock addresses
- [ ] **Swap logo** - replace `/public/logo.png` with final brand asset (SVG/transparent PNG)
- [ ] **Add analytics** - set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` in Vercel env vars
- [ ] **Connect custom domain** - add `mineral-token.com` in Vercel → Project → Settings → Domains
- [ ] **Deploy to Vercel** - Complete production deployment and smoke tests

### UI/UX Enhancements (Post-Mineral Update)
- [ ] **Test theme switching** - Verify smooth transitions between light/dark modes
- [ ] **Mobile responsiveness** - Ensure new design works perfectly on mobile devices
- [ ] **Browser compatibility** - Test across Chrome, Firefox, Safari, Edge
- [ ] **Performance audit** - Check if new CSS/SCSS impacts load times
- [ ] **Accessibility review** - Verify contrast ratios and keyboard navigation with new palette

### Medium Priority
- [ ] **Custom 404 design** - improve the not-found page styling with new mineral palette
- [ ] **Media kit assets** - add press materials under `/public/media/`
- [ ] **Legal copy review** - finalize content under `app/(site)/legal/*`
- [ ] **Basic Auth for previews** - re-enable middleware auth for staging if needed
- [ ] **Production build fix** - Resolve Docker production build path resolution issues
- [ ] **Remaining page tints** - Apply section tints to whitepaper, roadmap, elite-drop, media pages
- [ ] **Component consistency** - Ensure all UI components use new design tokens
- [ ] **Form styling** - Update nomination form and any other forms with new glass effects

### Low Priority
- [ ] **Performance optimization** - add image optimization, lazy loading
- [ ] **Accessibility audit** - ensure WCAG compliance with new design system
- [ ] **SEO meta tags** - add Open Graph, Twitter cards
- [ ] **Analytics events** - track key user interactions
- [ ] **Design system documentation** - Create comprehensive guide for the mineral palette system
- [ ] **Animation refinements** - Add subtle micro-interactions and transitions
- [ ] **Print styles** - Ensure site looks good when printed

## 🔧 Technical Debt

### Infrastructure
- [ ] **Docker optimization** - multi-stage builds, layer caching
- [ ] **CI/CD pipeline** - automated testing, deployment
- [ ] **Monitoring** - error tracking, performance monitoring
- [ ] **Backup strategy** - content backup, disaster recovery

### Code Quality
- [ ] **TypeScript strict mode** - enable stricter type checking
- [ ] **ESLint rules** - add custom rules for project standards
- [ ] **Component testing** - add unit tests for key components
- [ ] **E2E testing** - critical user journey testing

## 📋 Post-Launch Features

### Content Management
- [ ] **CMS integration** - headless CMS for content updates
- [ ] **Blog/news section** - company updates and announcements
- [ ] **Documentation** - technical docs, API references
- [ ] **Multilingual support** - internationalization

### User Experience
- [ ] **Search functionality** - site-wide search
- [ ] **Newsletter signup** - email capture and management
- [ ] **Contact forms** - lead generation forms
- [ ] **Interactive elements** - calculators, tools

### Integration
- [ ] **Social media feeds** - Twitter, LinkedIn integration
- [ ] **Third-party tools** - CRM, marketing automation
- [ ] **API endpoints** - public API for data access
- [ ] **Webhook support** - real-time updates

## 🔄 Back Burner Items

### Development Environment Enhancements
- [ ] **Production build fix** - Resolve Docker production build path resolution issues
- [ ] **Multi-environment testing** - Test staging and production environments locally
- [ ] **Environment-specific analytics** - Different tracking for dev/staging/prod
- [ ] **Advanced caching** - Redis caching for production performance

### Advanced Features
- [x] **Real-time data integration** - Live blockchain data feeds
- [ ] **Interactive charts** - Dynamic data visualization
- [ ] **Advanced forms** - Multi-step nomination process
- [ ] **Content versioning** - Track changes to legal documents and proofs

### Infrastructure Scaling
- [ ] **CDN optimization** - Global content delivery
- [ ] **Database integration** - User data and analytics storage
- [ ] **API rate limiting** - Protect against abuse
- [ ] **Advanced monitoring** - Real-time performance and error tracking

## 🎨 Design & Branding

### Visual Assets
- [ ] **Icon set** - custom icons for the brand
- [ ] **Illustrations** - custom graphics and diagrams
- [ ] **Video content** - product demos, explainer videos
- [ ] **Infographics** - data visualization

### Brand Guidelines
- [ ] **Style guide** - comprehensive brand documentation
- [ ] **Component library** - reusable design system
- [ ] **Animation guidelines** - motion design standards
- [ ] **Voice & tone** - content style guide

### Mineral Palette System (New)
- [ ] **Design token documentation** - Complete reference for all CSS custom properties
- [ ] **Color usage guidelines** - When and how to use amber/teal/navy tints
- [ ] **Component variants** - Standardized glass, embedded, and interactive states
- [ ] **Typography scale** - Document font sizes, weights, and spacing
- [ ] **Spacing system** - Consistent margin/padding scale
- [ ] **Animation library** - Standardized transitions and micro-interactions

## 📊 Analytics & Performance

### Metrics
- [ ] **Conversion tracking** - goal completion tracking
- [ ] **User behavior** - heatmaps, session recordings
- [ ] **Performance monitoring** - Core Web Vitals tracking
- [ ] **A/B testing** - conversion optimization

### Reporting
- [ ] **Dashboard** - executive summary reports
- [ ] **Automated reports** - weekly/monthly insights
- [ ] **Alert system** - performance degradation alerts
- [ ] **Data export** - analytics data access

## 🔒 Security & Compliance

### Security
- [ ] **Security audit** - penetration testing
- [ ] **Vulnerability scanning** - automated security checks
- [ ] **Access control** - role-based permissions
- [ ] **Data encryption** - sensitive data protection

### Compliance
- [ ] **GDPR compliance** - privacy policy updates
- [ ] **Cookie consent** - enhanced consent management
- [ ] **Data retention** - automated data cleanup
- [ ] **Audit trails** - compliance logging

---

## 📝 Notes

- **Priority levels**: High (blocking launch), Medium (important), Low (nice-to-have)
- **Status tracking**: Use checkboxes to mark completion
- **Dependencies**: Note any blocking relationships between tasks
- **Resources**: Assign team members or external contractors as needed

Last updated: 2025-Aug-20 (Mineral Palette UI Update completed)
