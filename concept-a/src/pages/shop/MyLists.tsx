import { useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Link, Menu, MenuItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import PlaylistAddRounded from '@mui/icons-material/PlaylistAddRounded'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import LockOutlined from '@mui/icons-material/LockOutlined'
import { tokens } from '../../theme'
import { money, productBySku, recommended, type Product } from '../../data/catalog'
import { useApp, type ListItem } from '../../state/AppState'
import { Container, EmptyState, NameDialog, NewFeatureTag, Panel, Sheet } from '../../components/ui'
import { ProductCard } from '../../components/Commerce'
import { Breadcrumbs } from '../../components/Shared'
import { ListPickerPanel, ListRow, type RowVariant } from '../../components/Lists'

const c = tokens.color
const LONG_LIST = 6 // the search icon only appears above this many items

/**
 * My Lists — "Save your regular products once and reorder them quickly."
 * Review deep links: ?list=<id>  ?row=b  ?empty=1  ?open=lists|create|unit|added|delete|replace
 */
export default function MyLists() {
  const { lists, review, addToCart, clearCart, cartCount, priceFor, toast, createList, deleteList, setCartFromList } = useApp()
  const [params, setParams] = useSearchParams()
  // Review deep links (?open=…) apply once, when the page first loads.
  const [deep] = useState(() => params.get('open'))
  const variant: RowVariant = params.get('row') === 'b' ? 'B' : 'A'
  const list = lists.find((l) => l.id === params.get('list')) ?? lists[0]

  const selBtn = useRef<HTMLButtonElement>(null)
  const [selAnchor, setSelAnchor] = useState<HTMLElement | null>(null)
  const [creating, setCreating] = useState(deep === 'create')
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null)
  const [deleting, setDeleting] = useState(deep === 'delete')
  const [replacing, setReplacing] = useState(deep === 'replace')
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')
  useEffect(() => { if (deep === 'lists') setSelAnchor(selBtn.current) }, [deep])

  const items: ListItem[] = params.has('empty') || !list ? [] : list.items
  const rows = items.map((i) => ({ i, p: productBySku(i.sku) })).filter((r): r is { i: ListItem; p: Product } => !!r.p)
  const ready = rows.filter((r) => r.p.stock !== 'OUT_OF_STOCK')
  const total = ready.reduce((a, r) => a + priceFor(r.p) * r.i.qty, 0)
  const long = items.length > LONG_LIST
  const needle = q.trim().toLowerCase()
  const shown = needle ? rows.filter((r) => `${r.p.name} ${r.p.sku}`.toLowerCase().includes(needle)) : rows
  // Captured once so picking "Each" (a new SKU, a new row) doesn't reopen the picker.
  const [unitSku] = useState(() => (deep === 'unit' ? rows.find((r) => r.p.alt)?.p.sku : undefined))

  const pick = (id: string) => {
    setSelAnchor(null)
    setSearching(false)
    setQ('')
    setParams((p) => { p.set('list', id); p.delete('open'); p.delete('empty'); return p }, { replace: true })
  }
  /** Adds the list's in-stock items; `replace` empties the cart first so the list is ordered and invoiced on its own. */
  const addAll = (replace = false) => {
    if (!list) return
    setReplacing(false)
    if (replace) clearCart()
    ready.forEach((r) => addToCart(r.p.sku, r.i.qty, true))
    setCartFromList(list.id)
    const skipped = rows.length - ready.length
    const s = (n: number) => (n === 1 ? '' : 's')
    const unavailable = skipped ? `${skipped} item${s(skipped)} ${skipped === 1 ? 'was' : 'were'} unavailable.` : ''
    toast(replace ? `Cart replaced with ${list.name}.` : `${ready.length} item${s(ready.length)} added to cart.`, 'success', { label: 'View cart', href: '/cart' },
      { detail: unavailable || (replace ? undefined : list.name) })
  }
  // A cart that already has items asks first: replace it, or add the list alongside.
  const askAddAll = () => (cartCount ? setReplacing(true) : addAll())
  // ?open=added replays "Add all" once so the snackbar can be reviewed at both sizes.
  const replayed = useRef(false)
  useEffect(() => {
    if (deep !== 'added' || replayed.current || !review.signedIn) return
    const t = window.setTimeout(() => { replayed.current = true; addAll() }, 600)
    return () => window.clearTimeout(t)
  })

  if (!review.signedIn) {
    return (
      <Container>
        <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 }, pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>My Lists</Typography>
        <Panel sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) minmax(0,1fr)' }, gap: 4, alignItems: 'center', p: { xs: 3, md: 5 }, mb: 6 }}>
          <Box>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: c.redTint, color: c.red, display: 'grid', placeItems: 'center', mb: 2 }}><LockOutlined /></Box>
            <Typography variant="h2">Sign in to see your lists</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Save your regular products once and reorder them quickly — on the website, the app and with your rep.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" size="large" component={RouterLink} to="/account/signin">Sign in</Button>
              <Button variant="outlined" color="secondary" size="large" component={RouterLink} to="/account/signin?mode=create">Open a business account</Button>
            </Stack>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 1, opacity: 0.5, filter: 'blur(1px)', pointerEvents: 'none' }} aria-hidden>
            {recommended.slice(0, 3).map((p) => <ProductCard key={p.sku} product={p} variant="carousel" />)}
          </Box>
        </Panel>
      </Container>
    )
  }

  const addAllBtn = (
    <Button variant="contained" size="large" fullWidth startIcon={<AddShoppingCartRounded />} disabled={!ready.length} onClick={askAddAll}
      // The mobile bar is inset 80px each side for the voice + chat buttons, so the icon goes there to keep the total readable.
      sx={{ whiteSpace: 'nowrap', px: { xs: 1, md: 3 }, '& .MuiButton-startIcon': { display: { xs: 'none', md: 'inherit' } } }}>
      Add all to cart · {money(total)}
    </Button>
  )
  const fav = list?.id === lists[0]?.id
  // Beside the title on mobile (no room next to the selector), in the selector row on desktop.
  const tools = (
    <>
      {long && (
        <IconButton aria-label={searching ? 'Close search' : `Search ${list?.name}`} onClick={() => { setSearching(!searching); setQ('') }} sx={{ width: 44, height: 44, color: c.ink }}>
          {searching ? <CloseRounded /> : <SearchRounded />}
        </IconButton>
      )}
      {/* Favourites is where the heart saves, so it can't be deleted. */}
      {!fav && (
        <IconButton aria-label={`${list?.name} options`} aria-haspopup="menu" onClick={(e) => setMoreAnchor(e.currentTarget)} sx={{ width: 44, height: 44, color: c.ink }}>
          <MoreHorizRounded />
        </IconButton>
      )}
    </>
  )

  return (
    <Container>
      <Box sx={{ maxWidth: 1120, mx: 'auto', pb: { xs: rows.length ? 12 : 4, md: 6 } }}>
        <Box sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 2.5 } }}>
          <Breadcrumbs items={[{ label: 'My Lists' }]} sx={{ mb: 1.5, display: { xs: 'none', md: 'flex' } }} />
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={3}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" alignItems="center">
                <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 40 } }}>My Lists</Typography>
                <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto', mr: -1 }}>{tools}</Box>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.25 }}>
                <Button ref={selBtn} variant="outlined" color="inherit" endIcon={<KeyboardArrowDownRounded />} aria-haspopup="menu" aria-expanded={!!selAnchor}
                  onClick={(e) => setSelAnchor(e.currentTarget)} sx={{ borderColor: c.line2, fontWeight: 600, color: c.ink, bgcolor: '#fff', maxWidth: 220, '& .MuiButton-endIcon': { ml: 0.5 } }}>
                  <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list?.name}</Box>
                </Button>
                <Typography sx={{ fontSize: 14, color: c.text2, whiteSpace: 'nowrap' }}>{items.length} saved item{items.length === 1 ? '' : 's'}</Typography>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <NewFeatureTag label="Named lists" note="several named lists with saved quantities per customer (Magento Open Source has one wishlist)" />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto !important' }}>{tools}</Box>
              </Stack>
            </Box>
            {rows.length > 0 && <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>{addAllBtn}</Box>}
          </Stack>
          {searching && (
            <TextField autoFocus fullWidth size="small" placeholder={`Search ${list?.name} by name or SKU`} value={q} onChange={(e) => setQ(e.target.value)} sx={{ mt: 1.5 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ color: c.text3 }} /></InputAdornment>, sx: { minHeight: 44 } }} />
          )}
        </Box>

        {review.loading ? (
          <Panel sx={{ p: 0 }} aria-busy aria-label="Loading list">
            {[0, 1, 2, 3, 4].map((i) => (
              <Stack key={i} direction="row" spacing={1.5} alignItems="center" sx={{ p: 2, borderBottom: i < 4 ? `1px solid ${c.line}` : 0 }}>
                <Skeleton variant="rounded" width={60} height={60} />
                <Box sx={{ flex: 1 }}><Skeleton width="55%" /><Skeleton width="25%" /><Skeleton width="35%" /></Box>
                <Skeleton variant="rounded" width={180} height={40} sx={{ display: { xs: 'none', md: 'block' } }} />
              </Stack>
            ))}
          </Panel>
        ) : rows.length === 0 ? (
          <Panel>
            {fav ? (
              <EmptyState icon={<FavoriteBorderRounded />} title="Your list is empty" body="Tap the heart on any product to save it here." action="Browse products" href="/all-categories" />
            ) : (
              <EmptyState icon={<PlaylistAddRounded />} title={`${list?.name} is empty`} action="Add products" href="/all-categories"
                hint={<>You can also <Link component={RouterLink} to="/cart" sx={{ color: c.navy, fontWeight: 600 }}>save your cart as a list</Link>.</>} />
            )}
          </Panel>
        ) : (
          <Panel sx={{ p: 0, overflow: 'hidden', containerType: 'inline-size' }}>
            {shown.map((r) => <ListRow key={r.p.sku} list={list!} item={r.i} variant={variant} openUnit={r.p.sku === unitSku} />)}
            {shown.length === 0 && <Typography sx={{ p: 3, textAlign: 'center', color: c.text2 }}>No products in {list?.name} match “{q}”.</Typography>}
          </Panel>
        )}
      </Box>

      {/* Mobile sticky "Add all" — sits on the bottom nav, inset 80px each side to clear the voice + chat buttons */}
      {!review.loading && rows.length > 0 && (
        <Box sx={{ display: { md: 'none' }, position: 'fixed', left: 0, right: 0, bottom: 'var(--nav-h, 0px)', zIndex: 1140, bgcolor: '#fff', borderTop: `1px solid ${c.line}`, boxShadow: '0 -10px 30px -12px rgba(17,24,39,.25)', py: 1.25, px: '80px' }}>
          {addAllBtn}
        </Box>
      )}

      <Sheet anchor={selAnchor} open={!!selAnchor} onClose={() => setSelAnchor(null)} title="Your lists">
        {list && <ListPickerPanel lists={lists} current={list.id} onPick={pick} onCreate={() => { setSelAnchor(null); setCreating(true) }} />}
      </Sheet>
      <Menu anchorEl={moreAnchor} open={!!moreAnchor} onClose={() => setMoreAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={() => { setMoreAnchor(null); setDeleting(true) }} sx={{ color: c.error, gap: 1.25, minHeight: 44 }}>
          <DeleteOutlineRounded fontSize="small" /> Delete list
        </MenuItem>
      </Menu>
      <Dialog open={deleting && !fav} onClose={() => setDeleting(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete {list?.name}?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">The list and its {items.length} saved item{items.length === 1 ? '' : 's'} will be removed. Your cart won’t change. This can’t be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleting(false)} sx={{ color: c.text2 }}>Keep it</Button>
          <Button variant="contained" onClick={() => { setDeleting(false); pick(lists[0].id); deleteList(list!.id); toast(`${list!.name} deleted`, 'info') }}>Delete list</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={replacing && !!list} onClose={() => setReplacing(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Your cart already has {cartCount} item{cartCount === 1 ? '' : 's'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: c.text2 }}>
            Add <Box component="b" sx={{ color: c.ink }}>{list?.name}</Box> to {cartCount === 1 ? 'it' : 'them'}, or replace {cartCount === 1 ? 'it' : 'them'} with this list?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1.25, px: 3, pb: 2.5, pt: 1, '& > :not(style) ~ :not(style)': { ml: 0 } }}>
          <Button variant="contained" size="large" onClick={() => addAll(true)}>Replace cart items</Button>
          <Button variant="outlined" color="secondary" size="large" onClick={() => addAll()}>Keep items and add</Button>
          <Button onClick={() => setReplacing(false)} sx={{ color: c.text2 }}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <NameDialog open={creating} onClose={() => setCreating(false)} title="Create new list" placeholder="e.g. Weekly Order" taken={lists.map((l) => l.name)}
        onSave={(name) => pick(createList(name))} />
    </Container>
  )
}
