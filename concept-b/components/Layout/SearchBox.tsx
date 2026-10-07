import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, ClickAwayListener, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Skeleton, Tooltip, Typography } from '@mui/material'
import { money, packSize, searchCategories, searchProducts, finalPrice, type Product } from '../../lib/data'
import { useToast } from '../../lib/toast'
import { colors, mono, motion, radius, shadow, srOnly, z } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { ArrowUpLeftIcon, CameraIcon, CloseIcon, HistoryIcon, MicIcon, SearchIcon, ShapesIcon, TrendingUpIcon, UploadIcon } from '../ui/icons'

const POPULAR = ['basmati rice', 'canola oil', 'takeout containers', 'nitrile gloves', 'coffee', 'french fries']
const RECENT_KEY = 'ms-b-recent-searches'

const readRecent = (): string[] => {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
const saveRecent = (q: string) => {
  try { localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 5))) } catch { /* blocked */ }
}

/** Bold the part of `text` that matches `q` so buyers see why a suggestion appeared. */
function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.trim().toLowerCase())
  if (!q.trim() || i < 0) return <>{text}</>
  return <>{text.slice(0, i)}<Box component="mark" sx={{ bgcolor: 'transparent', color: 'inherit', fontWeight: 700 }}>{text.slice(i, i + q.trim().length)}</Box>{text.slice(i + q.trim().length)}</>
}

type Option = { id: string; href: string; kind: 'product' | 'category' | 'all' | 'term'; label: string }

/**
 * Header search (combobox pattern): live product + category suggestions as you type, recent and popular searches on
 * focus, ↑/↓ to move, Enter to open, Esc to close. Keeps the voice and photo entry points from the live site.
 */
