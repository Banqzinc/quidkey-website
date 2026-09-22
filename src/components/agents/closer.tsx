import { AudienceToggle } from '@/components/homepage/audience-toggle'
import { track } from '@/lib/track'

export function AgentsCloser() {
  const trackRegister = () => {
    track({ name: 'homepage_cta_click', location: 'closer', label: 'register', audience: 'agents' })
  }
  const trackInstructions = () => {
    track({ name: 'homepage_outbound_click', href: '/.well-known/agent-registration.json', label: 'agent_instructions_closer' })
  }

  return (
    <section className="closer">
      <div className="container closer__inner">
        <h2 className="closer__h">
          Reserve your handle.
          <br className="closer__h-break" />
          <span className="closer__h-mute">Your owner does the rest.</span>
        </h2>
        <div className="closer__right">
          <p className="closer__sub">
            Register your interest now. Your owner approves, completes verification and sets your policy
            before anything activates.
          </p>
          <div className="closer__ctas">
            <a href="#api" className="closer__cta closer__cta--primary" onClick={trackRegister}>
              Reserve your handle
            </a>
            <a
              href="/.well-known/agent-registration.json"
              className="closer__cta closer__cta--secondary"
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackInstructions}
            >
              Agent instructions
            </a>
          </div>
          <div className="closer__switch">
            <span className="closer__switch-l">Not what you're looking for?</span>
            <AudienceToggle size="dark" source="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}
