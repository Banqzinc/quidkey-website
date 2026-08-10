// Mirrors the consent copy the merchant sees inside the check itself
// (stripe-connect-consent.tsx in the monorepo console app) — the promise on
// this page and on the consent screen must stay in step.

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const EyeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.42 8.1 7.22 5 12 5s8.58 3.1 9.94 6.65a1 1 0 0 1 0 .7C20.58 15.9 16.78 19 12 19s-8.58-3.1-9.94-6.65Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ClockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

type TrustPoint = {
  icon: React.ReactNode
  title: string
  body: string
}

const POINTS: TrustPoint[] = [
  {
    icon: ShieldIcon,
    title: 'Nothing changes',
    body: 'Your Stripe account, checkout, and payouts keep working unchanged. Quidkey cannot process payments or change your checkout.',
  },
  {
    icon: EyeIcon,
    title: 'Read-only, enforced by Stripe',
    body: 'Quidkey gets read-only visibility to estimate your FX savings — it reads your payment history and balances, nothing more.',
  },
  {
    icon: LockIcon,
    title: 'Your login stays yours',
    body: 'The connection is approved on Stripe’s own page. Quidkey never sees your Stripe login.',
  },
  {
    icon: ClockIcon,
    title: 'Gone in 48 hours',
    body: 'Disconnect any time, from Quidkey or your Stripe dashboard. If you do nothing, Quidkey disconnects automatically within 48 hours and keeps nothing.',
  },
]

export function FxCheckTrust() {
  return (
    <section className="section fxc-trust">
      <div className="container">
        <span className="section__eyebrow">
          <span className="section__eyebrow-dot" aria-hidden="true" />
          Safe to try
        </span>
        <h2 className="section__h">Keep Stripe exactly as it is.</h2>
        <p className="section__sub">
          Connecting lets Quidkey analyse your payment data to find savings — nothing about how you
          charge customers changes.
        </p>
        <div className="fxc-trust__grid" role="list">
          {POINTS.map((point) => (
            <div key={point.title} className="fxc-trust__card" role="listitem">
              <span className="fxc-trust__icon" aria-hidden="true">
                {point.icon}
              </span>
              <h3 className="fxc-trust__t">{point.title}</h3>
              <p className="fxc-trust__b">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
