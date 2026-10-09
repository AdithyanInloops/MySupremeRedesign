import { Box, Button, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { money, productBySku, type Product } from '../data/catalog'
import { ProductRow } from '../components/ProductCard'
import { EmptyState } from '../components/ui'
import AppHeader from '../components/AppHeader'
import { CartPlusIcon, StarIcon } from '../components/icons'

const c = tokens.color

export default function Favorites() {
  const { wishlist, addMany, priceFor } = useApp()
  const items = wishlist.map(productBySku).filter((p): p is Product => !!p)
  const addable = items.filter((p) => p.stock !== 'OUT_OF_STOCK' && p.type === 'simple')
  return (
    <Box>
      <AppHeader />
      <Box sx={{ px: 2, pt: 2, display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography component="h1" sx={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>Favourites</Typography>
        {items.length > 0 && <Typography sx={{ fontSize: 13.5, color: c.text3 }}>{items.length} saved</Typography>}
      </Box>
      {!items.length ? (
        <EmptyState icon={StarIcon} title="No favourites yet" body="Tap the star on any product to save it here — the fastest way to reorder your regulars." action="Browse products" to="/shop" />
      ) : (
        <Box sx={{ px: 2, pt: 1.5 }}>
          <Button fullWidth variant="contained" size="large" startIcon={<CartPlusIcon />} disabled={!addable.length}
            onClick={() => addMany(addable.map((p) => ({ sku: p.sku, qty: 1 })), `${addable.length} favourites added`)}>
            Add all to cart · {money(addable.reduce((a, p) => a + priceFor(p), 0))}
          </Button>
          {addable.length < items.length && <Typography sx={{ fontSize: 12.5, color: c.text3, mt: 0.75, textAlign: 'center' }}>Items that are out of stock or need an option are skipped.</Typography>}
          <Box sx={{ mt: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, px: 1.5, '& > * + *': { borderTop: `1px solid ${c.line}` } }}>
            {items.map((p) => <ProductRow key={p.sku} product={p} />)}
          </Box>
        </Box>
      )}
    </Box>
  )
}