export default function SearchBox({ size = 'md', autoFocus = false, onNavigate }: { size?: 'md' | 'lg'; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const uid = useId().replace(/:/g, '')
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [debounced, setDebounced] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [recent, setRecent] = useState<string[]>([])
  const [photo, setPhoto] = useState(false)

  // Keep the box in sync with the search page term, so refining a search starts from what was searched.
  useEffect(() => {
    if (router.pathname === '/search/[term]' && typeof router.query.term === 'string') setQ(router.query.term)
  }, [router.pathname, router.query.term])
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q), 160)
    return () => window.clearTimeout(t)
  }, [q])
  // "/" focuses search from anywhere (common shortcut on catalogue sites).
  useEffect(() => {
    if (size !== 'md') return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) && !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [size])

  const loading = q.trim() !== debounced.trim()
  const term = debounced.trim()
  const products = useMemo(() => (term ? searchProducts(term).slice(0, 6) : []), [term])
  const cats = useMemo(() => (term ? searchCategories(term, 3) : []), [term])
  const total = useMemo(() => (term ? searchProducts(term).length : 0), [term])

  const options: Option[] = useMemo(() => {
    if (!q.trim()) {
      return [
        ...recent.map((r) => ({ id: `r-${r}`, href: `/search/${encodeURIComponent(r)}`, kind: 'term' as const, label: r })),
        ...POPULAR.filter((p) => !recent.includes(p)).slice(0, 6 - Math.min(recent.length, 3)).map((p) => ({ id: `p-${p}`, href: `/search/${encodeURIComponent(p)}`, kind: 'term' as const, label: p })),
      ]
    }
    if (loading) return []
    return [
      ...products.map((p) => ({ id: `prod-${p.sku}`, href: `/p/${p.url_key}`, kind: 'product' as const, label: p.name })),
      ...cats.map((c) => ({ id: `cat-${c.href}`, href: c.href, kind: 'category' as const, label: c.name })),
      { id: 'all', href: `/search/${encodeURIComponent(term)}`, kind: 'all' as const, label: term },
    ]
  }, [q, recent, loading, products, cats, term])

  const show = (v: boolean) => {
    if (v) setRecent(readRecent())
    setOpen(v)
    setActive(-1)
  }
  const go = (href: string, searchTerm?: string) => {
    if (searchTerm) saveRecent(searchTerm)
    show(false)
    inputRef.current?.blur()
    onNavigate?.()
    router.push(href)
  }
  const submit = () => {
    const opt = options[active]
    if (opt) return go(opt.href, opt.kind === 'term' || opt.kind === 'all' ? opt.label : undefined)
    if (q.trim()) go(`/search/${encodeURIComponent(q.trim())}`, q.trim())
  }

  const h = size === 'lg' ? 52 : 46
  const listId = `${uid}-list`
  const optId = (i: number) => `${uid}-opt-${i}`

  const iconBtn = { width: 38, height: 38, color: colors.ink600, '&:hover': { bgcolor: colors.sunken, color: colors.ink } } as const

  return (
    <ClickAwayListener onClickAway={() => open && show(false)}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Box
          component="form"
          role="search"
          onSubmit={(e) => { e.preventDefault(); submit() }}
          sx={{
            display: 'flex', alignItems: 'center', height: h, pl: 1.75, pr: 0.5, gap: 0.5, bgcolor: colors.subtle, border: `1px solid ${colors.line2}`, borderRadius: radius.md,
            transition: `border-color ${motion.fast}, background-color ${motion.fast}, box-shadow ${motion.fast}`,
            '&:hover': { borderColor: colors.ink400 },
            '&:focus-within': { bgcolor: '#fff', borderColor: colors.navy, boxShadow: `0 0 0 3px ${colors.navyTint}` },
          }}
        >
          <SearchIcon sx={{ color: colors.ink500, fontSize: 22, flexShrink: 0 }} />
          <InputBase
            inputRef={inputRef}
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => { setQ(e.target.value); setActive(-1); if (!open) show(true) }}
            onFocus={() => show(true)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); if (!open) show(true); setActive((a) => Math.min(options.length - 1, a + 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
              if (e.key === 'Escape') { if (open) { e.preventDefault(); show(false) } else setQ('') }
            }}
            placeholder="Search products, brands or SKU"
            inputProps={{
              role: 'combobox', 'aria-label': 'Search products, brands or SKU', 'aria-expanded': open, 'aria-controls': listId, 'aria-autocomplete': 'list',
              'aria-activedescendant': active >= 0 ? optId(active) : undefined, enterKeyHint: 'search', autoComplete: 'off', spellCheck: false,
            }}
            sx={{ flex: 1, minWidth: 0, fontSize: 15, color: colors.ink, '& input::placeholder': { color: colors.ink500, opacity: 1 } }}
          />
          {q && (
            <IconButton aria-label="Clear search" onClick={() => { setQ(''); inputRef.current?.focus() }} sx={{ ...iconBtn, width: 34, height: 34 }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <Tooltip title="Search by voice">
            <IconButton aria-label="Search by voice" onClick={() => toast({ message: 'Voice search', description: 'Speak a product name or SKU — available on the live site and app.', severity: 'info' })} sx={{ ...iconBtn, display: { xs: q ? 'none' : 'inline-flex', sm: 'inline-flex' } }}>
              <MicIcon sx={{ fontSize: 21 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search with a photo">
            <IconButton aria-label="Search with a photo" onClick={() => setPhoto(true)} sx={{ ...iconBtn, display: { xs: q ? 'none' : 'inline-flex', sm: 'inline-flex' } }}>
              <CameraIcon sx={{ fontSize: 21 }} />
            </IconButton>
          </Tooltip>
          <Button type="submit" variant="contained" aria-label="Search" sx={{ display: { xs: 'none', md: 'inline-flex' }, minWidth: 0, minHeight: h - 10, height: h - 10, px: 2, borderRadius: radius.sm, ml: 0.25 }}>
            Search
          </Button>
        </Box>

        {open && (
          <Box
            id={listId}
            role="listbox"
            aria-label="Search suggestions"
            sx={{
              position: 'absolute', top: h + 6, left: 0, right: 0, zIndex: z.menu, bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg,
              boxShadow: shadow.lg, py: 1, maxHeight: 'min(70vh, 560px)', overflowY: 'auto', minWidth: { md: 520 },
            }}
          >
            {!q.trim() ? (
              <>
                {recent.length > 0 && <GroupLabel>Recent searches</GroupLabel>}
                {options.map((o, i) => (
                  <Fragment key={o.id}>
                    {i === recent.length && <GroupLabel>Popular searches</GroupLabel>}
                    <OptionRow id={optId(i)} active={i === active} onHover={() => setActive(i)} onPick={() => go(o.href, o.label)}>
                      {o.id.startsWith('r-') ? <HistoryIcon sx={{ color: colors.ink400, fontSize: 20 }} /> : <TrendingUpIcon sx={{ color: colors.ink400, fontSize: 20 }} />}
                      <Typography sx={{ flex: 1, fontSize: 14.5 }}>{o.label}</Typography>
                      <ArrowUpLeftIcon sx={{ color: colors.ink400, fontSize: 16 }} />
                    </OptionRow>
                  </Fragment>
                ))}
                <Typography sx={{ px: 2, pt: 1, fontSize: 12.5, color: colors.ink500 }}>Tip: type a SKU or barcode to jump straight to the product. Press <Kbd>/</Kbd> to search from anywhere.</Typography>
              </>
            ) : loading ? (
              <Box role="status" aria-label="Searching" sx={{ px: 2, py: 1 }}>
                {[0, 1, 2].map((i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 0.75 }}>
                    <Skeleton variant="rounded" width={44} height={44} />
                    <Box sx={{ flex: 1 }}><Skeleton width="70%" /><Skeleton width="35%" /></Box>
                  </Box>
                ))}
              </Box>
            ) : products.length === 0 && cats.length === 0 ? (
              <Box sx={{ px: 2.5, py: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>No products match “{term}”</Typography>
                <Typography sx={{ color: colors.ink600, fontSize: 14, mt: 0.5 }}>Check the spelling or SKU, or try a broader word like “rice” or “cups”.</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                  {POPULAR.slice(0, 4).map((p) => (
                    <Button key={p} size="small" variant="outlined" onClick={() => go(`/search/${encodeURIComponent(p)}`, p)}>{p}</Button>
                  ))}
                </Box>
              </Box>
            ) : (
              <>
                {products.length > 0 && <GroupLabel>Products</GroupLabel>}
                {products.map((p, i) => (
                  <OptionRow key={p.sku} id={optId(i)} active={i === active} onHover={() => setActive(i)} onPick={() => go(`/p/${p.url_key}`, term)}>
                    <ProductThumb product={p} />
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontSize: 14, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Highlight text={p.name} q={term} /></Typography>
                      <Typography sx={{ fontSize: 12, color: colors.ink500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Box component="span" sx={{ fontFamily: mono }}><Highlight text={p.sku} q={term} /></Box>
                        {packSize(p) && ` · ${packSize(p)}`}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{money(finalPrice(p))}</Typography>
                  </OptionRow>
                ))}
                {cats.length > 0 && <GroupLabel>Categories</GroupLabel>}
                {cats.map((c, k) => {
                  const i = products.length + k
                  return (
                    <OptionRow key={c.href} id={optId(i)} active={i === active} onHover={() => setActive(i)} onPick={() => go(c.href)}>
                      <Box sx={{ width: 44, height: 44, borderRadius: radius.sm, bgcolor: colors.sunken, display: 'grid', placeItems: 'center', flexShrink: 0 }}><ShapesIcon sx={{ color: colors.ink500, fontSize: 20 }} /></Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: 14 }}><Highlight text={c.name} q={term} /></Typography>
                        <Typography sx={{ fontSize: 12, color: colors.ink500 }}>{c.parent ? `in ${c.parent} · ` : 'Department · '}{c.count?.toLocaleString()} products</Typography>
                      </Box>
                    </OptionRow>
                  )
                })}
                <Box sx={{ borderTop: `1px solid ${colors.line}`, mt: 1, pt: 1 }}>
                  <OptionRow id={optId(options.length - 1)} active={active === options.length - 1} onHover={() => setActive(options.length - 1)} onPick={() => go(`/search/${encodeURIComponent(term)}`, term)}>
                    <SearchIcon sx={{ color: colors.redText, fontSize: 20 }} />
                    <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: colors.redText }}>See all {total > 0 ? `${total} ` : ''}results for “{term}”</Typography>
                  </OptionRow>
                </Box>
              </>
            )}
          </Box>
        )}
        <PhotoSearchDialog open={photo} onClose={() => setPhoto(false)} />
      </Box>
    </ClickAwayListener>
  )
}

function Kbd({ children }: { children: string }) {
  return <Box component="kbd" sx={{ fontFamily: mono, fontSize: 11.5, border: `1px solid ${colors.line2}`, borderBottomWidth: 2, borderRadius: '4px', px: 0.5, bgcolor: colors.subtle }}>{children}</Box>
}

function GroupLabel({ children }: { children: string }) {
  return <Typography role="presentation" sx={{ px: 2, pt: 1, pb: 0.5, fontSize: 12, fontWeight: 600, color: colors.ink500, letterSpacing: '.06em', textTransform: 'uppercase' }}>{children}</Typography>
}

function OptionRow({ id, active, onHover, onPick, children }: { id: string; active: boolean; onHover: () => void; onPick: () => void; children: React.ReactNode }) {
  return (
    <Box
      id={id}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPick}
      sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 0.875, mx: 0.75, borderRadius: radius.sm, cursor: 'pointer', bgcolor: active ? colors.sunken : 'transparent' }}
    >
      {children}
    </Box>
  )
}

