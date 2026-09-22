import { useRouter, useRouterState } from '@tanstack/react-router'

import { AUDIENCES, audiencePath, useAudience, type Audience } from '@/context/audience'
import { track, type ToggleSource } from '@/lib/track'

// One label set for the segmented pill, one for the "I'm a ..." hero line.
const LABELS: Record<Audience, { pill: string; hero: string }> = {
  merchants: { pill: 'Merchants', hero: 'Merchant' },
  fintechs: { pill: 'Fintechs', hero: 'Fintech' },
  agents: { pill: 'AI agents', hero: 'AI agent' },
}

type AudienceToggleProps = {
  size?: 'sm' | 'md' | 'lg' | 'dark'
  variant?: 'pill' | 'box'
  source?: ToggleSource
}

export function AudienceToggle({ size = 'sm', variant = 'pill', source = 'nav' }: AudienceToggleProps) {
  const { audience, setAudience } = useAudience()
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const handleClick = (next: Audience) => {
    if (next === audience) return
    track({ name: 'homepage_audience_toggle', from: audience, to: next, source })
    setAudience(next)
    const target = audiencePath(next)
    if (pathname !== target) {
      router.navigate({ to: target })
    }
  }

  return (
    <div
      className={`aud-toggle aud-toggle--${size} ${variant === 'box' ? 'aud-toggle--box' : ''}`}
      role="tablist"
      aria-label="Audience"
    >
      <span className="aud-toggle__thumb" data-pos={audience} />
      {AUDIENCES.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={audience === id}
          className={`aud-toggle__btn ${audience === id ? 'is-on' : ''}`}
          onClick={() => handleClick(id)}
        >
          {LABELS[id].pill}
        </button>
      ))}
    </div>
  )
}

type HeroAudienceToggleProps = {
  source?: ToggleSource
}

export function HeroAudienceToggle({ source = 'nav' }: HeroAudienceToggleProps = {}) {
  const { audience, setAudience } = useAudience()
  const router = useRouter()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const handleClick = (next: Audience) => {
    // Always navigate when the target path differs (even if `audience` already
    // matches `next`) — landing on `/` with audience='fintechs' from a prior
    // session would otherwise leave clicks dead.
    const target = audiencePath(next)
    if (next !== audience) {
      track({ name: 'homepage_audience_toggle', from: audience, to: next, source })
      setAudience(next)
    }
    if (pathname !== target) {
      router.navigate({ to: target })
    }
  }

  return (
    <div className="hero__aud" role="tablist" aria-label="Audience">
      <span className="hero__aud-lbl">I'm a</span>
      {AUDIENCES.map((id, index) => (
        <span key={id} className="hero__aud-item">
          {index > 0 ? (
            <span className="hero__aud-sep" aria-hidden="true">
              /
            </span>
          ) : null}
          <button
            type="button"
            role="tab"
            aria-selected={audience === id}
            className={`hero__aud-opt ${audience === id ? 'is-on' : ''}`}
            onClick={() => handleClick(id)}
          >
            {LABELS[id].hero}
          </button>
        </span>
      ))}
    </div>
  )
}
