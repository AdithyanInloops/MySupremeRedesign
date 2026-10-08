import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { offers, productBySku, warehouses, type Offer, type Product } from '../data/catalog'
import { orders as seedOrders, type Order } from '../data/account'
import { DELIVERY_MINIMUM, HST, notifications as seedNotices } from '../data/app'

/*
 * Prototype app state, mirrored to localStorage (`ms-c-*`). Production equivalents: GraphCommerce customer session,
 * cart (addProductsToCart / updateCartItems / removeItemFromCart), wishlist, and the Magento orders query.
 */

export type Line = { sku: string; qty: number; offerId?: string }
export type Toast = { id: number; message: string; detail?: string; action?: { label: string; onClick: () => void }; tone?: 'success' | 'info' | 'error' }

type Ctx = {
  ready: boolean
  signedIn: boolean
  onboarded: boolean
  signIn: () => void
  continueAsGuest: () => void
  signOut: () => void
  warehouse: string
  setWarehouse: (id: string) => void
  // pricing
  priceFor: (p: Product) => number
  linePrice: (l: Line) => number
  // cart
  lines: Line[]
  count: number
  subtotal: number
  discount: number
  tax: number
  total: number
  coupon: { code: string; pct: number } | null
  applyCoupon: (code: string) => string | null
  removeCoupon: () => void
  remaining: number
  qtyOf: (sku: string) => number
  add: (sku: string, qty?: number, opts?: { offerId?: string; silent?: boolean }) => void
  addMany: (items: Line[], label: string) => void
  setQty: (sku: string, qty: number) => void
  remove: (sku: string) => void
  clearCart: () => void
  // favourites, search, notifications
  wishlist: string[]
  toggleWish: (sku: string) => void
  recentlyViewed: string[]
  markViewed: (sku: string) => void
  clearViewed: () => void
  recentSearches: string[]
  pushSearch: (q: string) => void
  clearSearches: () => void
  unread: number
  readAll: () => void
  // orders
  orders: Order[]
  placeOrder: (o: Order) => void
  // toast
  toast: Toast | null
  notify: (t: Omit<Toast, 'id'>) => void
  dismiss: () => void
}

