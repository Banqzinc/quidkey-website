// Icons for the merchant Developer section's integration list.
// Mirrors the prototype's IntegrationIcon at app.jsx:3565-3630.

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor' as const,
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IntegrationIcon({ id, large }: { id: string; large?: boolean }) {
  if (id === 'paylink') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
        <path d="M10 14a4 4 0 005.66 0l3-3a4 4 0 10-5.66-5.66L11.5 7" />
        <path d="M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 105.66 5.66L12.5 17" />
      </svg>
    )
  }
  if (id === 'shopify') {
    const size = large ? 22 : 18
    return (
      <span
        className="intg__shopify-mark"
        style={{ display: 'inline-block', width: size, height: size, position: 'relative' }}
      >
        <img className="intg__shopify-mark-black" src="/homepage/shopify-bag-black.webp" alt="Shopify" width={size} height={size} />
        <img className="intg__shopify-mark-white" src="/homepage/shopify-bag-white.webp" alt="Shopify" width={size} height={size} />
      </span>
    )
  }
  if (id === 'iframe') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <path d="M3 8.5h18" />
        <circle cx="6" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="8.2" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
        <path d="M9.5 13l-1.8 1.8 1.8 1.8" />
        <path d="M14.5 13l1.8 1.8-1.8 1.8" />
        <path d="M11.4 16.4l1.2-3.6" />
      </svg>
    )
  }
  if (id === 'hosted') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...stroke}>
        <path d="M14 5l5 5-5 5" />
        <path d="M19 10H7a4 4 0 00-4 4v5" />
      </svg>
    )
  }
  if (id === 'ios') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M16.5 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.1.7 1.1 1.6 2.3 2.8 2.3 1.1-.1 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.3-.9-2.3-3.5z M14.4 5.7c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.4-.6.7-1.1 1.6-1 2.6 1.1.1 2.1-.5 2.7-1.3z" />
      </svg>
    )
  }
  if (id === 'android') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          d="M7.6 4.2l1.4 2.2 M16.4 4.2l-1.4 2.2"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M5.6 10.4a6.4 6.4 0 0 1 12.8 0H5.6z" fill="currentColor" />
        <circle className="intg__android-eye" cx="9.2" cy="8.4" r="0.7" />
        <circle className="intg__android-eye" cx="14.8" cy="8.4" r="0.7" />
        <rect x="5.6" y="11" width="12.8" height="8" rx="0.9" fill="currentColor" />
        <rect x="3.2" y="10.6" width="2" height="7.2" rx="1" fill="currentColor" />
        <rect x="18.8" y="10.6" width="2" height="7.2" rx="1" fill="currentColor" />
        <rect x="8.4" y="19" width="2" height="3.6" rx="1" fill="currentColor" />
        <rect x="13.6" y="19" width="2" height="3.6" rx="1" fill="currentColor" />
      </svg>
    )
  }
  return null
}
