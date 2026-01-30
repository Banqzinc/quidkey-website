export type BlogPostBlock =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul'; items: string[] }

export type BlogPost = {
  slug: string
  date: string
  title: string
  description: string
  blocks: BlogPostBlock[]
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-native-clearing-house',
    date: 'January 30, 2026',
    title: 'What Is an AI-native global clearing house?',
    description:
      'A practical definition of the category and why unifying pay by bank, clearing, and programmable treasury changes unit economics for global businesses.',
    featured: true,
    blocks: [
      {
        type: 'p',
        text:
          'Payments are rarely just payments. The moment money lands, finance teams still need to hold tax, split revenue, convert currencies, and reconcile everything back to the ledger. Most "pay by bank" solutions stop at initiation, and most treasury tools start after collection. That fragmentation is where margin and time disappear.',
      },
      { type: 'h2', text: 'Definition: global clearing house' },
      {
        type: 'p',
        text:
          'A global clearing house is a software layer that orchestrates regulated payment partners to collect funds, route them into programmable sub-ledgers, and execute tax, FX, and payout workflows across countries automatically. Quidkey does not hold funds or act as a bank. We coordinate licensed partners while owning the intelligence, workflow logic, and clearing orchestration.',
      },
      { type: 'h2', text: 'What makes it AI-native (and not "just AI")?' },
      {
        type: 'p',
        text:
          'AI is only valuable when it produces measurable outcomes. In a clearing house, that means higher conversion, lower loss, and fewer manual finance hours. Quidkey uses AI where it compounds with data: bank prediction at checkout, network-trained risk scoring, and workflow parsing (plain English to deterministic execution).',
      },
      {
        type: 'ul',
        items: [
          'Bank prediction: reduce checkout friction by surfacing the right bank before a customer types.',
          'Fraud intelligence: detect patterns across the network so one business’s learnings protect others.',
          'Intent to execution: translate "hold sales tax by jurisdiction" into CEL-compiled logic with audit trails.',
        ],
      },
      { type: 'h2', text: 'Why it matters for businesses selling into the US' },
      {
        type: 'p',
        text:
          'The US is still dominated by cards (and card economics). Global businesses expanding into the US often face a choice: pay 3-6% card fees, or give up seller-of-record control to a merchant-of-record (MoR) that takes 6-10%. A pay by bank checkout paired with global clearing and treasury automation changes that equation without forcing businesses to rebuild their finance ops.',
      },
      { type: 'h2', text: 'One integration vs four' },
      {
        type: 'p',
        text:
          'Stripe, Plaid, Wise, and a US pay-by-bank provider can each solve one layer. Quidkey is built to unify the entire workflow end-to-end: collection, clearing, routing, and programmable treasury.',
      },
    ],
  },
  {
    slug: 'pay-by-bank-us',
    date: 'January 28, 2026',
    title: 'Pay by Bank in the US: ACH today, real-time tomorrow',
    description:
      'How US pay by bank works, what businesses should expect from settlement, and how to build a high-conversion checkout for US customers.',
    blocks: [
      {
        type: 'p',
        text:
          '“Pay by bank” in the US usually means bank account payments over ACH. The opportunity is simple: lower cost than cards, fewer chargebacks, and a better path to margin. The challenge is also simple: you need a checkout that actually converts.',
      },
      { type: 'h2', text: 'What businesses should care about' },
      {
        type: 'ul',
        items: [
          'Conversion: customers should not have to hunt for their bank or re-enter details.',
          'Risk: reduce returns/chargebacks by authenticating and scoring risk up front.',
          'Operations: automate tax holds, splits, and payouts so finance isn’t the bottleneck.',
        ],
      },
      { type: 'h2', text: 'The Quidkey approach' },
      {
        type: 'p',
        text:
          'Quidkey pairs a US-first pay by bank checkout with a global clearing layer. Bank prediction reduces friction, adaptive routing improves success rates, and programmable treasury turns post-payment work into deterministic automation.',
      },
      { type: 'h3', text: 'A note on settlement expectations' },
      {
        type: 'p',
        text:
          "Settlement speed depends on rails and partner configuration. The goal is not a marketing number. It's reliable outcomes: fewer failures, faster access to cash where possible, and cleaner reconciliation every time.",
      },
    ],
  },
  {
    slug: 'seller-of-record-vs-mor',
    date: 'January 12, 2026',
    title: 'Seller-of-record vs merchant-of-record: the hidden cost of "easy"',
    description:
      'MoR can simplify early expansion, but it often taxes margin and customer control. Here is how to keep seller-of-record control while scaling globally.',
    blocks: [
      {
        type: 'p',
        text:
          'Merchant-of-record (MoR) products can be a shortcut: they handle taxes, compliance, and sometimes payments. But the tradeoff is structural. MoR providers typically take 6-10% and own key parts of the customer relationship.',
      },
      { type: 'h2', text: 'Why seller-of-record control matters' },
      {
        type: 'ul',
        items: [
          'You own your customers (data, experience, brand).',
          'You control pricing, refunds, and dispute policy.',
          'You keep margin that would otherwise be taxed by MoR take rates.',
        ],
      },
      { type: 'h2', text: 'What changes with an AI-native clearing house' },
      {
        type: 'p',
        text:
          'Instead of outsourcing the business model to MoR, a clearing house unifies collection + treasury. Businesses stay seller-of-record while tax holds, FX, splits, and payouts run automatically in the background, defined in plain English and executed deterministically.',
      },
    ],
  },
]

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

