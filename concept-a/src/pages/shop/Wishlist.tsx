import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { tokens } from '../../theme'
import { productBySku, recommended, type Product } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { Container, EmptyState, Panel, SectionHeader } from '../../components/ui'
import { ProductCard, ProductCardSkeleton, ProductRail } from '../../components/Commerce'
import { PageTitle } from '../../components/Shared'

const c = tokens.color

export default function Wishlist() {
  const { wishlist, review, addToCart, toggleWishlist, priceFor } = useApp()
  const [adding, setAdding] = useState(false)
  const items = wishlist.map(productBySku).filter(Boolean) as Product[]
  const addable = items.filter((p) => p.type === 'simple' && p.stock !== 'OUT_OF_STOCK')
  const total = addable.reduce((a, p) => a + priceFor(p), 0)

  if (!review.signedIn) {
    return (
      <Container>
        <PageTitle title="Favorites" crumbs={[{ label: 'Favorites' }]} />
        <Panel sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, gap: 4, alignItems: 'center', p: { xs: 3, md: 5 } }}>
          <Box>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', mb: 2 }}><LockOutlined /></Box>
            <Typography variant="h2">Sign in to see your Favorites</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Save the products your kitchen orders every week and add them all to the cart in one tap — on the website, the app and with your rep.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" component={RouterLink} to="/account/signin">Sign in</Button>
              <Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/account/signin?mode=create">Open a business account</Button>
            </Stack>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 1, opacity: 0.5, filter: 'blur(1px)', pointerEvents: 'none' }} aria-hidden>
            {recommended.slice(0, 3).map((p) => <ProductCard key={p.sku} product={p} variant="carousel" />)}
          </Box>
        </Panel>
      </Container>
    )
  }

  return (
    <Container>
      <PageTitle
        title="Favorites"
        crumbs={[{ label: 'My account', to: '/account' }, { label: 'Favorites' }]}
        subtitle={items.length ? `${items.length} saved products · shared with everyone on the Spice Route Kitchen account` : undefined}
        action={
          items.length > 0 && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: 12, color: c.text3 }}>{addable.length} items ready to add</Typography>
                <Typography sx={{ fontWeight: 700 }}>≈ {total.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol' })}</Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartRounded />}
                disabled={adding || !addable.length}
                onClick={() => {
                  setAdding(true)
                  window.setTimeout(() => {
                    addable.forEach((p) => addToCart(p.sku, 1))
                    setAdding(false)
                  }, 700)
                }}
              >
                {adding ? 'Adding…' : `Add all to cart (${addable.length})`}
              </Button>
            </Stack>
          )
        }
      />
      {review.loading ? (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)', xl: 'repeat(5,1fr)' } }}>
          {Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </Box>
      ) : items.length === 0 ? (
        <>
          <Panel>
            <EmptyState
              icon={<FavoriteBorderRounded />}
              title="No favorites yet"
              body="Tap the heart on any product to save it here. Build a list of your weekly staples and reorder them all at once."
              action="Browse best sellers"
              href="/all-categories"
              secondary={<Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/account/orders">Reorder from past orders</Button>}
            />
          </Panel>
          <Box sx={{ mt: 6 }}>
            <SectionHeader eyebrow="Start your list" title="Popular with restaurants" />
            <ProductRail items={recommended} />
          </Box>
        </>
      ) : (
        <Box sx={{ display: 'grid', gap: { xs: 1.25, md: 2 }, gridTemplateColumns: { xs: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))', lg: 'repeat(4,minmax(0,1fr))', xl: 'repeat(5,minmax(0,1fr))' } }}>
          {items.map((p) => (
            <Box key={p.sku} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: 1 }}><ProductCard product={p} /></Box>
              <Button size="small" startIcon={<DeleteOutlineRounded />} onClick={() => toggleWishlist(p.sku)} sx={{ mt: 0.5, color: c.text2, alignSelf: 'center', minHeight: 44 }}>
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  )
}
