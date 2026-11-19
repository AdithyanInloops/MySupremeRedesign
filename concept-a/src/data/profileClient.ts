import type { Draft, Patch, Profile } from './profile'

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  // shortcut: stands in for the customer session the server reads (server/api.ts accountOf); remove once real auth exists.
  document.cookie = 'ms_account=demo; path=/; SameSite=Lax'
  const res = await fetch(`/api/profile${path}`, { ...init, headers: { 'Content-Type': 'application/json' } })
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `HTTP ${res.status}`)
  return res.json()
}

export const getDraft = (placeId: string, sessionToken: string | undefined, signal?: AbortSignal) =>
  call<Draft>('/draft', { method: 'POST', body: JSON.stringify({ placeId, sessionToken }), signal })
export const getProfile = () => call<Profile>('')
export const saveProfile = (patch: Patch & { suggestedByGoogle?: string[] }) => call<Profile>('', { method: 'PUT', body: JSON.stringify(patch) })
