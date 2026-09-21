// The contact dialog knows why the visitor opened it. Each CTA passes a topic,
// and the topic drives the heading, the message prompt, and the value HubSpot
// receives, so sales sees "FX: high volume" instead of asking.
//
// Topics are an allowlist: the key travels through a hidden field and a URL
// search param, and anything unknown falls back to `general`.

export const CONTACT_TOPIC_KEYS = [
  'general',
  'fx',
  'fx_high_volume',
  'fx_provider',
  'pricing_high_volume',
  'marketplace',
] as const

export type ContactTopic = (typeof CONTACT_TOPIC_KEYS)[number]

/** Where the dialog was opened from. Tracked, never sent to HubSpot. */
export type ContactSource =
  | 'fx_hero'
  | 'fx_providers'
  | 'fx_how_it_works'
  | 'fx_closer'
  | 'pricing'
  | 'marketplace_hero'
  | 'marketplace_closer'
  | 'page'

export type ContactTopicCopy = {
  /** Dialog heading. Sentence case, ends with a full stop like the site's other headings. */
  heading: string
  /** Placeholder for the message field: the question we would ask first anyway. */
  prompt: string
  /** Value of the hidden `contact_topic` field in HubSpot, also the mailto subject. */
  label: string
  /** Page title for /contact?topic=, without the brand suffix. */
  title: string
  /** Meta description for /contact?topic=, 120 to 160 characters. */
  description: string
}

export const CONTACT_TOPICS: Record<ContactTopic, ContactTopicCopy> = {
  general: {
    heading: 'Talk to us.',
    prompt: 'What are you looking to do, and where do you sell?',
    label: 'General enquiry',
    title: 'Talk to us about Pay by Bank',
    description:
      'Ask about Pay by Bank, FX savings on cross-border sales, or high-volume pricing. Send a message or book a call, and a person replies within one business day.',
  },
  fx: {
    heading: 'Let’s work out your FX saving.',
    prompt: 'Where do you sell, which currencies do you convert, and through which provider?',
    label: 'FX savings',
    title: 'Talk to us about your FX saving',
    description:
      'Tell us where you sell and which currencies you convert, and we will work out your FX saving. A person replies within one business day.',
  },
  fx_high_volume: {
    heading: 'Let’s price your FX volume.',
    prompt:
      'Roughly how much do you convert each month, in which currencies, and through which provider?',
    label: 'FX: high volume',
    title: 'Talk to us about high-volume FX pricing',
    description:
      'Converting large amounts each month? Tell us the currencies and your provider, and we will price your FX volume. A person replies within one business day.',
  },
  fx_provider: {
    heading: 'Let’s set up FX for your provider.',
    prompt: 'Which payment provider or bank do you use today, and which currencies do you convert?',
    label: 'FX: other provider',
    title: 'Talk to us about FX for your provider',
    description:
      'Using another payment provider or bank for FX today? Tell us which one and which currencies you convert. A person replies within one business day.',
  },
  pricing_high_volume: {
    heading: 'Let’s talk high-volume pricing.',
    prompt: 'Roughly how many payments a month, the average value, and which markets?',
    label: 'Pricing: high volume',
    title: 'Talk to us about high-volume pricing',
    description:
      'Processing many payments a month? Tell us the volume, average value and markets, and we will price it for you. A person replies within one business day.',
  },
  marketplace: {
    heading: 'Let’s build Protected Pay on your marketplace.',
    prompt:
      'What does your marketplace sell, where are your buyers and sellers, and how do they pay each other today?',
    label: 'Marketplace: Protected Pay',
    title: 'Talk to us about Protected Pay for marketplaces',
    description:
      'Building Protected Pay on your marketplace? Tell us what it sells and how buyers and sellers pay today. A person replies within one business day.',
  },
}

export const DEFAULT_TOPIC: ContactTopic = 'general'

export function isContactTopic(raw: unknown): raw is ContactTopic {
  return typeof raw === 'string' && (CONTACT_TOPIC_KEYS as readonly string[]).includes(raw)
}

export function parseTopic(raw: unknown): ContactTopic {
  return isContactTopic(raw) ? raw : DEFAULT_TOPIC
}

/**
 * The /contact page URL for a topic. Every dialog trigger uses this as its
 * href so the link still works before hydration, in a new tab, and for
 * crawlers; the click handler upgrades it to the dialog.
 */
export function contactPath(topic: ContactTopic): `/${string}` {
  return topic === DEFAULT_TOPIC ? '/contact' : `/contact?topic=${topic}`
}
