import { useEffect, type ReactNode } from 'react'
import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded'
import PlaylistAddRounded from '@mui/icons-material/PlaylistAddRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { tokens } from '../../theme'
import { productBySku, type Product } from '../../data/catalog'
import { AppStateProvider, useApp, type SavedList } from '../../state/AppState'
import { Container, EmptyState, NameForm, Panel, ToastCard } from '../../components/ui'
import { ProductCard, SaveToPanel } from '../../components/Commerce'
import { ListCard, ListRow, UnitOptions, type RowVariant } from '../../components/Lists'
import { PageTitle } from '../../components/Shared'
import { Demo, DemoGrid, LibSection } from './parts/LibraryParts'

const c = tokens.color
const P = (sku: string) => productBySku(sku) as Product
const noop = () => {}
const preview = (route: string) => `/review/preview?page=${encodeURIComponent(route)}`
const onlyFavourites: SavedList[] = [{ id: 'fav', name: 'Favourites', items: [] }]

/** Each specimen gets its own state, so adding to cart in one never changes another. */
function Scope({ children, lists, emptyCart }: { children: ReactNode; lists?: SavedList[]; emptyCart?: boolean }) {
  return <AppStateProvider initialLists={lists}>{emptyCart && <EmptyCart />}{children}</AppStateProvider>
}
function EmptyCart() {
  const { clearCart } = useApp()
  useEffect(() => clearCart(), [clearCart])
  return null
}

/** Favourites rows; `only` limits to one SKU for the state specimens. */
function Rows({ variant = 'A', only }: { variant?: RowVariant; only?: string }) {
  const fav = useApp().lists[0]
  return (
    <Panel sx={{ p: 0, overflow: 'hidden', containerType: 'inline-size' }}>
      {fav.items.filter((i) => !only || i.sku === only).map((i) => <ListRow key={i.sku} list={fav} item={i} variant={variant} />)}
    </Panel>
  )
}

function Phone({ children, sx }: { children: ReactNode; sx?: object }) {
  return <Box sx={{ width: 390, maxWidth: '100%', mx: 'auto', bgcolor: c.bg, border: `1px solid ${c.line}`, borderRadius: '28px', p: 2, ...sx }}>{children}</Box>
}

/** Static bottom sheet on a dimmed 390px screen. */
function SheetSpec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Phone sx={{ p: 0, pt: 14, overflow: 'hidden', bgcolor: 'rgba(17,24,39,.45)', border: 0 }}>
      <Box sx={{ bgcolor: '#fff', borderRadius: `${tokens.radius.lg}px ${tokens.radius.lg}px 0 0`, pb: 2 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: c.line2, mx: 'auto', pt: 0, mt: 1.25, mb: 0 }} />
        <Typography sx={{ px: 2.5, pt: 1.5, pb: 1, fontWeight: 700, fontSize: 15 }}>{title}</Typography>
        {children}
      </Box>
    </Phone>
  )
}

/** Static desktop popover / dropdown. */
function PopSpec({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Box sx={{ width: 300, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, boxShadow: tokens.shadow.pop, border: `1px solid ${c.line}`, pb: 1, pt: title ? 0 : 1 }}>
      {title && <Typography sx={{ px: 2.5, pt: 2, pb: 1, fontWeight: 700, fontSize: 15 }}>{title}</Typography>}
      {children}
    </Box>
  )
}

function DialogSpec({ title, placeholder }: { title: string; placeholder: string }) {
  return (
    <Paper elevation={12} sx={{ borderRadius: `${tokens.radius.lg}px`, maxWidth: 400, mx: 'auto' }}>
      <NameForm title={title} placeholder={placeholder} onCancel={noop} onSave={noop} autoFocus={false} />
    </Paper>
  )
}

function Open({ route, children }: { route: string; children: ReactNode }) {
  return (
    <Button component={RouterLink} to={preview(route)} size="small" endIcon={<OpenInNewRounded sx={{ fontSize: '16px !important' }} />} sx={{ color: c.navy, minHeight: 32, px: 1 }}>
      {children}
    </Button>
  )
}

