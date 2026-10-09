import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Typography, type SxProps, type Theme } from '@mui/material'
import { tokens, focusRing, pressable, srOnly } from '../theme'
import { useApp } from '../state/app'
import { money, warehouses } from '../data/catalog'
import BannerCarousel from '../components/BannerCarousel'
import Burst from '../components/Burst'
import LiveSection from '../components/LiveSection'
import { AddToCart, LiveImage, live } from '../components/LiveProductCard'
import { productPath } from '../components/ProductCard'
import { HScroll } from '../components/ui'
import { useDragScroll } from '../components/useDragScroll'
import { BoxIcon, CalendarIcon, ChevronRightIcon, ClockIcon, FlameIcon, TagIcon, UtensilsIcon, type IconComponent } from '../components/icons'
import { isLive, parseBlock, productsFor, resolveLink, timeLeft, type DealItem } from './resolve'
import type { Accent, CmsBlock, CmsIcon, CmsLink, DealProductsBlock, FlyerTabsBlock, FlyerTilesBlock, OfferHeroBlock } from './types'

/*
 * Offers & Flyers, built from CMS blocks. Each component draws one block type/variant from its JSON (see ./types.ts);
 * everything a content manager can change — text, images, links, dates, warehouses, which products — comes from the
 * block, and prices come from the products themselves.
 */

const c = tokens.color
/**
 * The offers section's own palette: muted pastel greens. Text on a pastel is always `deep` (≥ 6:1); `main` is only
 * used on white (links, Add to cart, borders) where it stays ≥ 5:1.
 */
export const GREEN = { main: '#3B7A57', deep: '#24563D', wash: '#F2F7F3', mint: '#E2ECE4', line: '#C9DDD0' }
export const ACCENT: Record<Accent, { solid: string; border: string; bg: string; fg: string; iconOnWhite: string }> = {
  sage: { solid: '#E2ECE4', border: '#9CBFA8', bg: 'linear-gradient(140deg, #EEF4EF 0%, #E2ECE4 55%, #D5E4D9 100%)', fg: GREEN.deep, iconOnWhite: GREEN.main },
  mint: { solid: '#DFF0E5', border: '#94C9A8', bg: 'linear-gradient(140deg, #EDF7F0 0%, #DFF0E5 55%, #CFE7D8 100%)', fg: GREEN.deep, iconOnWhite: GREEN.main },
  seafoam: { solid: '#DAEDE7', border: '#8FC3B2', bg: 'linear-gradient(140deg, #EAF5F2 0%, #DAEDE7 55%, #C8E3DA 100%)', fg: GREEN.deep, iconOnWhite: '#3A7565' },
  pistachio: { solid: '#E7EDD1', border: '#B4C48A', bg: 'linear-gradient(140deg, #F3F6E6 0%, #E7EDD1 55%, #D9E3BC 100%)', fg: GREEN.deep, iconOnWhite: '#5B6E2E' },
}
const ICON: Record<CmsIcon, IconComponent> = { tag: TagIcon, flame: FlameIcon, calendar: CalendarIcon, box: BoxIcon, utensils: UtensilsIcon }
/** CMS image src: absolute URLs (Magento media) as they are; relative paths from this app's public folder. */
const asset = (src: string) => (/^https?:\/\//.test(src) ? src : `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`)
const stripes = (fg: string) => `repeating-linear-gradient(135deg, ${fg === '#fff' ? 'rgba(255,255,255,.06)' : 'rgba(36,86,61,.04)'} 0 12px, transparent 12px 24px)`

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(t) }, [])
  return now
}

/** A tappable area that goes wherever the CMS link points (screen, or an external page in a new tab). */
function CmsLinkBox({ link, label, sx, children }: { link?: CmsLink; label?: string; sx: SxProps<Theme>; children: ReactNode }) {
  const { to, href } = resolveLink(link)
  if (to) return <Box component={RouterLink} to={to} aria-label={label} draggable={false} sx={sx}>{children}</Box>
  if (href) return <Box component="a" href={href} target="_blank" rel="noopener noreferrer" aria-label={label} draggable={false} sx={sx}>{children}</Box>
  return <Box aria-label={label} role={label ? 'group' : undefined} sx={sx}>{children}</Box>
}

