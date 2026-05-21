import { track } from '@/lib/track'
import { PARTNERS_EMAIL } from '@/lib/urls'

const MAILTO = `mailto:${PARTNERS_EMAIL}`

export function PartnerFooter() {
  const trackEmail = () => {
    track({ name: 'homepage_outbound_click', href: MAILTO, label: 'partners_email_footer' })
  }

  return (
    <footer className="foot">
      <div className="container foot__inner">
        <div>© 2026 Quidkey · Pay by Bank for partners</div>
        <div className="foot__legal">
          <a href={MAILTO} onClick={trackEmail}>
            {PARTNERS_EMAIL}
          </a>{' '}
          · quidkey.com/partners
        </div>
      </div>
    </footer>
  )
}
