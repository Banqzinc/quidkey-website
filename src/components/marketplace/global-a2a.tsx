const RAILS = [
  { code: 'AU', region: 'Australia', rails: 'PayTo / NPP' },
  { code: 'UK', region: 'United Kingdom', rails: 'Faster Payments' },
  { code: 'EU', region: 'Europe', rails: 'SEPA / SEPA Instant' },
  { code: 'US', region: 'United States', rails: 'Supported local rails' },
]

// Beyond the four local-rail markets, sellers elsewhere are paid over SWIFT in
// their own currency. One wide tile under the four so it reads as the
// complement to local rails, not a fifth market.
const SWIFT = {
  code: 'SWIFT',
  region: 'Over 30 more currencies',
  rails: 'Local-currency SWIFT payments, alongside the local rails above',
}

const WHO = [
  { who: 'The buyer', what: 'sees one all-in price in their own currency.' },
  { who: 'The seller', what: 'receives into their supported account and currency.' },
  { who: 'Quidkey', what: 'handles routing, accounts and FX underneath.' },
]

export function MarketplaceGlobal() {
  return (
    <section className="section mkt-global">
      <div className="container">
        <span className="section__eyebrow">Global A2A</span>
        <h2 className="section__h mkt-h">
          Buyer pays locally. <span className="mkt-mute">Seller receives globally.</span>
        </h2>
        <p className="section__sub">One integration connects local and cross-border bank rails.</p>

        <ul className="mkt-rails" aria-label="Supported markets and rails">
          {RAILS.map((r) => (
            <li key={r.code} className="mkt-rail">
              <span className="mkt-rail__code">{r.code}</span>
              <span className="mkt-rail__region">{r.region}</span>
              <span className="mkt-rail__rails">{r.rails}</span>
            </li>
          ))}
          <li className="mkt-rail mkt-rail--wide">
            <span className="mkt-rail__code">{SWIFT.code}</span>
            <span className="mkt-rail__region">{SWIFT.region}</span>
            <span className="mkt-rail__rails">{SWIFT.rails}</span>
          </li>
        </ul>

        <dl className="mkt-global__who">
          {WHO.map((w) => (
            <div key={w.who} className="mkt-global__who-row">
              <dt>{w.who}</dt>
              <dd>{w.what}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
