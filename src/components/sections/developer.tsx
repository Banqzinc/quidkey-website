// Developer / Integrations section. Maps to Developer + FintechDeveloper at
// app.jsx:3790-3989. Audience-aware:
//   merchants -> 6 integration cards (Shopify, Payment Link, iFrame, Hosted,
//                iOS, Android) with a dynamic preview panel
//   fintechs  -> simpler 2-tab API code editor

import { useEffect, useState, type ReactNode } from 'react'

import { CodePreview, type CodeTab } from '@/components/homepage/code-preview'
import { IntegrationIcon } from '@/components/homepage/integration-icon'
import { PaymentLinkMock } from '@/components/homepage/payment-link-mock'
import { ShopifyInstallMock } from '@/components/homepage/shopify-install-mock'
import { useAudience } from '@/context/audience'
import { track } from '@/lib/track'
import { DOCS_URL } from '@/lib/urls'

const STATUS_URL = 'https://status.quidkey.com'

type Preview =
  | { kind: 'shopify' }
  | { kind: 'paylink' }
  | { kind: 'code'; tab: CodeTab }
  | { kind: 'multi-code'; tabs: CodeTab[] }

type IntegrationOption = {
  id: 'shopify' | 'paylink' | 'iframe' | 'hosted' | 'ios' | 'android'
  label: string
  sub: string
  desc: string
  minutes: string
  skill: string
  learnMore: string
  learnHref: string
  preview: Preview
}

