import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { inStock, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { colors, motion } from '../../lib/theme'
import QuantityStepper from '../ui/QuantityStepper'
import { CartPlusIcon, HeartFilledIcon, HeartIcon } from '../ui/icons'

/**
 * Add to cart ↔ in-cart quantity. Not in the cart: one "Add to cart" button. In the cart: the same space becomes a
 * stepper bound to the cart line (typeable, − at 1 removes with Undo), so the card always shows what's in the cart
 * and buyers adjust quantities without leaving the page.
 */
export default function CartControl({ product, size = 'md', label = 'Add to cart', fullWidth = true }: { product: Product; size?: 'sm' | 'md'; label?: string; fullWidth?: boolean }) {
  const { qtyOf, add, setQty, ready } = useCart()
  const inCart = ready ? qtyOf(product.sku) : 0
  if (!inStock(product)) {
    return (
      <Button variant="outlined" size={size === 'sm' ? 'small' : 'medium'} fullWidth={fullWidth} disabled aria-label={`${product.name} is out of stock`} sx={{ '&.Mui-disabled': { color: colors.ink500, borderColor: colors.line2, bgcolor: colors.subtle } }}>
        Out of stock
      </Button>
    )
  }
  if (inCart > 0) {
    return (
      <Box sx={{ animation: 'cartPop .18s ease-out', '@keyframes cartPop': { from: { transform: 'scale(.96)', opacity: 0.6 }, to: { transform: 'none', opacity: 1 } } }}>
        <QuantityStepper value={inCart} onChange={(n) => setQty(product.sku, n)} min={1} removeAtMin size={size} fullWidth={fullWidth} label={`Quantity of ${product.name} in cart`} />
      </Box>
    )
  }
  return (
    <Button
      variant="contained"
      color="primary"
      size={size === 'sm' ? 'small' : 'medium'}
      fullWidth={fullWidth}
      startIcon={<CartPlusIcon />}
      onClick={() => add(product.sku, 1)}
      aria-label={`Add ${product.name} to cart`}
    >
      {label}
    </Button>
  )
}

/** Heart toggle. Same icon, colour and wording everywhere ("Favorites"). */
export function FavoriteButton({ product, variant = 'overlay' }: { product: Product; variant?: 'overlay' | 'plain' | 'labelled' }) {
  const { wishlist, toggleWish, ready } = useCart()
  const on = ready && wishlist.includes(product.sku)
  const label = on ? `Remove ${product.name} from Favorites` : `Save ${product.name} to Favorites`
  const icon = on ? <HeartFilledIcon sx={{ fontSize: 20, color: colors.red }} /> : <HeartIcon sx={{ fontSize: 20 }} />
  if (variant === 'labelled') {
    return (
      <Button variant="outlined" onClick={() => toggleWish(product.sku)} aria-pressed={on} aria-label={label} startIcon={icon}>
        {on ? 'Saved' : 'Save'}
      </Button>
    )
  }
  return (
    <Tooltip title={on ? 'Remove from Favorites' : 'Save to Favorites'}>
      <IconButton
        onClick={() => toggleWish(product.sku)}
        aria-pressed={on}
        aria-label={label}
        sx={{
          width: 36, height: 36, color: colors.ink600, transition: `transform ${motion.fast}, background-color ${motion.fast}`,
          ...(variant === 'overlay' ? { bgcolor: 'rgba(255,255,255,.92)', boxShadow: '0 1px 3px rgba(16,24,40,.12)', '&:hover': { bgcolor: '#fff', color: colors.red } } : { '&:hover': { color: colors.red } }),
          '&:active': { transform: 'scale(.9)' },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}
