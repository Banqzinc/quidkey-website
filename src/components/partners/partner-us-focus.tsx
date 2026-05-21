const POINTS = [
  {
    num: '01',
    title: 'White-labeled US Pay by Bank',
    body: 'Your brand at checkout. ACH and instant Pay by Bank under the hood.',
  },
  {
    num: '02',
    title: 'Real-time risk on every payment',
    body: 'Sub-second risk decision at the moment of authorization. Only low-risk payers admitted. Chargeback exposure cut across the 60-day ACH window.',
  },
  {
    num: '03',
    title: 'One-click after the first payment',
    body: 'Second payment onwards is one click. No bank app, no redirect. Just a 2FA code. Customers stay inside checkout.',
  },
  {
    num: '04',
    title: 'For US and non-US merchants',
    body: 'US merchants get local USD collection, settlement, and refund accounts. Eligible non-US merchants collect from US customers with no US legal entity, UBOs, or filing required.',
  },
  {
    num: '05',
    title: 'US local account access',
    body: 'Local USD accounts for collection, settlement, refunds, and payouts. ACH return handling included.',
  },
]

const ELIGIBILITY_ROWS = [
  ['US legal entity', 'Not required'],
  ['US UBOs', 'Not required'],
  ['US-based EIN', 'Not required'],
  ['US tax filing', 'Not required'],
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
            Built around the US. For US and <em>non-US merchants.</em>
          </h2>
          <p className="us__lead">
            Most partner questions are about the US. The dominant US Pay by Bank rail is still ACH,
            and ACH chargebacks can be raised up to 60 days after settlement. So we built around
            that problem, and around helping businesses anywhere in the world collect from US
            customers.
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
              <span className="us__card-h-lbl">Eligibility · Non-US merchant</span>
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
