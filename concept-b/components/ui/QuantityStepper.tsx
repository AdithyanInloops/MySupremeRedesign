import { useEffect, useState } from 'react'
import { Box, IconButton, InputBase } from '@mui/material'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { colors, motion, radius } from '../../lib/theme'

const heights = { sm: 36, md: 44, lg: 52 } as const

/**
 * The one quantity control used everywhere (cards, product page, cart, quick order).
 * The number is typeable (bulk buyers type "24"), committed on Enter/blur; invalid input reverts.
 * `removeAtMin`: at the minimum the "−" becomes a delete button (cart lines, in-cart card controls).
 */
export default function QuantityStepper({
  value, onChange, min = 1, max = 999, size = 'md', label, unit, removeAtMin = false, fullWidth = false,
}: {
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  size?: keyof typeof heights
  /** Accessible name, e.g. "Quantity for Monin Lime Syrup". */
  label: string
  /** Selling unit shown after the number on wide steppers ("pcs", "case"). */
  unit?: string
  removeAtMin?: boolean
  fullWidth?: boolean
}) {
  const h = heights[size]
  const [text, setText] = useState(String(value))
  useEffect(() => setText(String(value)), [value])

  const commit = () => {
    const n = parseInt(text, 10)
    if (Number.isNaN(n)) return setText(String(value))
    const clamped = Math.max(removeAtMin ? 0 : min, Math.min(max, n))
    setText(String(clamped))
    if (clamped !== value) onChange(clamped)
  }
  const atMin = value <= min
  const btn = {
    width: h, height: h - 2, borderRadius: 0, color: colors.ink, flexShrink: 0,
    '&:hover': { bgcolor: colors.sunken }, '&.Mui-disabled': { color: colors.line2 },
    '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: -2, borderRadius: radius.sm },
  } as const
  const icon = { fontSize: size === 'sm' ? 18 : 20 }

  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        display: 'inline-flex', alignItems: 'center', height: h, width: fullWidth ? '100%' : 'auto', flexShrink: 0,
        border: `1px solid ${colors.line2}`, borderRadius: size === 'sm' ? radius.sm : radius.md, bgcolor: '#fff', overflow: 'hidden',
        transition: `border-color ${motion.fast}`, '&:focus-within': { borderColor: colors.ink400 },
      }}
    >
      {removeAtMin && atMin ? (
        <IconButton aria-label="Remove from cart" onClick={() => onChange(0)} sx={{ ...btn, color: colors.redText }}>
          <DeleteOutlineRoundedIcon sx={icon} />
        </IconButton>
      ) : (
        <IconButton aria-label="Decrease quantity" disabled={atMin} onClick={() => onChange(Math.max(min, value - 1))} sx={btn}>
          <RemoveRoundedIcon sx={icon} />
        </IconButton>
      )}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', minWidth: size === 'sm' ? 30 : 40 }}>
        <InputBase
          value={text}
          onChange={(e) => setText(e.target.value.replace(/\D/g, '').slice(0, 3))}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit() }
            if (e.key === 'ArrowUp') { e.preventDefault(); onChange(Math.min(max, value + 1)) }
            if (e.key === 'ArrowDown') { e.preventDefault(); onChange(Math.max(min, value - 1)) }
          }}
          inputProps={{ 'aria-label': 'Quantity', inputMode: 'numeric', style: { textAlign: 'center', padding: 0, width: `${Math.max(2, text.length) + 0.5}ch` } }}
          sx={{ fontSize: size === 'sm' ? 14 : 15.5, fontWeight: 600, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}
        />
        {unit && <Box component="span" sx={{ fontSize: 12, fontWeight: 500, color: colors.ink500, ml: 0.5, textTransform: 'uppercase' }}>{unit}</Box>}
      </Box>
      <IconButton aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} sx={btn}>
        <AddRoundedIcon sx={icon} />
      </IconButton>
    </Box>
  )
}
