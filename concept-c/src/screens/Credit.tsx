import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Box, Button, CircularProgress, Tab, Tabs, Typography } from '@mui/material'
import { tokens, focusRing } from '../theme'
import { useApp } from '../state/app'
import { money } from '../data/catalog'
import { credit, creditNotes, invoices as seed, payments, quotes, statements, type DocStatus } from '../data/account'
import { dayDate, shortDate } from '../data/format'
import { Sheet, StatusChip, TopBar } from '../components/ui'
import { BankIcon, CheckCircleIcon, CreditCardIcon, DownloadIcon } from '../components/icons'

const c = tokens.color
type Inv = (typeof seed)[number]
const TABS = ['invoices', 'payments', 'statements', 'quotes'] as const

/** Credit & billing (Concept A's credit dashboard, for a phone): invoices first, pay in two taps. */
export default function Credit() {
  const { signedIn, notify } = useApp()
  const [params, setParams] = useSearchParams()
  const tab = Math.max(0, TABS.indexOf((params.get('tab') ?? 'invoices') as (typeof TABS)[number]))
  const [invoices, setInvoices] = useState<Inv[]>(seed)
  const [paying, setPaying] = useState<Inv | null>(null)
  const [method, setMethod] = useState<'card' | 'eft'>('card')
  const [busy, setBusy] = useState(false)
  if (!signedIn) return <Navigate to="/signin" replace />

  const open = invoices.filter((i) => i.balance > 0).sort((a, b) => (a.status === 'Overdue' ? -1 : b.status === 'Overdue' ? 1 : a.due.localeCompare(b.due)))
  const paid = invoices.filter((i) => i.balance === 0)
  const pay = async () => {
    if (!paying) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 1000))
    setInvoices((list) => list.map((i) => (i.number === paying.number ? { ...i, balance: 0, status: 'Paid' as DocStatus } : i)))
    notify({ message: `${paying.number} paid`, detail: `${money(paying.balance)} · receipt sent by email` })
    setBusy(false)
    setPaying(null)
  }
  const download = (name: string) => notify({ message: 'Downloaded', detail: `${name}.pdf`, tone: 'info' })

  const invRow = (i: Inv) => (
    <Box key={i.number} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{i.number}</Typography><StatusChip status={i.status} /></Box>
        <Typography sx={{ fontSize: 12.5, color: i.status === 'Overdue' ? c.error : c.text3, mt: 0.25 }}>{i.balance ? `Due ${dayDate(i.due)}` : `Paid · issued ${shortDate(i.date)}`} · Order #{i.order}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{money(i.balance || i.amount)}</Typography>
        {i.balance > 0 ? (
          <Button size="small" variant={i.status === 'Overdue' ? 'contained' : 'outlined'} color={i.status === 'Overdue' ? 'primary' : 'secondary'} onClick={() => setPaying(i)} sx={{ mt: 0.5, minHeight: 32 }}>Pay</Button>
        ) : (
          <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: '16px !important' }} />} onClick={() => download(i.number)} sx={{ mt: 0.5, minHeight: 32, color: c.navy }}>PDF</Button>
        )}
      </Box>
    </Box>
  )
  const card = (children: React.ReactNode) => <Box sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}`, overflow: 'hidden', '& > * + *': { borderTop: `1px solid ${c.line}` } }}>{children}</Box>

  return (
    <Box>
      <TopBar title="Invoices & payments" />
      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 1 }}>
          {[['Available', credit.available, c.navy], ['Outstanding', open.reduce((a, i) => a + i.balance, 0), c.ink], ['Credit limit', credit.limit, c.ink], ['Terms', credit.terms, c.ink]].map(([k, v, col]) => (
            <Box key={k as string} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
              <Typography sx={{ fontSize: 12, color: c.text3 }}>{k as string}</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: col as string, fontVariantNumeric: 'tabular-nums' }}>{typeof v === 'number' ? money(v) : v}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setParams({ tab: TABS[v] }, { replace: true })} variant="scrollable" allowScrollButtonsMobile={false} sx={{ mt: 1.5, px: 1, borderBottom: `1px solid ${c.line}` }} aria-label="Billing">
        <Tab label={`Invoices (${open.length})`} /><Tab label="Payments" /><Tab label="Statements" /><Tab label="Quotes" />
      </Tabs>
      <Box role="tabpanel" sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tab === 0 && (
          <>
            {open.length ? card(open.map(invRow)) : <Box sx={{ textAlign: 'center', py: 3 }}><CheckCircleIcon sx={{ fontSize: 44, color: c.successText }} /><Typography sx={{ fontWeight: 700, mt: 1 }}>All caught up</Typography><Typography sx={{ color: c.text2, fontSize: 14 }}>No open invoices.</Typography></Box>}
            <Typography variant="overline" component="h2" sx={{ color: c.text3 }}>Paid</Typography>
            {card(paid.map(invRow))}
            {creditNotes.map((n) => (
              <Box key={n.number} sx={{ p: 1.5, borderRadius: `${tokens.radius.md}px`, bgcolor: c.successTint, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <Box><Typography sx={{ fontWeight: 700, fontSize: 14 }}>Credit note {n.number}</Typography><Typography sx={{ fontSize: 12.5, color: c.text2 }}>{n.reason}</Typography></Box>
                <Typography sx={{ fontWeight: 700, color: c.successText }}>−{money(n.amount)}</Typography>
              </Box>
            ))}
          </>
        )}
        {tab === 1 && card(payments.map((p) => (
          <Box key={p.number} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, p: 1.5 }}>
            <Box><Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{p.number}</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>{dayDate(p.date)} · {p.method} · {p.applied}</Typography></Box>
            <Typography sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(p.amount)}</Typography>
          </Box>
        )))}
        {tab === 2 && card(statements.map((s) => (
          <Box key={s.period} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: 1.5 }}>
            <Box><Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{s.period}</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>Charges {money(s.charges)} · Payments {money(s.payments)}</Typography><Typography sx={{ fontSize: 13, fontWeight: 600, mt: 0.25 }}>Closing {money(s.closing)}</Typography></Box>
            <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: '16px !important' }} />} onClick={() => download(`Statement ${s.period}`)} sx={{ color: c.navy }}>PDF</Button>
          </Box>
        )))}
        {tab === 3 && card(quotes.map((q) => (
          <Box key={q.number} sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}><Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>{q.number}</Typography><StatusChip status={q.status as 'Open' | 'Accepted'} /></Box>
            <Typography sx={{ fontSize: 13.5, mt: 0.25 }}>{q.title}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}><Typography sx={{ fontSize: 12.5, color: c.text3 }}>Valid to {dayDate(q.validTo)}</Typography><Typography sx={{ fontWeight: 700 }}>{money(q.amount)}</Typography></Box>
            {q.status === 'Open' && <Button fullWidth variant="outlined" color="secondary" sx={{ mt: 1.25 }} onClick={() => notify({ message: 'Quote accepted', detail: `${q.number} · your rep will confirm delivery` })}>Accept quote</Button>}
          </Box>
        )))}
      </Box>

      <Sheet open={!!paying} onClose={() => !busy && setPaying(null)} title={paying ? `Pay ${paying.number}` : ''}
        footer={<Button fullWidth variant="contained" size="large" disabled={busy} onClick={pay} startIcon={busy ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : undefined}>{busy ? 'Processing…' : `Pay ${paying ? money(paying.balance) : ''}`}</Button>}>
        {paying && (
          <>
            <Typography sx={{ fontSize: 14, color: c.text2 }}>{paying.status === 'Overdue' ? `Overdue since ${dayDate(paying.due)}. Paying now keeps your ${credit.terms} terms in good standing.` : `Due ${dayDate(paying.due)}.`}</Typography>
            <Typography sx={{ fontSize: 32, fontWeight: 800, my: 1.5 }}>{money(paying.balance)}</Typography>
            <Box role="radiogroup" aria-label="Pay with" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {([['card', CreditCardIcon, 'Visa •••• 4242', 'Instant · receipt by email'], ['eft', BankIcon, 'Bank transfer (EFT)', 'Clears in 1–2 business days']] as const).map(([k, Icon, t, s]) => (
                <Box key={k} component="button" role="radio" aria-checked={method === k} onClick={() => setMethod(k)}
                  sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: `${tokens.radius.md}px`, border: `${method === k ? 2 : 1}px solid ${method === k ? c.navy : c.line}`, ...focusRing }}>
                  <Icon sx={{ color: c.navy }} /><Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 600, fontSize: 14.5 }}>{t}</Typography><Typography sx={{ fontSize: 12.5, color: c.text3 }}>{s}</Typography></Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Sheet>
    </Box>
  )
}
