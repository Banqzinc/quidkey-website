// "What is Pay by Bank" explainer section. Maps directly to the prototype's
// WhatIsPayByBank() at app.jsx:2269-2386. The PbbFlow component (app.jsx:2152)
// is defined in the prototype but is NOT rendered by App(), so it's dead code
// and intentionally not ported.

const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

export function WhatIsPayByBank() {
  return (
    <section className="section pbb">
      <div className="container">
        <div className="pbb__head">
          <span className="section__eyebrow pbb__eyebrow">
            <span className="section__eyebrow-dot" aria-hidden="true" />
            What is Pay by Bank
          </span>
          <h2 className="section__h pbb__h pbb__h--two-line">
            <span className="pbb__h-line pbb__h-line--1">A direct, account&#8209;to&#8209;account payment.</span>
            <span className="pbb__h-line pbb__h-line--2 pbb__h-mute">No card in the middle.</span>
          </h2>
          <p className="pbb__lede">
            Pay by Bank lets customers pay directly from their bank account instead of using a card. They choose their
            bank, approve the payment securely, and complete the order.
          </p>
        </div>

        <ol className="pbb__cards">
          <li className="pbb__card">
            <div className="pbb__card-top">
              <span className="pbb__card-step">STEP 01</span>
              <h3 className="pbb__card-h">Click on your bank.</h3>
              <p className="pbb__card-b">
                At checkout, the customer picks their bank from the list or taps the one we predict.
              </p>
            </div>
            <div className="pbb__card-mock pbb__mock--checkout">
              <div className="pbb__mock-sheet">
                <div className="pbb__mock-row pbb__mock-total">
                  <span className="pbb__mock-total-l">Total</span>
                  <span className="pbb__mock-total-v">$149.00</span>
                </div>
                <div className="pbb__mock-rule pbb__mock-rule--dashed" />
                <button className="pbb__mock-opt pbb__mock-opt--active" type="button">
                  <span className="pbb__mock-opt-l">
                    <span className="pbb__mock-bnklogo" aria-hidden="true">
                      <img src={`https://img.logo.dev/chase.com?token=${LOGO_DEV_TOKEN}`} alt="Chase Bank logo" width="15" height="15" />
                    </span>
                    <span className="pbb__mock-opt-t">Pay with Chase</span>
                  </span>
                  <span className="pbb__mock-opt-check" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="16" height="16">
                      <circle cx="8" cy="8" r="8" fill="currentColor" />
                      <path
                        d="M5 8.2l2.2 2.2L11.2 6.4"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <button className="pbb__mock-opt" type="button">
                  <span className="pbb__mock-opt-l">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <rect x="3" y="6" width="18" height="13" rx="2" />
                      <path d="M3 10h18" />
                    </svg>
                    <span className="pbb__mock-opt-t">Credit card</span>
                  </span>
                </button>
                <button className="pbb__mock-opt" type="button">
                  <span className="pbb__mock-opt-l">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d="M17.05 12.04c-.03-2.78 2.27-4.12 2.37-4.18-1.29-1.89-3.3-2.15-4.02-2.18-1.71-.17-3.34.99-4.21.99-.87 0-2.21-.96-3.63-.94-1.87.03-3.59 1.08-4.55 2.74-1.94 3.36-.5 8.34 1.4 11.07.93 1.34 2.04 2.84 3.49 2.79 1.4-.06 1.93-.9 3.62-.9 1.69 0 2.17.9 3.65.87 1.51-.03 2.46-1.36 3.38-2.71 1.06-1.55 1.5-3.06 1.52-3.14-.03-.01-2.92-1.12-2.95-4.41zM14.59 4.4c.77-.93 1.29-2.23 1.15-3.52-1.11.04-2.46.74-3.26 1.67-.71.82-1.34 2.14-1.17 3.41 1.24.1 2.5-.63 3.28-1.56z" />
                    </svg>
                    <span className="pbb__mock-opt-t">Apple Pay</span>
                  </span>
                </button>
              </div>
            </div>
          </li>

          <li className="pbb__card">
            <div className="pbb__card-top">
              <span className="pbb__card-step">STEP 02</span>
              <h3 className="pbb__card-h">Confirm in the bank app.</h3>
              <p className="pbb__card-b">
                They get bounced to their bank app, confirm with Face ID, and bounce right back.
              </p>
            </div>
            <div className="pbb__card-mock pbb__mock--bank">
              <div className="pbb__mock-sheet">
                <div className="pbb__mock-bank-head">
                  <span className="pbb__mock-bank-mark pbb__mock-bank-mark--logo" aria-hidden="true">
                    <img src={`https://img.logo.dev/chase.com?token=${LOGO_DEV_TOKEN}`} alt="Chase Bank logo" width="22" height="22" />
                  </span>
                  <span className="pbb__mock-bank-name">Chase</span>
                </div>
                <div className="pbb__mock-rule" />
                <span className="pbb__mock-bank-pill">
                  <svg
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2a4 4 0 0 1 4 4v3a4 4 0 1 1-8 0V6a4 4 0 0 1 4-4z" />
                    <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
                  </svg>
                  Authorise with Face ID
                </span>
                <div className="pbb__mock-bank-amt">$149.00</div>
                <div className="pbb__mock-bank-meta">FedNow · Instant</div>
                <div className="pbb__mock-rule" />
                <div className="pbb__mock-kv">
                  <span>To</span>
                  <span>Northgate Goods</span>
                </div>
                <div className="pbb__mock-kv">
                  <span>Ref</span>
                  <span>QK-NG-8842</span>
                </div>
              </div>
            </div>
          </li>

          <li className="pbb__card">
            <div className="pbb__card-top">
              <span className="pbb__card-step">STEP 03</span>
              <h3 className="pbb__card-h">Money settles.</h3>
              <p className="pbb__card-b">
                Funds move bank-to-bank on instant rails. You see the payment confirmed in seconds.
              </p>
            </div>
            <div className="pbb__card-mock pbb__mock--settle">
              <div className="pbb__mock-sheet">
                <div className="pbb__mock-settle-head">
                  <span className="pbb__mock-check" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <circle cx="8" cy="8" r="8" fill="currentColor" />
                      <path
                        d="M5 8.2l2.2 2.2L11.2 6.4"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Payment received
                </div>
                <div className="pbb__mock-settle-amt">+ $149.00</div>
                <div className="pbb__mock-settle-meta">
                  cleared <span className="pbb__mock-dot">·</span> 1.4s <span className="pbb__mock-dot">·</span> FedNow
                </div>
                <div className="pbb__mock-rule" />
                <div className="pbb__mock-ledger">
                  <div className="pbb__mock-led-row">
                    <span>cash.in / chase</span>
                    <span className="pbb__mock-led-pos">+$149.00</span>
                  </div>
                  <div className="pbb__mock-led-row">
                    <span>liab.merchant</span>
                    <span>−$149.00</span>
                  </div>
                  <div className="pbb__mock-led-row pbb__mock-led-row--final">
                    <span className="pbb__mock-led-rec">reconciled</span>
                    <span className="pbb__mock-led-rec">$0.00</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
