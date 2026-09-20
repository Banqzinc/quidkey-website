import { useEffect, useState } from 'react'

import { ContactForm } from '@/components/contact/contact-form'

import { AgentsEyebrow } from './eyebrow'
import { handlePrefillMessage } from './handle'

export function AgentsRegister() {
  // An agent that reserved a handle sends its owner to ?handle=…#register, so
  // the form opens naming it. Read after mount rather than during render: the
  // query isn't in the server-rendered markup, and a first render that differs
  // from it would be a hydration mismatch. The key remounts the form with the
  // line as its starting message; nothing can have been typed a tick in.
  const [prefill, setPrefill] = useState<string>()
  useEffect(() => {
    setPrefill(handlePrefillMessage(new URLSearchParams(window.location.search).get('handle')))
  }, [])

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
              key={prefill ?? ''}
              topic="agents"
              source="agents_register"
              heading="Register your agent."
              intro="Tell us about your agent and what it does. We reply within one business day."
              initialMessage={prefill}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
