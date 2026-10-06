import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Alert, Snackbar } from '@mui/material'
import { productBySku } from './data'

type Line = { sku: string; qty: number }
type Ctx = {
  lines: Line[]
  count: number
  add: (sku: string, qty?: number, opts?: { silent?: boolean }) => void
  wishlist: string[]
  toggleWish: (sku: string) => void
  notify: (msg: string, severity?: 'success' | 'info' | 'error') => void
}

const CartCtx = createContext<Ctx | null>(null)

/** Prototype cart: React state mirrored to localStorage. No checkout. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [toast, setToast] = useState<{ msg: string; severity: 'success' | 'info' | 'error'; key: number } | null>(null)

  // Load once, and only start saving after the load has run (StrictMode double-mount would otherwise save []).
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ms-b-cart') ?? '[]')
      if (Array.isArray(saved)) setLines(saved)
    } catch { /* storage blocked */ }
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('ms-b-cart', JSON.stringify(lines)) } catch { /* storage blocked */ }
  }, [lines, loaded])

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

  const toggleWish = useCallback(
    (sku: string) =>
      setWishlist((w) => {
        const has = w.includes(sku)
        notify(has ? 'Removed from Favorites' : 'Added to Favorites', has ? 'info' : 'success')
        return has ? w.filter((x) => x !== sku) : [...w, sku]
      }),
    [notify],
  )

  const value = useMemo(() => ({ lines, count: lines.reduce((a, l) => a + l.qty, 0), add, wishlist, toggleWish, notify }), [lines, add, wishlist, toggleWish, notify])

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
