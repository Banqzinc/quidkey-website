import { FlowChain, type FlowStep } from './flow-chain'

const FLOW: FlowStep[] = [
  { label: 'Find supplier' },
  { label: 'Compare offers' },
  { label: 'Request approval' },
  { label: 'Fund order' },
  { label: 'Pay through Protected Pay' },
  { label: 'Release on delivery' },
]

export function MarketplaceAgentic() {
  return (
    <section className="section mkt-agent mkt-section--white">
      <div className="container">
        <span className="section__eyebrow">
          Next<span className="mkt-eyebrow-sep">·</span>Agentic purchasing
        </span>
        <h2 className="section__h mkt-h">Built for autonomous B2B commerce.</h2>
        <p className="section__sub">
          The same rails let AI purchasing agents transact with your suppliers.
        </p>

        <FlowChain steps={FLOW} ariaLabel="How an AI purchasing agent buys through your marketplace" compact />

        <p className="mkt-agent__foot">
          No new payment system. Your marketplace becomes transact-able by humans and agents through
          the same network.
        </p>
      </div>
    </section>
  )
}
