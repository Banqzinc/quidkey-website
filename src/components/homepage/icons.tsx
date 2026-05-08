// Inline SVG icons used across the homepage. Mirrors the prototype's WHY_ICONS map
// (app.jsx:2405) plus a few helpers consumed by other sections.

import type { ReactElement } from 'react'

export const WhyIcon: Record<string, ReactElement> = {
  bolt: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 4 7 18h7l-1 10 10-14h-7l1-10z" />
    </svg>
  ),
  target: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  ),
  dashboard: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="24" height="20" rx="2" />
      <path d="M4 12h24" />
      <path d="M10 18v4" />
      <path d="M16 16v6" />
      <path d="M22 19v3" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4 5 8v8c0 6.5 4.6 10.6 11 12 6.4-1.4 11-5.5 11-12V8l-11-4z" />
      <path d="M11 16.5l3.5 3.5L21 13" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="11" />
      <path d="M16 9v7l4.5 2.5" />
    </svg>
  ),
  coin: (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="16" cy="9" rx="10" ry="3.5" />
      <path d="M6 9v8c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5V9" />
      <path d="M6 17v6c0 2 4.5 3.5 10 3.5s10-1.5 10-3.5v-6" />
    </svg>
  ),
}