const MERCHANT_INTEGRATIONS: IntegrationOption[] = [
  {
    id: 'shopify',
    label: 'Shopify',
    sub: 'One-click install',
    desc: 'Install from the Shopify App Store. No code, no theme edits.',
    minutes: '~3 min',
    skill: 'No code',
    learnMore: 'Shopify install',
    learnHref: 'https://quidkey.dev/shopify',
    preview: { kind: 'shopify' },
  },
  {
    id: 'paylink',
    label: 'Payment Link',
    sub: 'Zero integration · send a link',
    desc: 'Generate a link in the console. Send it over WhatsApp, email or SMS.',
    minutes: '~30 sec',
    skill: 'No code',
    learnMore: 'Payment Links',
    learnHref: 'https://quidkey.dev/payment-links',
    preview: { kind: 'paylink' },
  },
  {
    id: 'iframe',
    label: 'iFrame',
    sub: 'Web SDK · embed in your checkout',
    desc: 'Three lines of JavaScript. Drops into React, Vue or plain HTML.',
    minutes: '~30 min',
    skill: 'Frontend dev',
    learnMore: 'the Web SDK',
    learnHref: 'https://quidkey.dev/web-sdk',
    preview: {
      kind: 'multi-code',
      tabs: [
        {
          name: 'index.html',
          lang: 'html',
          code: `<!-- 1. Add the script -->
<script src="https://cdn.quidkey.com/v2/checkout.js"></script>

<!-- 2. Add a mount point -->
<div id="checkout"></div>

<!-- 3. Mount Quidkey -->
<script>
  Quidkey.mount('#checkout', {
    amount:   14900,
    currency: 'USD',
    onPaid:   (evt) => location = '/thanks/' + evt.id,
  });
</script>`,
        },
        {
          name: 'react.tsx',
          lang: 'tsx',
          code: `import { QuidkeyCheckout } from '@quidkey/react';

export default function Checkout({ cart }) {
  return (
    <QuidkeyCheckout
      amount={cart.totalCents}
      currency={cart.currency}
      onPaid={(evt) => router.push(\`/thanks/\${evt.id}\`)}
    />
  );
}`,
        },
      ],
    },
  },
  {
    id: 'hosted',
    label: 'Hosted Checkout',
    sub: 'Redirect · Completely managed',
    desc: 'Server-side redirect. Zero PCI scope, zero frontend work.',
    minutes: '~15 min',
    skill: 'Backend dev',
    learnMore: 'Hosted Checkout',
    learnHref: 'https://quidkey.dev/hosted',
    preview: {
      kind: 'multi-code',
      tabs: [
        {
          name: 'server.js',
          lang: 'js',
          code: `import { Quidkey } from '@quidkey/node';

// Create a checkout session, redirect the customer.
app.post('/checkout', async (req, res) => {
  const session = await Quidkey.checkout.create({
    amount:    req.body.totalCents,
    currency:  'USD',
    success_url: 'https://shop.com/thanks',
    cancel_url:  'https://shop.com/cart',
  });
  res.redirect(303, session.url);
});`,
        },
        {
          name: 'curl',
          lang: 'bash',
          code: `# Same call, with curl.
curl https://api.quidkey.com/v1/checkout/sessions \\
  -u sk_live_••••: \\
  -d amount=14900 \\
  -d currency=USD \\
  -d success_url=https://shop.com/thanks \\
  -d cancel_url=https://shop.com/cart

# → 201 Created
# {
#   "id":  "cs_8af2",
#   "url": "https://pay.quidkey.com/c/cs_8af2"
# }`,
        },
      ],
    },
  },
  {
    id: 'ios',
    label: 'iOS',
    sub: 'Native SDK · Swift',
    desc: 'Universal links into the banking app. Biometric consent, back to yours.',
    minutes: '~1 hour',
    skill: 'iOS dev',
    learnMore: 'the iOS SDK',
    learnHref: 'https://quidkey.dev/ios',
    preview: {
      kind: 'code',
      tab: {
        name: 'CheckoutView.swift',
        lang: 'swift',
        code: `import QuidkeyCheckout

struct CheckoutView: View {
  let amountCents: Int

  var body: some View {
    QuidkeyButton(
      amount:   amountCents,
      currency: "USD"
    ) { result in
      switch result {
      case .paid(let evt):     router.path = .thanks(evt.id)
      case .cancelled:         break
      case .failed(let error): toast.show(error)
      }
    }
  }
}`,
      },
    },
  },
  {
    id: 'android',
    label: 'Android',
    sub: 'Native SDK · Kotlin',
    desc: 'Single composable. App Links route through the banking app and back.',
    minutes: '~1 hour',
    skill: 'Android dev',
    learnMore: 'the Android SDK',
    learnHref: 'https://quidkey.dev/android',
    preview: {
      kind: 'code',
      tab: {
        name: 'CheckoutScreen.kt',
        lang: 'kotlin',
        code: `import com.quidkey.checkout.QuidkeyButton

@Composable
fun CheckoutScreen(amountCents: Int) {
  QuidkeyButton(
    amount   = amountCents,
    currency = "USD",
  ) { result ->
    when (result) {
      is Paid      -> nav.navigate("thanks/\${result.id}")
      is Cancelled -> Unit
      is Failed    -> toast(result.error)
    }
  }
}`,
      },
    },
  },
]

type FintechCopy = {
  h: ReactNode
  links: string[]
  tabs: Array<{ id: string; name: string; code: string }>
}

const FINTECH_COPY: FintechCopy = {
  h: 'One API. Onboard a merchant in 24 hours.',
  links: ['Partner API reference', 'Webhook reference', 'White-label guide', 'Sandbox keys'],
  tabs: [
    {
      id: 'create',
      name: 'partners/merchants.create',
      code: `// Onboard a merchant from your partner backend
import { Quidkey } from '@quidkey/partners';

const merchant = await Quidkey.merchants.create({
  partner: 'northwest_pay',
  business: { name: 'Cobalt Coffee', country: 'US' },
  contact:  { email: 'ops@cobalt.coffee' },
  accounts: ['USD', 'EUR'],
  workflows: ['split.tax.us', 'payout.daily'],
});`,
    },
    {
      id: 'webhook',
      name: 'merchant.live.json',
      code: `{
  "id": "evt_82a1_mch_8af2",
  "type": "merchant.live",
  "partner": "northwest_pay",
  "created": "2026-04-24T09:14:25.402Z",
  "data": {
    "merchant_id": "mch_8af2",
    "business":   { "name": "Cobalt Coffee", "country": "US" },
    "accounts":   [
      { "id": "acc_a1", "currency": "USD", "iban": null,
        "routing": "•• 4421" },
      { "id": "acc_a2", "currency": "EUR",
        "iban": "DE89•• 7890" }
    ],
    "workflows":  ["split.tax.us", "payout.daily"]
  }
}`,
    },
  ],
}

