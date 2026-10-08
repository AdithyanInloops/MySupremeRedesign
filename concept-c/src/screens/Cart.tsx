import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp, offerById } from '../state/app'
import { money, productBySku, recommended } from '../data/catalog'
import { usualSkus } from '../data/app'
import ProductCard, { ProductTile, productPath } from '../components/ProductCard'
import { BottomBar, EmptyState, HScroll, PackChip, ProductImage, QtyStepper, SectionHeader, TopBar } from '../components/ui'
import { DeliveryMeter, PromoRow, Totals } from '../components/Summary'
import { BarcodeIcon, BoltIcon, CartIcon, LockIcon, TagIcon } from '../components/icons'

const c = tokens.color

/** Products to suggest: the buyer's usuals (signed in) or best sellers, minus what's already in the cart. */
const useSuggestions = () => {
  const { signedIn, qtyOf } = useApp()
  const pool = signedIn ? [...usualSkus.map(productBySku), ...recommended] : recommended
  return pool.filter((p, i, a): p is NonNullable<typeof p> => !!p && p.stock !== 'OUT_OF_STOCK' && p.type === 'simple' && a.findIndex((x) => x?.sku === p.sku) === i && !qtyOf(p.sku)).slice(0, 8)
}

/** Cart tab: lines with steppers, delivery-minimum meter with top-up suggestions, promo, totals, checkout. */
export default function Cart() {
  const { lines, count, total, remaining, linePrice, setQty, clearCart, addMany, notify, signedIn } = useApp()
  const navigate = useNavigate()
  const suggestions = useSuggestions()
  const items = lines.map((l) => ({ ...l, product: productBySku(l.sku), offer: offerById(l.offerId) })).filter((l) => l.product)

  if (!items.length) {
    return (
      <Box sx={{ pb: 2 }}>
        <TopBar title="Cart" back={false} />
        <Box sx={{ '& > div': { py: 4 } }}>
          <EmptyState icon={CartIcon} title="Your cart is empty" body="Add products as you browse, scan a barcode, or order by SKU from your order sheet." action="Start shopping" to="/shop" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, px: 3, justifyContent: 'center', mt: -1.5, mb: 3 }}>
          <Button component={RouterLink} to="/quick-order" variant="outlined" color="secondary" startIcon={<BoltIcon />}>Quick order</Button>
          <Button component={RouterLink} to="/scan" variant="outlined" color="secondary" startIcon={<BarcodeIcon />}>Scan</Button>
        </Box>
        {suggestions.length > 0 && (
          <>
            <SectionHeader eyebrow={signedIn ? 'Your usuals' : 'Popular with kitchens'} title={signedIn ? 'Buy it again' : 'Best sellers'} />
            <HScroll gap={1}>{suggestions.map((p) => <ProductCard key={p.sku} product={p} width={150} />)}</HScroll>
          </>
        )}
      </Box>
    )
  }

  const clear = () => { const snap = lines; clearCart(); notify({ message: 'Cart cleared', detail: `${snap.length} products removed`, tone: 'info', action: { label: 'Undo', onClick: () => addMany(snap, 'Cart restored') } }) }

  return (
    <Box>
      <TopBar title="Cart" back={false} subtitle={`${count} items · ${items.length} products`} actions={<Button onClick={clear} sx={{ color: c.text2, minWidth: 0 }}>Clear</Button>} />
      <Box sx={{ px: 2, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <DeliveryMeter />
        <Box component="ul" aria-label="Cart items" sx={{ listStyle: 'none', m: 0, p: 0, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, '& > li + li': { borderTop: `1px solid ${c.line}` } }}>
          {items.map(({ sku, qty, product, offer, offerId }) => (
            <Box component="li" key={sku} sx={{ display: 'grid', gridTemplateColumns: '68px minmax(0,1fr)', gap: 1.5, p: 1.5 }}>
              <Box component={RouterLink} to={productPath(product!)} tabIndex={-1} aria-hidden><ProductImage product={product!} /></Box>
              <Box sx={{ minWidth: 0 }}>
                <Box component={RouterLink} to={productPath(product!)} sx={{ color: c.ink, textDecoration: 'none', fontSize: 14, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', ...focusRing }}>{product!.name}</Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                  <PackChip pack={product!.pack} />
                  {offer && <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontSize: 11, fontWeight: 700, color: '#8A5A00', bgcolor: c.saffronTint, px: 0.75, borderRadius: 1, lineHeight: 1.7 }}><TagIcon sx={{ fontSize: 12 }} /> {offer.deal}</Box>}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1 }}>
                  <QtyStepper size="sm" value={qty} onChange={(n) => setQty(sku, n)} removeAtMin label={`Quantity of ${product!.name}`} />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{money(linePrice({ sku, qty, offerId }) * qty)}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: c.text3 }}>{money(linePrice({ sku, qty, offerId }))} each</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        {remaining > 0 && suggestions.length > 0 && (
          <Box component="section" aria-label="Top up for free delivery" sx={{ mx: -2 }}>
            <Typography component="h2" sx={{ px: 2, mb: 0.75, fontSize: 14.5, fontWeight: 700 }}>Add {money(remaining)} more for free delivery</Typography>
            <HScroll gap={1}>{suggestions.map((p) => <ProductTile key={p.sku} product={p} width={232} />)}</HScroll>
          </Box>
        )}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={RouterLink} to="/quick-order" variant="outlined" color="secondary" startIcon={<BoltIcon />} sx={{ flex: 1, bgcolor: '#fff' }}>Add by SKU</Button>
          <Button component={RouterLink} to="/scan" variant="outlined" color="secondary" startIcon={<BarcodeIcon />} sx={{ flex: 1, bgcolor: '#fff' }}>Scan to add</Button>
        </Box>
        <PromoRow />
        <Totals />
        <Typography sx={{ fontSize: 12, color: c.text3, textAlign: 'center', px: 2 }}>Prices in CAD. Final tax is confirmed on your invoice.</Typography>
      </Box>
      <BottomBar aboveTabs>
        <Button fullWidth variant="contained" size="large" startIcon={<LockIcon />} onClick={() => navigate('/checkout')}>Checkout · {money(total)}</Button>
      </BottomBar>
    </Box>
  )
}
