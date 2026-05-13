// Shopify App Store install mock. Maps to ShopifyInstallMock at app.jsx:3716.

export function ShopifyInstallMock() {
  return (
    <div className="intg__shopify">
      <div className="intg__shopify-head">
        <div className="intg__shopify-head-l">
          <img src="/homepage/shopify-bag-black.webp" alt="Shopify" className="intg__shopify-headlogo" width="14" height="14" />
          <span>Shopify App Store</span>
        </div>
        <span />
      </div>
      <div className="intg__shopify-body">
        <div className="intg__shopify-app">
          <div className="intg__shopify-icon">
            <img src="/quidkey-logo.svg" alt="Quidkey" width="32" height="32" />
          </div>
          <div className="intg__shopify-meta">
            <div className="intg__shopify-name">Quidkey · Pay by Bank</div>
            <div className="intg__shopify-by">by Quidkey · Verified partner</div>
            <div className="intg__shopify-tags">
              <span className="intg__shopify-tag">
                <span className="pill__dot" style={{ background: 'var(--pill-green)' }} />
                Free to install
              </span>
              <span className="intg__shopify-tag">English</span>
            </div>
          </div>
          <a
            href="https://apps.shopify.com/quidkey-checkout"
            target="_blank"
            rel="noopener noreferrer"
            className="intg__shopify-cta"
          >
            Install
          </a>
        </div>

        <div className="intg__shopify-bullets">
          <div className="intg__shopify-bul">
            <span className="intg__shopify-check">
              <svg viewBox="0 0 16 16" width="11" height="11">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Adds Pay by Bank to your existing checkout</span>
          </div>
          <div className="intg__shopify-bul">
            <span className="intg__shopify-check">
              <svg viewBox="0 0 16 16" width="11" height="11">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>~70% lower fees vs. card processing</span>
          </div>
          <div className="intg__shopify-bul">
            <span className="intg__shopify-check">
              <svg viewBox="0 0 16 16" width="11" height="11">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Live in 3 minutes · no code, no theme edits</span>
          </div>
        </div>

        <div className="intg__shopify-foot">
          <div className="intg__shopify-foot-row">
            <span>Pricing</span>
            <span className="num">Free to install · 1% + $0.30 / txn</span>
          </div>
          <div className="intg__shopify-foot-row">
            <span>Categories</span>
            <span>Payment experience · Checkout</span>
          </div>
          <div className="intg__shopify-foot-row">
            <span>Support</span>
            <span>support@quidkey.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}
