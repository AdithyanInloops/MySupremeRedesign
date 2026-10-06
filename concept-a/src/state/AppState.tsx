import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Alert, Snackbar, type AlertColor } from '@mui/material'
import { productBySku, type Product } from '../data/catalog'

/**
 * Prototype-only global state. In the rebuild every piece maps to an existing GraphCommerce hook:
 * cart → useCartQuery / addProductsToCart, wishlist → useWishlistItems, signedIn → useCustomerSession.
 */

export type CartLine = { sku: string; qty: number; error?: string }
type Toast = { id: number; msg: string; severity: AlertColor; action?: ReactNode }

type Review = {
  signedIn: boolean
  loading: boolean // forces skeletons for personalised blocks
  empty: boolean // forces empty states (cart, wishlist, orders, search)
}

type Ctx = {
  review: Review
  setReview: (r: Partial<Review>) => void
  cart: CartLine[]
  cartCount: number
  addToCart: (sku: string, qty?: number) => void
  setQty: (sku: string, qty: number) => void
  removeFromCart: (sku: string) => void
  clearCart: () => void
  wishlist: string[]
  toggleWishlist: (sku: string) => void
  recentlyViewed: string[]
  markViewed: (sku: string) => void
  toast: (msg: string, severity?: AlertColor) => void
  priceFor: (p: Product) => number
}

const AppCtx = createContext<Ctx | null>(null)

const initialCart: CartLine[] = [
  { sku: 'A905', qty: 4 },
  { sku: '59620000008252936', qty: 6 },
  { sku: 'GR1001', qty: 2 },
  { sku: 'BM0089', qty: 3 },
  { sku: 'FZ0101', qty: 2 },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [review, setReviewState] = useState<Review>({ signedIn: true, loading: false, empty: false })
  const [cart, setCart] = useState<CartLine[]>(initialCart)
  const [wishlist, setWishlist] = useState<string[]>(['59620000008478349', 'GR2210', 'PK0912', 'HD0031', 'MT0011'])
  const [recentlyViewed, setRecent] = useState<string[]>(['A905', 'GR1001', 'DA0044', 'PK1120', 'BW0028', 'MT0045'])
  const [toasts, setToasts] = useState<Toast[]>([])
  const batch = useRef<{ items: string[]; timer?: number }>({ items: [] })

  const toast = useCallback((msg: string, severity: AlertColor = 'success') => {
    setToasts((t) => [...t, { id: Date.now() + Math.random(), msg, severity }])
  }, [])

  const setReview = useCallback((r: Partial<Review>) => setReviewState((s) => ({ ...s, ...r })), [])

  const addToCart = useCallback(
    (sku: string, qty = 1) => {
      const pr = productBySku(sku)
      if (pr?.stock === 'OUT_OF_STOCK') {
        toast(`${pr.name} is out of stock`, 'error')
        return
      }
      setCart((c) => {
        const ex = c.find((l) => l.sku === sku)
        return ex ? c.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...c, { sku, qty }]
      })
      // Several adds in the same tick (reorder all, add all favorites) collapse into one toast.
      const b = batch.current
      b.items.push(`${qty} × ${pr?.name ?? sku}`)
      window.clearTimeout(b.timer)
      b.timer = window.setTimeout(() => {
        toast(b.items.length === 1 ? `Added ${b.items[0]} to cart` : `Added ${b.items.length} products to cart`)
        b.items = []
      }, 0)
    },
    [toast],
  )

  const setQty = useCallback((sku: string, qty: number) => {
    setCart((c) => c.map((l) => (l.sku === sku ? { ...l, qty: Math.max(1, Math.min(qty, 99)), error: qty > 99 ? 'Max 99 per order — call us for larger volumes' : undefined } : l)))
  }, [])

  const removeFromCart = useCallback((sku: string) => setCart((c) => c.filter((l) => l.sku !== sku)), [])
  const clearCart = useCallback(() => setCart([]), [])

  const toggleWishlist = useCallback(
    (sku: string) => {
      setWishlist((w) => {
        const has = w.includes(sku)
        toast(has ? 'Removed from Favorites' : 'Saved to Favorites', has ? 'info' : 'success')
        return has ? w.filter((x) => x !== sku) : [...w, sku]
      })
    },
    [toast],
  )

  const markViewed = useCallback((sku: string) => setRecent((r) => [sku, ...r.filter((x) => x !== sku)].slice(0, 12)), [])

  const priceFor = useCallback((p: Product) => (review.signedIn && p.groupPrice ? p.groupPrice : p.price), [review.signedIn])

  const effectiveCart = review.empty ? [] : cart
  const value = useMemo<Ctx>(
    () => ({
      review, setReview,
      cart: effectiveCart,
      cartCount: effectiveCart.reduce((a, l) => a + l.qty, 0),
      addToCart, setQty, removeFromCart, clearCart,
      wishlist: review.empty || !review.signedIn ? [] : wishlist,
      toggleWishlist, recentlyViewed, markViewed, toast, priceFor,
    }),
    [review, setReview, effectiveCart, addToCart, setQty, removeFromCart, clearCart, wishlist, toggleWishlist, recentlyViewed, markViewed, toast, priceFor],
  )

  const current = toasts[0]
  return (
    <AppCtx.Provider value={value}>
      {children}
      <Snackbar
        key={current?.id}
        open={!!current}
        autoHideDuration={3200}
        onClose={(_, reason) => reason !== 'clickaway' && setToasts((t) => t.slice(1))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Sits above the mobile sticky bars and between the two floating support buttons.
        sx={{ bottom: { xs: 96, md: 32 }, maxWidth: { xs: 'calc(100% - 160px)', sm: 520 }, mx: 'auto' }}
      >
        {current ? (
          <Alert severity={current.severity} variant="filled" onClose={() => setToasts((t) => t.slice(1))} sx={{ width: '100%', alignItems: 'center', fontWeight: 500 }}>
            {current.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AppCtx.Provider>
  )
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