export default function ListsBoard() {
  const favLists = useApp().lists
  return (
    <Container sx={{ pb: 8 }}>
      <PageTitle
        title="My Lists — design board"
        subtitle="Replaces Favourites. “Save your regular products once and reorder them quickly.” Every specimen below is live — tap Add, the bin, the unit chevron and the quantity number."
        crumbs={[{ label: 'Review', to: '/review/summary' }, { label: 'My Lists board' }]}
      />

      <Panel sx={{ mb: 5 }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Full pages at 390 px and 1440 px</Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          <Open route="/my-lists">All lists</Open>
          <Open route="/my-lists?list=fav">Favourites</Open>
          <Open route="/my-lists?open=create">Create new list</Open>
          <Open route="/my-lists?list=weekly&open=delete">Delete list</Open>
          <Open route="/my-lists?list=fav&open=replace">Replace or add to cart</Open>
          <Open route="/my-lists?list=fav&open=unit">Case / Each picker</Open>
          <Open route="/my-lists?list=fav&row=b">Rows · variant B</Open>
          <Open route="/my-lists?list=fav&open=added">Add all → snackbar</Open>
          <Open route="/my-lists?list=weekly">Long list + search</Open>
          <Open route="/my-lists?list=fav&empty=1">Favourites empty</Open>
          <Open route="/my-lists?list=weekly&empty=1">New list empty</Open>
          <Open route="/cart?open=save">Cart · save as list</Open>
        </Stack>
        <Typography sx={{ mt: 1.5, fontSize: 13.5, color: c.text2 }}>
          Navigation: “Favourites” is now <b>My Lists</b> in the header, account menu and account sidebar; the save icon is a heart everywhere.
          Below 800 px a bottom nav (Home · Shop · Cart · My Lists · More) is on every page except checkout — “More” opens the existing menu drawer.
        </Typography>
      </Panel>

      <LibSection id="variants" n={1} title="Row variants A and B" note={<>
        <b>A</b> — the stepper is the saved list quantity (what “Add all” uses) and a small <b>Add</b> adds that quantity; it then reads <b>✓ In cart</b>.{' '}
        <b>B</b> — the same rule as product cards: <b>Add</b> puts 1 in the cart, then becomes the cart stepper (− to 0 removes it). In both, tap the number to type a quantity.{' '}
        Row <b>Add</b> is an ink outline so “Add all to cart” stays the one filled button; rows switch to one line only when the list is 900px or wider, so tablets keep the full product name.
      </>}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          <Demo label="Variant A · 390 px" bg={c.surface2}><Scope><Phone><Rows variant="A" /></Phone></Scope></Demo>
          <Demo label="Variant B · 390 px" bg={c.surface2}><Scope><Phone><Rows variant="B" /></Phone></Scope></Demo>
        </Box>
        <Stack spacing={3} sx={{ mt: 3 }}>
          <Demo label="Variant A · desktop" bg={c.bg}><Scope><Rows variant="A" /></Scope></Demo>
          <Demo label="Variant B · desktop" bg={c.bg}><Scope><Rows variant="B" /></Scope></Demo>
        </Stack>
      </LibSection>

      <LibSection id="states" n={2} title="Row states" note="Each state is in the Favourites sample. “In stock” is never shown on a normal row; price increases show only the new price.">
        <Stack spacing={2}>
          {([
            ['Normal · sold as Case and Each (tap “Case”)', '400077'],
            ['Already in cart', '200118'],
            ['Low stock', '300542'],
            ['Out of stock — photo faded, price grey, Add disabled, alternatives', '500610'],
            ['Price drop', '100231'],
            ['Price increase — was $55.80 when saved; current price only, no badge', '200118', true],
          ] as [string, string, boolean?][]).map(([label, sku, emptyCart]) => (
            <Demo key={label} label={label} bg={c.bg} pad={1.5}><Scope emptyCart={emptyCart}><Rows only={sku} /></Scope></Demo>
          ))}
        </Stack>
      </LibSection>

      <LibSection id="unit" n={3} title="Case / Each picker" note="Case and Each are separate Magento SKUs; picking one swaps the SKU in the list and keeps the quantity.">
        <DemoGrid min={300}>
          <Demo label="Mobile · bottom sheet" bg={c.surface2}><SheetSpec title="Order by"><UnitOptions product={P('400077')} onPick={noop} /></SheetSpec></Demo>
          <Demo label="Desktop · popover" bg={c.surface2}><PopSpec title="Order by"><UnitOptions product={P('400077')} onPick={noop} /></PopSpec></Demo>
        </DemoGrid>
      </LibSection>

      <LibSection id="lists" n={4} title="All lists + create new list" note="No dropdown: My Lists opens on every list, one per line — its first products (“+N” for the rest), the count and the reorder total; photos sit on top on a phone and on the left from 560px. Tap a card to open the list; back returns here. Creating a list asks for a name only (duplicates refused). Custom lists get a ••• menu with “Delete list” (confirm first); Favourites can’t be deleted.">
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '420px minmax(0,1fr)' }, alignItems: 'start' }}>
          <Demo label="All lists · 390 px" bg={c.surface2}>
            <Phone><Stack spacing={1.5} sx={{ containerType: 'inline-size' }}>{favLists.map((l, k) => <ListCard key={l.id} list={l} fav={k === 0} />)}</Stack></Phone>
          </Demo>
          <Stack spacing={3}>
            <Demo label="All lists · desktop" bg={c.bg}>
              <Stack spacing={1.5} sx={{ containerType: 'inline-size' }}>
                {favLists.map((l, k) => <ListCard key={l.id} list={l} fav={k === 0} />)}
              </Stack>
            </Demo>
            <Demo label="Create new list dialog" bg={c.surface2}><DialogSpec title="Create new list" placeholder="e.g. Weekly Order" /></Demo>
          </Stack>
        </Box>
      </LibSection>

      <LibSection id="save-to" n={5} title="Save to list — product card and product page" note="Only Favourites: the heart saves instantly with the toast “Saved to Favourites”. Several lists: the heart still saves to Favourites straight away, and the snackbar at the bottom of the page says “Saved to Favourites · Change”; Change (or tapping a filled heart) opens the “Save to:” checklist. The product page uses the same heart.">
        <DemoGrid min={240}>
          <Demo label="Card · only Favourites (tap ♡)" bg={c.bg}><Scope lists={onlyFavourites}><ProductCard product={P('GR1001')} /></Scope></Demo>
          <Demo label="Card · several lists (tap ♡)" bg={c.bg}><Scope><ProductCard product={P('PR0101')} /></Scope></Demo>
          <Demo label="1. tap ♡ → bottom message" bg={c.surface2} sx={{ gridColumn: { sm: 'span 2' } }}>
            <ToastCard msg="Saved to Favourites" product={P('PR0101')} action={{ label: 'Change' }} onClose={noop} />
          </Demo>
          <Demo label="2. Change · desktop popover" bg={c.surface2}><Scope><PopSpec title="Save to:"><SaveToPanel sku="400077" onNew={noop} /></PopSpec></Scope></Demo>
          <Demo label="2. Change · mobile sheet" bg={c.surface2}><Scope><SheetSpec title="Save to:"><SaveToPanel sku="400077" onNew={noop} /></SheetSpec></Scope></Demo>
        </DemoGrid>
      </LibSection>

      <LibSection id="added" n={6} title="Bottom messages" note="One white card in the theme for every message: the product's photo with a status tick when it is about one product (otherwise a tinted status icon), a bold line, a grey second line, one red button and a close. “Add all” skips out-of-stock items and counts them; when the cart already has items it first asks whether to replace the cart with the list or add alongside. On mobile the card sits above the sticky “Add all” bar and the bottom nav.">
        <Demo label="Add all · add one · remove" bg={c.surface2}>
          <Stack spacing={1.5} alignItems="center">
            <ToastCard msg="4 items added to cart." detail="1 item was unavailable." action={{ label: 'View cart' }} onClose={noop} />
            <ToastCard msg="3 added to cart" product={P('200118')} action={{ label: 'View cart' }} onClose={noop} />
            <ToastCard msg="Removed from Favourites" severity="info" product={P('300542')} action={{ label: 'Undo' }} onClose={noop} />
          </Stack>
        </Demo>
      </LibSection>

      <LibSection id="cart" n={7} title="Cart additions" note="“Save cart as list” is a secondary button under the cart lines. “Update Weekly Order” appears only when the cart was filled from that list, and offers Undo.">
        <DemoGrid min={320}>
          <Demo label="Cart footer" bg={c.surface2}>
            <Panel sx={{ py: 1.5 }}>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Button variant="outlined" color="secondary" startIcon={<PlaylistAddRounded />}>Save cart as list</Button>
                <Button sx={{ color: c.navy }}>Update Weekly Order</Button>
              </Stack>
            </Panel>
          </Demo>
          <Demo label="Save cart as list dialog" bg={c.surface2}><DialogSpec title="Save cart as list" placeholder="e.g. Friday Restock" /></Demo>
        </DemoGrid>
      </LibSection>

      <LibSection id="empty" n={8} title="Empty states">
        <DemoGrid min={320}>
          <Demo label="Favourites empty" pad={0}>
            <EmptyState icon={<FavoriteBorderRounded />} title="Your list is empty" body="Tap the heart on any product to save it here." action="Browse products" href="/all-categories" />
          </Demo>
          <Demo label="New custom list empty" pad={0}>
            <EmptyState icon={<PlaylistAddRounded />} title="Weekly Order is empty" action="Add products" href="/all-categories"
              hint={<>You can also <Link component={RouterLink} to="/cart" sx={{ color: c.navy, fontWeight: 600 }}>save your cart as a list</Link>.</>} />
          </Demo>
        </DemoGrid>
      </LibSection>
    </Container>
  )
}
