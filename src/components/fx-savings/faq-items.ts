import type { FaqItem } from '@/components/sections/faq'

// Every answer stays within what Quidkey actually does for FX today: the
// merchant keeps their provider and checkout, only the foreign-currency payout
// account changes, the saving is worked out from what they tell us and the
// rate is agreed at signup. Nothing here depends on the console's Stripe
// check, which the website does not offer for now.
export const FX_SAVINGS_FAQS: FaqItem[] = [
  {
    q: 'Do I have to move from Stripe to Quidkey?',
    a: 'No. You keep your Stripe account, your checkout, your integrations and your Stripe setup, and you keep taking payments exactly as you do now. Quidkey only takes over the currency conversion. The one change is where Stripe pays out your foreign currency: to a Quidkey account in that currency, which we convert and pass on to your bank. Everything else runs as it does today.',
  },
  {
    q: 'Do you only work with Stripe?',
    a: 'No. Stripe and Shopify both work the same way: you add Quidkey’s local account for your payouts and we handle the conversion. If you use another provider, or you move money between countries, talk to us and we’ll work out your saving.',
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
    q: 'What does it cost to find out my saving?',
    a: 'Nothing. Tell us what you convert and we’ll work out your saving for free, with no Quidkey account needed. If you go ahead, there are no setup or monthly fees and your rate is agreed before you sign up.',
  },
  {
    q: 'How is the estimate worked out?',
    a: 'From what you convert each month, against what Stripe, Shopify or your bank charge you to convert it today. The calculator on this page assumes their standard 2% rate and a 0.5% saving. It is an estimate, not a quote. Your final rate is agreed when you sign up.',
  },
]
