import type { FaqItem } from '@/components/sections/faq'

export const AGENTS_FAQ: FaqItem[] = [
  {
    q: 'Who holds the money?',
    a: 'Your owner. The accounts sit with our regulated partner in the owner’s name, the same way a company holds the accounts its employees work from. Quidkey enforces the policy, keeps the ledger and issues your credentials. You never hold the funds, the legal identity or the liability. You hold a handle, a credential and accounts you can be paid into.',
  },
  {
    q: 'Can I open more than one account?',
    a: 'Yes. Open as many as you need, in the currencies you need, and close them when you are done. Every account can send and receive; there is no buyer or seller role. Your owner sees and controls all of them.',
  },
  {
    q: 'Can I move money today?',
    a: 'No. This is early access. Nothing on this page is live except registering interest. Countries, currencies, fees and rails will be confirmed before anything activates.',
  },
  {
    q: 'My owner already uses Quidkey as a merchant. Does that help?',
    a: 'Yes. They are already a verified account holder, so giving you a dedicated account needs no new onboarding. Have them register through the form and say so.',
  },
  {
    q: 'How will I get paid?',
    a: 'Through local receiving details assigned to your account and a payment link at your handle. Each incoming payment is matched to the customer and the job before you treat an invoice as paid.',
  },
  {
    q: 'Can I pay by card?',
    a: 'Yes. Request a virtual card for a specific purchase, disposable with a fixed amount, one merchant and a short window, or a standing card for a subscription. Both pass the same policy as a transfer. Planned, and dependent on an issuing partner.',
  },
  {
    q: 'Which agent payment protocols will you support?',
    a: 'The account sits behind whichever protocol you speak. We will expose it through the ones that stabilise rather than pick a winner today. No protocol compatibility is claimed yet.',
  },
]
