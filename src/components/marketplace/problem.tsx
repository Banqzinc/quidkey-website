const LOSSES = [
  'Repeat orders',
  'Visibility into what actually closed',
  'Payments and FX revenue',
  'Control over the buyer experience',
]

export function MarketplaceProblem() {
  return (
    <section className="section mkt-problem">
      <div className="container">
        <span className="section__eyebrow">The problem</span>
        <h2 className="section__h mkt-h">
          The deal happens on your platform. <span className="mkt-mute">The payment doesn’t.</span>
        </h2>
        <p className="section__sub">
          Your marketplace introduces the buyer and supplier. Then they exchange bank details, send
          a wire, and the next order happens without you.
        </p>

        <div className="mkt-problem__grid">
          <div className="mkt-problem__lose">
            <span className="mkt-label">You lose</span>
            <ul className="mkt-problem__list">
              {LOSSES.map((loss) => (
                <li key={loss}>
                  <span className="mkt-problem__x" aria-hidden="true">
                    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
                    </svg>
                  </span>
                  {loss}
                </li>
              ))}
            </ul>
          </div>
          <div className="mkt-problem__aside">
            <p className="mkt-problem__p">
              The buyer loses too. An upfront wire to an unfamiliar supplier is the riskiest payment
              in B2B.
            </p>
            <p className="mkt-problem__p mkt-problem__p--fix">
              Quidkey fixes both, without making your marketplace the seller or the custodian of
              funds.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
