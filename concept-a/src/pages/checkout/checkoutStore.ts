import { addresses, type Address } from '../../data/account'

/**
 * Prototype-only checkout session (in the build this is the Magento cart's
 * shipping_addresses / selected_shipping_method, read via GraphCommerce hooks).
 */
export type DeliveryMethod = { id: 'scheduled' | 'express' | 'pickup'; title: string; eta: string; fee: number; body: string }

export const deliveryMethods: DeliveryMethod[] = [
  { id: 'scheduled', title: 'Scheduled delivery — next route', eta: 'Tue Oct 7 · 9 AM – 1 PM', fee: 0, body: 'Free over $250 · cold-chain truck on your regular route' },
  { id: 'express', title: 'Same-day express', eta: 'Today · 3 PM – 6 PM', fee: 24.99, body: 'Order by 12 PM · GTA & Hamilton only' },
  { id: 'pickup', title: 'Pickup at cash & carry', eta: 'Ready in 2 hours', fee: 0, body: '3750A Laird Road, Unit 9, Mississauga · Mon–Sat 9–6' },
]

export const checkoutSession: {
  email: string
  addressList: Address[]
  shippingId: string
  methodId: DeliveryMethod['id']
  notes: string
  fee: number
} = {
  email: '',
  addressList: [...addresses],
  shippingId: 'a1',
  methodId: 'scheduled',
  notes: '',
  fee: 0,
}

export const currentShipping = () => checkoutSession.addressList.find((a) => a.id === checkoutSession.shippingId) ?? checkoutSession.addressList[0]
export const currentMethod = () => deliveryMethods.find((m) => m.id === checkoutSession.methodId) ?? deliveryMethods[0]
