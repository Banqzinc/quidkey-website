import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import {
  CARD_MIX,
  DEBIT_PERCENT,
  FIXED_PER_TRANSACTION,
  PAYTO_FIXED,
  PAYTO_PERCENT,
  QUIDKEY_FOREIGN_PERCENT,
  computeQuick,
  computeSavings,
  describeSalaryEquivalent,
} from './surcharge-fees'
import type { SurchargeSearch } from './surcharge-params'
import { isValidEmail, normalizeEmail, submitLead } from '@/lib/submit-lead'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'

// AUD only — this page is about an Australian regulatory change, so there is no
// region switcher and the currency is fixed.
const LOCALE = 'en-AU'

const money = (n: number, dp = 0) =>
  '$' +
  (Number.isFinite(n) ? n : 0).toLocaleString(LOCALE, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })

/** Trims trailing zeros so 1.40 reads as "1.4%" and 2 as "2%". */
const rateText = (n: number) => `${Number(n.toFixed(2))}%`

// Debounced input tracking: one event per field per pause, not per keystroke.
function useTrackInput() {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of Object.values(pending)) clearTimeout(timer)
    }
  }, [])
  return (field: string) => {
    clearTimeout(timers.current[field])
    timers.current[field] = setTimeout(() => {
      track({ name: 'surcharge_calculator_input', field })
    }, 800)
  }
}

function CurrencyField({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="sc-field">
      <div className="sc-field__top">
        <label className="sc-field__label" htmlFor={id}>
          {label}
        </label>
        {hint ? <span className="sc-field__hint">{hint}</span> : null}
      </div>
      <div className="sc-field__input">
        <span className="sc-field__prefix" aria-hidden="true">
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          className="num"
          value={value.toLocaleString(LOCALE)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '')
            onChange(digits === '' ? 0 : parseInt(digits, 10))
          }}
        />
      </div>
    </div>
  )
}

// Percent fields need decimals, so the raw text is held locally while the user
// types ("1." is not yet a number) and only valid values propagate up. On blur
// the draft clears so the field snaps back to the canonical value.
function PercentField({
  id,
  label,
  hint,
  value,
  onChange,
  max,
  disabled,
}: {
  id: string
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  max: number
  disabled?: boolean
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <div className={`sc-field sc-field--pct ${disabled ? 'is-locked' : ''}`}>
      <div className="sc-field__top">
        <label className="sc-field__label" htmlFor={id}>
          {label}
        </label>
        {hint ? <span className="sc-field__hint">{hint}</span> : null}
      </div>
      <div className="sc-field__input">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className="num"
          disabled={disabled}
          value={draft ?? String(value)}
          onChange={(e) => {
            // Keep digits and at most one decimal point.
            const raw = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            setDraft(raw)
            const n = Number(raw)
            if (raw !== '' && Number.isFinite(n) && n >= 0 && n <= max) onChange(n)
          }}
          onBlur={() => setDraft(null)}
        />
        <span className="sc-field__suffix" aria-hidden="true">
          %
        </span>
      </div>
    </div>
  )
}

const UNLOCK_KEY = 'qk_surcharge_unlocked'

// The gate stays locked through SSR and the first client render (same initial
// state on both, so no hydration mismatch), then unlocks in an effect if this
// visitor already gave us their email.
function useUnlocked() {
  const [unlocked, setUnlocked] = useState(false)
  useEffect(() => {
    try {
      if (window.localStorage.getItem(UNLOCK_KEY) === '1') setUnlocked(true)
    } catch {
      // Private-mode localStorage throws; the visitor just sees the gate again.
    }
  }, [])
  const unlock = () => {
    try {
      window.localStorage.setItem(UNLOCK_KEY, '1')
    } catch {
      // Non-fatal: unlock this session in memory regardless.
    }
    setUnlocked(true)
  }
  return { unlocked, unlock }
}