/** Block heading from `title` + `show_all_link`. */
function Frame({ block, mt, children }: { block: CmsBlock; mt?: number; children: ReactNode }) {
  const id = useId()
  return <LiveSection id={id} title={block.title} mt={mt} linkColor={GREEN.main} {...resolveLink(block.show_all_link)}>{children}</LiveSection>
}

function Countdown({ to, now, tone = 'dark', sx }: { to: string; now: number; tone?: 'dark' | 'light' | 'ink'; sx?: SxProps<Theme> }) {
  // dark = on artwork (a soft white chip), light = on a dark surface, ink = on a pastel
  const bg = { dark: 'rgba(255,255,255,.92)', light: 'rgba(255,255,255,.2)', ink: 'rgba(36,86,61,.1)' }[tone]
  return (
    <Box role="timer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 999, fontSize: 12, fontWeight: 700, color: tone === 'light' ? '#fff' : GREEN.deep, bgcolor: bg, boxShadow: tone === 'dark' ? '0 2px 8px -2px rgba(36,86,61,.35)' : 'none', ...((sx as object) ?? {}) }}>
      <ClockIcon sx={{ fontSize: 14 }} /> Ends in {timeLeft(to, now)}
    </Box>
  )
}

function Sticker({ text, size = 66, onDark = true }: { text: string; size?: number; onDark?: boolean }) {
  return (
    <Burst size={size} fill={onDark ? '#fff' : GREEN.main} color={onDark ? GREEN.deep : '#fff'}>
      <Box component="span" sx={{ px: 1, fontSize: size > 64 ? 12 : 10.5, lineHeight: 1.05, textAlign: 'center', whiteSpace: 'normal' }}>{text}</Box>
    </Burst>
  )
}

/**
 * Deal card — the Home product card (white photo well, grey text area, name, price, Add to cart) with the offer shown
 * as the price difference: offer price, the regular price struck through, and the saving. No % badge, no extra colour:
 * hierarchy comes from size and weight only.
 */
