// The merchant's order-confirmation page — the demo's last screen, and the one
// that makes the saving concrete.

import { DEMO_MERCHANT } from '@/components/homepage/demo-merchant'
import type { Bank, DemoLocale } from '@/components/homepage/demo-locales'
import { UrlBar } from '@/components/homepage/demo/shared'

export function SuccessScreen({
  activeBank,
  locale,
  onReplay,
}: {
  activeBank: Bank
  locale: DemoLocale
  onReplay: () => void
}) {
  return (
    <>
      <UrlBar host={DEMO_MERCHANT.domain} path="/order/confirmed" />
      <div className="phone__screen msuccess">
        <div className="msuccess__check" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            width="36"
            height="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 24l9 9 19-19" />
          </svg>
        </div>
        <div className="msuccess__title">Payment successful</div>
        <div className="msuccess__sub">{locale.price} paid from your {activeBank.name} account</div>

        <div className="msuccess__rcpt">
          <div className="msuccess__rcpt-row">
            <span>Order</span>
            <span className="num">{DEMO_MERCHANT.orderNo}</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Paid with</span>
            <span>{activeBank.name} · Pay by Bank</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Saved</span>
            <span className="msuccess__saved">{locale.save} vs card</span>
          </div>
          <div className="msuccess__rcpt-row">
            <span>Shipping to</span>
            <span>
              {locale.customer.name} · {locale.customer.postcode}
            </span>
          </div>
        </div>

        <div className="msuccess__hint">
          A receipt has been sent to {locale.customer.email}
          <br />
          Estimated arrival Tue, May 12.
        </div>
      </div>
      <div className="phone__action">
        <button
          type="button"
          data-hint-id="replay"
          className="phone__action-cta phone__action-cta--ghost"
          onClick={onReplay}
        >
          <span>Replay demo</span>
        </button>
      </div>
    </>
  )
}
