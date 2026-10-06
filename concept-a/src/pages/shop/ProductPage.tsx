import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, IconButton, Skeleton, Stack, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded'
import CheckRounded from '@mui/icons-material/CheckRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import AcUnitRounded from '@mui/icons-material/AcUnitRounded'
import NotificationsActiveOutlined from '@mui/icons-material/NotificationsActiveOutlined'
import WhatsApp from '@mui/icons-material/WhatsApp'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import { tokens } from '../../theme'
import { deptBySlug, money, productBySku, productBySlug, productDescriptionHtml, products, type Product } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, EmptyState, NewFeatureTag, PackChip, SectionHeader } from '../../components/ui'
import { Price, ProductRail, QtyStepper, Rating, StockLabel, WishlistButton } from '../../components/Commerce'
import { Breadcrumbs } from '../../components/Shared'
import Gallery from './pdp/Gallery'
import Reviews from './pdp/Reviews'
import SearchOffRounded from '@mui/icons-material/SearchOffRounded'

const c = tokens.color

/** Configurable products: options come from Magento configurable_options. */
const variantsFor = (p: Product) => {
  if (p.type === 'configurable') {
    if (p.dept === 'packaging' && p.sub.includes('Gloves')) return { label: 'Size', values: ['S', 'M', 'L', 'XL'] }
    if (p.dept === 'packaging') return { label: 'Size', values: ['1.5 lb', '2.25 lb', '5 lb'] }
    if (p.dept === 'meat-poultry' || p.dept === 'frozen') return { label: 'Cut weight', values: ['≈ 5 kg', '≈ 10 kg'] }
    return { label: 'Size', values: ['12" × 18"', '18" × 24"', '24" × 36"'] }
  }
  if (p.type === 'grouped') return { label: 'Bag size', values: ['10 kg', '20 kg'] }
  return null
}

function useCountdown() {
  const [m, setM] = useState(2 * 60 + 14)
  useEffect(() => {
    const t = window.setInterval(() => setM((x) => (x > 0 ? x - 1 : 0)), 60000)
    return () => window.clearInterval(t)
  }, [])
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export default function ProductPage() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  const { markViewed, recentlyViewed, review } = useApp()
  useEffect(() => {
    if (product) markViewed(product.sku)
  }, [product?.sku]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!product)
    return (
      <Container>
        <EmptyState icon={<SearchOffRounded />} title="We couldn’t find that product" body="It may have been renamed or discontinued. Search by name or SKU to find a replacement." action="Browse all categories" href="/all-categories" />
      </Container>
    )

  const dept = deptBySlug(product.dept)
  const similar = products.filter((p) => p.dept === product.dept && p.sku !== product.sku).slice(0, 12)
  const related = products.filter((p) => p.dept !== product.dept && (p.recommended || p.isNew)).slice(0, 12)
  const recent = recentlyViewed.filter((s) => s !== product.sku).map(productBySku).filter(Boolean) as Product[]

  return (
    <Box key={product.sku}>
      <Container sx={{ pt: { xs: 2, md: 3 } }}>
        <Breadcrumbs
          items={[
            { label: dept?.name ?? '', to: `/c/${product.dept}` },
            { label: product.sub, to: `/c/${product.dept}?sub=${encodeURIComponent(product.sub)}` },
            { label: product.name },
          ]}
          sx={{ mb: { xs: 2, md: 3 } }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2,minmax(0,1fr))', lg: 'minmax(0,1.05fr) minmax(0,1fr)' }, gap: { xs: 3, md: 5, xl: 7 }, alignItems: 'start' }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 120, lg: 190 } }}>
            {review.loading ? <Skeleton variant="rounded" sx={{ aspectRatio: '1/1', height: 'auto', borderRadius: `${tokens.radius.lg}px` }} /> : <Gallery product={product} />}
          </Box>
          <BuyBox product={product} />
        </Box>

        <Details product={product} />

        <Box component="section" sx={{ mt: { xs: 6, md: 9 } }}>
          <SectionHeader eyebrow="Same aisle" title="Looking similar" action={`More ${dept?.name ?? ''}`} href={`/c/${product.dept}`} />
          <ProductRail items={similar} loading={review.loading} />
        </Box>
        <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
          <SectionHeader eyebrow="Kitchens also bought" title="Related products" />
          <ProductRail items={related} loading={review.loading} />
        </Box>
        {recent.length > 0 && (
          <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
            <SectionHeader eyebrow="Pick up where you left off" title="Recently viewed" />
            <ProductRail items={recent} />
          </Box>
        )}
      </Container>
    </Box>
  )
}

