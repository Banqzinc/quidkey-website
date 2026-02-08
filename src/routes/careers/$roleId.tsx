import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { CAREERS_EMAIL, CAREERS_FORM_ENDPOINT, buildMailto } from '@/lib/urls'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  MapPin,
  Users,
  Clock,
  Briefcase,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import { useState, useRef, type FormEvent } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
 * Role Data
 * ─────────────────────────────────────────────────────────────────────────── */

const rolesData: Record<string, RoleData> = {
  'principal-engineer': {
    title: 'Principal Engineer (IC)',
    subtitle: 'Clearing Infrastructure & Programmable Treasury',
    location: 'Remote',
    team: 'Tech Team',
    type: 'Full Time',
    summary:
      "We're hiring a Principal Engineer to help build and evolve Quidkey's foundational systems. This is a hands-on individual contributor role with high autonomy and strategic impact: you'll work closely with the Tech Lead, CTO, and the rest of the engineering team to shape our architecture and ship production-grade infrastructure.",

    sections: [
      {
        title: 'About Quidkey',
        content:
          "Quidkey is building an AI-native clearing house for global commerce. Our entry to the market is pay-by-bank checkout; our longer-term goal is a programmable treasury layer that automates what happens after checkout—tax holds, splits, payouts, FX, and reconciliation—so merchants can move faster without losing control.",
      },
      {
        title: 'What Being a Principal Engineer Means at Quidkey',
        items: [
          'You own problems end-to-end (from framing to design to delivery to operations).',
          "You're comfortable digging into unfamiliar systems, unblocking yourself, and helping others do the same.",
          'You raise the bar on architecture, correctness, reliability, and security.',
          'You make the team faster by improving DX, tooling, and technical clarity (not just writing more code).',
        ],
      },
      {
        title: "What You'll Do",
        items: [
          'Own and evolve core platform systems (design, implementation, rollout, on-call/ops as needed).',
          'Partner with the Tech Lead, CTO, and the team on technical direction, tradeoffs, and sequencing.',
          'Build scalable services across payments, clearing/routing, ledger/reconciliation, and treasury workflows.',
          'Turn ambiguous product goals into crisp technical plans, and deliver iteratively.',
          'Improve observability: metrics, traces, logging, alerting, incident follow-ups.',
          'Partner with product/design to ship features that improve conversion, cost, and reliability.',
        ],
      },
      {
        title: 'Ownership Areas (Examples)',
        items: [
          'Pay-by-bank checkout and payment initiation flows',
          'Clearing/routing + settlement orchestration',
          'Treasury workflow engine (tax holds, splits, payouts, FX automation)',
          'Ledgering + reconciliation correctness',
          'Platform reliability (SLAs, incident response, runbooks)',
        ],
      },
      {
        title: "What You'll Bring (Requirements)",
        items: [
          'Proven track record shipping and operating production backend systems with strong engineering judgment.',
          'Strong system design fundamentals (APIs, data modeling, reliability, security, scalability).',
          'Strong SQL and data modeling; experience with relational databases (PostgreSQL preferred).',
          'Experience building in a fast-moving environment (startup/scale-up) with high ownership.',
          'Product mindset: you care about why and tradeoffs, not only implementation.',
          'Clear communicator: you can drive alignment in writing and in design discussions.',
        ],
      },
      {
        title: 'Nice to Have',
        items: [
          'TypeScript/Node experience (or adjacent modern backend stacks, e.g. Go, Rust, Python).',
          'Fintech, payments, or Open Banking experience.',
          'Cloud experience (GCP preferred; AWS also great).',
          'Experience with e-commerce platforms (Shopify/WooCommerce) or merchant integrations.',
        ],
      },
    ],

    techStack: 'TypeScript, Node (Express/Fastify), PostgreSQL, GCP.',

    outcomes: [
      {
        period: '30 days',
        description:
          'Shipping meaningful improvements to a core flow; comfortable owning one service end-to-end.',
      },
      {
        period: '90 days',
        description:
          'Leading design + delivery of a non-trivial platform capability (e.g., routing, workflow execution, reconciliation); measurable improvements in reliability/DX.',
      },
    ],

    whyJoin: [
      'Foundational role shaping architecture and engineering culture alongside the Tech Lead and CTO.',
      'High ownership and autonomy; direct collaboration with leadership.',
      'Build a new category: AI-native clearing + programmable treasury.',
      'Remote-first team.',
    ],

    interviewProcess: [
      { stage: 'Intro with CTO', description: 'Context + mutual fit discussion.' },
      {
        stage: 'Technical Deep Dive',
        description: 'Architecture + problem solving session.',
      },
      {
        stage: 'Working Session with Engineers',
        description: 'Real scenario / system design / debugging exercise.',
      },
      { stage: 'Final Chat with CEO', description: 'Alignment and expectations discussion.' },
    ],
  },
}

interface RoleSection {
  title: string
  content?: string
  items?: string[]
}

interface RoleData {
  title: string
  subtitle: string
  location: string
  team: string
  type: string
  summary: string
  sections: RoleSection[]
  techStack: string
  outcomes: { period: string; description: string }[]
  whyJoin: string[]
  interviewProcess: { stage: string; description: string }[]
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Route
 * ─────────────────────────────────────────────────────────────────────────── */

export const Route = createFileRoute('/careers/$roleId')({
  component: RolePage,
  loader: ({ params }) => {
    const role = rolesData[params.roleId]
    if (!role) {
      throw notFound()
    }
    return { role, roleId: params.roleId }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.role) {
      return buildSeo({
        title: 'Position Not Found | Quidkey',
        description: 'This position could not be found.',
        path: '/careers',
      })
    }
    return buildSeo({
      title: `${loaderData.role.title} | Careers at Quidkey`,
      description: loaderData.role.summary,
      path: `/careers/${loaderData.roleId}`,
    })
  },
})

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

function JobSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </div>
  )
}

function ApplicationForm({ jobTitle }: { jobTitle: string }) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')

    const formData = new FormData(e.currentTarget)
    formData.append('_subject', `Job Application: ${jobTitle}`)

    // If no form endpoint is configured, fall back to mailto
    if (!CAREERS_FORM_ENDPOINT) {
      const name = formData.get('name') as string
      const email = formData.get('email') as string
      const phone = formData.get('phone') as string
      const linkedin = formData.get('linkedin') as string
      const message = formData.get('message') as string

      const body = [
        `Position: ${jobTitle}`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `LinkedIn: ${linkedin}`,
        '',
        'Message:',
        message || 'No additional message',
        '',
        '---',
        'Note: Please reply to request CV/Resume attachment.',
      ].join('\n')

      const mailtoUrl = `${buildMailto(`Application: ${jobTitle}`, CAREERS_EMAIL)}&body=${encodeURIComponent(body)}`
      window.location.href = mailtoUrl
      setFormState('idle') // Reset since we're redirecting
      return
    }

    // Submit to configured endpoint (e.g., Formspree, custom API)
    try {
      const response = await fetch(CAREERS_FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      setFormState('success')
    } catch {
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Application Submitted!</h3>
        <p className="text-muted-foreground">
          Thank you for your interest in the {jobTitle} position at Quidkey.
          <br />
          We've received your application and will review it shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 md:p-8">
      <h3 className="text-xl font-semibold text-foreground mb-6">Apply Now</h3>

      {formState === 'error' && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            Something went wrong. Please try again or email us directly.
          </div>
        </div>
      )}

      <div className="space-y-5">
        <FormField label="Full Name" required>
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="Email Address" required>
          <input
            type="email"
            name="email"
            required
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="Phone Number" required>
          <input
            type="tel"
            name="phone"
            required
            placeholder="Your phone number"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="CV/Resume" required>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 rounded-lg border border-dashed border-border bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors flex items-center gap-3"
          >
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className={cn('text-sm', fileName ? 'text-foreground' : 'text-muted-foreground')}>
              {fileName || 'Click to upload your CV/Resume'}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            required
          />
        </FormField>

        <FormField label="LinkedIn Profile URL" required>
          <input
            type="url"
            name="linkedin"
            required
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="Why are you interested in this role?">
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us why you're excited about this position..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
          />
        </FormField>

        <button
          type="submit"
          disabled={formState === 'submitting'}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'w-full mt-2',
            formState === 'submitting' && 'opacity-70 cursor-not-allowed'
          )}
        >
          {formState === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  )
}

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Page Component
 * ─────────────────────────────────────────────────────────────────────────── */

function RolePage() {
  const { role } = Route.useLoaderData()

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
        <div className="absolute inset-0 noise" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all positions
          </Link>

          <div className="inline-flex items-center gap-2.5 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm font-medium text-foreground mb-6">
            {role.team}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
            <span className="text-foreground">{role.title}</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-6">{role.subtitle}</p>

          <div className="flex flex-wrap gap-4">
            <JobMeta icon={MapPin} label={role.location} />
            <JobMeta icon={Users} label={role.team} />
            <JobMeta icon={Clock} label={role.type} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <p className="text-muted-foreground mb-8 text-pretty text-lg">{role.summary}</p>

            {role.sections.map((section) => (
              <JobSection key={section.title} title={section.title}>
                {'content' in section && section.content ? (
                  <p className="text-muted-foreground text-pretty">{section.content}</p>
                ) : (
                  <ul className="space-y-2 text-muted-foreground">
                    {section.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-primary mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </JobSection>
            ))}

            <JobSection title="Tech Stack">
              <p className="font-mono text-sm bg-secondary/50 px-4 py-3 rounded-lg text-foreground">
                {role.techStack}
              </p>
            </JobSection>

            <JobSection title="30 / 90 Day Outcomes">
              <div className="space-y-4">
                {role.outcomes.map((outcome) => (
                  <div
                    key={outcome.period}
                    className="bg-secondary/30 rounded-lg p-4 border-l-4 border-primary"
                  >
                    <div className="font-semibold text-foreground mb-1">{outcome.period}</div>
                    <p className="text-sm text-muted-foreground">{outcome.description}</p>
                  </div>
                ))}
              </div>
            </JobSection>

            <JobSection title="Why Join">
              <ul className="space-y-2 text-muted-foreground">
                {role.whyJoin.map((reason, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </JobSection>

            <JobSection title="Interview Process">
              <div className="space-y-4">
                {role.interviewProcess.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="pt-1">
                      <div className="font-semibold text-foreground">{step.stage}</div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </JobSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Job Summary Card */}
              <div className="bg-secondary/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Summary
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Role</dt>
                    <dd className="font-medium text-foreground text-right">{role.title}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium text-foreground">{role.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Team</dt>
                    <dd className="font-medium text-foreground">{role.team}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Job Type</dt>
                    <dd className="font-medium text-foreground">{role.type}</dd>
                  </div>
                </dl>
              </div>

              {/* Application Form */}
              <ApplicationForm jobTitle={role.title} />
            </div>
          </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
