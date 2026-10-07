import { Box, Typography } from '@mui/material'
import { colors, layout } from '../../lib/theme'
import Supremebanner, { type HeroSlide } from './Supremebanner'
import { type IconComponent, ReturnIcon, TagIcon, TimerIcon, TruckIcon } from '../ui/icons'

/**
 * Top of the home page: the full-width banner slider, then a compact value strip (replaces the old "Feature cards"
 * and stats blocks). Quick order lives in the header (dialog), not on the page.
 */

const values: { icon: IconComponent; title: string; text: string }[] = [
  { icon: TimerIcon, title: 'Order in 10 minutes', text: 'Search by name or SKU, reorder Favorites' },
  { icon: TruckIcon, title: 'Same / next-day delivery', text: 'GTA, Hamilton & Niagara routes' },
  { icon: TagIcon, title: 'Wholesale pricing', text: 'Volume deals and weekly specials' },
  { icon: ReturnIcon, title: 'Easy returns', text: 'Damaged or wrong? We replace it' },
]

export function ValueStrip() {
  return (
    <Box component="ul" aria-label="Why order from MySupreme" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, gap: { xs: 1.5, md: 2 } }}>
      {values.map((v) => {
        const Icon = v.icon
        return (
          <Box component="li" key={v.title} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, py: { xs: 0.5, md: 0 } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: colors.sunken, color: colors.ink700, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 21 }} /></Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: { xs: 13.5, md: 14.5 }, fontWeight: 600, lineHeight: 1.3 }}>{v.title}</Typography>
              <Typography sx={{ fontSize: 13, color: colors.ink600, lineHeight: 1.35, display: { xs: 'none', sm: 'block' } }}>{v.text}</Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default function HomeHero({ slides }: { slides: HeroSlide[] }) {
  return (
    <Box component="section" aria-label="Welcome" sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, pt: { xs: 1.5, md: 2.5 }, pb: { xs: 3, md: 4 } }}>
      <Supremebanner slides={slides} />
      <Box sx={{ mt: { xs: 3, md: 4 }, pt: { xs: 2.5, md: 3 }, borderTop: `1px solid ${colors.line}` }}><ValueStrip /></Box>
    </Box>
  )
}
