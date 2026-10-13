import { useState } from 'react'
import { Box, Button, InputBase, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRounded from '@mui/icons-material/ErrorOutlineRounded'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import { tokens } from '../../../theme'
import zonesJson from '../../../data/delivery-zones.json'
import { h2Sx, overlineSx, srOnly } from './sectionText'

/*
 * Delivery check (Concept B): postal code → next delivery window, or pickup when outside the routes, side by side with
 * the Click & Collect app card (they answer the same question: how do I get my order?).
 * NEW FEATURE: delivery zones by postal-code prefix (FSA) with next route, window and cut-off
 * (prototype data: data/delivery-zones.json). Without that data, ship the copy + region chips and hide the checker.
 */

type DeliveryZone = { id: string; region: string; name: string; prefixes: string[]; next_delivery: string; window: string; cutoff: string }
type DeliveryZones = { pickup: { name: string; address: string; hours: string }; zones: DeliveryZone[] }
type PostalResult = { kind: 'in'; zone: DeliveryZone; postal: string } | { kind: 'out'; postal: string } | { kind: 'invalid' }

const c = tokens.color
const data = zonesJson as DeliveryZones
const DELIVERY_MINIMUM = 350
const POSTAL = /^[A-Z]\d[A-Z](\s?\d[A-Z]\d)?$/

/** Longest matching postal prefix wins (e.g. L5L beats L5). */
function checkPostal(input: string): PostalResult {
  const postal = input.trim().toUpperCase().replace(/\s+/g, ' ')
  if (!POSTAL.test(postal)) return { kind: 'invalid' }
  const compact = postal.replace(' ', '')
  let best: { zone: DeliveryZone; len: number } | undefined
  for (const zone of data.zones) {
    for (const pre of zone.prefixes) if (compact.startsWith(pre) && (!best || pre.length > best.len)) best = { zone, len: pre.length }
  }
  return best ? { kind: 'in', zone: best.zone, postal } : { kind: 'out', postal }
}

function PostalResultNote({ result }: { result: PostalResult }) {
  if (result.kind === 'invalid') {
    return (
      <Box sx={{ display: 'flex', gap: 1, color: c.error }}>
        <ErrorOutlineRounded sx={{ fontSize: 20, mt: '1px' }} />
        <Typography sx={{ fontSize: 14 }}>That doesn’t look like a Canadian postal code. Use the format L5L 0A2 — the first 3 characters are enough.</Typography>
      </Box>
    )
  }
  if (result.kind === 'in') {
    return (
      <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.successTint, border: '1px solid #A7E3C3' }}>
        <CheckCircleRounded sx={{ color: c.successText, mt: '1px' }} />
        <Box>
          <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>We deliver to {result.postal} ({result.zone.name})</Typography>
          <Typography sx={{ fontSize: 13.5, color: c.text2 }}>Next delivery <b>{result.zone.next_delivery}, {result.zone.window}</b> · order by {result.zone.cutoff}. Minimum order ${DELIVERY_MINIMUM}.</Typography>
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.warningTint, border: '1px solid #F5D19B' }}>
      <StorefrontOutlined sx={{ color: c.warning, mt: '1px' }} />
      <Box>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{result.postal} is outside our delivery routes</Typography>
        <Typography sx={{ fontSize: 13.5, color: c.text2 }}>Pick up at {data.pickup.name}, {data.pickup.address} · {data.pickup.hours}.</Typography>
      </Box>
    </Box>
  )
}

function DeliveryChecker() {
  const [postal, setPostal] = useState('')
  const [result, setResult] = useState<PostalResult | null>(null)
  return (
    <>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setResult(checkPostal(postal)) }} sx={{ display: 'flex', gap: 1, maxWidth: 460 }}>
        <Box component="label" htmlFor="delivery-postal" sx={srOnly}>Postal code</Box>
        <InputBase
          id="delivery-postal"
          value={postal}
          onChange={(e) => { setPostal(e.target.value.toUpperCase().slice(0, 7)); setResult(null) }}
          placeholder="Postal code, e.g. L5L 0A2"
          inputProps={{ 'aria-describedby': 'delivery-result', autoComplete: 'postal-code', 'aria-invalid': result?.kind === 'invalid' }}
          sx={{
            flex: 1, minWidth: 0, height: 46, px: 1.75, border: `1px solid ${result?.kind === 'invalid' ? c.error : c.line2}`, borderRadius: `${tokens.radius.sm}px`, bgcolor: '#fff', fontSize: 15,
            '&.Mui-focused': { borderColor: c.navy, boxShadow: `0 0 0 3px ${c.navyTint}` },
          }}
        />
        <Button type="submit" variant="contained" sx={{ height: 46, minHeight: 46, px: 2.5 }}>Check</Button>
      </Box>
      <Box id="delivery-result" role="status" aria-live="polite" sx={{ mt: 1.5, minHeight: { md: 68 }, maxWidth: 520 }}>
        {result ? <PostalResultNote result={result} /> : <Typography sx={{ fontSize: 13.5, color: c.text2 }}>Scheduled cold-chain routes, or pick up at our Mississauga cash &amp; carry any day Mon–Sat.</Typography>}
      </Box>
    </>
  )
}

