import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Button, Chip, InputBase, Typography } from '@mui/material'
import offersJson from '../data/offers.json'
import { products } from '../lib/data'
import { emailError } from '../lib/validate'
import { colors, focusRing, motion, radius } from '../lib/theme'
import PageHeader from '../components/ui/PageHeader'
import Section, { PageContainer, SectionHeading } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import { DealCard, type Offer } from '../components/HomeComponents/WeeklyDeals'
import { dealTypes, offers as teasers, warehouses, type DealTypeId } from '../components/Pages/FlyersOffers/flyersOffersData'
import { type IconComponent, BoxIcon, CalendarIcon, ClockIcon, FlameIcon, MailCheckIcon, TagIcon, UtensilsIcon, WarehouseIcon } from '../components/ui/icons'

/*
 * Flyers & Offers — the "live" version the design brief asks for: real prices, validity dates and add to cart,
 * filtered by warehouse and deal type. The old coming-soon teasers stay as "Coming next".
 * NEW FEATURE: offer entity (deal type, sku, offer price, valid from/to, warehouses) — data/offers.json.
 */

const TYPE_OF: Record<string, DealTypeId> = { 'Monthly Flyer': 'monthly', 'Weekly Hot Pick': 'weekly', 'Bulk Saver': 'bulk', 'Restaurant Bundle': 'bundle' }
const ICON: Record<DealTypeId, IconComponent> = { monthly: CalendarIcon, weekly: FlameIcon, bulk: BoxIcon, bundle: UtensilsIcon }
const allOffers = offersJson.offers as Offer[]

