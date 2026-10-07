import { useEffect, useState } from 'react'
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material'
import { money, regularPrice } from '../../lib/data'
import { colors, radius, shadow } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '../ui/icons'
import { PriceBurst } from './DealBits'
import { dealLabel, dealStyle, dateRange, type Deal } from './deals'
import { dealTypes, type DealTypeId } from '../Pages/FlyersOffers/flyersOffersData'

/*
 * Flyer page, built from live offer data (so it's always in sync with prices and the selected warehouse): deal-type
 * colour, big title, dates, the top items with offer prices, and a "save up to" burst. Rendered as HTML, not an image,
 * so it stays sharp, translatable and readable by screen readers.
 * TODO(asset): when the marketing team produces printable PDF flyers, link them from the viewer.
 */

export type Poster = { type: DealTypeId; deals: Deal[] }

export function FlyerPoster({ poster, warehouse, size = 'card' }: { poster: Poster; warehouse: string; size?: 'card' | 'large' }) {
  const style = dealStyle[poster.type]
  const Icon = style.icon
  const big = size === 'large'
  const first = poster.deals[0]?.offer
  const maxPct = Math.max(0, ...poster.deals.map((d) => d.pct))
  const light = style.fg !== '#fff'
  const items = poster.deals.slice(0, big ? 4 : 3)
  const info = dealTypes.find((d) => d.id === poster.type)
  return (
    <Box
      sx={{
        position: 'relative', aspectRatio: '3 / 4', width: '100%', bgcolor: style.bg, color: style.fg, borderRadius: radius.lg, overflow: 'hidden',
        p: big ? { xs: 2.5, sm: 3.5 } : 2, display: 'flex', flexDirection: 'column', textAlign: 'left',
        // Printed-flyer texture: faint diagonal stripes.
        backgroundImage: `repeating-linear-gradient(135deg, ${light ? 'rgba(17,24,39,.05)' : 'rgba(255,255,255,.05)'} 0 12px, transparent 12px 24px)`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box component="img" src={light ? '/assets/header_logo.svg' : '/assets/footerLogo.png'} alt="" sx={{ height: big ? 40 : 28, width: 'auto' }} />
        <Typography sx={{ fontSize: big ? 12 : 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.9 }}>{warehouse}</Typography>
      </Box>
      <Box sx={{ mt: big ? 2.5 : 1.5, pr: big ? 11 : 8 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: big ? 13 : 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', opacity: 0.9 }}>
          <Icon sx={{ fontSize: big ? 18 : 15 }} /> {first ? dateRange(first.valid_from, first.valid_to) : ''}
        </Box>
        <Typography component="p" sx={{ fontSize: big ? { xs: 34, sm: 44 } : 26, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.02em', textTransform: 'uppercase', mt: 0.75 }}>
          {dealLabel(poster.type)}
        </Typography>
        {info && <Typography sx={{ mt: big ? 1 : 0.75, fontSize: big ? 15 : 12.5, lineHeight: 1.4, opacity: 0.9, display: big ? 'block' : { xs: 'none', sm: 'block' } }}>{info.description}</Typography>}
      </Box>
      {maxPct > 0 && (
        <PriceBurst size={big ? 104 : 74} fill={light ? colors.red : colors.yellow} color={light ? '#fff' : colors.ink} rotate={12} sx={{ position: 'absolute', top: big ? 64 : 46, right: big ? 18 : 10 }}>
          <Box component="span" sx={{ fontSize: big ? 11 : 8.5, letterSpacing: '.06em' }}>SAVE UP TO</Box>
          <Box component="span" sx={{ fontSize: big ? 28 : 20 }}>{maxPct}%</Box>
        </PriceBurst>
      )}
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 'auto', display: 'flex', flexDirection: 'column', gap: big ? 1 : 0.75 }}>
        {items.map((d) => (
          <Box component="li" key={d.offer.id} sx={{ display: 'grid', gridTemplateColumns: `${big ? 56 : 40}px minmax(0,1fr) auto`, gap: 1, alignItems: 'center', bgcolor: '#fff', color: colors.ink, borderRadius: radius.md, p: big ? 1 : 0.75, boxShadow: shadow.xs }}>
            <Box sx={{ borderRadius: radius.sm, overflow: 'hidden' }}><ProductImage product={d.product} caption={false} alt="" padding="4%" /></Box>
            <Typography sx={{ fontSize: big ? 14 : 12, fontWeight: 500, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.product.name}</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontSize: big ? 18 : 14, fontWeight: 700, color: colors.redText, lineHeight: 1.1 }}>{money(d.offer.offer_price)}</Typography>
              {d.save > 0 && <Typography sx={{ fontSize: big ? 12 : 10.5, color: colors.ink500, textDecoration: 'line-through' }}>{money(regularPrice(d.product))}</Typography>}
            </Box>
          </Box>
        ))}
        {poster.deals.length > items.length && (
          <Typography sx={{ fontSize: big ? 13 : 11.5, fontWeight: 600, opacity: 0.9 }}>+ {poster.deals.length - items.length} more in this flyer</Typography>
        )}
      </Box>
      <Typography sx={{ mt: 1, fontSize: big ? 11 : 9.5, opacity: 0.75 }}>Prices valid while stock lasts · mysupreme.ca</Typography>
    </Box>
  )
}

/** Full-size flyer viewer: ←/→ (buttons or keys) between flyers, "Shop these deals" jumps to the filtered list. */
export function PosterViewer({ posters, index, warehouse, onClose, onShop }: { posters: Poster[]; index: number | null; warehouse: string; onClose: () => void; onShop: (t: DealTypeId) => void }) {
  const [i, setI] = useState(index ?? 0)
  useEffect(() => { if (index !== null) setI(index) }, [index])
  const open = index !== null && posters.length > 0
  const poster = posters[Math.min(i, posters.length - 1)]
  const go = (d: number) => setI((n) => (n + d + posters.length) % posters.length)
  const nav = { color: '#fff', bgcolor: 'rgba(255,255,255,.14)', '&:hover': { bgcolor: 'rgba(255,255,255,.26)' }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: 2 } } as const
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-label={poster ? `${dealLabel(poster.type)} flyer, ${i + 1} of ${posters.length}` : 'Flyer'}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', m: { xs: 1.5, sm: 4 }, width: '100%', maxWidth: 520, overflow: 'visible' } }}
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(17,24,39,.82)' } } }}
    >
      {poster && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, color: '#fff' }}>
            <Typography sx={{ fontWeight: 600 }}>{i + 1} / {posters.length}</Typography>
            <IconButton aria-label="Close flyer" onClick={onClose} sx={nav}><CloseIcon /></IconButton>
          </Box>
          <Box sx={{ maxHeight: 'calc(100vh - 200px)', aspectRatio: '3 / 4', mx: 'auto', maxWidth: '100%' }}>
            <FlyerPoster poster={poster} warehouse={warehouse} size="large" />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
            <IconButton aria-label="Previous flyer" onClick={() => go(-1)} disabled={posters.length < 2} sx={nav}><ChevronLeftIcon /></IconButton>
            <Button variant="contained" endIcon={<ArrowRightIcon />} onClick={() => onShop(poster.type)} sx={{ flex: 1 }}>
              Shop these {poster.deals.length} deals
            </Button>
            <IconButton aria-label="Next flyer" onClick={() => go(1)} disabled={posters.length < 2} sx={nav}><ChevronRightIcon /></IconButton>
          </Box>
        </Box>
      )}
    </Dialog>
  )
}
