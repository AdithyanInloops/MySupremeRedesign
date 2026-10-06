import { useState } from 'react'
import { Alert, Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import RequestQuoteOutlined from '@mui/icons-material/RequestQuoteOutlined'
import AssignmentReturnOutlined from '@mui/icons-material/AssignmentReturnOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ShoppingCartCheckoutRounded from '@mui/icons-material/ShoppingCartCheckoutRounded'
import AddRounded from '@mui/icons-material/AddRounded'
import { tokens } from '../../theme'
import { credit, creditNotes, invoices, payments, quotes, statements } from '../../data/account'
import { money } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { EmptyState, Panel, StatusChip, type StatusKind } from '../../components/ui'
import { DataTable, type Column } from '../../components/Shared'
import { CreditDonut, Kpi, Legend, PanelSkeleton, fmtDate } from './parts/AccountParts'

const c = tokens.color

const tabs = [
  { id: 'invoices', label: 'Invoices & bills', icon: <ReceiptLongOutlined /> },
  { id: 'quotes', label: 'Quotes & estimates', icon: <RequestQuoteOutlined /> },
  { id: 'payments', label: 'Payments', icon: <PaymentsOutlined /> },
  { id: 'credit-notes', label: 'Credit notes', icon: <AssignmentReturnOutlined /> },
  { id: 'statement', label: 'Account statement', icon: <DescriptionOutlined /> },
]

type Inv = (typeof invoices)[number]
type Quote = (typeof quotes)[number]
type Pay = (typeof payments)[number]
type CN = (typeof creditNotes)[number]
type St = (typeof statements)[number]

const strong = (v: string, col?: string) => <Typography component="span" sx={{ fontWeight: 700, fontSize: 14, color: col }}>{v}</Typography>

export default function Credit() {
  const { tab = 'invoices' } = useParams()
  const nav = useNavigate()
  const { review, toast } = useApp()
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'due', dir: 'asc' })
  const pdf = (n: string) => <Button size="small" startIcon={<PictureAsPdfOutlined />} onClick={() => toast(`${n} downloaded as PDF`)} sx={{ color: c.navy, minHeight: 40 }}>PDF</Button>
  const e = review.empty
  const usedPct = Math.round(((credit.limit - credit.available) / credit.limit) * 100)

  const invRows = (e ? [] : invoices).slice().sort((a, b) => {
    const d = sort.dir === 'asc' ? 1 : -1
    if (sort.key === 'amount') return (a.balance - b.balance) * d
    return a.due.localeCompare(b.due) * d
  })

  const invCols: Column<Inv>[] = [
    { key: 'number', label: 'Invoice', render: (i) => strong(i.number), mobileHidden: true },
    { key: 'date', label: 'Issued', render: (i) => fmtDate(i.date) },
    { key: 'due', label: 'Due', sortable: true, render: (i) => <Box component="span" sx={{ color: i.status === 'Overdue' ? c.error : 'inherit', fontWeight: i.status === 'Overdue' ? 700 : 400 }}>{fmtDate(i.due)}</Box> },
    { key: 'order', label: 'Order', render: (i) => `#${i.order}` },
    { key: 'amount', label: 'Balance', align: 'right', sortable: true, render: (i) => <Box>{strong(money(i.balance))}<Typography sx={{ fontSize: 11.5, color: c.text3 }}>of {money(i.amount)}</Typography></Box> },
    { key: 'status', label: 'Status', render: (i) => <StatusChip status={i.status} />, mobileHidden: true },
  ]
  const quoteCols: Column<Quote>[] = [
    { key: 'number', label: 'Quote', render: (q) => strong(q.number), mobileHidden: true },
    { key: 'title', label: 'For', render: (q) => q.title },
    { key: 'date', label: 'Created', render: (q) => fmtDate(q.date) },
    { key: 'valid', label: 'Valid to', render: (q) => fmtDate(q.validTo) },
    { key: 'amount', label: 'Amount', align: 'right', render: (q) => strong(money(q.amount)) },
    { key: 'status', label: 'Status', render: (q) => <StatusChip status={q.status as StatusKind} />, mobileHidden: true },
  ]
  const payCols: Column<Pay>[] = [
    { key: 'number', label: 'Payment', render: (p) => strong(p.number), mobileHidden: true },
    { key: 'date', label: 'Date', render: (p) => fmtDate(p.date) },
    { key: 'method', label: 'Method', render: (p) => p.method },
    { key: 'applied', label: 'Applied to', render: (p) => p.applied },
    { key: 'amount', label: 'Amount', align: 'right', render: (p) => strong(money(p.amount), c.successText) },
  ]
  const cnCols: Column<CN>[] = [
    { key: 'number', label: 'Credit note', render: (n) => strong(n.number), mobileHidden: true },
    { key: 'date', label: 'Date', render: (n) => fmtDate(n.date) },
    { key: 'reason', label: 'Reason', render: (n) => n.reason },
    { key: 'amount', label: 'Amount', align: 'right', render: (n) => strong(money(n.amount)) },
    { key: 'status', label: 'Status', render: (n) => <StatusChip status={n.status as StatusKind} />, mobileHidden: true },
  ]
  const stCols: Column<St>[] = [
    { key: 'period', label: 'Period', render: (s) => strong(s.period), mobileHidden: true },
    { key: 'opening', label: 'Opening', align: 'right', render: (s) => money(s.opening) },
    { key: 'charges', label: 'Charges', align: 'right', render: (s) => money(s.charges) },
    { key: 'payments', label: 'Payments', align: 'right', render: (s) => `−${money(s.payments)}` },
    { key: 'closing', label: 'Closing balance', align: 'right', render: (s) => strong(money(s.closing)) },
  ]

  const emptyFor = (icon: React.ReactNode, title: string, body: string, action?: string, href?: string) => (
    <Panel><EmptyState icon={icon} title={title} body={body} action={action} href={href} /></Panel>
  )

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h2" component="h2">Credit &amp; billing</Typography>
        <Typography color="text.secondary">Your MySupreme trade account — limit, balances, invoices and statements.</Typography>
      </Box>

      {review.loading ? <PanelSkeleton h={190} /> : (
        <Panel>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'auto 1fr' }, gap: { xs: 2.5, lg: 4 }, alignItems: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              <CreditDonut />
              <Stack spacing={1} sx={{ minWidth: 220, width: { xs: '100%', sm: 'auto' } }}>
                <Legend color={c.successText} label="Available" value={money(credit.available)} />
                <Legend color={c.navy} label="Used — not yet due" value={money(credit.outstanding - credit.overdue)} />
                <Legend color={c.error} label="Overdue" value={money(credit.overdue)} />
                <Typography sx={{ fontSize: 12, color: c.text3, pt: 0.5 }}>{usedPct}% of your limit is in use</Typography>
              </Stack>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.25 }}>
              <Kpi label="Credit limit" value={money(credit.limit)} />
              <Kpi label="Available" value={money(credit.available)} tone="success" />
              <Kpi label="Outstanding" value={money(credit.outstanding)} />
              <Kpi label="Due" value={money(credit.due)} hint="Within 30 days" />
              <Kpi label="Overdue" value={money(credit.overdue)} tone="error" action={<Button size="small" variant="contained" sx={{ minHeight: 36 }} onClick={() => toast('Redirecting to secure payment…', 'info')}>Pay now</Button>} />
              <Kpi label="Payment terms" value={credit.terms} hint="Invoice date + 30 days" />
            </Box>
          </Box>
          <Alert severity="warning" sx={{ mt: 2.5, borderRadius: `${tokens.radius.sm}px` }}>
            <b>INV-2041</b> ({money(709.4)}) is 9 days overdue. Pay it to keep next-day delivery and your full credit limit available.
          </Alert>
        </Panel>
      )}

      <Box>
        <Tabs
          value={tabs.some((t) => t.id === tab) ? tab : 'invoices'}
          onChange={(_, v) => nav(`/account/customerdashbord/${v}`)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 2, borderBottom: `1px solid ${c.line}`, '& .MuiTab-root': { minHeight: 48 } }}
        >
          {tabs.map((t) => <Tab key={t.id} value={t.id} label={t.label} icon={t.icon} iconPosition="start" />)}
        </Tabs>

        {tab === 'invoices' && (
          <DataTable columns={invCols} rows={invRows} rowKey={(i) => i.number} loading={review.loading}
            sort={sort} onSort={(k) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))}
            mobileTitle={(i) => i.number} mobileAside={(i) => <StatusChip status={i.status} />}
            actions={(i) => (<>{i.balance > 0 && <Button size="small" variant="contained" sx={{ minHeight: 40 }} onClick={() => toast(`Paying ${i.number} — ${money(i.balance)}`, 'info')}>Pay</Button>}{pdf(i.number)}</>)}
            empty={emptyFor(<ReceiptLongOutlined />, 'No invoices yet', 'Invoices appear here when an order is delivered or picked up. You can pay them online or at the warehouse.', 'View orders', '/account/orders')} />
        )}
        {tab === 'quotes' && (
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="outlined" color="secondary" startIcon={<AddRounded />} onClick={() => toast('Quote request sent — your rep will reply within 1 business day')}>Request a quote</Button>
            </Stack>
            <DataTable columns={quoteCols} rows={e ? [] : quotes} rowKey={(q) => q.number} loading={review.loading}
              mobileTitle={(q) => q.number} mobileAside={(q) => <StatusChip status={q.status as StatusKind} />}
              actions={(q) => (<>{q.status === 'Open' && <Button size="small" variant="contained" startIcon={<ShoppingCartCheckoutRounded />} sx={{ minHeight: 40 }} onClick={() => toast(`${q.number} converted to an order`)}>Convert to order</Button>}{pdf(q.number)}</>)}
              empty={emptyFor(<RequestQuoteOutlined />, 'No quotes yet', 'Planning a big event or a new menu? Ask for a quote and lock in volume pricing.')} />
          </Stack>
        )}
        {tab === 'payments' && (
          <DataTable columns={payCols} rows={e ? [] : payments} rowKey={(p) => p.number} loading={review.loading}
            mobileTitle={(p) => p.number} mobileAside={(p) => <Typography sx={{ fontWeight: 700, color: c.successText }}>{money(p.amount)}</Typography>}
            actions={(p) => pdf(`Receipt ${p.number}`)}
            empty={emptyFor(<PaymentsOutlined />, 'No payments recorded', 'Card, EFT and in-store payments against your invoices will be listed here.', 'See invoices', '/account/customerdashbord/invoices')} />
        )}
        {tab === 'credit-notes' && (
          <DataTable columns={cnCols} rows={e ? [] : creditNotes} rowKey={(n) => n.number} loading={review.loading}
            mobileTitle={(n) => n.number} mobileAside={(n) => <StatusChip status={n.status as StatusKind} />}
            actions={(n) => pdf(n.number)}
            empty={emptyFor(<AssignmentReturnOutlined />, 'No credit notes', 'If anything arrives damaged or short, report it within 24 hours and the credit shows up here.')} />
        )}
        {tab === 'statement' && (
          <DataTable columns={stCols} rows={e ? [] : statements} rowKey={(s) => s.period} loading={review.loading}
            mobileTitle={(s) => s.period} mobileAside={(s) => <Typography sx={{ fontWeight: 700 }}>{money(s.closing)}</Typography>}
            actions={(s) => pdf(`Statement ${s.period}`)}
            empty={emptyFor(<DescriptionOutlined />, 'No statements yet', 'Monthly statements are generated on the 1st of each month once you have account activity.')} />
        )}
      </Box>
    </Stack>
  )
}
