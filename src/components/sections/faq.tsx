import { useState } from 'react'

import { track } from '@/lib/track'

type FaqItem = { q: string; a: string }

const FAQS: FaqItem[] = [
  {
    q: 'What is Pay by Bank?',
    a: 'Pay by Bank lets customers pay you directly from their bank account, no card in the middle. They pick their bank at checkout, approve in their banking app with biometrics, and funds move on instant rails (FedNow, RTP, FPS, SEPA Instant) in seconds.',
  },
  { q: 'Do I need to replace card payments?', a: 'No. Quidkey works alongside your existing payment methods.' },
  {
    q: 'Is it difficult to set up?',
    a: 'No. If you’re on Shopify, it’s an app install. For custom checkouts, it’s a short API integration. Our team helps either way.',
  },
  {
    q: 'Will customers understand how to use it?',
    a: 'Yes. They choose their bank, approve the payment securely, and complete checkout in a clear, simple flow.',
  },
  {
    q: 'Is it secure?',
    a: 'Yes. Payments are authenticated through the customer’s bank. No card numbers are stored or transmitted.',
  },
  {
    q: 'Where is Quidkey available?',
    a: 'We onboard businesses from 100+ countries selling into the US, UK, EU, and Australia. If your customers are in those markets, we can almost certainly support you, wherever your business is incorporated.',
  },
  {
    q: 'Is Quidkey only for large merchants?',
    a: 'No. Quidkey works for growing ecommerce businesses as well as larger merchants.',
  },
]

const PlusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
)

const CloseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

export function Faq() {
  const items = FAQS
  const [open, setOpen] = useState<number>(0)

  const toggle = (index: number) => {
    const closing = open === index
    if (!closing) {
      track({ name: 'homepage_faq_open', question: items[index]?.q ?? '' })
    }
    setOpen(closing ? -1 : index)
  }

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="section__eyebrow">
          <span className="section__eyebrow-dot" />
          FAQ
        </div>
        <h2 className="section__h">Questions, answered.</h2>
        <div className="faq__list">
          {items.map((item, i) => (
            <div key={item.q} className={`faq__item ${open === i ? 'faq__item--open' : ''}`}>
              <button
                type="button"
                className="faq__q"
                aria-expanded={open === i}
                onClick={() => toggle(i)}
              >
                <span>{item.q}</span>
                <span className="faq__q-ico">{open === i ? CloseIcon : PlusIcon}</span>
              </button>
              <div className="faq__a">
                <div className="faq__a-i">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
