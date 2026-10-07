import { createContext, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, InputBase, Tab, Tabs, Typography } from '@mui/material'
import { finalPrice, inStock, money, packSize, products as allProducts, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { colors, mono, motion, radius } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import QuantityStepper from '../ui/QuantityStepper'
import { PackChip } from '../ui/ProductMeta'
import { AlertCircleIcon, BoltIcon, CheckCircleIcon, CloseIcon, ListPlusIcon } from '../ui/icons'

/*
 * Quick order — for buyers who know their SKUs. Front-end only: product lookup by SKU + addProductsToCart.
 * Used by the home "Quick order" section and by the header dialog (available on every page).
 */

/** Production: last order for signed-in buyers, Algolia trending for guests. */
export const POPULAR_SKUS = ['HD0031', 'RM', '59620000008478349', 'CH0043', 'FP0020']

const findBySku = (list: Product[], q: string) => {
  const t = q.trim().toLowerCase()
  if (!t) return { match: undefined, partial: [] as Product[] }
  const exact = list.find((p) => p.sku.toLowerCase() === t)
  const partial = exact ? [] : list.filter((p) => p.sku.toLowerCase().startsWith(t)).slice(0, 3)
  return { match: exact ?? (partial.length === 1 ? partial[0] : undefined), partial: partial.length > 1 ? partial : [] }
}

export function QuickOrderForm({ products = allProducts, popularSkus = POPULAR_SKUS, layout = 'wide', onPaste }: { products?: Product[]; popularSkus?: string[]; layout?: 'wide' | 'stacked'; onPaste?: () => void }) {
  const { add } = useCart()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [last, setLast] = useState<{ name: string; qty: number } | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const uid = useId().replace(/:/g, '')

  const { match, partial } = findBySku(products, sku)
  const notFound = sku.trim().length >= 2 && !match && !partial.length
  const popular = popularSkus.map((s) => products.find((p) => p.sku === s)).filter(Boolean) as Product[]

  const soldOut = !!match && !inStock(match)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match || soldOut) return input.current?.focus()
    add(match.sku, qty)
    setLast({ name: match.name, qty })
    setSku('')
    setQty(1)
    // Straight back to the SKU field for the next line of the order sheet.
    input.current?.focus()
  }
  const wide = layout === 'wide'

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: wide ? { xs: 'wrap', sm: 'nowrap' } : 'wrap' }}>
        <Box
          sx={{
            flex: 1, minWidth: wide ? { xs: '100%', sm: 0 } : '100%', display: 'flex', alignItems: 'center', height: 46, px: 1.5, gap: 1, bgcolor: '#fff', borderRadius: radius.md,
            border: `1px solid ${notFound ? colors.error : colors.line2}`, transition: `border-color ${motion.fast}, box-shadow ${motion.fast}`,
            '&:focus-within': { borderColor: notFound ? colors.error : colors.navy, boxShadow: `0 0 0 3px ${notFound ? colors.errorTint : colors.navyTint}` },
          }}
        >
          <Typography component="label" htmlFor={`qo-sku-${uid}`} sx={{ fontSize: 12, fontWeight: 700, color: colors.ink500, letterSpacing: '.06em' }}>SKU</Typography>
          <InputBase
            id={`qo-sku-${uid}`}
            inputRef={input}
            value={sku}
            onChange={(e) => { setSku(e.target.value); setLast(null) }}
            placeholder="e.g. HD0031 or a 17-digit barcode"
            inputProps={{ 'aria-describedby': `qo-status-${uid}`, autoComplete: 'off', spellCheck: false, 'aria-invalid': notFound }}
            sx={{ flex: 1, minWidth: 0, fontSize: 15, fontFamily: mono, '& input::placeholder': { fontFamily: 'Poppins, sans-serif', color: colors.ink500, opacity: 1 } }}
          />
        </Box>
        <QuantityStepper value={qty} onChange={setQty} label="Quick order quantity" />
        <Button type="submit" variant="contained" disabled={!match || soldOut} sx={{ height: 46, px: 2.5, flex: wide ? { xs: 1, sm: '0 0 auto' } : 1 }}>
          {soldOut ? 'Out of stock' : match ? `Add ${qty} to cart` : 'Add to cart'}
        </Button>
      </Box>

      <Box id={`qo-status-${uid}`} role="status" aria-live="polite" sx={{ mt: 1.25, minHeight: 44 }}>
        {match ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, pr: 1.5, bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.md }}>
            <Box sx={{ width: 44, flexShrink: 0, borderRadius: radius.xs, overflow: 'hidden', border: `1px solid ${colors.sunken}` }}><ProductImage product={match} caption={false} alt="" /></Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography title={match.name} sx={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25, minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, color: colors.ink500, fontFamily: mono, whiteSpace: 'nowrap' }}>{match.sku}</Typography>
                <Box sx={{ minWidth: 0 }}><PackChip product={match} /></Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              {soldOut ? (
                <Typography sx={{ fontWeight: 600, fontSize: 13, color: colors.warning }}>Out of stock</Typography>
              ) : (
                <>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{money(finalPrice(match) * qty)}</Typography>
                  <Typography sx={{ fontSize: 12, color: colors.ink500 }}>{money(finalPrice(match))} each</Typography>
                </>
              )}
            </Box>
          </Box>
        ) : partial.length ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, color: colors.ink600 }}>Did you mean:</Typography>
            {partial.map((p) => <SkuChip key={p.sku} product={p} onPick={() => setSku(p.sku)} />)}
          </Box>
        ) : notFound ? (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1.25, bgcolor: colors.errorTint, borderRadius: radius.md, color: '#7F1D1D' }}>
            <AlertCircleIcon sx={{ fontSize: 20, color: colors.error, mt: '1px' }} />
            <Typography sx={{ fontSize: 13.5 }}>
              No product has SKU “{sku.trim()}”. Check the code on your invoice, or{' '}
              <Link href={`/search/${encodeURIComponent(sku.trim())}`} style={{ color: colors.redText, fontWeight: 600 }}>search for it instead</Link>.
            </Typography>
          </Box>
        ) : last ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: colors.success }}>
            <CheckCircleIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 13.5, color: colors.ink700 }}><b>{last.qty} × {last.name}</b> added. Enter the next SKU.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: colors.ink600, mr: 0.25 }}>Popular:</Typography>
            {popular.map((p) => <SkuChip key={p.sku} product={p} onPick={() => { setSku(p.sku); input.current?.focus() }} />)}
            {onPaste && (
              <Button size="small" startIcon={<ListPlusIcon />} onClick={onPaste} sx={{ ml: { md: 'auto' }, color: colors.redText }}>Paste a list instead</Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function SkuChip({ product, onPick }: { product: Product; onPick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onPick}
      title={product.name}
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 32, px: 1.25, borderRadius: radius.pill, border: `1px solid ${colors.line2}`, bgcolor: '#fff',
        cursor: 'pointer', font: 'inherit', maxWidth: 240, transition: `border-color ${motion.fast}, background-color ${motion.fast}`,
        '&:hover': { borderColor: colors.ink400, bgcolor: colors.subtle },
      }}
    >
      <Box component="span" sx={{ fontSize: 12.5, fontWeight: 600, fontFamily: mono, color: colors.ink, whiteSpace: 'nowrap' }}>{product.sku}</Box>
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: 12.5, color: colors.ink600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.brand_label ?? product.name}</Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Paste a list */

