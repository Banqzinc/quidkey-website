import { FxCheckCalculatorCard } from './calculator'

const ProofCheck = (
  <svg
    className="hero__proof-check"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 8.5l3.5 3.5 7-8" />
  </svg>
)

// Same split layout as the homepage hero (copy left, interactive thing
// right). The calculator card carries the one call to action, so the copy
// column has no buttons of its own.
export function FxCheckHero() {
  return (
    <section className="hero hero--split fxc-hero">
      <div className="container">
        <div className="hero__split">
          <div className="hero__copy fxc-hero__copy">
            <h1 className="hero__title">
              Selling or paying abroad?{' '}
              <br className="fxc-hero__break" />
              <em>Save money on FX.</em>
            </h1>
            <p className="hero__sub">
              Stripe, Shopify and your bank charge around 2% to convert your money. Quidkey saves
              you 25% or more on those conversion fees.
            </p>
            <ul className="hero__proof">
              <li className="hero__proof-item">
                {ProofCheck}
                <span>
                  <strong>No setup</strong> or monthly fees
                </span>
              </li>
              <li className="hero__proof-item">
                {ProofCheck}
                <span>
                  <strong>Keep</strong> your existing checkout and integrations
                </span>
              </li>
              <li className="hero__proof-item">
                {ProofCheck}
                <span>
                  <strong>Paid out</strong> on the same schedule as today
                </span>
              </li>
              <li className="hero__proof-item">
                {ProofCheck}
                <span>
                  <strong>Reconciles</strong> in your accounting software as before
                </span>
              </li>
            </ul>
          </div>
          <FxCheckCalculatorCard />
        </div>
      </div>
    </section>
  )
}
