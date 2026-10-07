import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, InputBase, Typography } from '@mui/material'
import { colors, radius, srOnly } from '../../lib/theme'
import { DELIVERY_MINIMUM } from '../../lib/pricing'
import { checkPostal, type DeliveryZone, type DeliveryZones, type PostalResult } from '../../lib/delivery'
import { AlertCircleIcon, CheckCircleIcon, MapPinIcon, StoreIcon, TruckIcon } from '../ui/icons'

/*
 * Delivery check: postal code → next delivery window, or pickup when outside the routes.
 * NEW FEATURE: delivery zones by postal-code prefix (FSA) with next route, window and cut-off
 * (prototype data: data/delivery-zones.json). Without that data, ship the copy + region chips and hide the checker.
 */

export type { DeliveryZone, DeliveryZones, PostalResult }
export { checkPostal }

/** Result panel shared by the home checker and checkout. */
export function PostalResultNote({ result, data }: { result: PostalResult; data: DeliveryZones }) {
  if (result.kind === 'invalid') {
    return (
      <Box sx={{ display: 'flex', gap: 1, color: colors.error }}>
        <AlertCircleIcon sx={{ fontSize: 20, mt: '1px' }} />
        <Typography sx={{ fontSize: 14 }}>That doesn’t look like a Canadian postal code. Use the format L5L 0A2 — the first 3 characters are enough.</Typography>
      </Box>
    )
  }
  if (result.kind === 'in') {
    return (
      <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: radius.md, bgcolor: colors.successTint, border: `1px solid ${colors.successLine}` }}>
        <CheckCircleIcon sx={{ color: colors.success, mt: '1px' }} />
        <Box>
          <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>We deliver to {result.postal} ({result.zone.name})</Typography>
          <Typography sx={{ fontSize: 13.5, color: colors.ink700 }}>Next delivery <b>{result.zone.next_delivery}, {result.zone.window}</b> · order by {result.zone.cutoff}. Minimum order {`$${DELIVERY_MINIMUM}`}.</Typography>
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ display: 'flex', gap: 1.25, p: 1.5, borderRadius: radius.md, bgcolor: colors.warningTint, border: `1px solid ${colors.warningLine}` }}>
      <StoreIcon sx={{ color: colors.warning, mt: '1px' }} />
      <Box>
        <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{result.postal} is outside our delivery routes</Typography>
        <Typography sx={{ fontSize: 13.5, color: colors.ink700 }}>Pick up at {data.pickup.name}, {data.pickup.address} · {data.pickup.hours}.</Typography>
      </Box>
    </Box>
  )
}

export function DeliveryChecker({ data }: { data: DeliveryZones }) {
  const [postal, setPostal] = useState('')
  const [result, setResult] = useState<PostalResult | null>(null)
  return (
    <>
      <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setResult(checkPostal(postal, data)) }} sx={{ display: 'flex', gap: 1, maxWidth: 460 }}>
        <Box component="label" htmlFor="delivery-postal" sx={srOnly}>Postal code</Box>
        <InputBase
          id="delivery-postal"
          value={postal}
          onChange={(e) => { setPostal(e.target.value.toUpperCase().slice(0, 7)); setResult(null) }}
          placeholder="Postal code, e.g. L5L 0A2"
          inputProps={{ 'aria-describedby': 'delivery-result', autoComplete: 'postal-code', 'aria-invalid': result?.kind === 'invalid' }}
          sx={{
            flex: 1, minWidth: 0, height: 46, px: 1.75, border: `1px solid ${result?.kind === 'invalid' ? colors.error : colors.line2}`, borderRadius: radius.md, bgcolor: '#fff', fontSize: 15,
            '&.Mui-focused': { borderColor: colors.navy, boxShadow: `0 0 0 3px ${colors.navyTint}` },
          }}
        />
        <Button type="submit" variant="contained" sx={{ height: 46 }}>Check</Button>
      </Box>
      <Box id="delivery-result" role="status" aria-live="polite" sx={{ mt: 1.5, minHeight: { md: 68 }, maxWidth: 520 }}>
        {result ? <PostalResultNote result={result} data={data} /> : <Typography sx={{ fontSize: 13.5, color: colors.ink600 }}>Scheduled cold-chain routes, or pick up at our Mississauga cash &amp; carry any day Mon–Sat.</Typography>}
      </Box>
    </>
  )
}

