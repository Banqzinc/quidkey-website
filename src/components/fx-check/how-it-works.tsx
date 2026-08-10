type Step = {
  n: string
  title: string
  body: string
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Connect Stripe, read-only',
    body: 'You approve the connection on Stripe’s own page — Quidkey never sees your login and can’t change anything in your account.',
  },
  {
    n: '02',
    title: 'See your savings',
    body: 'Quidkey analyses your last 90 days of Stripe activity and shows what you paid in currency-conversion fees versus Quidkey’s typical pricing.',
  },
  {
    n: '03',
    title: 'Keep it or walk away',
    body: 'Sign up and the connection carries over, or disconnect with one click. Do nothing and Quidkey disconnects automatically within 48 hours and keeps nothing.',
  },
]

export function FxCheckHowItWorks() {
  return (
    <section className="section fxc-how">
      <div className="container">
        <span className="section__eyebrow">
          <span className="section__eyebrow-dot" aria-hidden="true" />
          How it works
        </span>
        <h2 className="section__h">Connect, see your number, decide.</h2>
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
      </div>
    </section>
  )
}
