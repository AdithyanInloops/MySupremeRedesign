import { useState } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Chip, FormControlLabel, InputAdornment, InputBase,
  Slider, Stack, Switch, TextField, Typography,
} from '@mui/material'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import SearchRounded from '@mui/icons-material/SearchRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import { tokens } from '../../../theme'

const c = tokens.color

export type Facet = { value: string; count: number }
export type FilterState = {
  sub: string[]
  brand: string[]
  pack: string[]
  price: [number, number]
  inStock: boolean
}
export const PRICE_MAX = 200
export const emptyFilters = (): FilterState => ({ sub: [], brand: [], pack: [], price: [0, PRICE_MAX], inStock: false })

export const activeCount = (f: FilterState) =>
  f.sub.length + f.brand.length + f.pack.length + (f.price[0] > 0 || f.price[1] < PRICE_MAX ? 1 : 0) + (f.inStock ? 1 : 0)

function CheckList({
  facets, selected, onToggle, searchable, initial = 6, label,
}: { facets: Facet[]; selected: string[]; onToggle: (v: string) => void; searchable?: boolean; initial?: number; label: string }) {
  const [q, setQ] = useState('')
  const [more, setMore] = useState(false)
  const list = facets.filter((f) => f.value.toLowerCase().includes(q.toLowerCase()))
  const shown = more || q ? list : list.slice(0, initial)
  return (
    <Box>
      {searchable && (
        <InputBase
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${facets.length} ${label.toLowerCase()}s`}
          inputProps={{ 'aria-label': `Search ${label}` }}
          startAdornment={<SearchRounded sx={{ fontSize: 18, color: c.text3, mr: 1 }} />}
          endAdornment={q ? <CloseRounded onClick={() => setQ('')} sx={{ fontSize: 18, cursor: 'pointer', color: c.text3 }} /> : undefined}
          sx={{ width: '100%', height: 40, px: 1.25, mb: 1, border: `1px solid ${c.line2}`, borderRadius: `${tokens.radius.sm}px`, fontSize: 14, bgcolor: '#fff', '&.Mui-focused': { borderColor: c.navy } }}
        />
      )}
      <Box sx={{ maxHeight: more ? 300 : 'none', overflowY: more ? 'auto' : 'visible', mx: -1 }}>
        {shown.map((f) => (
          <FormControlLabel
            key={f.value}
            control={<Checkbox size="small" checked={selected.includes(f.value)} onChange={() => onToggle(f.value)} />}
            label={
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', gap: 1 }}>
                <Box component="span" sx={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.value}</Box>
                <Box component="span" sx={{ fontSize: 12, color: c.text3, flexShrink: 0 }}>{f.count}</Box>
              </Stack>
            }
            disabled={f.count === 0 && !selected.includes(f.value)}
            sx={{ display: 'flex', m: 0, mr: 0, minHeight: 40, '& .MuiFormControlLabel-label': { flex: 1, minWidth: 0 }, borderRadius: 1, '&:hover': { bgcolor: c.bg } }}
          />
        ))}
        {!shown.length && <Typography sx={{ fontSize: 13, color: c.text3, px: 1, py: 1 }}>No {label.toLowerCase()} matches “{q}”</Typography>}
      </Box>
      {!q && list.length > initial && (
        <Button size="small" onClick={() => setMore((m) => !m)} sx={{ mt: 0.5, color: c.navy, ml: -1 }}>
          {more ? 'Show less' : `Show ${list.length - initial} more`}
        </Button>
      )}
    </Box>
  )
}

function Group({ title, children, count, defaultExpanded = true }: { title: string; children: React.ReactNode; count?: number; defaultExpanded?: boolean }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{ bgcolor: 'transparent', borderBottom: `1px solid ${c.line}`, '&::before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={{ px: 0, minHeight: 52, '& .MuiAccordionSummary-content': { my: 1 } }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14.5 }}>
          {title}
          {!!count && <Box component="span" sx={{ ml: 1, px: 0.75, borderRadius: 999, bgcolor: c.red, color: '#fff', fontSize: 11 }}>{count}</Box>}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>{children}</AccordionDetails>
    </Accordion>
  )
}

export function FilterPanel({
  filters, setFilters, subFacets, brandFacets, packFacets, inStockCount,
}: {
  filters: FilterState
  setFilters: (f: FilterState) => void
  subFacets: Facet[]
  brandFacets: Facet[]
  packFacets: Facet[]
  inStockCount: number
}) {
  const toggle = (key: 'sub' | 'brand' | 'pack', v: string) => {
    const cur = filters[key]
    setFilters({ ...filters, [key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] })
  }
  return (
    <Box>
      {subFacets.length > 0 && (
        <Group title="Sub-category" count={filters.sub.length}>
          <CheckList label="Sub-category" facets={subFacets} selected={filters.sub} onToggle={(v) => toggle('sub', v)} initial={7} />
        </Group>
      )}
      <Group title="Brand" count={filters.brand.length}>
        <CheckList label="Brand" facets={brandFacets} selected={filters.brand} onToggle={(v) => toggle('brand', v)} searchable initial={6} />
      </Group>
      <Group title="Price" count={filters.price[0] > 0 || filters.price[1] < PRICE_MAX ? 1 : 0}>
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.price}
            min={0}
            max={PRICE_MAX}
            step={5}
            onChange={(_, v) => setFilters({ ...filters, price: v as [number, number] })}
            getAriaLabel={(i) => (i === 0 ? 'Minimum price' : 'Maximum price')}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `$${v}`}
            sx={{ color: c.navy }}
          />
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          {[0, 1].map((i) => (
            <TextField
              key={i}
              size="small"
              label={i === 0 ? 'Min' : 'Max'}
              value={filters.price[i]}
              onChange={(e) => {
                const v = Math.max(0, Math.min(PRICE_MAX, parseInt(e.target.value.replace(/\D/g, '') || '0', 10)))
                const p: [number, number] = [...filters.price]
                p[i] = v
                setFilters({ ...filters, price: p })
              }}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
              inputProps={{ inputMode: 'numeric' }}
              sx={{ flex: 1 }}
            />
          ))}
        </Stack>
      </Group>
      <Group title="Pack type" count={filters.pack.length}>
        <CheckList label="Pack type" facets={packFacets} selected={filters.pack} onToggle={(v) => toggle('pack', v)} />
      </Group>
      <Group title="Availability" count={filters.inStock ? 1 : 0}>
        <FormControlLabel
          control={<Switch checked={filters.inStock} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} />}
          label={<Box component="span" sx={{ fontSize: 14 }}>In stock only <Box component="span" sx={{ color: c.text3, fontSize: 12 }}>({inStockCount})</Box></Box>}
          sx={{ minHeight: 44 }}
        />
      </Group>
    </Box>
  )
}

export function AppliedChips({ filters, setFilters }: { filters: FilterState; setFilters: (f: FilterState) => void }) {
  const chips: { label: string; remove: () => void }[] = []
  filters.sub.forEach((v) => chips.push({ label: v, remove: () => setFilters({ ...filters, sub: filters.sub.filter((x) => x !== v) }) }))
  filters.brand.forEach((v) => chips.push({ label: v, remove: () => setFilters({ ...filters, brand: filters.brand.filter((x) => x !== v) }) }))
  filters.pack.forEach((v) => chips.push({ label: v, remove: () => setFilters({ ...filters, pack: filters.pack.filter((x) => x !== v) }) }))
  if (filters.price[0] > 0 || filters.price[1] < PRICE_MAX)
    chips.push({ label: `$${filters.price[0]} – $${filters.price[1]}`, remove: () => setFilters({ ...filters, price: [0, PRICE_MAX] }) })
  if (filters.inStock) chips.push({ label: 'In stock only', remove: () => setFilters({ ...filters, inStock: false }) })
  if (!chips.length) return null
  return (
    <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mb: 2 }}>
      {chips.map((ch) => (
        <Chip
          key={ch.label}
          label={ch.label}
          onDelete={ch.remove}
          deleteIcon={<CloseRounded aria-label={`Remove ${ch.label}`} />}
          sx={{ bgcolor: c.navyTint, color: c.navy, height: 36, '& .MuiChip-deleteIcon': { color: c.navy, fontSize: 18 } }}
        />
      ))}
      <Button size="small" onClick={() => setFilters(emptyFilters())} sx={{ color: c.red, fontWeight: 700 }}>
        Clear all
      </Button>
    </Stack>
  )
}
