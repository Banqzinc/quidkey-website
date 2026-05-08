// Homepage Hero. Audience-aware copy + CTAs + a placeholder for the
// merchant/fintech visualizations.
//
// IMPORTANT: the prototype's MerchantHeroViz (~900 lines, app.jsx:793-1697)
// and FintechHeroViz (~89 lines, app.jsx:1721-1810) are intentionally NOT
// ported in this commit. They're complex multi-stage state machines that
// deserve their own dedicated commit (or commits). The placeholder below
// keeps the page rendering and the layout in shape while the heavy viz
// work is done separately. Tracking placeholders are wired so events fire
// the moment the real visuals land.

import type { ReactNode } from 'react'

import { useAudience, type Audience } from '@/context/audience'
import { track } from '@/lib/track'
import { MERCHANTS_LOGIN_URL, MERCHANTS_SIGNUP_URL } from '@/lib/urls'

type HeroCopy = {
  eyebrow: string
  title: ReactNode
  sub: string
  primary: { label: string; href: string; cta: 'get_started' | 'demo' | 'docs' }
  secondary: { label: string; href: string; cta: 'get_started' | 'demo' | 'docs' }
}

const HERO_COPY: Record<Audience, HeroCopy> = {
  merchants: {
    eyebrow: 'For merchants',
    title: (
      <>
        Increase checkout conversion. <em>Lower payment fees.</em>
      </>
    ),
    sub:
      'Quidkey lets customers pay directly from their bank account at checkout. That means more completed purchases, lower payment costs, and zero card chargebacks.',
    primary: { label: 'Add Pay by Bank to your checkout', href: MERCHANTS_SIGNUP_URL, cta: 'get_started' },
    secondary: { label: 'Book a demo', href: MERCHANTS_LOGIN_URL, cta: 'demo' },
  },
  fintechs: {
    eyebrow: 'For fintechs',
    title: (
      <>
        Pay by Bank, <em>under your brand.</em>
      </>
    ),
    sub: 'White-label rails, accounts and treasury. Live in days.',
    primary: { label: 'Become a partner', href: MERCHANTS_LOGIN_URL, cta: 'get_started' },
    secondary: { label: 'Read partner docs', href: '#', cta: 'docs' },
  },
}

const RocketArrow = (
  <span className="btn__arrow" aria-hidden="true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 19 19"
      fill="none"
      className="rocket-button-icon-main"
    >
      <path
        d="M5.73983 4.32C3.93983 4.61 2.39985 5.85 1.72985 7.54L0.769831 9.93C0.729831 10.01 0.74984 10.11 0.80984 10.18C0.85984 10.24 0.929842 10.27 0.999842 10.27C1.01984 10.27 1.03983 10.27 1.04983 10.26L4.41986 9.51C5.05986 7.44 5.68984 5.78 6.89984 4.08L5.73983 4.32ZM9.50985 14.58C11.5599 14 13.2198 13.4 14.9298 12.2L14.6999 13.28C14.4199 15.07 13.1799 16.6 11.4799 17.27L9.08984 18.23C9.08984 18.23 9.02984 18.25 8.99984 18.25C8.93984 18.25 8.87984 18.23 8.83984 18.19C8.76984 18.13 8.73985 18.04 8.75985 17.95L9.50985 14.58ZM6.26983 7.27L11.7798 12.77C11.1498 13.03 10.4899 13.25 9.75985 13.46C9.27985 13.6 8.75984 13.74 8.21984 13.89C8.17984 13.89 8.12984 13.91 8.08984 13.91C7.95984 13.91 7.82985 13.86 7.72985 13.76L5.20983 11.24C5.07983 11.11 5.02984 10.91 5.08984 10.74C5.24984 10.22 5.39983 9.73 5.54983 9.26C5.77983 8.55 6.00983 7.89 6.26983 7.27ZM18.7698 0.580002C18.7298 0.380002 18.5798 0.229999 18.3698 0.189999C17.9498 0.109999 17.1599 0 16.1699 0C14.2499 0 11.5998 0.429998 9.61984 2.42C9.11984 2.92 8.68984 3.39 8.30984 3.85C7.63984 4.67 7.12984 5.47 6.71984 6.31C6.71984 6.31 6.7265 6.31333 6.73983 6.32L12.7398 12.31L12.7599 12.33C13.5799 11.94 14.3498 11.45 15.1498 10.81C15.6298 10.42 16.1298 9.97 16.6498 9.45C19.6598 6.44 19.0098 1.83 18.7698 0.580002ZM13.2498 8.02C12.0098 8.02 10.9998 7.02 10.9998 5.78C10.9998 4.54 12.0098 3.53 13.2498 3.53C14.4898 3.53 15.4998 4.54 15.4998 5.78C15.4998 7.02 14.4898 8.02 13.2498 8.02Z"
        fill="currentColor"
      />
    </svg>
  </span>
)

function HeroVizPlaceholder({ flow }: { flow: 'merchant' | 'fintech' }) {
  return (
    <div className="hero__viz-placeholder" aria-hidden="true">
      <div className="hero__viz-placeholder-card">
        <span className="hero__viz-placeholder-eyebrow">
          {flow === 'merchant' ? 'Merchant flow' : 'Fintech flow'}
        </span>
        <span className="hero__viz-placeholder-body">
          Interactive demo lands in a follow-up commit.
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const { audience } = useAudience()
  const c = HERO_COPY[audience]
  const isMerchants = audience === 'merchants'

  const trackPrimary = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: c.primary.cta, audience })
  }
  const trackSecondary = () => {
    track({ name: 'homepage_cta_click', location: 'hero', label: c.secondary.cta, audience })
  }

  return (
    <section className={`hero ${isMerchants ? 'hero--split' : ''}`}>
      <div className="container">
        <div className={isMerchants ? 'hero__split' : ''}>
          <div className="hero__copy">
            <h1 className="hero__title">{c.title}</h1>
            <p className="hero__sub">{c.sub}</p>
            <div className="hero__ctas">
              <a
                href={c.primary.href}
                className="btn btn--xl btn--ink"
                onClick={trackPrimary}
              >
                {c.primary.label}
                {RocketArrow}
              </a>
              <a
                href={c.secondary.href}
                className="btn btn--xl btn--ghost"
                onClick={trackSecondary}
              >
                {c.secondary.label}
              </a>
            </div>
            {!isMerchants && <HeroVizPlaceholder flow="fintech" />}
          </div>
          {isMerchants && <HeroVizPlaceholder flow="merchant" />}
        </div>
      </div>
    </section>
  )
}
