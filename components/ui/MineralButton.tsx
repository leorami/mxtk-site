export default function MineralButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const className = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 btn-mineral"
  if (href) return <a className={className} href={href}>{children}</a>
  return <button className={className} onClick={onClick}>{children}</button>
}
