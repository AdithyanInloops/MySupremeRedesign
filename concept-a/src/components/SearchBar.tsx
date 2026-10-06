import { useEffect, useRef, useState } from 'react'
import {
  Box, Button, ClickAwayListener, Dialog, DialogContent, IconButton, InputBase, Paper, Skeleton, Stack, Typography, Tooltip,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import MicRounded from '@mui/icons-material/MicRounded'
import PhotoCameraOutlined from '@mui/icons-material/PhotoCameraOutlined'
import CloseRounded from '@mui/icons-material/CloseRounded'
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded'
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined'
import NorthWestRounded from '@mui/icons-material/NorthWestRounded'
import { tokens } from '../theme'
import { money, searchProducts, trendingSearches, products, departments } from '../data/catalog'
import { ProductImage } from './Brand'
import { PackChip } from './ui'
import { useApp } from '../state/AppState'

const c = tokens.color

/** Header search: text + mic (voice) + camera (image search) + submit, with live Algolia-style dropdown. */
export default function SearchBar({ dense = false }: { dense?: boolean }) {
  const navigate = useNavigate()
  const { priceFor } = useApp()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [voice, setVoice] = useState(false)
  const [camera, setCamera] = useState(false)
  const t = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    window.clearTimeout(t.current)
    t.current = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(t.current)
  }, [q])

  const results = searchProducts(q).slice(0, 6)
  const cats = q ? departments.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) || d.children.some((s) => s.name.toLowerCase().includes(q.toLowerCase()))).slice(0, 3) : []
  const go = (term: string) => {
    if (!term.trim()) return
    setOpen(false)
    navigate(`/search/${encodeURIComponent(term.trim())}`)
  }

  const h = dense ? 46 : 52
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', width: '100%' }} role="search">
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            go(q)
          }}
          sx={{
            display: 'flex', alignItems: 'center', height: h, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`,
            border: `2px solid ${open ? c.navy : c.line2}`, pl: 1.5, pr: 0.5, transition: 'border-color .15s',
            boxShadow: open ? `0 0 0 4px ${c.navyTint}` : 'none',
          }}
        >
          <SearchRounded sx={{ color: c.text3, mr: 1 }} />
          <InputBase
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search by product or SKU"
            inputProps={{ 'aria-label': 'Search by product or SKU', 'aria-expanded': open, 'aria-controls': 'search-dropdown' }}
            sx={{ flex: 1, fontSize: 15, minWidth: 0 }}
          />
          {q && (
            <IconButton aria-label="Clear search" onClick={() => setQ('')} sx={{ width: 40, height: 40 }}>
              <CloseRounded fontSize="small" />
            </IconButton>
          )}
          <Tooltip title="Search by voice">
            <IconButton aria-label="Search by voice" onClick={() => setVoice(true)} sx={{ width: 44, height: 44, color: c.navy }}>
              <MicRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search with a photo">
            <IconButton aria-label="Search with a photo" onClick={() => setCamera(true)} sx={{ width: 44, height: 44, color: c.navy }}>
              <PhotoCameraOutlined />
            </IconButton>
          </Tooltip>
          <Button type="submit" variant="contained" aria-label="Search" sx={{ ml: 0.5, minWidth: { xs: 44, lg: 96 }, px: { xs: 1, lg: 2.5 }, height: h - 12, minHeight: 0, borderRadius: `${tokens.radius.sm}px` }}>
            <SearchRounded sx={{ display: { lg: 'none' } }} />
            <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>Search</Box>
          </Button>
        </Box>

        {open && (
          <Paper
            id="search-dropdown"
            sx={{
              position: 'absolute', top: h + 8, left: 0, right: 0, zIndex: 1400, borderRadius: `${tokens.radius.lg}px`,
              boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}`, overflow: 'hidden', maxHeight: '70vh', overflowY: 'auto',
            }}
          >
            {!q && (
              <Box sx={{ p: 2.5 }}>
                <Typography variant="overline" sx={{ color: c.text3 }}>Trending in kitchens near you</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                  {trendingSearches.map((t) => (
                    <Button key={t} size="small" variant="outlined" color="inherit" startIcon={<TrendingUpRounded />} onClick={() => go(t)}
                      sx={{ borderColor: c.line, color: c.ink, borderRadius: 999, fontWeight: 500 }}>
                      {t}
                    </Button>
                  ))}
                </Stack>
                <Typography variant="overline" sx={{ color: c.text3, display: 'block', mt: 2.5 }}>Popular right now</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 0.5, mt: 0.5 }}>
                  {products.filter((p) => p.recommended).slice(0, 4).map((p) => (
                    <ResultRow key={p.sku} sku={p.sku} onPick={() => setOpen(false)} price={priceFor(p)} />
                  ))}
                </Box>
              </Box>
            )}
            {q && loading && (
              <Box sx={{ p: 2 }} aria-busy aria-label="Loading results">
                {[0, 1, 2].map((i) => (
                  <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
                    <Skeleton variant="rounded" width={48} height={48} />
                    <Box sx={{ flex: 1 }}><Skeleton width="70%" /><Skeleton width="30%" /></Box>
                  </Stack>
                ))}
              </Box>
            )}
            {q && !loading && results.length > 0 && (
              <Box sx={{ p: 1.5 }}>
                {cats.length > 0 && (
                  <Stack direction="row" gap={1} flexWrap="wrap" sx={{ px: 1, pb: 1.5 }}>
                    {cats.map((d) => (
                      <Button key={d.id} size="small" component={RouterLink} to={`/c/${d.slug}`} onClick={() => setOpen(false)} sx={{ bgcolor: c.navyTint, color: c.navy, borderRadius: 999 }}>
                        in {d.name}
                      </Button>
                    ))}
                  </Stack>
                )}
                {results.map((p) => (
                  <ResultRow key={p.sku} sku={p.sku} q={q} onPick={() => setOpen(false)} price={priceFor(p)} />
                ))}
                <Button fullWidth onClick={() => go(q)} sx={{ mt: 1, color: c.red, fontWeight: 700 }}>
                  See all results for “{q}”
                </Button>
              </Box>
            )}
            {q && !loading && results.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5">No matches for “{q}”</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                  Check the SKU, try a brand name, or search with a photo.
                </Typography>
                <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap">
                  {trendingSearches.slice(0, 4).map((t) => (
                    <Button key={t} size="small" variant="outlined" onClick={() => setQ(t)} sx={{ borderRadius: 999 }}>{t}</Button>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        )}

        {/* Voice listening state */}
        <Dialog open={voice} onClose={() => setVoice(false)} maxWidth="xs" fullWidth>
          <DialogContent sx={{ textAlign: 'center', py: 5 }}>
            <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto', mb: 3 }}>
              <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: c.redTint, animation: 'pulse 1.4s ease-out infinite', '@keyframes pulse': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(1.35)', opacity: 0 } } }} />
              <Box sx={{ position: 'absolute', inset: 14, borderRadius: '50%', bgcolor: c.red, display: 'grid', placeItems: 'center', color: '#fff' }}>
                <MicRounded sx={{ fontSize: 40 }} />
              </Box>
            </Box>
            <Typography variant="h4">Listening…</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Try “Monin salted caramel” or “BM0089”</Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => setVoice(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => { setVoice(false); go('monin') }}>Simulate “monin”</Button>
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Image search upload dialog */}
        <Dialog open={camera} onClose={() => setCamera(false)} maxWidth="sm" fullWidth>
          <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h3">Search with a photo</Typography>
              <IconButton aria-label="Close" onClick={() => setCamera(false)}><CloseRounded /></IconButton>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              Snap the label on an empty case or upload a photo — we’ll find the closest match in 4,300 products.
            </Typography>
            <Box
              component="label"
              sx={{
                display: 'grid', placeItems: 'center', textAlign: 'center', gap: 1, py: 5, px: 2, cursor: 'pointer',
                border: `2px dashed ${c.line2}`, borderRadius: `${tokens.radius.lg}px`, bgcolor: c.bg, '&:hover': { borderColor: c.navy, bgcolor: c.navyTint },
              }}
            >
              <CloudUploadOutlined sx={{ fontSize: 44, color: c.navy }} />
              <Typography variant="h5">Drop a photo here or tap to choose</Typography>
              <Typography variant="caption" color="text.secondary">JPG, PNG or HEIC · up to 10 MB</Typography>
              <input type="file" accept="image/*" hidden onChange={() => { setCamera(false); navigate('/search/image-result?mode=image') }} />
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2.5 }}>
              <Button fullWidth variant="contained" startIcon={<PhotoCameraOutlined />} onClick={() => { setCamera(false); navigate('/search/image-result?mode=image') }}>
                Take a photo
              </Button>
              <Button fullWidth variant="outlined" onClick={() => { setCamera(false); navigate('/search/image-result?mode=image') }}>
                Use a sample photo
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      </Box>
    </ClickAwayListener>
  )
}

