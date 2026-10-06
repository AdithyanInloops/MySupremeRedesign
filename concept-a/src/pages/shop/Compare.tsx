import { Alert, Box, Button, IconButton, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import CloseRounded from '@mui/icons-material/CloseRounded'
import AddRounded from '@mui/icons-material/AddRounded'
import { tokens } from '../../theme'
import { deptBySlug, productBySku, type Product } from '../../data/catalog'
import { Container, PackChip } from '../../components/ui'
import { AddToCart, Price, Rating, StockLabel } from '../../components/Commerce'
import { ProductImage } from '../../components/Brand'
import { PageTitle } from '../../components/Shared'

const c = tokens.color

const items = ['BM0089', '59620000008478349', '59620000008478332'].map(productBySku) as Product[]

const rows: [string, (p: Product) => React.ReactNode][] = [
  ['Price', (p) => <Price product={p} size="sm" />],
  ['Pack size', (p) => <PackChip pack={p.pack} size="sm" />],
  ['Brand', (p) => p.brand],
  ['SKU', (p) => <Box component="span" sx={{ fontFamily: tokens.font.mono, fontSize: 12.5, wordBreak: 'break-all' }}>{p.sku}</Box>],
  ['Category', (p) => `${deptBySlug(p.dept)?.name} › ${p.sub}`],
  ['Availability', (p) => <StockLabel stock={p.stock} />],
  ['Rating', (p) => <Rating value={p.rating} count={p.reviews} />],
]

/** Priority 3 — compare is switched off in production today; this is the template if it is enabled. */
export default function Compare() {
  return (
    <Container>
      <PageTitle title="Compare products" crumbs={[{ label: 'Compare' }]} subtitle="Up to 4 products side by side." />
      <Alert severity="info" sx={{ mb: 3, borderRadius: `${tokens.radius.md}px` }}>
        Product compare is switched off on mysupreme.ca today. This template shows how it would look if it is turned back on in Magento.
      </Alert>
      <Box sx={{ overflowX: 'auto', bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.lg}px` }}>
        <Box component="table" sx={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', '& td, & th': { p: 2, borderBottom: `1px solid ${c.line}`, verticalAlign: 'top', textAlign: 'left', fontSize: 14 } }}>
          <thead>
            <tr>
              <Box component="th" sx={{ width: 150, color: c.text3, fontWeight: 600 }} />
              {items.map((p) => (
                <Box component="th" key={p.sku} sx={{ position: 'relative', width: '25%' }}>
                  <IconButton aria-label={`Remove ${p.name}`} size="small" sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1, bgcolor: '#fff', border: `1px solid ${c.line}` }}><CloseRounded fontSize="small" /></IconButton>
                  <Box sx={{ width: 140 }}><ProductImage src={p.images[0]} alt={p.name} brand={p.brand} /></Box>
                  <Typography component={RouterLink} to={`/p/${p.slug}`} sx={{ display: 'block', mt: 1.5, fontWeight: 600, fontSize: 14, color: c.ink, textDecoration: 'none', '&:hover': { color: c.red } }}>{p.name}</Typography>
                  <Box sx={{ mt: 1.5 }}><AddToCart product={p} size="sm" /></Box>
                </Box>
              ))}
              <Box component="th" sx={{ width: '20%' }}>
                <Button component={RouterLink} to="/c/beverage" variant="outlined" startIcon={<AddRounded />} sx={{ borderStyle: 'dashed', width: '100%', height: 140 }}>Add product</Button>
              </Box>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label}>
                <Box component="th" sx={{ color: c.text3, fontWeight: 600, bgcolor: c.bg }}>{label}</Box>
                {items.map((p) => <td key={p.sku}>{fn(p)}</td>)}
                <td />
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Container>
  )
}
