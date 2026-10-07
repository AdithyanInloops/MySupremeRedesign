import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Chip, Skeleton, Typography } from '@mui/material'
import ProductListLayout, { type FilterGroup } from '../../components/ProductListLayout/ProductListLayout'
import EmptyState from '../../components/ui/EmptyState'
import { PageContainer } from '../../components/ui/Section'
import { ProductGridSkeleton } from '../../components/ui/Feedback'
import ProductCard from '../../components/Product/ProductCard'
import { useQuickOrder } from '../../components/QuickOrder/QuickOrder'
import { departments, packSize, productBySku, products, searchCategories, searchProducts, type Product } from '../../lib/data'
import { colors, radius } from '../../lib/theme'
import { BadgeCheckIcon, BoltIcon, SearchXIcon } from '../../components/ui/icons'

function brandFilter(list: Product[]): FilterGroup {
  const counts = new Map<string, number>()
  // Magento brand labels; products without a brand aren't counted, like the live Brand facet.
  list.forEach((p) => p.brand_label && counts.set(p.brand_label, (counts.get(p.brand_label) ?? 0) + 1))
  return { code: 'brand', label: 'Brand', options: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, value: label, count })) }
}

/**
 * The snapshot only holds ~130 products, so an all-words match is often thin. Top it up with products that match
 * any word (ranked by how many words match) — closer to how Algolia behaves on the live site.
 */
function withLooseMatches(term: string, exact: Product[]) {
  const words = term.toLowerCase().split(/\s+/).filter((w) => w.length > 2)
  const score = (p: Product) => words.filter((w) => `${p.name} ${p.sku} ${packSize(p)}`.toLowerCase().includes(w)).length
  const loose = products.filter((p) => !exact.includes(p) && score(p) > 0).sort((a, b) => score(b) - score(a))
  return [...exact, ...loose]
}

const POPULAR = ['basmati rice', 'canola oil', 'containers', 'gloves', 'coffee', 'fries']

function NoResults({ term }: { term: string }) {
  const quick = useQuickOrder()
  const cats = searchCategories(term.split(/\s+/)[0] ?? '', 4)
  return (
    <EmptyState
      icon={<SearchXIcon />}
      title={`No products match “${term}”`}
      actions={
        <>
          <Button component={Link} href="/all-categories" variant="contained">Browse all categories</Button>
          <Button variant="outlined" startIcon={<BoltIcon />} onClick={() => quick.open()}>Order by SKU</Button>
        </>
      }
    >
      Check the spelling, use fewer words, or search by SKU. Here are some places to start:
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
        {(cats.length ? cats.map((c) => ({ label: c.name, href: c.href })) : POPULAR.map((p) => ({ label: p, href: `/search/${encodeURIComponent(p)}` }))).map((c) => (
          <Chip key={c.href} component={Link} href={c.href} clickable label={c.label} variant="outlined" />
        ))}
      </Box>
    </EmptyState>
  )
}

export default function SearchPage() {
  const { query, isReady } = useRouter()
  const term = typeof query.term === 'string' ? query.term : ''
  if (!isReady) {
    return (
      <PageContainer sx={{ py: 3 }}>
        <Skeleton width={120} />
        <Skeleton width={360} height={48} />
        <Box sx={{ mt: 3 }}><ProductGridSkeleton count={8} /></Box>
      </PageContainer>
    )
  }
  const results = withLooseMatches(term, searchProducts(term))
  const exact = productBySku(term.trim())
  const deptHint = departments.find((d) => d.name.toLowerCase() === term.trim().toLowerCase())
  return (
    <>
      <Head><title>{`Results for ‘${term}’ | MySupreme`}</title><meta name="robots" content="noindex" /></Head>
      <ProductListLayout
        key={term}
        title={`Results for “${term}”`}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]}
        totalCount={results.length}
        products={results}
        filters={results.length ? [brandFilter(results)] : []}
        description={deptHint ? <>Looking for the whole department? <Link href={`/${deptHint.url_key}`} style={{ color: colors.redText, fontWeight: 600 }}>Shop all {deptHint.name}</Link></> : undefined}
        intro={
          exact ? (
            <Box sx={{ mb: 3, p: 2, borderRadius: radius.lg, bgcolor: colors.successTint, border: `1px solid ${colors.successLine}` }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 600, fontSize: 14.5, mb: 1.5 }}>
                <BadgeCheckIcon sx={{ color: colors.success, fontSize: 20 }} /> Exact SKU match
              </Typography>
              <Box sx={{ maxWidth: 520 }}><ProductCard product={exact} variant="compact" /></Box>
            </Box>
          ) : undefined
        }
        empty={<NoResults term={term} />}
      />
    </>
  )
}
