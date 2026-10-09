import { Box } from '@mui/material'
import { tokens } from '../theme'

const c = tokens.color

/** Star-shaped price burst (flyer sticker). */
export default function Burst({ children, size = 54, fill = c.saffron, color = c.ink }: { children: React.ReactNode; size?: number; fill?: string; color?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => { const r = i % 2 ? 41 : 50; const a = (Math.PI * 2 * i) / 32 - Math.PI / 2; return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}` }).join(' ')
  return (
    <Box aria-hidden sx={{ position: 'relative', width: size, height: size, transform: 'rotate(-10deg)', filter: 'drop-shadow(0 3px 6px rgba(17,24,39,.2))' }}>
      <Box component="svg" viewBox="0 0 100 100" sx={{ position: 'absolute', inset: 0 }}><polygon points={pts} fill={fill} /></Box>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color, fontWeight: 800, lineHeight: 1 }}>{children}</Box>
    </Box>
  )
}
