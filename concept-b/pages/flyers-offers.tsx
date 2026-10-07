import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Chip, InputBase, MenuItem, Select, Typography } from '@mui/material'
import { hasImage, money } from '../lib/data'
import { emailError } from '../lib/validate'
import { colors, focusRing, motion, radius, shadow, srOnly } from '../lib/theme'
import { Breadcrumbs } from '../components/ui/PageHeader'
import Section, { PageContainer, SectionHeading } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import ProductImage from '../components/ui/ProductImage'
import { Rail } from '../components/Product/ProductRail'
import { DealCard, dealGrid } from '../components/HomeComponents/WeeklyDeals'
import { Countdown, PriceBurst } from '../components/Deals/DealBits'
import { FlyerPoster, PosterViewer, type Poster } from '../components/Deals/FlyerPoster'
import { dateRange, dealStyle, dealsAt, type Deal } from '../components/Deals/deals'
import { dealTypes, offers as teasers, warehouses, type DealTypeId } from '../components/Pages/FlyersOffers/flyersOffersData'
import { ArrowRightIcon, ClockIcon, MailCheckIcon, MapPinIcon, TagIcon } from '../components/ui/icons'

/*
 * Flyers & Offers — a printed-flyer feel on live data: flyer-cover hero (warehouse, countdown, product stickers),
 * flip-through flyer posters with a full-size viewer, in-store posters, the filterable deal grid and a sneak peek of
 * next week. NEW FEATURE: offer entity (deal type, sku, offer price, valid from/to, warehouses) — data/offers.json.
 */

type SortKey = 'saving' | 'ending' | 'price'

const IN_STORE = [
  { src: '/assets/sum-offer-2.jpeg', alt: 'Business owners: 16L canola oil deal, now $42.99, was $46.99. In store only.', title: '16L canola oil — now $42.99', text: 'In-store deal at our Mississauga cash & carry', href: '/search/canola', cta: 'Find canola oil' },
  { src: '/assets/sum-offer-1.jpeg', alt: 'Elevate your business: wholesale sourcing made simple', title: 'Wholesale sourcing, made simple', text: 'Register for business pricing across every department', href: '/account/signin?mode=register', cta: 'Open a business account' },
]

function Subscribe({ warehouse }: { warehouse: string }) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)
  const error = emailError(email)
  if (done) {
    return (
      <Box role="status" sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
        <MailCheckIcon sx={{ color: '#86EFAC' }} />
        <Typography sx={{ color: '#fff' }}>You’re in. The {warehouse} flyer arrives at {email} every Monday morning.</Typography>
      </Box>
    )
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!error) setDone(true) }} sx={{ width: '100%', maxWidth: 460 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box component="label" htmlFor="deals-email" sx={srOnly}>Email</Box>
        <InputBase
          id="deals-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@restaurant.ca"
          inputProps={{ 'aria-invalid': touched && !!error, 'aria-describedby': touched && error ? 'deals-email-err' : undefined, inputMode: 'email', autoComplete: 'email' }}
          sx={{ flex: 1, minWidth: 0, height: 46, px: 1.75, bgcolor: '#fff', borderRadius: radius.md, fontSize: 15, border: `2px solid ${touched && error ? '#FCA5A5' : 'transparent'}`, '&.Mui-focused': { borderColor: '#fff', boxShadow: '0 0 0 3px rgba(255,255,255,.35)' } }}
        />
        <Button type="submit" variant="contained" sx={{ height: 46 }}>Subscribe</Button>
      </Box>
      {touched && error && <Typography id="deals-email-err" sx={{ mt: 0.75, fontSize: 13, color: '#FECACA' }}>{error}</Typography>}
    </Box>
  )
}

/** Product "stickers" in the hero: the three biggest savings with photos, tilted like a printed flyer. */
function Stickers({ deals }: { deals: Deal[] }) {
  const spots = [
    { top: 0, left: '2%', rotate: -6 },
    { top: 34, right: '-2%', rotate: 5 },
    { bottom: 0, left: '33%', rotate: -2 },
  ]
  return (
    <Box aria-hidden sx={{ position: 'relative', height: 400, display: { xs: 'none', md: 'block' } }}>
      {deals.slice(0, 3).map((d, i) => {
        const { rotate, ...pos } = spots[i]
        return (
        <Box
          key={d.offer.id}
          component={Link}
          href={`/p/${d.product.url_key}`}
          tabIndex={-1}
          sx={{
            position: 'absolute', ...pos, width: 196, bgcolor: '#fff', color: colors.ink, borderRadius: radius.lg, p: 1.25, textDecoration: 'none', boxShadow: shadow.lg,
            transform: `rotate(${rotate}deg)`, transition: `transform ${motion.base}`, '&:hover': { transform: 'rotate(0deg) translateY(-4px)' },
          }}
        >
          <Box sx={{ borderRadius: radius.md, overflow: 'hidden' }}><ProductImage product={d.product} alt="" caption={false} padding="6%" /></Box>
          <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.product.name}</Typography>
          <PriceBurst size={82} rotate={10} sx={{ position: 'absolute', top: -22, right: -22 }}>
            <Box component="span" sx={{ fontSize: 9, letterSpacing: '.06em' }}>NOW</Box>
            <Box component="span" sx={{ fontSize: 16 }}>{money(d.offer.offer_price)}</Box>
          </PriceBurst>
        </Box>
        )
      })}
    </Box>
  )
}

