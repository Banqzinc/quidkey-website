import type { ReactNode } from 'react'

type Workflow = {
  title: string
  body: string
  /** The release rule in the console's own shorthand. */
  rule: ReactNode
}

const WORKFLOWS: Workflow[] = [
  {
    title: 'Delivery-based',
    body: 'Release once delivery is confirmed.',
    rule: (
      <>
        <i>on</i> <b>delivery.confirmed</b> <i>release</i> <b>100%</b>
      </>
    ),
  },
  {
    title: 'Acceptance window',
    body: 'Release automatically unless the buyer raises an issue within 48 hours.',
    rule: (
      <>
        <i>after</i> <b>48h</b> <i>unless</i> <b>issue.raised</b> <i>release</i> <b>100%</b>
      </>
    ),
  },
  {
    title: 'Milestone-based',
    body: '30% on production, 60% on delivery, 10% after inspection.',
    rule: (
      <>
        <b>30%</b> <i>production</i> · <b>60%</b> <i>delivery</i> · <b>10%</b> <i>inspection</i>
      </>
    ),
  },
  {
    title: 'Refund workflow',
    body: 'Return restricted funds when agreed conditions fail.',
    rule: (
      <>
        <i>on</i> <b>conditions.failed</b> <i>refund</i> <b>buyer</b>
      </>
    ),
  },
]

export function MarketplaceWorkflows() {
  return (
    <section id="workflows" className="section mkt-wf mkt-section--white">
      <div className="container">
        <span className="section__eyebrow">Payment workflows</span>
        <h2 className="section__h mkt-h">Make the payment follow the transaction.</h2>
        <p className="section__sub">
          Release doesn’t have to be immediate. Build it around your marketplace events.
        </p>

        <div className="mkt-wf__grid" role="list">
          {WORKFLOWS.map((wf) => (
            <article key={wf.title} className="mkt-wf__card" role="listitem">
              <h3 className="mkt-wf__t">{wf.title}</h3>
              <p className="mkt-wf__b">{wf.body}</p>
              <code className="mkt-wf__rule">{wf.rule}</code>
            </article>
          ))}
        </div>

        <p className="mkt-wf__foot">
          Every workflow has a terminal state. Funds never sit restricted indefinitely.
        </p>
      </div>
    </section>
  )
}
