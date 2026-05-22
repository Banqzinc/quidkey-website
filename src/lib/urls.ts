/** External CTA URLs - merchants portal, signup, demo playground, docs */
export const MERCHANTS_LOGIN_URL = 'https://console.quidkey.com'
export const MERCHANTS_SIGNUP_URL = 'https://console.quidkey.com/signup'
export const DEMO_PLAYGROUND_URL = 'https://playground.quidkey.com/'
export const DOCS_URL = 'https://docs.quidkey.com/'
/** Sales / book-a-demo scheduling page (Cal.com). Opens in a new tab. */
export const DEMO_BOOKING_URL = 'https://cal.com/quidkey/demo'

/** Contact */
export const CONTACT_EMAIL = 'support@quidkey.com'
export const PRESS_EMAIL = 'jenny@quidkey.com'
export const PARTNERS_EMAIL = 'partners@quidkey.com'

/** Internal route paths used by navigation primitives. */
export const FINTECHS_PATH = '/fintechs'

/** Email mailto helpers */
export const buildMailto = (subject: string, email = CONTACT_EMAIL) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`
