import { useState } from 'react'
import { Box, Button, InputBase, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'

/*
 * CONCEPT B — CHANGE #3 (replaces DeliveryBanner.tsx in the same 1920:500 footprint on desktop).
 * NEW FEATURE: needs delivery zones by postal-code prefix with the next route, window and cut-off
 * (prototype data: data/delivery-zones.json). Without that data the banner can still ship as copy +
 * region chips and hide the checker.
 */

const RED_AA = '#D50000'
const focusRing = { '&.Mui-focusVisible, &:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }

export type DeliveryZone = { id: string; region: string; name: string; prefixes: string[]; next_delivery: string; window: string; cutoff: string }
export type DeliveryZones = { pickup: { name: string; address: string; hours: string }; zones: DeliveryZone[] }

type Result = { kind: 'in'; zone: DeliveryZone; postal: string } | { kind: 'out'; postal: string } | { kind: 'invalid' }

const POSTAL = /^[A-Z]\d[A-Z](\s?\d[A-Z]\d)?$/

export function checkPostal(input: string, data: DeliveryZones): Result {
  const postal = input.trim().toUpperCase().replace(/\s+/g, ' ')
  if (!POSTAL.test(postal)) return { kind: 'invalid' }
  const compact = postal.replace(' ', '')
  let best: { zone: DeliveryZone; len: number } | undefined
  for (const zone of data.zones) {
    for (const pre of zone.prefixes) {
      if (compact.startsWith(pre) && (!best || pre.length > best.len)) best = { zone, len: pre.length }
    }
  }
  return best ? { kind: 'in', zone: best.zone, postal } : { kind: 'out', postal }
}

export default function DeliveryCheckBanner({ data, image = '/assets/stickydelivery.png' }: { data: DeliveryZones; image?: string }) {
  const [postal, setPostal] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const regions = Array.from(new Set(data.zones.map((z) => z.region)))

  return (
    <Box component="section" aria-labelledby="delivery-title" sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)', xl: 'minmax(0,1.1fr) minmax(0,1fr)' }, aspectRatio: { xl: '1920 / 500' }, minHeight: { md: 320 },
          borderRadius: { xs: '8px', sm: '12px' }, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', bgcolor: '#fff',
        }}
      >
        {/* Truck — the left half of the live banner artwork */}
        <Box sx={{ position: 'relative', minHeight: { xs: 170, sm: 220, md: 0 }, bgcolor: '#fff' }}>
          <Box component="img" src={image} alt="Supreme Restaurant Supply delivery truck" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '8% 50%' }} />
        </Box>

        {/* Checker */}
        <Box sx={{ p: { xs: 2.5, sm: 3, md: 3, xl: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: { xs: 1.5, md: 1.75 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FF413D' }}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: { xs: 10, sm: 11 }, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Same-day &amp; next-day delivery</Typography>
          </Box>
          <Typography id="delivery-title" component="h2" sx={{ fontWeight: 700, color: '#0C0C0C', fontSize: { xs: 20, sm: 24, lg: 30 }, lineHeight: 1.15 }}>
            We deliver daily across the GTA, Hamilton &amp; Niagara
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {regions.map((r) => (
              <Box key={r} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, height: 28, borderRadius: '40px', bgcolor: '#FFF0F0', color: '#B00000', fontSize: 12.5, fontWeight: 600 }}>
                <PlaceOutlinedIcon sx={{ fontSize: 15 }} /> {r}
              </Box>
            ))}
          </Box>

          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); setResult(checkPostal(postal, data)) }}
            sx={{ display: 'flex', gap: 1, mt: 0.5, maxWidth: 480 }}
          >
            <InputBase
              value={postal}
              onChange={(e) => { setPostal(e.target.value.toUpperCase().slice(0, 7)); setResult(null) }}
              placeholder="Postal code, e.g. L5L 0A2"
              inputProps={{ 'aria-label': 'Postal code', 'aria-describedby': 'delivery-result', autoComplete: 'postal-code' }}
              sx={{
                flex: 1, minWidth: 0, height: 46, px: 2, border: `1px solid ${result?.kind === 'invalid' ? RED_AA : '#E5E7EB'}`, borderRadius: '10px', bgcolor: '#F9FAFB', fontSize: 14,
                '&.Mui-focused': { borderColor: '#FF0000', bgcolor: '#fff', boxShadow: '0 0 0 3px rgba(255, 0, 0, 0.08)' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disableElevation
              sx={{ height: 46, px: 3, bgcolor: RED_AA, color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: 14, borderRadius: '10px', '&:hover': { bgcolor: '#B00000' }, ...focusRing }}
            >
              Check
            </Button>
          </Box>

          <Box id="delivery-result" role="status" aria-live="polite" sx={{ minHeight: { md: 64 }, maxWidth: 480 }}>
            {result?.kind === 'invalid' && (
              <Typography sx={{ fontSize: 13, color: RED_AA, fontWeight: 500 }}>Enter a Canadian postal code like L5L 0A2 (the first 3 characters are enough).</Typography>
            )}
            {result?.kind === 'in' && (
              <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: '10px', bgcolor: '#E7F9EF', border: '1px solid #BDEFD3' }}>
                <CheckCircleIcon sx={{ color: '#05753D', mt: 0.25 }} />
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0C0C0C' }}>
                    Yes — we deliver to {result.postal} ({result.zone.name})
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: '#4B5563' }}>
                    Next delivery: <b>{result.zone.next_delivery}, {result.zone.window}</b> · Order by {result.zone.cutoff}
                  </Typography>
                </Box>
              </Box>
            )}
            {result?.kind === 'out' && (
              <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: '10px', bgcolor: '#FEF3E2', border: '1px solid #F8D9A8' }}>
                <StorefrontOutlinedIcon sx={{ color: '#B45309', mt: 0.25 }} />
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0C0C0C' }}>{result.postal} is outside our delivery routes</Typography>
                  <Typography sx={{ fontSize: 13, color: '#4B5563' }}>
                    Pick up at {data.pickup.name}, {data.pickup.address} · {data.pickup.hours}
                  </Typography>
                </Box>
              </Box>
            )}
            {!result && <Typography sx={{ fontSize: 13, color: '#6B7280' }}>Scheduled cold-chain routes. Pickup at our Mississauga cash &amp; carry anytime.</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
