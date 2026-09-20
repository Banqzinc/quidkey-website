const PROVIDED = [
  'Seller KYB',
  'Regulated receiving accounts',
  'Local and cross-border rails',
  'FX',
  'Restriction and release workflows',
  'Fee collection',
  'APIs with webhooks',
]

export function MarketplaceWhiteLabel() {
  return (
    <section className="section mkt-wl">
      <div className="container mkt-wl__grid">
        <div className="mkt-wl__copy">
          <span className="section__eyebrow">White label</span>
          <h2 className="section__h mkt-h">
            Your product. <span className="mkt-mute">Your brand.</span>
          </h2>
          <p className="section__sub">
            Your customers deal with your marketplace, not Quidkey, except where regulated
            disclosures are required.
          </p>
        </div>
        <div className="mkt-wl__stack">
          <span className="mkt-label">Quidkey provides</span>
          <ul className="mkt-chips" aria-label="What Quidkey provides under your brand">
            {PROVIDED.map((item) => (
              <li key={item} className="mkt-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
