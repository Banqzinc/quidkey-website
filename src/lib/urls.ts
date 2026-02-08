/** External CTA URLs - merchants portal, signup, demo playground, docs */
export const MERCHANTS_LOGIN_URL = 'https://merchants.quidkey.com'
export const MERCHANTS_SIGNUP_URL = 'https://merchants.quidkey.com/signup'
export const DEMO_PLAYGROUND_URL = 'https://playground.quidkey.com/'
export const DOCS_URL = 'https://docs.quidkey.com/'

/** Contact */
export const CONTACT_EMAIL = 'support@quidkey.com'
export const PRESS_EMAIL = 'jenny@quidkey.com'
export const CAREERS_EMAIL = 'careers@quidkey.com'

/**
 * Careers form submission endpoint
 * Options:
 * - Formspree: 'https://formspree.io/f/YOUR_FORM_ID'
 * - Your backend API: '/api/careers/apply'
 * - Set to null to use mailto fallback
 */
export const CAREERS_FORM_ENDPOINT: string | null = null

/** Email mailto helpers */
export const buildMailto = (subject: string, email = CONTACT_EMAIL) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`
