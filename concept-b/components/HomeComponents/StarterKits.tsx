import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { finalPrice, money, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { colors, focusRing, motion, radius, shadow } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { PackChip } from '../ui/ProductMeta'
import Section from '../ui/Section'

/*
 * Ready-to-order kits.
 * NEW FEATURE: curated bundles (kit id, name, blurb, items {sku, qty}) — prototype data in data/kits.json.
 * Name, image, pack size and price are existing product fields; "Add kit" maps to one addProductsToCart call.
 */

export type Kit = { id: string; name: string; blurb: string; items: { sku: string; qty: number }[] }

function KitCard({ kit, products }: { kit: Kit; products: Product[] }) {
  const { addMany } = useCart()
  const lines = kit.items
    .map((i) => ({ ...i, product: products.find((p) => p.sku === i.sku) }))
    .filter((l): l is { sku: string; qty: number; product: Product } => !!l.product)
  const total = lines.reduce((a, l) => a + finalPrice(l.product) * l.qty, 0)
  const units = lines.reduce((a, l) => a + l.qty, 0)

  return (
    <Box component="article" aria-labelledby={`kit-${kit.id}`} sx={{ height: '100%', bgcolor: '#fff', border: `1px solid ${colors.line}`, borderRadius: radius.lg, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, transition: `box-shadow ${motion.base}`, '&:hover': { boxShadow: shadow.md } }}>
      <Box sx={{ display: 'flex' }} aria-hidden>
        {lines.slice(0, 5).map((l, i) => (
          <Box key={l.sku} sx={{ width: 52, flexShrink: 0, ml: i ? '-10px' : 0, bgcolor: '#fff', border: '2px solid #fff', borderRadius: radius.md, overflow: 'hidden', boxShadow: shadow.sm, zIndex: lines.length - i }}>
            <ProductImage product={l.product} caption={false} alt="" />
          </Box>
        ))}
      </Box>
      <Box>
        <Typography id={`kit-${kit.id}`} component="h3" sx={{ fontSize: 16.5, fontWeight: 600 }}>{kit.name}</Typography>
        <Typography sx={{ fontSize: 13.5, color: colors.ink600, lineHeight: 1.45 }}>{kit.blurb}</Typography>
      </Box>
      <Box component="ul" aria-label={`${kit.name} contents`} sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.75, borderTop: `1px solid ${colors.line}`, pt: 1.5 }}>
        {lines.map((l) => (
          <Box component="li" key={l.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, flexShrink: 0, minWidth: 28, fontVariantNumeric: 'tabular-nums' }}>{l.qty}×</Typography>
            <Box component={Link} href={`/p/${l.product.url_key}`} title={l.product.name} sx={{ fontSize: 13, color: colors.ink700, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
              {l.product.name}
            </Box>
            <Box sx={{ flexShrink: 0, maxWidth: { xs: 80, md: 100 } }}><PackChip product={l.product} /></Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 13, color: colors.ink600 }}>{lines.length} products · {units} units</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(total)}</Typography>
      </Box>
      <Button fullWidth variant="contained" startIcon={<AddShoppingCartRoundedIcon />} onClick={() => addMany(lines.map(({ sku, qty }) => ({ sku, qty })), `${kit.name} kit added to cart`)}>
        Add kit · {units} items
      </Button>
    </Box>
  )
}

export default function StarterKits({ kits, products }: { kits: Kit[]; products: Product[] }) {
  return (
    <Section id="kits" eyebrow="Ready-to-order kits" title="Stock up in one tap" subtitle="Bundles of what kitchens reorder together — adjust quantities in your cart">
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: { xs: 1.5, md: 2 }, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'repeat(2, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' } }}>
        {kits.map((k) => <li key={k.id}><KitCard kit={k} products={products} /></li>)}
      </Box>
    </Section>
  )
}
