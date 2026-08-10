import { track } from '@/lib/track'
import { FX_CHECK_URL } from '@/lib/urls'

const ArrowIcon = (
  <span className="btn__arrow" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11" />
      <path d="M9.5 4l4 4-4 4" />
    </svg>
  </span>
)

const ProofCheck = (
  <svg
    className="hero__proof-check"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 8.5l3.5 3.5 7-8" />
  </svg>
)

export function FxCheckHero() {
  const trackCta = () => {
    track({ name: 'fx_check_cta_click', location: 'hero' })
  }

  return (
    <section className="hero fxc-hero">
      <div className="container">
        <div className="hero__copy fxc-hero__copy">
          <h1 className="hero__title">
            See what Stripe FX fees <em>really cost you.</em>
          </h1>
          <p className="hero__sub">
            Connect your Stripe account read-only and get a free estimate of what you’d save on
            currency conversion with Quidkey. Keep the connection if you like the number — or
            disconnect on the spot.
          </p>
          <div className="hero__ctas">
            <a href={FX_CHECK_URL} className="btn btn--xl btn--ink" onClick={trackCta}>
              Run the free FX check
              {ArrowIcon}
            </a>
          </div>
          <ul className="hero__proof">
            <li className="hero__proof-item">
              {ProofCheck}
              <span>
                <strong>Read-only</strong> — nothing about your Stripe changes
              </span>
            </li>
            <li className="hero__proof-item">
              {ProofCheck}
              <span>No account needed</span>
            </li>
            <li className="hero__proof-item">
              {ProofCheck}
              <span>
                Auto-disconnects in <strong>48h</strong> if you walk away
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
