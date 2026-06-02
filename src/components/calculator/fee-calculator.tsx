import { useMemo, useState } from 'react'

import {
  COUNTRIES,
  COUNTRY_ORDER,
  PLAN_ORDER,
  SHOPIFY_FEES,
  compute,
  type CountryId,
  type Currency,
  type PlanId,
} from './fees'

// Currency-aware money formatter, derived per render from the selected base.
// The original artifact mutated a module-level `CUR` global during render,
// which would leak across requests under TanStack Start SSR — here we thread
// `cur` through props instead.
function makeMoney(cur: Currency) {
  return (n: number, dp = 0) =>
    cur.symbol +
    (Number.isFinite(n) ? n : 0).toLocaleString(cur.locale, {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp,
    })
}

function CurrencyField({
  label,
  hint,
  value,
  onChange,
  cur,
}: {
  label: string
  hint?: string
  value: number
  onChange: (value: number) => void
  cur: Currency
}) {
  return (
    <div className="field">
      <div className="field__top">
        <label className="field__label">{label}</label>
        {hint ? <span className="field__hint">{hint}</span> : null}
      </div>
      <div className="field__input">
        <span className="field__prefix">{cur.symbol}</span>
        <input
          type="text"
          inputMode="numeric"
          value={value.toLocaleString(cur.locale)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '')
            onChange(digits === '' ? 0 : parseInt(digits, 10))
          }}
          aria-label={label}
        />
      </div>
    </div>
  )
}

