import { useState } from 'react'
import Link from 'next/link'
import { Box, Button, Dialog, DialogContent, IconButton, InputBase, Typography } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { finalPrice, money, packSize, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { ProductImage } from '../Product/ProductCard'

/*
 * CONCEPT B — CHANGE #1 (new section, sits between Supremebanner and RecommentedProducts).
 * Front-end only: product lookup by SKU + the existing add-to-cart mutation. No new backend data.
 * Drop-in for the real pages/index.tsx: <QuickOrderBar products={…} popularSkus={…} />.
 */

const RED_AA = '#D50000' // text-bearing red (5.5:1 with white)
const focusRing = { '&.Mui-focusVisible, &:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 } }

type Props = {
  /** Catalog to look SKUs up in (production: a products(filter:{sku:{eq}}) query). */
  products: Product[]
  /** SKUs shown as one-tap chips (production: last order for signed-in buyers, Algolia trending for guests). */
  popularSkus: string[]
}

const findBySku = (products: Product[], q: string) => {
  const t = q.trim().toLowerCase()
  if (!t) return undefined
  return products.find((p) => p.sku.toLowerCase() === t) ?? products.find((p) => p.sku.toLowerCase().startsWith(t))
}

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const btn = { width: 40, height: 44, borderRadius: 0, color: '#0C0C0C', ...focusRing }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 46, border: '1px solid #D1D5DB', borderRadius: '8px', bgcolor: '#fff', flexShrink: 0 }}>
      <IconButton aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} sx={btn}><RemoveIcon fontSize="small" /></IconButton>
      <InputBase
        value={value}
        onChange={(e) => onChange(Math.max(1, parseInt(e.target.value.replace(/\D/g, '') || '1', 10)))}
        inputProps={{ 'aria-label': label, inputMode: 'numeric', style: { textAlign: 'center', fontWeight: 600, padding: 0 } }}
        sx={{ width: 36, fontSize: 15 }}
      />
      <IconButton aria-label="Increase quantity" onClick={() => onChange(Math.min(999, value + 1))} sx={btn}><AddIcon fontSize="small" /></IconButton>
    </Box>
  )
}