function LeadGate({
  turnover,
  rate,
  onUnlock,
}: {
  turnover: number
  rate: number
  onUnlock: () => void
}) {
  const [email, setEmail] = useState('')
  const [hp, setHp] = useState('')
  // Unticked by default and never required: consent bundled into a form the
  // visitor must submit to see their result would not be freely given.
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'invalid' | 'error'>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return

    // Check the obvious case here so a typo costs no round trip; the server
    // validates again because a client check is not a guarantee.
    if (!isValidEmail(normalizeEmail(email))) {
      setStatus('invalid')
      return
    }

    setStatus('sending')
    try {
      const result = await submitLead({
        data: { email, hp, turnover, rate, marketingConsent },
      })
      if (result.ok) {
        track({ name: 'surcharge_lead_submit', outcome: 'success' })
        onUnlock()
        return
      }
      // A failed forward must never unlock — losing the lead silently is worse
      // than asking for a retry.
      setStatus(result.error === 'invalid_email' ? 'invalid' : 'error')
      track({ name: 'surcharge_lead_submit', outcome: 'error' })
    } catch {
      setStatus('error')
      track({ name: 'surcharge_lead_submit', outcome: 'error' })
    }
  }

  const message =
    status === 'invalid'
      ? 'That email address doesn’t look right — please check it.'
      : status === 'error'
        ? 'Something went wrong — please try again.'
        : null

  return (
    <form className="sc-gate__form" onSubmit={submit} noValidate>
      <h2 className="sc-gate__title">See where your fees actually go</h2>
      <p className="sc-gate__sub">
        Get the breakdown by card type — including the three that get no fee relief on 1 October —
        and what steering volume to Pay by Bank would save you.
      </p>

      <label className="sc-gate__label" htmlFor="sc-email">
        Work email
      </label>
      <div className="sc-gate__row">
        <input
          id="sc-email"
          className="sc-gate__input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com.au"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'invalid' || status === 'error') setStatus('idle')
          }}
          aria-invalid={status === 'invalid' || undefined}
          aria-describedby={message ? 'sc-gate-message' : 'sc-gate-privacy'}
        />
        <button className="sc-gate__btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'See my full breakdown'}
        </button>
      </div>

      {/* Honeypot: bots fill hidden inputs, humans never see this. */}
      <input
        className="sc-gate__hp"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
      />

      <label className="sc-consent">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
        />
        <span>
          Email me occasional Quidkey updates on payments and the surcharge changes. Unsubscribe
          anytime.
        </span>
      </label>

      {message ? (
        <p className="sc-gate__error" id="sc-gate-message" role="alert">
          {message}
        </p>
      ) : (
        <p className="sc-gate__privacy" id="sc-gate-privacy">
          We store your email so our team can follow up. The box above is optional — your breakdown
          appears either way.
        </p>
      )}
    </form>
  )
}

// A masked stand-in for the gated table: same shape, no real figures, so the
// gate shows what's coming without putting the numbers in the DOM.
function GatePreview() {
  return (
    <div className="sc-gate__preview" aria-hidden="true" inert>
      {[0, 1, 2, 3, 4].map((i) => (
        <div className="sc-gate__prow" key={i}>
          <span className="sc-gate__pbar" style={{ width: `${58 - i * 6}%` }} />
          <span className="sc-gate__pval">$••,•••</span>
        </div>
      ))}
    </div>
  )
}

// Card types the article calls out as getting no relief on 1 October.
const NO_RELIEF: Partial<Record<string, string>> = {
  business: 'No interchange cut on 1 October',
  amex: 'No interchange cut, and no longer surchargeable',
  foreign: 'No cap until 1 April 2027',
}