/** Delivery checker + Click & Collect app card, side by side (they answer the same question: how do I get my order?). */
export default function DeliveryCheckBanner({ data, image = '/assets/stickydelivery.png' }: { data: DeliveryZones; image?: string }) {
  const regions = Array.from(new Set(data.zones.map((z) => z.region)))
  return (
    <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: 'minmax(0,1.6fr) minmax(0,1fr)' } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,0.9fr) minmax(0,1fr)' }, borderRadius: radius.xl, overflow: 'hidden', border: `1px solid ${colors.line}`, bgcolor: '#fff' }}>
        <Box sx={{ position: 'relative', minHeight: { xs: 160, sm: 200, md: 0 }, bgcolor: '#fff' }}>
          <Box component="img" src={image} alt="MySupreme delivery truck" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '10% 50%' }} />
        </Box>
        <Box sx={{ p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.redText }}>
            <TruckIcon sx={{ fontSize: 20 }} />
            <Typography variant="overline">Same-day &amp; next-day delivery</Typography>
          </Box>
          <Typography id="delivery-title" component="h2" variant="h2">Do we deliver to you?</Typography>
          <Typography sx={{ color: colors.ink600, fontSize: 14.5 }}>Daily routes across the GTA, Hamilton &amp; Niagara. Enter your postal code to see your next delivery window.</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {regions.map((r) => (
              <Box key={r} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, height: 28, borderRadius: radius.pill, bgcolor: colors.sunken, color: colors.ink700, fontSize: 12.5, fontWeight: 600 }}>
                <MapPinIcon sx={{ fontSize: 15 }} /> {r}
              </Box>
            ))}
          </Box>
          <DeliveryChecker data={data} />
        </Box>
      </Box>

      <Box sx={{ position: 'relative', borderRadius: radius.xl, overflow: 'hidden', bgcolor: colors.navyDark, color: '#fff', p: { xs: 2.5, md: 3.5 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: { lg: '100%' } }}>
        <Box component="img" src="/assets/order-anytime.png" alt="" aria-hidden loading="lazy" sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', right: 0, bottom: -60, height: 300, pointerEvents: 'none' }} />
        <Box sx={{ position: 'relative', maxWidth: { sm: '58%', lg: '62%' } }}>
          <Typography variant="overline" component="p" sx={{ color: '#FCA5A5' }}>Click &amp; Collect</Typography>
          <Typography component="h2" variant="h2" sx={{ color: '#fff', mt: 0.5 }}>Order in the app, pick up at Laird Road</Typography>
          <Typography sx={{ mt: 1, fontSize: 14.5, color: 'rgba(255,255,255,.8)' }}>Skip the aisles: your order is packed and waiting at the cash &amp; carry counter.</Typography>
          <Box sx={{ display: 'flex', gap: 1.25, mt: 2.5, flexWrap: 'wrap' }}>
            <Box component="a" href="https://apps.apple.com/in/app/mysupreme/id6749691637" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}><img src="/assets/appstore1.svg" alt="Download on the App Store" style={{ height: 42 }} /></Box>
            <Box component="a" href="https://play.google.com/store/apps/details?id=com.mysupreme.app" target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', borderRadius: radius.sm, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}><img src="/assets/playstore1.svg" alt="Get it on Google Play" style={{ height: 42 }} /></Box>
          </Box>
          <Box component={Link} href="/download-app" sx={{ display: 'inline-block', mt: 1.5, color: '#fff', fontSize: 14, fontWeight: 500, borderRadius: '4px', '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 } }}>More about the app</Box>
        </Box>
      </Box>
    </Box>
  )
}
