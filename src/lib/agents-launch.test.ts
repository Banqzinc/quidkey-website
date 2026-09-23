import { describe, expect, it } from 'vitest'

import { agentsLaunch, agentsPageVisible, type AgentsLaunch } from './agents-launch'

const hidden: AgentsLaunch = { live: false, previewToken: 'secret-token' }
const live: AgentsLaunch = { live: true, previewToken: 'secret-token' }

describe('the /agents launch switch', () => {
  it('is a boolean and a preview token long enough not to be guessed', () => {
    expect(typeof agentsLaunch.live).toBe('boolean')
    expect(agentsLaunch.previewToken.length).toBeGreaterThanOrEqual(16)
  })

  it('shows the page to everyone once live, whatever the query says', () => {
    expect(agentsPageVisible({}, live)).toBe(true)
    expect(agentsPageVisible({ preview: 'wrong' }, live)).toBe(true)
  })

  it('hides the page before launch unless the preview token is in the query', () => {
    expect(agentsPageVisible({}, hidden)).toBe(false)
    expect(agentsPageVisible({ preview: 'wrong' }, hidden)).toBe(false)
    expect(agentsPageVisible({ preview: 42 }, hidden)).toBe(false)
    expect(agentsPageVisible({ preview: 'secret-token' }, hidden)).toBe(true)
  })
})
