const POINTS = [
  {
    num: '01',
    title: 'Risk checked before every payment',
    body: 'Only approved, low risk payers are allowed through.',
  },
  {
    num: '02',
    title: 'One click repeat payments',
    body: 'Returning customers pay faster with a simple verification step.',
  },
  {
    num: '03',
    title: 'Built for US and non US merchants',
    body: 'Merchants can collect from US customers without needing a US entity.',
  },
  {
    num: '04',
    title: 'Local USD accounts included',
    body: 'Collection, settlement, refunds, and payouts handled through local USD accounts.',
  },
]

const ELIGIBILITY_ROWS = [
  ['US legal entity', 'Not required'],
  ['US UBOs', 'Not required'],
  ['US-based EIN', 'Not required'],
  ['Local USD account', 'Provided'],
  ['Refunds in USD', 'Supported'],
  ['Real-time risk check', 'At T+0'],
  ['Returning payer flow', 'One-click + 2FA'],
  ['ACH returns & disputes', 'Handled'],
]

export function PartnerUSFocus() {
  return (
    <section className="us" id="us">
      <div className="container">
        <div className="us__header">
          <span className="eyebrow">
            <span className="eyebrow__dot" /> US PAY BY BANK · DEDICATED FOCUS
          </span>
          <h2 className="us__title">
            Help your merchants sell into the US.<br />
            <em>Without the US setup.</em>
          </h2>
          <p className="us__lead">
            Give your merchants access to US Pay by Bank, USD collection accounts, settlement,
            refunds, and risk controls. Fast to launch and white labelled.
          </p>
        </div>

        <div className="us__grid">
          <div className="us__copy">
            <ol className="us__points">
              {POINTS.map((point) => (
                <li key={point.num}>
                  <span className="us__point-num">{point.num}</span>
                  <div className="us__point-body">
                    <strong>{point.title}</strong>
                    <span>{point.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="us__card">
            <div className="us__card-h">
              <span className="us__card-h-lbl">US Access · For US and Non US Merchants</span>
              <span className="pill pill--green">
                <span className="eyebrow__dot" style={{ background: '#10B981' }} />
                Supported
              </span>
            </div>
            <div className="us__card-rows">
              {ELIGIBILITY_ROWS.map(([label, value]) => (
                <div key={label} className="us__card-row">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="us__card-foot">
              Eligibility subject to KYB, risk and supported sectors.
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
