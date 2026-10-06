import Head from 'next/head'
import Link from 'next/link'
import { Alert, Box, Button, Container, Divider, Typography } from '@mui/material'
import FullPageMessage, { BagIcon } from '../components/Pages/FullPageMessage'
import { ProductImage } from '../components/Product/ProductCard'
import { useCart } from '../lib/cart'
import { finalPrice, money, packSize, productBySku } from '../lib/data'

export default function CartPage() {
  const { lines } = useCart()
  const items = lines.map((l) => ({ ...l, product: productBySku(l.sku) })).filter((l) => l.product)

  if (!items.length) {
    return (
      <>
        <Head><title>Cart | MySupreme</title></Head>
        <FullPageMessage icon={<BagIcon />} title="Your cart is empty">
          Discover our collection and add items to your cart!
        </FullPageMessage>
      </>
    )
  }

  const subtotal = items.reduce((a, l) => a + finalPrice(l.product!) * l.qty, 0)
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Head><title>Cart | MySupreme</title></Head>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>Cart ({items.length} products)</Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, alignItems: 'start' }}>
        <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', bgcolor: '#fff' }}>
          {items.map(({ sku, qty, product }, i) => (
            <Box key={sku}>
              {i > 0 && <Divider />}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '72px 1fr', sm: '88px 1fr auto' }, gap: 2, p: 2, alignItems: 'center' }}>
                <Box sx={{ border: '1px solid #EAEAEA', borderRadius: '4px', overflow: 'hidden' }}>
                  <ProductImage product={product!} size={14} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{sku}</Typography>
                  <Box component={Link} href={`/p/${product!.url_key}`} sx={{ color: '#0C0C0C', textDecoration: 'none', fontWeight: 500, fontSize: 15, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product!.name}
                  </Box>
                  {packSize(product!) && (
                    <Box component="span" sx={{ display: 'inline-block', mt: 0.5, fontSize: 11, fontWeight: 500, color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '2px 6px' }}>{packSize(product!)}</Box>
                  )}
                  <Typography sx={{ fontSize: 13, color: '#4B5563', mt: 0.5 }}>{qty} × {money(finalPrice(product!))}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: 16, gridColumn: { xs: '2', sm: 'auto' } }}>{money(finalPrice(product!) * qty)}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ border: '1px solid #E5E7EB', borderRadius: '8px', p: 2.5, bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography sx={{ fontWeight: 500 }}>Subtotal</Typography>
            <Typography sx={{ fontWeight: 700 }}>{money(subtotal)}</Typography>
          </Box>
          <Button fullWidth disabled variant="contained" sx={{ borderRadius: '50px', height: 48, textTransform: 'none', fontWeight: 600 }}>Proceed to checkout</Button>
          <Alert severity="info" sx={{ mt: 2, fontSize: 13 }}>Checkout is not part of this prototype.</Alert>
        </Box>
      </Box>
    </Container>
  )
}
