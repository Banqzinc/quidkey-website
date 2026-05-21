const CARDS = [
  {
    num: '01',
    title: 'Shopify access',
    desc: 'Offer your merchants a white-labeled Shopify payment app for Pay by Bank at checkout.',
    tags: ['Shopify', 'Checkout app', 'White-label'],
  },
  {
    num: '02',
    title: 'Settlement & refund accounts',
    desc: 'Give merchants access to local collection, settlement, and refund accounts in the US, UK, EU, and AU.',
    tags: ['USD', 'GBP', 'EUR', 'AUD'],
  },
  {
    num: '03',
    title: 'Extended Pay by Bank coverage',
    desc: 'Use your own rails where you have coverage. Use Quidkey, white-labeled, in the markets you do not support yet.',
    tags: ['Coverage', 'White-label', 'Failover'],
  },
  {
    num: '04',
    title: 'US Pay by Bank for non-US merchants',
    desc: 'Help eligible non-US merchants collect from US customers with Pay by Bank and local US accounts. No US legal entity or US UBOs required.',
    tags: ['US', 'No US entity', 'No US UBO'],
  },
  {
    num: '05',
    title: 'Partner API or zero-integration portal',
    desc: 'Use our Partner API to keep the full flow inside your product, or start with a white-labeled portal that requires no integration.',
    tags: ['API', 'Portal', 'Webhooks'],
  },
  {
    num: '06',
    title: 'Audit-ready ledger',
    desc: 'Event log, reconciliation, and webhook stream for every move the console makes. Wire into your accounting, dispute, or risk stack.',
    tags: ['Event log', 'Recon', 'Webhooks'],
  },
]

export function PartnerCapabilities() {
  return (
    <section className="feat" id="capabilities">
      <div className="container">
        <div className="feat__head">
          <div>
            <span className="eyebrow">
              <span className="eyebrow__dot" /> PARTNER OFFERING
            </span>
            <h2 className="feat__title">Pick what your stack is missing.</h2>
          </div>
          <p className="feat__sub">
            Six building blocks. Take one or all six, white-labeled under your brand.
          </p>
        </div>

        <div className="feat__grid">
          {CARDS.map((card) => (
            <article key={card.num} className="feat__card">
              <span className="feat__card-num">{card.num}</span>
              <h3 className="feat__card-title">{card.title}</h3>
              <p className="feat__card-desc">{card.desc}</p>
              <ul className="feat__card-tags">
                {card.tags.map((tag) => (
                  <li key={tag} className="feat__card-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
