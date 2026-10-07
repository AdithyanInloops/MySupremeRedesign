import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Box, Skeleton } from '@mui/material'
import { colors, radius, z } from '../../lib/theme'

/* ------------------------------------------------------------------ Skeletons (same footprint as the real thing) */

export function ProductCardSkeleton() {
  return (
    <Box aria-hidden sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.lg, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Skeleton variant="rounded" sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }} />
      <Skeleton width="40%" height={16} />
      <Skeleton width="95%" height={18} />
      <Skeleton width="70%" height={18} />
      <Skeleton width="35%" height={24} />
      <Skeleton variant="rounded" height={44} />
    </Box>
  )
}

export function ProductGridSkeleton({ count = 8, columns }: { count?: number; columns?: Record<string, string> }) {
  return (
    <Box role="status" aria-label="Loading products" sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: columns ?? { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(3, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
      {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
    </Box>
  )
}

export function LineItemSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Box role="status" aria-label="Loading" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: rows }, (_, i) => (
        <Box key={i} aria-hidden sx={{ display: 'grid', gridTemplateColumns: '80px minmax(0,1fr)', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="rounded" width={80} height={80} />
          <Box><Skeleton width="30%" /><Skeleton width="80%" height={22} /><Skeleton width="45%" /></Box>
        </Box>
      ))}
    </Box>
  )
}

/* ------------------------------------------------------------------ Sticky mobile action bar */

/**
 * Fixed bottom bar below 800px (cart total + checkout, product add-to-cart…). It publishes its height in
 * `--sticky-bottom` so the floating voice/chat buttons and toasts move up and never cover it.
 */
export function StickyBottomBar({ children, show = true }: { children: ReactNode; show?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const root = document.documentElement
    if (!el || !show) return
    const mq = window.matchMedia('(max-width: 799.98px)')
    const sync = () => root.style.setProperty('--sticky-bottom', mq.matches ? `${el.offsetHeight}px` : '0px')
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    mq.addEventListener('change', sync)
    return () => { ro.disconnect(); mq.removeEventListener('change', sync); root.style.setProperty('--sticky-bottom', '0px') }
  }, [show])
  if (!show) return null
  return (
    <>
      {/* Spacer so the end of the page can scroll above the bar. */}
      <Box aria-hidden sx={{ display: { xs: 'block', md: 'none' }, height: 'var(--sticky-bottom)' }} />
      <Box
        ref={ref}
        sx={{
          display: { xs: 'block', md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: z.stickyBar, bgcolor: '#fff',
          borderTop: `1px solid ${colors.line}`, boxShadow: '0 -8px 24px -12px rgba(16,24,40,.18)', px: 2, pt: 1.25, pb: 'calc(10px + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ Route progress */

/** Thin red bar at the very top while a page is loading — appears only if navigation takes longer than 120ms. */
export function RouteProgress() {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  useEffect(() => {
    let t: number | undefined
    let d: number | undefined
    const start = (url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return
      window.clearTimeout(d)
      t = window.setTimeout(() => setState('loading'), 120)
    }
    const end = () => {
      window.clearTimeout(t)
      setState((s) => (s === 'loading' ? 'done' : 'idle'))
      d = window.setTimeout(() => setState('idle'), 300)
    }
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', end)
    router.events.on('routeChangeError', end)
    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', end)
      router.events.off('routeChangeError', end)
      window.clearTimeout(t)
      window.clearTimeout(d)
    }
  }, [router.events])
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed', top: 0, left: 0, height: 3, zIndex: z.toast + 1, bgcolor: colors.red, pointerEvents: 'none',
        width: state === 'idle' ? 0 : state === 'loading' ? '80%' : '100%', opacity: state === 'done' ? 0 : 1,
        transition: state === 'loading' ? 'width 8s cubic-bezier(.1,.6,.2,1)' : state === 'done' ? 'width .2s ease, opacity .3s ease .1s' : 'none',
      }}
    />
  )
}

/* ------------------------------------------------------------------ Skip link */

export function SkipLink() {
  return (
    <Box
      component="a"
      href="#main"
      sx={{
        position: 'absolute', left: 12, top: -80, zIndex: z.toast + 2, bgcolor: colors.navy, color: '#fff', px: 2, py: 1.25, borderRadius: radius.md, fontWeight: 600, fontSize: 14,
        textDecoration: 'none', '&:focus': { top: 12, outline: '2px solid #fff', outlineOffset: 2 },
      }}
    >
      Skip to main content
    </Box>
  )
}
