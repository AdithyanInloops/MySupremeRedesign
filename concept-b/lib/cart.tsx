import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import { productBySku } from './data'
import { totals, type Coupon, type Line } from './pricing'
import { useToast, type ToastSeverity } from './toast'

/**
 * Prototype cart, favourites and browsing history: React state mirrored to localStorage.
 * Production: the GraphCommerce cart / wishlist / recently-viewed stores. The API mirrors the Magento mutations
 * (addProductsToCart, updateCartItems, removeItemFromCart, applyCouponToCart).
 *
 * Feedback rules: adding from zero, bulk adds and removals show a toast (removals with Undo). Changing a quantity
 * with a stepper is silent — the stepper, the header badge and the totals are the feedback.
 */

type Ctx = {
  /** False until localStorage has been read — render skeletons, not empty states, before that. */
  ready: boolean
  lines: Line[]
  count: number
  subtotal: number
  qtyOf: (sku: string) => number
  add: (sku: string, qty?: number, opts?: { silent?: boolean }) => void
  /** Adds several lines with a single toast (kits, "add selected", paste-a-list). */
  addMany: (items: Line[], label?: string) => void
  /** Sets a line's quantity; 0 removes it (with Undo). */
  setQty: (sku: string, qty: number) => void
  remove: (sku: string) => void
  clear: (opts?: { silent?: boolean }) => void
  coupon: Coupon | null
  setCoupon: (c: Coupon | null) => void
  recentlyViewed: string[]
  markViewed: (sku: string) => void
  clearViewed: () => void
  wishlist: string[]
  toggleWish: (sku: string) => void
  notify: (msg: string, severity?: ToastSeverity) => void
}

