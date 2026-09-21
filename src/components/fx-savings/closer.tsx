import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

export function FxSavingsCloser() {
  const talk = useContactLink('fx', 'fx_closer')

  return (
    <section className="closer">
      <div className="container closer__inner">
        <h2 className="closer__h">Find out what you’d save.</h2>
        <div className="closer__right">
          <p className="closer__sub">
            Tell us what you convert each month and we’ll work out your saving. No setup or monthly
            fees, and nothing about how you charge customers changes.
          </p>
          <div className="closer__ctas">
            <a
              href={talk.href}
              className="closer__cta closer__cta--primary"
              onClick={(event) => {
                track({ name: 'fx_savings_cta_click', location: 'closer', target: 'talk_to_us' })
                talk.onClick(event)
              }}
            >
              Talk to us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
