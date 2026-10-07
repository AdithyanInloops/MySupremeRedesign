import Head from 'next/head'
import Link from 'next/link'
import { Box, Button, IconButton, Skeleton, Tooltip, Typography } from '@mui/material'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import BoltRoundedIcon from '@mui/icons-material/BoltRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import EastRoundedIcon from '@mui/icons-material/EastRounded'
import { departments, finalPrice, money, productBySku, products, type Product } from '../lib/data'
import { useCart } from '../lib/cart'
import { useSession } from '../lib/session'
import { totals } from '../lib/pricing'
import { colors, focusRing, radius } from '../lib/theme'
import PageHeader from '../components/ui/PageHeader'
import { PageContainer, SectionHeading } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import ProductImage from '../components/ui/ProductImage'
import { PackChip, Sku } from '../components/ui/ProductMeta'
import QuantityStepper from '../components/ui/QuantityStepper'
import { LineItemSkeleton, StickyBottomBar } from '../components/ui/Feedback'
import ProductRail from '../components/Product/ProductRail'
import OrderSummary from '../components/Cart/OrderSummary'
import { DeliveryProgress } from '../components/Layout/DeliveryMinimumBar'
import { useQuickOrder } from '../components/QuickOrder/QuickOrder'

function CartLine({ product, qty }: { product: Product; qty: number }) {
  const { setQty, remove, wishlist, toggleWish } = useCart()
  const href = `/p/${product.url_key}`
  const saved = wishlist.includes(product.sku)
  return (
    <Box component="li" sx={{ display: 'grid', gridTemplateColumns: { xs: '76px minmax(0,1fr)', md: '96px minmax(0,1fr) auto auto' }, gap: { xs: 1.5, md: 2.5 }, alignItems: 'center', py: 2.25, borderBottom: `1px solid ${colors.line}`, '&:last-of-type': { borderBottom: 0 } }}>
      <Box component={Link} href={href} tabIndex={-1} aria-hidden sx={{ display: 'block', borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${colors.line}`, alignSelf: 'start' }}>
        <ProductImage product={product} caption={false} alt="" />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box component={Link} href={href} sx={{ color: colors.ink, textDecoration: 'none', fontWeight: 500, fontSize: 15, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
          {product.name}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
          <Sku sku={product.sku} />
          <PackChip product={product} />
        </Box>
        <Typography sx={{ fontSize: 13.5, color: colors.ink600, mt: 0.5 }}>{money(finalPrice(product))} each</Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, ml: -1 }}>
          <Button size="small" onClick={() => toggleWish(product.sku)} startIcon={saved ? <FavoriteRoundedIcon sx={{ color: colors.red }} /> : <FavoriteBorderRoundedIcon />} sx={{ color: colors.ink600, fontWeight: 500 }} aria-pressed={saved} aria-label={`${saved ? 'Saved' : 'Save for later'}: ${product.name}`}>
            {saved ? 'Saved' : 'Save for later'}
          </Button>
          <Button size="small" onClick={() => remove(product.sku)} startIcon={<DeleteOutlineRoundedIcon />} aria-label={`Remove ${product.name}`} sx={{ color: colors.ink600, fontWeight: 500, display: { md: 'none' } }}>Remove</Button>
        </Box>
      </Box>
      {/* Quantity + line total: under the details on phones, own columns on desktop */}
      <Box sx={{ gridColumn: { xs: '2', md: 'auto' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <QuantityStepper value={qty} onChange={(n) => setQty(product.sku, n)} removeAtMin size="md" label={`Quantity of ${product.name}`} />
        <Typography sx={{ display: { md: 'none' }, fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>{money(finalPrice(product) * qty)}</Typography>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, justifyContent: 'flex-end', minWidth: 140 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums' }} aria-label={`Line total ${money(finalPrice(product) * qty)}`}>{money(finalPrice(product) * qty)}</Typography>
        <Tooltip title="Remove">
          <IconButton aria-label={`Remove ${product.name}`} onClick={() => remove(product.sku)} sx={{ color: colors.ink500, '&:hover': { color: colors.redText, bgcolor: colors.redTint } }}><DeleteOutlineRoundedIcon /></IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

function EmptyCart() {
  const quick = useQuickOrder()
  const { recentlyViewed } = useCart()
  const viewed = recentlyViewed.map(productBySku).filter(Boolean) as Product[]
  return (
    <>
      <EmptyState
        icon={<ShoppingCartOutlinedIcon />}
        title="Your cart is empty"
        headingLevel="h1"
        actions={
          <>
            <Button component={Link} href="/" variant="contained" size="large">Start shopping</Button>
            <Button variant="outlined" size="large" startIcon={<BoltRoundedIcon />} onClick={() => quick.open()}>Order by SKU</Button>
          </>
        }
      >
        Add products as you browse, search by name or SKU, or paste a list from your order sheet.
      </EmptyState>
      {viewed.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <SectionHeading title="Recently viewed" as="h2" />
          <ProductRail products={viewed} label="Recently viewed" />
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <SectionHeading title="Popular departments" as="h2" action={{ label: 'All categories', href: '/all-categories' }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {departments.map((d) => <Button key={d.uid} component={Link} href={`/${d.url_key}`} variant="outlined">{d.name}</Button>)}
          </Box>
        </Box>
      )}
    </>
  )
}

export default function CartPage() {
  const { lines, ready, clear, coupon } = useCart()
  const { user } = useSession()
  const quick = useQuickOrder()
  const items = lines.map((l) => ({ ...l, product: productBySku(l.sku) })).filter((l): l is typeof l & { product: Product } => !!l.product)
  const t = totals(lines, { coupon })
  const units = items.reduce((a, l) => a + l.qty, 0)
  const inCart = new Set(items.map((l) => l.sku))
  const depts = new Set(items.map((l) => l.product.department))
  const suggestions = products.filter((p) => depts.has(p.department) && !inCart.has(p.sku)).slice(0, 12)

  return (
    <>
      <Head><title>{ready && items.length ? `Cart (${units}) | MySupreme` : 'Cart | MySupreme'}</title></Head>
      <PageContainer sx={{ pb: { xs: 4, md: 8 } }}>
        {!ready ? (
          <Box sx={{ pt: 3 }} aria-busy="true">
            <Skeleton width={200} height={44} />
            <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 360px' }, mt: 3 }}>
              <LineItemSkeleton rows={3} />
              <Skeleton variant="rounded" height={320} />
            </Box>
          </Box>
        ) : !items.length ? (
          <EmptyCart />
        ) : (
          <>
            <PageHeader
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cart' }]}
              title="Your cart"
              meta={`${items.length} product${items.length === 1 ? '' : 's'} · ${units} item${units === 1 ? '' : 's'}`}
              actions={
                <>
                  <Button variant="outlined" startIcon={<BoltRoundedIcon />} onClick={() => quick.open()}>Add by SKU</Button>
                  <Button onClick={() => clear()} startIcon={<DeleteOutlineRoundedIcon />} sx={{ color: colors.ink600 }}>Clear cart</Button>
                </>
              }
            />
            <Box sx={{ display: 'grid', gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 340px', lg: 'minmax(0,1fr) 380px' }, alignItems: 'start' }}>
              <Box>
                <Box sx={{ p: 2, mb: 2, borderRadius: radius.lg, bgcolor: t.deliveryEligible ? colors.successTint : colors.subtle, border: `1px solid ${t.deliveryEligible ? colors.successLine : colors.line}` }}>
                  <DeliveryProgress subtotal={t.subtotal} />
                </Box>
                <Box component="ul" aria-label="Cart items" sx={{ listStyle: 'none', m: 0, p: 0, borderTop: `1px solid ${colors.line}` }}>
                  {items.map((l) => <CartLine key={l.sku} product={l.product} qty={l.qty} />)}
                </Box>
                <Button component={Link} href="/" startIcon={<EastRoundedIcon sx={{ transform: 'rotate(180deg)' }} />} sx={{ mt: 2, ml: -1.5 }}>Continue shopping</Button>
              </Box>

              <Box sx={{ position: { md: 'sticky' }, top: { md: 180 } }}>
                <OrderSummary>
                  <Button component={Link} href="/checkout" variant="contained" size="large" fullWidth startIcon={<LockOutlinedIcon />} sx={{ mt: 0.5 }}>
                    Check out · {money(t.total)}
                  </Button>
                  {!user && (
                    <Typography sx={{ fontSize: 13.5, color: colors.ink600, textAlign: 'center' }}>
                      Business customer? <Box component={Link} href="/account/signin?next=/checkout" sx={{ color: colors.redText, fontWeight: 600, borderRadius: '4px', ...focusRing }}>Sign in</Box> for your prices and saved address.
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', opacity: 0.85 }}>
                    {['mastercard', 'visa', 'paypal', 'shoppay'].map((b) => (
                      <Box key={b} sx={{ width: 44, height: 28, border: `1px solid ${colors.line}`, borderRadius: radius.xs, display: 'grid', placeItems: 'center' }}>
                        <img src={`/assets/${b}.png`} alt={b} style={{ maxWidth: 30, maxHeight: 16 }} />
                      </Box>
                    ))}
                  </Box>
                </OrderSummary>
              </Box>
            </Box>

            {suggestions.length > 0 && (
              <Box component="section" aria-labelledby="suggest-title" sx={{ mt: { xs: 5, md: 7 } }}>
                <SectionHeading id="suggest-title" title="Kitchens also add" subtitle="From the departments you’re ordering from" />
                <ProductRail products={suggestions} label="Kitchens also add" />
              </Box>
            )}

            <StickyBottomBar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ mr: 'auto' }}>
                  <Typography sx={{ fontSize: 12.5, color: colors.ink500 }}>Total ({units} items)</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(t.total)}</Typography>
                </Box>
                <Button component={Link} href="/checkout" variant="contained" size="large" startIcon={<LockOutlinedIcon />}>Check out</Button>
              </Box>
            </StickyBottomBar>
          </>
        )}
      </PageContainer>
    </>
  )
}