const MERCHANT_HEADING: ReactNode = (
  <>
    Six ways to ship Pay by Bank.
    <br />
    <span className="grad-text">Pick yours.</span>
  </>
)

function DeveloperLink({ label }: { label: string }) {
  const isDocs = label === 'Read the docs'
  const isStatus = label.startsWith('API status')
  const href = isDocs ? DOCS_URL : isStatus ? STATUS_URL : '#'
  const external = isDocs || isStatus
  const onClick = external
    ? () => track({ name: 'homepage_outbound_click', href, label: `developer_${isDocs ? 'docs' : 'status'}` })
    : undefined

  if (isDocs) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--ink intg__doc-cta"
        onClick={onClick}
      >
        {label}
      </a>
    )
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="dev__link"
      onClick={onClick}
    >
      <span>{label}</span>
    </a>
  )
}

function PreviewFor({ preview }: { preview: Preview }) {
  if (preview.kind === 'paylink') return <PaymentLinkMock />
  if (preview.kind === 'shopify') return <ShopifyInstallMock />
  if (preview.kind === 'code') return <CodePreview single={preview.tab} />
  return <CodePreview tabs={preview.tabs} />
}

function MerchantDeveloper() {
  const [activeId, setActiveId] = useState<IntegrationOption['id']>('shopify')
  const active = MERCHANT_INTEGRATIONS.find((o) => o.id === activeId) ?? MERCHANT_INTEGRATIONS[0]

  // ?int= deep-link support — only run on the client. Read once on mount.
  useEffect(() => {
    try {
      const q = new URL(window.location.href).searchParams.get('int')
      if (q && MERCHANT_INTEGRATIONS.some((o) => o.id === q)) {
        setActiveId(q as IntegrationOption['id'])
      }
    } catch {
      // ignore
    }
  }, [])

  const pickIntegration = (id: IntegrationOption['id']) => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 899px)').matches
    const next = isMobile && activeId === id ? null : id
    if (next) setActiveId(next)
    try {
      const url = new URL(window.location.href)
      if (next) {
        url.searchParams.set('int', next)
      } else {
        url.searchParams.delete('int')
      }
      window.history.replaceState({}, '', url.toString())
    } catch {
      // ignore
    }
  }

  return (
    <section id="integrations" className="section section--dev-fit">
      <div className="container">
        <div className="intg__head">
          <div className="section__eyebrow">
            <span className="section__eyebrow-dot" />
            Integrations
          </div>
          <h2 className="section__h">{MERCHANT_HEADING}</h2>
        </div>

        <div className="intg__grid">
          <div className="intg__list" role="tablist" aria-label="Integration options">
            {MERCHANT_INTEGRATIONS.map((o) => (
              <div key={o.id}>
                <button
                  type="button"
                  role="tab"
                  data-int={o.id}
                  aria-selected={activeId === o.id}
                  aria-expanded={activeId === o.id}
                  className={`intg__opt ${activeId === o.id ? 'intg__opt--on' : ''}`}
                  onClick={() => pickIntegration(o.id)}
                >
                  <span className="intg__opt-icon">
                    <IntegrationIcon id={o.id} />
                  </span>
                  <span className="intg__opt-body">
                    <span className="intg__opt-row">
                      <span className="intg__opt-label">{o.label}</span>
                    </span>
                    <span className="intg__opt-sub">{o.sub}</span>
                  </span>
                  <span className="intg__opt-chev" aria-hidden="true">
                    <svg
                      viewBox="0 0 12 8"
                      width="11"
                      height="7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 1l5 5 5-5" />
                    </svg>
                  </span>
                </button>
                {activeId === o.id && (
                  <div className="intg__panel intg__panel--mobile">
                    <div className="intg__panel-card">
                      <div className="intg__panel-head">
                        <div className="intg__panel-head-l">
                          <h3 className="intg__panel-h">{active.label}</h3>
                          <p className="intg__panel-desc">{active.desc}</p>
                        </div>
                        <div className="intg__panel-meta">
                          <span className="intg__chip">
                            <span className="intg__chip-k">Time</span>
                            <strong>{active.minutes}</strong>
                          </span>
                          <span className="intg__chip">
                            <span className="intg__chip-k">Skill</span>
                            <strong>{active.skill}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="intg__panel-preview">
                        <PreviewFor preview={active.preview} />
                      </div>
                      <div className="intg__panel-foot">
                        <a
                          className="intg__learn"
                          href={active.learnHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            track({
                              name: 'homepage_outbound_click',
                              href: active.learnHref,
                              label: `developer_learn_${active.id}`,
                            })
                          }
                        >
                          Learn more about {active.learnMore}
                          <svg
                            className="intg__learn-arrow"
                            viewBox="0 0 16 16"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="dev__links intg__doclinks">
              <DeveloperLink label="Read the docs" />
            </div>
          </div>

          <div className="intg__panel intg__panel--desktop" key={activeId}>
            <div className="intg__panel-card">
              <div className="intg__panel-head">
                <div className="intg__panel-head-l">
                  <h3 className="intg__panel-h">{active.label}</h3>
                  <p className="intg__panel-desc">{active.desc}</p>
                </div>
                <div className="intg__panel-meta">
                  <span className="intg__chip">
                    <span className="intg__chip-k">Time</span>
                    <strong>{active.minutes}</strong>
                  </span>
                  <span className="intg__chip">
                    <span className="intg__chip-k">Skill</span>
                    <strong>{active.skill}</strong>
                  </span>
                </div>
              </div>
              <div className="intg__panel-preview">
                <PreviewFor preview={active.preview} />
              </div>
              <div className="intg__panel-foot">
                <a
                  className="intg__learn"
                  href={active.learnHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track({
                      name: 'homepage_outbound_click',
                      href: active.learnHref,
                      label: `developer_learn_${active.id}`,
                    })
                  }
                >
                  Learn more about {active.learnMore}
                  <svg
                    className="intg__learn-arrow"
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FintechDeveloper() {
  const [tabId, setTabId] = useState(FINTECH_COPY.tabs[0].id)
  const tab = FINTECH_COPY.tabs.find((t) => t.id === tabId) ?? FINTECH_COPY.tabs[0]

  return (
    <section id="integrations" className="section">
      <div className="container dev__grid">
        <div>
          <div className="section__eyebrow">
            <span className="section__eyebrow-dot" />
            Integrations
          </div>
          <h2 className="section__h">{FINTECH_COPY.h}</h2>
          <div className="dev__links">
            {FINTECH_COPY.links.map((l) => (
              <DeveloperLink key={l} label={l} />
            ))}
          </div>
        </div>
        <div className="dev__editor">
          <div className="dev__tabs">
            {FINTECH_COPY.tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`dev__tab ${tabId === t.id ? 'is-on' : ''}`}
                onClick={() => setTabId(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>
          <pre className="dev__code">
            <code>{tab.code}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

export function Developer() {
  const { audience } = useAudience()
  return audience === 'fintechs' ? <FintechDeveloper /> : <MerchantDeveloper />
}