const CartCtx = createContext<Ctx | null>(null)
const nameOf = (sku: string) => productBySku(sku)?.name ?? sku

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast, notify } = useToast()
  const router = useRouter()
  const [lines, setLines] = useState<Line[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [recentlyViewed, setRecent] = useState<string[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [ready, setReady] = useState(false)
  // Latest lines for callbacks that need a snapshot (undo) without re-creating every handler.
  const linesRef = useRef(lines)
  linesRef.current = lines
  const onCart = router.pathname === '/cart'

  // Load once, and only start saving after the load has run (StrictMode double-mount would otherwise save []).
  useEffect(() => {
    try {
      const read = (k: string) => JSON.parse(localStorage.getItem(k) ?? 'null')
      const saved = read('ms-b-cart')
      if (Array.isArray(saved)) setLines(saved.filter((l) => l && productBySku(l.sku) && l.qty > 0))
      const wish = read('ms-b-wish')
      if (Array.isArray(wish)) setWishlist(wish)
      const c = read('ms-b-coupon')
      if (c?.code) setCoupon(c)
      const seen = read('ms-b-viewed')
      // Merge rather than replace, so a view recorded before the restore isn't lost.
      if (Array.isArray(seen)) setRecent((r) => [...r, ...seen.filter((x: string) => !r.includes(x))].slice(0, 12))
    } catch { /* storage blocked */ }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem('ms-b-cart', JSON.stringify(lines))
      localStorage.setItem('ms-b-wish', JSON.stringify(wishlist))
      localStorage.setItem('ms-b-viewed', JSON.stringify(recentlyViewed))
      localStorage.setItem('ms-b-coupon', JSON.stringify(coupon))
    } catch { /* storage blocked */ }
  }, [lines, wishlist, recentlyViewed, coupon, ready])

  const restore = useCallback((snapshot: Line[]) => setLines(snapshot), [])

  const add = useCallback(
    (sku: string, qty = 1, opts?: { silent?: boolean }) => {
      const had = linesRef.current.find((l) => l.sku === sku)?.qty ?? 0
      setLines((ls) => {
        const ex = ls.find((l) => l.sku === sku)
        return ex ? ls.map((l) => (l.sku === sku ? { ...l, qty: Math.min(999, l.qty + qty) } : l)) : [...ls, { sku, qty: Math.min(999, qty) }]
      })
      if (opts?.silent) return
      toast({
        message: had ? `Cart updated — ${had + qty} in cart` : 'Added to cart',
        description: `${qty} × ${nameOf(sku)}`,
        action: onCart ? undefined : { label: 'View cart', href: '/cart' },
      })
    },
    [toast, onCart],
  )

  const addMany = useCallback(
    (items: Line[], label?: string) => {
      if (!items.length) return
      setLines((ls) => {
        const next = ls.map((l) => ({ ...l }))
        for (const it of items) {
          const ex = next.find((l) => l.sku === it.sku)
          if (ex) ex.qty = Math.min(999, ex.qty + it.qty)
          else next.push({ ...it })
        }
        return next
      })
      const units = items.reduce((a, i) => a + i.qty, 0)
      toast({
        message: label ?? `${items.length} products added to cart`,
        description: `${units} item${units === 1 ? '' : 's'} added`,
        action: onCart ? undefined : { label: 'View cart', href: '/cart' },
      })
    },
    [toast, onCart],
  )

  const remove = useCallback(
    (sku: string) => {
      const snapshot = linesRef.current
      if (!snapshot.some((l) => l.sku === sku)) return
      setLines(snapshot.filter((l) => l.sku !== sku))
      toast({ message: 'Removed from cart', description: nameOf(sku), severity: 'info', action: { label: 'Undo', onClick: () => restore(snapshot) } })
    },
    [toast, restore],
  )

  const setQty = useCallback(
    (sku: string, qty: number) => {
      const q = Math.max(0, Math.min(999, Math.floor(qty || 0)))
      if (q === 0) return remove(sku)
      setLines((ls) => (ls.some((l) => l.sku === sku) ? ls.map((l) => (l.sku === sku ? { ...l, qty: q } : l)) : [...ls, { sku, qty: q }]))
    },
    [remove],
  )

  const clear = useCallback(
    (opts?: { silent?: boolean }) => {
      const snapshot = linesRef.current
      setLines([])
      if (!opts?.silent && snapshot.length) toast({ message: 'Cart cleared', description: `${snapshot.length} products removed`, severity: 'info', action: { label: 'Undo', onClick: () => restore(snapshot) } })
    },
    [toast, restore],
  )

  const qtyOf = useCallback((sku: string) => lines.find((l) => l.sku === sku)?.qty ?? 0, [lines])

  const markViewed = useCallback((sku: string) => setRecent((r) => [sku, ...r.filter((x) => x !== sku)].slice(0, 12)), [])
  const clearViewed = useCallback(() => {
    const snapshot = recentlyViewed
    setRecent([])
    toast({ message: 'Browsing history cleared', severity: 'info', action: { label: 'Undo', onClick: () => setRecent(snapshot) } })
  }, [recentlyViewed, toast])

  const toggleWish = useCallback(
    (sku: string) => {
      const has = wishlist.includes(sku)
      setWishlist((w) => (has ? w.filter((x) => x !== sku) : [...w, sku]))
      toast(
        has
          ? { message: 'Removed from Favorites', description: nameOf(sku), severity: 'info', action: { label: 'Undo', onClick: () => setWishlist((w) => (w.includes(sku) ? w : [...w, sku])) } }
          : { message: 'Saved to Favorites', description: nameOf(sku), action: { label: 'View', href: '/wishlist' } },
      )
    },
    [wishlist, toast],
  )

  const { subtotal } = totals(lines)
  const value = useMemo<Ctx>(
    () => ({
      ready, lines, count: lines.reduce((a, l) => a + l.qty, 0), subtotal, qtyOf, add, addMany, setQty, remove, clear, coupon, setCoupon,
      recentlyViewed, markViewed, clearViewed, wishlist, toggleWish, notify,
    }),
    [ready, lines, subtotal, qtyOf, add, addMany, setQty, remove, clear, coupon, recentlyViewed, markViewed, clearViewed, wishlist, toggleWish, notify],
  )

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
