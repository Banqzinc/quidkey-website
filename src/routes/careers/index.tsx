import { createFileRoute, Link } from '@tanstack/react-router'
import {
  PageCTA,
  PageHero,
  PageLayout,
  ContentSection,
  SectionHeader,
} from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { buttonVariants } from '@/components/ui/button'
import { MapPin, Users, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/careers/')({
  component: CareersPage,
  head: () =>
    buildSeo({
      title: 'Careers at Quidkey | Build Pay by Bank Infrastructure',
      description:
        'Join Quidkey to build pay by bank checkout, global clearing, and programmable treasury workflows. Explore open roles and help shape modern payments infrastructure.',
      path: '/careers',
    }),
})

/* ─────────────────────────────────────────────────────────────────────────────
 * Open Roles Data
 * ─────────────────────────────────────────────────────────────────────────── */

const openRoles = [
  {
    id: 'principal-engineer',
    title: 'Principal Engineer (IC)',
    subtitle: 'Clearing Infrastructure & Programmable Treasury',
    location: 'Remote',
    team: 'Tech Team',
    type: 'Full Time',
    summary:
      "We're hiring a Principal Engineer to help build and evolve Quidkey's foundational systems. This is a hands-on IC role with high autonomy and strategic impact.",
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
 * Components
 * ─────────────────────────────────────────────────────────────────────────── */

function JobMeta({ icon: Icon, label }: { icon: typeof MapPin; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span>{label}</span>
    </div>
  )
}

function RoleCard({
  role,
}: {
  role: (typeof openRoles)[0]
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden card-hover">
      <div className="p-6 md:p-8">
        <Link
          to="/careers/$roleId"
          params={{ roleId: role.id }}
          className="inline-flex"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2 hover:underline">
            {role.title}
          </h2>
        </Link>
        <p className="text-muted-foreground mb-4">{role.subtitle}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <JobMeta icon={MapPin} label={role.location} />
          <JobMeta icon={Users} label={role.team} />
          <JobMeta icon={Clock} label={role.type} />
        </div>

        <p className="text-sm text-muted-foreground mb-6">{role.summary}</p>

        <Link
          to="/careers/$roleId"
          params={{ roleId: role.id }}
          className={cn(buttonVariants(), 'group')}
        >
          View Position
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Page Component
 * ─────────────────────────────────────────────────────────────────────────── */

function CareersPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="Careers"
        titleGradient="at Quidkey"
        description="Join our fast-growing fintech startup with a passionate and experienced team. We're building the future of embedded banking and e-commerce payments."
        features={[
          'Mission-driven, product-first',
          'Serious engineering',
          'Remote-first',
        ]}
        ctaPrimary={{
          label: 'View open roles',
          href: '#open-roles',
        }}
        ctaSecondary={{ label: 'See About', href: '/about' }}
      />

      {/* Open Roles */}
      <ContentSection>
        <SectionHeader
          title="Open Positions"
          subtitle="We're looking for talented individuals to help build the future of payments."
        />

        <div id="open-roles" className="max-w-3xl mx-auto scroll-mt-24 space-y-6">
          {openRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </ContentSection>

      <PageCTA />
    </PageLayout>
  )
}
