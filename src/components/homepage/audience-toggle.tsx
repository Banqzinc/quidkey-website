import { useAudience, type Audience } from '@/context/audience'
import { track } from '@/lib/track'

const AUDIENCES: Array<{ id: Audience; label: string }> = [
  { id: 'merchants', label: 'Merchants' },
  { id: 'fintechs', label: 'Fintechs' },
]

type AudienceToggleProps = {
  size?: 'sm' | 'md' | 'lg' | 'dark'
  variant?: 'pill' | 'box'
  source?: 'nav' | 'hero'
}

export function AudienceToggle({ size = 'sm', variant = 'pill', source = 'nav' }: AudienceToggleProps) {
  const { audience, setAudience } = useAudience()

  const handleClick = (next: Audience) => {
    if (next === audience) return
    track({ name: 'homepage_audience_toggle', from: audience, to: next, source })
    setAudience(next)
  }

  return (
    <div
      className={`aud-toggle aud-toggle--${size} ${variant === 'box' ? 'aud-toggle--box' : ''}`}
      role="tablist"
      aria-label="Audience"
    >
      <span className="aud-toggle__thumb" data-pos={audience} />
      {AUDIENCES.map((a) => (
        <button
          key={a.id}
          type="button"
          role="tab"
          aria-selected={audience === a.id}
          className={`aud-toggle__btn ${audience === a.id ? 'is-on' : ''}`}
          onClick={() => handleClick(a.id)}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}

export function HeroAudienceToggle() {
  const { audience, setAudience } = useAudience()

  const handleClick = (next: Audience) => {
    if (next === audience) return
    track({ name: 'homepage_audience_toggle', from: audience, to: next, source: 'hero' })
    setAudience(next)
  }

  return (
    <div className="hero__aud" role="tablist" aria-label="Audience">
      <span className="hero__aud-lbl">I'm a</span>
      <button
        type="button"
        role="tab"
        aria-selected={audience === 'merchants'}
        className={`hero__aud-opt ${audience === 'merchants' ? 'is-on' : ''}`}
        onClick={() => handleClick('merchants')}
      >
        Merchant
      </button>
      <span className="hero__aud-sep" aria-hidden="true">/</span>
      <button
        type="button"
        role="tab"
        aria-selected={audience === 'fintechs'}
        className={`hero__aud-opt ${audience === 'fintechs' ? 'is-on' : ''}`}
        onClick={() => handleClick('fintechs')}
      >
        Fintech
      </button>
    </div>
  )
}