function Breakdown({
  state,
  onChange,
  onTrackInput,
}: {
  state: SurchargeSearch
  onChange: (patch: Partial<SurchargeSearch>) => void
  onTrackInput: (field: string) => void
}) {
  const { turnover, aov, credit, business, amex, foreign, steer } = state

  const result = useMemo(
    () =>
      computeSavings({
        monthlyTurnover: turnover,
        averageOrderValue: aov,
        creditPercent: credit,
        businessPercent: business,
        amexPercent: amex,
        foreignPercent: foreign,
        steerPercent: steer,
      }),
    [turnover, aov, credit, business, amex, foreign, steer],
  )
  const { detailed } = result

  return (
    <>
      <section className="sc-detail">
        <div className="container">
          <div className="sc-section__head">
            <h2 className="sc-section__title">Where your card fees go</h2>
            <p className="sc-section__sub">
              Built up from a typical Australian card mix. Adjust any rate to match your merchant
              statement — domestic debit stays fixed as the cheapest reference point.
            </p>
          </div>

          <div className="sc-card sc-detail__card">
            <div className="sc-detail__inputs">
              <CurrencyField
                id="sc-aov"
                label="Average order value"
                hint="per transaction"
                value={aov}
                onChange={(v) => {
                  onChange({ aov: v })
                  onTrackInput('aov')
                }}
              />
              <PercentField
                id="sc-credit"
                label="Consumer credit"
                value={credit}
                max={10}
                onChange={(v) => {
                  onChange({ credit: v })
                  onTrackInput('credit')
                }}
              />
              <PercentField
                id="sc-business"
                label="Business credit"
                value={business}
                max={10}
                onChange={(v) => {
                  onChange({ business: v })
                  onTrackInput('business')
                }}
              />
              <PercentField
                id="sc-amex"
                label="American Express"
                value={amex}
                max={10}
                onChange={(v) => {
                  onChange({ amex: v })
                  onTrackInput('amex')
                }}
              />
              <PercentField
                id="sc-foreign"
                label="Foreign cards"
                hint="card + FX"
                value={foreign}
                max={15}
                onChange={(v) => {
                  onChange({ foreign: v })
                  onTrackInput('foreign')
                }}
              />
              <PercentField
                id="sc-debit"
                label="Domestic debit"
                hint="fixed"
                value={DEBIT_PERCENT}
                max={10}
                onChange={() => {}}
                disabled
              />
            </div>

            <table className="sc-table">
              <caption className="sc-table__caption">
                Estimated annual card fees by card type
              </caption>
              <thead>
                <tr>
                  <th scope="col">Card type</th>
                  <th scope="col" className="sc-table__num">
                    Share
                  </th>
                  <th scope="col" className="sc-table__num">
                    Rate
                  </th>
                  <th scope="col" className="sc-table__num">
                    Annual volume
                  </th>
                  <th scope="col" className="sc-table__num">
                    Annual cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailed.lines.map((line) => (
                  <tr key={line.id}>
                    <th scope="row">
                      <span className="sc-table__label">{line.label}</span>
                      {NO_RELIEF[line.id] ? (
                        <span className="sc-table__flag">{NO_RELIEF[line.id]}</span>
                      ) : null}
                    </th>
                    <td className="sc-table__num num" data-label="Share">
                      {Math.round(line.mixShare * 100)}%
                    </td>
                    <td className="sc-table__num num" data-label="Rate">
                      {rateText(line.ratePercent)}
                      {line.fixedPerTransaction > 0
                        ? ` + $${line.fixedPerTransaction.toFixed(2)}`
                        : ''}
                    </td>
                    <td className="sc-table__num num" data-label="Annual volume">
                      {money(line.annualVolume)}
                    </td>
                    <td className="sc-table__num num sc-table__cost" data-label="Annual cost">
                      {money(line.annualCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">
                    Total — detailed estimate
                    <span className="sc-table__flag">
                      Blended {rateText(detailed.effectiveRatePercent)} of card volume
                    </span>
                  </th>
                  <td className="sc-table__num num" data-label="Share">
                    100%
                  </td>
                  <td />
                  <td className="sc-table__num num" data-label="Annual volume">
                    {money(detailed.annualVolume)}
                  </td>
                  <td className="sc-table__num num sc-table__cost" data-label="Annual cost">
                    {money(detailed.annualCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
            <p className="sc-detail__foot">
              This builds your fees up card type by card type, so it can differ from the quick
              estimate above — that one applies a single blended rate you entered to all volume.
            </p>
          </div>
        </div>
      </section>

      <section className="sc-save">
        <div className="container">
          <div className="sc-section__head">
            <h2 className="sc-section__title">What you can still legally do</h2>
            <p className="sc-section__sub">
              You can't charge more for a card, but you can charge less for a bank payment. Move
              volume onto Pay by Bank and the fee goes with it.
            </p>
          </div>

          <div className="sc-card sc-save__card">
            <div className="sc-save__control">
              <label className="sc-field__label" htmlFor="sc-steer">
                Card volume steered to Pay by Bank
              </label>
              <div className="sc-save__slider">
                <input
                  id="sc-steer"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={steer}
                  onChange={(e) => {
                    onChange({ steer: Number(e.target.value) })
                    onTrackInput('steer')
                  }}
                />
                <output className="sc-save__pct num" htmlFor="sc-steer">
                  {steer}%
                </output>
              </div>
              <p className="sc-save__hint">
                The RBA's own survey found over half of card users would switch for a 1% discount.
                Applies to domestic debit, consumer credit and business credit.
              </p>
            </div>

            <ul className="sc-levers">
              <li className="sc-lever">
                <div className="sc-lever__label">
                  Steering {money(result.steeredVolume)} to Pay by Bank
                  <span className="sc-lever__rate">
                    {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} instead of card rates
                  </span>
                </div>
                <div className="sc-lever__val num">
                  {result.steeringSavings > 0 ? money(result.steeringSavings) : 'No saving'}
                </div>
              </li>
              <li className="sc-lever">
                <div className="sc-lever__label">
                  Foreign cards through Quidkey
                  <span className="sc-lever__rate">
                    {rateText(QUIDKEY_FOREIGN_PERCENT)} instead of {rateText(foreign)} all-in
                  </span>
                </div>
                <div className="sc-lever__val num">
                  {result.foreignCardSavings > 0
                    ? money(result.foreignCardSavings)
                    : 'No additional saving'}
                </div>
              </li>
            </ul>

            <div className="sc-outcome">
              <div className="sc-outcome__cell">
                <div className="sc-outcome__lbl">Estimated annual saving</div>
                <div className="sc-outcome__val num sc-outcome__val--green">
                  {money(result.totalSavings)}
                </div>
                <div className="sc-outcome__sub">
                  {Math.round(result.savingsPercent)}% off your card fees
                </div>
              </div>
              <div className="sc-outcome__cell">
                <div className="sc-outcome__lbl">New annual card cost</div>
                <div className="sc-outcome__val num">{money(result.newAnnualCost)}</div>
                <div className="sc-outcome__sub">down from {money(detailed.annualCost)}</div>
              </div>
              <div className="sc-outcome__cell sc-outcome__cta">
                <p className="sc-outcome__pitch">
                  Quidkey lets you offer discounts, loyalty points or other rewards so customers
                  choose Pay by Bank — and share the saving instead of giving it to the card
                  networks.
                </p>
                <div className="sc-outcome__btns">
                  <a
                    className="sc-btn sc-btn--primary"
                    href={DEMO_BOOKING_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Book a demo
                  </a>
                  <a className="sc-btn sc-btn--ghost" href={MERCHANTS_SIGNUP_URL}>
                    Get started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sc-notes">
        <div className="container">
          <h2 className="sc-notes__title">Assumptions</h2>
          <p className="sc-notes__body">
            <strong>Estimates only.</strong> Card mix by value is assumed to be{' '}
            {Math.round(CARD_MIX.debit * 100)}% domestic debit,{' '}
            {Math.round(CARD_MIX.credit * 100)}% domestic consumer credit,{' '}
            {Math.round(CARD_MIX.business * 100)}% business credit,{' '}
            {Math.round(CARD_MIX.amex * 100)}% American Express and{' '}
            {Math.round(CARD_MIX.foreign * 100)}% foreign-issued. Domestic debit, consumer credit
            and business credit include a ${FIXED_PER_TRANSACTION.toFixed(2)} per-transaction fee;
            American Express and foreign cards are modelled as a percentage only. Quidkey Pay by
            Bank is {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} and Quidkey international
            cards {rateText(QUIDKEY_FOREIGN_PERCENT)}. Your actual fees depend on your merchant
            agreement, card mix, negotiated rates, refunds, chargebacks and FX.
          </p>
          <p className="sc-notes__body">
            The 1 October 2026 changes and the RBA's consumer-switching figures come from the RBA's{' '}
            <em>Review of Merchant Card Payment Costs and Surcharging — Conclusions Paper</em>{' '}
            (March 2026) and the RBA Consumer Payments Survey 2025. This is general information, not
            financial or legal advice — check your own merchant agreements and get advice on how you
            structure any discount.
          </p>
        </div>
      </section>
    </>
  )
}

export function SurchargeCalculator({
  state,
  onChange,
}: {
  state: SurchargeSearch
  onChange: (patch: Partial<SurchargeSearch>) => void
}) {
  const { turnover, rate } = state
  const trackInput = useTrackInput()
  const { unlocked, unlock } = useUnlocked()

  const quick = useMemo(
    () => computeQuick({ monthlyTurnover: turnover, ratePercent: rate }),
    [turnover, rate],
  )
  const salaryLine = describeSalaryEquivalent(quick.salaryEquivalent)

  return (
    <>
      <header className="sc-head">
        <div className="container">
          <p className="sc-eyebrow">
            Surcharge ban
            <span className="sc-eyebrow__sep" aria-hidden="true">
              /
            </span>
            <span className="sc-eyebrow__date">1 October 2026</span>
          </p>
          <h1 className="sc-head__title">
            What will the surcharge ban <em>cost your business?</em>
          </h1>
          <p className="sc-head__sub">
            From 1 October you can no longer pass card processing fees to your customers. You pay
            them instead. Here's what that looks like on your volume.
          </p>
        </div>
      </header>

      <section className="sc-quick">
        <div className="container">
          <div className="sc-quick__card">
            <div className="sc-quick__inputs">
              <h2 className="sc-quick__title">Your card volume</h2>
              <CurrencyField
                id="sc-turnover"
                label="Monthly card turnover"
                hint="per month"
                value={turnover}
                onChange={(v) => {
                  onChange({ turnover: v })
                  trackInput('turnover')
                }}
              />
              <PercentField
                id="sc-rate"
                label="Your average card fee rate"
                hint="check your merchant statement"
                value={rate}
                max={10}
                onChange={(v) => {
                  onChange({ rate: v })
                  trackInput('rate')
                }}
              />
              <p className="sc-quick__note">
                Not sure? Most Australian businesses land between 1.2% and 1.8% once every card type
                is averaged out.
              </p>
            </div>

            <div className="sc-quick__result">
              <div className="sc-quick__eyebrow">Card fees you'll absorb</div>
              <div className="sc-quick__big num">{money(quick.annualCost)}</div>
              <div className="sc-quick__unit">per year</div>
              <dl className="sc-quick__meta">
                <div>
                  <dt>Per month</dt>
                  <dd className="num">{money(quick.monthlyCost)}</dd>
                </div>
                <div>
                  <dt>On annual card volume</dt>
                  <dd className="num">{money(quick.annualVolume)}</dd>
                </div>
              </dl>
              {salaryLine ? <p className="sc-quick__compare">{salaryLine}</p> : null}
            </div>
          </div>
        </div>
      </section>

      {unlocked ? (
        <Breakdown state={state} onChange={onChange} onTrackInput={trackInput} />
      ) : (
        <section className="sc-gate">
          <div className="container">
            <div className="sc-card sc-gate__card">
              <LeadGate turnover={turnover} rate={rate} onUnlock={unlock} />
              <GatePreview />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
