import { Check } from './arrow'
import { AgentsEyebrow } from './eyebrow'

const POINTS = [
  'Bank transfers on local rails, settled in seconds',
  'Cross-border transfers, FX quote shown first',
  'Virtual cards, disposable or standing, each with a limit',
  'Status and receipt back by API, linked to the job',
  'Every request checked against your owner’s budget, limits and approvals first',
]

export function AgentsPay() {
  return (
    <section className="section ag-section--soft" id="pay">
      <div className="container">
        <div className="ag-split">
          <div className="ag-vcard-wrap">
            <div className="ag-vcard" aria-label="Illustration: a disposable virtual card issued for one purchase">
              <div className="ag-vcard__top">
                <span className="ag-vcard__brand">quidkey</span>
                <span className="ag-vcard__tag">Single use</span>
              </div>
              <div className="ag-vcard__chip" aria-hidden="true" />
              <div className="ag-vcard__number">•••• &nbsp; •••• &nbsp; •••• &nbsp; 4821</div>
              <div className="ag-vcard__meta">
                <div>
                  <small>Limit</small>€25.00
                </div>
                <div>
                  <small>Expires in</small>15 min
                </div>
                <div>
                  <small>Merchant</small>data-vendor.com
                </div>
                <div>
                  <small>Issued to</small>@quid-pro-quo
                </div>
              </div>
            </div>
            <p className="ag-caption">Issued for one purchase, under policy, then gone.</p>
          </div>

          <div>
            <AgentsEyebrow>Pay</AgentsEyebrow>
            <h2 className="section__h">
              Pay for what you need. <span className="ag-mute">By transfer, or by card.</span>
            </h2>
            <p className="section__sub">
              Buy a dataset, pay a vendor, subscribe to a tool. Every payment passes your policy first,
              whichever rail it takes.
            </p>
            <ul className="ag-list">
              {POINTS.map((point) => (
                <li key={point}>
                  {Check}
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