function highlight(text: string, q?: string) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <Box component="mark" sx={{ bgcolor: '#FFF3C4', color: 'inherit', borderRadius: 0.5, px: 0.25 }}>{text.slice(i, i + q.length)}</Box>
      {text.slice(i + q.length)}
    </>
  )
}

function ResultRow({ sku, q, onPick, price }: { sku: string; q?: string; onPick: () => void; price: number }) {
  const p = products.find((x) => x.sku === sku)!
  return (
    <Box
      component={RouterLink}
      to={`/p/${p.slug}`}
      onClick={onPick}
      sx={{
        display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) auto', gap: 1.5, alignItems: 'center', p: 1, borderRadius: `${tokens.radius.sm}px`,
        textDecoration: 'none', color: c.ink, '&:hover, &:focus-visible': { bgcolor: c.bg }, '&:hover .go': { opacity: 1 },
      }}
    >
      <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{highlight(p.name, q)}</Typography>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25, minWidth: 0 }}>
          <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 11, color: c.text3, whiteSpace: 'nowrap' }}>{highlight(p.sku, q)}</Typography>
          <PackChip pack={p.pack} size="sm" />
        </Stack>
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{money(price)}</Typography>
        <NorthWestRounded className="go" sx={{ fontSize: 16, color: c.text3, opacity: 0, transform: 'rotate(90deg)' }} />
      </Stack>
    </Box>
  )
}