const AppCtx = createContext<Ctx | null>(null)
const read = <T,>(k: string, fallback: T): T => {
  try { const v = localStorage.getItem(`ms-c-${k}`); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}
const write = (k: string, v: unknown) => { try { localStorage.setItem(`ms-c-${k}`, JSON.stringify(v)) } catch { /* storage blocked */ } }
const nameOf = (sku: string) => productBySku(sku)?.name ?? sku
/** "View cart" toast action, unless the buyer is already looking at the cart. */
const viewCart = () => (window.location.hash.startsWith('#/cart') ? undefined : { label: 'View cart', onClick: () => { window.location.hash = '#/cart' } })
export const offerById = (id?: string): Offer | undefined => (id ? offers.find((o) => o.id === id) : undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [onboarded, setOnboarded] = useState(false)
  const [warehouse, setWarehouseState] = useState(warehouses[0].id)
  const [lines, setLines] = useState<Line[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [recentSearches, setRecent] = useState<string[]>([])
  const [recentlyViewed, setViewed] = useState<string[]>([])
  const [readNotices, setReadNotices] = useState(false)
  // Orders placed in this prototype, tagged with who placed them so signing out hides the account's orders.
  const [placed, setPlaced] = useState<(Order & { guest?: boolean })[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [coupon, setCoupon] = useState<{ code: string; pct: number } | null>(null)
  const linesRef = useRef(lines)
  linesRef.current = lines

  useEffect(() => {
    setSignedIn(read('signedIn', false))
    setOnboarded(read('onboarded', false))
    setWarehouseState(read('warehouse', warehouses[0].id))
    setLines(read<Line[]>('cart', []).filter((l) => productBySku(l.sku)))
    setWishlist(read('wish', ['59620000008478349', 'MT0011', 'DA0044']))
    setRecent(read('searches', ['basmati', 'clamshell']))
    // Seeded so "Pick up where you left off" has something to show on a first presentation.
    setViewed(read('viewed', ['PR0101', 'GR3091', '59620000008478349', 'DA0010', 'PK0912']))
    setReadNotices(read('noticesRead', false))
    setPlaced(read('placed', []))
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    write('signedIn', signedIn); write('onboarded', onboarded); write('warehouse', warehouse); write('cart', lines)
    write('wish', wishlist); write('searches', recentSearches); write('viewed', recentlyViewed); write('noticesRead', readNotices); write('placed', placed)
  }, [ready, signedIn, onboarded, warehouse, lines, wishlist, recentSearches, recentlyViewed, readNotices, placed])

  const notify = useCallback((t: Omit<Toast, 'id'>) => setToast({ ...t, id: Date.now() + Math.random() }), [])
  const dismiss = useCallback(() => setToast(null), [])

  const priceFor = useCallback((p: Product) => (signedIn && p.groupPrice ? p.groupPrice : p.price), [signedIn])
  const linePrice = useCallback((l: Line) => {
    const o = offerById(l.offerId)
    const p = productBySku(l.sku)
    return o ? o.offerPrice : p ? priceFor(p) : 0
  }, [priceFor])

  const restore = useCallback((snap: Line[]) => setLines(snap), [])

  const add = useCallback((sku: string, qty = 1, opts?: { offerId?: string; silent?: boolean }) => {
    const had = linesRef.current.find((l) => l.sku === sku)?.qty ?? 0
    setLines((ls) => {
      const ex = ls.find((l) => l.sku === sku)
      if (ex) return ls.map((l) => (l.sku === sku ? { ...l, qty: Math.min(999, l.qty + qty), offerId: opts?.offerId ?? l.offerId } : l))
      return [...ls, { sku, qty, offerId: opts?.offerId }]
    })
    if (!opts?.silent) notify({ message: had ? `${had + qty} in cart` : 'Added to cart', detail: nameOf(sku), action: viewCart() })
  }, [notify])

  const addMany = useCallback((items: Line[], label: string) => {
    setLines((ls) => {
      const next = ls.map((l) => ({ ...l }))
      for (const it of items) {
        const ex = next.find((l) => l.sku === it.sku)
        if (ex) ex.qty = Math.min(999, ex.qty + it.qty)
        else next.push({ ...it })
      }
      return next
    })
    notify({ message: label, detail: `${items.reduce((a, i) => a + i.qty, 0)} items added`, action: viewCart() })
  }, [notify])

  const remove = useCallback((sku: string) => {
    const snap = linesRef.current
    setLines(snap.filter((l) => l.sku !== sku))
    notify({ message: 'Removed from cart', detail: nameOf(sku), tone: 'info', action: { label: 'Undo', onClick: () => restore(snap) } })
  }, [notify, restore])

  const setQty = useCallback((sku: string, qty: number) => {
    if (qty <= 0) return remove(sku)
    setLines((ls) => ls.map((l) => (l.sku === sku ? { ...l, qty: Math.min(999, qty) } : l)))
  }, [remove])

  const clearCart = useCallback(() => setLines([]), [])
  const qtyOf = useCallback((sku: string) => lines.find((l) => l.sku === sku)?.qty ?? 0, [lines])

  const toggleWish = useCallback((sku: string) => {
    const has = wishlist.includes(sku)
    setWishlist((w) => (has ? w.filter((x) => x !== sku) : [sku, ...w]))
    notify(has ? { message: 'Removed from Favorites', detail: nameOf(sku), tone: 'info' } : { message: 'Saved to Favorites', detail: nameOf(sku) })
  }, [wishlist, notify])

  const markViewed = useCallback((sku: string) => setViewed((v) => [sku, ...v.filter((x) => x !== sku)].slice(0, 12)), [])
  const clearViewed = useCallback(() => setViewed([]), [])
  const pushSearch = useCallback((q: string) => setRecent((r) => [q, ...r.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6)), [])
  const clearSearches = useCallback(() => setRecent([]), [])

  const signIn = useCallback(() => { setSignedIn(true); setOnboarded(true) }, [])
  const continueAsGuest = useCallback(() => { setSignedIn(false); setOnboarded(true) }, [])
  const signOut = useCallback(() => { setSignedIn(false); setOnboarded(false) }, [])
  const setWarehouse = useCallback((id: string) => setWarehouseState(id), [])
  const readAll = useCallback(() => setReadNotices(true), [])
  const placeOrder = useCallback((o: Order) => { setPlaced((p) => [{ ...o, guest: !signedIn }, ...p]); setLines([]); setCoupon(null) }, [signedIn])

  /** Prototype coupon. Production: Magento cart price rules (applyCouponToCart). Returns an error message or null. */
  const applyCoupon = useCallback((raw: string) => {
    const code = raw.trim().toUpperCase()
    if (!code) return 'Enter a promo code.'
    if (code !== 'SUPREME10') return `“${code}” isn’t valid. Check the spelling, or try SUPREME10 in this prototype.`
    setCoupon({ code, pct: 10 })
    notify({ message: 'SUPREME10 applied', detail: '10% off your order' })
    return null
  }, [notify])
  const removeCoupon = useCallback(() => setCoupon(null), [])

  const subtotal = +lines.reduce((a, l) => a + linePrice(l) * l.qty, 0).toFixed(2)
  const discount = coupon ? +(subtotal * coupon.pct / 100).toFixed(2) : 0
  const tax = +((subtotal - discount) * HST).toFixed(2)
  const value = useMemo<Ctx>(() => ({
    ready, signedIn, onboarded, signIn, continueAsGuest, signOut, warehouse, setWarehouse, priceFor, linePrice,
    lines, count: lines.reduce((a, l) => a + l.qty, 0), subtotal, discount, tax, total: +(subtotal - discount + tax).toFixed(2), coupon, applyCoupon, removeCoupon, remaining: Math.max(0, +(DELIVERY_MINIMUM - subtotal).toFixed(2)),
    qtyOf, add, addMany, setQty, remove, clearCart, wishlist, toggleWish, recentlyViewed, markViewed, clearViewed, recentSearches, pushSearch, clearSearches,
    unread: readNotices ? 0 : seedNotices.filter((n) => n.unread).length, readAll,
    orders: signedIn ? [...placed.filter((o) => !o.guest), ...seedOrders] : placed.filter((o) => o.guest), placeOrder, toast, notify, dismiss,
  }), [ready, signedIn, onboarded, signIn, continueAsGuest, signOut, warehouse, setWarehouse, priceFor, linePrice, lines, subtotal, discount, tax, coupon, applyCoupon, removeCoupon, qtyOf, add, addMany, setQty, remove, clearCart, wishlist, toggleWish, recentlyViewed, markViewed, clearViewed, recentSearches, pushSearch, clearSearches, readNotices, readAll, placed, placeOrder, toast, notify, dismiss])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp outside AppProvider')
  return c
}
