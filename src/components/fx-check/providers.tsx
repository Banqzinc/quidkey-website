import type { ReactElement } from 'react'

import { useContactLink } from '@/context/contact'
import { track } from '@/lib/track'

// Same badge treatment as the homepage "Why Quidkey" grid (icon, short title,
// one line), so the page reads as part of the site. No per-item CTAs: the hero
// and the closer already carry Connect Stripe and Talk to us.
//
// All four marks are solid ink, matching the black Shopify bag the homepage
// uses. Stripe and Shopify are their real marks (paths from Simple Icons,
// CC0); the bank and the in/out arrows are drawn to the same weight.

const StripeMark = (
  <svg viewBox="0 0 24 24" className="fxc-prov__mark" aria-hidden="true">
    <rect width="24" height="24" rx="5.5" fill="currentColor" />
    <path
      fill="#fff"
      transform="translate(4.7 4.8) scale(0.6)"
      d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"
    />
  </svg>
)

const ShopifyMark = (
  <svg viewBox="0 0 24 24" className="fxc-prov__mark" aria-hidden="true">
    <path fill="currentColor" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" />
  </svg>
)

const BankMark = (
  <svg viewBox="0 0 24 24" className="fxc-prov__mark" aria-hidden="true" fill="currentColor">
    <path d="M12 1.5 2.5 6.75V9h19V6.75L12 1.5z" />
    <path d="M4 10.5h3v7H4zM10.5 10.5h3v7h-3zM17 10.5h3v7h-3z" />
    <path d="M2.5 19h19v3.5h-19z" />
  </svg>
)

const InOutMark = (
  <svg
    viewBox="0 0 24 24"
    className="fxc-prov__mark"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 7.5h15.5M15 3.5l4 4-4 4" />
    <path d="M20.5 16.5H5M9 12.5l-4 4 4 4" />
  </svg>
)

type Provider = {
  icon: ReactElement
  title: string
  body: string
}

const PROVIDERS: Provider[] = [
  {
    icon: StripeMark,
    title: 'Stripe',
    body: 'Connects in two minutes and shows your exact saving.',
  },
  {
    icon: ShopifyMark,
    title: 'Shopify',
    body: 'One change to your payout account. Nothing else moves.',
  },
  {
    icon: BankMark,
    title: 'Banks and other providers',
    body: 'They charge more to convert, so your saving is usually bigger.',
  },
  {
    icon: InOutMark,
    title: 'Incoming and outgoing',
    body: 'You save on money you receive and on money you send.',
  },
]

export function FxCheckProviders() {
  const talk = useContactLink('fx_provider', 'fx_providers')

  return (
    <section className="section fxc-prov">
      <div className="container">
        <h2 className="section__h">Works with what you already use.</h2>
        <p className="section__sub">
          You keep your own accounts, setup and integrations. Quidkey only handles the conversion.
          Stripe connects in minutes. For everything else,{' '}
          <a
            href={talk.href}
            className="fxc-prov__talk"
            onClick={(event) => {
              track({ name: 'fx_check_cta_click', location: 'providers', target: 'talk_to_us' })
              talk.onClick(event)
            }}
          >
            talk to us
          </a>{' '}
          and we’ll set it up with you.
        </p>
        <div className="why__grid why__grid--three why__grid--four fxc-prov__grid" role="list">
          {PROVIDERS.map((p) => (
            <div key={p.title} className="why__cardx" role="listitem">
              <span className="why__cardx-icon" aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="why__cardx-t">{p.title}</h3>
              <p className="why__cardx-b">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
