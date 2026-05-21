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
            console. No integration required.
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
                <span className="onb__card-h-title">White-labeled console</span>
              </div>
              <span className="onb__card-h-meta">ZERO INTEGRATION · LIVE IN A DAY</span>
            </div>
            <div className="onb__card-body">
              <p className="onb__card-lead">
                Your domain, your brand. We host the merchant console underneath.
              </p>

              <div className="onb__browser">
                <div className="onb__browser-bar">
                  <i />
                  <i />
                  <i />
                  <span className="onb__browser-url">console.yourbrand.com</span>
                </div>
                <div className="onb__console">
                  <div className="onb__console-top">
                    <div className="onb__console-brand">
                      <span className="onb__console-brand-mark" aria-hidden="true" />
                      <span className="onb__console-brand-name">your brand</span>
                    </div>
                    <span className="onb__console-avatar" aria-hidden="true">YB</span>
                  </div>

                  <div className="onb__console-form-head">
                    <span className="onb__console-form-title">Onboard a merchant</span>
                    <span className="onb__console-form-step">Step 1 of 2</span>
                  </div>

                  <div className="onb__console-form">
                    <label className="onb__console-field">
                      <span className="onb__console-field-label">Brand name</span>
                      <span className="onb__console-field-input">Example Brand</span>
                    </label>
                    <label className="onb__console-field">
                      <span className="onb__console-field-label">Website</span>
                      <span className="onb__console-field-input">example-merchant.com</span>
                    </label>
                    <div className="onb__console-field-row">
                      <label className="onb__console-field">
                        <span className="onb__console-field-label">MCC</span>
                        <span className="onb__console-field-input">4816</span>
                      </label>
                      <label className="onb__console-field">
                        <span className="onb__console-field-label">Country</span>
                        <span className="onb__console-field-input onb__console-field-input--select">
                          AU
                          <svg
                            viewBox="0 0 16 16"
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M4 6l4 4 4-4" />
                          </svg>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="onb__console-cta">
                    <span className="onb__console-cta-btn">
                      Create merchant
                      <svg
                        viewBox="0 0 16 16"
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3.5 8h9" />
                        <path d="M8.5 4l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <ul className="onb__card-bullets">
                <li>Your domain · logo · colors</li>
                <li>Branded merchant console</li>
                <li>Live in a day, no integration</li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
