// The one dark block on the page, like the US focus block on /fintechs. The
// 0.5% here is the marketplace's own take on each order, not a Quidkey rate.
export function MarketplaceEconomics() {
  return (
    <section className="section section--ink mkt-econ">
      <div className="container">
        <div className="mkt-econ__grid">
          <div className="mkt-econ__copy">
            <span className="section__eyebrow mkt-econ__eyebrow">Revenue</span>
            <h2 className="section__h mkt-h mkt-econ__h">Own the payment economics.</h2>
            <p className="section__sub mkt-econ__sub">
              Every Protected Pay order pays you, and cross-border orders pay you twice. The fee is
              taken inside the payment flow, so there is nothing to bill and nothing to chase.
            </p>
            <ul className="mkt-econ__nos" aria-label="What you no longer do">
              <li>No invoicing sellers.</li>
              <li>No fee reconciliation.</li>
              <li>No chasing.</li>
            </ul>
          </div>
          <div className="mkt-econ__stats">
            <div className="mkt-econ__stat">
              <span className="mkt-econ__stat-v">
                0.5<span className="mkt-econ__stat-unit">%</span>
              </span>
              <span className="mkt-econ__stat-l">On every Protected Pay order</span>
              <p className="mkt-econ__stat-b">Automatically collected from the payment flow.</p>
            </div>
            <div className="mkt-econ__stat">
              <span className="mkt-econ__stat-v mkt-econ__stat-v--word">FX</span>
              <span className="mkt-econ__stat-l">On cross-border transactions</span>
              <p className="mkt-econ__stat-b">Earn again through shared FX economics.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
