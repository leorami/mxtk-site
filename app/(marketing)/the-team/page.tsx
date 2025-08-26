'use client'

import PageHero from '@/components/PageHero'
import Card from '@/components/ui/Card'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const teamMembers = [
    {
        name: 'Bo Vargas',
        role: 'Founder & CEO',
        img: '/media/team/bo_vargas_2000px.png',
        bio: 'Visionary leader with deep expertise in blockchain technology, financial markets, and mineral asset tokenization. Bo founded Mineral Token to unlock liquidity for global mineral holdings through innovative blockchain solutions.',
        expertise: ['Blockchain Technology', 'Financial Markets', 'Asset Tokenization', 'Strategic Leadership']
    },
    {
        name: 'Todd Davison',
        role: 'Chief Strategy Officer',
        img: '/media/team/todd_2000px.png',
        bio: 'Seasoned executive with extensive experience in financial engineering, risk management, and strategic planning. Todd leads our strategic initiatives and partnerships across traditional finance and DeFi ecosystems.',
        expertise: ['Financial Engineering', 'Risk Management', 'Strategic Planning', 'Partnership Development']
    },
    {
        name: 'Dan Kirichanski',
        role: 'Chief Technology Officer',
        img: '/media/team/Dan_Kirichanski.png',
        bio: 'Technology leader with deep expertise in blockchain infrastructure, smart contract development, and scalable systems architecture. Dan drives our technical vision and ensures robust, secure platform development.',
        expertise: ['Blockchain Infrastructure', 'Smart Contracts', 'System Architecture', 'Security Engineering']
    }
]

const advisors = [
    {
        name: 'Geological Advisory Board',
        role: 'Mineral Resource Experts',
        img: '/media/team/geology-advisors.jpg',
        bio: 'Independent geological consultants with JORC/NI 43-101 expertise, providing technical validation and resource assessment for mineral-backed tokenization.',
        expertise: ['JORC/NI 43-101 Compliance', 'Resource Estimation', 'Technical Validation', 'Environmental Assessment']
    },
    {
        name: 'Financial Advisory Board',
        role: 'Market & Trading Experts',
        img: '/media/team/finance-advisors.jpg',
        bio: 'Experienced professionals from traditional finance and cryptocurrency markets, providing insights on market dynamics, liquidity, and regulatory compliance.',
        expertise: ['Market Analysis', 'Liquidity Management', 'Regulatory Compliance', 'Risk Assessment']
    },
    {
        name: 'Legal Advisory Board',
        role: 'Regulatory & Compliance Experts',
        img: '/media/team/legal-advisors.jpg',
        bio: 'Legal experts specializing in blockchain regulation, securities law, and international compliance, ensuring Mineral Token operates within regulatory frameworks.',
        expertise: ['Securities Law', 'Blockchain Regulation', 'International Compliance', 'Corporate Governance']
    }
]

export default function Team() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="space-y-16">
            {/* Hero */}
            <PageHero>
                <section className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">The Team</h1>
                    <p className="text-xl text-muted max-w-3xl mx-auto">
                        Experienced operators and advisors focused on verifiable value, governance, and market integrity in the mineral tokenization space.
                    </p>
                </section>
            </PageHero>

            {/* Leadership Team */}
            <section className="section-amber">
                <Card tint="amber">
                    <h2 className="text-2xl font-semibold mb-8">Leadership Team</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {teamMembers.map((member, i) => (
                            <div key={i} className="space-y-4">
                                <div className="text-center">
                                    <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                                        <Image 
                                            src={member.img} 
                                            alt={member.name} 
                                            fill 
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold">{member.name}</h3>
                                    <p className="text-accent font-medium">{member.role}</p>
                                </div>
                                <p className="text-muted text-sm leading-relaxed text-center">{member.bio}</p>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 text-center">Areas of Expertise:</h4>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {member.expertise.map((skill, j) => (
                                            <span 
                                                key={j} 
                                                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Advisory Boards */}
            <section className="section-teal">
                <Card tint="teal">
                    <h2 className="text-2xl font-semibold mb-8">Advisory Boards</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {advisors.map((advisor, i) => (
                            <div key={i} className="space-y-4">
                                <div className="text-center">
                                    <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                                        <Image 
                                            src={advisor.img} 
                                            alt={advisor.name} 
                                            fill 
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold">{advisor.name}</h3>
                                    <p className="text-accent font-medium">{advisor.role}</p>
                                </div>
                                <p className="text-muted text-sm leading-relaxed text-center">{advisor.bio}</p>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2 text-center">Areas of Expertise:</h4>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {advisor.expertise.map((skill, j) => (
                                            <span 
                                                key={j} 
                                                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            {/* Our Values */}
            <section className="section-navy">
                <Card tint="navy">
                    <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">🔍</div>
                            <h3 className="font-semibold mb-2">Transparency</h3>
                            <p className="text-muted text-sm">Every claim backed by verifiable data and transparent methodologies</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">⚖️</div>
                            <h3 className="font-semibold mb-2">Compliance</h3>
                            <p className="text-muted text-sm">Regulatory adherence and legal compliance in all operations</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">🤝</div>
                            <h3 className="font-semibold mb-2">Partnership</h3>
                            <p className="text-muted text-sm">Collaborative approach with industry experts and stakeholders</p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Join Our Team */}
            <section className="section-amber">
                <Card tint="amber">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-semibold">Join Our Team</h2>
                        <p className="text-muted max-w-2xl mx-auto">
                            We're building the future of asset-backed securities. If you're passionate about blockchain, 
                            mineral resources, or financial innovation, we'd love to hear from you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <a href="careers" className="btn-soft">View Open Positions</a>
            <a href="contact-us" className="btn-outline">Get in Touch</a>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    )
}
