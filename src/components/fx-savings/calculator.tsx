import { useState } from 'react'

import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

import { estimateFxSavings, SAVING_PERCENT, TALK_TO_US_FROM } from './fx-savings'
import { compact, money } from './money'

const PRESETS = [100_000, 250_000, 1_000_000]
const DEFAULT_VOLUME = 250_000

// Sits in the hero's right-hand column, where the homepage puts its phone
// demo. One input, the saving in dollars first, the assumption behind it in
// plain words, one button. The button opens the contact dialog; from $1m a
// month it asks the high-volume questions instead of the general ones, so the
// merchant lands on the prompt that fits what they convert.
export function FxSavingsCalculatorCard() {
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const { monthlySaving, yearlySaving } = estimateFxSavings(volume)
  const highVolume = volume >= TALK_TO_US_FROM
  const talk = useContactLink(highVolume ? 'fx_high_volume' : 'fx', 'fx_hero')

  return (
    <div className="fxs-calc">
      <div className="fxs-calc__card">
        <h2 className="fxs-calc__h">How much could you save?</h2>
        <label className="fxs-calc__label" htmlFor="fxs-volume">
          Money you convert each month, in and out
        </label>
        <div className="fxs-calc__input">
          <span className="fxs-calc__prefix">$</span>
          <input
            id="fxs-volume"
            type="text"
            inputMode="numeric"
            value={volume.toLocaleString('en-US')}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, '')
              setVolume(digits === '' ? 0 : parseInt(digits, 10))
            }}
          />
        </div>
        <div className="fxs-calc__presets" role="group" aria-label="Example volumes">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`fxs-calc__preset ${volume === preset ? 'is-on' : ''}`}
              aria-pressed={volume === preset}
              onClick={() => setVolume(preset)}
            >
              {compact(preset)}
            </button>
          ))}
        </div>
        <div className="fxs-calc__delta">
          <span className="fxs-calc__delta-lbl">Save an estimated</span>
          <span className="fxs-calc__delta-val">
            {money(monthlySaving)}
            <span className="fxs-calc__delta-per">/month</span>
          </span>
          <span className="fxs-calc__delta-sub">
            {money(yearlySaving)} a year in lower conversion fees
          </span>
          <span className="fxs-calc__delta-note">
            Assumes Quidkey saves you {SAVING_PERCENT}% of the money you convert.
          </span>
        </div>
        <a
          href={talk.href}
          className="btn btn--lg btn--ink fxs-calc__cta"
          onClick={(event) => {
            track({ name: 'fx_savings_cta_click', location: 'hero', target: 'talk_to_us' })
            talk.onClick(event)
          }}
        >
          Talk to us about your saving
        </a>
        <p className="fxs-calc__cta-note">Free, no signup needed. A person replies within one business day.</p>
      </div>
      <p className="fxs-calc__more">
        Converting more than {compact(TALK_TO_US_FROM)} a month? We price that for your volume
        rather than at the flat rate above.
      </p>
      <p className="fxs-calc__disclaimer">
        Rough estimate for stores outside the US. If you convert through your bank today, your
        saving is likely higher. Your exact rate is agreed when you sign up.
      </p>
    </div>
  )
}
