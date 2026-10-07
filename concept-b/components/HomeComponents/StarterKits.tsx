import Link from 'next/link'
import { Box, Button, Typography } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { finalPrice, money, packSize, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { ProductImage } from '../Product/ProductCard'
import { SectionHeading } from './HomeSection'

/*
 * CONCEPT B — NEW SECTION #6 "Ready-to-order kits".
 * NEW FEATURE: needs curated bundles (kit id, name, blurb, items {sku, qty}) — prototype data in data/kits.json.
 * Product name, image, pack size and price are existing fields; "Add kit" maps to one addProductsToCart call.
 */

const RED_AA = '#D50000'

export type Kit = { id: string; name: string; blurb: string; items: { sku: string; qty: number }[] }

function KitCard({ kit, products }: { kit: Kit; products: Product[] }) {
  const { addMany } = useCart()
  const lines = kit.items
    .map((i) => ({ ...i, product: products.find((p) => p.sku === i.sku) }))
    .filter((l): l is { sku: string; qty: number; product: Product } => !!l.product)
  const total = lines.reduce((a, l) => a + finalPrice(l.product) * l.qty, 0)
  const units = lines.reduce((a, l) => a + l.qty, 0)

  return (
    <Box
      component="article"
      aria-label={`${kit.name} kit, ${lines.length} products, ${money(total)}`}
      sx={{ height: '100%', bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', p: { xs: 2, md: 2.25 }, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      {/* Stacked thumbnails */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }} aria-hidden>
        <Box sx={{ display: 'flex', minWidth: 0 }}>
        {lines.map((l, i) => (
          <Box key={l.sku} sx={{ width: 56, flexShrink: 0, ml: i ? '-12px' : 0, bgcolor: '#fff', border: '2px solid #fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.12)', zIndex: lines.length - i }}>
            <ProductImage product={l.product} size={10} />
          </Box>
        ))}
        </Box>
        <Box sx={{ ml: 'auto', flexShrink: 0, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 0.5, fontSize: 12, color: '#4B5563', bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '40px', px: 1, height: 26 }}>
          <Inventory2OutlinedIcon sx={{ fontSize: 14 }} /> {lines.length} products
        </Box>
      </Box>

      <Box>
        <Typography component="h3" sx={{ fontSize: { xs: 16, md: 17 }, fontWeight: 600, color: '#0C0C0C' }}>{kit.name}</Typography>
        <Typography sx={{ fontSize: 13, color: '#4B5563', lineHeight: 1.45 }}>{kit.blurb}</Typography>
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.75, borderTop: '1px dashed #E5E7EB', pt: 1.25 }}>
        {lines.map((l) => (
          <Box component="li" key={l.sku} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: '#0C0C0C', flexShrink: 0, minWidth: 26 }}>{l.qty} ×</Typography>
            <Box component={Link} href={`/p/${l.product.url_key}`} title={l.product.name}
              sx={{ fontSize: 12.5, color: '#374151', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, '&:hover': { color: RED_AA }, '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 1 } }}>
              {l.product.name}
            </Box>
            {packSize(l.product) && (
              <Box component="span" sx={{ flexShrink: 0, maxWidth: { xs: 68, md: 96 }, fontSize: '10.5px', color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '1px 5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {packSize(l.product)}
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 12.5, color: '#4B5563' }}>Kit total · {units} units</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#0C0C0C' }}>{money(total)}</Typography>
      </Box>
      <Button
        fullWidth
        disableElevation
        variant="contained"
        startIcon={<AddShoppingCartIcon />}
        onClick={() => addMany(lines.map(({ sku, qty }) => ({ sku, qty })), `${kit.name} added to cart`)}
        sx={{
          height: 44, borderRadius: '6px', bgcolor: RED_AA, textTransform: 'none', fontWeight: 600, fontSize: 14,
          '&:hover': { bgcolor: '#B00000' }, '&.Mui-focusVisible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
        }}
      >
        Add kit to cart ({units} items)
      </Button>
    </Box>
  )
}

export default function StarterKits({ kits, products }: { kits: Kit[]; products: Product[] }) {
  return (
    <Box>
      <SectionHeading id="starter-kits" eyebrow="Ready-to-order kits" title="Stock up in one tap" subtitle="Curated bundles of what kitchens reorder together — edit quantities in the cart" />
      <Box
        sx={{
          display: 'grid', gap: { xs: 1.5, md: 2 },
          gridAutoFlow: { xs: 'column', md: 'row' }, gridAutoColumns: { xs: '84%', sm: '58%' },
          gridTemplateColumns: { md: 'repeat(2, minmax(0,1fr))', xl: 'repeat(4, minmax(0,1fr))' },
          overflowX: { xs: 'auto', md: 'visible' }, scrollSnapType: { xs: 'x mandatory', md: 'none' }, pb: { xs: 1, md: 0 },
          '& > *': { scrollSnapAlign: 'start' },
        }}
      >
        {kits.map((k) => <KitCard key={k.id} kit={k} products={products} />)}
      </Box>
    </Box>
  )
}
