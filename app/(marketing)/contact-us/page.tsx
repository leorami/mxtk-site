export default function Contact() {
    return (
        <div className="space-y-16">
            {/* Hero */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Contact</h1>
                <p className="text-xl text-muted max-w-3xl mx-auto">For owner intake, institutional inquiries, media, or MXTK Gives—reach out and we'll route appropriately.</p>
            </section>
            <form className="glass p-5 rounded-2xl grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Name" />
                <input className="input" placeholder="Email" />
                <input className="input md:col-span-2" placeholder="Organization" />
                <textarea className="input md:col-span-2" placeholder="Message" rows={5} />
                <button className="btn-primary md:col-span-2" type="button">Send</button>
            </form>
            <div className="text-[12px] text-muted">By submitting, you agree to our terms and privacy notice.</div>
        </div>
    )
}
