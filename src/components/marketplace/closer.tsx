import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

export function MarketplaceCloser() {
  const build = useContactLink('marketplace', 'marketplace_closer')

  return (
    <section className="closer mkt-closer">
      <div className="container closer__inner">
        <h2 className="closer__h">
          You already own the buyer, seller and order.
          <br className="closer__h-break" />
          <span className="closer__h-mute">Now own the payment.</span>
        </h2>
        <div className="closer__right">
          <div className="closer__ctas">
            <a
              href={build.href}
              className="closer__cta closer__cta--primary"
              onClick={(event) => {
                track({ name: 'marketplace_cta_click', location: 'closer', target: 'build' })
                build.onClick(event)
              }}
            >
              Build Protected Pay
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
