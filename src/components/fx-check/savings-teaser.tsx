import { useState } from 'react'

import { track } from '@/lib/track'
import { FX_CHECK_URL } from '@/lib/urls'

// Illustrative rates only — the real number comes from the merchant's own
// Stripe data via the console fx-check flow. Stripe's published currency
// conversion fee is ~2%; ~1% is Quidkey's typical pricing.
const STRIPE_FX_PERCENT = 2
const QUIDKEY_FX_PERCENT = 1

const PRESETS = [10_000, 50_000, 250_000]
const DEFAULT_VOLUME = 50_000

const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

export function FxCheckSavingsTeaser() {
  const [volume, setVolume] = useState(DEFAULT_VOLUME)

  const stripeFee = (volume * STRIPE_FX_PERCENT) / 100
  const quidkeyFee = (volume * QUIDKEY_FX_PERCENT) / 100
  const monthlySavings = stripeFee - quidkeyFee

  const trackCta = () => {
    track({ name: 'fx_check_cta_click', location: 'teaser' })
  }

  return (
    <section className="section fxc-teaser">
      <div className="container">
        <span className="section__eyebrow">
          <span className="section__eyebrow-dot" aria-hidden="true" />
          The maths
        </span>
        <h2 className="section__h">How much could you save?</h2>
        <div className="fxc-teaser__card">
          <div className="fxc-teaser__input-col">
            <label className="fxc-teaser__label" htmlFor="fxc-volume">
              Monthly volume converted from other currencies
            </label>
            <div className="fxc-teaser__input">
              <span className="fxc-teaser__prefix">$</span>
              <input
                id="fxc-volume"
                type="text"
                inputMode="numeric"
                value={volume.toLocaleString('en-US')}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, '')
                  setVolume(digits === '' ? 0 : parseInt(digits, 10))
                }}
              />
            </div>
            <div className="fxc-teaser__presets" role="group" aria-label="Example volumes">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`fxc-teaser__preset ${volume === preset ? 'is-on' : ''}`}
                  aria-pressed={volume === preset}
                  onClick={() => setVolume(preset)}
                >
                  {money(preset)}
                </button>
              ))}
            </div>
          </div>
          <div className="fxc-teaser__result-col">
            <div className="fxc-teaser__row fxc-teaser__row--strike">
              <span className="fxc-teaser__row-lbl">
                Stripe currency conversion · ~{STRIPE_FX_PERCENT}%
              </span>
              <span className="fxc-teaser__row-val">{money(stripeFee)}/mo</span>
            </div>
            <div className="fxc-teaser__row">
              <span className="fxc-teaser__row-lbl">
                Quidkey typical pricing · ~{QUIDKEY_FX_PERCENT}%
              </span>
              <span className="fxc-teaser__row-val">{money(quidkeyFee)}/mo</span>
            </div>
            <div className="fxc-teaser__delta">
              <span className="fxc-teaser__delta-lbl">You could keep</span>
              <span className="fxc-teaser__delta-val">
                {money(monthlySavings)}<span className="fxc-teaser__delta-per">/month</span>
              </span>
              <span className="fxc-teaser__delta-sub">{money(monthlySavings * 12)} a year</span>
            </div>
            <a href={FX_CHECK_URL} className="btn btn--lg btn--ink fxc-teaser__cta" onClick={trackCta}>
              Get your real number
            </a>
          </div>
        </div>
        <p className="fxc-teaser__disclaimer">
          Illustrative only, based on Stripe’s typical ~{STRIPE_FX_PERCENT}% currency-conversion fee
          and Quidkey’s typical pricing. The free check reads your actual Stripe activity — that’s
          your real number. It’s an estimate, not a quote: your final rate is agreed when you sign
          up.
        </p>
      </div>
    </section>
  )
}
