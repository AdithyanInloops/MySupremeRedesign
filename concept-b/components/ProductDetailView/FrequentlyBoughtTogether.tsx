import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { finalPrice, money, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'
import { colors, focusRing, motion, radius } from '../../lib/theme'
import ProductImage from '../ui/ProductImage'
import { PackChip } from '../ui/ProductMeta'

/**
 * "Frequently bought together": this item + two companions with checkboxes, running total and one add.
 * Production feed: Algolia Recommend "frequently-bought-together" (Algolia is already integrated).
 */
export default function FrequentlyBoughtTogether({ product, companions }: { product: Product; companions: Product[] }) {
  const { addMany } = useCart()
  const items = [product, ...companions.slice(0, 2)]
  const [checked, setChecked] = useState<string[]>(items.map((p) => p.sku))
  if (items.length < 2) return null
  const selected = items.filter((p) => checked.includes(p.sku))
  const total = selected.reduce((a, p) => a + finalPrice(p), 0)
  const toggle = (sku: string) => setChecked((c) => (c.includes(sku) ? c.filter((x) => x !== sku) : [...c, sku]))

  return (
    <Box component="section" aria-labelledby="fbt-title" sx={{ mt: { xs: 5, md: 7 } }}>
      <Typography id="fbt-title" variant="h2" sx={{ mb: 2.5 }}>Frequently bought together</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, lg: 3 }, alignItems: { lg: 'stretch' } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 1, md: 1 }, flex: 1, minWidth: 0 }}>
          {items.map((p, i) => {
            const on = checked.includes(p.sku)
            const isThis = i === 0
            return (
              <Fragment key={p.sku}>
                {i > 0 && <Box aria-hidden sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', color: colors.ink400 }}><AddRoundedIcon /></Box>}
                <Box
                  component="label"
                  sx={{
                    flex: { md: 1 }, minWidth: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1.25, alignItems: { xs: 'center', md: 'stretch' }, p: 1.5, borderRadius: radius.lg, cursor: 'pointer',
                    border: `1px solid ${on ? colors.ink400 : colors.line}`, bgcolor: '#fff', opacity: on ? 1 : 0.6, transition: `border-color ${motion.fast}, opacity ${motion.fast}`,
                    '&:focus-within': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 },
                  }}
                >
                  <Box sx={{ width: { xs: 72, md: '100%' }, maxWidth: { md: 140 }, mx: { md: 'auto' }, flexShrink: 0, borderRadius: radius.md, overflow: 'hidden', border: `1px solid ${colors.sunken}` }}>
                    <ProductImage product={p} caption={false} alt="" />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1, display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                    <Checkbox checked={on} onChange={() => toggle(p.sku)} inputProps={{ 'aria-label': `${isThis ? 'This item' : 'Include'}: ${p.name}` }} sx={{ p: 0.25, mt: '-2px' }} />
                    <Box sx={{ minWidth: 0 }}>
                      {isThis && <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: colors.ink500, textTransform: 'uppercase', letterSpacing: '.06em' }}>This item</Typography>}
                      {isThis ? (
                        <Typography sx={{ fontSize: 13.5, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</Typography>
                      ) : (
                        <Box component={Link} href={`/p/${p.url_key}`} onClick={(e: React.MouseEvent) => e.stopPropagation()} title={p.name} sx={{ fontSize: 13.5, color: colors.ink, lineHeight: 1.35, textDecoration: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', borderRadius: '4px', '&:hover': { color: colors.redText, textDecoration: 'underline' }, ...focusRing }}>
                          {p.name}
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{money(finalPrice(p))}</Typography>
                        <PackChip product={p} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Fragment>
            )
          })}
        </Box>
        <Box sx={{ flexShrink: 0, width: { xs: '100%', lg: 260 }, display: 'flex', flexDirection: { xs: 'row', lg: 'column' }, alignItems: { xs: 'center', lg: 'stretch' }, justifyContent: { xs: 'space-between', lg: 'center' }, gap: 1.5, p: 2, bgcolor: colors.subtle, borderRadius: radius.lg }}>
          <Box>
            <Typography sx={{ fontSize: 13.5, color: colors.ink600 }}>Total for {selected.length} item{selected.length === 1 ? '' : 's'}</Typography>
            <Typography aria-live="polite" sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{money(total)}</Typography>
          </Box>
          <Button variant="contained" disabled={!selected.length} startIcon={<AddShoppingCartRoundedIcon />} onClick={() => addMany(selected.map((p) => ({ sku: p.sku, qty: 1 })), `${selected.length} product${selected.length === 1 ? '' : 's'} added to cart`)}>
            {selected.length ? `Add ${selected.length} to cart` : 'Select items'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