function GeoSelector({
  country,
  onChange,
}: {
  country: CountryId
  onChange: (id: CountryId) => void
}) {
  return (
    <div className="geo">
      <span className="geo__label">Where's your store based?</span>
      <div className="geo__opts" role="group" aria-label="Store base country">
        {COUNTRY_ORDER.map((id) => {
          const co = COUNTRIES[id]
          return (
            <button
              key={id}
              type="button"
              className={`geo__opt ${country === id ? 'is-on' : ''}`}
              aria-pressed={country === id}
              onClick={() => onChange(id)}
            >
              <span className="geo__opt-name">{co.short}</span>
              <span className="geo__opt-cur">
                {co.symbol} {co.code}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PlanSelector({ plan, onChange }: { plan: PlanId; onChange: (id: PlanId) => void }) {
  return (
    <div className="field">
      <div className="field__top">
        <label className="field__label">Shopify plan</label>
      </div>
      <div className="plan">
        {PLAN_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className={`plan__opt ${plan === id ? 'is-on' : ''}`}
            aria-pressed={plan === id}
            onClick={() => onChange(id)}
          >
            {SHOPIFY_FEES[id].label}
          </button>
        ))}
      </div>
    </div>
  )
}

function FeeRow({
  label,
  rate,
  value,
  muted,
  strong,
}: {
  label: string
  rate?: string
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className={`fee ${muted ? 'fee--muted' : ''} ${strong ? 'fee--strong' : ''}`}>
      <div>
        <div className="fee__label">{label}</div>
        {rate ? <div className="fee__rate">{rate}</div> : null}
      </div>
      <div className="fee__val num">{value}</div>
    </div>
  )
}

export function FeeCalculator() {
  const [country, setCountry] = useState<CountryId>('AU')
  const [domestic, setDomestic] = useState(50000)
  const [crossBorder, setCrossBorder] = useState(20000)
  const [aov, setAov] = useState(100)
  const [plan, setPlan] = useState<PlanId>('plus')
  const [thirdParty, setThirdParty] = useState(false)

  const cur = COUNTRIES[country]
  const money = useMemo(() => makeMoney(cur), [cur])
  const orders = (n: number) => Math.round(n).toLocaleString(cur.locale)

  const c = useMemo(
    () =>
      compute({
        domesticVolume: domestic,
        crossBorderVolume: crossBorder,
        averageOrderValue: aov,
        plan,
        // Plus never pays Shopify's third-party transaction fee.
        includeThirdPartyFee: plan === 'plus' ? false : thirdParty,
      }),
    [domestic, crossBorder, aov, plan, thirdParty]
  )

  const savingsPctOfShopify = c.shopifyTotal > 0 ? (c.monthlySavings / c.shopifyTotal) * 100 : 0

  return (
    <>
      <header className="head">
        <div className="container">
          <h1 className="head__title">What are Shopify fees costing you?</h1>
          <p className="head__sub">
            Compare your estimated Shopify card fees against Quidkey Pay by Bank in seconds.
          </p>
          <GeoSelector country={country} onChange={setCountry} />
        </div>
      </header>

      <section className="calc">
        <div className="container">
          <div className="calc__card">
            <div className="calc__grid">
              {/* Column 1 — Inputs */}
              <div className="col col--inputs">
                <div className="col__head">
                  <div>
                    <h2 className="col__title">Your monthly sales</h2>
                  </div>
                </div>
                <CurrencyField
                  label="Domestic sales volume"
                  hint="per month"
                  value={domestic}
                  onChange={setDomestic}
                  cur={cur}
                />
                <CurrencyField
                  label="International sales volume"
                  hint="per month"
                  value={crossBorder}
                  onChange={setCrossBorder}
                  cur={cur}
                />
                <CurrencyField
                  label="Average order value"
                  hint="per order"
                  value={aov}
                  onChange={setAov}
                  cur={cur}
                />
                <PlanSelector plan={plan} onChange={setPlan} />

                {plan !== 'plus' ? (
                  <div className="toggle-row">
                    <div className="toggle-row__main">
                      <span className="toggle-row__label">
                        Include Shopify third-party transaction fee
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={thirdParty}
                        className={`toggle ${thirdParty ? 'is-on' : ''}`}
                        onClick={() => setThirdParty((v) => !v)}
                      >
                        <span className="toggle__knob" />
                      </button>
                    </div>
                    <p className="toggle-row__help">
                      Shopify charges this fee when you process payments through a third-party
                      provider like Quidkey instead of Shopify Payments. Turn it on to include it in
                      your Quidkey estimate.
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Column 2 — Shopify */}
              <div className="col col--shopify">
                <div className="col__head">
                  <div>
                    <h2 className="col__title">Estimated Shopify fees</h2>
                  </div>
                </div>
                <div className="fee-meta">
                  <span className="fee-meta__chip">{c.f.label} plan</span>
                  <span>
                    {c.f.domesticPercent}% + {cur.symbol}0.30 domestic · {c.f.crossBorderAllInPercent}
                    % all-in + {cur.symbol}0.30 international
                  </span>
                </div>
                <div className="fee-list">
                  <FeeRow
                    strong
                    label="Domestic fee"
                    rate={`${c.f.domesticPercent}% + ${cur.symbol}${c.f.domesticFixed.toFixed(2)} × ${orders(c.domesticTransactions)} orders`}
                    value={money(Math.round(c.shopifyDomesticFee))}
                  />
                  <FeeRow
                    strong
                    label="International fee"
                    rate={`${c.f.internationalCardPercent}% card + ${c.f.fxPercent}% FX + ${cur.symbol}0.30 × ${orders(c.crossBorderTransactions)} orders`}
                    value={money(Math.round(c.shopifyCrossBorderFee))}
                  />
                  <div className="fee fee--total">
                    <div className="fee__label">Total estimated Shopify fees</div>
                    <div className="fee__val num">{money(Math.round(c.shopifyTotal))}</div>
                  </div>
                </div>
              </div>

              {/* Column 3 — Quidkey */}
              <div className="col col--quidkey">
                <div className="col__head">
                  <div>
                    <h2 className="col__title">Estimated Quidkey fees</h2>
                  </div>
                  <span className="pill pill--green">
                    <span className="pill__dot" />
                    Recommended
                  </span>
                </div>
                <div className="fee-meta">
                  <span className="fee-meta__chip">Pay by Bank</span>
                  <span>
                    {c.q.domesticPercent}% + {cur.symbol}0.30 domestic · {c.q.crossBorderPercent}% +{' '}
                    {cur.symbol}0.30 international
                  </span>
                </div>
                <div className="fee-list">
                  <FeeRow
                    strong
                    label="Domestic Pay by Bank fee"
                    rate={`${c.q.domesticPercent}% + ${cur.symbol}${c.q.domesticFixed.toFixed(2)} × ${orders(c.domesticTransactions)} orders`}
                    value={money(Math.round(c.quidkeyDomesticFee))}
                  />
                  <FeeRow
                    strong
                    label="International Pay by Bank fee"
                    rate={`${c.q.crossBorderPercent}% + ${cur.symbol}${c.q.crossBorderFixed.toFixed(2)} × ${orders(c.crossBorderTransactions)} orders`}
                    value={money(Math.round(c.quidkeyCrossBorderFee))}
                  />
                  {c.thirdPartyFee > 0 ? (
                    <FeeRow
                      label="Shopify third-party transaction fee"
                      rate={`${c.f.thirdPartyPercent}% of total volume · charged by Shopify`}
                      value={money(Math.round(c.thirdPartyFee))}
                    />
                  ) : null}
                  <div className="fee fee--total">
                    <div className="fee__label">Total estimated Quidkey fees</div>
                    <div className="fee__val num">{money(Math.round(c.quidkeyTotal))}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings band */}
            <div className="savings">
              <div className="savings__cell savings__lead">
                <span className="savings__eyebrow">
                  <span className="savings__eyebrow-dot" />
                  Your estimated savings
                </span>
                <p className="savings__headline">
                  Switching domestic and international volume to <b>Quidkey Pay by Bank</b> could cut
                  your monthly payment fees by{' '}
                  <b>{savingsPctOfShopify > 0 ? Math.round(savingsPctOfShopify) : 0}%</b>.
                </p>
              </div>
              <div className="savings__cell savings__metric">
                <div className="savings__metric-lbl">Estimated monthly savings</div>
                <div className="savings__metric-val num">{money(Math.round(c.monthlySavings))}</div>
                <div className="savings__metric-sub">vs your current Shopify {c.f.label} fees</div>
              </div>
              <div className="savings__cell savings__metric savings__metric--year">
                <div className="savings__metric-lbl">Estimated annual savings</div>
                <div className="savings__metric-val num">{money(Math.round(c.annualSavings))}</div>
                <div className="savings__metric-sub">based on 12 months at this volume</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="disclaimer">
        <div className="container">
          <p className="disclaimer__inner">
            <strong>Estimates only.</strong> Figures are based on publicly available Shopify{' '}
            {cur.region} pricing and Quidkey's standard example pricing. Actual fees may vary
            depending on your Shopify plan, payment setup, card mix, international volume, negotiated
            rates, refunds, chargebacks, FX, and whether third-party transaction fees apply.
          </p>
        </div>
      </section>
    </>
  )
}
