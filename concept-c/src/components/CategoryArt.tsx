import type { ReactNode } from 'react'
import { Box } from '@mui/material'

/**
 * Two-tone department illustrations (our own SVGs, 48×48 grid, 2px strokes) for the Home category row. Each
 * department has a soft tile colour, a deep line colour and a mid fill, so the row reads at a glance without photos.
 */
type Tone = { bg: string; ink: string; fill: string; light: string }
export const CATEGORY_TONES: Record<string, Tone> = {
  packaging: { bg: '#FBF1E6', ink: '#8A5A2B', fill: '#F1D3AE', light: '#FFF8EF' },
  grocery: { bg: '#FAF4DE', ink: '#7A5E12', fill: '#EFDB94', light: '#FFFBEA' },
  frozen: { bg: '#E7F2FA', ink: '#2B6A94', fill: '#BCDCF1', light: '#F4FAFE' },
  produce: { bg: '#E8F4E9', ink: '#2F6B3A', fill: '#B9E0BE', light: '#F3FBF4' },
  'dairy-eggs': { bg: '#FDF6EA', ink: '#86662B', fill: '#F6E2B8', light: '#FFFFFF' },
  beverage: { bg: '#ECEEFC', ink: '#3B4A9A', fill: '#C7CFF5', light: '#F6F7FF' },
  'meat-poultry': { bg: '#FBECEB', ink: '#983C36', fill: '#F2C4BF', light: '#FFFFFF' },
  janitorial: { bg: '#EFECFA', ink: '#5A4A98', fill: '#D3CBF2', light: '#FAF8FF' },
  'ware-equipment': { bg: '#EDEFF3', ink: '#4B5563', fill: '#D3D8E0', light: '#F8F9FB' },
}

