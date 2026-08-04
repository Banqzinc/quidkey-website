import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import {
  PAYTO_FIXED,
  PAYTO_PERCENT,
  STRIPE_AU_STANDARD,
  QUIDKEY_FOREIGN_PERCENT,
  computeQuick,
  computeSavings,
  describeSalaryEquivalent,
  type CardTypeId,
} from './surcharge-fees'
import { formatMix, parseMix, type SurchargeSearch } from './surcharge-params'
import { isValidEmail, normalizeEmail, submitLead } from '@/lib/submit-lead'
import { track } from '@/lib/track'
import { DEMO_BOOKING_URL, MERCHANTS_SIGNUP_URL, buildMailto } from '@/lib/urls'

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
}: {
  id: string
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  max: number
}) {
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <div className="sc-field sc-field--pct">
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

// Above this monthly card volume a self-serve slider stops being meaningful:
// pricing and routing get negotiated around the merchant's actual mix, so the
// page hands off to sales instead of quoting a number it can't stand behind.
const ENTERPRISE_MONTHLY_TURNOVER = 10_000_000
const ENTERPRISE_SAVINGS_CLAIM_PERCENT = 70

// Money field that tolerates cents. CurrencyField reformats on every keystroke
// via toLocaleString, which fights a decimal point mid-typing, so this one holds
// the raw text until blur the way the percent fields do.
function DecimalMoneyField({
  id,
  label,
  hint,
  value,
  max,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: number
  max: number
  onChange: (value: number) => void
}) {
  const [draft, setDraft] = useState<string | null>(null)

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
          inputMode="decimal"
          className="num"
          // Cents shown while idle, raw text while typing, so "0.3" settles to "0.30".
          value={draft ?? value.toFixed(2)}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            setDraft(raw)
            const n = Number(raw)
            if (raw !== '' && Number.isFinite(n) && n >= 0 && n <= max) onChange(n)
          }}
          onBlur={() => setDraft(null)}
        />
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
      ? 'That email address doesn’t look right. Please check it.'
      : status === 'error'
        ? 'Something went wrong. Please try again.'
        : null

  return (
    <form className="sc-gate__form" onSubmit={submit} noValidate>
      <h2 className="sc-gate__title">See where your fees actually go</h2>
      <p className="sc-gate__sub">
        Set your own card mix and the rate you pay on each card type, then see what steering
        volume to Pay by Bank would save you.
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
          {status === 'sending' ? 'Sending…' : 'Open the advanced calculator'}
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
          We store your email so our team can follow up. The box above is optional, and the
          calculator opens either way.
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

// A compact percent input for a table cell. Percent fields need decimals, so
// the raw text is held locally while the user types ("1." is not yet a number)
// and only valid values propagate up; on blur the draft clears so the cell
// snaps back to the canonical value.
function CellPercent({
  value,
  max,
  onChange,
  label,
}: {
  value: number
  max: number
  onChange: (value: number) => void
  label: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const shown = Number(value.toFixed(2))

  return (
    <span className="sc-cell">
      <input
        type="text"
        inputMode="decimal"
        className="num"
        aria-label={label}
        value={draft ?? String(shown)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
          setDraft(raw)
          const n = Number(raw)
          if (raw !== '' && Number.isFinite(n) && n >= 0 && n <= max) onChange(n)
        }}
        onBlur={() => setDraft(null)}
      />
      <span className="sc-cell__unit" aria-hidden="true">
        %
      </span>
    </span>
  )
}

function AdvancedCalculator({
  state,
  onChange,
  onTrackInput,
}: {
  state: SurchargeSearch
  onChange: (patch: Partial<SurchargeSearch>) => void
  onTrackInput: (field: string) => void
}) {
  const { turnover, aov, fixed, credit, business, amex, foreign, steer, mix } = state
  const cardMix = useMemo(() => parseMix(mix), [mix])

  const result = useMemo(
    () =>
      computeSavings({
        monthlyTurnover: turnover,
        averageOrderValue: aov,
        mix: cardMix,
        fixedPerTransaction: fixed,
        creditPercent: credit,
        businessPercent: business,
        amexPercent: amex,
        foreignPercent: foreign,
        steerPercent: steer,
      }),
    [turnover, aov, fixed, cardMix, credit, business, amex, foreign, steer],
  )
  const { detailed } = result

  // Every rate and every share in the table is the visitor's to set.
  const rateField: Record<CardTypeId, { patch: keyof SurchargeSearch; max: number }> = {
    credit: { patch: 'credit', max: 10 },
    business: { patch: 'business', max: 10 },
    amex: { patch: 'amex', max: 10 },
    foreign: { patch: 'foreign', max: 15 },
  }

  const setShare = (id: CardTypeId, sharePercent: number) => {
    onChange({ mix: formatMix({ ...cardMix, [id]: sharePercent / 100 }) })
    onTrackInput('mix')
  }

  const mixTotal = detailed.mixTotalPercent
  const mixIsOff = Math.abs(mixTotal - 100) > 0.5
  const isEnterprise = turnover > ENTERPRISE_MONTHLY_TURNOVER

  return (
    <>
      <section className="sc-detail">
        <div className="container">
          <div className="sc-section__head">
            <h2 className="sc-section__title">Advanced calculator</h2>
            <p className="sc-section__sub">
              Set the share of your volume and the rate you pay on each card type. It starts from a
              typical Australian card mix, and every figure in the table is yours to change.
              Debit is left out, as it is already the cheapest card to accept.
            </p>
          </div>

          <div className="sc-card sc-detail__card">
            <table className="sc-table">
              <caption className="sc-table__caption">
                Estimated annual card fees by card type
              </caption>
              <thead>
                <tr>
                  <th scope="col">Card type</th>
                  <th scope="col">Share</th>
                  <th scope="col">Rate</th>
                  <th scope="col" className="sc-table__num">
                    Annual volume
                  </th>
                  <th scope="col" className="sc-table__num">
                    Annual cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailed.lines.map((line) => {
                  const field = rateField[line.id]
                  return (
                    <tr key={line.id}>
                      <th scope="row">{line.label}</th>
                      <td data-label="Share">
                        <CellPercent
                          value={line.mixShare * 100}
                          max={100}
                          label={`${line.label} share of card volume`}
                          onChange={(v) => setShare(line.id, v)}
                        />
                      </td>
                      <td data-label="Rate">
                        <span className="sc-rate-cell">
                          <CellPercent
                            value={line.ratePercent}
                            max={field.max}
                            label={`${line.label} rate`}
                            onChange={(v) => {
                              onChange({ [field.patch]: v } as Partial<SurchargeSearch>)
                              onTrackInput(String(field.patch))
                            }}
                          />
                          {line.fixedPerTransaction > 0 ? (
                            <span className="sc-cell__plus num">
                              + ${line.fixedPerTransaction.toFixed(2)}
                            </span>
                          ) : null}
                        </span>
                      </td>
                      <td className="sc-table__num num" data-label="Annual volume">
                        {money(line.annualVolume)}
                      </td>
                      <td className="sc-table__num num sc-table__cost" data-label="Annual cost">
                        {money(line.annualCost)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">
                    Total
                    <span className="sc-table__flag">
                      Blended {rateText(detailed.effectiveRatePercent)} of card volume
                    </span>
                  </th>
                  <td className={`num ${mixIsOff ? 'sc-table__warn' : ''}`} data-label="Share">
                    {Number(mixTotal.toFixed(1))}%
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

            {mixIsOff ? (
              <p className="sc-detail__warn" role="status">
                Your shares add up to {Number(mixTotal.toFixed(1))}%, so this covers{' '}
                {money(detailed.annualVolume)} of your {money(turnover * 12)} annual card volume.
                Adjust them to 100% to include all of it.
              </p>
            ) : null}

            <p className="sc-detail__foot">
              This builds your fees up card type by card type, so its total won't match the quick
              estimate above, which applies a single blended rate to all your volume.
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

          {isEnterprise ? (
            <div className="sc-card sc-ent">
              <p className="sc-ent__eyebrow">At your volume</p>
              <p className="sc-ent__big">
                We typically cut card costs by <b>over {ENTERPRISE_SAVINGS_CLAIM_PERCENT}%</b>
              </p>
              <p className="sc-ent__body">
                Above {money(ENTERPRISE_MONTHLY_TURNOVER)} a month, pricing and payment routing get
                built around your actual card mix rather than a rate card, so a slider won't tell
                you anything useful. Talk to us and we'll model your real volume with you.
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
                <a
                  className="sc-btn sc-btn--ghost"
                  href={buildMailto('Quidkey for high-volume card processing')}
                >
                  Talk to sales
                </a>
              </div>
            </div>
          ) : (
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
                  Applies to your domestic consumer credit and business credit volume, plus foreign
                  cards moving to Quidkey's {rateText(QUIDKEY_FOREIGN_PERCENT)}.
                </p>
              </div>

              <div className="sc-outcome">
                <div className="sc-outcome__cell">
                  <div className="sc-outcome__lbl">Estimated annual saving</div>
                  <div className="sc-outcome__val num sc-outcome__val--green">
                    {money(result.totalSavings)}
                  </div>
                  <div className="sc-outcome__sub">
                    {Math.round(result.savingsPercent)}% off your card fees, down to{' '}
                    {money(result.newAnnualCost)} from {money(detailed.annualCost)}
                  </div>
                </div>
                <div className="sc-outcome__cell sc-outcome__cta">
                  <p className="sc-outcome__pitch">
                    Quidkey lets you offer discounts, loyalty points or other rewards so customers
                    choose Pay by Bank, and share the saving instead of giving it to the card
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
          )}
        </div>
      </section>

      <section className="sc-notes">
        <div className="container">
          <h2 className="sc-notes__title">Assumptions</h2>
          <p className="sc-notes__body">
            <strong>Estimates only.</strong> The card mix and rates in the advanced calculator start
            from typical Australian figures and are yours to edit. Domestic debit is excluded, as
            it is already the cheapest card to accept. Domestic consumer credit and business credit
            include the ${fixed.toFixed(2)} per-transaction fee you entered; American Express and
            foreign-issued cards are modelled as a percentage only. Quidkey Pay by Bank is{' '}
            {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} and Quidkey international cards{' '}
            {rateText(QUIDKEY_FOREIGN_PERCENT)}. Your actual fees depend on your merchant agreement,
            card mix, negotiated rates, refunds, chargebacks and FX.
          </p>
          <p className="sc-notes__body">
            The 1 October 2026 changes and the RBA's consumer-switching figures come from the RBA's{' '}
            <em>Review of Merchant Card Payment Costs and Surcharging: Conclusions Paper</em>{' '}
            (March 2026) and the RBA Consumer Payments Survey 2025. This is general information, not
            financial or legal advice. Check your own merchant agreements and get advice on how you
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
  const { turnover, rate, aov, fixed } = state
  const trackInput = useTrackInput()
  const { unlocked, unlock } = useUnlocked()

  const quick = useMemo(
    () =>
      computeQuick({
        monthlyTurnover: turnover,
        ratePercent: rate,
        averageOrderValue: aov,
        fixedPerTransaction: fixed,
      }),
    [turnover, rate, aov, fixed],
  )
  // Only claim these are Stripe's numbers while they actually are. Once the
  // visitor edits either field, attributing the figure to Stripe would be false.
  const isStripeStandard =
    rate === STRIPE_AU_STANDARD.ratePercent && fixed === STRIPE_AU_STANDARD.fixedPerTransaction
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
              <div className="sc-quick__pair">
                <DecimalMoneyField
                  id="sc-fixed"
                  label="Fixed fee"
                  hint="per transaction"
                  value={fixed}
                  max={5}
                  onChange={(v) => {
                    onChange({ fixed: v })
                    trackInput('fixed')
                  }}
                />
                <CurrencyField
                  id="sc-aov"
                  label="Average transaction"
                  hint="per payment"
                  value={aov}
                  onChange={(v) => {
                    onChange({ aov: v })
                    trackInput('aov')
                  }}
                />
              </div>
              <p className="sc-quick__note">
                {isStripeStandard
                  ? `These are Stripe's standard Australian rates for domestic cards (${rateText(
                      STRIPE_AU_STANDARD.ratePercent,
                    )} + $${STRIPE_AU_STANDARD.fixedPerTransaction.toFixed(
                      2,
                    )}). Change them to match your own merchant statement.`
                  : `Not sure? Stripe's standard Australian pricing is ${rateText(
                      STRIPE_AU_STANDARD.ratePercent,
                    )} + $${STRIPE_AU_STANDARD.fixedPerTransaction.toFixed(
                      2,
                    )} on domestic cards, and most providers sit near that.`}
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

              <div className="sc-quick__save">
                <div className="sc-quick__save-lbl">Save up to</div>
                <div className="sc-quick__save-val num">{money(quick.maxAnnualSaving)}</div>
                <div className="sc-quick__save-sub">
                  a year on the same volume with Quidkey Pay by Bank, at{' '}
                  {rateText(PAYTO_PERCENT)} + ${PAYTO_FIXED.toFixed(2)} a transaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {unlocked ? (
        <AdvancedCalculator state={state} onChange={onChange} onTrackInput={trackInput} />
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
