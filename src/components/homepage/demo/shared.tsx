// Small pieces shared by more than one demo screen: the bank brand-colour
// accessor, the browser URL bar, the Safari and PayPal marks, and the two
// unions the screens take as props.

import type { Bank } from '@/components/homepage/demo-locales'

// Brand color travels on each Bank in the locale pack (demo-locales.ts); this
// wrapper preserves the original call sites: bankBrandColor(activeBank).
export function bankBrandColor(bank: Bank | null | undefined): string {
  return bank?.brandColor ?? '#0A2A66'
}

export type PaymentMethod = 'predicted' | 'select' | 'apple' | 'card' | 'paypal'
export type FaceIdState = 'idle' | 'scanning' | 'approved'

// The faux Safari address bar at the top of any screen that is a web page
// rather than a native app — the merchant's checkout and receipt, and the
// Quidkey-hosted pages.
export function UrlBar({ host, path }: { host: string; path: string }) {
  return (
    <div className="phone__urlbar">
      <span className="phone__url-lock" aria-hidden="true">
        <svg viewBox="0 0 12 14" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="6" width="8" height="7" rx="1" />
          <path d="M4 6V4a2 2 0 014 0v2" />
        </svg>
      </span>
      <span className="phone__url-host">{host}</span>
      <span className="phone__url-path">{path}</span>
    </div>
  )
}

export function SafariIcon() {
  // Faithful recreation of the iOS Safari icon: blue circular bezel with
  // tick marks, white inner face, red/white compass needle pointing NE.
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id="safari-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1FA9F8" />
          <stop offset="100%" stopColor="#0A6FD3" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#safari-bg)" />
      <circle cx="32" cy="32" r="22" fill="#fff" />
      <polygon points="32,16 36,32 32,48 28,32" fill="#E33A3A" />
      <polygon points="32,16 32,32 36,32" fill="#FFFFFF" opacity="0.9" />
      <polygon points="32,48 32,32 28,32" fill="#FFFFFF" opacity="0.85" />
      <circle cx="32" cy="32" r="2.4" fill="#fff" stroke="#0A6FD3" strokeWidth="1" />
    </svg>
  )
}
export const PayPalSvg = (
  <svg width="28" height="28" viewBox="0 0 30 31" fill="none" aria-hidden="true">
    <path
      d="M9.26555 29.1539L9.78855 25.8319L8.62355 25.8049H3.06055L6.92655 1.29193C6.93855 1.21793 6.97755 1.14893 7.03455 1.09993C7.09155 1.05093 7.16455 1.02393 7.24055 1.02393H16.6205C19.7345 1.02393 21.8835 1.67193 23.0055 2.95093C23.5315 3.55093 23.8665 4.17793 24.0285 4.86793C24.1985 5.59193 24.2015 6.45693 24.0355 7.51193L24.0235 7.58893V8.26493L24.5495 8.56293C24.9925 8.79793 25.3445 9.06693 25.6145 9.37493C26.0645 9.88793 26.3555 10.5399 26.4785 11.3129C26.6055 12.1079 26.5635 13.0539 26.3555 14.1249C26.1155 15.3569 25.7275 16.4299 25.2035 17.3079C24.7215 18.1169 24.1075 18.7879 23.3785 19.3079C22.6825 19.8019 21.8555 20.1769 20.9205 20.4169C20.0145 20.6529 18.9815 20.7719 17.8485 20.7719H17.1185C16.5965 20.7719 16.0895 20.9599 15.6915 21.2969C15.2925 21.6409 15.0285 22.1109 14.9475 22.6249L14.8925 22.9239L13.9685 28.7789L13.9265 28.9939C13.9155 29.0619 13.8965 29.0959 13.8685 29.1189C13.8435 29.1399 13.8075 29.1539 13.7725 29.1539H9.26555Z"
      fill="#253B80"
    />
    <path
      d="M25.0481 7.66699C25.0201 7.84599 24.9881 8.02899 24.9521 8.21699C23.7151 14.568 19.4831 16.762 14.0781 16.762H11.3261C10.6651 16.762 10.1081 17.242 10.0051 17.894L8.59614 26.83L8.19714 29.363C8.13014 29.791 8.46014 30.177 8.89214 30.177H13.7731C14.3511 30.177 14.8421 29.757 14.9331 29.187L14.9811 28.939L15.9001 23.107L15.9591 22.787C16.0491 22.215 16.5411 21.795 17.1191 21.795H17.8491C22.5781 21.795 26.2801 19.875 27.3621 14.319C27.8141 11.998 27.5801 10.06 26.3841 8.69699C26.0221 8.28599 25.5731 7.94499 25.0481 7.66699Z"
      fill="#179BD7"
    />
    <path
      d="M11.614 7.699C11.675 7.306 11.927 6.985 12.266 6.823C12.421 6.749 12.592 6.708 12.773 6.708H20.125C20.996 6.708 21.809 6.765 22.551 6.885C22.763 6.919 22.969 6.958 23.17 7.002C23.37 7.047 23.565 7.097 23.754 7.152C23.848 7.18 23.941 7.209 24.032 7.238C24.397 7.359 24.736 7.502 25.049 7.667C25.417 5.32 25.046 3.722 23.777 2.275C22.378 0.682 19.853 0 16.622 0H7.24199C6.58199 0 6.01899 0.48 5.91699 1.133L2.00999 25.898C1.93299 26.388 2.31099 26.83 2.80499 26.83H8.59599L10.05 17.605L11.614 7.699Z"
      fill="#253B80"
    />
  </svg>
)