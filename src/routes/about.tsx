import { createFileRoute } from '@tanstack/react-router'
import {
  PageLayout,
  PageHero,
  FeatureGrid,
  PageCTA,
  ContentSection,
  SectionHeader,
  TeamSection,
} from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { ArrowLeftRight, Layers, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () =>
    buildSeo({
      title: 'About Quidkey | AI-Native Clearing House',
      description:
        'Quidkey is an AI-native clearing house for pay by bank. We unify payment collection, intelligent routing, and programmable treasury into one stack.',
      path: '/about',
    }),
})

const team = [
  {
    name: 'Rob Zeko',
    role: 'Co‑founder, CEO',
    bio: 'Serial founder with successful exits. Operator and investor across public and private companies.',
    linkedinUrl: 'https://www.linkedin.com/in/robertazeko/',
    imageSrc: '/images/team/rob-zeko.webp',
  },
  {
    name: 'Rabea Bader',
    role: 'Co‑founder, CTO',
    bio: 'Seasoned technologist with experience building and scaling products across bank and non‑bank institutions.',
    linkedinUrl: 'https://www.linkedin.com/in/rabea-bader/',
    imageSrc: '/images/team/rabea-bader.webp',
  },
  {
    name: 'Matt Bartlett',
    role: 'General Counsel & VP Strategy',
    bio: 'Corporate transactional attorney advising on deals, governance, IP, and regulatory matters.',
    linkedinUrl: 'https://www.linkedin.com/in/matthew-bartlett-b6587346/',
    imageSrc: '/images/team/matt-bartlett.webp',
  },
  {
    name: 'Harry McNair',
    role: 'Sales Development Executive',
    linkedinUrl: 'https://www.linkedin.com/in/harry-mcnair-3a94b7181/',
    imageSrc: '/images/team/harry-mcnair.webp',
  },
  {
    name: 'Steven Holmes',
    role: 'Technical Lead',
    linkedinUrl: 'https://www.linkedin.com/in/steven-holmes-7281a627/',
    imageSrc: '/images/team/steven-holmes.webp',
  },
  {
    name: 'Zakhar Bahniuk',
    role: 'Senior Full‑Stack Developer',
    linkedinUrl: 'https://www.linkedin.com/in/zakhar-bahniuk-821744206/',
    imageSrc: '/images/team/zakhar-bahniuk.webp',
  },
  {
    name: 'Ohad Louvton',
    role: 'Senior DevOps',
    linkedinUrl: 'https://www.linkedin.com/in/ohad-louvton/',
    imageSrc: '/images/team/ohad-louvton.webp',
  },
  {
    name: 'Kateryna Kravchenko',
    role: 'UI/UX Designer',
    linkedinUrl: 'https://www.linkedin.com/in/kateryna-kravchenko-646107183/',
    imageSrc: '/images/team/kateryna-kravchenko.webp',
  },
]

const workflows = [
  'Hold sales tax by jurisdiction.',
  'Split 70/30 with a supplier and hold 10% for returns.',
  'Convert to USD weekly at the best rate.',
  'Pay out partners automatically after settlement.',
]

function AboutPage() {
  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="About"
        titleGradient="Quidkey"
        description="We're building an AI-native clearing house for pay by bank—so global businesses can collect funds, route payments intelligently, and automate treasury workflows without losing control."
        features={[
          'Pay by Bank checkout',
          'Intelligent routing',
          'Programmable treasury',
        ]}
      />

      {/* Why we exist */}
      <ContentSection>
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
      </ContentSection>

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

      {/* Plain-English workflows */}
      <ContentSection background="muted">
        <SectionHeader
          title="Plain‑English workflows"
          subtitle="A few examples of what teams automate with Quidkey."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {workflows.map((text) => (
            <div key={text} className="bg-white rounded-2xl border border-border p-6">
              <div className="font-mono text-sm text-foreground/90">{text}</div>
            </div>
          ))}
        </div>
      </ContentSection>

      <TeamSection members={team} />

      {/* Global coverage */}
      <ContentSection background="dark">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              Going global
            </h2>
            <p className="text-lg text-background/70">
              We're building for global coverage from day one—starting with the markets where pay‑by‑bank is already winning.
            </p>
          </div>
          <div className="bg-background rounded-2xl border border-white/10 p-6">
            <img
              src="/global-map.webp"
              alt="Quidkey live markets and closed beta regions"
              width={960}
              height={540}
              className="w-full h-auto"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </ContentSection>

      <PageCTA />
    </PageLayout>
  )
}
