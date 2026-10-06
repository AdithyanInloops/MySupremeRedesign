import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, IconButton, InputBase, Typography } from '@mui/material'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import { finalPrice, hasImage, money, packSize, percentOff, regularPrice, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'

/** "SUPREME" text placeholder used when Magento returns its /placeholder/ image. */
export function SupremePlaceholder({ size = 40 }: { size?: number }) {
  return (
    <Box role="img" aria-label="No product image" sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: '#fff', containerType: 'inline-size' }}>
      {/* Scales with the image box so the wordmark never clips in 2-up mobile grids. */}
      <Typography sx={{ fontWeight: 700, fontSize: `min(${size}px, 15cqw)`, color: '#2d297d', letterSpacing: '.02em', lineHeight: 1 }}>SUPREME</Typography>
    </Box>
  )
}

export function ProductImage({ product, size = 40 }: { product: Product; size?: number }) {
  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
      {hasImage(product) ? (
        <Box component="img" src={product.small_image!.url} alt={`${product.name} my supreme`} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <SupremePlaceholder size={size} />
      )}
    </Box>
  )
}

/** Quantity box joined to the red "Add to Cart" button (real AddToCartComponent). */
export function AddToCartRow({ sku }: { sku: string }) {
  const { add } = useCart()
  const [qty, setQty] = useState('1')
  return (
    <Box sx={{ display: 'flex', width: '100%', height: '40px' }}>
      <InputBase
        value={qty}
        onChange={(e) => setQty(e.target.value.replace(/\D/g, '').slice(0, 3))}
        inputProps={{ 'aria-label': 'Quantity', inputMode: 'numeric', style: { padding: '0 12px' } }}
        sx={{ width: { xs: '60px', sm: '70px', md: '80px' }, height: '40px', border: '1px solid #D1D5DB', borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: 14, bgcolor: '#fff' }}
      />
      <Button
        onClick={() => add(sku, Math.max(1, parseInt(qty || '1', 10)))}
        disableElevation
        variant="contained"
        sx={{
          flex: 1, minWidth: 0, bgcolor: '#FF413D', color: 'white', borderRadius: '0 4px 4px 0', height: '40px', textTransform: 'none',
          fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '11px', sm: '12px' }, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#e63939' },
        }}
      >
        Add to Cart
      </Button>
    </Box>
  )
}

export function WishlistStar({ sku }: { sku: string }) {
  const { wishlist, toggleWish } = useCart()
  const on = wishlist.includes(sku)
  return (
    <IconButton
      aria-label={on ? 'Remove from Favorites' : 'Add to Favorites'}
      aria-pressed={on}
      onClick={(e) => { e.preventDefault(); toggleWish(sku) }}
      size="small"
      sx={{ color: '#FF413D' }}
    >
      {on ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
    </IconButton>
  )
}

/** Product card — mirrors components/ProductListItems/productListRenderer.tsx. */
export default function ProductCard({ product }: { product: Product }) {
  const off = percentOff(product)
  const pack = packSize(product)
  const href = `/p/${product.url_key}`
  return (
    <Box
      component="article"
      aria-label={`${product.name}, ${pack}, ${money(finalPrice(product))}`}
      sx={{
        position: 'relative', bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,.08)',
        width: '100%', maxWidth: { xs: '100%', sm: 200, md: 220, lg: 250 }, mx: 'auto', display: 'flex', flexDirection: 'column', height: '100%',
      }}
    >
      <Box sx={{ position: 'relative', p: '12px', pb: 0 }}>
        <Box component={Link} href={href} sx={{ display: 'block' }} tabIndex={-1}>
          <ProductImage product={product} />
        </Box>
        {off > 0 && (
          <Box sx={{ position: 'absolute', top: 16, left: 16, bgcolor: '#FF0000', color: '#fff', fontSize: 12, fontWeight: 700, px: 1, py: 0.25, borderRadius: '4px' }}>-{off}%</Box>
        )}
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}><WishlistStar sku={product.sku} /></Box>
      </Box>
      <Box sx={{ p: '12px', pt: 1.5, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography sx={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.sku}</Typography>
        <Box component={Link} href={href} sx={{ textDecoration: 'none', color: '#0C0C0C' }} title={product.name}>
          <Typography component="h3" sx={{ fontSize: { xs: '13px', sm: '14px', md: '15px' }, fontWeight: 500, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7em' }}>
            {product.name}
          </Typography>
        </Box>
        <Box sx={{ minHeight: 24, mt: 0.5 }}>
          {pack && (
            <Box component="span" sx={{ display: 'inline-block', fontSize: '11px', fontWeight: 500, color: '#555555', lineHeight: 1.2, bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '2px 6px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {pack}
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75, mb: 1.25 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: off ? '#FF0000' : '#0C0C0C' }}>{money(finalPrice(product))}</Typography>
          {off > 0 && <Typography sx={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'line-through' }}>{money(regularPrice(product))}</Typography>}
        </Box>
        <Box sx={{ mt: 'auto' }}><AddToCartRow sku={product.sku} /></Box>
      </Box>
    </Box>
  )
}
