import { Box, TextField, type TextFieldProps } from '@mui/material'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { colors } from '../../lib/theme'

/**
 * Form field with the label above the input (always visible, unlike placeholder-only labels), an optional hint,
 * and an error that explains what's wrong and how to fix it. Optional fields are marked "(optional)"; everything
 * else is required, which keeps forms free of asterisk noise.
 */
export type FieldProps = Omit<TextFieldProps, 'label' | 'error' | 'helperText'> & {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

export default function Field({ id, label, hint, error, optional, ...props }: FieldProps) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box component="label" htmlFor={id} sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, fontSize: 14, fontWeight: 500, color: colors.ink, mb: 0.75 }}>
        {label}
        {optional && <Box component="span" sx={{ fontSize: 13, fontWeight: 400, color: colors.ink500 }}>(optional)</Box>}
      </Box>
      <TextField
        id={id}
        fullWidth
        error={!!error}
        required={!optional}
        helperText={
          error ? (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'flex-start', gap: 0.5, color: colors.error }}>
              <ErrorOutlineRoundedIcon sx={{ fontSize: 16, mt: '1px' }} /> {error}
            </Box>
          ) : hint
        }
        {...props}
        inputProps={{ 'aria-required': !optional, ...(props.inputProps ?? {}) }}
        // Native "required" bubbles would fight our inline errors.
        InputLabelProps={{ required: false }}
        sx={{ '& .MuiInputBase-root': { minHeight: 46 }, ...((props.sx as object) ?? {}) }}
      />
    </Box>
  )
}
