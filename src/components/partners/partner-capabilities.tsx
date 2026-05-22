import { Flag, Globe, ShoppingBag, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

type Card = {
  icon: ReactNode
  title: string
  desc: string
}

const CARDS: Card[] = [
  {
    icon: <ShoppingBag size={38} strokeWidth={1.5} aria-hidden="true" />,
    title: 'Shopify access',
    desc: 'Offer your merchants a white-labeled Shopify payment app for Pay by Bank at checkout — a channel Shopify Payments locks others out of.',
  },
  {
    icon: <Wallet size={38} strokeWidth={1.5} aria-hidden="true" />,
    title: 'Settlement & refund accounts',
    desc: 'Give merchants local collection, settlement, and refund accounts in the US, UK, EU, and AU.',
  },
  {
    icon: <Globe size={38} strokeWidth={1.5} aria-hidden="true" />,
    title: 'Extended Pay by Bank coverage',
    desc: 'Use your own rails where you have coverage. Use Quidkey, white-labeled, in the markets you do not support yet.',
  },
  {
    icon: <Flag size={38} strokeWidth={1.5} aria-hidden="true" />,
    title: 'US Pay by Bank for non-US merchants',
    desc: 'Help eligible non-US merchants collect from US customers with Pay by Bank and local US accounts. No US legal entity or US UBOs required.',
  },
]

export function PartnerCapabilities() {
  return (
    <section className="section why" id="capabilities">
      <div className="container">
        <div className="why__head">
          <span className="section__eyebrow why__eyebrow">
            <span className="section__eyebrow-dot" aria-hidden="true" />
            Partner offering
          </span>
          <h2 className="why__h">Pick what your stack is missing.</h2>
          <p className="why__lede">
            Four building blocks. Take one or all four, white-labeled under your brand.
          </p>
        </div>

        <div className="why__grid why__grid--three why__grid--four" role="list">
          {CARDS.map((card) => (
            <div key={card.title} className="why__cardx" role="listitem">
              <span className="why__cardx-icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3 className="why__cardx-t">{card.title}</h3>
              <p className="why__cardx-b">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
