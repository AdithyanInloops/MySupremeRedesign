import { useMemo, useState } from 'react'
import { Box, Button, Chip, InputAdornment, MenuItem, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchRounded from '@mui/icons-material/SearchRounded'
import ReplayRounded from '@mui/icons-material/ReplayRounded'
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined'
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import LanguageRounded from '@mui/icons-material/LanguageRounded'
import { tokens } from '../../theme'
import { invoices, orders, type Order, type OrderStatus } from '../../data/account'
import { money, productBySku } from '../../data/catalog'
import { useApp } from '../../state/AppState'
import { EmptyState, Panel, StatusChip } from '../../components/ui'
import { DataTable, type Column } from '../../components/Shared'
import { fmtDate, itemCount } from './parts/AccountParts'

const c = tokens.color
const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'On the way', 'Delivered', 'Cancelled']

export function ChannelLabel({ channel }: { channel: Order['channel'] }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ fontSize: 13.5, color: c.text2 }}>
      {channel === 'Online' ? <LanguageRounded sx={{ fontSize: 16 }} /> : <StorefrontOutlined sx={{ fontSize: 16 }} />}
      <span>{channel === 'Online' ? 'Online' : 'Direct store'}</span>
    </Stack>
  )
}

export default function Orders() {
  const { review, addToCart, toast } = useApp()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const channel = params.get('channel') ?? 'all'
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const [q, setQ] = useState('')
  const [range, setRange] = useState('90')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })

  const base = review.empty ? [] : orders
  const byChannel = base.filter((o) => channel === 'all' || (channel === 'online' ? o.channel === 'Online' : o.channel === 'Direct store'))
  const counts = Object.fromEntries(statuses.map((s) => [s, byChannel.filter((o) => o.status === s).length]))

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    const r = byChannel
      .filter((o) => status === 'all' || o.status === status)
      .filter((o) => !t || o.number.includes(t) || o.items.some((i) => { const p = productBySku(i.sku); return i.sku.toLowerCase().includes(t) || p?.name.toLowerCase().includes(t) }))
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...r].sort((a, b) => (sort.key === 'total' ? (a.total - b.total) * dir : a.date.localeCompare(b.date) * dir))
  }, [byChannel, status, q, sort])

  const reorder = (o: Order) => o.items.forEach((i) => addToCart(i.sku, i.qty))
  const invoiceFor = (o: Order) => invoices.find((i) => i.order === o.number)?.number ?? `INV-${o.number.slice(-4)}`

  const columns: Column<Order>[] = [
    { key: 'number', label: 'Order #', render: (o) => <Typography sx={{ fontWeight: 700, fontSize: 14 }}>#{o.number}</Typography>, mobileHidden: true },
    { key: 'date', label: 'Date', sortable: true, render: (o) => fmtDate(o.date) },
    { key: 'channel', label: 'Channel', render: (o) => <ChannelLabel channel={o.channel} /> },
    {
      key: 'items', label: 'Items',
      render: (o) => (
        <Box sx={{ minWidth: 0, maxWidth: 260 }}>
          <Typography sx={{ fontSize: 13.5 }}>{itemCount(o)} items</Typography>
          <Typography sx={{ fontSize: 12, color: c.text3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {o.items.map((i) => productBySku(i.sku)?.brand).filter(Boolean).slice(0, 3).join(', ')}
          </Typography>
        </Box>
      ),
    },
    { key: 'total', label: 'Total', sortable: true, align: 'right', render: (o) => <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{money(o.total)}</Typography> },
    { key: 'status', label: 'Status', render: (o) => <StatusChip status={o.status} />, mobileHidden: true },
  ]

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} spacing={1}>
        <Box>
          <Typography variant="h2" component="h2">Orders</Typography>
          <Typography color="text.secondary">Online and cash &amp; carry (POS) orders in one place.</Typography>
        </Box>
      </Stack>

      <Panel sx={{ p: { xs: 1.5, md: 2 } }}>
        <Tabs
          value={channel}
          onChange={(_, v) => { const p = new URLSearchParams(params); if (v === 'all') { p.delete('channel') } else { p.set('channel', v) }; setParams(p) }}
          variant="scrollable"
          sx={{ borderBottom: `1px solid ${c.line}`, mb: 2, '& .MuiTab-root': { minHeight: 48 } }}
        >
          <Tab value="all" label={`All orders (${base.length})`} />
          <Tab value="online" icon={<LanguageRounded sx={{ fontSize: 18 }} />} iconPosition="start" label="Online" />
          <Tab value="store" icon={<StorefrontOutlined sx={{ fontSize: 18 }} />} iconPosition="start" label="Direct store" />
        </Tabs>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 1.5 }}>
          <TextField
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order #, product or SKU"
            size="small"
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment>, sx: { minHeight: 44 } }}
            sx={{ flex: 1 }}
            inputProps={{ 'aria-label': 'Search orders' }}
          />
          <TextField select size="small" value={range} onChange={(e) => setRange(e.target.value)} label="Date range" sx={{ minWidth: 190 }} InputProps={{ sx: { minHeight: 44 } }}>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last 12 months</MenuItem>
            <MenuItem value="all">All time</MenuItem>
          </TextField>
        </Stack>

        <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5 }} role="group" aria-label="Filter by status">
          <Chip label={`All ${byChannel.length}`} onClick={() => setStatus('all')} variant={status === 'all' ? 'filled' : 'outlined'}
            sx={{ height: 40, px: 0.5, ...(status === 'all' ? { bgcolor: c.navy, color: '#fff', '&:hover': { bgcolor: c.navyDark } } : { borderColor: c.line2 }) }} />
          {statuses.map((s) => (
            <Chip key={s} label={`${s} ${counts[s]}`} onClick={() => setStatus(s)} variant={status === s ? 'filled' : 'outlined'} aria-pressed={status === s}
              sx={{ height: 40, px: 0.5, flexShrink: 0, ...(status === s ? { bgcolor: c.navy, color: '#fff', '&:hover': { bgcolor: c.navyDark } } : { borderColor: c.line2 }) }} />
          ))}
        </Box>
      </Panel>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(o) => o.number}
        loading={review.loading}
        sort={sort}
        onSort={(k) => setSort((s) => ({ key: k, dir: s.key === k && s.dir === 'desc' ? 'asc' : 'desc' }))}
        onRowClick={(o) => nav(`/account/orders/${o.number}`)}
        mobileTitle={(o) => <>#{o.number}</>}
        mobileAside={(o) => <StatusChip status={o.status} />}
        actions={(o) => (
          <>
            <Button size="small" variant="outlined" color="secondary" startIcon={<ReplayRounded />} onClick={() => reorder(o)} sx={{ minHeight: 40 }}>
              Reorder
            </Button>
            <Button size="small" startIcon={<PictureAsPdfOutlined />} onClick={() => toast(`Invoice ${invoiceFor(o)} downloaded`)} disabled={o.status === 'Cancelled'} sx={{ minHeight: 40, color: c.navy }}>
              Invoice
            </Button>
          </>
        )}
        empty={
          <Panel>
            {base.length === 0 ? (
              <EmptyState icon={<ShoppingBagOutlined />} title="No orders yet" body="Place your first order online or at our Mississauga cash & carry — both show up here with invoices and one-tap reorder." action="Browse departments" href="/all-categories" />
            ) : (
              <EmptyState icon={<SearchRounded />} title="No orders match these filters" body="Try another status, channel or date range." action="Clear filters" onAction={() => { setStatus('all'); setQ(''); setParams({}) }} />
            )}
          </Panel>
        }
      />
      {!review.loading && rows.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>Showing {rows.length} of {byChannel.length} orders</Typography>
      )}
    </Stack>
  )
}
