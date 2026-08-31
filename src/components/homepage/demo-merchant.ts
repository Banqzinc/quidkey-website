// The single merchant the hero demo checks out from. One home for what used to
// be a dozen inline "Northgate Goods" string literals scattered through the
// screens — including the PayID, which is merchant identity and used to sit on
// the region pack (where it didn't belong).
//
// The merchant is deliberately region-independent: switching market changes the
// banks, currency, and rails, never who you're buying from.

export type DemoMerchant = {
  name: string
  // Uppercase lockup used as the product-card brand line.
  brand: string
  domain: string
  product: { title: string; meta: string; img: string; alt: string }
  // Payment reference shown inside the bank app.
  reference: string
  // Order number on the merchant's confirmation page.
  orderNo: string
  // AU only — the PayID the PayTo agreement resolves to.
  payId: string
}

export const DEMO_MERCHANT: DemoMerchant = {
  name: 'Northgate Goods',
  brand: 'NORTHGATE GOODS',
  domain: 'northgate-goods.com',
  product: {
    title: 'Court Runner, Blue',
    meta: 'Size 10 · Qty 1 · Free returns',
    img: '/homepage/product-shoe-blue.webp',
    alt: 'Northgate Goods Court Runner sneaker in blue',
  },
  reference: 'QK-NG-8842',
  orderNo: '#NG-44218',
  payId: 'pay@northgate-goods.com.au',
}
