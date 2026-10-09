import { useMemo, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { tokens } from '../theme'
import { useApp } from '../state/app'
import { warehouses } from '../data/catalog'
import { Segmented, TopBar } from '../components/ui'
import { CopyIcon, InfoIcon } from '../components/icons'
import { CmsSection } from '../cms/OfferBlocks'
import { isLive, parseBlock } from '../cms/resolve'
import offerHero from '../cms/json/offer-hero.json'
import flyerTiles from '../cms/json/flyer-tiles.json'
import dealProducts from '../cms/json/deal-products.json'
import flyerTabs from '../cms/json/flyer-tabs.json'

const c = tokens.color

type Field = [name: string, required: boolean, note: string]
const COMMON: Field[] = [
  ['title', false, 'Section heading. Leave out to continue the block above.'],
  ['show_all_link', false, 'Adds “Show all ›”. category/<url_key>, product/<sku>, search/<term>, page/flyers or https://…'],
  ['starts_at · ends_at', false, 'ISO dates. The block (or item) only shows inside this window, so it can be scheduled ahead.'],
  ['warehouses', false, 'mis, ham, nia. Leave out to show at every warehouse.'],
]

const SAMPLES: { raw: unknown; name: string; purpose: string; fields: Field[] }[] = [
  {
    raw: flyerTabs,
    name: 'Flyer tabs',
    purpose: 'Used on Home with show_tabs: false — one “All offers” poster merging every flyer’s deals, with Add to cart. Turn tabs on and each flyer gets its own tab. Each flyer is just a label, a colour and a Magento category.',
    fields: [
      ['tabs[].label', true, 'Tab name, e.g. “Bulk Saver”.'],
      ['tabs[].source', true, '{ "category": "<url_key>" } or { "skus": [...] }, optional "limit" (default 10).'],
      ['tabs[].accent · icon', false, 'sage | mint | seafoam | pistachio · tag | flame | calendar | box | utensils.'],
      ['tabs[].headline', false, 'Default “Save up to {max_off}%”; {max_off} is filled from the products’ discounts.'],
      ['tabs[].body', false, 'One line under the headline.'],
      ['tabs[].ends_at', false, 'Shows “Ends in …”; the tab disappears afterwards.'],
      ['tabs[].link', false, '“View the full flyer” target. Default: the source category.'],
      ['all_tab · all_accent', false, 'Label and colour of the poster merging every flyer (default “All offers”, sage); all_tab: false hides it when tabs are on.'],
      ['show_tabs', false, 'Default true. false (Home) = no tab row, only the merged poster.'],
    ],
  },
  {
    raw: offerHero,
    name: 'Flyer hero banner',
    purpose: 'Marketing uploads the flyer artwork; the app adds the countdown and the % sticker, so one image works all week. The fourth item has ended, so it’s hidden automatically.',
    fields: [
      ['items[].src', true, '16:9 artwork, 1600×900. Keep the top-right and bottom-left corners free (sticker, countdown).'],
      ['items[].title', true, 'Alt text: what the artwork says.'],
      ['items[].link', false, 'Where a tap goes (same formats as show_all_link).'],
      ['items[].sticker', false, 'Up to 14 characters, drawn by the app, e.g. “UP TO 28% OFF”.'],
      ['items[].countdown', false, 'false hides the countdown chip (shown by default when ends_at is set).'],
    ],
  },
  {
    raw: flyerTiles,
    name: 'Flyer tiles',
    purpose: 'A grid of flyer covers. Use an uploaded cover (src) or leave src out and the app draws the tile from the title, colour and icon — no design work needed.',
    fields: [
      ['items[].title', true, 'Flyer name.'],
      ['items[].link', true, 'Usually category/<flyer url_key>.'],
      ['items[].src', false, '4:5 cover, 800×1000; keep the bottom-left corner free (countdown). Leave out for an app-drawn tile.'],
      ['items[].accent · icon · sticker', false, 'For app-drawn tiles.'],
      ['items[].subtitle', false, 'One short line.'],
      ['columns', false, '2 (default) or 3.'],
    ],
  },
  {
    raw: dealProducts,
    name: 'Deal products rail',
    purpose: 'A swipe row of deal cards from a category or a hand-picked SKU list — the Home product card with the offer price, the regular price struck through and the saving, all from Magento.',
    fields: [
      ['source.category', false, 'Flyer category url_key; products sorted by biggest discount.'],
      ['source.skus', false, 'Hand-picked SKUs, shown in this order. One of category or skus is required.'],
      ['source.limit', false, 'Default 10, max 30.'],
    ],
  },
]

/** Count of items a block hides right now (dates / warehouse), for the notes under each preview. */
function hiddenCount(raw: unknown, warehouse: string) {
  const o = (raw ?? {}) as { items?: object[]; tabs?: object[] }
  const list = (o.items ?? o.tabs ?? []) as Parameters<typeof isLive>[0][]
  return list.filter((it) => !isLive(it, warehouse)).length
}

/**
 * Developer / content-team reference: every Offers & Flyers block as it renders, the exact JSON behind it (what goes in
 * the CMS entry's variant field) and its fields. Switch warehouse to see warehouse-only items come and go.
 */
export default function CmsShowcase() {
  const { warehouse, setWarehouse, notify } = useApp()
  const [open, setOpen] = useState<number | null>(0)
  const parsed = useMemo(() => SAMPLES.map((s) => { const issues: string[] = []; return { block: parseBlock(s.raw, issues), issues } }), [])
  const copy = async (raw: unknown) => { try { await navigator.clipboard.writeText(JSON.stringify(raw, null, 2)) } catch { /* blocked */ } notify({ message: 'JSON copied', tone: 'info' }) }

  return (
    <Box sx={{ pb: 4 }}>
      <TopBar title="Offers: CMS blocks" subtitle="How the section is managed in Magento" />
      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ p: 1.75, borderRadius: `${tokens.radius.md}px`, bgcolor: c.navyTint, color: c.navy, display: 'flex', gap: 1.25 }}>
          <InfoIcon sx={{ mt: 0.25, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13.5, lineHeight: 1.5 }}>
            Each block is one CMS entry using an existing app block type — <b>banner</b>, <b>rail</b> or <b>grid</b> — with a <b>variant</b> and the JSON below stored in its variant field.
            Content managers only enter text, images, links, dates and which products; prices come from Magento. Change the JSON and the app updates, no release.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: c.text2, mt: 2, mb: 0.75 }}>Preview as warehouse</Typography>
        <Segmented label="Preview as warehouse" value={warehouse} onChange={setWarehouse} options={warehouses.map((w) => ({ value: w.id, label: w.name }))} />
      </Box>

      {SAMPLES.map((s, i) => {
        const { block, issues } = parsed[i]
        const raw = s.raw as { type: string; variant: string }
        const hidden = hiddenCount(s.raw, warehouse)
        return (
          <Box key={s.name} component="section" aria-labelledby={`cms-${i}`} sx={{ mt: 3.5, borderTop: `8px solid ${c.bg}` }}>
            <Box sx={{ px: 2, pt: 2 }}>
              <Box component="code" sx={{ display: 'inline-block', fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 500, color: '#24563D', bgcolor: '#E2ECE4', px: 1, py: 0.25, borderRadius: 1 }}>{raw.type} · {raw.variant}</Box>
              <Typography id={`cms-${i}`} component="h2" sx={{ fontSize: 18, fontWeight: 700, mt: 0.75 }}>{s.name}</Typography>
              <Typography sx={{ fontSize: 13.5, color: c.text2, mt: 0.25, lineHeight: 1.5 }}>{s.purpose}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#fff', pb: 2.5, mt: 0.5 }}>
              {block ? <CmsSection block={block} mt={1.5} /> : <Typography sx={{ px: 2, py: 2, color: c.error }}>Block is invalid and would be skipped.</Typography>}
            </Box>
            {(hidden > 0 || issues.length > 0) && (
              <Box sx={{ px: 2, pt: 1 }}>
                {hidden > 0 && <Typography sx={{ fontSize: 12.5, color: c.text3 }}>{hidden} {hidden === 1 ? 'item is' : 'items are'} hidden now (outside its dates or not offered at this warehouse).</Typography>}
                {issues.map((m) => <Typography key={m} sx={{ fontSize: 12.5, color: c.error }}>{m}</Typography>)}
              </Box>
            )}
            <Box sx={{ px: 2, pt: 1.5, display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" color="secondary" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`cms-json-${i}`}>{open === i ? 'Hide JSON & fields' : 'Show JSON & fields'}</Button>
              <Button size="small" startIcon={<CopyIcon />} onClick={() => copy(s.raw)} sx={{ color: c.navy }}>Copy JSON</Button>
            </Box>
            {open === i && (
              <Box id={`cms-json-${i}`} sx={{ px: 2, pt: 1.25 }}>
                <Box component="pre" tabIndex={0} aria-label={`${s.name} JSON`} sx={{ m: 0, p: 1.5, maxHeight: 340, overflow: 'auto', borderRadius: `${tokens.radius.sm}px`, bgcolor: '#111827', color: '#E5E7EB', fontFamily: tokens.font.mono, fontSize: 11.5, lineHeight: 1.55 }}>
                  {JSON.stringify(s.raw, null, 2)}
                </Box>
                <Box component="dl" sx={{ m: 0, mt: 1.5, bgcolor: '#fff', border: `1px solid ${c.line}`, borderRadius: `${tokens.radius.sm}px`, '& > div + div': { borderTop: `1px solid ${c.line}` } }}>
                  {[...s.fields, ...COMMON].map(([name, req, note]) => (
                    <Box key={name} sx={{ px: 1.5, py: 1 }}>
                      <Box component="dt" sx={{ fontFamily: tokens.font.mono, fontSize: 12, fontWeight: 500, color: c.ink }}>
                        {name}{req && <Box component="span" sx={{ ml: 0.75, fontFamily: tokens.font.sans, fontSize: 10.5, fontWeight: 700, color: '#24563D', bgcolor: '#E2ECE4', px: 0.5, borderRadius: 0.5 }}>required</Box>}
                      </Box>
                      <Box component="dd" sx={{ m: 0, mt: 0.25, fontSize: 12.5, color: c.text2, lineHeight: 1.45 }}>{note}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
