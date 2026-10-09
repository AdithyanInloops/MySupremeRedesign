import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Box, Button, IconButton, Switch, Typography } from '@mui/material'
import { tokens, focusRing, pressable } from '../theme'
import { useApp } from '../state/app'
import { money, warehouses } from '../data/catalog'
import { addresses, credit, customer, invoices } from '../data/account'
import { Crown, Group, ListRow, Sheet } from '../components/ui'
import {
  BarcodeIcon, BellIcon, BoltIcon, CheckIcon, ChevronRightIcon, EditIcon, FileTextIcon, HelpCircleIcon, LogOutIcon, MapPinIcon, ReceiptIcon,
  ShieldIcon, StoreIcon, TagIcon, WalletIcon,
} from '../components/icons'

const c = tokens.color

function CreditCard() {
  const used = credit.limit - credit.available
  return (
    <Box component={RouterLink} to="/account/credit" aria-label={`Available credit ${money(credit.available)}, ${money(credit.overdue)} overdue. Open invoices and payments.`}
      sx={{ display: 'block', position: 'relative', overflow: 'hidden', p: 2.25, borderRadius: `${tokens.radius.lg}px`, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${c.navy} 0%, ${c.navyDark} 100%)`, boxShadow: '0 18px 40px -18px rgba(27,25,80,.7)', '&:focus-visible': { outline: `3px solid ${c.saffron}`, outlineOffset: 2 } }}>
      <Box sx={{ position: 'absolute', right: -26, top: -22, opacity: 0.1 }}><Crown size={170} color="#fff" /></Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
        <Typography sx={{ fontSize: 12.5, opacity: 0.8 }}>Available credit</Typography>
        <Box sx={{ fontSize: 11.5, fontWeight: 700, px: 1, py: 0.25, borderRadius: 999, bgcolor: 'rgba(255,255,255,.14)' }}>{credit.terms}</Box>
      </Box>
      <Typography sx={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', mt: 0.25, position: 'relative' }}>{money(credit.available)}</Typography>
      <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,.18)', mt: 1, overflow: 'hidden' }}><Box sx={{ width: `${(used / credit.limit) * 100}%`, height: '100%', bgcolor: c.saffron }} /></Box>
      <Typography sx={{ fontSize: 12, opacity: 0.75, mt: 0.75 }}>{money(used)} used of {money(credit.limit)} limit</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1, mt: 2, position: 'relative' }}>
        {[['Outstanding', credit.outstanding, false], ['Due soon', credit.due, false], ['Overdue', credit.overdue, true]].map(([k, v, bad]) => (
          <Box key={k as string} sx={{ p: 1, borderRadius: `${tokens.radius.sm}px`, bgcolor: bad ? 'rgba(255,197,49,.16)' : 'rgba(255,255,255,.08)', border: bad ? `1px solid ${c.saffron}` : '1px solid transparent' }}>
            <Typography sx={{ fontSize: 11, opacity: 0.8, color: bad ? c.saffron : '#fff' }}>{k as string}</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{money(v as number)}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.75, position: 'relative' }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Invoices &amp; payments</Typography>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.75, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.saffron, color: c.ink, fontSize: 13, fontWeight: 800 }}>Pay {money(credit.overdue)} <ChevronRightIcon sx={{ fontSize: 16 }} /></Box>
      </Box>
    </Box>
  )
}

/** Shortcut tiles for the places buyers go most from More (orders and flyers live here, not on the tab bar). */
function Shortcuts() {
  const { orders } = useApp()
  const live = orders.filter((o) => o.status === 'On the way' || o.status === 'Confirmed' || o.status === 'Pending').length
  const tiles = [
    { to: '/orders', icon: ReceiptIcon, title: 'Orders', sub: live ? `${live} active` : `${orders.length} past`, dot: live > 0 },
    { to: '/deals', icon: TagIcon, title: 'Offers', sub: 'Flyers & deals' },
    { to: '/account/addresses', icon: MapPinIcon, title: 'Addresses', sub: `${addresses.length} saved` },
  ]
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, px: 2, pb: 2, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 1 }}>
      {tiles.map((t) => {
        const Icon = t.icon
        return (
          <li key={t.to}>
            <Box component={RouterLink} to={t.to} sx={{ display: 'block', p: 1.25, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, color: c.ink, textDecoration: 'none', ...pressable, ...focusRing }}>
              <Box sx={{ position: 'relative', width: 34, height: 34, borderRadius: `${tokens.radius.sm}px`, bgcolor: c.navyTint, color: c.navy, display: 'grid', placeItems: 'center' }}>
                <Icon sx={{ fontSize: 19 }} />
                {t.dot && <Box sx={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', bgcolor: c.success, border: '2px solid #fff' }} />}
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.75, lineHeight: 1.2 }}>{t.title}</Typography>
              <Typography sx={{ fontSize: 12, color: t.dot ? c.successText : c.text3, fontWeight: t.dot ? 600 : 400 }}>{t.sub}</Typography>
            </Box>
          </li>
        )
      })}
    </Box>
  )
}

export default function Account() {
  const { signedIn, signOut, warehouse, setWarehouse, notify } = useApp()
  const navigate = useNavigate()
  const [push, setPush] = useState(true)
  const [faceId, setFaceId] = useState(true)
  const [whSheet, setWhSheet] = useState(false)
  const overdue = invoices.filter((i) => i.status === 'Overdue').length
  const wh = warehouses.find((w) => w.id === warehouse) ?? warehouses[0]

  return (
    <Box sx={{ pb: 3 }}>
      <Box sx={{ px: 2, pt: 'calc(16px + env(safe-area-inset-top))', pb: 1.75 }}>
        <Typography component="h1" sx={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em' }}>More</Typography>
        {signedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: c.navy, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 19, flexShrink: 0 }}>SR</Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 17 }}>{customer.businessName}</Typography>
              <Typography sx={{ fontSize: 13, color: c.text3 }}>{customer.firstName} {customer.lastName} · {customer.businessCategory}</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5, fontSize: 11.5, fontWeight: 700, color: c.navy, bgcolor: c.navyTint, px: 1, borderRadius: 999, lineHeight: 1.8 }}><ShieldIcon sx={{ fontSize: 13 }} /> Business member since 2023</Box>
            </Box>
            <IconButton aria-label="Edit profile" onClick={() => notify({ message: 'Profile editing', detail: 'Name, phone and business details — opens the profile form', tone: 'info' })} sx={{ bgcolor: '#fff', border: `1px solid ${c.line}` }}><EditIcon sx={{ fontSize: 19 }} /></IconButton>
          </Box>
        ) : (
          <Box sx={{ mt: 2, p: 2, borderRadius: `${tokens.radius.lg}px`, bgcolor: c.navy, color: '#fff' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 17 }}>You’re browsing as a guest</Typography>
            <Typography sx={{ fontSize: 13.5, opacity: 0.85, mt: 0.25 }}>Sign in for business prices, Net 30 credit, order history and one-tap reorder.</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1.75 }}>
              <Button component={RouterLink} to="/signin" variant="contained" sx={{ flex: 1 }}>Sign in</Button>
              <Button component={RouterLink} to="/signin?mode=register" sx={{ flex: 1, color: '#fff', border: '1.5px solid rgba(255,255,255,.5)' }}>Open account</Button>
            </Box>
          </Box>
        )}
      </Box>

      {signedIn && <Shortcuts />}
      {signedIn && <Box sx={{ px: 2, mb: 2.5 }}><CreditCard /></Box>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {signedIn && (
          <Group title="Billing">
            <ListRow icon={WalletIcon} title="Invoices & payments" subtitle="Pay invoices, download PDFs" to="/account/credit" tone="red"
              trailing={overdue ? <Box sx={{ fontSize: 11.5, fontWeight: 700, color: c.error, bgcolor: c.errorTint, px: 1, borderRadius: 999, lineHeight: 1.9 }}>{overdue} overdue</Box> : null} />
            <ListRow icon={FileTextIcon} title="Quotes & statements" subtitle="Catering quotes, monthly statements" to="/account/credit?tab=statements" />
          </Group>
        )}
        <Group title="Shopping">
          {!signedIn && <ListRow icon={TagIcon} title="Flyers & offers" subtitle="This week’s deals at your warehouse" to="/deals" tone="red" />}
          <ListRow icon={BoltIcon} title="Quick order" subtitle="Order by SKU or paste a list" to="/quick-order" tone="saffron" />
          <ListRow icon={BarcodeIcon} title="Scan a barcode" subtitle="Add items straight from your shelf" to="/scan" tone="saffron" />
          <ListRow icon={StoreIcon} title="Your warehouse" subtitle={`${wh.name} · ${wh.area}`} onClick={() => setWhSheet(true)} tone="green" />
        </Group>
        <Group title="Settings">
          <ListRow icon={BellIcon} title="Push notifications" subtitle="Deliveries, deals and invoices" trailing={<Switch checked={push} onChange={(e) => setPush(e.target.checked)} inputProps={{ 'aria-label': 'Push notifications' }} />} />
          {signedIn && <ListRow icon={ShieldIcon} title="Sign in with Face ID" trailing={<Switch checked={faceId} onChange={(e) => setFaceId(e.target.checked)} inputProps={{ 'aria-label': 'Sign in with Face ID' }} />} />}
        </Group>
        <Group title="Help">
          <ListRow icon={HelpCircleIcon} title="Help & contact" subtitle="Call, WhatsApp or chat with us" to="/help" />
          <ListRow icon={FileTextIcon} title="Offers: CMS blocks" subtitle="For the team: how Offers & Flyers is managed in Magento" to="/cms" />
        </Group>
        {signedIn && (
          <Group>
            <ListRow icon={LogOutIcon} title="Sign out" danger onClick={() => { signOut(); navigate('/welcome', { replace: true }) }} />
          </Group>
        )}
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: 12, color: c.text4, mt: 3 }}>MySupreme app · Concept C design prototype</Typography>
      {/* Prototype only: replay the whole journey (welcome → sign in → order) for the next presentation. */}
      <Box sx={{ textAlign: 'center' }}>
        <Button size="small" onClick={() => { try { Object.keys(localStorage).filter((k) => k.startsWith('ms-c-')).forEach((k) => localStorage.removeItem(k)) } catch { /* blocked */ } window.location.hash = '#/welcome'; window.location.reload() }} sx={{ color: c.text3, fontWeight: 500 }}>
          Reset demo
        </Button>
      </Box>

      <Sheet open={whSheet} onClose={() => setWhSheet(false)} title="Your warehouse">
        <Typography sx={{ fontSize: 13.5, color: c.text2, mb: 1.5 }}>Sets the flyer, deals and stock you see.</Typography>
        {warehouses.map((w) => (
          <Box key={w.id} component="button" onClick={() => { setWarehouse(w.id); setWhSheet(false) }} aria-pressed={w.id === warehouse}
            sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 60, borderTop: `1px solid ${c.line}` }}>
            <StoreIcon sx={{ color: w.id === warehouse ? c.navy : c.text3 }} />
            <Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 600 }}>{w.name}</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>{w.area}</Typography></Box>
            {w.id === warehouse && <CheckIcon sx={{ color: c.navy }} />}
          </Box>
        ))}
      </Sheet>
    </Box>
  )
}
