import { useRef, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, IconButton, InputBase, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { money, productBySku, products, type Product } from '../data/catalog'
import { usualSkus } from '../data/app'
import { PackChip, Pill, ProductImage, QtyStepper, Segmented, TopBar } from '../components/ui'
import { AlertCircleIcon, BarcodeIcon, CheckCircleIcon, CloseIcon } from '../components/icons'

const c = tokens.color

const find = (q: string) => {
  const t = q.trim().toLowerCase()
  if (!t) return { match: undefined as Product | undefined, partial: [] as Product[] }
  const exact = products.find((p) => p.sku.toLowerCase() === t)
  const partial = exact ? [] : products.filter((p) => p.sku.toLowerCase().startsWith(t)).slice(0, 4)
  return { match: exact ?? (partial.length === 1 ? partial[0] : undefined), partial: partial.length > 1 ? partial : [] }
}

function BySku() {
  const { add, priceFor } = useApp()
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState<{ name: string; qty: number }[]>([])
  const input = useRef<HTMLInputElement>(null)
  const { match, partial } = find(sku)
  const oos = match?.stock === 'OUT_OF_STOCK'
  const notFound = sku.trim().length >= 2 && !match && !partial.length
  const submit = () => {
    if (!match || oos) return
    add(match.sku, qty, { silent: true })
    setAdded((a) => [{ name: match.name, qty }, ...a].slice(0, 5))
    setSku(''); setQty(1)
    input.current?.focus()
  }
  return (
    <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); submit() }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 52, px: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1.5px solid ${notFound ? c.error : c.line2}`, '&:focus-within': { borderColor: notFound ? c.error : c.navy } }}>
        <Typography component="label" htmlFor="qo-sku" sx={{ fontSize: 12, fontWeight: 700, color: c.text3, letterSpacing: '.06em' }}>SKU</Typography>
        <InputBase id="qo-sku" inputRef={input} autoFocus value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. A905 or a barcode" inputProps={{ autoComplete: 'off', autoCapitalize: 'characters', spellCheck: false, enterKeyHint: 'done' }} sx={{ flex: 1, fontFamily: tokens.font.mono, fontSize: 16 }} />
        {sku && <IconButton size="small" aria-label="Clear" onClick={() => setSku('')}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>}
        <IconButton component={RouterLink} to="/scan" aria-label="Scan instead" sx={{ color: c.red }}><BarcodeIcon /></IconButton>
      </Box>

      <Box role="status" aria-live="polite" sx={{ mt: 1.25, minHeight: 40 }}>
        {match ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: '56px minmax(0,1fr)', gap: 1.25, p: 1.25, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1px solid ${c.line}` }}>
            <ProductImage product={match} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{match.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}><PackChip pack={match.pack} /><Typography sx={{ fontSize: 13, fontWeight: 700 }}>{money(priceFor(match))}</Typography></Box>
              {oos && <Typography sx={{ fontSize: 12.5, color: c.warning, fontWeight: 600, mt: 0.5 }}>Out of stock — can’t be added right now</Typography>}
            </Box>
          </Box>
        ) : partial.length ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography sx={{ fontSize: 13, color: c.text2 }}>Did you mean</Typography>
            {partial.map((p) => <Pill key={p.sku} onClick={() => setSku(p.sku)}>{p.sku}</Pill>)}
          </Box>
        ) : notFound ? (
          <Typography sx={{ display: 'flex', gap: 0.75, fontSize: 13.5, color: c.error }}><AlertCircleIcon sx={{ fontSize: 18 }} /> No product has SKU “{sku.trim()}”. Check your invoice or try search.</Typography>
        ) : (
          <>
            <Typography variant="overline" component="p" sx={{ color: c.text3 }}>Your usuals</Typography>
            <Box className="no-scrollbar" sx={{ display: 'flex', gap: 1, overflowX: 'auto', mx: -2, px: 2, pb: 0.5 }}>
              {usualSkus.map((s) => { const p = productBySku(s); return p ? <Pill key={s} onClick={() => setSku(s)}>{s} · {p.brand}</Pill> : null })}
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
        <QtyStepper value={qty} onChange={setQty} size="lg" label="Quantity" />
        <Button type="submit" fullWidth variant="contained" size="large" disabled={!match || oos}>{match && !oos ? `Add ${qty} · ${money(priceFor(match) * qty)}` : 'Add to cart'}</Button>
      </Box>

      {added.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Typography variant="overline" component="h2" sx={{ color: c.text3 }}>Added just now</Typography>
          {added.map((a, i) => <Typography key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13.5, py: 0.5 }}><CheckCircleIcon sx={{ fontSize: 17, color: c.successText }} /> {a.qty} × {a.name}</Typography>)}
          <Button component={RouterLink} to="/cart" variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }}>Review cart</Button>
        </Box>
      )}
    </Box>
  )
}

