import { useEffect, useRef, useState } from 'react'
import { Box, Button, ButtonBase, IconButton, Link, MenuItem, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CheckRounded from '@mui/icons-material/CheckRounded'
import FavoriteRounded from '@mui/icons-material/FavoriteRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded'
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded'
import { tokens } from '../theme'
import { money, packLine, productBySku, type Product } from '../data/catalog'
import { useApp, type ListItem, type SavedList } from '../state/AppState'
import { ProductImage } from './Brand'
import { QtyStepper } from './Commerce'
import { Sheet, Sku } from './ui'

const c = tokens.color
// Row "Add" is quiet (ink outline) so "Add all to cart" stays the one filled button on the page.
const rowAdd = { minHeight: 40, borderColor: c.line2, color: c.ink, bgcolor: '#fff', '&:hover': { borderColor: c.ink, bgcolor: c.surface2 }, '&.Mui-disabled': { borderColor: c.line, color: c.text3, bgcolor: 'transparent' } }

/** A: the stepper is the saved list quantity + a small Add. B: Add, then the stepper is the cart quantity (rest of the app). */
export type RowVariant = 'A' | 'B'

/* ------------------------------------------------------------------ List card (My Lists overview) */

/** One list on the overview: its first products (the 4th shows "+N" when there are more), name, count and reorder total; the whole card opens the list.
 *  Stacked (photos on top) in a narrow container; one row (photos left, total right) once the container is 560px+. The parent sets containerType. */
export function ListCard({ list, fav }: { list: SavedList; fav?: boolean }) {
  const { priceFor } = useApp()
  const products = list.items.map((i) => ({ i, p: productBySku(i.sku) })).filter((r): r is { i: ListItem; p: Product } => !!r.p)
  const total = products.filter((r) => r.p.stock !== 'OUT_OF_STOCK').reduce((a, r) => a + priceFor(r.p) * r.i.qty, 0)
  const n = list.items.length
  const more = n > 4 ? n - 3 : 0
  const count = n ? `${n} item${n === 1 ? '' : 's'}` : 'No items yet'
  const wide = '@container (min-width: 560px)'
  return (
    <Box component={RouterLink} to={`/my-lists?list=${list.id}`} aria-label={n ? `${list.name}, ${count}, ${money(total)}` : `${list.name}, ${count}`}
      sx={{
        display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', textDecoration: 'none', color: c.ink, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px`, overflow: 'hidden',
        transition: 'border-color .15s', '&:hover': { borderColor: c.text3 }, '&:hover .go': { color: c.ink, transform: 'translateX(2px)' },
        '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 },
        [wide]: { gridTemplateColumns: 'auto minmax(0,1fr)', alignItems: 'center' },
      }}>
      {/* Favourites gets the pale brand-red strip to match its heart; other lists sit on the page grey. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 1, p: 1.25, bgcolor: fav ? c.redTint : c.bg, [wide]: { gridTemplateColumns: 'repeat(4, 64px)', alignSelf: 'stretch', alignContent: 'center' } }}>
        {[0, 1, 2, 3].map((k) => {
          const r = products[k]
          return (
            <Box key={k} sx={{ position: 'relative' }}>
              {r ? <ProductImage src={r.p.images[0]} alt="" brand={r.p.brand} sx={{ bgcolor: '#fff' }} /> : <Box sx={{ aspectRatio: '1 / 1', borderRadius: `${tokens.radius.sm}px`, bgcolor: '#fff' }} />}
              {k === 3 && more > 0 && (
                <Box sx={{ position: 'absolute', inset: 0, borderRadius: `${tokens.radius.sm}px`, bgcolor: 'rgba(17,24,39,.6)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15 }}>+{more}</Box>
              )}
            </Box>
          )
        })}
      </Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ px: 2, py: 1.75, [wide]: { px: 2.5 } }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            {fav && <FavoriteRounded sx={{ fontSize: 18, color: c.red }} />}
            <Typography sx={{ fontWeight: 700, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{list.name}</Typography>
          </Stack>
          <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.25 }}>
            {count}
            {n > 0 && <Box component="span" sx={{ [wide]: { display: 'none' } }}> · {money(total)}</Box>}
          </Typography>
        </Box>
        {n > 0 && (
          <Box sx={{ display: 'none', textAlign: 'right', flexShrink: 0, [wide]: { display: 'block' } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 17, fontVariantNumeric: 'tabular-nums' }}>{money(total)}</Typography>
            <Typography sx={{ fontSize: 12.5, color: c.text3 }}>Reorder total</Typography>
          </Box>
        )}
        <ChevronRightRounded className="go" sx={{ color: c.text3, transition: 'transform .15s, color .15s' }} />
      </Stack>
    </Box>
  )
}

/* ------------------------------------------------------------------ Panels (used in sheets / popovers and on the review board) */

/** Case / Each choice for a product sold both ways. Each unit is its own SKU, so picking swaps the SKU in the list. */
export function UnitOptions({ product, onPick }: { product: Product; onPick: (sku: string) => void }) {
  const { priceFor } = useApp()
  const alt = product.alt ? productBySku(product.alt) : undefined
  const opts = [product, alt].filter((x): x is Product => !!x).sort((a) => (a.uom === 'Case' ? -1 : 1))
  return (
    <Box role="menu" aria-label="Choose unit">
      {opts.map((o) => (
        <MenuItem key={o.sku} role="menuitemradio" aria-checked={o.sku === product.sku} onClick={() => onPick(o.sku)} sx={{ minHeight: 48, px: 2, gap: 1 }}>
          <Box sx={{ width: 22, display: 'grid', color: c.red }}>{o.sku === product.sku && <CheckRounded sx={{ fontSize: 20 }} />}</Box>
          <Box component="span" sx={{ flex: 1, fontSize: 14.5, fontWeight: o.sku === product.sku ? 700 : 500, pr: 3 }}>{packLine(o)}</Box>
          <Box component="span" sx={{ fontSize: 14.5, fontWeight: 700 }}>{money(priceFor(o))}</Box>
        </MenuItem>
      ))}
    </Box>
  )
}

/* ------------------------------------------------------------------ Row */

const badge = (fg: string, bg: string) => ({
  display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: `${tokens.radius.pill}px`, bgcolor: bg, color: fg, fontSize: 11.5, fontWeight: 700, lineHeight: 1.5, whiteSpace: 'nowrap',
})

/**
 * One saved product. Layout follows the width of its container (not the window), so the review board can show the
 * phone row and the desktop row side by side. Wrap rows in a box with `containerType: 'inline-size'`.
 */
export function ListRow({ list, item, variant = 'A', openUnit = false }: { list: SavedList; item: ListItem; variant?: RowVariant; openUnit?: boolean }) {
  const { cart, addToCart, setQty, removeFromCart, updateList, priceFor, toast } = useApp()
  const [unitAnchor, setUnitAnchor] = useState<HTMLElement | null>(null)
  const unitBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (openUnit) setUnitAnchor(unitBtn.current) }, [openUnit])

  const p = productBySku(item.sku)
  if (!p) return null
  const href = `/p/${p.slug}`
  const oos = p.stock === 'OUT_OF_STOCK'
  const line = cart.find((l) => l.sku === p.sku)
  const label = `${p.name}, ${packLine(p)}`

  const setListQty = (qty: number) => updateList(list.id, (items) => items.map((i) => (i.sku === p.sku ? { ...i, qty } : i)))
  const swapUnit = (sku: string) => {
    setUnitAnchor(null)
    // Swap in place; drop a duplicate if the other unit was already saved.
    updateList(list.id, (items) => items.map((i) => (i.sku === p.sku ? { ...i, sku } : i)).filter((i, idx, all) => all.findIndex((x) => x.sku === i.sku) === idx))
  }
  const remove = () => {
    const at = list.items.findIndex((i) => i.sku === p.sku)
    updateList(list.id, (items) => items.filter((i) => i.sku !== p.sku))
    toast(`Removed from ${list.name}`, 'info', { label: 'Undo', onClick: () => updateList(list.id, (items) => [...items.slice(0, at), item, ...items.slice(at)]) }, { sku: p.sku })
  }

  const unit = p.alt ? (
    <ButtonBase ref={unitBtn} onClick={(e) => setUnitAnchor(e.currentTarget)} aria-haspopup="menu" aria-label={`Unit: ${p.uom}. Change to Case or Each`}
      sx={{ fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 600, color: c.navy, borderRadius: `${tokens.radius.xs}px`, px: 0.5, mx: -0.5, py: 0.25, '&:hover': { bgcolor: c.navyTint } }}>
      {p.uom}<KeyboardArrowDownRounded sx={{ fontSize: 18, ml: -0.125 }} />
    </ButtonBase>
  ) : p.uom && <Box component="span" sx={{ fontWeight: 600, color: c.ink }}>{p.uom}</Box>

  const controls = variant === 'A' ? (
    <Stack direction="row" spacing={1} alignItems="center">
      <QtyStepper value={item.qty} onChange={setListQty} size="sm" typeIn label={`List quantity for ${p.name}`} />
      {line ? (
        <Button component={RouterLink} to="/cart" startIcon={<CheckRounded />} aria-label={`${p.name} is in your cart. View cart`}
          sx={{ minHeight: 40, px: 1.25, bgcolor: c.successTint, color: c.successText, whiteSpace: 'nowrap', '& .MuiButton-startIcon': { mr: 0.5 }, '&:hover': { bgcolor: '#D4EFDD' } }}>
          In cart
        </Button>
      ) : (
        <Button variant="outlined" color="inherit" disabled={oos} onClick={() => addToCart(p.sku, item.qty)} aria-label={`Add ${item.qty} ${p.name} to cart`}
          sx={{ ...rowAdd, minWidth: 64, px: 2 }}>
          Add
        </Button>
      )}
    </Stack>
  ) : line ? (
    <QtyStepper value={line.qty} min={0} onChange={(v) => (v < 1 ? removeFromCart(p.sku) : setQty(p.sku, v))} size="sm" typeIn label={`Cart quantity for ${p.name}`} />
  ) : (
    <Button variant="outlined" color="inherit" disabled={oos} onClick={() => addToCart(p.sku, 1)} aria-label={`Add 1 ${p.name} to cart`}
      sx={{ ...rowAdd, minWidth: 121 }}>
      Add
    </Button>
  )

  const dim = oos ? { opacity: 0.5 } : {}
  return (
    <Box
      component="article"
      aria-label={label}
      sx={{
        display: 'grid', columnGap: 1.5, rowGap: 1.25, alignItems: 'center', px: 1.5, py: 1.5,
        gridTemplateColumns: '56px minmax(0,1fr) auto auto',
        gridTemplateAreas: '"img info info acts" "price price ctl ctl"',
        borderBottom: `1px solid ${c.line}`, '&:last-of-type': { borderBottom: 0 },
        bgcolor: oos ? c.bg : '#fff',
        '@container (min-width: 900px)': {
          columnGap: 2.5, px: 2.5, py: 1.75,
          // Fixed controls column (stepper + "In cart") so prices and steppers line up row to row.
          gridTemplateColumns: '64px minmax(0,1fr) 150px 224px auto',
          gridTemplateAreas: '"img info price ctl acts"',
        },
      }}
    >
      <Box component={RouterLink} to={href} tabIndex={-1} aria-hidden sx={{ gridArea: 'img', alignSelf: 'start', display: 'block', ...dim, '@container (min-width: 900px)': { alignSelf: 'center' } }}>
        <ProductImage src={p.images[0]} alt="" brand={p.brand} />
      </Box>

      <Box sx={{ gridArea: 'info', minWidth: 0, alignSelf: 'start', '@container (min-width: 900px)': { alignSelf: 'center' } }}>
        <Link component={RouterLink} to={href} underline="hover" title={p.name}
          sx={{ color: c.ink, fontWeight: 600, fontSize: 14.5, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.name}
        </Link>
        <Sku sku={p.sku} sx={{ mt: 0.25 }} />
        <Typography component="div" sx={{ fontSize: 13, color: c.text2, mt: 0.25, display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 0.5 }}>
          {unit}{p.uom && <span>·</span>}<span>{p.pack}</span>
        </Typography>
        {(p.stock !== 'IN_STOCK') && (
          <Stack direction="row" columnGap={1.25} rowGap={0.5} flexWrap="wrap" alignItems="center" sx={{ mt: 0.75, '& a': { whiteSpace: 'nowrap' } }}>
            {p.stock === 'LOW_STOCK' && <Box sx={badge(c.warning, c.warningTint)}>Low stock{p.left ? ` · ${p.left} left` : ''}</Box>}
            {oos && <Box sx={badge(c.error, c.errorTint)}>Out of stock</Box>}
            {/* shortcut: alternatives = search on the first two words of the name; swap for Magento related products in the build. */}
            {oos && <Link component={RouterLink} to={`/search/${encodeURIComponent(p.name.split(' ').slice(0, 2).join(' '))}`} sx={{ fontSize: 13, fontWeight: 600, color: c.navy }}>See alternatives</Link>}
          </Stack>
        )}
      </Box>

      <Box sx={{ gridArea: 'price', minWidth: 0 }}>
        <Stack direction="row" alignItems="baseline" columnGap={0.75} flexWrap="wrap">
          <Typography component="span" sx={{ fontSize: 16, fontWeight: 700, color: oos ? c.text3 : p.regular ? c.red : c.ink, whiteSpace: 'nowrap' }}>
            {money(priceFor(p))}
            {p.uom && <Box component="span" sx={{ fontSize: 12.5, fontWeight: 500, color: c.text3 }}> / {p.uom}</Box>}
          </Typography>
          {p.regular && (
            <Typography component="span" sx={{ fontSize: 12.5, color: c.text3, textDecoration: 'line-through' }} aria-label={`Was ${money(p.regular)}`}>{money(p.regular)}</Typography>
          )}
        </Stack>
      </Box>

      <Box sx={{ gridArea: 'ctl', justifySelf: 'end', '@container (min-width: 900px)': { justifySelf: 'start' } }}>{controls}</Box>

      {/* One remove control per row; the snackbar offers Undo. */}
      <IconButton aria-label={`Remove ${p.name} from ${list.name}`} title="Remove from list" onClick={remove}
        sx={{ gridArea: 'acts', alignSelf: 'start', mr: -1, mt: -0.75, width: 40, height: 40, color: c.text3, '&:hover': { color: c.error, bgcolor: c.errorTint }, '@container (min-width: 900px)': { alignSelf: 'center', m: 0 } }}>
        <DeleteOutlineRounded sx={{ fontSize: 20 }} />
      </IconButton>

      {p.alt && (
        <Sheet anchor={unitAnchor} open={!!unitAnchor} onClose={() => setUnitAnchor(null)} title="Order by">
          <UnitOptions product={p} onPick={swapUnit} />
        </Sheet>
      )}
    </Box>
  )
}