const SAMPLE = 'HD0031, 4\nRM x2\n59620000008478349 6\nXY12345'

export function PasteList({ products = allProducts, onDone }: { products?: Product[]; onDone?: () => void }) {
  const { addMany } = useCart()
  const [text, setText] = useState('')
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [code, q] = l.split(/[\s,x×]+/i)
      const p = products.find((x) => x.sku.toLowerCase() === code.toLowerCase())
      return { code, qty: Math.max(1, Math.min(999, parseInt(q ?? '1', 10) || 1)), p }
    })
  const ok = lines.filter((l) => l.p && inStock(l.p))
  const bad = lines.length - ok.length
  const total = ok.reduce((a, l) => a + finalPrice(l.p!) * l.qty, 0)

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
        <Typography component="label" htmlFor="paste-list" sx={{ fontSize: 14, fontWeight: 500 }}>One SKU per line, then the quantity</Typography>
        {!text && <Button size="small" onClick={() => setText(SAMPLE)} sx={{ color: colors.redText, minHeight: 32 }}>Try a sample list</Button>}
      </Box>
      <InputBase
        id="paste-list"
        multiline
        minRows={4}
        maxRows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'HD0031, 4\nRM x2'}
        inputProps={{ spellCheck: false, style: { fontFamily: mono, fontSize: 14 } }}
        sx={{ width: '100%', p: 1.5, border: `1px solid ${colors.line2}`, borderRadius: radius.md, bgcolor: colors.subtle, '&.Mui-focused': { borderColor: colors.navy, bgcolor: '#fff', boxShadow: `0 0 0 3px ${colors.navyTint}` } }}
      />
      {lines.length > 0 && (
        <Box component="ul" aria-label="List check" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 260, overflowY: 'auto' }}>
          {lines.map((l, i) => (
            <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1, borderRadius: radius.sm, bgcolor: l.p && inStock(l.p) ? colors.subtle : l.p ? colors.warningTint : colors.errorTint }}>
              {l.p && inStock(l.p) ? <CheckCircleIcon sx={{ color: colors.success, fontSize: 20 }} /> : <AlertCircleIcon sx={{ color: l.p ? colors.warning : colors.error, fontSize: 20 }} />}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.p?.name ?? l.code}</Typography>
                <Typography sx={{ fontSize: 12, color: l.p && inStock(l.p) ? colors.ink500 : l.p ? colors.warning : colors.error }}>
                  {!l.p ? 'SKU not found — it will be skipped' : !inStock(l.p) ? 'Out of stock — it will be skipped' : `${l.code} · ${packSize(l.p) || l.p.uom || ''}`}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, flexShrink: 0 }}>× {l.qty}</Typography>
            </Box>
          ))}
        </Box>
      )}
      <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, color: colors.ink600 }}>
          {lines.length ? <>{ok.length} of {lines.length} ready{bad ? ` · ${bad} skipped` : ''} · <b style={{ color: colors.ink }}>{money(total)}</b></> : 'Paste from your order sheet or invoice.'}
        </Typography>
        <Button
          variant="contained"
          disabled={!ok.length}
          onClick={() => { addMany(ok.map((l) => ({ sku: l.p!.sku, qty: l.qty })), `${ok.length} product${ok.length === 1 ? '' : 's'} added to cart`); setText(''); onDone?.() }}
        >
          {ok.length ? `Add ${ok.length} to cart` : 'Add to cart'}
        </Button>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------ Global dialog (header button) */

