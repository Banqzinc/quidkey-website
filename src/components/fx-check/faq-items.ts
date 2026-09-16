import type { FaqItem } from '@/components/sections/faq'

// Every answer stays within what the fx-check code actually enforces:
// Stripe OAuth grant used only to read, immediate release on disconnect, 48h auto-disconnect,
// 90-day estimate window, no account required. Keep this file in step with
// the console consent copy (stripe-connect-consent.tsx in the monorepo).
export const FX_CHECK_FAQS: FaqItem[] = [
  {
    q: 'Do I have to move from Stripe to Quidkey?',
    a: 'No. You keep your Stripe account, your checkout, your integrations and your Stripe setup, and you keep taking payments exactly as you do now. Quidkey only takes over the currency conversion. The one change is where Stripe pays out your foreign currency: to a Quidkey account in that currency, which we convert and pass on to your bank. Everything else runs as it does today.',
  },
  {
    q: 'Do you only work with Stripe?',
    a: 'No. Stripe is the one you can connect yourself, so we can show you your exact savings in minutes. Shopify works too. You add Quidkey’s local account to Shopify for your payouts and we handle the rest. If you use another provider, or you move money between countries, talk to us and we’ll work out your saving.',
  },
  {
    q: 'How does Quidkey save me money on FX?',
    a: 'Stripe and Shopify convert your international sales at about 2%. With Quidkey you get paid out in your customer’s currency instead and we do the conversion. We work with several FX providers and pick the best rate for your volume. All in, you pay 0.5% less than you do today.',
  },
  {
    q: 'What if I use Shopify?',
    a: 'Shopify charges about 2% to convert too, and we save you 0.5% in the same way. You add Quidkey’s local account to Shopify for your payouts and we handle the conversion. Tell us roughly what you sell abroad each month and we’ll work out your saving first. Shopify only lets stores in some markets get paid in other currencies, so we’ll check yours as well.',
  },
  {
    q: 'Do you only handle money coming in?',
    a: 'No. We convert money going out too: paying suppliers, staff or your own accounts in other countries. Banks tend to charge more than Stripe and Shopify to convert, so this is often where the biggest saving is. Tell us what you move each month and we’ll work it out.',
  },
  {
    q: 'Will I still get paid on time?',
    a: 'Yes. Stripe and Shopify keep paying out on the same schedule as today. The payout lands in a Quidkey account in your customer’s currency, we convert it and send it on to your bank account the same day.',
  },
  {
    q: 'Will my accounting software still reconcile my payouts?',
    a: 'Yes. Your Stripe and Shopify payout reports do not change, so tools like Xero, QuickBooks and A2X keep working as they do today. For every payout we give you a statement with the amount we received, the rate we used and what we sent to your bank, so each deposit matches up.',
  },
  {
    q: 'Does Quidkey change anything in my Stripe account?',
    a: 'No. Stripe’s connection comes with broader access than we need, and we only use it to read your payments and payouts. We never take payments, touch payouts or change your checkout. You approve the connection on Stripe’s own page, so your login never touches Quidkey, and you can see and revoke it any time under authorised applications in your Stripe dashboard.',
  },
  {
    q: 'What does Quidkey keep about me?',
    a: 'Nothing, unless you sign up. If you disconnect, or simply do nothing, Quidkey removes its access and keeps nothing about you or your business.',
  },
  {
    q: 'What does the check cost?',
    a: 'Nothing. The check is free and you don’t need a Quidkey account to run it.',
  },
  {
    q: 'How is the estimate worked out?',
    a: 'From your last 90 days of Stripe activity: what you paid in FX fees against what the same sales would cost with Quidkey. It is an estimate, not a quote. Your final rate is agreed when you sign up.',
  },
  {
    q: 'How do I disconnect?',
    a: 'One click on the results page, or any time from your Stripe dashboard under authorised applications. If you do nothing, Quidkey disconnects automatically within 48 hours.',
  },
]