function ProductThumb({ product }: { product: Product }) {
  return (
    <Box sx={{ width: 44, flexShrink: 0, borderRadius: radius.sm, overflow: 'hidden', border: `1px solid ${colors.line}` }}>
      <ProductImage product={product} caption={false} alt="" padding="6%" />
    </Box>
  )
}

/** Photo search entry point (Google Vision on the live site). The prototype shows the upload step and explains the rest. */
function PhotoSearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<{ name: string; url: string } | null>(null)
  const close = () => { onClose(); window.setTimeout(() => setFile(null), 200) }
  return (
    <Dialog open={open} onClose={close} maxWidth="xs" fullWidth aria-labelledby="photo-search-title">
      <DialogTitle id="photo-search-title" sx={{ pr: 7 }}>
        Search with a photo
        <IconButton aria-label="Close" onClick={close} sx={{ position: 'absolute', right: 12, top: 12 }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: colors.ink600, fontSize: 14.5, mb: 2 }}>Snap a product label or an empty box from your shelf and we’ll find matching items.</Typography>
        {file ? (
          <Box sx={{ textAlign: 'center' }}>
            <Box component="img" src={file.url} alt="" sx={{ maxHeight: 180, maxWidth: '100%', borderRadius: radius.md, border: `1px solid ${colors.line}` }} />
            <Typography sx={{ mt: 1.5, fontSize: 14, fontWeight: 600 }}>{file.name}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13.5, color: colors.ink600 }}>Photo matching runs on the live site. In this prototype, search by name or SKU instead.</Typography>
            <Button sx={{ mt: 2 }} variant="outlined" onClick={() => setFile(null)}>Choose another photo</Button>
          </Box>
        ) : (
          <Box
            component="label"
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 4, borderRadius: radius.lg, border: `2px dashed ${colors.line2}`, bgcolor: colors.subtle, cursor: 'pointer', textAlign: 'center',
              '&:hover, &:focus-within': { borderColor: colors.navy, bgcolor: colors.navyTint },
            }}
          >
            <UploadIcon sx={{ fontSize: 36, color: colors.ink500 }} />
            <Typography sx={{ fontWeight: 600 }}>Upload or take a photo</Typography>
            <Typography sx={{ fontSize: 13, color: colors.ink500 }}>JPG or PNG, up to 10 MB</Typography>
            <Box component="input" type="file" accept="image/*" capture="environment" sx={srOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) setFile({ name: f.name, url: URL.createObjectURL(f) }) }} />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

