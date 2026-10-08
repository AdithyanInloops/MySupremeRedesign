import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Box, Button, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { deptBySlug, money, offers, productBySlug, productDescriptionHtml, products, warehouses } from '../data/catalog'
import { deliverySlots } from '../data/app'
import ProductCard, { Heart } from '../components/ProductCard'
import { useDragScroll } from '../components/useDragScroll'
import { BottomBar, CartButton, EmptyState, HScroll, PackChip, Price, ProductPlaceholder, QtyStepper, SectionHeader, TopBar } from '../components/ui'
import { BellIcon, BoxIcon, CartPlusIcon, CheckIcon, CopyIcon, ShareIcon, StarIcon, StoreIcon, TagIcon, TruckIcon } from '../components/icons'

const c = tokens.color

function Gallery({ images, name, brand }: { images: string[]; name: string; brand: string }) {
  const [i, setI] = useState(0)
  const drag = useDragScroll<HTMLDivElement>()
  if (!images.length) return <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: c.surface2 }}><ProductPlaceholder brand={brand} label={name} /></Box>
  return (
    <Box sx={{ position: 'relative' }}>
      <Box {...drag} className="no-scrollbar" aria-roledescription="carousel" aria-label={`${name} photos`} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        sx={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', aspectRatio: '5 / 4', bgcolor: c.surface2 }}>
        {images.map((src, k) => <Box key={src} component="img" src={src} alt={`${name}, photo ${k + 1} of ${images.length}`} sx={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover', scrollSnapAlign: 'start' }} />)}
      </Box>
      {images.length > 1 && (
        <Box sx={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.75 }} aria-hidden>
          {images.map((s, k) => <Box key={s} sx={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, bgcolor: k === i ? '#fff' : 'rgba(255,255,255,.55)', transition: 'width .2s' }} />)}
        </Box>
      )}
    </Box>
  )
}

/** Options for configurable products (production: Magento configurable options). */
const optionsFor = (name: string) => (/glove/i.test(name) ? ['S', 'M', 'L', 'XL'] : /salmon|striploin/i.test(name) ? ['Whole', 'Portioned 8 oz'] : ['Standard', 'Bulk case'])

export default function ProductScreen() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  const { add, qtyOf, warehouse, notify, signedIn, markViewed } = useApp()
  const [qty, setQty] = useState(1)
  const [option, setOption] = useState('')
  const [optErr, setOptErr] = useState(false)
  const [tab, setTab] = useState(0)
  const [added, setAdded] = useState(false)
  useEffect(() => { if (product) markViewed(product.sku) }, [product?.sku, markViewed])
  useEffect(() => { if (!added) return; const t = window.setTimeout(() => setAdded(false), 1800); return () => window.clearTimeout(t) }, [added])

  if (!product) return <><TopBar /><EmptyState icon={BoxIcon} title="Product not found" body="It may have been discontinued. Search for an alternative." action="Search products" to="/search" /></>

  const dept = deptBySlug(product.dept)
  const offer = offers.find((o) => o.sku === product.sku && o.warehouses.includes(warehouse))
  const inCart = qtyOf(product.sku)
  const oos = product.stock === 'OUT_OF_STOCK'
  const configurable = product.type !== 'simple'
  const related = products.filter((p) => p.dept === product.dept && p.sku !== product.sku).slice(0, 8)
  const slot = deliverySlots[0]
  const addNow = () => {
    if (configurable && !option) { setOptErr(true); return }
    add(product.sku, qty, { offerId: offer?.id })
    setAdded(true)
    setQty(1)
  }
  const copy = async () => { try { await navigator.clipboard.writeText(product.sku) } catch { /* blocked */ } notify({ message: 'SKU copied', detail: product.sku, tone: 'info' }) }

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100%' }}>
      <TopBar transparent actions={<>
        <IconButton aria-label="Share product" onClick={() => notify({ message: 'Link copied', detail: 'Share it with your team or rep', tone: 'info' })} sx={{ width: 40, height: 40, mr: 0.75 }}><ShareIcon sx={{ fontSize: 19 }} /></IconButton>
        <Heart product={product} sx={{ width: 40, height: 40, mr: 0.75 }} />
        <CartButton />
      </>} />
      <Box sx={{ mt: '-56px' }}><Gallery images={product.images} name={product.name} brand={product.brand} /></Box>

      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: c.navy }}>{product.brand}</Typography>
          {dept && <Typography component={RouterLink} to={`/shop/${dept.slug}`} sx={{ fontSize: 12.5, color: c.text3, textDecoration: 'none' }}>· {dept.name} › {product.sub}</Typography>}
        </Box>
        <Typography component="h1" sx={{ fontSize: 21, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-.01em', mt: 0.5, overflowWrap: 'anywhere' }}>{product.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          <Box component="button" onClick={copy} aria-label={`Copy SKU ${product.sku}`} sx={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0.5, fontFamily: tokens.font.mono, fontSize: 12, color: c.text2, bgcolor: c.surface2, px: 1, minHeight: 30, borderRadius: 1, ...focusRing }}>
            SKU {product.sku} <CopyIcon sx={{ fontSize: 13 }} />
          </Box>
          <PackChip pack={product.pack} size="md" />
          {product.reviews > 0 && <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontSize: 12.5, color: c.text2 }}><StarIcon sx={{ fontSize: 15, color: '#E89B00' }} /> {product.rating.toFixed(1)} ({product.reviews})</Box>}
        </Box>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1 }}>
          <Price product={product} size="lg" offerPrice={offer?.offerPrice} />
          {product.stock === 'LOW_STOCK' && <Box sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: c.warningTint, color: c.warning, fontSize: 12, fontWeight: 700 }}>Only a few left</Box>}
          {oos && <Box sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: c.surface2, color: c.text2, fontSize: 12, fontWeight: 700 }}>Out of stock</Box>}
        </Box>
        {!signedIn && product.groupPrice && <Typography component={RouterLink} to="/signin" sx={{ display: 'inline-block', mt: 0.75, fontSize: 13, color: c.navy, fontWeight: 600 }}>Sign in to see your business price</Typography>}

        {offer && (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 1.25, p: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.navy, color: '#fff' }}>
            <TagIcon sx={{ color: c.saffron, mt: 0.25 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{offer.deal}{offer.note ? ` · ${offer.note}` : ''}</Typography>
              <Typography sx={{ fontSize: 12.5, opacity: 0.85 }}>{money(offer.offerPrice)} at {warehouses.find((w) => w.id === warehouse)?.name} until {offer.to.slice(5).replace('-', '/')}</Typography>
            </Box>
          </Box>
        )}

        {configurable && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>Choose an option {optErr && !option && <Box component="span" sx={{ color: c.error, fontWeight: 500 }}>— required</Box>}</Typography>
            <Box role="radiogroup" aria-label="Option" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {optionsFor(product.name).map((o) => (
                <Box key={o} component="button" role="radio" aria-checked={option === o} onClick={() => { setOption(o); setOptErr(false) }}
                  sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minWidth: 52, minHeight: 44, px: 1.75, display: 'grid', placeItems: 'center', borderRadius: `${tokens.radius.sm}px`, fontWeight: 600, fontSize: 14, border: `${option === o ? 2 : 1.5}px solid ${option === o ? c.navy : optErr ? c.error : c.line2}`, color: option === o ? c.navy : c.ink, bgcolor: option === o ? c.navyTint : '#fff', ...focusRing }}>
                  {o}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2, borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, '& > * + *': { borderTop: `1px solid ${c.line}` } }}>
          <Box sx={{ display: 'flex', gap: 1.5, p: 1.5 }}>
            <TruckIcon sx={{ color: c.navy }} />
            <Box><Typography sx={{ fontSize: 14, fontWeight: 600 }}>Delivery {slot.day.toLowerCase()}, {slot.window}</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>{slot.note} · free over $350</Typography></Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, p: 1.5 }}>
            <StoreIcon sx={{ color: c.navy }} />
            <Box><Typography sx={{ fontSize: 14, fontWeight: 600 }}>Pickup in 2 hours</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>3750A Laird Road, Mississauga</Typography></Box>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mt: 2.5, borderBottom: `1px solid ${c.line}` }} aria-label="Product information">
          <Tab label="Details" id="pt-0" aria-controls="pp" />
          <Tab label="Specs" id="pt-1" aria-controls="pp" />
          <Tab label={`Reviews${product.reviews ? ` (${product.reviews})` : ''}`} id="pt-2" aria-controls="pp" />
        </Tabs>
        <Box id="pp" role="tabpanel" aria-labelledby={`pt-${tab}`} sx={{ py: 2, fontSize: 14.5, color: c.text2, lineHeight: 1.65, '& p': { mt: 0 }, '& ul': { pl: 2.5 } }}>
          {tab === 0 && <Box dangerouslySetInnerHTML={{ __html: productDescriptionHtml(product) }} />}
          {tab === 1 && (
            <Box component="dl" sx={{ m: 0, '& > div': { display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25, borderBottom: `1px solid ${c.line}` }, '& dt': { color: c.text3 }, '& dd': { m: 0, color: c.ink, fontWeight: 600, textAlign: 'right' } }}>
              {[['SKU', product.sku], ['Brand', product.brand], ['Pack size', product.pack], ['Department', dept?.name ?? ''], ['Category', product.sub], ['Sold by', 'Case / unit as listed']].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </Box>
          )}
          {tab === 2 && (product.reviews ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ fontSize: 34, fontWeight: 800, color: c.ink }}>{product.rating.toFixed(1)}</Typography>
                <Box><Box sx={{ display: 'flex', color: '#E89B00' }}>{[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} sx={{ fontSize: 18, opacity: s <= Math.round(product.rating) ? 1 : 0.25 }} />)}</Box><Typography sx={{ fontSize: 12.5 }}>{product.reviews} reviews from kitchens</Typography></Box>
              </Box>
              <Box sx={{ mt: 1.5, p: 1.5, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.surface2 }}><Typography sx={{ fontSize: 14, color: c.ink }}>“Consistent quality every order. Our go-to.”</Typography><Typography sx={{ fontSize: 12, mt: 0.5 }}>Daybreak Café · St. Catharines</Typography></Box>
            </Box>
          ) : <Typography>No reviews yet. Be the first after your next order.</Typography>)}
        </Box>
      </Box>

      {related.length > 0 && (
        <Box sx={{ pb: 2 }}>
          <SectionHeader title={`More in ${dept?.name ?? 'this department'}`} action="See all" to={`/shop/${product.dept}`} />
          <HScroll gap={1}>{related.map((p) => <ProductCard key={p.sku} product={p} width={150} />)}</HScroll>
        </Box>
      )}

      <BottomBar>
        {oos ? (
          <Button fullWidth variant="contained" color="secondary" size="large" startIcon={<BellIcon />} onClick={() => notify({ message: 'We’ll let you know', detail: 'Push notification when it’s back in stock', tone: 'info' })}>Notify me when back</Button>
        ) : (
          <Box>
            {inCart > 0 && <Typography sx={{ fontSize: 12.5, color: c.successText, fontWeight: 600, mb: 0.75 }}><Box component={RouterLink} to="/cart" sx={{ color: 'inherit' }}>{inCart} in your cart · view cart</Box></Typography>}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <QtyStepper value={qty} onChange={setQty} size="lg" label={`Quantity of ${product.name}`} />
              <Button fullWidth variant="contained" size="large" onClick={addNow} startIcon={added ? <CheckIcon /> : <CartPlusIcon />} sx={added ? { bgcolor: c.successText, '&:hover': { bgcolor: c.successText } } : undefined}>
                {added ? 'Added' : `Add · ${money((offer?.offerPrice ?? (signedIn && product.groupPrice ? product.groupPrice : product.price)) * qty)}`}
              </Button>
            </Box>
          </Box>
        )}
      </BottomBar>
    </Box>
  )
}
