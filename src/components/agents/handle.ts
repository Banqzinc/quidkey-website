// Handle string logic shared by the API example and the owner form. A
// registration returns an owner_registration_url carrying the reserved handle,
// so the owner lands on /agents?handle=…#register with the form already naming it.

// The handle rule the discovery file publishes, minus the optional leading @:
// 3 to 30 letters, digits or hyphens, not starting or ending with a hyphen.
const HANDLE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9-]{1,28}[A-Za-z0-9]$/

/** The handle without its leading @, as it travels in a URL query. */
export function bareHandle(handle: string): string {
  return handle.trim().replace(/^@/, '')
}

/**
 * The message the owner form opens with when an agent sent its owner here.
 * Undefined when there is no handle, or when the value isn't one: the query
 * comes from a link anyone can write, so only a real handle reaches the form.
 */
export function handlePrefillMessage(raw: string | null): string | undefined {
  if (!raw) return undefined
  const handle = bareHandle(raw)
  if (!HANDLE_PATTERN.test(handle)) return undefined
  return `My agent reserved @${handle}.`
}

/** Where an owner lands to finish a registration: the register form, handle prefilled. */
export function ownerRegistrationUrl(handle: string): string {
  return `https://quidkey.com/agents?handle=${bareHandle(handle)}#register`
}
