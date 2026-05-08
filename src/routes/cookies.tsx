import { createFileRoute } from '@tanstack/react-router'
import {
  ContactCard,
  LegalSection,
  LegalShell,
  type LegalSectionDef,
} from '@/components/layout/legal-shell'
import { Button } from '@/components/ui/button'
import { buildSeo } from '@/lib/seo'
import { openCookiebotPreferences } from '@/lib/cookiebot'

const COOKIEBOT_DOMAIN_GROUP_ID = 'bcd5bf4b-c074-47cb-b26a-a401acac39b6'

export const Route = createFileRoute('/cookies')({
  component: CookiesPage,
  head: () =>
    buildSeo({
      title: 'Cookie Preferences & Declaration | Quidkey',
      description:
        'Manage cookie preferences for Quidkey.com and review the cookie declaration provided by our consent manager. You can update consent at any time.',
      path: '/cookies',
    }),
})

const SECTIONS: LegalSectionDef[] = [
  { id: 'preferences', title: 'Cookie preferences' },
  { id: 'declaration', title: 'Cookie declaration' },
]

function CookiesPage() {
  return (
    <LegalShell
      pageId="cookies"
      hero={{
        title: 'Cookies',
        lede: "What we store on your device when you visit Quidkey, and how to switch any of it off. You can update your consent at any time.",
        meta: [
          { k: 'Effective', v: 'June 2025' },
          { k: 'Last updated', v: 'June 2025' },
          { k: 'Provider', v: 'Cookiebot' },
          { k: 'Read time', v: '2 min' },
        ],
      }}
      sections={SECTIONS}
    >
      <LegalSection id="preferences" num={1} title="Cookie preferences">
        <div className="space-y-4 text-base text-muted-foreground">
          <p>
            You can update your cookie preferences at any time. If you're in a region where
            consent is required, we won't run analytics until you opt in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={() => openCookiebotPreferences({ fallbackUrl: '/cookies' })}
            >
              Manage cookie preferences
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.assign('/privacy')}
            >
              Privacy notice
            </Button>
          </div>
        </div>
      </LegalSection>

      <LegalSection id="declaration" num={2} title="Cookie declaration">
        <div className="space-y-4 text-base text-muted-foreground">
          <p className="text-sm">
            This section is provided by our consent manager (Cookiebot) and lists every
            cookie set on this domain by category, with retention periods and the third
            parties involved.
          </p>
          <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <div id="CookieDeclaration" />
            <script
              id="CookieDeclaration"
              src={`https://consent.cookiebot.com/${COOKIEBOT_DOMAIN_GROUP_ID}/cd.js`}
              type="text/javascript"
              async
            />
          </div>
        </div>
      </LegalSection>

      <ContactCard topic="cookies on our site" email="privacy@quidkey.com" />
    </LegalShell>
  )
}
