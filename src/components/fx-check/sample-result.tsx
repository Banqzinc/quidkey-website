import { CURRENT_FEE_PERCENT, SAVING_PERCENT, savingOn } from './fx-savings'
import { money } from './money'

// A worked example of the result the check produces, so a visitor knows what
// they get in exchange for connecting Stripe. It follows the real results view
// (fx-savings-panel.tsx in the monorepo console app): converted volume, the
// Stripe fee and the estimated saving over the same 90-day window. Where the
// report shows Quidkey's fee, this shows the saving instead, because merchants
// are on different deals and one fee figure would be wrong for many of them.
const WINDOW_DAYS = 90
// Three months at the calculator's default $250k a month.
const CONVERTED_VOLUME = 750_000

export function FxCheckSampleResult() {
  const rows: [string, string][] = [
    ['Currency converted', money(CONVERTED_VOLUME)],
    ['Stripe conversion fee', `${CURRENT_FEE_PERCENT}%`],
    ['Quidkey conversion saving', `${SAVING_PERCENT}%`],
  ]

  return (
    <section className="section fxc-sample">
      <div className="container">
        <div className="fxc-sample__split">
          <div className="fxc-sample__copy">
            <h2 className="section__h">Here’s what your check shows.</h2>
            <p className="section__sub">
              Your check uses your last {WINDOW_DAYS} days of Stripe activity to estimate what you
              could save, for each currency you convert.
            </p>
          </div>
          <figure className="fxc-sample__card">
            <figcaption className="fxc-sample__head">
              <span className="fxc-sample__tag">Illustrative example</span>
              <span className="fxc-sample__window">Last {WINDOW_DAYS} days</span>
            </figcaption>
            <dl className="fxc-sample__rows">
              {rows.map(([label, value]) => (
                <div key={label} className="fxc-sample__row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              <div className="fxc-sample__row fxc-sample__row--total">
                <dt>Estimated saving</dt>
                <dd>{money(savingOn(CONVERTED_VOLUME))}</dd>
              </div>
            </dl>
            <p className="fxc-sample__note">
              Assumes Stripe’s standard {CURRENT_FEE_PERCENT}% conversion rate, not what your
              account actually paid. Not a quote.
            </p>
          </figure>
        </div>
      </div>
    </section>
  )
}