const SAMPLE = 'A905, 4\nGR2210 x2\n59620000008478349 6\nZZ999'

function PasteList() {
  const { addMany } = useApp()
  const [text, setText] = useState('')
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [code, q] = l.split(/[\s,x×]+/i)
    const p = productBySku(code) ?? products.find((x) => x.sku.toLowerCase() === code.toLowerCase())
    return { code, qty: Math.max(1, Math.min(999, parseInt(q ?? '1', 10) || 1)), p }
  })
  const ok = lines.filter((l) => l.p && l.p.stock !== 'OUT_OF_STOCK')
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
        <Typography component="label" htmlFor="paste" sx={{ fontSize: 14, fontWeight: 600 }}>One SKU per line, then quantity</Typography>
        {!text && <Button size="small" onClick={() => setText(SAMPLE)} sx={{ color: c.navy }}>Try a sample</Button>}
      </Box>
      <InputBase id="paste" multiline minRows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={'A905, 4\nGR2210 x2'} inputProps={{ spellCheck: false, style: { fontFamily: tokens.font.mono, fontSize: 15 } }}
        sx={{ width: '100%', p: 1.5, bgcolor: '#fff', borderRadius: `${tokens.radius.md}px`, border: `1.5px solid ${c.line2}`, '&.Mui-focused': { borderColor: c.navy } }} />
      {lines.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {lines.map((l, i) => {
            const good = l.p && l.p.stock !== 'OUT_OF_STOCK'
            return (
              <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: `${tokens.radius.sm}px`, bgcolor: good ? '#fff' : l.p ? c.warningTint : c.errorTint, border: good ? `1px solid ${c.line}` : 'none' }}>
                {good ? <CheckCircleIcon sx={{ color: c.successText, fontSize: 19 }} /> : <AlertCircleIcon sx={{ color: l.p ? c.warning : c.error, fontSize: 19 }} />}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.p?.name ?? l.code}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: good ? c.text3 : l.p ? c.warning : c.error }}>{!l.p ? 'SKU not found — skipped' : !good ? 'Out of stock — skipped' : `${l.code} · ${l.p.pack}`}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>×{l.qty}</Typography>
              </Box>
            )
          })}
        </Box>
      )}
      <Button fullWidth variant="contained" size="large" disabled={!ok.length} sx={{ mt: 2 }} onClick={() => { addMany(ok.map((l) => ({ sku: l.p!.sku, qty: l.qty })), `${ok.length} products added`); setText('') }}>
        {ok.length ? `Add ${ok.length} of ${lines.length} to cart` : 'Add to cart'}
      </Button>
    </Box>
  )
}

/** Quick order (from Concept B, phone-sized): type a SKU and keep going, or paste a list from an order sheet. */
export default function QuickOrder() {
  const [mode, setMode] = useState<'sku' | 'paste'>('sku')
  return (
    <Box sx={{ minHeight: '100%' }}>
      <TopBar title="Quick order" />
      <Box sx={{ px: 2, pt: 2, pb: 4 }}>
        <Typography sx={{ color: c.text2, fontSize: 14, mb: 2 }}>For when you know exactly what you need — from last week’s invoice or your order sheet.</Typography>
        <Segmented label="Quick order method" value={mode} onChange={setMode} options={[{ value: 'sku', label: 'Type SKUs' }, { value: 'paste', label: 'Paste a list' }]} />
        <Box sx={{ mt: 2.5 }}>{mode === 'sku' ? <BySku /> : <PasteList />}</Box>
      </Box>
    </Box>
  )
}
