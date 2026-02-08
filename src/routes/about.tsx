import { createFileRoute } from '@tanstack/react-router'
import { PageLayout, PageHero, FeatureGrid, PageCTA } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { ArrowLeftRight, Layers, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () =>
    buildSeo({
      title: 'About | Quidkey',
      description:
        'Quidkey is an AI-native clearing house for pay by bank. We unify payment collection, intelligent routing, and programmable treasury into one stack.',
      path: '/about',
    }),
})

type TeamMember = {
  name: string
  role: string
  bio?: string
  linkedinUrl?: string
  imageSrc: string
}

const team: TeamMember[] = [
  {
    name: 'Rob Zeko',
    role: 'Co‑founder, CEO',
    bio: 'Serial founder with successful exits. Operator and investor across public and private companies.',
    linkedinUrl: 'https://www.linkedin.com/in/robertazeko/',
    imageSrc: '/images/team/rob-zeko.png',
  },
  {
    name: 'Rabea Bader',
    role: 'Co‑founder, CTO',
    bio: 'Seasoned technologist with experience building and scaling products across bank and non‑bank institutions.',
    linkedinUrl: 'https://www.linkedin.com/in/rabea-bader/',
    imageSrc: '/images/team/rabea-bader.png',
  },
  {
    name: 'Bhavna Saraf',
    role: 'COO',
    bio: 'Financial services executive with experience scaling growth at Citi, Santander, Lloyds, and HSBC.',
    linkedinUrl: 'https://www.linkedin.com/in/bhavna-saraf-01b82915/',
    imageSrc: '/images/team/bhavna-saraf.png',
  },
  {
    name: 'Matt Bartlett',
    role: 'General Counsel & VP Strategy',
    bio: 'Corporate transactional attorney advising on deals, governance, IP, and regulatory matters.',
    linkedinUrl: 'https://www.linkedin.com/in/matthew-bartlett-b6587346/',
    imageSrc: '/images/team/matt-bartlett.png',
  },
  {
    name: 'Harry McNair',
    role: 'Sales Development Executive',
    linkedinUrl: 'https://www.linkedin.com/in/harry-mcnair-3a94b7181/',
    imageSrc: '/images/team/harry-mcnair.png',
  },
  {
    name: 'Steven Holmes',
    role: 'Technical Lead',
    linkedinUrl: 'https://www.linkedin.com/in/steven-holmes-7281a627/',
    imageSrc: '/images/team/steven-holmes.png',
  },
  {
    name: 'Zakhar Bahniuk',
    role: 'Senior Full‑Stack Developer',
    linkedinUrl: 'https://www.linkedin.com/in/zakhar-bahniuk-821744206/',
    imageSrc: '/images/team/zakhar-bahniuk.png',
  },
  {
    name: 'Ohad Louvton',
    role: 'Senior DevOps',
    linkedinUrl: 'https://www.linkedin.com/in/ohad-louvton/',
    imageSrc: '/images/team/ohad-louvton.png',
  },
  {
    name: 'Kateryna Kravchenko',
    role: 'UI/UX Designer',
    linkedinUrl: 'https://www.linkedin.com/in/kateryna-kravchenko-646107183/',
    imageSrc: '/images/team/kateryna-kravchenko.png',
  },
]

function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="About"
        titleGradient="Quidkey"
        description="We’re building an AI-native clearing house for pay by bank—so global businesses can collect funds, route payments intelligently, and automate treasury workflows without losing control."
        features={[
          'Pay by bank checkout',
          'Intelligent routing',
          'Programmable treasury',
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                Why we exist
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Payments, tax, FX, and payouts are often split across different tools and vendors.
                That fragmentation costs margin and creates manual work as you scale globally.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What teams tell us
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Card fees and cross‑border costs add up fast.</li>
                <li>Chargebacks and fraud create avoidable risk.</li>
                <li>Treasury workflows stay manual: tax holds, splits, FX, payouts.</li>
                <li>Global expansion requires too many systems—and too much headcount.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="One stack, three layers"
        subtitle="Simple on the surface, powerful underneath."
        features={[
          {
            icon: Sparkles,
            title: 'Payment intelligence',
            description:
              'Increase conversion with a clean pay‑by‑bank checkout and smarter payment decisions.',
          },
          {
            icon: ArrowLeftRight,
            title: 'Clearing & routing',
            description:
              'Orchestrate payments across providers and jurisdictions with a single integration.',
          },
          {
            icon: Layers,
            title: 'Programmable treasury',
            description:
              'Define workflows in plain English—then execute them deterministically and auditably.',
          },
        ]}
      />

      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Plain‑English workflows
            </h2>
            <p className="text-lg text-muted-foreground">
              A few examples of what teams automate with Quidkey.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Hold sales tax by jurisdiction.',
              'Split 70/30 with a supplier and hold 10% for returns.',
              'Convert to USD weekly at the best rate.',
              'Pay out partners automatically after settlement.',
            ].map((text) => (
              <div key={text} className="bg-white rounded-2xl border border-border p-6">
                <div className="font-mono text-sm text-foreground/90">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Building reliable infrastructure for global commerce.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="aspect-[4/3] bg-secondary/30">
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-foreground">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                    {member.linkedinUrl ? (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        LinkedIn
                      </a>
                    ) : null}
                  </div>
                  {member.bio ? (
                    <p className="mt-4 text-sm text-muted-foreground text-pretty">
                      {member.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                Going global
              </h2>
              <p className="text-lg text-background/70">
                We’re building for global coverage from day one—starting with the markets where pay‑by‑bank is already winning.
              </p>
            </div>
            <div className="bg-background rounded-2xl border border-white/10 p-6">
              <img
                src="/global-map.svg"
                alt="Quidkey live markets and closed beta regions"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <PageCTA />
    </PageLayout>
  )
}

