import Head from 'next/head'
import { Box, Container, Typography } from '@mui/material'
import FullPageMessage, { HeartIcon } from '../components/Pages/FullPageMessage'
import ProductGrid from '../components/Product/ProductGrid'
import { useCart } from '../lib/cart'
import { productBySku, type Product } from '../lib/data'

export default function WishlistPage() {
  const { wishlist } = useCart()
  const items = wishlist.map((s) => productBySku(s)).filter(Boolean) as Product[]
  return (
    <>
      <Head><title>Wishlist | MySupreme</title></Head>
      {items.length === 0 ? (
        <Container disableGutters fixed maxWidth="xl">
          <FullPageMessage icon={<HeartIcon />} title="Your wishlist is empty" color="primary">
            Discover our collection and add items to your wishlist!
          </FullPageMessage>
        </Container>
      ) : (
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" mb={2} mt={2} ml={2}>
            <Typography variant="h5" fontWeight="bold">Favorites ({items.length} products)</Typography>
          </Box>
          <ProductGrid products={items} />
        </Container>
      )}
    </>
  )
}
