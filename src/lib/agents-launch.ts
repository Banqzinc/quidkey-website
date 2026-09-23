// The launch switch for /agents. The page, its audience in the site switch,
// its footer link, its sitemap and llms.txt entries, its contact topic's page
// and the two files agents read (agents.md and .well-known/agent-registration.json)
// all follow `live`. Before launch the page answers 404 unless the URL carries
// ?preview=<previewToken>, which is how the campaign team sees it.
//
// To launch: set "live": true in agents-launch.json, run `npm run generate:seo`
// (or the build, which runs it) so the two agent files return to public/, then
// commit and merge. Nothing else changes.
import config from './agents-launch.json'

export type AgentsLaunch = { live: boolean; previewToken: string }

export const agentsLaunch: AgentsLaunch = config

/** Whether /agents renders for this request: always once live, else only with the preview token. */
export function agentsPageVisible(search: Record<string, unknown>, launch: AgentsLaunch = agentsLaunch): boolean {
  if (launch.live) return true
  return typeof search.preview === 'string' && search.preview.length > 0 && search.preview === launch.previewToken
}
