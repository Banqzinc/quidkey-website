// The promises here (we only read, login stays yours, nothing changes, gone in
// 48 hours) mirror the consent copy the merchant sees inside the check itself
// (stripe-connect-consent.tsx in the monorepo console app). Keep them in step.
//
// The button sits under the steps, not inside step 01: the reader has just
// had the trust questions answered, and the closer is a whole FAQ away.

import { track } from '@/lib/track'
import { FX_CHECK_URL } from '@/lib/urls'

type Step = {
  n: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Connect Stripe',
    body: 'You approve the connection on Stripe’s own page. Quidkey never sees your login. We only read your payments and payouts, and we never change anything, take payments or touch your money.',
  },
  {
    n: '02',
    title: 'See your savings',
    body: 'Quidkey reads your last 90 days of Stripe activity and shows what you paid in FX fees and what you’d keep with Quidkey.',
  },
  {
    n: '03',
    title: 'Keep it or walk away',
    body: 'Sign up and the connection carries over. Or disconnect with one click, from Quidkey or your Stripe dashboard. Do nothing and Quidkey disconnects itself within 48 hours and keeps nothing.',
  },
]

export function FxCheckHowItWorks() {
  return (
    <section className="section fxc-how">
      <div className="container">
        <h2 className="section__h">Connecting Stripe is safe and quick.</h2>
        <p className="section__sub">
          You approve it on Stripe’s own page. We only read, we never change anything, and nothing
          about how you charge customers changes.
        </p>
        <div className="fxc-how__grid" role="list">
          {STEPS.map((step) => (
            <div key={step.n} className="fxc-how__card" role="listitem">
              <span className="fxc-how__n" aria-hidden="true">
                {step.n}
              </span>
              <h3 className="fxc-how__t">{step.title}</h3>
              <p className="fxc-how__b">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="fxc-how__cta">
          <a
            href={FX_CHECK_URL}
            className="btn btn--lg btn--ink fxc-how__btn"
            onClick={() =>
              track({ name: 'fx_check_cta_click', location: 'how_it_works', target: 'connect_stripe' })
            }
          >
            Connect Stripe
          </a>
          <p className="fxc-how__cta-note">Disconnect any time.</p>
        </div>
      </div>
    </section>
  )
}
