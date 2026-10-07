import Head from 'next/head'
import Link from 'next/link'
import { Box, Button } from '@mui/material'
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { useCart } from '../lib/cart'
import { money, finalPrice, productBySku, type Product } from '../lib/data'
import PageHeader from '../components/ui/PageHeader'
import { PageContainer } from '../components/ui/Section'
import EmptyState from '../components/ui/EmptyState'
import { ProductGridSkeleton } from '../components/ui/Feedback'
import ProductGrid from '../components/Product/ProductGrid'

/** Favorites — the buyer's saved products for quick reordering. Same card and controls as everywhere else. */
export default function WishlistPage() {
  const { wishlist, ready, addMany } = useCart()
  const items = wishlist.map((s) => productBySku(s)).filter(Boolean) as Product[]
  const total = items.reduce((a, p) => a + finalPrice(p), 0)
  return (
    <>
      <Head><title>Favorites | MySupreme</title></Head>
      <PageContainer sx={{ pb: { xs: 5, md: 8 } }}>
        {!ready ? (
          <Box sx={{ pt: 4 }}><ProductGridSkeleton count={5} /></Box>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<FavoriteBorderRoundedIcon />}
            tone="brand"
            title="No favorites yet"
            headingLevel="h1"
            actions={<><Button component={Link} href="/" variant="contained" size="large">Start shopping</Button><Button component={Link} href="/all-categories" variant="outlined" size="large">Browse categories</Button></>}
          >
            Tap the heart on any product to save it here. It’s the fastest way to reorder your regulars.
          </EmptyState>
        ) : (
          <>
            <PageHeader
              breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Favorites' }]}
              title="Favorites"
              meta={`${items.length} saved product${items.length === 1 ? '' : 's'}`}
              actions={
                <Button variant="contained" startIcon={<AddShoppingCartRoundedIcon />} onClick={() => addMany(items.map((p) => ({ sku: p.sku, qty: 1 })), `${items.length} favorites added to cart`)}>
                  Add all to cart · {money(total)}
                </Button>
              }
            />
            <ProductGrid products={items} label="Favorites" />
          </>
        )}
      </PageContainer>
    </>
  )
}
