// The merchant's checkout page — the demo's first screen. Pay by Bank is the
// top, pre-selected option; Apple Pay / card / PayPal render but are dead ends,
// matching the prototype.

import { DEMO_MERCHANT } from '@/components/homepage/demo-merchant'
import { bankLogoUrl, type Bank, type DemoLocale } from '@/components/homepage/demo-locales'
import { PayPalSvg, UrlBar, type PaymentMethod } from '@/components/homepage/demo/shared'

type CheckoutScreenProps = {
  paymentMethod: PaymentMethod
  isPredicted: boolean
  isSelectMode: boolean
  expanded: boolean
  pickedIdx: number | null
  ctaLabel: string
  banks: ReadonlyArray<Bank>
  miniBanks: ReadonlyArray<Bank>
  locale: DemoLocale
  onTapPredicted: () => void
  tapSelectBank: () => void
  selectBank: (i: number) => void
  pickNonBank: (m: 'apple' | 'card' | 'paypal') => void
  handleCheckoutCta: () => void
}

export function CheckoutScreen({
  paymentMethod,
  isPredicted,
  isSelectMode,
  expanded,
  pickedIdx,
  ctaLabel,
  banks,
  miniBanks,
  locale,
  onTapPredicted,
  tapSelectBank,
  selectBank,
  pickNonBank,
  handleCheckoutCta,
}: CheckoutScreenProps) {
  const pickedBank = pickedIdx != null ? banks[pickedIdx] : null
  return (
    <>
      <UrlBar host={DEMO_MERCHANT.domain} path="/checkout" />
      <div className="phone__screen">
        <div className="mck__product">
          <div className="mck__product-img" aria-hidden="true">
            <img
              src={DEMO_MERCHANT.product.img}
              alt={DEMO_MERCHANT.product.alt}
              width="800"
              height="800"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div className="mck__product-body">
            <div className="mck__product-brand">{DEMO_MERCHANT.brand}</div>
            <div className="mck__product-title">{DEMO_MERCHANT.product.title}</div>
            <div className="mck__product-meta">{DEMO_MERCHANT.product.meta}</div>
            <div className="mck__product-price num">{locale.price}</div>
          </div>
        </div>

        <div className="mck__sec-h">
          <span>Payment</span>
          <span className="mck__sec-h-meta">Secured</span>
        </div>

        {locale.authorise === 'payto' ? (
          // AU / PayTo: the account is identified by PayID on the Quidkey step,
          // so there is no bank to predict or pick — one Pay by Bank option.
          <button
            type="button"
            data-hint-id="predicted-bank"
            className={`mck__opt mck__opt--bank ${isPredicted ? 'mck__opt--active' : ''}`}
            onClick={onTapPredicted}
            style={{ height: '96px' }}
          >
            <div className="mck__opt-row">
              <span className={`mck__radio ${isPredicted ? 'is-on' : ''}`}>
                <span />
              </span>
              <div className="mck__opt-info">
                <div className="mck__opt-title">
                  <span style={{ whiteSpace: 'nowrap' }}>Pay by Bank</span>
                </div>
              </div>
              <span className="mck__pbb-marks" aria-hidden="true">
                {banks.slice(0, 2).map((b) => (
                  <span key={b.name} className="mck__pbb-chip">
                    <img src={bankLogoUrl(b.domain)} alt="" width="20" height="20" />
                  </span>
                ))}
                <img className="mck__pbb-payto" src="/homepage/payto-symbol.webp" alt="PayTo" width="26" height="26" />
                <span className="mck__pbb-chip mck__pbb-chip--plus">+{banks.length - 2}</span>
              </span>
              <span className="mck__save">Save {locale.save}</span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            data-hint-id="predicted-bank"
            className={`mck__opt mck__opt--bank ${isPredicted ? 'mck__opt--active' : ''}`}
            onClick={onTapPredicted}
            style={{ height: '96px' }}
          >
            <div className="mck__opt-row">
              <span className={`mck__radio ${isPredicted ? 'is-on' : ''}`}>
                <span />
              </span>
              <div className="mck__opt-logo">
                <img src={bankLogoUrl(banks[0].domain)} alt={`${banks[0].name} logo`} width="38" height="38" />
              </div>
              <div className="mck__opt-info">
                <div className="mck__opt-title">
                  <span style={{ whiteSpace: 'nowrap' }}>Pay with {banks[0].name}</span>
                </div>
              </div>
              <span className="mck__save">Save {locale.save}</span>
            </div>
          </button>
        )}

        {locale.authorise !== 'payto' && (
        <div className={`mck__opt mck__select ${expanded ? 'is-open' : ''} ${isSelectMode ? 'mck__select--on' : ''}`}>
          <button
            type="button"
            data-hint-id="select-bank"
            className="mck__select-head"
            onClick={tapSelectBank}
            aria-expanded={expanded}
          >
            <span className={`mck__radio ${isSelectMode ? 'is-on' : ''}`}>
              <span />
            </span>
            <span className="mck__opt-logo mck__opt-logo--mute mck__select-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 18v-7" />
                <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
                <path d="M14 18v-7" />
                <path d="M18 18v-7" />
                <path d="M3 22h18" />
                <path d="M6 18v-7" />
              </svg>
            </span>
            <span className="mck__select-toggle">
              <span className="mck__opt-title mck__select-title">Select bank</span>
              <span className="mck__select-mini" aria-hidden="true">
                {miniBanks.map((b) => (
                  <span key={b.name} className="mck__select-mini-chip">
                    <img src={bankLogoUrl(b.domain)} alt={`${b.name} logo`} width="18" height="18" />
                  </span>
                ))}
                <span className="mck__select-mini-plus" aria-hidden="true">+</span>
              </span>
              <span className={`mck__select-chev ${expanded ? 'is-open' : ''}`}>
                <svg viewBox="0 0 12 8" width="11" height="7" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 1l5 5 5-5" />
                </svg>
              </span>
            </span>
          </button>
          {expanded && (
            <div className="mck__select-body">
              <div className="mck__select-search">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3.5 3.5" />
                </svg>
                <span>Search</span>
              </div>
              <div className="mck__select-grid">
                {banks.map((b, i) => (
                  <button
                    type="button"
                    key={b.name}
                    className={`mck__select-bank ${i === pickedIdx ? 'is-on' : ''}`}
                    onClick={() => selectBank(i)}
                  >
                    <img src={bankLogoUrl(b.domain)} alt={`${b.name} logo`} width="22" height="22" />
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        )}

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'apple' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('apple')}
        >
          <span className={`mck__radio ${paymentMethod === 'apple' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand mck__opt-logo--applepay">
            <img src="/homepage/apple-pay-mark.svg" alt="Apple Pay" width="44" height="28" />
          </div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">Apple Pay</div>
          </div>
        </button>

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'card' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('card')}
        >
          <span className={`mck__radio ${paymentMethod === 'card' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand mck__opt-logo--mute">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
              <line x1="2.5" y1="10" x2="21.5" y2="10" />
            </svg>
          </div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">Credit or debit card</div>
          </div>
        </button>

        <button
          type="button"
          className={`mck__opt ${paymentMethod === 'paypal' ? 'mck__opt--picked' : ''}`}
          onClick={() => pickNonBank('paypal')}
        >
          <span className={`mck__radio ${paymentMethod === 'paypal' ? 'is-on' : ''}`}>
            <span />
          </span>
          <div className="mck__opt-logo mck__opt-logo--brand">{PayPalSvg}</div>
          <div className="mck__opt-info">
            <div className="mck__opt-title">PayPal</div>
          </div>
        </button>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="checkout-cta"
          className="phone__action-cta"
          disabled={paymentMethod === 'select' && !pickedBank}
          onClick={handleCheckoutCta}
        >
          <span>{ctaLabel}</span>
        </button>
      </div>
    </>
  )
}
