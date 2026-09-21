// Three steps from "what do I convert" to "paid out as before". Every promise
// here is one the FAQ already makes (saving worked out first, rate agreed at
// signup, payouts on the same schedule, same-day conversion, a statement per
// payout), so keep the two in step.
//
// The button sits under the steps, not inside step 01: the reader has just
// seen what happens after they get in touch, and the closer is a whole FAQ
// away.

import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

type Step = {
  n: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Tell us what you convert',
    body: 'Where you sell, which currencies you convert and through which provider. We work out your saving from that, and a person replies within one business day.',
  },
  {
    n: '02',
    title: 'Agree your rate',
    body: 'We work with several FX providers and pick the best rate for your volume. Your exact rate is agreed when you sign up, and there are no setup or monthly fees.',
  },
  {
    n: '03',
    title: 'Change one payout account',
    body: 'Stripe or Shopify pay your foreign currency into a Quidkey account in that currency, on the same schedule as today. We convert it and send it to your bank the same day, with a statement for every payout.',
  },
]

export function FxSavingsHowItWorks() {
  const talk = useContactLink('fx', 'fx_how_it_works')

  return (
    <section className="section fxs-how">
      <div className="container">
        <h2 className="section__h">Set up in three steps.</h2>
        <p className="section__sub">
          Nothing to rebuild. Your checkout, your integrations and the way you charge customers
          stay exactly as they are.
        </p>
        <div className="fxs-how__grid" role="list">
          {STEPS.map((step) => (
            <div key={step.n} className="fxs-how__card" role="listitem">
              <span className="fxs-how__n" aria-hidden="true">
                {step.n}
              </span>
              <h3 className="fxs-how__t">{step.title}</h3>
              <p className="fxs-how__b">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="fxs-how__cta">
          <a
            href={talk.href}
            className="btn btn--lg btn--ink fxs-how__btn"
            onClick={(event) => {
              track({ name: 'fx_savings_cta_click', location: 'how_it_works', target: 'talk_to_us' })
              talk.onClick(event)
            }}
          >
            Talk to us
          </a>
          <p className="fxs-how__cta-note">A person replies within one business day.</p>
        </div>
      </div>
    </section>
  )
}