export default function FlyersOffers() {
  const router = useRouter()
  const [warehouseId, setWarehouseId] = useState(warehouses[0].id)
  const [type, setType] = useState<DealTypeId | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('saving')
  const [viewer, setViewer] = useState<number | null>(null)
  // The buyer's warehouse lives in the URL (shareable, survives Back).
  useEffect(() => {
    const w = router.query.w
    if (typeof w === 'string' && warehouses.some((x) => x.id === w)) setWarehouseId(w)
  }, [router.query.w])
  const pickWarehouse = (id: string) => {
    setWarehouseId(id)
    router.replace({ pathname: router.pathname, query: { ...router.query, w: id } }, undefined, { shallow: true, scroll: false })
  }

  const warehouse = warehouses.find((w) => w.id === warehouseId) ?? warehouses[0]
  const deals = useMemo(() => dealsAt(warehouseId), [warehouseId])
  const posters: Poster[] = useMemo(
    () => dealTypes.map((t) => ({ type: t.id, deals: deals.filter((d) => d.type === t.id).sort((a, b) => b.pct - a.pct) })).filter((p) => p.deals.length),
    [deals],
  )
  const counts = Object.fromEntries(dealTypes.map((t) => [t.id, deals.filter((d) => d.type === t.id).length])) as Record<DealTypeId, number>
  const shown = deals
    .filter((d) => type === 'all' || d.type === type)
    .sort((a, b) => (sort === 'saving' ? b.pct - a.pct : sort === 'ending' ? a.offer.valid_to.localeCompare(b.offer.valid_to) : a.offer.offer_price - b.offer.offer_price))
  const maxPct = Math.max(0, ...deals.map((d) => d.pct))
  const weekly = deals.find((d) => d.type === 'weekly')
  const stickers = [...deals].filter((d) => hasImage(d.product)).sort((a, b) => b.pct - a.pct)
  const coming = teasers.filter((t) => t.warehouseIds.includes(warehouseId)).slice(0, 4)
  const activeType = dealTypes.find((d) => d.id === type)

  const shop = (t: DealTypeId | 'all') => {
    setType(t)
    setViewer(null)
    window.setTimeout(() => document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  return (
    <>
      <Head>
        <title>Flyers &amp; Offers | MySupreme</title>
        <meta name="description" content="This week’s warehouse flyers: weekly hot picks, bulk savings, the monthly flyer and restaurant bundles — with prices and add to cart." />
      </Head>

      <PageContainer sx={{ pt: { xs: 1.5, md: 3 } }}>
        <Box sx={{ mb: { xs: 1.5, md: 2 } }}><Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Flyers & Offers' }]} /></Box>

        {/* Flyer cover */}
        <Box
          component="section"
          aria-labelledby="flyers-page-title"
          sx={{
            position: 'relative', overflow: 'hidden', borderRadius: radius.xl, bgcolor: colors.red, color: '#fff', p: { xs: 2.5, sm: 3.5, md: 5 },
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 14px, transparent 14px 28px)',
            display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1.1fr) minmax(0,1fr)' }, gap: { xs: 3, md: 4 }, alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="overline" component="p" sx={{ color: '#FFE4E4' }}>Warehouse flyer{weekly ? ` · ${dateRange(weekly.offer.valid_from, weekly.offer.valid_to)}` : ''}</Typography>
            <Typography id="flyers-page-title" variant="h1" sx={{ color: '#fff', fontSize: { xs: 34, md: 52 }, lineHeight: 1.02, mt: 1 }}>Flyers &amp; Offers</Typography>
            <Typography sx={{ mt: 1.5, fontSize: { xs: 15, md: 17 }, color: 'rgba(255,255,255,.92)', maxWidth: 500 }}>
              {deals.length} deals at {warehouse.name} this week{maxPct ? <> — save up to <b>{maxPct}%</b> on kitchen staples</> : null}.
            </Typography>

            <Box sx={{ mt: 2.5 }}>
              <Typography id="wh-label" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 13, fontWeight: 600, mb: 0.75, color: 'rgba(255,255,255,.9)' }}><MapPinIcon sx={{ fontSize: 16 }} /> Prices for</Typography>
              <Box role="radiogroup" aria-labelledby="wh-label" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {warehouses.map((w) => {
                  const on = w.id === warehouseId
                  return (
                    <Box
                      key={w.id}
                      component="button"
                      role="radio"
                      aria-checked={on}
                      title={w.area}
                      onClick={() => pickWarehouse(w.id)}
                      sx={{
                        all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minHeight: 40, px: 1.75, display: 'inline-flex', alignItems: 'center', borderRadius: radius.pill, fontSize: 14, fontWeight: 600,
                        bgcolor: on ? '#fff' : 'rgba(255,255,255,.14)', color: on ? colors.redText : '#fff', border: `1px solid ${on ? '#fff' : 'rgba(255,255,255,.4)'}`,
                        transition: `background-color ${motion.fast}`, '&:hover': { bgcolor: on ? '#fff' : 'rgba(255,255,255,.24)' }, '&:focus-visible': { outline: '2px solid #fff', outlineOffset: 2 },
                      }}
                    >
                      {w.name}
                    </Box>
                  )
                })}
              </Box>
            </Box>

            {weekly && <Box sx={{ mt: 2.5 }}><Countdown to={weekly.offer.valid_to} label="This week’s hot picks end in" /></Box>}

            <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 3 }}>
              <Button size="large" endIcon={<ArrowRightIcon />} onClick={() => shop('all')} sx={{ bgcolor: '#fff', color: colors.redText, '&:hover': { bgcolor: colors.redTint }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: 2 } }}>
                Shop the deals
              </Button>
              {posters.length > 0 && (
                <Button size="large" onClick={() => setViewer(0)} sx={{ color: '#fff', border: '1px solid rgba(255,255,255,.7)', '&:hover': { bgcolor: 'rgba(255,255,255,.12)' }, '&.Mui-focusVisible': { outline: '2px solid #fff', outlineOffset: 2 } }}>
                  Open the flyer
                </Button>
              )}
            </Box>
          </Box>
          <Stickers deals={stickers} />
        </Box>
      </PageContainer>

      {/* Flip-through flyers */}
      {posters.length > 0 && (
        <Section id="flyers" eyebrow="Flip through" title={`This week’s flyers at ${warehouse.name}`} subtitle="Tap a flyer to open it full size, then shop its deals.">
          <Rail label="Flyers" itemWidth={{ xs: '72%', sm: '44%', md: '31%', lg: '23.5%' }}>
            {posters.map((p, i) => (
              <Box role="listitem" key={p.type}>
                <Box
                  component="button"
                  onClick={() => setViewer(i)}
                  aria-label={`Open the ${dealTypes.find((d) => d.id === p.type)?.label} flyer, ${p.deals.length} deals`}
                  sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'zoom-in', display: 'block', width: '100%', borderRadius: radius.lg, transition: `transform ${motion.base}, box-shadow ${motion.base}`, '&:hover': { transform: 'translateY(-4px) rotate(-.6deg)', boxShadow: shadow.lg }, ...focusRing }}
                >
                  <FlyerPoster poster={p} warehouse={warehouse.name} />
                </Box>
              </Box>
            ))}
          </Rail>

          <Typography component="h3" variant="h3" sx={{ mt: { xs: 4, md: 5 }, mb: 2 }}>In store now</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))' } }}>
            {IN_STORE.map((p) => (
              <li key={p.src}>
                <Box component={Link} href={p.href} sx={{ display: 'block', borderRadius: radius.lg, overflow: 'hidden', border: `1px solid ${colors.line}`, textDecoration: 'none', color: colors.ink, bgcolor: '#fff', transition: `box-shadow ${motion.base}`, '&:hover': { boxShadow: shadow.md }, '&:hover .cta': { gap: 1 }, ...focusRing }}>
                  <Box component="img" src={p.src} alt={p.alt} loading="lazy" sx={{ display: 'block', width: '100%', aspectRatio: '1600 / 685', objectFit: 'cover' }} />
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{p.title}</Typography>
                      <Typography sx={{ fontSize: 14, color: colors.ink600 }}>{p.text}</Typography>
                    </Box>
                    <Box className="cta" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: colors.redText, fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', transition: `gap ${motion.fast}` }}>
                      {p.cta} <ArrowRightIcon sx={{ fontSize: 18 }} />
                    </Box>
                  </Box>
                </Box>
              </li>
            ))}
          </Box>
        </Section>
      )}

      {/* All deals */}
      <Section id="deals" band="subtle" labelledBy="deals-title">
        <SectionHeading
          id="deals-title"
          eyebrow="Shop the flyer"
          title={`All deals at ${warehouse.name}`}
          subtitle={activeType ? activeType.description : 'Prices valid while stock lasts. Mix and match across deal types.'}
          extra={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="label" htmlFor="deal-sort" sx={{ fontSize: 14, color: colors.ink600, display: { xs: 'none', sm: 'block' } }}>Sort</Typography>
              <Select id="deal-sort" size="small" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} inputProps={{ 'aria-label': 'Sort deals' }} sx={{ minWidth: 180, fontSize: 14, bgcolor: '#fff', '& .MuiSelect-select': { py: 1.1 } }}>
                <MenuItem value="saving">Biggest saving</MenuItem>
                <MenuItem value="ending">Ending soonest</MenuItem>
                <MenuItem value="price">Lowest price</MenuItem>
              </Select>
            </Box>
          }
        />
        <Box role="group" aria-label="Deal type" sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2, mx: -2, px: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip label={`All deals (${deals.length})`} onClick={() => setType('all')} color={type === 'all' ? 'secondary' : 'default'} variant={type === 'all' ? 'filled' : 'outlined'} aria-pressed={type === 'all'} sx={{ bgcolor: type === 'all' ? undefined : '#fff' }} />
          {dealTypes.map((d) => {
            const Icon = dealStyle[d.id].icon
            const on = type === d.id
            return <Chip key={d.id} icon={<Icon />} label={`${d.label} (${counts[d.id]})`} onClick={() => setType(d.id)} disabled={!counts[d.id]} color={on ? 'secondary' : 'default'} variant={on ? 'filled' : 'outlined'} aria-pressed={on} sx={{ bgcolor: on ? undefined : '#fff' }} />
          })}
        </Box>
        <Typography role="status" aria-live="polite" sx={{ fontSize: 14, color: colors.ink600, mb: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TagIcon sx={{ fontSize: 18 }} /> {shown.length} deal{shown.length === 1 ? '' : 's'}{activeType ? ` · ${activeType.label}` : ''}
        </Typography>
        {shown.length ? (
          <Box component="ul" aria-label={`Deals at ${warehouse.name}`} sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: dealGrid }}>
            {shown.map((d) => <li key={d.offer.id}><DealCard offer={d.offer} product={d.product} /></li>)}
          </Box>
        ) : (
          <EmptyState size="inline" icon={<TagIcon />} title={`No ${activeType?.label ?? 'deals'} at ${warehouse.name} right now`} actions={<Button variant="contained" onClick={() => setType('all')}>See all {warehouse.name} deals</Button>}>
            New deals start every Monday. Other warehouses may have this deal type today.
          </EmptyState>
        )}
      </Section>

      {/* Next week, prices hidden until Monday */}
      {coming.length > 0 && (
        <Section id="coming-next" eyebrow="Sneak peek" title="Coming next week" subtitle="Prices drop Monday — subscribe below to see them first.">
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' } }}>
            {coming.map((t) => {
              const style = dealStyle[t.dealType]
              return (
                <Box component="li" key={t.id} sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ position: 'relative', aspectRatio: '16 / 10', bgcolor: colors.sunken, overflow: 'hidden' }}>
                    <Box component="img" src={t.image} alt="" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: style.bg, color: style.fg, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', px: 1, py: 0.25, borderRadius: radius.xs }}>
                      {dealTypes.find((d) => d.id === t.dealType)?.label}
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.ink500, textTransform: 'uppercase', letterSpacing: '.06em' }}>{t.category}</Typography>
                    <Typography component="h3" sx={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{t.title}</Typography>
                    <Typography sx={{ fontSize: 13.5, color: colors.ink600 }}>{t.teaser}</Typography>
                    <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Box aria-hidden sx={{ fontSize: 20, fontWeight: 700, color: colors.redText, filter: 'blur(6px)', userSelect: 'none' }}>$24.99</Box>
                      <Typography sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 12.5, fontWeight: 600, color: colors.ink700 }}><ClockIcon sx={{ fontSize: 15 }} /> Price Monday</Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </Section>
      )}

      <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
        <Box sx={{ p: { xs: 2.5, md: 4 }, borderRadius: radius.xl, bgcolor: colors.navyDark, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2.5 }}>
          <Box>
            <Typography component="h2" variant="h2" sx={{ color: '#fff' }}>Get the flyer every Monday</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.78)', mt: 0.75 }}>{`One short email with the ${warehouse.name} hot picks and flyer. Unsubscribe anytime.`}</Typography>
          </Box>
          <Subscribe warehouse={warehouse.name} />
        </Box>
      </PageContainer>

      <PosterViewer posters={posters} index={viewer} warehouse={warehouse.name} onClose={() => setViewer(null)} onShop={(t) => shop(t)} />
    </>
  )
}
