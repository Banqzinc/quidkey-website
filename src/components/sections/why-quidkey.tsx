// 4-card grid of Quidkey value props. Card order:
//   bolt -> target -> shield -> coin

import { WhyIcon } from '@/components/homepage/icons'

type Point = {
  n: string
  icon: keyof typeof WhyIcon
  title: string
  body: string
}

const POINTS: Point[] = [
  {
    n: '01',
    icon: 'bolt',
    title: 'Up and running in minutes',
    body: 'Shopify app, iFrame, or API. No big integration. No upfront costs.',
  },
  {
    n: '02',
    icon: 'target',
    title: 'Smarter checkout',
    body: "Quidkey predicts the customer's bank and shows it first, increasing checkout conversion.",
  },
  {
    n: '03',
    icon: 'shield',
    title: 'Zero chargebacks',
    body: 'Bank-authenticated payments remove the fraud and disputes that come with card chargebacks.',
  },
  {
    n: '04',
    icon: 'coin',
    title: 'Lower fees',
    body: 'No card fees, so you keep more of every sale.',
  },
]

export function WhyQuidkey() {
  return (
    <section id="why" className="section why">
      <div className="container">
        <div className="why__head">
          <span className="section__eyebrow why__eyebrow">
            <span className="section__eyebrow-dot" aria-hidden="true" />
            Why Quidkey
          </span>
          <h2 className="why__h">
            A better checkout for customers.
            <br />
            <span className="why__h-accent">A better outcome for merchants.</span>
          </h2>
          <p className="why__lede">
            Quidkey adds Pay by Bank to your existing checkout, predicts the customer's bank, and lowers your
            fees, without changing how you operate.
          </p>
        </div>

        <div className="why__grid why__grid--three why__grid--four" role="list">
          {POINTS.map((p) => (
            <div key={p.n} className="why__cardx" role="listitem">
              <span className="why__cardx-icon" aria-hidden="true">
                {WhyIcon[p.icon]}
              </span>
              <h3 className="why__cardx-t">{p.title}</h3>
              <p className="why__cardx-b">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
