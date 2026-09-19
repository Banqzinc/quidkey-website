import { FlowChain, type FlowStep } from './flow-chain'

const FLOW: FlowStep[] = [
  { label: 'Buyer pays' },
  { label: 'Seller sees the order is funded' },
  { label: 'Seller fulfils' },
  { label: 'Delivery or milestone confirmed' },
  { label: 'Restriction lifts automatically' },
]

const WHO = [
  {
    title: 'For buyers',
    body: 'Pay suppliers by bank without the risk of an unprotected wire.',
  },
  {
    title: 'For sellers',
    body: 'Ship knowing the order is already funded.',
  },
  {
    title: 'For you',
    body: 'Repeat orders that leave your platform lose their protection. That’s why they come back.',
  },
]

export function MarketplaceProtectedPay() {
  return (
    <section id="protected-pay" className="section mkt-pp mkt-section--white">
      <div className="container">
        <span className="section__eyebrow">Protected Pay</span>
        <h2 className="section__h mkt-h">Protection that only exists on your platform.</h2>
        <p className="section__sub">
          The buyer pays from their existing bank account. Funds are credited to the seller’s own
          regulated account and restricted from withdrawal until your workflow confirms delivery.
        </p>

        <FlowChain steps={FLOW} ariaLabel="How a Protected Pay order flows" />

        <p className="mkt-pp__fail">
          If the agreed conditions fail, the pre-authorised refund returns the funds to the buyer.
        </p>

        <div className="why__grid why__grid--three mkt-pp__who" role="list">
          {WHO.map((item) => (
            <div key={item.title} className="why__cardx" role="listitem">
              <h3 className="why__cardx-t">{item.title}</h3>
              <p className="why__cardx-b">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
