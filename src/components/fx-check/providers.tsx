import { track } from '@/lib/track'
import { buildMailto, FX_CHECK_URL } from '@/lib/urls'

// One panel, three columns, split by rules rather than three identical cards:
// Stripe is the only one you can connect yourself, so it gets the solid button.
// Shopify is a payout account change the merchant makes with us, and bank or
// other-provider flows start with a conversation.

type Provider = {
  name: string
  lead: string
  body: string
  cta: { label: string; href: string; solid: boolean; target: 'connect_stripe' | 'talk_to_us' }
}

const PROVIDERS: Provider[] = [
  {
    name: 'Stripe',
    lead: 'Connect in two minutes.',
    body: 'Connect your Stripe account. We only read your last 90 days and show you exactly what you’d save. We never change anything. Keep it or disconnect on the spot.',
    cta: { label: 'Connect Stripe', href: FX_CHECK_URL, solid: true, target: 'connect_stripe' },
  },
  {
    name: 'Shopify',
    lead: 'One small change in Shopify.',
    body: 'You add Quidkey’s local account to Shopify for your payouts and we handle the conversion. Tell us roughly what you sell abroad each month and we’ll work out your saving first.',
    cta: {
      label: 'Talk to us',
      href: buildMailto('FX savings for my Shopify store'),
      solid: false,
      target: 'talk_to_us',
    },
  },
  {
    name: 'Your bank or another provider',
    lead: 'We’ll usually save you more.',
    body: 'Receiving or paying through your bank, or moving money between countries? Banks tend to charge more to convert, so the saving is usually bigger. Tell us what you move each month and we’ll show you what you’d save.',
    cta: {
      label: 'Talk to us',
      href: buildMailto('FX savings for my business'),
      solid: false,
      target: 'talk_to_us',
    },
  },
]

export function FxCheckProviders() {
  return (
    <section className="section fxc-prov">
      <div className="container">
        <h2 className="section__h">Works with what you already use.</h2>
        <p className="section__sub">
          You keep your own Stripe or Shopify account, your setup and your integrations. Quidkey
          only handles the conversion. Stripe connects in minutes. For Shopify, your bank and
          everything else, talk to us and we’ll set it up with you.
        </p>
        <div className="fxc-prov__panel" role="list">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="fxc-prov__col" role="listitem">
              <h3 className="fxc-prov__name">{p.name}</h3>
              <p className="fxc-prov__lead">{p.lead}</p>
              <p className="fxc-prov__body">{p.body}</p>
              <a
                href={p.cta.href}
                className={`btn btn--lg ${p.cta.solid ? 'btn--ink' : 'btn--ghost'} fxc-prov__cta`}
                onClick={() =>
                  track({ name: 'fx_check_cta_click', location: 'providers', target: p.cta.target })
                }
              >
                {p.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
