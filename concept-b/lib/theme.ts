import { createTheme } from '@mui/material/styles'

// Copied from the real site: components/theme.ts
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#FF0000', dark: '#FF0000', contrastText: '#ffffff' },
    secondary: { main: '#2d297d', light: '#d1e4ff', contrastText: '#ffffff' },
    success: { main: '#01d26a' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#0F0F10', secondary: '#03031755', disabled: '#03031735' },
  },
  breakpoints: { values: { xs: 0, sm: 500, md: 800, lg: 1100, xl: 1500 } },
  shape: { borderRadius: 3 },
  typography: {
    fontFamily: 'Poppins,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif',
  },
})

/** Colours used across the real components (see CLAUDE.md §3). */
export const colors = {
  red: '#FF0000',
  redAccent: '#FF413D',
  redAccentHover: '#e63939',
  /** AA-safe red for text-bearing buttons in changed sections (5.5:1 with white). */
  redAA: '#D50000',
  navy: '#2d297d',
  ink: '#0C0C0C',
  ink2: '#111827',
  text2: '#4B5563',
  text3: '#6B7280',
  text4: '#9CA3AF',
  surface: '#F9FAFB',
  surface2: '#F3F4F6',
  blueCard: '#EBF2FE',
  line: '#E5E7EB',
  line2: '#D1D5DB',
  chipLine: '#EAEAEA',
}
