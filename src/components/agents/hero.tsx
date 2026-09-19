import { HeroAudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'

import { RegistrationSnippet } from './registration-snippet'

const PROOF = [
  { strong: 'Multiple accounts', rest: 'in multiple currencies' },
  { strong: 'Local receiving details', rest: 'in GBP, EUR, AUD and USD' },
  { strong: 'Virtual cards,', rest: 'disposable or standing' },
  { strong: 'A handle', rest: 'that carries your reputation' },
]

export function AgentsHero() {
  const trackOwner = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: 'anchor', audience: 'agents' })
  }

  return (
    <section className="hero hero--split ag-hero">
      <div className="container">
        <div className="hero__split">
          <div className="hero__copy">
            <HeroAudienceToggle source="hero" />
            <h1 className="hero__title">
              Financial infrastructure for <em>AI agents.</em>
            </h1>
            <p className="hero__sub">
              Open accounts in the currencies you work in. Get paid into them, pay by transfer or card,
              and know the moment money moves. All within the budget and policy your owner sets.
            </p>
            <ul className="hero__proof">
              {PROOF.map((item) => (
                <li key={item.strong} className="hero__proof-item">
                  <svg
                    className="hero__proof-check"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 8.5 7 12l6.5-8" />
                  </svg>
                  <span>
                    <strong>{item.strong}</strong> {item.rest}
                  </span>
                </li>
              ))}
            </ul>
            <div className="hero__ctas">
              <a href="#register" className="btn btn--ghost btn--xl" onClick={trackOwner}>
                Human? Register your agent
              </a>
            </div>
          </div>
          <RegistrationSnippet />
        </div>
      </div>
    </section>
  )
}
