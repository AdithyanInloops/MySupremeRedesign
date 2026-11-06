import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Snackbar, type AlertColor } from '@mui/material'
import { productBySku, type Product } from '../data/catalog'
import { ToastCard } from '../components/ui'

/**
 * Prototype-only global state. In the rebuild every piece maps to an existing GraphCommerce hook:
 * cart → useCartQuery / addProductsToCart, lists → useWishlistItems (one wishlist per list), signedIn → useCustomerSession.
 */

export type CartLine = { sku: string; qty: number; error?: string }
/** A saved list. `qty` is the usual order quantity that "Add all to cart" uses. lists[0] is always Favourites. */
export type ListItem = { sku: string; qty: number }
export type SavedList = { id: string; name: string; items: ListItem[] }
export type ToastAction = { label: string; href?: string; onClick?: () => void }
/** `sku` shows the product's photo and name under the message; `detail` is a second line without a product. */
export type ToastExtra = { sku?: string; detail?: string }
type Toast = { id: number; msg: string; severity: AlertColor; action?: ToastAction } & ToastExtra

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
  /** `quiet` skips the "Added …" toast so a bulk add can show its own summary. */
  addToCart: (sku: string, qty?: number, quiet?: boolean) => void
  setQty: (sku: string, qty: number) => void
  removeFromCart: (sku: string) => void
  clearCart: () => void
  lists: SavedList[]
  createList: (name: string, items?: ListItem[]) => string
  updateList: (id: string, fn: (items: ListItem[]) => ListItem[]) => void
  deleteList: (id: string) => void
  /** The list the cart was last filled from, so the cart can offer "Update <list>". */
  cartFromList: string | null
  setCartFromList: (id: string | null) => void
  recentlyViewed: string[]
  markViewed: (sku: string) => void
  toast: (msg: string, severity?: AlertColor, action?: ToastAction, extra?: ToastExtra) => void
  priceFor: (p: Product) => number
}

const AppCtx = createContext<Ctx | null>(null)

const initialCart: CartLine[] = [
  { sku: 'A905', qty: 4 },
  { sku: '59620000008252936', qty: 6 },
  { sku: 'GR1001', qty: 2 },
  { sku: 'BM0089', qty: 3 },
  { sku: 'FZ0101', qty: 2 },
  { sku: '200118', qty: 3 },
]

const sampleLists: SavedList[] = [
  { id: 'fav', name: 'Favourites', items: [{ sku: '100231', qty: 4 }, { sku: '200118', qty: 3 }, { sku: '300542', qty: 2 }, { sku: '400077', qty: 3 }, { sku: '500610', qty: 2 }] },
  {
    id: 'weekly', name: 'Weekly Order',
    items: [{ sku: 'A905', qty: 4 }, { sku: '59620000008252936', qty: 6 }, { sku: 'GR1001', qty: 2 }, { sku: 'BM0089', qty: 3 }, { sku: 'FZ0101', qty: 2 }, { sku: '200118', qty: 3 }, { sku: 'GR2210', qty: 1 }, { sku: 'DA0010', qty: 2 }],
  },
  { id: 'packaging', name: 'Packaging', items: [{ sku: 'A905', qty: 2 }, { sku: 'PK1120', qty: 1 }, { sku: 'PK4402', qty: 2 }] },
]

