import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Box, Button, IconButton, Tab, Tabs, Typography } from '@mui/material'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { departmentOf, finalPrice, hasImage, inStock, money, packSize, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { CUTOFF, DELIVERY_MINIMUM } from '../../lib/pricing'
import { colors, focusRing, motion, radius } from '../../lib/theme'
import { ProductPlaceholder } from '../ui/ProductImage'
import { PackChip, Price, SaleBadge, Sku } from '../ui/ProductMeta'
import QuantityStepper from '../ui/QuantityStepper'
import { StickyBottomBar } from '../ui/Feedback'
import { FavoriteButton } from '../Product/CartControl'

/** Brand label from Magento's `brand` attribute, as the live PDP reads it; null hides every brand element. */
export const brandOf = (p: Product) => p.brand_label

/* ------------------------------------------------------------------ Gallery */

function Gallery({ product }: { product: Product }) {
  const imgs = hasImage(product) ? (product.media_gallery?.length ? product.media_gallery : [product.small_image!]).filter((i) => !i.url.includes('/placeholder/')) : []
  const [i, setI] = useState(0)
  const frame = { position: 'relative', width: '100%', aspectRatio: '1 / 1', border: `1px solid ${colors.line}`, borderRadius: radius.xl, bgcolor: '#fff', overflow: 'hidden' } as const
  if (!imgs.length) {
    return (
      <Box>
        <Box sx={frame}><ProductPlaceholder /></Box>
        <Typography sx={{ mt: 1, fontSize: 13, color: colors.ink500, textAlign: 'center' }}>Product photo coming soon — check the pack size and SKU before ordering.</Typography>
      </Box>
    )
  }
  const go = (n: number) => setI((n + imgs.length) % imgs.length)
  const arrow = (side: 'left' | 'right') => ({ position: 'absolute', top: '50%', [side]: 12, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,.92)', boxShadow: '0 2px 8px rgba(16,24,40,.12)', '&:hover': { bgcolor: '#fff' } }) as const
  return (
    <Box
      role="region"
      aria-roledescription="carousel"
      aria-label={`${product.name} images`}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1) }}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Box sx={frame}>
        <Box component="img" src={imgs[i].url} alt={imgs.length > 1 ? `${product.name}, image ${i + 1} of ${imgs.length}` : product.name} sx={{ position: 'absolute', inset: '6%', width: '88%', height: '88%', objectFit: 'contain' }} />
        <SaleBadge product={product} sx={{ position: 'absolute', top: 14, left: 14, fontSize: 13 }} />
        {imgs.length > 1 && (
          <>
            <IconButton aria-label="Previous image" onClick={() => go(i - 1)} sx={arrow('left')}><ChevronLeftRoundedIcon /></IconButton>
            <IconButton aria-label="Next image" onClick={() => go(i + 1)} sx={arrow('right')}><ChevronRightRoundedIcon /></IconButton>
          </>
        )}
      </Box>
      {imgs.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }}>
          {imgs.map((im, k) => (
            <Box
              key={im.url}
              component="button"
              onClick={() => setI(k)}
              aria-label={`Show image ${k + 1}`}
              aria-current={k === i ? 'true' : undefined}
              sx={{ all: 'unset', cursor: 'pointer', width: 68, height: 68, flexShrink: 0, borderRadius: radius.md, border: `2px solid ${k === i ? colors.ink : colors.line}`, overflow: 'hidden', bgcolor: '#fff', transition: `border-color ${motion.fast}`, ...focusRing }}
            >
              <Box component="img" src={im.url} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

/* ------------------------------------------------------------------ Buy box */

function useAddFeedback() {
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(false), 2200)
    return () => window.clearTimeout(t)
  }, [added])
  return { added, flash: () => setAdded(true) }
}

function AddButton({ added, onClick, product, size = 'large' }: { added: boolean; onClick: () => void; product: Product; size?: 'large' | 'medium' }) {
  return (
    <Button
      variant="contained"
      size={size}
      onClick={onClick}
      startIcon={added ? <CheckRoundedIcon /> : <AddShoppingCartRoundedIcon />}
      aria-label={`Add ${product.name} to cart`}
      sx={{ flex: 1, minWidth: 0, ...(added ? { bgcolor: colors.success, '&:hover': { bgcolor: colors.success } } : {}) }}
    >
      {added ? 'Added to cart' : 'Add to cart'}
    </Button>
  )
}

