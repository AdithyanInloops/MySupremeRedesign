import type { ReactNode } from 'react'
import { Box, Radio, Typography } from '@mui/material'
import type { Address } from '../../lib/session'
import { formatPostal } from '../../lib/validate'
import { colors, motion, radius } from '../../lib/theme'
import Field from '../ui/Field'

/**
 * Selectable option card (delivery method, slot, payment method). Native radio inside a label, so it works with
 * arrow keys and screen readers; the whole card is the click target. Disabled cards explain why.
 */
export function RadioCard({
  name, value, checked, onChange, title, description, icon, aside, disabled, disabledReason, children,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  aside?: ReactNode
  disabled?: boolean
  disabledReason?: ReactNode
  children?: ReactNode
}) {
  return (
    <Box
      sx={{
        borderRadius: radius.lg, border: `${checked ? 2 : 1}px solid ${checked ? colors.ink : colors.line2}`, bgcolor: disabled ? colors.subtle : '#fff',
        transition: `border-color ${motion.fast}, box-shadow ${motion.fast}`, '&:hover': disabled || checked ? {} : { borderColor: colors.ink400 },
        '&:focus-within': { boxShadow: `0 0 0 3px ${colors.navyTint}` }, m: checked ? 0 : '1px',
      }}
    >
      <Box component="label" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, p: 1.75, cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <Radio name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} sx={{ p: 0.25, mt: '-1px' }} inputProps={{ 'aria-describedby': description || disabledReason ? `${name}-${value}-desc` : undefined }} />
        {icon && <Box sx={{ color: disabled ? colors.ink400 : colors.ink600, display: 'flex', mt: '1px' }}>{icon}</Box>}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: disabled ? colors.ink500 : colors.ink }}>{title}</Typography>
          {(description || disabledReason) && (
            <Typography id={`${name}-${value}-desc`} component="div" sx={{ fontSize: 13.5, color: disabled ? colors.warning : colors.ink600, mt: 0.25 }}>
              {disabled && disabledReason ? disabledReason : description}
            </Typography>
          )}
        </Box>
        {aside && <Box sx={{ flexShrink: 0, fontWeight: 600, fontSize: 14.5, color: disabled ? colors.ink400 : colors.ink }}>{aside}</Box>}
      </Box>
      {checked && children && <Box sx={{ px: 1.75, pb: 1.75, pt: 0 }}>{children}</Box>}
    </Box>
  )
}

/** Business address form. Google Places autocomplete fills these on the live site; here they're plain fields. */
export function AddressForm({
  prefix, value, onChange, errors, showBusiness = true, onPostalBlur,
}: {
  prefix: string
  value: Address
  onChange: (a: Address) => void
  errors: Partial<Record<keyof Address, string>>
  showBusiness?: boolean
  onPostalBlur?: () => void
}) {
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...value, [k]: k === 'postal' ? formatPostal(e.target.value) : e.target.value })
  const id = (k: string) => `${prefix}-${k}`
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0,1fr)', sm: 'minmax(0,1fr) minmax(0,1fr)' } }}>
      {showBusiness && <Box sx={{ gridColumn: '1 / -1' }}><Field id={id('business')} label="Business name" value={value.business} onChange={set('business')} error={errors.business} autoComplete="organization" /></Box>}
      <Field id={id('contact')} label="Contact name" value={value.contact} onChange={set('contact')} error={errors.contact} autoComplete="name" />
      <Field id={id('phone')} label="Phone" value={value.phone} onChange={set('phone')} error={errors.phone} type="tel" autoComplete="tel" hint="For delivery updates by text" inputProps={{ inputMode: 'tel' }} />
      <Box sx={{ gridColumn: '1 / -1' }}>
        <Field id={id('street')} label="Street address" value={value.street} onChange={set('street')} error={errors.street} autoComplete="address-line1" hint="Start typing — on the live site we suggest matching addresses" />
      </Box>
      <Field id={id('unit')} label="Unit, suite or dock" optional value={value.unit} onChange={set('unit')} autoComplete="address-line2" />
      <Field id={id('city')} label="City" value={value.city} onChange={set('city')} error={errors.city} autoComplete="address-level2" />
      <Field id={id('province')} label="Province" value="Ontario" disabled hint="We deliver within Ontario" InputProps={{ readOnly: true }} />
      <Field
        id={id('postal')}
        label="Postal code"
        value={value.postal}
        onChange={set('postal')}
        onBlur={onPostalBlur}
        error={errors.postal}
        autoComplete="postal-code"
        placeholder="L5L 0A2"
        inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 7 }}
      />
    </Box>
  )
}

/** Read-only address block (summaries, review steps). */
export function AddressBlock({ a }: { a: Address }) {
  return (
    <Box component="address" sx={{ fontStyle: 'normal', fontSize: 14.5, color: colors.ink700, lineHeight: 1.6 }}>
      {a.business && <Box sx={{ fontWeight: 600, color: colors.ink }}>{a.business}</Box>}
      <div>{a.contact}{a.phone ? ` · ${a.phone}` : ''}</div>
      <div>{a.street}{a.unit ? `, ${a.unit}` : ''}</div>
      <div>{a.city}, ON {a.postal}</div>
    </Box>
  )
}
