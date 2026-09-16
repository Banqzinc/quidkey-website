import { useState } from 'react'

import { track } from '@/lib/track'
import { buildMailto, FX_CHECK_URL } from '@/lib/urls'

import { estimateFxSavings, SAVING_PERCENT, TALK_TO_US_FROM } from './fx-savings'

const PRESETS = [100_000, 250_000, 1_000_000]
const DEFAULT_VOLUME = 250_000

const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US', { maximumFractionDigits: 0 })

// Short labels for the preset pills and the high-volume line: $100k, $250k, $1m.
const compact = (n: number) => (n >= 1_000_000 ? `$${n / 1_000_000}m` : `$${n / 1_000}k`)

// Sits in the hero's right-hand column, where the homepage puts its phone
// demo. One input, the saving in dollars, one button.
export function FxCheckCalculatorCard() {
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const { monthlySaving, yearlySaving } = estimateFxSavings(volume)

  return (
    <div className="fxc-calc">
      <div className="fxc-calc__card">
        <h2 className="fxc-calc__h">How much could you save?</h2>
        <label className="fxc-calc__label" htmlFor="fxc-volume">
          Money you convert each month, in and out
        </label>
        <div className="fxc-calc__input">
          <span className="fxc-calc__prefix">$</span>
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
        <div className="fxc-calc__presets" role="group" aria-label="Example volumes">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`fxc-calc__preset ${volume === preset ? 'is-on' : ''}`}
              aria-pressed={volume === preset}
              onClick={() => setVolume(preset)}
            >
              {compact(preset)}
            </button>
          ))}
        </div>
        <div className="fxc-calc__delta">
          <span className="fxc-calc__delta-lbl">You could save</span>
          <span className="fxc-calc__delta-val">
            +{money(monthlySaving)}
            <span className="fxc-calc__delta-per">/month</span>
          </span>
          <span className="fxc-calc__delta-sub">
            +{money(yearlySaving)} a year, at {SAVING_PERCENT}%
          </span>
        </div>
        <a
          href={FX_CHECK_URL}
          className="btn btn--lg btn--ink fxc-calc__cta"
          onClick={() =>
            track({ name: 'fx_check_cta_click', location: 'hero', target: 'connect_stripe' })
          }
        >
          Connect Stripe for your exact savings
        </a>
      </div>
      <p className="fxc-calc__more">
        Converting more than {compact(TALK_TO_US_FROM)} a month?{' '}
        <a
          href={buildMailto('FX savings for a high-volume business')}
          onClick={() =>
            track({ name: 'fx_check_cta_click', location: 'hero', target: 'talk_to_us' })
          }
        >
          Talk to us
        </a>
        {' '}and we’ll price it for your volume.
      </p>
      <p className="fxc-calc__disclaimer">
        Rough estimate for stores outside the US. If you convert through your bank today, your
        saving is likely higher. Your exact rate is agreed when you sign up.
      </p>
    </div>
  )
}
