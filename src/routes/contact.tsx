import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { ContactForm } from '@/components/contact/contact-form'
import { HomepageFooter } from '@/components/layout/homepage-footer'
import { HomepageNav } from '@/components/layout/homepage-nav'
import { AudienceProvider } from '@/context/audience'
import { DEFAULT_TOPIC, parseTopic, type ContactTopic } from '@/lib/contact-topics'
import { buildSeo } from '@/lib/seo'
import { track } from '@/lib/track'
import { CONTACT_EMAIL, DEMO_BOOKING_URL, PARTNERS_EMAIL } from '@/lib/urls'

// Share the homepage's chrome (nav, footer, typography, container). The
// contact form's own styles arrive with the dialog module mounted at the root.
import '@/styles/homepage/base.css'
import '@/styles/homepage/headings.css'
import '@/styles/homepage/section-padding.css'
import '@/styles/homepage/mobile.css'
import '@/styles/homepage/overrides.css'

type ContactSearch = { topic: ContactTopic }
const DEFAULT_SEARCH: ContactSearch = { topic: DEFAULT_TOPIC }

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  // `?topic=` is the same key the dialog uses, so every "Talk to us" link's
  // no-JS fallback lands on a page that already knows what it's about.
  validateSearch: (search: Record<string, unknown>): ContactSearch => ({
    topic: parseTopic(search.topic),
  }),
  search: { middlewares: [stripSearchParams(DEFAULT_SEARCH)] },
  head: () =>
    buildSeo({
      title: 'Talk to us · Quidkey',
      description:
        'Ask about Pay by Bank, FX savings on cross-border sales, or high-volume pricing. Send a message or book a call, and a person replies within one business day.',
      keywords: ['contact Quidkey', 'Quidkey sales', 'Pay by Bank enquiry'],
      path: '/contact',
    }),
})

function ContactPage() {
  const { topic } = Route.useSearch()

  // One page-view event, fanned out to GA + Clarity + Snitcher via track().
  // Ref-guarded so React's dev StrictMode double-mount doesn't emit it twice.
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    track({ name: 'contact_view', topic })
  }, [topic])

  const trackBook = () =>
    track({ name: 'homepage_cta_click', location: 'contact', label: 'demo', audience: 'merchants' })

  const isGeneral = topic === DEFAULT_TOPIC

  // AudienceProvider is required because HomepageNav reads useAudience().
  return (
    <AudienceProvider>
      <div className="hp">
        <HomepageNav />
        <main id="main">
          <section className="cpage">
            <div className="container cpage__inner">
              <div>
                <h1 className="cpage__h">Talk to us.</h1>
                <p className="cpage__sub">
                  Selling across borders, weighing up Pay by Bank, or working out what your fees
                  could look like. Tell us where you are and a person replies within one business
                  day.
                </p>
                <ul className="cpage__ways">
                  <li className="cpage__way">
                    <span className="cpage__way-l">Prefer to talk</span>
                    <a
                      href={DEMO_BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={trackBook}
                    >
                      Book a 30-minute call
                    </a>
                  </li>
                  <li className="cpage__way">
                    <span className="cpage__way-l">Email</span>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </li>
                  <li className="cpage__way">
                    <span className="cpage__way-l">Partnerships</span>
                    <a href={`mailto:${PARTNERS_EMAIL}`}>{PARTNERS_EMAIL}</a>
                  </li>
                </ul>
              </div>
              <div className="cpage__card">
                <ContactForm
                  key={topic}
                  topic={topic}
                  source="page"
                  heading={isGeneral ? 'Send us a message.' : undefined}
                  intro={isGeneral ? null : undefined}
                />
              </div>
            </div>
          </section>
        </main>
        <HomepageFooter />
      </div>
    </AudienceProvider>
  )
}
