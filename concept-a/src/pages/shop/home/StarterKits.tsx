import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded'
import { tokens } from '../../../theme'
import { money } from '../../../data/catalog'
import { finalPrice, hasImage, magentoProducts, packSize, type MagentoProduct } from '../../../data/magento'
import kitsJson from '../../../data/kits.json'
import { useApp } from '../../../state/AppState'
import { SectionHeader } from '../../../components/ui'

/*
 * Ready-to-order kits (Concept B).
 * NEW FEATURE: curated bundles (kit id, name, blurb, items {sku, qty}) — prototype data in data/kits.json.
 * Name, image, pack size and price are existing product fields; "Add kit" maps to one addProductsToCart call.
 */

type Kit = { id: string; name: string; blurb: string; items: { sku: string; qty: number }[] }
type Line = { sku: string; qty: number; product: MagentoProduct }

const c = tokens.color
const kits = kitsJson.kits as Kit[]

/** Small square thumbnail; muted crown when Magento has no photo. */
function Thumb({ p }: { p: MagentoProduct }) {
  const [failed, setFailed] = useState(false)
  return (
    <Box sx={{ position: 'relative', aspectRatio: '1 / 1', bgcolor: '#F7F8FA', display: 'grid', placeItems: 'center' }}>
      {hasImage(p) && !failed ? (
        <Box component="img" src={p.small_image!.url} alt="" loading="lazy" onError={() => setFailed(true)} sx={{ position: 'absolute', inset: '8%', width: '84%', height: '84%', objectFit: 'contain' }} />
      ) : (
        <Box component="svg" viewBox="0 0 48 34" aria-hidden sx={{ width: '42%' }}>
          <path d="M5 25 3 7.5l11.5 8L24 2l9.5 13.5L45 7.5 43 25Z" fill="none" stroke="#C9CDD4" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M6 30.5h36" stroke="#C9CDD4" strokeWidth="2.6" strokeLinecap="round" />
        </Box>
      )}
    </Box>
  )
}

function KitCard({ kit }: { kit: Kit }) {
  const { addToCart } = useApp()
  const lines = kit.items
    .map((i) => ({ ...i, product: magentoProducts.find((p) => p.sku === i.sku) }))
    .filter((l): l is Line => !!l.product)
  const total = lines.reduce((a, l) => a + finalPrice(l.product) * l.qty, 0)
  const units = lines.reduce((a, l) => a + l.qty, 0)
  // Adds in the same tick collapse into one "Added N products to cart" toast (AppState).
  const addKit = () => lines.forEach((l) => addToCart(l.sku, l.qty))

  return (
    <Box component="article" aria-labelledby={`kit-${kit.id}`} sx={{ height: '100%', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.md}px`, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, transition: 'box-shadow .2s', '&:hover': { boxShadow: tokens.shadow.hover } }}>
      <Box sx={{ display: 'flex' }} aria-hidden>
        {lines.slice(0, 5).map((l, i) => (
          <Box key={l.sku} sx={{ width: 52, flexShrink: 0, ml: i ? '-10px' : 0, bgcolor: '#fff', border: '2px solid #fff', borderRadius: `${tokens.radius.sm}px`, overflow: 'hidden', boxShadow: tokens.shadow.card, zIndex: lines.length - i }}>
            <Thumb p={l.product} />
          </Box>
        ))}
      </Box>
      <Box>
        <Typography id={`kit-${kit.id}`} component="h3" sx={{ fontSize: 16.5, fontWeight: 600 }}>{kit.name}</Typography>
        <Typography sx={{ fontSize: 13.5, color: c.text2, lineHeight: 1.45 }}>{kit.blurb}</Typography>
      </Box>
      <Box component="ul" aria-label={`${kit.name} contents`} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.75, borderTop: `1px solid ${c.line}`, pt: 1.5 }}>
        {lines.map((l) => {
          const pack = packSize(l.product)
          return (
            <Box component="li" key={l.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0, minWidth: 28, fontVariantNumeric: 'tabular-nums' }}>{l.qty}×</Typography>
              <Box component={RouterLink} to={`/p/${l.product.url_key}`} title={l.product.name} sx={{ fontSize: 13, color: '#374151', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, borderRadius: '4px', '&:hover': { color: c.red, textDecoration: 'underline' }, '&:focus-visible': { outline: `3px solid ${c.navy}`, outlineOffset: 2 } }}>
                {l.product.name}
              </Box>
              {pack && (
                <Box component="span" title={pack} sx={{ flexShrink: 0, maxWidth: { xs: 80, md: 100 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: '#374151', bgcolor: c.surface2, borderRadius: '6px', px: 0.75 }}>
                  {pack}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 13, color: c.text2 }}>{lines.length} products · {units} units</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(total)}</Typography>
      </Box>
      <Button fullWidth variant="contained" startIcon={<AddShoppingCartRounded />} onClick={addKit} sx={{ minHeight: 44 }}>
        Add kit · {units} items
      </Button>
    </Box>
  )
}

export default function StarterKits() {
  return (
    <Box component="section" aria-labelledby="kits-title">
      <SectionHeader id="kits-title" eyebrow="Ready-to-order kits" title="Stock up in one tap" subtitle="Bundles of what kitchens reorder together — adjust quantities in your cart" />
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' } }}>
        {kits.map((k) => <li key={k.id}><KitCard kit={k} /></li>)}
      </Box>
    </Box>
  )
}