export function DealCard({ item, onPoster = false, width = 150 }: { item: DealItem; onPoster?: boolean; width?: number | string }) {
  const { product, final, regular, offerId } = item
  const href = productPath(product)
  const saving = regular - final
  return (
    <Box component="article" aria-label={`${product.name}, ${money(final)}${saving > 0 ? `, was ${money(regular)}` : ''}`}
      sx={{ width, flexShrink: 0, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: live.body, color: c.ink, border: `1px solid ${live.border}`, borderRadius: `${live.radius}px`, overflow: 'hidden', boxShadow: onPoster ? '0 10px 22px -16px rgba(36,86,61,.4)' : 'none', scrollSnapAlign: 'start' }}>
      <Box component={RouterLink} to={href} tabIndex={-1} aria-hidden draggable={false} sx={{ display: 'block' }}><LiveImage product={product} /></Box>
      <Box sx={{ px: 1.25, pt: 1, pb: 1.25, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box component={RouterLink} to={href} draggable={false} sx={{ color: 'inherit', textDecoration: 'none', borderRadius: 1, ...focusRing }}>
          <Typography component="h3" title={product.name} sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35, minHeight: '2.7em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', overflowWrap: 'anywhere' }}>{product.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mt: 0.75, flexWrap: 'wrap', position: 'relative' }}>
          <Typography component="span" sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>{money(final)}</Typography>
          {saving > 0 && <Typography component="span" sx={{ fontSize: 12.5, color: c.text3, textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}><Box component="span" sx={srOnly}>Regular price </Box>{money(regular)}</Typography>}
        </Box>
        <Typography sx={{ minHeight: '1.5em', fontSize: 12, color: c.text2 }}>{saving > 0 ? `You save ${money(saving)}` : ''}</Typography>
        <Box sx={{ mt: 'auto', pt: 1 }}><AddToCart product={product} offerId={offerId} size="sm" tone="green" /></Box>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ banner · offer-hero */

export function OfferHero({ block, mt }: { block: OfferHeroBlock; mt?: number }) {
  const { warehouse } = useApp()
  const now = useNow()
  const items = block.items.filter((it) => isLive(it, warehouse, now))
  if (!items.length) return null
  return (
    <Frame block={block} mt={mt}>
      <BannerCarousel label={block.title ?? 'Offers'} slides={items.map((it) => ({ src: asset(it.src), alt: it.title, ...resolveLink(it.link) }))}
        overlay={(k) => {
          const it = items[k]
          return (
            <>
              {it.sticker && <Box sx={{ position: 'absolute', top: 10, right: 10 }}><Sticker text={it.sticker} size={74} onDark={false} /></Box>}
              {it.countdown !== false && it.ends_at && <Countdown to={it.ends_at} now={now} sx={{ position: 'absolute', left: 10, bottom: 10 }} />}
            </>
          )
        }} />
    </Frame>
  )
}

/* ------------------------------------------------------------------ grid · flyer-tiles */

export function FlyerTiles({ block, mt }: { block: FlyerTilesBlock; mt?: number }) {
  const { warehouse } = useApp()
  const now = useNow()
  const items = block.items.filter((it) => isLive(it, warehouse, now))
  if (!items.length) return null
  const three = block.columns === 3
  return (
    <Frame block={block} mt={mt}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 2, display: 'grid', gridTemplateColumns: `repeat(${three ? 3 : 2}, minmax(0,1fr))`, gap: three ? 1 : 1.25 }}>
        {items.map((it, k) => {
          const a = ACCENT[it.accent ?? 'sage']
          const Icon = ICON[it.icon ?? 'tag']
          const label = [it.title, it.subtitle, it.ends_at ? `ends in ${timeLeft(it.ends_at, now)}` : ''].filter(Boolean).join(', ')
          const tile = { position: 'relative', display: 'block', aspectRatio: '4 / 5', borderRadius: '14px', overflow: 'hidden', textDecoration: 'none', ...pressable, ...focusRing } as const
          return (
            <li key={`${k}-${it.title}`}>
              {it.src ? (
                <CmsLinkBox link={it.link} label={label} sx={{ ...tile, bgcolor: '#EEF0F3' }}>
                  <Box component="img" src={asset(it.src)} alt="" loading="lazy" draggable={false} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  {it.ends_at && <Countdown to={it.ends_at} now={now} sx={{ position: 'absolute', left: 8, bottom: 8, fontSize: 11 }} />}
                </CmsLinkBox>
              ) : (
                <CmsLinkBox link={it.link} label={label} sx={{ ...tile, background: a.bg, color: a.fg, p: three ? 1.25 : 1.75, display: 'flex', flexDirection: 'column' }}>
                  <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: stripes(a.fg) }} />
                  <Icon sx={{ position: 'relative', fontSize: three ? 20 : 24 }} />
                  <Typography sx={{ position: 'relative', mt: 1, fontSize: three ? 15 : 21, fontWeight: 800, lineHeight: 1.05, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{it.title}</Typography>
                  {it.subtitle && <Typography sx={{ position: 'relative', mt: 0.75, fontSize: three ? 11 : 12.5, lineHeight: 1.35, opacity: 0.9 }}>{it.subtitle}</Typography>}
                  {it.ends_at && <Countdown to={it.ends_at} now={now} tone={a.fg === '#fff' ? 'light' : 'ink'} sx={{ position: 'relative', alignSelf: 'flex-start', mt: 1, fontSize: 11 }} />}
                  <Box sx={{ position: 'relative', mt: 'auto', display: 'flex', alignItems: 'center', gap: 0.25, fontSize: 13, fontWeight: 700 }}>Shop now <ChevronRightIcon sx={{ fontSize: 17 }} /></Box>
                  {it.sticker && !three && <Box sx={{ position: 'absolute', right: 8, bottom: 8 }}><Sticker text={it.sticker} size={62} onDark={a.fg === '#fff'} /></Box>}
                </CmsLinkBox>
              )}
            </li>
          )
        })}
      </Box>
    </Frame>
  )
}

/* ------------------------------------------------------------------ rail · deal-products */

