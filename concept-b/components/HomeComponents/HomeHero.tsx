import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import { useCart } from '../../lib/cart'
import { useSession } from '../../lib/session'
import { colors, layout, radius } from '../../lib/theme'
import { QuickOrderForm, POPULAR_SKUS, useQuickOrder } from '../QuickOrder/QuickOrder'
import Supremebanner, { type HeroSlide } from './Supremebanner'
import { type IconComponent, ArrowRightIcon, BoltIcon, HeartIcon, ListPlusIcon, ReturnIcon, TagIcon, TimerIcon, TruckIcon } from '../ui/icons'

/**
 * Top of the home page = marketing + the most common task side by side. Desktop: banner left, Quick order and
 * account panel right (both above the fold). Phones/tablets: the same blocks stack in order of importance.
 * A compact value strip replaces the old "Feature cards" and stats blocks further down the page.
 */

function QuickOrderCard() {
  const quick = useQuickOrder()
  return (
    <Box component="section" aria-labelledby="hero-qo-title" sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: radius.md, bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center', flexShrink: 0 }}><BoltIcon /></Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography id="hero-qo-title" component="h2" variant="h3" sx={{ fontSize: 18 }}>Quick order</Typography>
          <Typography sx={{ fontSize: 13.5, color: colors.ink600, display: { xs: 'none', sm: 'block' } }}>Know the SKU? Add it straight to your cart.</Typography>
        </Box>
        <Button size="small" startIcon={<ListPlusIcon />} onClick={() => quick.open('paste')} sx={{ color: colors.redText, flexShrink: 0 }}>Paste a list</Button>
      </Box>
      <QuickOrderForm layout="stacked" popularSkus={POPULAR_SKUS.slice(0, 4)} />
    </Box>
  )
}

function AccountCard() {
  const { user, ready } = useSession()
  const { wishlist, ready: cartReady } = useCart()
  if (!ready) return <Box sx={{ minHeight: 112, borderRadius: radius.xl, bgcolor: colors.subtle }} />
  if (user) {
    return (
      <Box sx={{ bgcolor: colors.navy, color: '#fff', borderRadius: radius.xl, p: 2.5 }}>
        <Typography sx={{ fontSize: 13.5, opacity: 0.8 }}>Welcome back, {user.name.split(' ')[0]}</Typography>
        <Typography component="p" variant="h3" sx={{ color: '#fff', fontSize: 18 }}>{user.business}</Typography>
        <Typography sx={{ fontSize: 13, opacity: 0.8, mt: 0.25 }}>Business pricing applied · Terms: {user.terms}</Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.75, flexWrap: 'wrap' }}>
          <Button component={Link} href="/wishlist" size="small" startIcon={<HeartIcon />} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.12)', '&:hover': { bgcolor: 'rgba(255,255,255,.2)' }, '&.Mui-focusVisible': { outline: '2px solid #fff' } }}>
            Favorites{cartReady && wishlist.length ? ` (${wishlist.length})` : ''}
          </Button>
          <Button component={Link} href="/cart" size="small" endIcon={<ArrowRightIcon />} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,.12)' }, '&.Mui-focusVisible': { outline: '2px solid #fff' } }}>Go to cart</Button>
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ bgcolor: colors.navyTint, borderRadius: radius.xl, p: 2.5 }}>
      <Typography component="p" variant="h3" sx={{ fontSize: 17, color: colors.navy }}>Buying for a business?</Typography>
      <Typography sx={{ fontSize: 13.5, color: colors.ink700, mt: 0.25 }}>Sign in for your business prices, credit terms and faster checkout.</Typography>
      <Box sx={{ display: 'flex', gap: 1, mt: 1.75, flexWrap: 'wrap' }}>
        <Button component={Link} href="/account/signin" variant="contained" color="secondary" size="small">Sign in</Button>
        <Button component={Link} href="/account/signin?mode=register" variant="outlined" color="secondary" size="small" sx={{ bgcolor: 'transparent' }}>Open a business account</Button>
      </Box>
    </Box>
  )
}

const values: { icon: IconComponent; title: string; text: string }[] = [
  { icon: TimerIcon, title: 'Order in 10 minutes', text: 'Quick order by SKU, paste a list, reorder' },
  { icon: TruckIcon, title: 'Same / next-day delivery', text: 'GTA, Hamilton & Niagara routes' },
  { icon: TagIcon, title: 'Wholesale pricing', text: 'Volume deals and weekly specials' },
  { icon: ReturnIcon, title: 'Easy returns', text: 'Damaged or wrong? We replace it' },
]

export function ValueStrip() {
  return (
    <Box component="ul" aria-label="Why order from MySupreme" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' }, gap: { xs: 1.5, md: 2 } }}>
      {values.map((v) => {
        const Icon = v.icon
        return (
          <Box component="li" key={v.title} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, py: { xs: 0.5, md: 0 } }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: colors.sunken, color: colors.ink700, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Icon sx={{ fontSize: 21 }} /></Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: { xs: 13.5, md: 14.5 }, fontWeight: 600, lineHeight: 1.3 }}>{v.title}</Typography>
              <Typography sx={{ fontSize: 13, color: colors.ink600, lineHeight: 1.35, display: { xs: 'none', sm: 'block' } }}>{v.text}</Typography>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

const WIDE = '@media (min-width:1280px)'

export default function HomeHero({ slides }: { slides: HeroSlide[] }) {
  return (
    <Box component="section" aria-label="Welcome" sx={{ maxWidth: layout.maxWidth, mx: 'auto', px: layout.gutter, pt: { xs: 1.5, md: 2.5 }, pb: { xs: 3, md: 4 } }}>
      {/* Side by side from 1280px (the banner art needs ~880px to read); stacked below that. */}
      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: 'minmax(0,1fr)', alignItems: 'stretch', [WIDE]: { gridTemplateColumns: 'minmax(0,1fr) 400px' }, '@media (min-width:1500px)': { gridTemplateColumns: 'minmax(0,1fr) 440px' } }}>
        <Box sx={{ [WIDE]: { alignSelf: 'center' } }}><Supremebanner slides={slides} /></Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1.5, md: 2 }, '& > *': { flex: { md: 1 } }, [WIDE]: { flexDirection: 'column', '& > *': { flex: 'none' } } }}>
          <QuickOrderCard />
          <Box sx={{ display: { xs: 'none', md: 'block' }, '& > *': { height: { md: '100%' } }, [WIDE]: { '& > *': { height: 'auto' } } }}><AccountCard /></Box>
        </Box>
      </Box>
      <Box sx={{ mt: { xs: 3, md: 4 }, pt: { xs: 2.5, md: 3 }, borderTop: `1px solid ${colors.line}` }}><ValueStrip /></Box>
    </Box>
  )
}
