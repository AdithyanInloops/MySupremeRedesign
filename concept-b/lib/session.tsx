import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Coupon, Line, Method } from './pricing'

/**
 * Prototype session + checkout state. Production: GraphCommerce customer token / Magento customer query for the
 * session, and the Magento cart (setShippingAddressesOnCart, setShippingMethodsOnCart, setPaymentMethodOnCart,
 * placeOrder) for checkout. Nothing here is sent anywhere.
 */

export type Address = { business: string; contact: string; phone: string; street: string; unit: string; city: string; postal: string }
export type User = { email: string; name: string; business: string; phone: string; address: Address; terms: string }

export const emptyAddress: Address = { business: '', contact: '', phone: '', street: '', unit: '', city: '', postal: '' }

/** Dummy business account used when someone signs in to the prototype (the design brief's sample customer). */
export function demoUser(email: string): User {
  const address = { business: 'Spice Route Kitchen', contact: 'Aman Gill', phone: '905-555-0142', street: '2150 Dundas St W', unit: 'Unit 4', city: 'Mississauga', postal: 'L5K 2K7' }
  return { email, name: 'Aman Gill', business: 'Spice Route Kitchen', phone: address.phone, address, terms: 'Net 30' }
}

export type Payment = 'card' | 'account' | 'on-pickup'
export type CheckoutDraft = {
  email: string
  method: Method
  address: Address
  slotId: string
  notes: string
  payment: Payment
  billingSame: boolean
  billing: Address
}

export type Order = {
  number: string
  placedAt: string
  email: string
  lines: (Line & { price: number })[]
  subtotal: number
  discount: number
  tax: number
  total: number
  coupon: Coupon | null
  method: Method
  address: Address
  slotLabel: string
  paymentLabel: string
  guest: boolean
}

type Ctx = {
  ready: boolean
  user: User | null
  signIn: (email: string) => User
  signOut: () => void
  draft: CheckoutDraft
  updateDraft: (patch: Partial<CheckoutDraft>) => void
  lastOrder: Order | null
  saveOrder: (o: Order) => void
}

const SessionCtx = createContext<Ctx | null>(null)

const freshDraft = (user?: User | null): CheckoutDraft => ({
  email: user?.email ?? '',
  method: 'delivery',
  address: user ? { ...user.address } : { ...emptyAddress },
  slotId: '',
  notes: '',
  payment: user ? 'account' : 'card',
  billingSame: true,
  billing: { ...emptyAddress },
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [draft, setDraft] = useState<CheckoutDraft>(freshDraft())
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ms-b-session') ?? 'null')
      const d = JSON.parse(sessionStorage.getItem('ms-b-checkout') ?? 'null')
      const o = JSON.parse(sessionStorage.getItem('ms-b-order') ?? 'null')
      if (u?.email) setUser(u)
      setDraft(d?.address ? d : freshDraft(u))
      if (o?.number) setLastOrder(o)
    } catch { /* storage blocked */ }
    setReady(true)
  }, [])
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem('ms-b-session', JSON.stringify(user))
      sessionStorage.setItem('ms-b-checkout', JSON.stringify(draft))
      sessionStorage.setItem('ms-b-order', JSON.stringify(lastOrder))
    } catch { /* storage blocked */ }
  }, [user, draft, lastOrder, ready])

  const signIn = useCallback((email: string) => {
    const u = demoUser(email.trim().toLowerCase())
    setUser(u)
    // Signing in fills the checkout with the saved business address unless the buyer already typed one.
    setDraft((d) => (d.address.street ? { ...d, email: u.email } : freshDraft(u)))
    return u
  }, [])
  const signOut = useCallback(() => {
    setUser(null)
    setDraft(freshDraft())
  }, [])
  const updateDraft = useCallback((patch: Partial<CheckoutDraft>) => setDraft((d) => ({ ...d, ...patch })), [])
  const saveOrder = useCallback((o: Order) => {
    setLastOrder(o)
    setDraft((d) => ({ ...freshDraft(user), email: d.email }))
  }, [user])

  const value = useMemo(() => ({ ready, user, signIn, signOut, draft, updateDraft, lastOrder, saveOrder }), [ready, user, signIn, signOut, draft, updateDraft, lastOrder, saveOrder])
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>
}

export function useSession() {
  const c = useContext(SessionCtx)
  if (!c) throw new Error('useSession outside SessionProvider')
  return c
}
