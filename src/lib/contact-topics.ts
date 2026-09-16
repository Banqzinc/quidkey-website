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
] as const

export type ContactTopic = (typeof CONTACT_TOPIC_KEYS)[number]

/** Where the dialog was opened from. Tracked, never sent to HubSpot. */
export type ContactSource = 'fx_hero' | 'fx_providers' | 'fx_closer' | 'pricing' | 'page'

export type ContactTopicCopy = {
  /** Dialog heading. Sentence case, ends with a full stop like the site's other headings. */
  heading: string
  /** Placeholder for the message field: the question we would ask first anyway. */
  prompt: string
  /** Value of the hidden `contact_topic` field in HubSpot, also the mailto subject. */
  label: string
}

export const CONTACT_TOPICS: Record<ContactTopic, ContactTopicCopy> = {
  general: {
    heading: 'Talk to us.',
    prompt: 'What are you looking to do, and where do you sell?',
    label: 'General enquiry',
  },
  fx: {
    heading: 'Let’s work out your FX saving.',
    prompt: 'Where do you sell, which currencies do you convert, and through which provider?',
    label: 'FX savings',
  },
  fx_high_volume: {
    heading: 'Let’s price your FX volume.',
    prompt:
      'Roughly how much do you convert each month, in which currencies, and through which provider?',
    label: 'FX: high volume',
  },
  fx_provider: {
    heading: 'Let’s set up FX for your provider.',
    prompt: 'Which payment provider or bank do you use today, and which currencies do you convert?',
    label: 'FX: other provider',
  },
  pricing_high_volume: {
    heading: 'Let’s talk high-volume pricing.',
    prompt: 'Roughly how many payments a month, the average value, and which markets?',
    label: 'Pricing: high volume',
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
export function contactPath(topic: ContactTopic): string {
  return topic === DEFAULT_TOPIC ? '/contact' : `/contact?topic=${topic}`
}
