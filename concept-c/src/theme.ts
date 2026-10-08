import { createElement } from 'react'
import { createTheme, alpha } from '@mui/material/styles'
import { CheckboxCheckedIcon, CheckboxIcon, ChevronDownIcon, RadioCheckedIcon, RadioIcon } from './components/icons'

/**
 * Concept C — MySupreme mobile app. Visual language = Concept A "Pro Counter" (client-approved): navy-led brand
 * surfaces, deep red for actions, saffron for deal highlights on navy, Poppins + JetBrains Mono for SKUs.
 * Tuned for touch: 48px rows, 44px+ targets, 16px gutters, bottom sheets instead of dropdowns.
 */
export const tokens = {
  color: {
    brandRed: '#FF0000', // crown / logo only (never behind text)
    red: '#D50000', // actions, sale prices — 5.5:1 with white
    redDark: '#A30000',
    redTint: '#FFF0EE',
    navy: '#2D297D', // brand surfaces, headings — 11.6:1 on white
    navyDark: '#1B1950',
    navyMid: '#3D3A96',
    navyTint: '#EEEDF9',
    saffron: '#FFC531', // deal highlight on navy / behind ink only
    saffronTint: '#FFF6DD',
    ink: '#111827',
    text2: '#4B5563',
    text3: '#6B7280',
    text4: '#9CA3AF',
    bg: '#F4F4F6',
    surface: '#FFFFFF',
    surface2: '#F3F4F6',
    line: '#E5E7EB',
    line2: '#D1D5DB',
    success: '#01D26A', // fills / icons only
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
    card: '0 1px 2px rgba(17,24,39,.05), 0 1px 1px rgba(17,24,39,.03)',
    raised: '0 8px 24px -10px rgba(27,25,80,.28), 0 2px 6px rgba(17,24,39,.06)',
    sheet: '0 -12px 40px -12px rgba(27,25,80,.35)',
    bar: '0 -1px 0 #E5E7EB, 0 -8px 24px -16px rgba(17,24,39,.2)',
  },
  font: {
    sans: '"Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  /** The phone column's max width on a laptop (plain mobile layout). */
  appWidth: 430,
  tabBarHeight: 64,
  motion: { fast: '140ms cubic-bezier(.2,0,0,1)', base: '220ms cubic-bezier(.2,0,0,1)' },
}

const c = tokens.color
export const focusRing = { '&:focus-visible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 2 } } as const
export const pressable = { transition: `transform ${tokens.motion.fast}`, '&:active': { transform: 'scale(.97)' } } as const
export const srOnly = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 } as const

/** Overlays (sheets, dialogs, menus) render inside the phone column, not across the whole laptop window. */
const shell = () => document.getElementById('app-shell') ?? document.body

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: c.red, dark: c.redDark, light: c.redTint, contrastText: '#fff' },
    secondary: { main: c.navy, dark: c.navyDark, light: c.navyTint, contrastText: '#fff' },
    success: { main: c.successText, light: c.successTint, contrastText: '#fff' },
    warning: { main: c.warning, light: c.warningTint, contrastText: '#fff' },
    info: { main: c.info, light: c.infoTint, contrastText: '#fff' },
    error: { main: c.error, light: c.errorTint, contrastText: '#fff' },
    text: { primary: c.ink, secondary: c.text2, disabled: c.text4 },
    divider: c.line,
    background: { default: c.bg, paper: c.surface },
  },
  shape: { borderRadius: tokens.radius.sm },
  typography: {
    fontFamily: tokens.font.sans,
    h1: { fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.12, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '1.375rem', lineHeight: 1.2, letterSpacing: '-0.015em' },
    h3: { fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 },
    subtitle1: { fontWeight: 500, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 600, fontSize: '0.8125rem' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.55 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.45, color: c.text3 },
    overline: { fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.12em', lineHeight: 1.6 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { backgroundColor: '#E9E9EE' } } },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm, minHeight: 44, paddingInline: 18, fontSize: '0.9375rem', whiteSpace: 'nowrap',
          transition: `background-color ${tokens.motion.fast}, transform ${tokens.motion.fast}`, '&:active:not(.Mui-disabled)': { transform: 'scale(.98)' },
          '&.Mui-focusVisible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 2 },
        },
        sizeSmall: { minHeight: 36, paddingInline: 12, fontSize: '0.8125rem' },
        sizeLarge: { minHeight: 52, paddingInline: 24, fontSize: '1rem', borderRadius: tokens.radius.md },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
        containedPrimary: { '&:hover': { backgroundColor: c.redDark } },
        containedSecondary: { '&:hover': { backgroundColor: c.navyDark } },
        contained: { '&.Mui-disabled': { backgroundColor: c.surface2, color: c.text4 } },
      },
    },
    MuiIconButton: { styleOverrides: { root: { '&.Mui-focusVisible': { outline: `3px solid ${alpha(c.navy, 0.45)}`, outlineOffset: 1 } } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: tokens.radius.pill, height: 34 }, sizeSmall: { height: 26 } } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { rounded: { borderRadius: tokens.radius.md } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm, backgroundColor: '#fff', fontSize: 16,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: c.line2 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: c.navy, borderWidth: 2 },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { '&.Mui-focused': { color: c.navy } } } },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 0 } } },
    MuiSelect: { defaultProps: { IconComponent: ChevronDownIcon } },
    MuiCheckbox: { defaultProps: { icon: createElement(CheckboxIcon), checkedIcon: createElement(CheckboxCheckedIcon) } },
    MuiRadio: { defaultProps: { icon: createElement(RadioIcon), checkedIcon: createElement(RadioCheckedIcon) } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 46, fontSize: '0.875rem' } } },
    MuiTabs: { styleOverrides: { root: { minHeight: 46 }, indicator: { height: 3, borderRadius: 3 } } },
    MuiSkeleton: { defaultProps: { animation: 'wave' }, styleOverrides: { root: { backgroundColor: c.surface2 } } },
    MuiLink: { defaultProps: { underline: 'hover' } },
    // Every overlay is scoped to the phone column (#app-shell has a transform, so fixed children stay inside it).
    MuiModal: { defaultProps: { container: shell, disableScrollLock: true } },
    MuiDialog: { defaultProps: { container: shell, disableScrollLock: true }, styleOverrides: { paper: { borderRadius: tokens.radius.lg, margin: 20 } } },
    MuiDrawer: { defaultProps: { container: shell, disableScrollLock: true } },
    MuiPopover: { defaultProps: { container: shell, disableScrollLock: true } },
    MuiMenu: { defaultProps: { container: shell, disableScrollLock: true } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(17,24,39,.5)' } } },
    MuiLinearProgress: { styleOverrides: { root: { height: 6, borderRadius: 3, backgroundColor: c.surface2 }, bar: { borderRadius: 3 } } },
    MuiSwitch: { defaultProps: { color: 'primary' } },
  },
})

export default theme
