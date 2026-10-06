import { createTheme, alpha } from '@mui/material/styles'

/**
 * Concept A — "Pro Counter" design tokens.
 * Every value here is meant to be copied 1:1 into the GraphCommerce MUI theme at hand-off.
 */
export const tokens = {
  color: {
    // Brand red. #FF0000 stays for the crown/logo and non-text accents only (4.0:1 on white).
    brandRed: '#FF0000',
    red: '#D50000', // text-bearing buttons, links, prices on sale — 5.5:1 with white
    redDark: '#A30000', // hover / pressed
    redTint: '#FFF0EE', // soft backgrounds, chips
    navy: '#2D297D', // logo wordmark, headings, dark sections — 11.6:1 on white
    navyDark: '#1B1950',
    navyTint: '#EEEDF9',
    saffron: '#FFC531', // deal highlight on navy only (never text on white)
    ink: '#111827',
    text2: '#4B5563',
    text3: '#6B7280',
    bg: '#F7F7F8',
    surface: '#FFFFFF',
    surface2: '#F3F4F6',
    line: '#E5E7EB',
    line2: '#D1D5DB',
    success: '#01D26A', // fills/icons only
    successText: '#05753D',
    successTint: '#E7F9EF',
    warning: '#B45309',
    warningTint: '#FEF3E2',
    info: '#1D4ED8',
    infoTint: '#EAF0FE',
    error: '#C62828',
    errorTint: '#FDECEC',
  },
  radius: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 },
  shadow: {
    card: '0 1px 2px rgba(17,24,39,.04), 0 1px 1px rgba(17,24,39,.03)',
    hover: '0 12px 28px -10px rgba(17,24,39,.18), 0 2px 6px rgba(17,24,39,.06)',
    pop: '0 24px 60px -20px rgba(27,25,80,.35), 0 6px 18px rgba(17,24,39,.08)',
  },
  font: {
    sans: '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  container: 1500,
}

const c = tokens.color

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 500, md: 800, lg: 1100, xl: 1500 } },
  palette: {
    mode: 'light',
    primary: { main: c.red, dark: c.redDark, light: '#FF413D', contrastText: '#fff' },
    secondary: { main: c.navy, dark: c.navyDark, light: '#4B47A8', contrastText: '#fff' },
    success: { main: c.successText, light: c.success, contrastText: '#fff' },
    warning: { main: c.warning, contrastText: '#fff' },
    info: { main: c.info, contrastText: '#fff' },
    error: { main: c.error, contrastText: '#fff' },
    text: { primary: c.ink, secondary: c.text2, disabled: '#9CA3AF' },
    divider: c.line,
    background: { default: c.bg, paper: c.surface },
  },
  shape: { borderRadius: tokens.radius.sm },
  typography: {
    fontFamily: tokens.font.sans,
    h1: { fontWeight: 800, fontSize: 'clamp(2rem, 1.2rem + 2.6vw, 3.25rem)', lineHeight: 1.08, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: 'clamp(1.5rem, 1.1rem + 1.3vw, 2.25rem)', lineHeight: 1.15, letterSpacing: '-0.015em' },
    h3: { fontWeight: 700, fontSize: 'clamp(1.25rem, 1.05rem + .7vw, 1.625rem)', lineHeight: 1.25, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
    h5: { fontWeight: 600, fontSize: '1.0625rem', lineHeight: 1.35 },
    h6: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, fontSize: '1rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.55 },
    caption: { fontSize: '0.75rem', lineHeight: 1.45 },
    overline: { fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.12em', lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: c.bg } } },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          minHeight: 44,
          paddingInline: 18,
          fontSize: '0.9375rem',
          '&.Mui-focusVisible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 2 },
        },
        sizeSmall: { minHeight: 36, paddingInline: 12, fontSize: '0.8125rem' },
        sizeLarge: { minHeight: 52, paddingInline: 24, fontSize: '1rem', borderRadius: tokens.radius.md },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
        containedPrimary: { '&:hover': { backgroundColor: c.redDark } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 1 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: tokens.radius.pill },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { rounded: { borderRadius: tokens.radius.md } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: tokens.radius.md, border: `1px solid ${c.line}` } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: c.line2 },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: c.text3 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.navy, borderWidth: 2 },
        },
        input: { minHeight: 22 },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { '&.Mui-focused': { color: c.navy } } } },
    MuiTab: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 48, fontSize: '0.9375rem' } },
    },
    MuiTabs: { styleOverrides: { indicator: { height: 3, borderRadius: 3 } } },
    MuiTooltip: {
      styleOverrides: { tooltip: { backgroundColor: c.navyDark, fontSize: '0.75rem', borderRadius: tokens.radius.xs } },
    },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: tokens.radius.sm } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: tokens.radius.lg } } },
    MuiDrawer: { styleOverrides: { paper: { borderRadius: 0 } } },
    MuiCheckbox: { styleOverrides: { root: { padding: 10 } } },
    MuiSkeleton: { defaultProps: { animation: 'wave' }, styleOverrides: { root: { backgroundColor: c.surface2 } } },
    MuiLink: { defaultProps: { underline: 'hover' } },
  },
})

export default theme