export function AppStateProvider({ children, initialLists = sampleLists }: { children: ReactNode; initialLists?: SavedList[] }) {
  const [review, setReviewState] = useState<Review>({ signedIn: true, loading: false, empty: false })
  const [cart, setCart] = useState<CartLine[]>(initialCart)
  const [lists, setLists] = useState<SavedList[]>(initialLists)
  const [cartFromList, setCartFromList] = useState<string | null>('weekly')
  const [recentlyViewed, setRecent] = useState<string[]>(['A905', 'GR1001', 'DA0044', 'PK1120', 'BW0028', 'MT0045'])
  const [toasts, setToasts] = useState<Toast[]>([])
  const batch = useRef<{ items: { sku: string; qty: number }[]; timer?: number }>({ items: [] })

  const toast = useCallback((msg: string, severity: AlertColor = 'success', action?: ToastAction, extra?: ToastExtra) => {
    setToasts((t) => [...t, { id: Date.now() + Math.random(), msg, severity, action, ...extra }])
  }, [])

  const setReview = useCallback((r: Partial<Review>) => setReviewState((s) => ({ ...s, ...r })), [])

  const addToCart = useCallback(
    (sku: string, qty = 1, quiet = false) => {
      const pr = productBySku(sku)
      if (pr?.stock === 'OUT_OF_STOCK') {
        toast('Out of stock', 'error', undefined, { sku })
        return
      }
      setCart((c) => {
        const ex = c.find((l) => l.sku === sku)
        return ex ? c.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...c, { sku, qty }]
      })
      if (quiet) return
      // Several adds in the same tick (reorder all) collapse into one toast. "Add all" from a list passes quiet and toasts its own summary.
      const b = batch.current
      b.items.push({ sku, qty })
      window.clearTimeout(b.timer)
      b.timer = window.setTimeout(() => {
        const [one, ...more] = b.items
        const viewCart = { label: 'View cart', href: '/cart' }
        if (more.length) toast(`${b.items.length} products added to cart`, 'success', viewCart)
        else toast(one.qty === 1 ? 'Added to cart' : `${one.qty} added to cart`, 'success', viewCart, { sku: one.sku })
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

  const createList = useCallback((name: string, items: ListItem[] = []) => {
    const id = `list-${Date.now()}`
    setLists((ls) => [...ls, { id, name, items }])
    return id
  }, [])
  const updateList = useCallback((id: string, fn: (items: ListItem[]) => ListItem[]) => {
    setLists((ls) => ls.map((l) => (l.id === id ? { ...l, items: fn(l.items) } : l)))
  }, [])
  const deleteList = useCallback((id: string) => setLists((ls) => ls.filter((l) => l.id !== id)), [])

  const markViewed = useCallback((sku: string) => setRecent((r) => [sku, ...r.filter((x) => x !== sku)].slice(0, 12)), [])

  const priceFor = useCallback((p: Product) => (review.signedIn && p.groupPrice ? p.groupPrice : p.price), [review.signedIn])

  const effectiveCart = review.empty ? [] : cart
  const value = useMemo<Ctx>(
    () => ({
      review, setReview,
      cart: effectiveCart,
      cartCount: effectiveCart.reduce((a, l) => a + l.qty, 0),
      addToCart, setQty, removeFromCart, clearCart,
      // Guests have no lists; the "Empty" review switch empties every list but keeps their names.
      lists: !review.signedIn ? [] : review.empty ? lists.map((l) => ({ ...l, items: [] })) : lists,
      createList, updateList, deleteList, cartFromList, setCartFromList,
      recentlyViewed, markViewed, toast, priceFor,
    }),
    [review, setReview, effectiveCart, addToCart, setQty, removeFromCart, clearCart, lists, createList, updateList, deleteList, cartFromList, recentlyViewed, markViewed, toast, priceFor],
  )

  const current = toasts[0]
  const dismiss = () => setToasts((t) => t.slice(1))
  const act = current?.action
  return (
    <AppCtx.Provider value={value}>
      {children}
      <Snackbar
        key={current?.id}
        open={!!current}
        // 4s to read a plain message; 6s when there is a button to reach (and MUI pauses the timer on hover).
        autoHideDuration={act ? 6000 : 4000}
        onClose={(_, reason) => reason !== 'clickaway' && dismiss()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        // Sits above the mobile bottom nav, sticky bars and the two floating support buttons (--nav-h is set by the bottom nav).
        sx={{ bottom: { xs: 'calc(var(--nav-h, 0px) + 96px)', md: 32 }, maxWidth: { xs: 'calc(100% - 32px)', sm: 520 }, mx: 'auto' }}
      >
        {current ? (
          // Plain div: the Snackbar's Grow transition needs a child that can hold a ref.
          <div style={{ width: '100%' }}>
            <ToastCard msg={current.msg} severity={current.severity} detail={current.detail} product={current.sku ? productBySku(current.sku) : undefined}
              action={act} onAction={() => { act?.onClick?.(); dismiss() }} onClose={dismiss} />
          </div>
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
