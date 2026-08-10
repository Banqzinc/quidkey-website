import { track } from '@/lib/track'
import { FX_CHECK_URL } from '@/lib/urls'

export function FxCheckCloser() {
  const trackCta = () => {
    track({ name: 'fx_check_cta_click', location: 'closer' })
  }

  return (
    <section className="closer">
      <div className="container closer__inner">
        <h2 className="closer__h">Find out what you’d save.</h2>
        <div className="closer__right">
          <p className="closer__sub">
            Free, read-only, no account needed — and gone within 48 hours if you walk away.
          </p>
          <div className="closer__ctas">
            <a
              href={FX_CHECK_URL}
              className="closer__cta closer__cta--primary"
              onClick={trackCta}
            >
              Run the free FX check
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