/* ------------------------------------------------------------------ Buy box */

function BuyBox({ product }: { product: Product }) {
  const { addToCart, toast, review, priceFor } = useApp()
  const [qty, setQty] = useState(1)
  const [variant, setVariant] = useState<string | null>(null)
  const [variantErr, setVariantErr] = useState(false)
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle')
  const [copied, setCopied] = useState(false)
  const countdown = useCountdown()
  const variants = variantsFor(product)
  const oos = product.stock === 'OUT_OF_STOCK'

  const add = () => {
    if (variants && !variant) {
      setVariantErr(true)
      return
    }
    setState('adding')
    window.setTimeout(() => {
      addToCart(product.sku, qty)
      setState('added')
      window.setTimeout(() => setState('idle'), 1500)
    }, 650)
  }

  const copy = () => {
    navigator.clipboard?.writeText(product.sku).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const addBtn = (size: 'large' | 'medium', full = true) =>
    oos ? (
      <Button variant="outlined" color="secondary" size={size} fullWidth={full} startIcon={<NotificationsActiveOutlined />} onClick={() => toast('We’ll email you when it’s back in stock', 'info')} sx={{ minHeight: size === 'large' ? 52 : 44 }}>
        Notify me
      </Button>
    ) : (
      <Button
        variant="contained"
        size={size}
        fullWidth={full}
        color={state === 'added' ? 'success' : 'primary'}
        onClick={add}
        disabled={state === 'adding'}
        startIcon={state === 'adding' ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : state === 'added' ? <CheckRounded /> : <AddShoppingCartRounded />}
        sx={{ whiteSpace: 'nowrap', px: { xs: 1.5, sm: 3 }, minHeight: size === 'large' ? 52 : 44, '&.Mui-disabled': { bgcolor: c.red, color: '#fff', opacity: 0.85 } }}
      >
        {state === 'adding' ? 'Adding…' : state === 'added' ? 'Added' : <>Add to cart<Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>&nbsp;· {money(priceFor(product) * qty)}</Box></>}
      </Button>
    )

  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <Button component={RouterLink} to={`/search/${encodeURIComponent(product.brand)}`} size="small" sx={{ px: 1.25, minHeight: 32, bgcolor: c.navyTint, color: c.navy, borderRadius: 999, fontWeight: 700 }}>
          {product.brand}
        </Button>
        <StockLabel stock={product.stock} />
      </Stack>
      <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 24, md: 32 }, lineHeight: 1.2, fontWeight: 700, letterSpacing: '-.01em' }}>
        {product.name}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
        <Stack direction="row" alignItems="center" sx={{ bgcolor: c.surface2, borderRadius: `${tokens.radius.xs}px`, pl: 1.25, maxWidth: '100%', minWidth: 0 }}>
          <Typography sx={{ fontFamily: tokens.font.mono, fontSize: 13, color: c.text2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SKU {product.sku}</Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy SKU'}>
            <IconButton aria-label="Copy SKU" onClick={copy} sx={{ width: 40, height: 40 }}>
              {copied ? <CheckRounded sx={{ fontSize: 18, color: c.successText }} /> : <ContentCopyRounded sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
        <PackChip pack={product.pack} />
        <Box component="button" onClick={() => { window.dispatchEvent(new Event('pdp-reviews')); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} aria-label="Go to reviews" sx={{ border: 0, bgcolor: 'transparent', p: 0, cursor: 'pointer', minHeight: 40 }}><Rating value={product.rating} count={product.reviews} /></Box>
      </Stack>

      <Box sx={{ mt: 3, p: { xs: 2, md: 3 }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px` }}>
        {review.loading ? (
          <Box><Skeleton width={160} height={48} /><Skeleton width={220} /></Box>
        ) : (
          <Price product={product} size="lg" />
        )}
        <Typography sx={{ fontSize: 12.5, color: c.text3, mt: 0.5 }}>Priced per pack ({product.pack}) · plus HST where applicable</Typography>

        {variants && (
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>
              {variants.label}: <Box component="span" sx={{ color: variant ? c.ink : c.text3, fontWeight: variant ? 700 : 400 }}>{variant ?? 'choose one'}</Box>
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap" role="radiogroup" aria-label={variants.label}>
              {variants.values.map((v) => {
                const on = v === variant
                return (
                  <Button
                    key={v}
                    role="radio"
                    aria-checked={on}
                    onClick={() => { setVariant(v); setVariantErr(false) }}
                    sx={{ minWidth: 64, minHeight: 44, borderRadius: `${tokens.radius.sm}px`, border: `2px solid ${on ? c.navy : variantErr ? c.error : c.line2}`, bgcolor: on ? c.navyTint : '#fff', color: on ? c.navy : c.ink, fontWeight: 600 }}
                  >
                    {v}
                  </Button>
                )
              })}
            </Stack>
            {variantErr && <Typography role="alert" sx={{ color: c.error, fontSize: 13, mt: 0.75, fontWeight: 500 }}>Choose a {variants.label.toLowerCase()} to add this to your cart</Typography>}
          </Box>
        )}

        <Stack direction="row" spacing={1.25} sx={{ mt: 2.5 }}>
          <QtyStepper value={qty} onChange={setQty} disabled={oos} label={`Quantity for ${product.name}`} />
          <Box sx={{ flex: 1, minWidth: 0 }}>{addBtn('large')}</Box>
          <WishlistButton sku={product.sku} sx={{ width: 52, height: 52, borderRadius: `${tokens.radius.md}px`, flexShrink: 0 }} />
        </Stack>
        {qty >= 5 && !oos && (
          <Typography sx={{ mt: 1.25, fontSize: 13, color: c.successText, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Inventory2Outlined sx={{ fontSize: 16 }} /> Buying 5+ cases? Bulk Saver pricing may apply. <NewFeatureTag label="Tier price" note="tier pricing display" />
          </Typography>
        )}
        {oos && <Typography sx={{ mt: 1.25, fontSize: 13, color: c.error, fontWeight: 500 }}>Out of stock at all warehouses. Usually restocked within 5–7 days.</Typography>}
      </Box>

      {/* Delivery promise */}
      <Box sx={{ mt: 2, borderRadius: `${tokens.radius.lg}px`, border: `1px solid ${c.line}`, overflow: 'hidden', bgcolor: '#fff' }}>
        <Stack direction="row" spacing={1.5} sx={{ p: 2, bgcolor: c.successTint }}>
          <LocalShippingOutlined sx={{ color: c.successText, mt: 0.25 }} />
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>
              Order in the next <Box component="span" sx={{ color: c.successText }}>{countdown}</Box> for next-day delivery
            </Typography>
            <Typography sx={{ fontSize: 13, color: c.text2 }}>Tomorrow, Wed Oct 7 · GTA, Hamilton &amp; Niagara routes</Typography>
            <NewFeatureTag label="Cut-off countdown" note="route cut-off time + next delivery date" sx={{ mt: 0.75 }} />
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ p: 2, borderTop: `1px solid ${c.line}` }}>
          <StorefrontOutlined sx={{ color: c.navy, mt: 0.25 }} />
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Pick up at Supreme Cash &amp; Carry</Typography>
            <Typography sx={{ fontSize: 13, color: c.text2 }}>3750A Laird Road, Unit 9, Mississauga · Mon–Sat 9am–6pm</Typography>
          </Box>
        </Stack>
        {['frozen', 'dairy-eggs', 'meat-poultry', 'produce'].includes(product.dept) && (
          <Stack direction="row" spacing={1.5} sx={{ p: 2, borderTop: `1px solid ${c.line}` }}>
            <AcUnitRounded sx={{ color: c.info, mt: 0.25 }} />
            <Typography sx={{ fontSize: 13.5 }}><b>Cold-chain delivery.</b> Kept at temperature from our dock to your walk-in.</Typography>
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, fontSize: 13.5, color: c.text2 }}>
        <WhatsApp sx={{ fontSize: 18, color: '#128C4B' }} />
        <span>Ordering 20+ cases? <Box component="a" href="https://wa.me/13657770999" sx={{ color: c.navy, fontWeight: 600 }}>Ask your rep for a quote</Box></span>
      </Stack>

      {/* Sticky mobile add-to-cart bar — inset 80px each side to clear the voice + chat buttons */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' }, position: 'fixed', left: 80, right: 80, bottom: 16, zIndex: 1140, alignItems: 'center',
          bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}`, p: 0.75, gap: 0.75,
        }}
      >
        <Box sx={{ pl: 0.75, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>{money(priceFor(product))}</Typography>
          <Typography sx={{ fontSize: 10.5, color: c.text3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qty} × {product.pack}</Typography>
        </Box>
        <Button
          variant="contained"
          color={state === 'added' ? 'success' : 'primary'}
          onClick={oos ? () => toast('We’ll email you when it’s back in stock', 'info') : add}
          aria-label={oos ? 'Notify me when back in stock' : 'Add to cart'}
          sx={{ ml: 'auto', minWidth: 0, px: 1.5, minHeight: 44, flexShrink: 0 }}
        >
          {oos ? 'Notify me' : state === 'added' ? <CheckRounded /> : state === 'adding' ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Add'}
        </Button>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Details tabs */

function Details({ product }: { product: Product }) {
  const [tab, setTab] = useState(0)
  const dept = deptBySlug(product.dept)
  const specs: [string, string][] = [
    ['SKU', product.sku],
    ['Brand', product.brand],
    ['Pack size', product.pack],
    ['Department', dept?.name ?? ''],
    ['Category', product.sub],
    ['Product type', product.type === 'simple' ? 'Single item' : product.type === 'configurable' ? 'Has options' : 'Grouped'],
    ['Availability', product.stock.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (m) => m.toUpperCase())],
  ]
  useEffect(() => {
    const h = () => setTab(2)
    window.addEventListener('pdp-reviews', h)
    return () => window.removeEventListener('pdp-reviews', h)
  }, [])
  return (
    <Box id="reviews" sx={{ scrollMarginTop: 200, mt: { xs: 5, md: 8 }, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden' }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" allowScrollButtonsMobile sx={{ px: { xs: 1, md: 3 }, borderBottom: `1px solid ${c.line}` }}>
        <Tab label="Description" />
        <Tab label="Specifications" />
        <Tab label={`Reviews (${product.reviews})`} />
      </Tabs>
      <Box sx={{ p: { xs: 2.5, md: 4 } }}>
        {tab === 0 && (
          <Box
            sx={{ maxWidth: 820, fontSize: 15, lineHeight: 1.75, color: c.text2, '& p': { mt: 0, mb: 2 }, '& strong': { color: c.ink }, '& ul': { pl: 2.5, mb: 2 }, '& li': { mb: 0.5 } }}
            dangerouslySetInnerHTML={{ __html: productDescriptionHtml(product) }}
          />
        )}
        {tab === 1 && (
          <Box component="dl" sx={{ m: 0, maxWidth: 720, display: 'grid', gridTemplateColumns: { xs: '120px 1fr', md: '200px 1fr' } }}>
            {specs.map(([k, v], i) => (
              <Box key={k} sx={{ display: 'contents', '& > *': { py: 1.5, px: 1.5, bgcolor: i % 2 ? 'transparent' : c.bg, fontSize: 14 } }}>
                <Box component="dt" sx={{ color: c.text3, fontWeight: 500, borderRadius: '8px 0 0 8px' }}>{k}</Box>
                <Box component="dd" sx={{ m: 0, fontWeight: 600, wordBreak: 'break-all', fontFamily: k === 'SKU' ? tokens.font.mono : undefined, borderRadius: '0 8px 8px 0' }}>{v}</Box>
              </Box>
            ))}
          </Box>
        )}
        {tab === 2 && <Reviews product={product} />}
      </Box>
    </Box>
  )
}
