import { createFileRoute } from '@tanstack/react-router'
import { PageLayout } from '@/components/layout/page-layout'
import { buildSeo } from '@/lib/seo'

export const Route = createFileRoute('/complaints')({
  component: ComplaintsPage,
  head: () =>
    buildSeo({
      title: 'Complaints Procedure | Quidkey',
      description:
        'Learn how to submit a complaint to Quidkey and how we handle complaints about our payment services.',
      path: '/complaints',
    }),
})

function ComplaintsPage() {
  return (
    <PageLayout>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Complaints Procedure
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              At Quidkey, our mission is to provide outstanding service to our merchant
              customers, ensuring that you have the most cost-effective and seamlessly
              integrated payment solutions you need to help drive revenues and grow your
              business.
            </p>

            <p className="text-muted-foreground mb-8">
              While we take great pride in providing you with the best services possible, we
              know that sometimes not everything is perfect. We are dedicated to continually
              improving our services and we value your feedback, even complaints, because it
              helps us provide better services to you and our other customers.
            </p>

            <p className="text-muted-foreground mb-8">
              We have policies and procedures in place that allow our merchant customers and
              users to complain about the services that have been provided (or not provided)
              to them if they are dissatisfied.
            </p>

            <div className="rounded-2xl border border-border bg-white p-6 md:p-8 mb-8">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Quidkey's relationship with the retail customers of our
                merchant clients (such retail customers, the "end-users") is limited to
                providing payments technology services for our merchant clients to deploy
                certain payment solutions, which relies on the licenses of our partners and
                financial service providers. Quidkey does not have a commercial relationship
                with end-users, nor do we directly provide or market our services to them.
              </p>
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">What is a complaint?</h2>
            <p className="text-muted-foreground mb-6">
              You may have a complaint if you are unhappy with the provision (or failure of
              provision) of our services, or those provided by one of our partners or
              suppliers, which has resulted in (or may result in) financial loss, material
              distress or material inconvenience. We take every complaint very seriously and
              will strive to resolve most complaints within five business days.
            </p>

            <p className="text-muted-foreground mb-4">
              When making a complaint, please outline the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
              <li>The date of the complaint</li>
              <li>The nature of your complaint</li>
              <li>The impact on your business</li>
              <li>Your contact details</li>
              <li>Any additional information you think would be helpful</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-12 mb-4">How do I complain?</h2>
            <p className="text-muted-foreground mb-6">
              For any complaints, including any security, confidentiality, integrity or
              availability concerns, please contact our Customer Support Team at:{' '}
              <a
                href="mailto:support@quidkey.com"
                className="text-primary font-medium hover:underline"
              >
                support@quidkey.com
              </a>
            </p>
            <p className="text-muted-foreground mb-8">
              Every complaint is handled by Quidkey's dedicated Customer Support Team.
            </p>

            <h2 className="text-2xl font-semibold mt-12 mb-4">
              What happens when a complaint is made?
            </h2>
            <p className="text-muted-foreground mb-6">
              A member of our Customer Support Team will confirm receipt of your complaint via
              email within 24 hours (or one business day) of receiving it and will aim to
              resolve the complaint within five business days, if practicable. As a technology
              provider, we rely on various partners and suppliers for certain payment
              processing services and other regulated activities. After review, certain
              complaints may need to be redirected to one or more of our partners that provide
              such payment processing or related services. We will notify you as soon as
              possible if this is the case.
            </p>

            <p className="text-muted-foreground mb-6">
              On occasion, a complaint may need to be escalated or require additional time to
              address. If so, the Customer Support Team may extend the timeline to resolve the
              complaint by the end of 15 business days following receipt of the complaint. In
              exceptional circumstances, where we are unable to issue a final response within
              15 business days of receipt of the complaint, we will make all reasonable
              efforts to issue a final response within 35 business days from the date of
              receipt. If a complaint needs to be escalated or falls under exceptional
              circumstances, you will be notified by the Customer Support Team.
            </p>

            <div className="rounded-2xl border border-border bg-white p-6 md:p-8 mb-8">
              <h3 className="text-lg font-semibold mb-3">Financial Ombudsman Service</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you are an end-user retail customer, micro-enterprise or other eligible
                complainant and you are not happy with our response, you have the right to
                refer your case to the Financial Ombudsman Service within six months of
                receiving our response.
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:complaint.info@financial-ombudsman.org.uk"
                    className="text-primary hover:underline"
                  >
                    complaint.info@financial-ombudsman.org.uk
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong> 0800 023 4567
                </li>
                <li>
                  <strong>Post:</strong> Financial Ombudsman Service, Exchange Tower, London
                  E14 9SR
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                The Financial Ombudsman Service is an independent body that deals with
                consumer complaints on financial services and products in the UK.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Details of each complaint are retained for five (5) years following complaint
              resolution.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