const ART: Record<string, (t: Tone) => ReactNode> = {
  // take-out box with wire handle
  packaging: (t) => (
    <>
      <path d="M19 13c0-5 10-5 10 0" />
      <path d="M9 21h30l-3.2 18.4a3 3 0 0 1-3 2.6H15.2a3 3 0 0 1-3-2.6z" fill={t.fill} />
      <path d="M9 21l5-8h20l5 8" fill={t.light} />
      <path d="M24 21v21" opacity=".45" />
    </>
  ),
  // tied sack of rice with a label
  grocery: (t) => (
    <>
      <path d="M15 19c-3.5 6-3.5 15 0 21a3 3 0 0 0 2.6 1.5h12.8A3 3 0 0 0 33 40c3.5-6 3.5-15 0-21z" fill={t.fill} />
      <path d="M17 19c1.6-3.6 1.6-7 0-10h14c-1.6 3-1.6 6.4 0 10" fill={t.light} />
      <path d="M15.5 19h17" />
      <rect x="18.5" y="26" width="11" height="8" rx="2" fill={t.light} />
    </>
  ),
  // snowflake in an ice cube
  frozen: (t) => (
    <>
      <rect x="8.5" y="8.5" width="31" height="31" rx="8" fill={t.fill} />
      <path d="M24 14.5v19M15.8 19.25l16.4 9.5M15.8 28.75l16.4-9.5" />
      <path d="M21 16.8l3 2.4 3-2.4M21 31.2l3-2.4 3 2.4" />
    </>
  ),
  // apple with leaf
  produce: (t) => (
    <>
      <path d="M24 17.5c-3-2.3-10.5-2.6-12 4.6-1.4 6.8 2.6 16 7.8 17 1.7.3 2.9-.7 4.2-.7s2.5 1 4.2.7c5.2-1 9.2-10.2 7.8-17-1.5-7.2-9-6.9-12-4.6z" fill={t.fill} />
      <path d="M24 17.5c0-3 1-5.5 3-7.5" />
      <path d="M27.2 11.4c2.8-3.2 7-3.6 9.3-1.6-2 3.4-6.3 4.4-9.3 1.6z" fill={t.light} />
    </>
  ),
  // milk carton and an egg
  'dairy-eggs': (t) => (
    <>
      <path d="M10.5 18.5l4-7h10l4 7V39a2.5 2.5 0 0 1-2.5 2.5H13A2.5 2.5 0 0 1 10.5 39z" fill={t.fill} />
      <path d="M14.5 11.5v-4h10v4" />
      <path d="M10.5 18.5h18" />
      <path d="M10.5 28c3 2 6 2 9 0s6-2 9 0" />
      <path d="M37 25c3 0 5.5 5.2 5.5 9.2a5.5 5.5 0 0 1-11 0c0-4 2.5-9.2 5.5-9.2z" fill={t.light} />
    </>
  ),
  // bottle and a can
  beverage: (t) => (
    <>
      <path d="M16.5 7h6v6l3 5v21.5A2.5 2.5 0 0 1 23 42h-7a2.5 2.5 0 0 1-2.5-2.5V18l3-5z" fill={t.fill} />
      <rect x="13.5" y="24" width="12" height="8" rx="1.5" fill={t.light} />
      <rect x="29" y="20" width="11.5" height="22" rx="3" fill={t.light} />
      <path d="M29 24.5h11.5M29 37.5h11.5" />
    </>
  ),
  // drumstick
  'meat-poultry': (t) => (
    <>
      <path d="M24.6 25.4c-4.2-4.2-4-11.2 1.1-15 4.6-3.4 11.6-1.8 13.6 3.6 2.1 6.1-3.1 12.2-9.3 12.4z" fill={t.fill} />
      <path d="M24.8 25.2l-8.6 8.6" />
      <circle cx="12.6" cy="35.6" r="2.8" fill={t.light} />
      <circle cx="15.4" cy="38.4" r="2.8" fill={t.light} />
      <path d="M30 14.5c2.5-.5 4.5.5 5.5 2.5" opacity=".55" />
    </>
  ),
  // spray bottle with mist
  janitorial: (t) => (
    <>
      <path d="M15 23h13l2.5 6.5V40a2 2 0 0 1-2 2H14.5a2 2 0 0 1-2-2V29.5z" fill={t.fill} />
      <path d="M17.5 23v-5.5h10l6 3.5-1.5 2.5h-4.5V23" fill={t.light} />
      <path d="M17.5 17.5h-3.5" />
      <rect x="16.5" y="31" width="10" height="7" rx="1.5" fill={t.light} />
      <circle cx="38" cy="15" r="1.1" fill={t.ink} stroke="none" />
      <circle cx="41.5" cy="19" r="1.1" fill={t.ink} stroke="none" />
      <circle cx="38" cy="22.5" r="1.1" fill={t.ink} stroke="none" />
    </>
  ),
  // stock pot with lid and steam
  'ware-equipment': (t) => (
    <>
      <path d="M19 9c-1.4-1.6 1.4-2.8 0-4.6M29 9c-1.4-1.6 1.4-2.8 0-4.6" />
      <path d="M14.5 21.5c0-4.6 4.3-7.5 9.5-7.5s9.5 2.9 9.5 7.5" fill={t.light} />
      <path d="M22 14v-2h4v2" />
      <path d="M11 22h26v12.5a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6z" fill={t.fill} />
      <path d="M8.5 22h31M11 26.5H7M37 26.5h4" />
    </>
  ),
}

export default function CategoryArt({ slug, size = 38 }: { slug: string; size?: number }) {
  const t = CATEGORY_TONES[slug] ?? CATEGORY_TONES['ware-equipment']
  const draw = ART[slug] ?? ART['ware-equipment']
  return (
    <Box component="svg" viewBox="0 0 48 48" aria-hidden sx={{ width: size, height: size, display: 'block', flexShrink: 0 }}
      fill="none" stroke={t.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {draw(t)}
    </Box>
  )
}
