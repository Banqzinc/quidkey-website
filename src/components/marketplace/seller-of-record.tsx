const SELLER = [
  'Receives payment into its own regulated account',
  'Remains seller of record',
  'Issues the invoice',
  'Stays responsible for fulfilment, tax and the underlying sale',
]

const Check = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 8.5l3.5 3.5 7-8" />
  </svg>
)

export function MarketplaceSellerOfRecord() {
  return (
    <section className="section mkt-sor">
      <div className="container mkt-sor__grid">
        <div className="mkt-sor__copy">
          <span className="section__eyebrow">Seller stays seller of record</span>
          <h2 className="section__h mkt-h">You don’t need to become the merchant.</h2>
          <p className="section__sub">The commercial transaction stays between buyer and seller.</p>
          <p className="mkt-sor__p">
            Your marketplace earns its fee without owning the goods or taking sale proceeds onto
            its balance sheet.
          </p>
        </div>
        <aside className="mkt-card mkt-sor__card">
          <div className="mkt-card__head">
            <span className="mkt-label">The seller</span>
          </div>
          <ul className="mkt-sor__list">
            {SELLER.map((item) => (
              <li key={item}>
                <span className="mkt-sor__check" aria-hidden="true">
                  {Check}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}
