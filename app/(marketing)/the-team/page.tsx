import Image from 'next/image'

const members = [
    { name: 'Bo Vargas', role: 'Founder', img: '/media/team/bo-placeholder.jpg' },
    { name: 'Advisors', role: 'Geology • Markets • Legal', img: '/media/team/advisors-placeholder.jpg' },
]

export default function Team() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-semibold">The Team</h1>
            <p className="text-[15px] text-muted">Operators and advisors focused on verifiable value, governance, and market integrity.</p>
            <div className="grid gap-6 sm:grid-cols-2">
                {members.map((m, i) => (
                    <div key={i} className="glass p-4 rounded-2xl flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden">
                            <Image src={m.img} alt={m.name} fill sizes="56px" />
                        </div>
                        <div><div className="text-sm font-semibold">{m.name}</div><div className="text-[13px] text-muted">{m.role}</div></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