export default function QuickOrderBar({ products, popularSkus }: Props) {
  const { add } = useCart()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [paste, setPaste] = useState(false)

  const match = findBySku(products, sku)
  const error = sku.trim() && !match ? `No product with SKU “${sku.trim()}”. Check the code or use the search bar.` : ''
  const popular = popularSkus.map((s) => products.find((p) => p.sku === s)).filter(Boolean) as Product[]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!match) return
    add(match.sku, qty)
    setSku('')
    setQty(1)
  }

  return (
    <Box component="section" aria-labelledby="quick-order-title">
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          display: 'grid', alignItems: 'center', gap: { xs: 2, lg: 3 }, p: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', lg: '260px minmax(0,1fr) auto' },
          bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', borderLeft: '4px solid #FF0000',
        }}
      >
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: '#FF0000', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <BoltIcon />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography id="quick-order-title" component="h2" sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 }, color: '#0C0C0C', lineHeight: 1.2 }}>Quick Order</Typography>
            <Typography sx={{ fontSize: 13, color: '#4B5563' }}>Know the SKU? Add it straight to cart.</Typography>
          </Box>
          <Button
            onClick={() => setPaste(true)}
            startIcon={<ListAltIcon />}
            sx={{ display: { xs: 'inline-flex', lg: 'none' }, flexShrink: 0, textTransform: 'none', fontWeight: 600, color: RED_AA, borderRadius: '40px', border: `1px solid ${RED_AA}`, px: 1.5, height: 36, fontSize: 13, ...focusRing }}
          >
            Paste list
          </Button>
        </Box>

        {/* Entry + preview */}
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <Box
              sx={{
                flex: 1, minWidth: { xs: '100%', sm: 0 }, display: 'flex', alignItems: 'center', height: 46, px: 1.5, bgcolor: '#fff', borderRadius: '8px',
                border: `1px solid ${error ? RED_AA : '#D1D5DB'}`, transition: 'all .2s ease',
                '&:focus-within': { borderColor: error ? RED_AA : '#FF0000', boxShadow: '0 0 0 3px rgba(255, 0, 0, 0.08)' },
              }}
            >
              <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: '#6B7280', mr: 1, letterSpacing: '.04em' }}>SKU</Typography>
              <InputBase
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. HD0031 or 17-digit barcode"
                inputProps={{ 'aria-label': 'SKU or barcode', 'aria-describedby': 'quick-order-status', autoComplete: 'off', spellCheck: false }}
                sx={{ flex: 1, minWidth: 0, fontSize: 14, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
              />
            </Box>
            <Stepper value={qty} onChange={setQty} label="Quick order quantity" />
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={!match}
              sx={{
                height: 46, px: 3, flex: { xs: 1, sm: '0 0 auto' }, bgcolor: RED_AA, color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: 14, borderRadius: '8px', whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#B00000' }, '&.Mui-disabled': { bgcolor: '#F3F4F6', color: '#6B7280' }, ...focusRing,
              }}
            >
              {match ? `Add ${qty} to Cart` : 'Add to Cart'}
            </Button>
          </Box>

          <Box id="quick-order-status" role="status" aria-live="polite" sx={{ mt: 1.25, minHeight: 40 }}>
            {match ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, pr: 1.5, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                <Box sx={{ width: 44, flexShrink: 0, border: '1px solid #F3F4F6', borderRadius: '4px', overflow: 'hidden' }}><ProductImage product={match} size={9} /></Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography title={match.name} sx={{ fontSize: 14, fontWeight: 500, color: '#0C0C0C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{match.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12, color: '#6B7280', whiteSpace: 'nowrap' }}>{match.sku}</Typography>
                    {packSize(match) && (
                      <Box component="span" sx={{ fontSize: '11px', fontWeight: 500, color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '1px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{packSize(match)}</Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: '#0C0C0C' }}>{money(finalPrice(match) * qty)}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: '#6B7280' }}>{money(finalPrice(match))} each</Typography>
                </Box>
              </Box>
            ) : error ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, bgcolor: '#FDECEC', borderRadius: '8px', color: '#B00000' }}>
                <ErrorOutlineIcon fontSize="small" />
                <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{error}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#6B7280', mr: 0.5 }}>Popular SKUs:</Typography>
                {popular.map((p) => (
                  <Box
                    key={p.sku}
                    component="button"
                    type="button"
                    onClick={() => setSku(p.sku)}
                    title={p.name}
                    sx={{
                      display: 'inline-flex', alignItems: 'center', gap: 0.75, height: 32, px: 1.25, borderRadius: '40px', border: '1px solid #E5E7EB', bgcolor: '#fff',
                      cursor: 'pointer', font: 'inherit', maxWidth: 220, transition: 'border-color .2s', '&:hover': { borderColor: '#FF413D' },
                      '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
                    }}
                  >
                    <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: RED_AA, whiteSpace: 'nowrap' }}>{p.sku}</Box>
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, fontSize: 12, color: '#4B5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.brand_label ?? p.name}</Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Paste a list (desktop) */}
        <Button
          onClick={() => setPaste(true)}
          variant="outlined"
          startIcon={<ListAltIcon />}
          sx={{
            display: { xs: 'none', lg: 'inline-flex' }, alignSelf: 'start', height: 46, px: 2.5, borderRadius: '40px', textTransform: 'none', fontWeight: 600, fontSize: 14,
            color: RED_AA, borderColor: RED_AA, '&:hover': { borderColor: RED_AA, bgcolor: 'rgba(213,0,0,.04)' }, ...focusRing,
          }}
        >
          Paste a list
        </Button>
      </Box>

      <PasteListDialog open={paste} onClose={() => setPaste(false)} products={products} />
    </Box>
  )
}

/** Paste an order sheet: one SKU per line with an optional quantity ("HD0031, 4" or "RM x2"). */
function PasteListDialog({ open, onClose, products }: { open: boolean; onClose: () => void; products: Product[] }) {
  const { add, notify } = useCart()
  const [text, setText] = useState('HD0031, 4\nRM x2\n59620000008478349 6\nXY12345')
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [code, q] = l.split(/[\s,x×]+/i)
      const p = products.find((x) => x.sku.toLowerCase() === code.toLowerCase())
      return { code, qty: Math.max(1, parseInt(q ?? '1', 10) || 1), p }
    })
  const ok = lines.filter((l) => l.p)
  const total = ok.reduce((a, l) => a + finalPrice(l.p!) * l.qty, 0)

  const addAll = () => {
    ok.forEach((l) => add(l.p!.sku, l.qty, { silent: true }))
    notify(`${ok.length} products added to cart`)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="paste-title" PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography id="paste-title" component="h2" sx={{ fontWeight: 700, fontSize: 20 }}>Paste an order list</Typography>
          <IconButton aria-label="Close" onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Typography sx={{ fontSize: 14, color: '#4B5563', mb: 2 }}>One SKU per line, with an optional quantity — straight from your order sheet.</Typography>
        <InputBase
          multiline
          minRows={4}
          maxRows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          inputProps={{ 'aria-label': 'SKU list', spellCheck: false, style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 14 } }}
          sx={{ width: '100%', p: 1.5, border: '1px solid #D1D5DB', borderRadius: '8px', bgcolor: '#F9FAFB', '&.Mui-focused': { borderColor: '#FF0000', bgcolor: '#fff' } }}
        />
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 280, overflowY: 'auto' }}>
          {lines.map((l, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1, borderRadius: '8px', bgcolor: l.p ? '#F9FAFB' : '#FDECEC' }}>
              {l.p ? <CheckCircleIcon sx={{ color: '#05753D', fontSize: 20 }} /> : <ErrorOutlineIcon sx={{ color: '#B00000', fontSize: 20 }} />}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.p?.name ?? l.code}</Typography>
                <Typography sx={{ fontSize: 12, color: l.p ? '#6B7280' : '#B00000' }}>{l.p ? `${l.code} · ${packSize(l.p) || l.p.uom || ''}` : 'SKU not found'}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, flexShrink: 0 }}>× {l.qty}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 14, color: '#4B5563' }}>
            {ok.length} of {lines.length} ready · <b style={{ color: '#0C0C0C' }}>{money(total)}</b>
          </Typography>
          <Button
            onClick={addAll}
            disabled={!ok.length}
            variant="contained"
            disableElevation
            sx={{ height: 46, px: 3, bgcolor: RED_AA, textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { bgcolor: '#B00000' }, ...focusRing }}
          >
            Add {ok.length} to Cart
          </Button>
        </Box>
        <Typography sx={{ mt: 2, fontSize: 12, color: '#6B7280' }}>
          Need a bigger order quoted? <Link href="/service/contact-us" style={{ color: RED_AA, fontWeight: 600 }}>Talk to our team</Link>
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