export function DealRail({ block, mt }: { block: DealProductsBlock; mt?: number }) {
  const { warehouse } = useApp()
  const items = useMemo(() => productsFor(block.source, warehouse), [block.source, warehouse])
  if (!items.length) return null
  return (
    <Frame block={block} mt={mt}>
      <HScroll gap={1.25}>{items.map((d) => <DealCard key={d.product.sku} item={d} />)}</HScroll>
    </Frame>
  )
}

/* ------------------------------------------------------------------ rail · flyer-tabs */

type Flyer = { key: string; label: string; accent: Accent; icon: CmsIcon; headline: string; body?: string; ends?: string; link: CmsLink; deals: DealItem[] }

export function FlyerTabs({ block, mt }: { block: FlyerTabsBlock; mt?: number }) {
  const { warehouse } = useApp()
  const now = useNow()
  const uid = useId()
  const [sel, setSel] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rail = useDragScroll<HTMLDivElement>()

  const flyers: Flyer[] = useMemo(() => {
    const list = block.tabs.filter((t) => isLive(t, warehouse, now)).map((t, i) => {
      const deals = productsFor(t.source, warehouse)
      const max = Math.max(0, ...deals.map((d) => d.pct))
      return { key: `t${i}`, label: t.label, accent: t.accent ?? 'sage', icon: t.icon ?? 'tag', headline: (t.headline ?? 'Save up to {max_off}%').replace('{max_off}', String(max)), body: t.body, ends: t.ends_at, link: t.link ?? (t.source.category ? `category/${t.source.category}` : 'page/flyers'), deals }
    }).filter((f) => f.deals.length)
    const showTabs = block.show_tabs !== false
    if (showTabs && (block.all_tab === false || list.length < 2)) return list
    if (!list.length) return list
    const seen = new Set<string>()
    const all = list.flatMap((f) => f.deals).filter((d) => (seen.has(d.product.sku) ? false : (seen.add(d.product.sku), true))).sort((a, b) => b.pct - a.pct)
    const wh = warehouses.find((w) => w.id === warehouse) ?? warehouses[0]
    const merged: Flyer = { key: 'all', label: block.all_tab || 'All offers', accent: block.all_accent ?? 'sage', icon: 'tag', headline: `Save up to ${Math.max(0, ...all.map((d) => d.pct))}%`, body: `${all.length} deals on this week’s flyers at ${wh.name}`, ends: list.map((f) => f.ends).filter(Boolean).sort()[0], link: 'page/flyers', deals: all }
    return showTabs ? [merged, ...list] : [merged]
  }, [block, warehouse, now])

  const active = Math.min(sel, Math.max(0, flyers.length - 1))
  useEffect(() => { rail.ref.current?.scrollTo({ left: 0 }) }, [active, rail.ref])
  if (!flyers.length) return null

  const f = flyers[active]
  const a = ACCENT[f.accent]
  const Icon = ICON[f.icon]
  const max = Math.max(0, ...f.deals.map((d) => d.pct))
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? flyers.length - 1 : null
    if (n === null) return
    e.preventDefault()
    const k = (n + flyers.length) % flyers.length
    setSel(k); tabRefs.current[k]?.focus()
  }

  return (
    <Frame block={block} mt={mt}>
      {block.show_tabs !== false && <Box role="tablist" aria-label="Flyers" className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', px: 2, pb: 0.25, mb: 1.25 }}>
        {flyers.map((t, i) => {
          const on = i === active
          const s = ACCENT[t.accent]
          const TIcon = ICON[t.icon]
          return (
            <Box key={t.key} component="button" ref={(el: HTMLButtonElement | null) => { tabRefs.current[i] = el }} role="tab" id={`${uid}-tab-${i}`} aria-selected={on} aria-controls={`${uid}-panel`} tabIndex={on ? 0 : -1}
              onClick={() => setSel(i)} onKeyDown={(e: KeyboardEvent) => onKey(e, i)}
              sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 38, pl: 1.25, pr: 0.75, borderRadius: 999, whiteSpace: 'nowrap', fontSize: 13.5, fontWeight: 600, border: `1.5px solid ${on ? s.border : live.border}`, bgcolor: on ? s.solid : '#fff', color: on ? s.fg : c.ink, ...pressable, transition: `background-color ${tokens.motion.fast}, transform ${tokens.motion.fast}`, ...focusRing }}>
              <TIcon sx={{ fontSize: 17, color: on ? 'inherit' : s.iconOnWhite }} />
              {t.label}
              <Box component="span" sx={{ position: 'relative', minWidth: 22, px: 0.75, borderRadius: 999, fontSize: 11.5, fontWeight: 700, lineHeight: '20px', textAlign: 'center', bgcolor: on ? (s.fg === '#fff' ? 'rgba(255,255,255,.24)' : 'rgba(36,86,61,.12)') : c.surface2, color: on ? 'inherit' : c.text2 }}>
                {t.deals.length}<Box component="span" sx={srOnly}> deals</Box>
              </Box>
            </Box>
          )
        })}
      </Box>}

      <Box id={`${uid}-panel`} {...(block.show_tabs !== false ? { role: 'tabpanel', 'aria-labelledby': `${uid}-tab-${active}` } : {})}
        sx={{ position: 'relative', mx: 2, pt: 2, pb: 1, borderRadius: '18px', overflow: 'hidden', background: a.bg, color: a.fg, boxShadow: '0 14px 28px -24px rgba(36,86,61,.55)' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, backgroundImage: stripes(a.fg) }} />
        {max > 0 && <Box sx={{ position: 'absolute', top: 12, right: 12 }}><Sticker text={`UP TO ${max}% OFF`} size={70} onDark={a.fg === '#fff'} /></Box>}
        <Box sx={{ position: 'relative', px: 2, pr: 11 }}>
          <Typography component="p" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11.5, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.92 }}><Icon sx={{ fontSize: 15 }} /> {f.label}</Typography>
          <Typography component="h3" sx={{ mt: 0.25, fontSize: 23, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.02em' }}>{f.headline}</Typography>
          {f.body && <Typography sx={{ mt: 0.5, fontSize: 12.5, lineHeight: 1.4, opacity: 0.9 }}>{f.body}</Typography>}
          {f.ends && <Countdown to={f.ends} now={now} tone={a.fg === '#fff' ? 'light' : 'ink'} sx={{ mt: 1 }} />}
        </Box>
        <Box {...rail} className="no-scrollbar" role="group" aria-label={`${f.label} deals`}
          sx={{ position: 'relative', display: 'flex', alignItems: 'stretch', gap: 1.25, overflowX: 'auto', px: 2, pt: 1.75, pb: 1.25, scrollSnapType: 'x mandatory', scrollPaddingInline: '16px' }}>
          {f.deals.map((d) => <DealCard key={d.product.sku} item={d} onPoster />)}
        </Box>
        <CmsLinkBox link={f.link} sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mx: 2, mb: 0.5, minHeight: 40, borderRadius: '12px', color: 'inherit', fontSize: 14, fontWeight: 700, textDecoration: 'none', bgcolor: a.fg === '#fff' ? 'rgba(255,255,255,.14)' : 'rgba(36,86,61,.09)', ...focusRing }}>
          View the full flyer <ChevronRightIcon sx={{ fontSize: 18 }} />
        </CmsLinkBox>
      </Box>
    </Frame>
  )
}

/* ------------------------------------------------------------------ renderer */

/** Draws one validated block, if it's inside its dates and offered at the buyer's warehouse. */
export function CmsSection({ block, mt = 3 }: { block: CmsBlock; mt?: number }) {
  const { warehouse } = useApp()
  if (!isLive(block, warehouse)) return null
  switch (block.variant) {
    case 'offer-hero': return <OfferHero block={block} mt={mt} />
    case 'flyer-tiles': return <FlyerTiles block={block} mt={mt} />
    case 'deal-products': return <DealRail block={block} mt={mt} />
    case 'flyer-tabs': return <FlyerTabs block={block} mt={mt} />
  }
}

/** Renders the blocks the CMS returns for a page area, in order; invalid or unknown blocks are skipped. */
export function CmsSections({ blocks, mt }: { blocks: unknown[]; mt?: number }) {
  const parsed = useMemo(() => blocks.map((b) => parseBlock(b)).filter((b): b is CmsBlock => !!b), [blocks])
  return <>{parsed.map((b, i) => <CmsSection key={i} block={b} mt={mt} />)}</>
}