const storeLinkSx = { display: 'inline-flex', borderRadius: '8px', '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }

export default function DeliveryCheckBanner({ image = '/assets/stickydelivery.png' }: { image?: string }) {
  const regions = Array.from(new Set(data.zones.map((z) => z.region)))
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1.6fr) minmax(0,1fr)' } }}>
      <Box component="section" aria-labelledby="delivery-title" sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,0.9fr) minmax(0,1fr)' }, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', border: `1px solid ${c.line}`, bgcolor: '#fff' }}>
        <Box sx={{ position: 'relative', minHeight: { xs: 160, sm: 200, md: 0 }, bgcolor: '#fff' }}>
          <Box component="img" src={image} alt="MySupreme delivery truck" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '10% 50%' }} />
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: c.red }}>
            <LocalShippingOutlined sx={{ fontSize: 20 }} />
            <Typography sx={{ ...overlineSx, color: 'inherit' }}>Same-day &amp; next-day delivery</Typography>
          </Box>
          <Typography id="delivery-title" component="h2" sx={h2Sx}>Do we deliver to you?</Typography>
          <Typography sx={{ color: c.text2, fontSize: 14.5 }}>Daily routes across the GTA, Hamilton &amp; Niagara. Enter your postal code to see your next delivery window.</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {regions.map((r) => (
              <Box key={r} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, height: 28, borderRadius: 999, bgcolor: c.surface2, color: '#374151', fontSize: 12.5, fontWeight: 600 }}>
                <PlaceOutlined sx={{ fontSize: 15 }} /> {r}
              </Box>
            ))}
          </Box>
          <DeliveryChecker />
        </Box>
      </Box>

      <Box component="section" aria-labelledby="collect-title" sx={{ position: 'relative', borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden', bgcolor: c.navyDark, color: '#fff', p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { lg: '100%' } }}>
        <Box component="img" src="/assets/order-anytime.png" alt="" aria-hidden loading="lazy" sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', right: 0, bottom: -60, height: 300, pointerEvents: 'none' }} />
        <Box sx={{ position: 'relative', maxWidth: { sm: '58%', lg: '62%' } }}>
          <Typography component="p" sx={{ ...overlineSx, color: '#FCA5A5' }}>Click &amp; Collect</Typography>
          <Typography id="collect-title" component="h2" sx={{ ...h2Sx, color: '#fff', mt: 0.5 }}>Order in the app, pick up at Laird Road</Typography>
          <Typography sx={{ mt: 1, fontSize: 14.5, color: 'rgba(255,255,255,.8)' }}>Skip the aisles: your order is packed and waiting at the cash &amp; carry counter.</Typography>
          <Box sx={{ display: 'flex', gap: 1.25, mt: 2.5, flexWrap: 'wrap' }}>
            <Box component="a" href="https://apps.apple.com/in/app/mysupreme/id6749691637" target="_blank" rel="noopener noreferrer" sx={storeLinkSx}><img src="/assets/appstore1.svg" alt="Download on the App Store" style={{ height: 42 }} /></Box>
            <Box component="a" href="https://play.google.com/store/apps/details?id=com.mysupreme.app" target="_blank" rel="noopener noreferrer" sx={storeLinkSx}><img src="/assets/playstore1.svg" alt="Get it on Google Play" style={{ height: 42 }} /></Box>
          </Box>
          <Box component={RouterLink} to="/download-app" sx={{ display: 'inline-block', mt: 1.5, color: '#fff', fontSize: 14, fontWeight: 500, borderRadius: '4px', '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}>More about the app</Box>
        </Box>
      </Box>
    </Box>
  )
}
