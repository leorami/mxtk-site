'use client'

import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import AppImage from '@/components/ui/AppImage'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'
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
    const { mode, pageCopy } = useCopy('team')

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <PageTheme ink="light" lift="M" glass="soft">
            <BackgroundPhoto variant="team" />
            <PageHero>
                <div className="relative">
                    <div className="space-y-0">
                        <SectionWrapper index={0} className="text-center space-y-6">
                            <ModeTextSwap as="h1" depKey={`team-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[mode === 'ai' ? 'build' : mode]} />
                            <ModeTextSwap as="p" depKey={`team-hero-sub-${mode}`} className="text-xl max-w-3xl mx-auto" content={pageCopy.heroSub[mode === 'ai' ? 'build' : mode]} />
                        </SectionWrapper>

                        <SectionWrapper index={1}>
                            <Card tint="amber">
                                <h2 className="text-2xl font-semibold mb-8">Leadership Team</h2>
                                <div className="grid gap-8 md:grid-cols-3">
                                    {teamMembers.map((member, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="text-center">
                                                <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                                                    <AppImage 
                                                        src={member.img.replace(/^\//, '')} 
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
                        </SectionWrapper>

                        <SectionWrapper index={2}>
                            <Card tint="teal">
                                <h2 className="text-2xl font-semibold mb-8">Advisory Boards</h2>
                                <div className="grid gap-8 md:grid-cols-3">
                                    {advisors.map((advisor, i) => (
                                        <div key={i} className="space-y-4">
                                            <div className="text-center">
                                                <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto mb-4">
                                                    <AppImage 
                                                        src={advisor.img.replace(/^\//, '')} 
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
                        </SectionWrapper>

                        <SectionWrapper index={3}>
                            <Card tint="navy">
                                <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                                          </svg>
                                        </div>
                                        <h3 className="font-semibold mb-2">Transparency</h3>
                                        <p className="text-muted text-sm">Every claim backed by verifiable data and transparent methodologies</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                                          </svg>
                                        </div>
                                        <h3 className="font-semibold mb-2">Compliance</h3>
                                        <p className="text-muted text-sm">Regulatory adherence and legal compliance in all operations</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">
                                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="mx-auto">
                                            <path d="M21,5C19.89,4.65 18.67,4.5 17.5,4.5C15.55,4.5 13.45,4.9 12,6C10.55,4.9 8.45,4.5 6.5,4.5C4.55,4.5 2.45,4.9 1,6V20.65C1,20.9 1.25,21.15 1.5,21.15C1.6,21.15 1.65,21.1 1.75,21.1C3.1,20.45 5.05,20 6.5,20C8.45,20 10.55,20.4 12,21.5C13.35,20.65 15.8,20 17.5,20C19.15,20 20.85,20.3 22.25,21.05C22.35,21.1 22.4,21.1 22.5,21.1C22.75,21.1 23,20.85 23,20.6V6C22.4,5.55 21.75,5.25 21,5M21,18.5C19.9,18.15 18.7,18 17.5,18C15.8,18 13.35,18.65 12,19.5V8C13.35,7.15 15.8,6.5 17.5,6.5C18.7,6.5 19.9,6.65 21,7V18.5Z" />
                                          </svg>
                                        </div>
                                        <h3 className="font-semibold mb-2">Partnership</h3>
                                        <p className="text-muted text-sm">Collaborative approach with industry experts and stakeholders</p>
                                    </div>
                                </div>
                            </Card>
                        </SectionWrapper>

                        <SectionWrapper index={4}>
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
                        </SectionWrapper>
                        
                        {pageCopy.sections?.map((sec, idx) => (
                            <SectionWrapper key={`${idx}-${mode}`} index={5 + idx}>
                                <Card tint={idx % 2 === 0 ? "teal" : "navy"}>
                                    <ModeTextSwap
                                        as="h2"
                                        depKey={`team-sec-${idx}-heading-${mode}`}
                                        className="text-xl md:text-2xl font-semibold mb-6"
                                        content={sec.heading[mode === 'ai' ? 'build' : mode]}
                                    />
                                    <div className="space-y-4">
                                        {sec.paragraphs[mode === 'ai' ? 'build' : mode].map((p, i) => (
                                            <ModeTextSwap
                                                key={i}
                                                as="p"
                                                depKey={`team-sec-${idx}-p-${i}-${mode}`}
                                                className="leading-relaxed text-muted"
                                                content={p}
                                            />
                                        ))}
                                    </div>
                                    {sec.highlight?.[mode === 'ai' ? 'build' : mode] ? (
                                        <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                                            <ModeTextSwap
                                                as="div"
                                                depKey={`team-sec-${idx}-hl-${mode}`}
                                                className="text-sm opacity-90"
                                                content={sec.highlight[mode === 'ai' ? 'build' : mode]}
                                            />
                                        </div>
                                    ) : null}
                                </Card>
                            </SectionWrapper>
                        ))}
                    </div>
                </div>
            </PageHero>
        </PageTheme>
        )
}
