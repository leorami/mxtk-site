export default function GradientHero({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}
