export function PartnerArchitecture() {
  return (
    <section className="arch" id="architecture">
      <div className="container">
        <div className="arch__head">
          <span className="eyebrow">
            <span className="eyebrow__dot" /> ARCHITECTURE
          </span>
          <h2 className="arch__title">How it fits together.</h2>
          <p className="arch__sub">
            Your product is the brand. Quidkey is the layer underneath. Your merchants never see
            us.
          </p>
        </div>

        <div className="arch__board">
          <span className="arch__board-meta">FLOW · LEFT → RIGHT</span>

          <div className="arch__lanes">
            <div className="arch__lane">
              <div className="arch__lane-h">01 · YOU</div>
              <div className="arch__node">
                <div className="arch__node-h">Your brand</div>
                <div className="arch__node-sub">Portal &amp; API, your domain</div>
              </div>
            </div>

            <div className="arch__lane">
              <div className="arch__lane-h">02 · QUIDKEY · INVISIBLE</div>
              <div className="arch__node arch__node--ink">
                <div className="arch__node-h">Rails, accounts, ledger</div>
                <div className="arch__node-sub">White-labeled under your brand</div>
              </div>
            </div>

            <div className="arch__lane">
              <div className="arch__lane-h">03 · YOUR MERCHANTS</div>
              <div className="arch__node">
                <div className="arch__node-h">They accept Pay by Bank</div>
                <div className="arch__node-sub">Onboarded by you</div>
              </div>
            </div>
          </div>

          <svg
            className="arch__svg"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="archArr"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 0 L10 5 L0 10 z" fill="#9CA3AF" />
              </marker>
            </defs>
            <path
              d="M 320 100 L 348 100"
              stroke="#9CA3AF"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              markerEnd="url(#archArr)"
              fill="none"
            />
            <path
              d="M 652 100 L 680 100"
              stroke="#9CA3AF"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              markerEnd="url(#archArr)"
              fill="none"
            />
          </svg>

          <div className="arch__rails">
            <span className="arch__rails-label">Rails</span>
            <span className="arch__rails-list">
              US ACH · UK FPS · EU SEPA Instant · AU PayTo
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
