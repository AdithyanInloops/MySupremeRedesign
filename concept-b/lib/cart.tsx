import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { finalPrice, productBySku } from './data'

type Line = { sku: string; qty: number }
type Ctx = {
  lines: Line[]
  count: number
  add: (sku: string, qty?: number, opts?: { silent?: boolean }) => void
  /** Adds several lines with a single snackbar (kits, "add selected", paste-a-list). */
  addMany: (items: Line[], label?: string) => void
  subtotal: number
  recentlyViewed: string[]
  markViewed: (sku: string) => void
  clearViewed: () => void
  wishlist: string[]
  toggleWish: (sku: string) => void
  notify: (msg: string, severity?: 'success' | 'info' | 'error') => void
}

const CartCtx = createContext<Ctx | null>(null)

/** Prototype cart: React state mirrored to localStorage. No checkout. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [recentlyViewed, setRecent] = useState<string[]>([])
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'info' | 'error'; key: number } | null>(null)

  // Load once, and only start saving after the load has run (StrictMode double-mount would otherwise save []).
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ms-b-cart') ?? '[]')
      if (Array.isArray(saved)) setLines(saved)
      const seen = JSON.parse(localStorage.getItem('ms-b-viewed') ?? '[]')
      // Merge rather than replace, so a view recorded before the restore isn't lost.
      if (Array.isArray(seen)) setRecent((r) => [...r, ...seen.filter((x: string) => !r.includes(x))].slice(0, 12))
    } catch { /* storage blocked */ }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem('ms-b-cart', JSON.stringify(lines))
      localStorage.setItem('ms-b-viewed', JSON.stringify(recentlyViewed))
    } catch { /* storage blocked */ }
  }, [lines, recentlyViewed, loaded])

  const notify = useCallback((msg: string, severity: 'success' | 'info' | 'error' = 'success') => setToast({ msg, severity, key: Date.now() }), [])

  const add = useCallback(
    (sku: string, qty = 1, opts?: { silent?: boolean }) => {
      setLines((ls) => {
        const ex = ls.find((l) => l.sku === sku)
        return ex ? ls.map((l) => (l.sku === sku ? { ...l, qty: l.qty + qty } : l)) : [...ls, { sku, qty }]
      })
      if (!opts?.silent) notify(`${productBySku(sku)?.name ?? sku} added to cart`)
    },
    [notify],
  )

  const addMany = useCallback(
    (items: Line[], label?: string) => {
      if (!items.length) return
      setLines((ls) => {
        const next = [...ls]
        for (const it of items) {
          const ex = next.find((l) => l.sku === it.sku)
          if (ex) ex.qty += it.qty
          else next.push({ ...it })
        }
        return next.map((l) => ({ ...l }))
      })
      notify(label ?? `${items.length} products added to cart`)
    },
    [notify],
  )

  const markViewed = useCallback((sku: string) => setRecent((r) => [sku, ...r.filter((x) => x !== sku)].slice(0, 12)), [])
  const clearViewed = useCallback(() => setRecent([]), [])

  const toggleWish = useCallback(
    (sku: string) =>
      setWishlist((w) => {
        const has = w.includes(sku)
        notify(has ? 'Removed from Favorites' : 'Added to Favorites', has ? 'info' : 'success')
        return has ? w.filter((x) => x !== sku) : [...w, sku]
      }),
    [notify],
  )

  const subtotal = lines.reduce((a, l) => {
    const p = productBySku(l.sku)
    return a + (p ? finalPrice(p) * l.qty : 0)
  }, 0)
  const value = useMemo(
    () => ({ lines, count: lines.reduce((a, l) => a + l.qty, 0), add, addMany, subtotal, recentlyViewed, markViewed, clearViewed, wishlist, toggleWish, notify }),
    [lines, add, addMany, subtotal, recentlyViewed, markViewed, clearViewed, wishlist, toggleWish, notify],
  )

  return (
    <CartCtx.Provider value={value}>
      {children}
      <Snackbar
        key={toast?.key}
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, md: 24 } }}
      >
        {toast ? <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)} sx={{ fontFamily: 'Poppins' }}>{toast.msg}</Alert> : undefined}
      </Snackbar>
    </CartCtx.Provider>
  )
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
