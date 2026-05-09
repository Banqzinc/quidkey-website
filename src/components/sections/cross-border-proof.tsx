export function CrossBorderProof() {
  return (
    <section className="section xbproof">
      <div className="container xbproof__container">
        <div className="xbproof__copy">
          <span className="section__eyebrow xbproof__eyebrow">
            <span className="section__eyebrow-dot" aria-hidden="true" />
            Cross-border
          </span>
          <h2 className="xbproof__h">Cheaper cross-border payments.</h2>
          <p className="xbproof__b">
            Quidkey adds Pay by Bank to your checkout so customers can pay directly from their bank account. More
            completed purchases, lower payment costs, and zero card chargebacks.
          </p>
        </div>
        <div className="xbproof__stat" aria-hidden="true">
          <div className="xbproof__stat-hero">
            <div className="xbproof__stat-big">
              <span className="xbproof__stat-figure">3</span>
              <span className="xbproof__stat-pct">%</span>
            </div>
            <div className="xbproof__stat-hero-copy">
              <span className="xbproof__stat-hero-lbl">Quidkey, all-in</span>
              <p className="xbproof__stat-hero-sub">Your checkout stays the same. The economics get better.</p>
            </div>
          </div>
          <div className="xbproof__stat-divider" />
          <div className="xbproof__stat-row xbproof__stat-row--strike">
            <span className="xbproof__stat-lbl">Card networks</span>
            <span className="xbproof__stat-val xbproof__stat-val--strike">up to 7.4%</span>
          </div>
          <ul className="xbproof__breakdown" aria-label="What's in 7.4%">
            <li className="xbproof__breakdown-row">
              <span className="xbproof__breakdown-lbl">Interchange</span>
              <span className="xbproof__breakdown-val">≈ 2.0%</span>
            </li>
            <li className="xbproof__breakdown-row">
              <span className="xbproof__breakdown-lbl">Scheme fees</span>
              <span className="xbproof__breakdown-val">≈ 0.4%</span>
            </li>
            <li className="xbproof__breakdown-row">
              <span className="xbproof__breakdown-lbl">Cross-border surcharge</span>
              <span className="xbproof__breakdown-val">≈ 1.5%</span>
            </li>
            <li className="xbproof__breakdown-row">
              <span className="xbproof__breakdown-lbl">FX markup</span>
              <span className="xbproof__breakdown-val">≈ 2.0%</span>
            </li>
            <li className="xbproof__breakdown-row">
              <span className="xbproof__breakdown-lbl">Acquirer markup</span>
              <span className="xbproof__breakdown-val">≈ 1.5%</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
