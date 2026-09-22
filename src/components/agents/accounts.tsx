import { Check } from './arrow'
import { AgentsEyebrow } from './eyebrow'

const POINTS = [
  'Open and close accounts whenever you need them',
  'Local receiving details in GBP, EUR, AUD and USD',
  'A payment link at your handle',
  'Payments matched to the customer and the job',
  'Move funds between accounts, or convert and send abroad',
  'Notified the moment money moves',
]

const ACCOUNTS = [
  { ccy: 'EUR', line: 'IBAN DE89 3704 0044 05•• •••• ••', amount: '+ €1,000.00', what: 'Revenue · Acme Ltd' },
  { ccy: 'GBP', line: 'Account 1234 5678 · Sort code 04-00-••', amount: '− £100.00', what: 'Contractor' },
  { ccy: 'AUD', line: 'PayID quid-pro-quo@quidkey', amount: '+ A$450.00', what: 'Revenue · dataset licence' },
  { ccy: 'USD', line: 'Account •••• 4821 · Routing 0260••••', amount: '− $25.00', what: 'data-vendor.com' },
]

const EVENTS = [
  { event: 'payment.received', detail: '€120.00 into Revenue · Report #042', when: 'just now' },
  { event: 'card.authorised', detail: '€25.00 at data-vendor.com · Suppliers', when: '2 min' },
  { event: 'transfer.sent', detail: '£45.00 to Cloud Ltd · Operations', when: '1 h' },
  { event: 'account.closed', detail: 'Q2 project · balance moved to Revenue', when: 'Tue' },
]

export function AgentsAccounts() {
  return (
    <section className="section ag-section--white" id="accounts">
      <div className="container">
        <div className="ag-split">
          <div>
            <AgentsEyebrow>Your accounts</AgentsEyebrow>
            <h2 className="section__h">
              Your accounts. <span className="ag-mute">Open, get paid, move, close.</span>
            </h2>
            <p className="section__sub">
              Infrastructure, not a single wallet. We provide the accounts. You decide how many, in which
              currencies, and what each one is for.
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

          <div className="ag-stack">
            <div className="ag-card ag-receive" aria-label="Illustration: an agent's accounts, their local details and latest movements">
              <div className="ag-card__head">
                <span className="ag-card__title">Accounts · @quid-pro-quo</span>
                <span className="ag-label">Illustration</span>
              </div>
              {ACCOUNTS.map((a) => (
                <div key={a.ccy} className="ag-receive__row">
                  <span className="ag-ccy">{a.ccy}</span>
                  <span className="ag-receive__detail">{a.line}</span>
                  <span className="ag-receive__move">
                    {a.amount}
                    <small>{a.what}</small>
                  </span>
                </div>
              ))}
              <div className="ag-receive__link">
                <span>Pay this agent</span>
                <code>quidkey.com/@quid-pro-quo</code>
              </div>
            </div>

            <div className="ag-card ag-events" aria-label="Illustration: notifications an agent receives">
              <div className="ag-card__head">
                <span className="ag-card__title">Notifications</span>
                <span className="ag-label">Webhooks</span>
              </div>
              {EVENTS.map((e) => (
                <div key={e.event} className="ag-events__row">
                  <code className="ag-events__name">{e.event}</code>
                  <span className="ag-events__detail">{e.detail}</span>
                  <span className="ag-events__when">{e.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
