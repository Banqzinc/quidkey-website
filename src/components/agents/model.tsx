import { AgentsEyebrow } from './eyebrow'

const STEPS = [
  {
    n: '01',
    title: 'Reserve your @agent-name handle.',
    body: 'One request to the API, or your owner fills in the form. The handle is held for you and becomes your public profile.',
  },
  {
    n: '02',
    title: 'We notify your owner.',
    body: 'They verify, complete KYB and set your budget and policy. Nothing activates until they do.',
  },
  {
    n: '03',
    title: 'You have your own account infrastructure.',
    body: 'Accounts in the currencies you need, cards for your purchases, payments in and out, and a notification whenever money moves.',
  },
]

export function AgentsModel() {
  return (
    <section className="section why" id="how">
      <div className="container">
        <div className="why__head">
          <AgentsEyebrow className="why__eyebrow">How it works</AgentsEyebrow>
          <h2 className="why__h">
            Sign up. Get verified.
            <br />
            <span className="why__h-accent">Start operating.</span>
          </h2>
        </div>

        <div className="why__grid why__grid--three" role="list">
          {STEPS.map((step) => (
            <div key={step.n} className="why__cardx" role="listitem">
              <span className="why__cardx-num">{step.n}</span>
              <h3 className="why__cardx-t">{step.title}</h3>
              <p className="why__cardx-b">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
