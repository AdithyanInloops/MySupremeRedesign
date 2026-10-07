import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Box, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { Category, Product } from '../../lib/data'
import ProductCard from '../Product/ProductCard'
import { SectionHeading } from './HomeSection'

/*
 * CONCEPT B — CHANGE #2 (new section, after RecommendedCategories).
 * Pill tabs per department + a product row. Existing data only: production feeds each tab from the
 * Algolia trending-items call already used by the site (lib/algoliatrendingproducts), per category.
 */

const RED_AA = '#D50000'

type Props = {
  departments: Category[]
  /** Products per department url_key, in trending order. */
  productsByDepartment: Record<string, Product[]>
  /** How many cards per tab. */
  limit?: number
  /** Department url_key selected on first render (defaults to the first tab). */
  initialTab?: string
}

export default function TrendingByDepartment({ departments, productsByDepartment, limit = 10, initialTab }: Props) {
  const tabs = departments.filter((d) => (productsByDepartment[d.url_key] ?? []).length > 0)
  const [active, setActive] = useState(initialTab ?? tabs[0]?.url_key)
  const tablist = useRef<HTMLDivElement>(null)
  // Keep the selected pill visible in the horizontally scrolling tab row (mobile) without moving the page.
  useEffect(() => {
    const list = tablist.current
    const tab = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (list && tab) list.scrollLeft = Math.max(0, tab.offsetLeft - 16)
  }, [active])
  if (!tabs.length) return null
  const dept = tabs.find((d) => d.url_key === active) ?? tabs[0]
  const items = (productsByDepartment[dept.url_key] ?? []).slice(0, limit)

  return (
    <Box>
      <SectionHeading
        id="trending-title"
        eyebrow="Trending now"
        title="Popular in every department"
        subtitle="What kitchens are ordering most this week, department by department"
        action={{ label: `Shop all ${dept.name}`, href: `/${dept.url_key}` }}
      />

      <Box
        ref={tablist}
        role="tablist"
        aria-label="Departments"
        sx={{ position: 'relative', display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        {tabs.map((d) => {
          const on = d.url_key === dept.url_key
          return (
            <Box
              key={d.uid}
              component="button"
              role="tab"
              id={`trend-tab-${d.url_key}`}
              aria-selected={on}
              aria-controls="trend-panel"
              onClick={() => setActive(d.url_key)}
              onKeyDown={(e: React.KeyboardEvent) => {
                const i = tabs.findIndex((t) => t.url_key === dept.url_key)
                if (e.key === 'ArrowRight') setActive(tabs[(i + 1) % tabs.length].url_key)
                if (e.key === 'ArrowLeft') setActive(tabs[(i - 1 + tabs.length) % tabs.length].url_key)
              }}
              tabIndex={on ? 0 : -1}
              sx={{
                flex: '0 0 auto', height: 40, px: 2, borderRadius: '40px', font: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                border: `1px solid ${on ? '#FF0000' : '#E5E7EB'}`, bgcolor: on ? '#FF0000' : '#fff', color: on ? '#fff' : '#0C0C0C',
                transition: 'background-color .2s, border-color .2s', '&:hover': { borderColor: '#FF0000' },
                '&:focus-visible': { outline: `3px solid ${RED_AA}`, outlineOffset: 2 },
              }}
            >
              {d.name}
            </Box>
          )
        })}
      </Box>

      <Box
        id="trend-panel"
        role="tabpanel"
        aria-labelledby={`trend-tab-${dept.url_key}`}
        sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, overflowX: 'auto', pb: 1, scrollSnapType: 'x mandatory', '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}
      >
        {items.map((p) => (
          <Box key={p.sku} sx={{ flex: '0 0 auto', width: { xs: 175, sm: 200, md: 220, lg: 237 }, scrollSnapAlign: 'start' }}>
            <ProductCard product={p} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
