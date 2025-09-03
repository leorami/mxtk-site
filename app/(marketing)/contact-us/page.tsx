"use client"
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import Card from '@/components/ui/Card'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

export default function Contact() {
    const { mode, pageCopy } = useCopy('contact')
    return (
        <PageTheme ink="light" lift="H" glass="soft">
            <BackgroundPhoto variant="contact" />
            <PageHero>
                <div className="relative">
                    <div className="space-y-0">
                        <SectionWrapper index={0} className="text-center">
                            <ModeTextSwap as="h1" depKey={`contact-hero-title-${mode}`} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" content={pageCopy.heroTitle[mode]} />
                            <ModeTextSwap as="p" depKey={`contact-hero-sub-${mode}`} className="text-xl text-muted max-w-3xl mx-auto" content={pageCopy.heroSub[mode]} />
                        </SectionWrapper>
                        <SectionWrapper index={1}>
                            <form className="grid gap-3 md:grid-cols-2">
                                <input className="input" placeholder="Name" />
                                <input className="input" placeholder="Email" />
                                <input className="input md:col-span-2" placeholder="Organization" />
                                <textarea className="input md:col-span-2" placeholder="Message" rows={5} />
                                <button className="btn-soft md:col-span-2" type="button">Send</button>
                            </form>
                        </SectionWrapper>
                        <SectionWrapper index={2}>
                            <div className="text-[12px] text-muted">By submitting, you agree to our terms and privacy notice.</div>
                        </SectionWrapper>
                        
                        {pageCopy.sections?.map((sec, idx) => (
                            <SectionWrapper key={`${idx}-${mode}`} index={3 + idx}>
                                <Card tint={idx % 2 === 0 ? "amber" : "teal"}>
                                    <ModeTextSwap
                                        as="h2"
                                        depKey={`contact-sec-${idx}-heading-${mode}`}
                                        className="text-xl md:text-2xl font-semibold mb-6"
                                        content={sec.heading[mode]}
                                    />
                                    <div className="space-y-4">
                                        {sec.paragraphs[mode].map((p, i) => (
                                            <ModeTextSwap
                                                key={i}
                                                as="p"
                                                depKey={`contact-sec-${idx}-p-${i}-${mode}`}
                                                className="leading-relaxed text-muted"
                                                content={p}
                                            />
                                        ))}
                                    </div>
                                    {sec.highlight?.[mode] ? (
                                        <div className="mt-5 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.10)' }}>
                                            <ModeTextSwap
                                                as="div"
                                                depKey={`contact-sec-${idx}-hl-${mode}`}
                                                className="text-sm opacity-90"
                                                content={sec.highlight[mode]}
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
