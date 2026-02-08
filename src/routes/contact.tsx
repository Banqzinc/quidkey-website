import { createFileRoute } from '@tanstack/react-router'
import {
  PageCTA,
  PageHero,
  PageLayout,
  ContentSection,
  ContentCard,
} from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'
import { CONTACT_EMAIL, PRESS_EMAIL, buildMailto } from '@/lib/urls'
import { useEffect, useState, type FormEvent } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () =>
    buildSeo({
      title: 'Contact | Quidkey',
      description: 'Talk to Quidkey about pay by bank, routing, and treasury workflows.',
      path: '/contact',
    }),
})

const contactOptions = [
  {
    title: 'General inquiries',
    description: 'For now, the fastest way is email.',
    subject: 'Website inquiry',
    email: CONTACT_EMAIL,
  },
  {
    title: 'Press',
    description: "If you're writing about pay by bank or clearing infrastructure, we'd love to help.",
    subject: 'Press inquiry',
    email: PRESS_EMAIL,
  },
]

const inquiryTypes = [
  { value: 'sales', label: 'Sales & partnerships' },
  { value: 'technical', label: 'Technical questions' },
  { value: 'support', label: 'Support' },
  { value: 'other', label: 'Other' },
]

/* ─────────────────────────────────────────────────────────────────────────────
 * Contact Form Component
 * ─────────────────────────────────────────────────────────────────────────── */

function ContactForm() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const formName = 'contact'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState('submitting')

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch('/', {
        method: 'POST',
        // Let the browser set Content-Type (works for Netlify Forms; matches careers form pattern).
        body: formData,
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
        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">
          Thanks for reaching out. We'll get back to you within 1-2 business days.
        </p>
      </div>
    )
  }

  return (
    <form
      id="talk-to-sales"
      name={formName}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="scroll-mt-28 bg-white rounded-2xl border border-border p-6 md:p-8"
    >
      {/* Hidden field for Netlify Forms */}
      <input type="hidden" name="form-name" value={formName} />
      {/* Honeypot field for spam bots */}
      <p className="hidden">
        <label>
          Don't fill this out if you're human: <input name="bot-field" />
        </label>
      </p>

      <h3 className="text-xl font-semibold text-foreground mb-6">Talk to Sales</h3>

      {formState === 'error' && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            Something went wrong. Please try again or email us directly at {CONTACT_EMAIL}.
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

        <FormField label="Work Email" required>
          <input
            type="email"
            name="email"
            required
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="Company">
          <input
            type="text"
            name="company"
            placeholder="Your company name"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </FormField>

        <FormField label="What can we help with?" required>
          <select
            name="inquiry_type"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          >
            <option value="" disabled>
              Select an option
            </option>
            {inquiryTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Message" required>
          <textarea
            name="message"
            rows={4}
            required
            placeholder="Tell us about your project or question..."
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
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          We typically respond within 1-2 business days.
        </p>
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

function ContactPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollToForm = () => {
      if (window.location.hash !== '#talk-to-sales') return
      document.getElementById('talk-to-sales')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Initial mount (handles direct visits to /contact#talk-to-sales)
    scrollToForm()

    // Subsequent hash changes (handles in-app navigation updating the hash)
    window.addEventListener('hashchange', scrollToForm)
    return () => window.removeEventListener('hashchange', scrollToForm)
  }, [])

  return (
    <PageLayout>
      <PageHero
        badge="Company"
        title="Contact"
        titleGradient="Quidkey"
        description="Questions about pricing, coverage, or integration? Reach out—we'll get back quickly."
        features={['Sales & partnerships', 'Technical questions', 'Support']}
        ctaSecondary={null}
      />

      <ContentSection>
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Form - Primary */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Alternative Contact Options - Secondary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-sm text-muted-foreground mb-4">
                Prefer email? Reach out directly:
              </div>
              {contactOptions.map((option) => (
                <ContentCard
                  key={option.title}
                  title={option.title}
                  description={option.description}
                >
                  <div className="mt-4">
                    <a
                      href={buildMailto(option.subject, option.email)}
                      className="text-primary font-medium hover:underline text-sm"
                    >
                      {option.email}
                    </a>
                  </div>
                </ContentCard>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      <PageCTA />
    </PageLayout>
  )
}
