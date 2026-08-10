import type { FaqItem } from '@/components/sections/faq'

// Every answer stays within what the fx-check code actually enforces:
// read-only OAuth scope, immediate release on disconnect, 48h auto-disconnect,
// 90-day estimate window, no account required. Keep this file in step with
// the console consent copy (stripe-connect-consent.tsx in the monorepo).
export const FX_CHECK_FAQS: FaqItem[] = [
  {
    q: 'Is the connection really read-only?',
    a: 'Yes. Quidkey requests a read-only grant, enforced by Stripe itself. Quidkey cannot process payments, touch payouts, or change your checkout — your Stripe account keeps working exactly as it does today.',
  },
  {
    q: 'What does Quidkey keep about me?',
    a: 'Nothing, unless you sign up. If you disconnect — or simply do nothing — Quidkey removes its access and keeps nothing about you or your business.',
  },
  {
    q: 'What does the check cost?',
    a: 'Nothing. The check is free and you don’t need a Quidkey account to run it.',
  },
  {
    q: 'How is the estimate calculated?',
    a: 'From your last 90 days of Stripe activity: what you paid in currency-conversion fees versus what the same volume would cost at Quidkey’s typical pricing. It’s an estimate, not a quote — your final rate is agreed when you sign up.',
  },
  {
    q: 'How do I disconnect?',
    a: 'One click on the results page, or any time from your Stripe dashboard under authorised applications. If you do nothing, Quidkey disconnects automatically within 48 hours.',
  },
  {
    q: 'Does Quidkey see my Stripe login?',
    a: 'No. You approve the connection on Stripe’s own page — your Stripe credentials never touch Quidkey.',
  },
]
