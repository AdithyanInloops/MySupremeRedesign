import { Fragment, useState } from 'react'
import Link from 'next/link'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import { ProductImage } from '../Product/ProductCard'
import { finalPrice, money, packSize, type Product } from '../../lib/data'
import { useCart } from '../../lib/cart'

/**
 * Concept B #12 — "Frequently bought together" on the product page.
 * Production feed: Algolia Recommend "frequently-bought-together" model (Algolia is already integrated),
 * so no new Magento data. The prototype passes same-department products.
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
    <Box component="section" aria-labelledby="fbt-title" sx={{ mt: { xs: 4, md: 5 }, border: '1px solid #EAEAEA', borderRadius: '8px', p: { xs: 2, md: 3 }, bgcolor: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.04)' }}>
      <Typography id="fbt-title" component="h2" sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 600, color: '#0C0C0C', mb: { xs: 2, md: 2.5 } }}>
        Frequently bought together
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2.5, lg: 4 }, alignItems: { lg: 'center' } }}>
        {/* Thumbnails joined by "+" (desktop) / stacked rows (mobile) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'stretch' }, gap: { xs: 1.25, md: 1 }, flex: 1, minWidth: 0 }}>
          {items.map((p, i) => {
            const on = checked.includes(p.sku)
            const isThis = i === 0
            return (
              <Fragment key={p.sku}>
                {i > 0 && (
                  <Box aria-hidden sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', color: '#9CA3AF' }}>
                    <AddIcon />
                  </Box>
                )}
                <Box
                  component="label"
                  sx={{
                    flex: { md: 1 }, minWidth: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: { xs: 1.5, md: 1 }, alignItems: { xs: 'center', md: 'stretch' },
                    p: 1.25, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${on ? '#FF413D' : '#E5E7EB'}`, bgcolor: on ? '#FFF7F7' : '#fff',
                    opacity: on ? 1 : 0.65, transition: 'border-color .15s, opacity .15s, background-color .15s',
                    '&:focus-within': { outline: '3px solid #2d297d', outlineOffset: 2 },
                  }}
                >
                  <Box sx={{ position: 'relative', width: { xs: 72, md: '100%' }, maxWidth: { md: 150 }, mx: { md: 'auto' }, flexShrink: 0, border: '1px solid #F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
                    <ProductImage product={p} size={20} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <Checkbox
                        checked={on}
                        onChange={() => toggle(p.sku)}
                        size="small"
                        inputProps={{ 'aria-label': `${isThis ? 'This item' : 'Add'}: ${p.name}` }}
                        sx={{ p: 0.25, mt: '-1px', color: '#9CA3AF', '&.Mui-checked': { color: '#D50000' } }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        {isThis && <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#D50000', textTransform: 'uppercase', letterSpacing: '.06em' }}>This item</Typography>}
                        <Typography
                          component={isThis ? 'span' : Link}
                          {...(isThis ? {} : { href: `/p/${p.url_key}` })}
                          title={p.name}
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          sx={{ fontSize: 13, color: '#0C0C0C', textDecoration: 'none', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', '&:hover': { color: isThis ? '#0C0C0C' : '#D50000' } }}
                        >
                          {p.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pl: 3.5 }}>
                      {packSize(p) && (
                        <Box component="span" sx={{ fontSize: '11px', color: '#555', bgcolor: '#F5F5F5', border: '1px solid #EAEAEA', borderRadius: '4px', p: '2px 6px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {packSize(p)}
                        </Box>
                      )}
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0C0C0C' }}>{money(finalPrice(p))}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Fragment>
            )
          })}
        </Box>

        {/* Total + CTA */}
        <Box sx={{ flexShrink: 0, width: { xs: '100%', lg: 260 }, display: 'flex', flexDirection: { xs: 'row', lg: 'column' }, alignItems: { xs: 'center', lg: 'stretch' }, justifyContent: 'space-between', gap: 1.5, p: { xs: 1.5, lg: 2 }, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          <Box>
            <Typography sx={{ fontSize: 13, color: '#4B5563' }}>Total for {selected.length} item{selected.length === 1 ? '' : 's'}</Typography>
            <Typography sx={{ fontSize: { xs: 20, md: 24 }, fontWeight: 700, color: '#0C0C0C', lineHeight: 1.2 }}>{money(total)}</Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            disabled={!selected.length}
            startIcon={<AddShoppingCartOutlinedIcon />}
            onClick={() => addMany(selected.map((p) => ({ sku: p.sku, qty: 1 })), `${selected.length} product${selected.length === 1 ? '' : 's'} added to cart`)}
            sx={{
              height: 46, px: 2.5, borderRadius: '4px', textTransform: 'none', fontWeight: 600, fontSize: 14, bgcolor: '#D50000', whiteSpace: 'nowrap',
              '&:hover': { bgcolor: '#b00000' }, '&.Mui-focusVisible': { outline: '3px solid #2d297d', outlineOffset: 2 },
            }}
          >
            Add {selected.length} to cart
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