export default function ProductDetailView({ product }: { product: Product }) {
  const { add, markViewed, qtyOf, ready } = useCart()
  const [qty, setQty] = useState(1)
  const { added, flash } = useAddFeedback()
  // Feeds the home "Pick up where you left off" row. Deferred one tick so it lands after the cart provider
  // restores the saved history on a full page load (otherwise the restore overwrites it).
  useEffect(() => {
    const t = window.setTimeout(() => markViewed(product.sku), 0)
    return () => window.clearTimeout(t)
  }, [product.sku, markViewed])
  const brand = brandOf(product)
  const uom = product.uom || 'pcs'
  const inCart = ready ? qtyOf(product.sku) : 0
  const available = inStock(product)
  const addNow = () => { add(product.sku, qty); flash(); setQty(1) }

  const info = [
    { icon: LocalShippingOutlinedIcon, title: 'Delivery', text: <>Order by {CUTOFF} for next-day delivery across the GTA, Hamilton &amp; Niagara (orders over ${DELIVERY_MINIMUM}). <Box component={Link} href="/#delivery" sx={{ color: colors.redText, fontWeight: 500, borderRadius: '4px', ...focusRing }}>Check your postal code</Box></> },
    { icon: StorefrontOutlinedIcon, title: 'Pickup', text: <>Free at our cash &amp; carry, 3750A Laird Road, Mississauga · Mon–Sat 9am–6pm</> },
    { icon: AssignmentReturnOutlinedIcon, title: 'Easy returns', text: <>Damaged or not right? Tell us within 48 hours for a replacement or credit.</> },
  ]

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)', lg: 'minmax(0,1.05fr) minmax(0,1fr)' }, gap: { xs: 3, md: 5 }, alignItems: 'start' }}>
        <Box sx={{ position: { md: 'sticky' }, top: { md: 150 } }}><Gallery product={product} /></Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <Box>
            {brand && (
              <Box component={Link} href={`/search/${encodeURIComponent(brand)}`} sx={{ display: 'inline-block', fontSize: 14, fontWeight: 600, color: colors.redText, textDecoration: 'none', mb: 0.5, borderRadius: '4px', '&:hover': { textDecoration: 'underline' }, ...focusRing }}>
                {brand}
              </Box>
            )}
            <Typography variant="h1" sx={{ fontSize: { xs: 22, md: 28 }, overflowWrap: 'anywhere' }}>{product.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
              <Sku sku={product.sku} copyable />
              {packSize(product) && <PackChip product={product} size="md" />}
              <Typography sx={{ fontSize: 13, color: colors.ink600 }}>Sold per {uom}</Typography>
            </Box>
          </Box>

          <Box sx={{ border: `1px solid ${colors.line}`, borderRadius: radius.xl, p: { xs: 2, md: 2.5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Price product={product} size="lg" showSave />
              <Typography sx={{ fontSize: 13, color: colors.ink500, mt: 0.5 }}>Guest price per {uom}. Business accounts may see customer-group pricing after sign-in.</Typography>
            </Box>
            {available ? (
              <Box sx={{ display: 'flex', gap: 1.25, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                <QuantityStepper value={qty} onChange={setQty} size="lg" unit={uom} label={`Quantity of ${product.name}`} />
                <AddButton added={added} onClick={addNow} product={product} />
              </Box>
            ) : (
              <Box role="status" sx={{ p: 1.75, borderRadius: radius.lg, bgcolor: colors.warningTint, border: `1px solid ${colors.warningLine}` }}>
                <Typography sx={{ fontWeight: 600, color: '#78350F' }}>Out of stock at the moment</Typography>
                <Typography sx={{ fontSize: 14, color: colors.ink700, mt: 0.25 }}>
                  Most items are back within a week. Save it to Favorites to find it fast, or call {''}
                  <Box component="a" href="tel:+13657770999" sx={{ color: colors.redText, fontWeight: 600 }}>+1 365-777-0999</Box> for an alternative.
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', minHeight: 44 }}>
              <Box role="status" aria-live="polite" sx={{ fontSize: 14, color: colors.ink700, display: 'flex', alignItems: 'center', gap: 1 }}>
                {inCart > 0 && (
                  <>
                    <ShoppingCartOutlinedIcon sx={{ fontSize: 19, color: colors.success }} />
                    <span><b>{inCart}</b> in your cart · {money(finalPrice(product) * inCart)}</span>
                    <Box component={Link} href="/cart" sx={{ color: colors.redText, fontWeight: 600, borderRadius: '4px', ...focusRing }}>View cart</Box>
                  </>
                )}
              </Box>
              <FavoriteButton product={product} variant="labelled" />
            </Box>
          </Box>

          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {info.map((it) => {
              const Icon = it.icon
              return (
                <Box component="li" key={it.title} sx={{ display: 'flex', gap: 1.5 }}>
                  <Icon sx={{ fontSize: 22, color: colors.ink500, mt: '1px' }} />
                  <Typography sx={{ fontSize: 14, color: colors.ink700 }}><b style={{ color: colors.ink }}>{it.title}.</b> {it.text}</Typography>
                </Box>
              )
            })}
          </Box>

          {brand && (
            <Box component={Link} href={`/search/${encodeURIComponent(brand)}`} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.75, borderRadius: radius.lg, bgcolor: colors.subtle, textDecoration: 'none', color: colors.ink, transition: `background-color ${motion.fast}`, '&:hover': { bgcolor: colors.sunken }, ...focusRing }}>
              <StorefrontOutlinedIcon sx={{ color: colors.ink500 }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, color: colors.ink600 }}>Explore more from</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{brand}</Typography>
              </Box>
              <EastRoundedIcon sx={{ color: colors.redText }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Phones: price + quantity + add stay in reach while reading the page */}
      <StickyBottomBar show={available}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ minWidth: 0, mr: 'auto' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{money(finalPrice(product))}</Typography>
            <Typography sx={{ fontSize: 12, color: colors.ink500, whiteSpace: 'nowrap' }}>{inCart ? `${inCart} in cart` : `per ${uom}`}</Typography>
          </Box>
          <QuantityStepper value={qty} onChange={setQty} size="md" label={`Quantity of ${product.name}`} />
          <Box sx={{ display: 'flex', flex: '0 1 150px' }}><AddButton added={added} onClick={addNow} product={product} size="medium" /></Box>
        </Box>
      </StickyBottomBar>
    </>
  )
}

/* ------------------------------------------------------------------ Description + specifications */

export function ProductDescription({ product }: { product: Product }) {
  const [tab, setTab] = useState<'desc' | 'specs'>('desc')
  const brand = brandOf(product)
  const html = product.description?.html?.trim() || product.short_description?.html || ''
  const specs: [string, string][] = [
    ['SKU', product.sku],
    ['Pack size', packSize(product) || '—'],
    ['Unit of measure', product.uom || 'pcs'],
    ...(brand ? [['Brand', brand] as [string, string]] : []),
    ...(product.manufacturer_label ? [['Manufacturer', product.manufacturer_label] as [string, string]] : []),
    ['Department', departmentOf(product)?.name ?? '—'],
  ]
  return (
    <Box component="section" aria-label="Product information" sx={{ mt: { xs: 5, md: 7 } }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Product information" sx={{ borderBottom: `1px solid ${colors.line}` }}>
        <Tab value="desc" label="Description" id="pi-tab-desc" aria-controls="pi-panel" />
        <Tab value="specs" label="Specifications" id="pi-tab-specs" aria-controls="pi-panel" />
      </Tabs>
      <Box id="pi-panel" role="tabpanel" aria-labelledby={`pi-tab-${tab}`} sx={{ pt: 3, maxWidth: 880 }}>
        {tab === 'desc' ? (
          <Box sx={{ color: colors.ink700, fontSize: 15.5, lineHeight: 1.75, '& p': { m: 0, mb: 1.5 } }} dangerouslySetInnerHTML={{ __html: html || `<p>${product.name}.</p>` }} />
        ) : (
          <Box component="dl" sx={{ m: 0, border: `1px solid ${colors.line}`, borderRadius: radius.lg, overflow: 'hidden' }}>
            {specs.map(([k, v], i) => (
              <Box key={k} sx={{ display: 'grid', gridTemplateColumns: { xs: '130px minmax(0,1fr)', sm: '200px minmax(0,1fr)' }, px: 2.5, py: 1.5, bgcolor: i % 2 ? '#fff' : colors.subtle }}>
                <Box component="dt" sx={{ fontSize: 14, color: colors.ink600 }}>{k}</Box>
                <Box component="dd" sx={{ m: 0, fontSize: 14, fontWeight: 500, overflowWrap: 'anywhere' }}>{v}</Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

