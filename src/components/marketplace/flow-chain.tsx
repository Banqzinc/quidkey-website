// A numbered left-to-right chain of steps, used twice on /marketplace: the
// Protected Pay flow and the agentic purchasing flow. One component so the
// two sequences read as the same idea on the same rails. Desktop lays the
// steps out in a row on a shared rule; phones stack them down a left rail.

export type FlowStep = { label: string; note?: string }

export function FlowChain({
  steps,
  ariaLabel,
  compact = false,
}: {
  steps: FlowStep[]
  ariaLabel: string
  compact?: boolean
}) {
  return (
    <ol
      className={`mkt-flow${compact ? ' mkt-flow--compact' : ''}`}
      aria-label={ariaLabel}
      style={{ '--mkt-steps': steps.length } as React.CSSProperties}
    >
      {steps.map((step, i) => (
        <li key={step.label} className="mkt-flow__step">
          <span className="mkt-flow__n" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="mkt-flow__label">{step.label}</span>
          {step.note ? <span className="mkt-flow__note">{step.note}</span> : null}
        </li>
      ))}
    </ol>
  )
}
