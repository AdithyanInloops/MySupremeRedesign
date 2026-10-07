import { useState } from 'react'
import { Box, IconButton, Tooltip, Typography, type SxProps, type Theme } from '@mui/material'
import { finalPrice, money, packSize, percentOff, regularPrice, type Product } from '../../lib/data'
import { colors, mono, radius, srOnly } from '../../lib/theme'
import { CheckIcon, CopyIcon } from './icons'

/** SKU in small mono text — never wraps the layout, even for 17-digit barcodes. Optional copy button (product page). */
export function Sku({ sku, copyable = false, sx }: { sku: string; copyable?: boolean; sx?: SxProps<Theme> }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(sku) } catch { /* clipboard blocked */ }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 0, maxWidth: '100%', ...((sx as object) ?? {}) }}>
      <Typography component="span" sx={{ fontFamily: mono, fontSize: 12, color: colors.ink500, letterSpacing: '.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        SKU {sku}
      </Typography>
      {copyable && (
        <Tooltip title={copied ? 'Copied' : 'Copy SKU'}>
          <IconButton size="small" onClick={copy} aria-label={copied ? 'SKU copied' : `Copy SKU ${sku}`} sx={{ width: 32, height: 32, color: copied ? colors.success : colors.ink500 }}>
            {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 15 }} />}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

/** One consistent pack-size chip for free-text Magento values ("1ltr", "24x1L in a case", "500 ct"). */
export function PackChip({ product, text, size = 'sm' }: { product?: Product; text?: string; size?: 'sm' | 'md' }) {
  const value = text ?? (product ? packSize(product) : '')
  if (!value) return null
  return (
    <Box
      component="span"
      title={value}
      sx={{
        display: 'inline-block', maxWidth: '100%', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontSize: size === 'md' ? 13 : 12, fontWeight: 500, lineHeight: 1.5, color: colors.ink700,
        bgcolor: colors.sunken, borderRadius: radius.xs, px: size === 'md' ? 1 : 0.75, py: size === 'md' ? 0.25 : 0,
      }}
    >
      {value}
    </Box>
  )
}

/** Final price, crossed-out regular price and % off. Reads as one phrase for screen readers. */
export function Price({ product, size = 'md', showSave = false }: { product: Product; size?: 'sm' | 'md' | 'lg'; showSave?: boolean }) {
  const off = percentOff(product)
  const now = finalPrice(product)
  const was = regularPrice(product)
  const fs = { sm: 15, md: 17, lg: 28 }[size]
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, flexWrap: 'wrap', minWidth: 0 }}>
      <Typography component="span" sx={{ fontSize: fs, fontWeight: 700, color: off ? colors.redText : colors.ink, lineHeight: 1.2, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
        {off > 0 && <Box component="span" sx={srOnly}>Sale price </Box>}
        {money(now)}
      </Typography>
      {off > 0 && (
        <>
          <Typography component="span" sx={{ fontSize: Math.round(fs * 0.72), color: colors.ink500, textDecoration: 'line-through' }}>
            <Box component="span" sx={srOnly}>Regular price </Box>
            {money(was)}
          </Typography>
          {showSave && <Typography component="span" sx={{ fontSize: Math.max(13, Math.round(fs * 0.5)), fontWeight: 600, color: colors.success }}>Save {money(was - now)} ({off}%)</Typography>}
        </>
      )}
    </Box>
  )
}

/** Small "-15%" badge for image corners. */
export function SaleBadge({ product, sx }: { product: Product; sx?: SxProps<Theme> }) {
  const off = percentOff(product)
  if (!off) return null
  return (
    <Box sx={{ bgcolor: colors.red, color: '#fff', fontSize: 12, fontWeight: 700, px: 0.875, lineHeight: '22px', borderRadius: radius.xs, ...((sx as object) ?? {}) }}>
      −{off}%
    </Box>
  )
}
