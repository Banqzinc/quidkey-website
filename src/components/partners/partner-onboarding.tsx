export function PartnerOnboarding() {
  return (
    <section className="onb" id="onboarding">
      <div className="container">
        <div className="onb__head">
          <span className="eyebrow">
            <span className="eyebrow__dot" /> MERCHANT ONBOARDING
          </span>
          <h2 className="onb__title">Two ways to onboard your merchants.</h2>
          <p className="onb__sub">
            Control everything end-to-end through the Partner API, or start with a white-labeled
            portal. No integration required.
          </p>
        </div>

        <div className="onb__grid">
          <article className="onb__card">
            <div className="onb__card-h">
              <div className="onb__card-h-l">
                <span className="pill pill--ink">A</span>
                <span className="onb__card-h-title">Partner API</span>
              </div>
              <span className="onb__card-h-meta">FULL CONTROL · WEBHOOK-DRIVEN</span>
            </div>
            <div className="onb__card-body">
              <p className="onb__card-lead">
                Quidkey is invisible. Your product is the only thing your merchants see.
              </p>

              <pre className="onb__code">
                <span className="c">{'// Onboard a merchant from your portal'}</span>
                {'\n'}
                <span className="k">const</span>
                {' merchant = '}
                <span className="k">await</span>
                {' quidkey.merchants.'}
                <span className="fn">create</span>
                {'({\n  '}
                <span className="p">brand_name</span>
                {': '}
                <span className="s">"Example Brand"</span>
                {',\n  '}
                <span className="p">uri</span>
                {': '}
                <span className="s">"example-merchant.com"</span>
                {',\n  '}
                <span className="p">category_code</span>
                {': '}
                <span className="s">"4816"</span>
                {',\n  '}
                <span className="p">country</span>
                {': '}
                <span className="s">"AU"</span>
                {',\n});\n'}
                <span className="c">{'// → merchant created · KYB started, webhook fires'}</span>
              </pre>

              <ul className="onb__card-bullets">
                <li>KYB &amp; onboarding APIs (or bring your own)</li>
                <li>Accounts, ledger, payments, refunds, payouts</li>
                <li>Webhooks + sandbox / production parity</li>
              </ul>
            </div>
          </article>

          <article className="onb__card">
            <div className="onb__card-h">
              <div className="onb__card-h-l">
                <span className="pill pill--ink">B</span>
                <span className="onb__card-h-title">White-label portal</span>
              </div>
              <span className="onb__card-h-meta">ZERO INTEGRATION · LIVE IN A DAY</span>
            </div>
            <div className="onb__card-body">
              <p className="onb__card-lead">
                Your domain, your brand. We host the checkout and merchant console underneath.
              </p>

              <div className="onb__browser">
                <div className="onb__browser-bar">
                  <i />
                  <i />
                  <i />
                  <span className="onb__browser-url">pay.yourbrand.com</span>
                </div>
                <div className="onb__checkout">
                  <div className="onb__checkout-row onb__checkout-row--on">
                    <span
                      className="onb__checkout-radio onb__checkout-radio--on"
                      aria-hidden="true"
                    />
                    <span
                      className="onb__checkout-mark onb__checkout-mark--chase"
                      aria-hidden="true"
                    >
                      C
                    </span>
                    <span className="onb__checkout-label">Pay with Chase</span>
                    <span className="onb__checkout-badge">Save $4.32</span>
                  </div>
                  <div className="onb__checkout-row">
                    <span className="onb__checkout-radio" aria-hidden="true" />
                    <span
                      className="onb__checkout-mark onb__checkout-mark--bank"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 16 16"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 6.5 L8 2.5 L14 6.5" />
                        <path d="M3.2 7v5" />
                        <path d="M6.6 7v5" />
                        <path d="M9.4 7v5" />
                        <path d="M12.8 7v5" />
                        <path d="M2 13h12" />
                      </svg>
                    </span>
                    <span className="onb__checkout-label">Select bank</span>
                    <span className="onb__checkout-chips" aria-hidden="true">
                      <span className="onb__checkout-chip onb__checkout-chip--a">B</span>
                      <span className="onb__checkout-chip onb__checkout-chip--b">W</span>
                      <span className="onb__checkout-chip onb__checkout-chip--c">C</span>
                      <span className="onb__checkout-chip onb__checkout-chip--plus">+</span>
                    </span>
                    <svg
                      className="onb__checkout-chev"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </div>
                </div>
              </div>

              <ul className="onb__card-bullets">
                <li>Your domain · logo · colors</li>
                <li>Branded checkout + merchant console</li>
                <li>Live in a day, no integration</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
