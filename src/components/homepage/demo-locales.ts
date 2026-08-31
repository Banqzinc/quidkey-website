// Per-region content for the merchant hero demo (merchant-hero-viz.tsx).
//
// Everything market-dependent — the bank list, the "predicted" bank, currency
// formatting, the bank-app accounts, how the payment is authorised, and the
// shopper identity — lives here so the screens stay presentational and adding a
// market is just another entry in DEMO_LOCALES.
//
// Who you're buying FROM is not in here: see demo-merchant.ts. The flow shape
// per market (which Quidkey-hosted steps appear) is in demo-flows.ts.
//
// NOTE: the prices, saves, phone numbers and shopper identities are
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

// How the bank app authorises the payment:
//  - 'payto'    AU. A standing PayTo agreement is reviewed and approved; there
//               is no account picker because the agreement names the account.
//  - 'accounts' US / UK / EU. A "Pay from" picker over connected accounts.
export type AuthoriseMode = 'payto' | 'accounts'

export type DemoLocale = {
  region: DemoRegion
  // banks[0] is the "predicted" bank shown as the top, pre-selected option.
  banks: Bank[]
  currencyCode: string
  // Pre-formatted so the demo never has to do currency math.
  price: string
  save: string
  authorise: AuthoriseMode
  // Required when authorise === 'accounts'; absent for 'payto'.
  accounts?: BankAccount[]
  // Pre-filled mobile on the Quidkey-hosted verify screens, in local format.
  phone: string
  // Identity shown on the success receipt.
  customer: { name: string; postcode: string; email: string }
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
  // AU runs on PayTo: the shopper approves a standing agreement in their bank,
  // so there is no account picker.
  authorise: 'payto',
  phone: '0423 771 620',
  customer: { name: 'Mia Nguyen', postcode: '2000', email: 'mia@…' },
}

const UK: DemoLocale = {
  region: 'UK',
  banks: [
    { name: 'Monzo', domain: 'monzo.com', brandColor: '#14233C' },
    { name: 'Barclays', domain: 'barclays.co.uk', brandColor: '#00395D' },
    { name: 'HSBC', domain: 'hsbc.co.uk', brandColor: '#DB0011' },
    { name: 'Lloyds Bank', domain: 'lloydsbank.com', brandColor: '#024731' },
    { name: 'NatWest', domain: 'natwest.com', brandColor: '#42145F' },
    { name: 'Santander', domain: 'santander.co.uk', brandColor: '#CC0000' },
  ],
  currencyCode: 'GBP',
  price: '£129.00',
  save: '£3.74',
  authorise: 'accounts',
  accounts: [
    { id: 'current', name: 'Current Account', sub: '••4417', bal: '£6,208.44' },
    { id: 'savings', name: 'Instant Saver', sub: '••9032', bal: '£18,740.15' },
    { id: 'joint', name: 'Joint Account', sub: '••2865', bal: '£980.27' },
  ],
  phone: '07700 900620',
  customer: { name: 'Olivia Hartley', postcode: 'E1 6AN', email: 'olivia@…' },
}

const EU: DemoLocale = {
  region: 'EU',
  banks: [
    { name: 'Deutsche Bank', domain: 'db.com', brandColor: '#001489' },
    { name: 'Sparkasse', domain: 'sparkasse.de', brandColor: '#C00000' },
    { name: 'Commerzbank', domain: 'commerzbank.de', brandColor: '#00223A' },
    { name: 'DKB', domain: 'dkb.de', brandColor: '#00427A' },
    { name: 'ING', domain: 'ing.de', brandColor: '#D65200' },
    { name: 'N26', domain: 'n26.com', brandColor: '#1F6F60' },
  ],
  currencyCode: 'EUR',
  price: '€139.00',
  save: '€4.03',
  authorise: 'accounts',
  accounts: [
    { id: 'giro', name: 'Girokonto', sub: '••7741', bal: '€7,315.90' },
    { id: 'tagesgeld', name: 'Tagesgeld', sub: '••1180', bal: '€21,460.00' },
    { id: 'gemeinschaft', name: 'Gemeinschaftskonto', sub: '••3369', bal: '€1,104.62' },
  ],
  phone: '+49 151 5550620',
  customer: { name: 'Jonas Brandt', postcode: '10115', email: 'jonas@…' },
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
  authorise: 'accounts',
  accounts: [
    { id: 'current', name: 'Current Account', sub: '••3082', bal: '$8,412.59' },
    { id: 'savings', name: 'Savings', sub: '••7714', bal: '$24,930.10' },
    { id: 'checking', name: 'Everyday Checking', sub: '••0461', bal: '$1,206.84' },
  ],
  phone: '(415) 555-0620',
  customer: { name: 'Alex Marchetti', postcode: '02118', email: 'alex@…' },
}

export const DEMO_LOCALES: Record<DemoRegion, DemoLocale> = { AU, UK, EU, US }
