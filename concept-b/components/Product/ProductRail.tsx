import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, IconButton } from '@mui/material'
import type { Product } from '../../lib/data'
import { colors, shadow } from '../../lib/theme'
import ProductCard, { type CardBadge } from './ProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'

/**
 * Horizontal scroller: swipe on touch, arrow buttons on desktop (hidden at the ends), scroll-snap, and a peek of the
 * next item so it's obvious there is more. Keyboard users tab through the cards; the list scrolls with focus.
 */
export function Rail({ children, itemWidth = { xs: '44%', sm: '30%', md: '23%', lg: '18.4%', xl: '15.6%' }, label }: { children: ReactNode; itemWidth?: Record<string, string>; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])
  useEffect(() => {
    sync()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sync])
  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' })
  const arrow = (dir: 1 | -1) => ({
    display: { xs: 'none', md: 'inline-flex' }, position: 'absolute', top: '38%', [dir === 1 ? 'right' : 'left']: -18, zIndex: 2, width: 44, height: 44,
    bgcolor: '#fff', border: `1px solid ${colors.line}`, boxShadow: shadow.md, color: colors.ink, borderRadius: '50%',
    '&:hover': { bgcolor: '#fff', borderColor: colors.line2, color: colors.redText },
  }) as const

  return (
    <Box sx={{ position: 'relative' }}>
      {!edge.start && <IconButton aria-label="Scroll left" onClick={() => page(-1)} sx={arrow(-1)}><ChevronLeftIcon /></IconButton>}
      <Box
        ref={ref}
        role="list"
        aria-label={label}
        onScroll={sync}
        sx={{
          display: 'grid', gridAutoFlow: 'column', gridAutoColumns: itemWidth, gap: { xs: 1.5, md: 2 }, overflowX: 'auto', overscrollBehaviorX: 'contain',
          scrollSnapType: 'x mandatory', scrollPaddingInline: 4, pb: 1, pt: 0.5, px: 0.5, mx: -0.5,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
          '& > *': { scrollSnapAlign: 'start', minWidth: 0 },
        }}
      >
        {children}
      </Box>
      {!edge.end && <IconButton aria-label="Scroll right" onClick={() => page(1)} sx={arrow(1)}><ChevronRightIcon /></IconButton>}
    </Box>
  )
}

export default function ProductRail({ products, label, badge }: { products: Product[]; label: string; badge?: (p: Product, i: number) => CardBadge | undefined }) {
  return (
    <Rail label={label}>
      {products.map((p, i) => (
        <Box role="listitem" key={p.sku}><ProductCard product={p} badge={badge?.(p, i)} /></Box>
      ))}
    </Rail>
  )
}
