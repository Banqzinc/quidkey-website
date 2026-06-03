// Per-region content for the merchant hero demo (merchant-hero-viz.tsx).
//
// Everything locale-dependent — the bank list, the "predicted" bank, currency
// formatting, the bank-app accounts, and the receipt identity — lives here so
// the demo component stays presentational and adding a new market (UK, EU…) is
// just another entry in DEMO_LOCALES.
//
// NOTE: the AU figures (price/save), the PayID, and the customer identity are
// placeholders pending real values from the team. Bank logos resolve via
// logo.dev by domain; the components hide any logo that fails to load.

import type { DemoRegion } from '@/lib/demo-region'

export const LOGO_DEV_TOKEN = 'pk_DsNHFndhT3yo-85c5vdKKg'

export function bankLogoUrl(domain: string): string {
  return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`
}

export type Bank = {
  name: string
  // Domain logo.dev resolves the mark from.
  domain: string
  // Brand color used as the splash / login / bank-app accent background.
  brandColor: string
}

export type BankAccount = {
  id: string
  name: string
  sub: string
  bal: string
}

export type DemoLocale = {
  region: DemoRegion
  // banks[0] is the "predicted" bank shown as the top, pre-selected option.
  banks: Bank[]
  currencyCode: string
  // Pre-formatted so the demo never has to do currency math.
  price: string
  save: string
  // How the bank-app screen authorises payment. Exactly one is set:
  //  - accounts: a "Pay from" account picker (US-style).
  //  - payId: a single PayID confirmation card, no account selection (AU/Osko).
  accounts?: BankAccount[]
  payId?: string
  // Identity shown on the success receipt.
  customer: { name: string; postcode: string; email: string }
}

const US: DemoLocale = {
  region: 'US',
  banks: [
    { name: 'Chase', domain: 'chase.com', brandColor: '#0A2A66' },
    { name: 'Bank of America', domain: 'bankofamerica.com', brandColor: '#9C1B2E' },
    { name: 'Wells Fargo', domain: 'wellsfargo.com', brandColor: '#A8181E' },
    { name: 'Citi', domain: 'citi.com', brandColor: '#003A6E' },
    { name: 'Capital One', domain: 'capitalone.com', brandColor: '#0E3A5F' },
    { name: 'U.S. Bank', domain: 'usbank.com', brandColor: '#0E2A66' },
  ],
  currencyCode: 'USD',
  price: '$149.00',
  save: '$4.32',
  accounts: [
    { id: 'current', name: 'Current Account', sub: '••3082', bal: '$8,412.59' },
    { id: 'savings', name: 'Savings', sub: '••7714', bal: '$24,930.10' },
    { id: 'checking', name: 'Everyday Checking', sub: '••0461', bal: '$1,206.84' },
  ],
  customer: { name: 'Alex Marchetti', postcode: '02118', email: 'alex@…' },
}

const AU: DemoLocale = {
  region: 'AU',
  banks: [
    { name: 'CommBank', domain: 'commbank.com.au', brandColor: '#000000' },
    { name: 'ANZ', domain: 'anz.com.au', brandColor: '#004165' },
    { name: 'NAB', domain: 'nab.com.au', brandColor: '#C8102E' },
    { name: 'Westpac', domain: 'westpac.com.au', brandColor: '#DA1710' },
    { name: 'ING', domain: 'ing.com.au', brandColor: '#FF6200' },
    { name: 'Macquarie', domain: 'macquarie.com.au', brandColor: '#1A1A1A' },
  ],
  currencyCode: 'AUD',
  price: 'A$229.00',
  save: 'A$6.65',
  // AU authorises via PayID (Osko) — a single confirmation, no account picker.
  // The value is the merchant's PayID the payment resolves to.
  payId: 'pay@northgate-goods.com.au',
  customer: { name: 'Mia Nguyen', postcode: '2000', email: 'mia@…' },
}

export const DEMO_LOCALES: Record<DemoRegion, DemoLocale> = { US, AU }
