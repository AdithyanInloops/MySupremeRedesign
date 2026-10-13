import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, IconButton } from '@mui/material'
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import { tokens } from '../../../theme'

const c = tokens.color

/** Horizontal scroll-snap rail with edge-aware arrows (desktop) — same behaviour as Concept B's shared Rail. */
export default function Rail({ children, label, itemWidth }: { children: ReactNode; label: string; itemWidth: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const sync = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
  }, [])
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => ro.disconnect()
  }, [sync])
  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' })
  const arrow = (dir: 1 | -1) => ({
    display: { xs: 'none', md: 'inline-flex' }, position: 'absolute', top: '38%', [dir === 1 ? 'right' : 'left']: -18, zIndex: 2, width: 44, height: 44,
    bgcolor: '#fff', border: `1px solid ${c.line}`, boxShadow: tokens.shadow.hover, color: c.ink, borderRadius: '50%',
    '&:hover': { bgcolor: '#fff', borderColor: c.line2, color: c.red },
  }) as const

  return (
    <Box sx={{ position: 'relative' }}>
      {!edge.start && <IconButton aria-label="Scroll left" onClick={() => page(-1)} sx={arrow(-1)}><ChevronLeftRounded /></IconButton>}
      <Box
        ref={ref}
        role="list"
        aria-label={label}
        onScroll={sync}
        sx={{
          display: 'grid', gridAutoFlow: 'column', gridAutoColumns: itemWidth, gap: { xs: 1.5, md: 2 },
          overflowX: 'auto', overscrollBehaviorX: 'contain', scrollSnapType: 'x mandatory', scrollPaddingInline: 4, pb: 1, pt: 0.5, px: 0.5, mx: -0.5,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, '& > *': { scrollSnapAlign: 'start', minWidth: 0 },
        }}
      >
        {children}
      </Box>
      {!edge.end && <IconButton aria-label="Scroll right" onClick={() => page(1)} sx={arrow(1)}><ChevronRightRounded /></IconButton>}
    </Box>
  )
}
