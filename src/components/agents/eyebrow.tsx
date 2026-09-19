// Section eyebrow in the homepage's dot-plus-label style.
export function AgentsEyebrow({ children, className = '' }: { children: string; className?: string }) {
  return (
    <span className={`section__eyebrow ${className}`}>
      <span className="section__eyebrow-dot" aria-hidden="true" />
      {children}
    </span>
  )
}