function Subscribe({ warehouse }: { warehouse: string }) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)
  const error = emailError(email)
  if (done) {
    return (
      <Box role="status" sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
        <MailCheckIcon sx={{ color: '#86EFAC' }} />
        <Typography sx={{ color: '#fff' }}>You’re in. The {warehouse} deals arrive at {email} every Monday morning.</Typography>
      </Box>
    )
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (!error) setDone(true) }} sx={{ width: '100%', maxWidth: 460 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box component="label" htmlFor="deals-email" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>Email</Box>
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

export default function FlyersOffers() {
  const router = useRouter()
  const [warehouseId, setWarehouseId] = useState(warehouses[0].id)
  const [type, setType] = useState<DealTypeId | 'all'>('all')
  // Remember the buyer's warehouse in the URL (shareable, survives Back).
  useEffect(() => {
    const w = router.query.w
    if (typeof w === 'string' && warehouses.some((x) => x.id === w)) setWarehouseId(w)
  }, [router.query.w])
  const pickWarehouse = (id: string) => {
    setWarehouseId(id)
    router.replace({ pathname: router.pathname, query: { ...router.query, w: id } }, undefined, { shallow: true, scroll: false })
  }

  const warehouse = warehouses.find((w) => w.id === warehouseId) ?? warehouses[0]
  const here = useMemo(() => allOffers.filter((o) => !o.warehouses || o.warehouses.includes(warehouseId)), [warehouseId])
  const counts = Object.fromEntries(dealTypes.map((d) => [d.id, here.filter((o) => TYPE_OF[o.deal_type] === d.id).length])) as Record<DealTypeId, number>
  const shown = here
    .filter((o) => type === 'all' || TYPE_OF[o.deal_type] === type)
    .map((o) => ({ offer: o, product: products.find((p) => p.sku === o.sku) }))
    .filter((d): d is { offer: Offer; product: (typeof products)[number] } => !!d.product)
  const coming = teasers.filter((t) => t.warehouseIds.includes(warehouseId) && (type === 'all' || t.dealType === type)).slice(0, 4)
  const activeType = dealTypes.find((d) => d.id === type)

  return (
    <>
      <Head>
        <title>Flyers &amp; Offers | MySupreme</title>
        <meta name="description" content="This week’s warehouse deals: weekly hot picks, bulk savings, the monthly flyer and restaurant bundles — with prices and add to cart." />
      </Head>
      <PageContainer>
        <PageHeader
          breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Flyers & Offers' }]}
          eyebrow="Warehouse deals"
          title="Flyers & Offers"
          description="Real prices from your nearest warehouse. New hot picks every Monday, a fresh flyer every month."
        />

        {/* Warehouse picker: deals differ by warehouse */}
        <Box role="radiogroup" aria-label="Your warehouse" sx={{ display: 'grid', gap: 1.25, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: `repeat(${warehouses.length}, minmax(0,1fr))` }, mb: 3 }}>
          {warehouses.map((w) => {
            const on = w.id === warehouseId
            return (
              <Box
                key={w.id}
                component="button"
                role="radio"
                aria-checked={on}
                onClick={() => pickWarehouse(w.id)}
                sx={{
                  all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, borderRadius: radius.lg,
                  border: `${on ? 2 : 1}px solid ${on ? colors.ink : colors.line2}`, m: on ? 0 : '1px', bgcolor: on ? colors.subtle : '#fff',
                  transition: `border-color ${motion.fast}`, '&:hover': { borderColor: on ? colors.ink : colors.ink400 }, ...focusRing,
                }}
              >
                <WarehouseIcon sx={{ color: on ? colors.redText : colors.ink500 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{w.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: colors.ink600 }}>{w.area}</Typography>
                </Box>
                {on && <Box component="span" sx={{ ml: 'auto', fontSize: 12, fontWeight: 600, color: colors.ink600 }}>Selected</Box>}
              </Box>
            )
          })}
        </Box>

        <Box role="group" aria-label="Deal type" sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 2.5, mx: -2, px: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <Chip label={`All deals (${here.length})`} onClick={() => setType('all')} color={type === 'all' ? 'secondary' : 'default'} variant={type === 'all' ? 'filled' : 'outlined'} aria-pressed={type === 'all'} />
          {dealTypes.map((d) => {
            const Icon = ICON[d.id]
            return <Chip key={d.id} icon={<Icon />} label={`${d.label} (${counts[d.id]})`} onClick={() => setType(d.id)} color={type === d.id ? 'secondary' : 'default'} variant={type === d.id ? 'filled' : 'outlined'} aria-pressed={type === d.id} />
          })}
        </Box>

        {activeType && <Typography sx={{ color: colors.ink600, mb: 2 }}>{activeType.description}</Typography>}

        <Box role="status" aria-live="polite" sx={{ fontSize: 14, color: colors.ink600, mb: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <TagIcon sx={{ fontSize: 18 }} /> {shown.length} deal{shown.length === 1 ? '' : 's'} at {warehouse.name} · prices valid while stock lasts
        </Box>
        {shown.length ? (
          <Box component="ul" aria-label={`Deals at ${warehouse.name}`} sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2, minmax(0,1fr))', lg: 'repeat(3, minmax(0,1fr))' } }}>
            {shown.map((d) => <li key={d.offer.id}><DealCard offer={d.offer} product={d.product} /></li>)}
          </Box>
        ) : (
          <EmptyState
            size="inline"
            icon={<TagIcon />}
            title={`No ${activeType?.label ?? 'deals'} at ${warehouse.name} right now`}
            actions={<Button variant="contained" onClick={() => setType('all')}>See all {warehouse.name} deals</Button>}
          >
            New deals start every Monday. Other warehouses may have this deal type today.
          </EmptyState>
        )}
      </PageContainer>

      {coming.length > 0 && (
        <Section id="coming-next" band="subtle" eyebrow="Coming next" title={`Next up at ${warehouse.name}`} subtitle="Prices are published on Monday — subscribe below to get them first">
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'repeat(2, minmax(0,1fr))', md: 'repeat(4, minmax(0,1fr))' } }}>
            {coming.map((t) => (
              <Box component="li" key={t.id} sx={{ bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', aspectRatio: '16 / 10', bgcolor: colors.sunken }}>
                  <Box component="img" src={t.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(17,24,39,.78)', color: '#fff', fontSize: 12, fontWeight: 600, px: 1, py: 0.25, borderRadius: radius.pill }}>
                    <ClockIcon sx={{ fontSize: 14 }} /> Prices Monday
                  </Box>
                </Box>
                <Box sx={{ p: 1.75 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.redText, letterSpacing: '.06em', textTransform: 'uppercase' }}>{dealTypes.find((d) => d.id === t.dealType)?.label} · {t.category}</Typography>
                  <Typography component="h3" sx={{ fontWeight: 600, fontSize: 15, mt: 0.25 }}>{t.title}</Typography>
                  <Typography sx={{ fontSize: 13.5, color: colors.ink600 }}>{t.teaser}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Section>
      )}

      <Section id="how-deals-work" title="How our deals work" eyebrow="Four ways to save">
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' } }}>
          {dealTypes.map((d) => {
            const Icon = ICON[d.id]
            return (
              <Box component="li" key={d.id} sx={{ p: 2.25, borderRadius: radius.lg, border: `1px solid ${colors.line}`, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center' }}><Icon /></Box>
                <Typography component="h3" sx={{ fontWeight: 600 }}>{d.label}</Typography>
                <Typography sx={{ fontSize: 14, color: colors.ink600 }}>{d.description}</Typography>
              </Box>
            )
          })}
        </Box>
        <Box sx={{ mt: { xs: 4, md: 5 }, p: { xs: 2.5, md: 4 }, borderRadius: radius.xl, bgcolor: colors.navyDark, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2.5 }}>
          <Box>
            <SectionHeading as="h2" title={<Box component="span" sx={{ color: '#fff' }}>Get the deals every Monday</Box>} subtitle={<Box component="span" sx={{ color: 'rgba(255,255,255,.78)' }}>{`One short email with the ${warehouse.name} hot picks and flyer. Unsubscribe anytime.`}</Box>} />
          </Box>
          <Subscribe warehouse={warehouse.name} />
        </Box>
      </Section>
    </>
  )
}
