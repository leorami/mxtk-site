import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function Landing() {
    return (
        <div className="space-y-12">
            {/* Hero */}
            <section className="glass p-8 rounded-2xl">
                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <p className="text-xs tracking-wider uppercase text-muted">Mineral Token (MXTK)</p>
                        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">
                            A transparent way to <span style={{ color: 'var(--mxtk-accent)' }}>digitize verified mineral value</span>
                        </h1>
                        <p className="mt-4 text-[15px] text-muted">
                            MXTK connects evidence (JORC/NI 43-101/SKR), a governed oracle method, and modern market plumbing.
                            No hype—just clean, auditable links from claims to sources.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link className="btn-primary" href="/owners">For Mineral Owners</Link>
                            <Link className="btn-outline" href="/transparency">Trust & Transparency</Link>
                            <Link className="btn-soft" href="/ecosystem">See the Ecosystem</Link>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        <Card embedded tint="navy">
                            <div className="text-sm font-semibold">Proof at a glance</div>
                            <div className="mt-2 grid grid-cols-3 gap-3">
                                <div className="rounded-xl border p-3 card-outline"><div className="text-[12px] text-muted">Attestations</div><div className="text-xl font-semibold">3</div></div>
                                <div className="rounded-xl border p-3 card-outline"><div className="text-[12px] text-muted">Pools</div><div className="text-xl font-semibold">Auto</div></div>
                                <div className="rounded-xl border p-3 card-outline"><div className="text-[12px] text-muted">Oracle</div><div className="text-xl font-semibold">v0.1</div></div>
                            </div>
                            <div className="mt-2 text-[12px] text-muted">"Auto" uses factory + indexer discovery; metrics switch to live when feeds are connected.</div>
                        </Card>
                        <Card embedded tint="teal">
                            <div className="text-sm font-semibold">Why this matters</div>
                            <p className="mt-1 text-[13px] text-muted">
                                When mineral interests become digital, owners unlock financing options and institutions gain clarity.
                                Our job: make every step verifiable.
                            </p>
                            <div className="mt-2"><Link className="btn-link" href="/whitepaper">How MXTK works</Link></div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Three pillars */}
            <section className="section section-teal glass-embedded">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card embedded><div className="text-sm font-semibold">Evidence-first</div><p className="mt-1 text-[13px] text-muted">JORC/NI 43-101/SKR where available; redactions allowed with hash-addressable proofs on IPFS.</p></Card>
                    <Card embedded><div className="text-sm font-semibold">Governed pricing</div><p className="mt-1 text-[13px] text-muted">Documented oracle method with public change log and ops budget.</p></Card>
                    <Card embedded><div className="text-sm font-semibold">Market plumbing</div><p className="mt-1 text-[13px] text-muted">OTC rails, Uniswap v3 planning, LP locks, timelock governance.</p></Card>
                </div>
            </section>

            {/* Trust strip */}
            <section className="glass p-5 rounded-2xl">
                <div className="grid gap-4 md:grid-cols-3">
                    <div><div className="text-sm font-semibold">Transparency hub</div><p className="text-[13px] text-muted">All addresses, attestations, oracle updates and risks in one place.</p><Link className="btn-link" href="/transparency">Visit hub</Link></div>
                    <div><div className="text-sm font-semibold">Ecosystem</div><p className="text-[13px] text-muted">Explainers, integrations, and partners building around MXTK.</p><Link className="btn-link" href="/ecosystem">Explore</Link></div>
                    <div><div className="text-sm font-semibold">Resources</div><p className="text-[13px] text-muted">Glossary, guides, brand assets, and media kit.</p><Link className="btn-link" href="/resources">Browse</Link></div>
                </div>
            </section>
        </div>
    )
}