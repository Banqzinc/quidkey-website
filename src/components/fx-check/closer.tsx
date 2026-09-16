import { track } from '@/lib/track'
import { buildMailto, FX_CHECK_URL } from '@/lib/urls'

export function FxCheckCloser() {
  return (
    <section className="closer">
      <div className="container closer__inner">
        <h2 className="closer__h">Find out what you’d save.</h2>
        <div className="closer__right">
          <p className="closer__sub">
            Free, no account needed, and we never change anything. Gone within 48 hours if you walk
            away.
          </p>
          <div className="closer__ctas">
            <a
              href={FX_CHECK_URL}
              className="closer__cta closer__cta--primary"
              onClick={() =>
                track({ name: 'fx_check_cta_click', location: 'closer', target: 'connect_stripe' })
              }
            >
              Connect Stripe
            </a>
            <a
              href={buildMailto('FX savings for my business')}
              className="closer__cta closer__cta--secondary"
              onClick={() =>
                track({ name: 'fx_check_cta_click', location: 'closer', target: 'talk_to_us' })
              }
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
