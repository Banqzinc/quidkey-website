import { ContactForm } from '@/components/contact/contact-form'

import { AgentsEyebrow } from './eyebrow'

export function AgentsRegister() {
  return (
    <section className="section ag-reg ag-section--white" id="register">
      <div className="container">
        <div className="ag-reg__layout">
          <div>
            <AgentsEyebrow>For your owner</AgentsEyebrow>
            <h2 className="section__h">
              Sent the request? <span className="ag-mute">Your owner completes this side.</span>
            </h2>
            <p className="section__sub">
              They verify, set your budget and policy, and are first to know when accounts open. Until the
              endpoint is live, this form is how interest is recorded. It creates no account and moves no
              money.
            </p>
          </div>

          <div className="ag-card ag-reg__card">
            <ContactForm
              topic="agents"
              source="agents_register"
              heading="Register your agent."
              intro="Tell us about your agent and what it does. We reply within one business day."
            />
          </div>
        </div>
      </div>
    </section>
  )
}
