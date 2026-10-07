import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import type { Category, Product } from '../../lib/data'
import { colors, motion, radius } from '../../lib/theme'
import Section from '../ui/Section'
import ProductRail from '../Product/ProductRail'

/*
 * Trending by department: pill tabs per department + a ranked product rail.
 * Existing data: production feeds each tab from the Algolia trending-items call the site already uses
 * (lib/algoliatrendingproducts), filtered by category. The prototype uses seeded products per department.
 */

type Props = { departments: Category[]; productsByDepartment: Record<string, Product[]>; limit?: number; initialTab?: string }

export default function TrendingByDepartment({ departments, productsByDepartment, limit = 10, initialTab }: Props) {
  const tabs = departments.filter((d) => (productsByDepartment[d.url_key] ?? []).length > 0)
  const [active, setActive] = useState(initialTab ?? tabs[0]?.url_key)
  const tablist = useRef<HTMLDivElement>(null)
  // Keep the selected pill visible in the scrolling tab row without moving the page.
  useEffect(() => {
    const list = tablist.current
    const tab = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (list && tab) list.scrollTo({ left: Math.max(0, tab.offsetLeft - 16), behavior: 'smooth' })
  }, [active])
  if (!tabs.length) return null
  const dept = tabs.find((d) => d.url_key === active) ?? tabs[0]
  const items = (productsByDepartment[dept.url_key] ?? []).slice(0, limit)
  const move = (dir: 1 | -1) => {
    const i = tabs.findIndex((t) => t.url_key === dept.url_key)
    const next = tabs[(i + dir + tabs.length) % tabs.length]
    setActive(next.url_key)
    window.setTimeout(() => document.getElementById(`trend-tab-${next.url_key}`)?.focus(), 0)
  }

  return (
    <Section id="trending" eyebrow="Trending now" title="Popular in every department" subtitle="What kitchens are ordering most this week" action={{ label: `Shop all ${dept.name}`, href: `/${dept.url_key}` }}>
      <Box ref={tablist} role="tablist" aria-label="Departments" sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1.5, mb: 1, mx: -0.5, px: 0.5, pt: 0.5, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
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
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(d.url_key)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
                if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
              }}
              sx={{
                flex: '0 0 auto', height: 40, px: 2, borderRadius: radius.pill, font: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                border: `1px solid ${on ? colors.ink : colors.line2}`, bgcolor: on ? colors.ink : '#fff', color: on ? '#fff' : colors.ink,
                transition: `background-color ${motion.fast}, border-color ${motion.fast}, color ${motion.fast}`, '&:hover': { borderColor: colors.ink },
                '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 },
              }}
            >
              {d.name}
            </Box>
          )
        })}
      </Box>
      <Box id="trend-panel" role="tabpanel" aria-labelledby={`trend-tab-${dept.url_key}`}>
        <ProductRail key={dept.url_key} products={items} label={`Trending in ${dept.name}`} badge={(_, i) => ({ label: `#${i + 1}`, tone: i < 3 ? 'red' : 'ink' })} />
      </Box>
    </Section>
  )
}
