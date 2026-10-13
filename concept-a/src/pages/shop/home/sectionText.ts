import { tokens } from '../../../theme'

/** Concept B heading styles shared by the bottom home sections (overline eyebrow + section title). */
export const overlineSx = { fontSize: 12, fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.color.red } as const
export const h2Sx = { fontSize: { xs: 21, md: 26 }, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', color: tokens.color.ink }
/** Visually hidden but read by screen readers. */
export const srOnly = { position: 'absolute', width: 1, height: 1, p: 0, m: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 } as const