type Ctx = { open: (tab?: 'sku' | 'paste') => void }
const QuickOrderCtx = createContext<Ctx>({ open: () => {} })
export const useQuickOrder = () => useContext(QuickOrderCtx)

export function QuickOrderProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<'sku' | 'paste' | null>(null)
  const open = useCallback((t: 'sku' | 'paste' = 'sku') => setTab(t), [])
  const value = useMemo(() => ({ open }), [open])
  return (
    <QuickOrderCtx.Provider value={value}>
      {children}
      <Dialog open={!!tab} onClose={() => setTab(null)} maxWidth="sm" fullWidth aria-labelledby="qo-dialog-title">
        <DialogTitle id="qo-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pr: 7 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: radius.md, bgcolor: colors.redTint, color: colors.redText, display: 'grid', placeItems: 'center' }}><BoltIcon /></Box>
          Quick order
          <IconButton aria-label="Close quick order" onClick={() => setTab(null)} sx={{ position: 'absolute', right: 12, top: 14 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <Box sx={{ px: 3 }}>
          <Tabs value={tab ?? 'sku'} onChange={(_, v) => setTab(v)} aria-label="Quick order method" sx={{ borderBottom: `1px solid ${colors.line}` }}>
            <Tab value="sku" label="Enter SKUs" id="qo-tab-sku" aria-controls="qo-panel" />
            <Tab value="paste" label="Paste a list" id="qo-tab-paste" aria-controls="qo-panel" />
          </Tabs>
        </Box>
        <DialogContent id="qo-panel" role="tabpanel" aria-labelledby={`qo-tab-${tab ?? 'sku'}`} sx={{ pt: 2.5 }}>
          {tab === 'paste' ? <PasteList onDone={() => setTab(null)} /> : <QuickOrderForm layout="stacked" />}
        </DialogContent>
      </Dialog>
    </QuickOrderCtx.Provider>
  )
}
