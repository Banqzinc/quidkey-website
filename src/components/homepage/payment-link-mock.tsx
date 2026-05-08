// Quidkey console payment-link mock. Maps to PaymentLinkMock at app.jsx:3633.

import { useState } from 'react'

export function PaymentLinkMock() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [copied, setCopied] = useState(false)
  const link = 'pay.quidkey.com/p/8af2x'

  const create = () => {
    setStep(1)
    setCopied(false)
  }
  const copy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  const reset = () => {
    setStep(0)
    setCopied(false)
  }

  return (
    <div className="intg__pl">
      <div className="intg__pl-head">
        <div className="intg__pl-head-l">
          <span className="intg__pl-bag" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 10-5.66-5.66L11.5 7" />
              <path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66L12.5 17" />
            </svg>
          </span>
          <span>Quidkey console</span>
          <span className="intg__pl-crumb">/ payment links / new</span>
        </div>
        <span />
      </div>

      <div className="intg__pl-body">
        {step === 0 && (
          <div className="intg__pl-form">
            <div className="intg__pl-formhead">
              <div className="intg__pl-formhead-l">
                <div className="intg__pl-title">Create a payment link</div>
                <div className="intg__pl-sub">Send to anyone · paid via Pay by Bank · settled to you</div>
              </div>
              <button type="button" className="intg__pl-cta" onClick={create}>
                Generate link →
              </button>
            </div>
            <div className="intg__pl-fields">
              <label className="intg__pl-field">
                <span className="intg__pl-lbl">Amount</span>
                <span className="intg__pl-input">
                  <span className="intg__pl-cur">USD</span>
                  <span className="intg__pl-val num">149.00</span>
                </span>
              </label>
              <label className="intg__pl-field">
                <span className="intg__pl-lbl">Description</span>
                <span className="intg__pl-input intg__pl-input--text">Court Runner, Blue · size 10</span>
              </label>
              <label className="intg__pl-field">
                <span className="intg__pl-lbl">Customer</span>
                <span className="intg__pl-input intg__pl-input--text">jamie@northgate.co</span>
              </label>
            </div>
          </div>
        )}
        {step >= 1 && (
          <div className="intg__pl-result">
            <div className="intg__pl-result-head">
              <span className="pill pill--green">
                <span className="pill__dot" />
                link ready
              </span>
              <span className="intg__pl-amt num">USD 149.00</span>
            </div>
            <div className="intg__pl-linkrow">
              <span className="intg__pl-link">{link}</span>
              <button type="button" className="intg__pl-copy" onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="intg__pl-share">
              <span className="intg__pl-share-l">Send via</span>
              <button
                type="button"
                className={`intg__pl-share-btn ${step === 2 ? 'is-on' : ''}`}
                onClick={() => setStep(2)}
              >
                WhatsApp
              </button>
              <button type="button" className="intg__pl-share-btn" onClick={() => setStep(2)}>
                Email
              </button>
              <button type="button" className="intg__pl-share-btn" onClick={() => setStep(2)}>
                SMS
              </button>
            </div>
            {step === 2 && (
              <div className="intg__pl-status">
                <span className="intg__pl-status-dot" />
                <span>Sent to jamie@northgate.co · awaiting payment</span>
                <button type="button" className="intg__pl-reset" onClick={reset}>
                  New link
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
