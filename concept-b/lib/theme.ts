import { createElement } from 'react'
import { createTheme, alpha } from '@mui/material/styles'
import {
  AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, CheckboxCheckedIcon, CheckboxIcon, CheckboxIndeterminateIcon, ChevronDownIcon,
  ChevronLeftIcon, ChevronRightIcon, CloseIcon, InfoIcon, RadioCheckedIcon, RadioIcon,
} from '../components/ui/icons'

/**
 * MySupreme design system — one set of tokens for every page.
 *
 * Colour: red leads (brand), navy supports (logo wordmark), neutrals carry the content.
 *   - `red` (#E00000) is the brand red tuned for AA: white text on it is 5.0:1 (the old #FF0000 was 4.0:1).
 *   - `redText` is the red used for text and icons on white or tinted surfaces (6.6:1).
 *   - Focus is always navy (or white on red/navy surfaces); errors are always red + an icon + text.
 * Type: Poppins 400/500/600/700, one scale (display → caption). SKUs use the system mono stack.
 * Space: MUI's 8px unit; use 0.5 steps (4px). Radii: 6 / 8 / 10 / 14 / 20 / pill.
 * Motion: 150ms for hover/press, 200–250ms for panels; everything is disabled under prefers-reduced-motion.
 * Icons: the site's own SVG set in components/ui/icons.tsx (also wired into MUI's checkbox, radio, select, etc. below).
 */

export const colors = {
  red: '#E00000',
  redHover: '#BE0000',
  redPressed: '#A30000',
  redText: '#BE0000',
  redTint: '#FFF1F1',
  redTint2: '#FFE2E2',
  redLine: '#FFC9C9',
  /** The logo red. Decorative use only (never behind text). */
  logoRed: '#FF0000',

  navy: '#2D297D',
  navyHover: '#221F63',
  navyDark: '#17153F',
  navyTint: '#EEEEF8',

  ink: '#111827',
  ink700: '#374151',
  ink600: '#4B5563',
  ink500: '#6B7280',
  ink400: '#9CA3AF',
  line2: '#D1D5DB',
  line: '#E5E7EB',
  sunken: '#F3F4F6',
  subtle: '#F7F8FA',
  white: '#FFFFFF',

  success: '#047857',
  successTint: '#ECFDF5',
  successLine: '#A7F3D0',
  warning: '#B45309',
  warningTint: '#FFFBEB',
  warningLine: '#FDE68A',
  info: '#1D4ED8',
  infoTint: '#EFF6FF',
  infoLine: '#BFDBFE',
  error: '#C00000',
  /** Flyer accent (price bursts, Bulk Saver). Only ever behind ink text (13:1). */
  yellow: '#FFD400',
  errorTint: '#FEF2F2',
  errorLine: '#FECACA',
} as const

export const radius = { xs: '6px', sm: '8px', md: '10px', lg: '14px', xl: '20px', pill: '999px' } as const

export const shadow = {
  xs: '0 1px 2px rgba(16,24,40,.06)',
  sm: '0 1px 3px rgba(16,24,40,.08), 0 1px 2px rgba(16,24,40,.04)',
  md: '0 12px 24px -8px rgba(16,24,40,.16), 0 2px 4px rgba(16,24,40,.04)',
  lg: '0 24px 48px -12px rgba(16,24,40,.24)',
  focusInset: `inset 0 0 0 2px ${'#2D297D'}`,
} as const

export const motion = {
  fast: '150ms cubic-bezier(.2,0,0,1)',
  base: '200ms cubic-bezier(.2,0,0,1)',
  slow: '300ms cubic-bezier(.2,0,0,1)',
} as const

export const mono = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'

/** One visible focus style for the whole app. Use `focusRingInverse` on red or navy surfaces. */
export const focusRing = { '&:focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: '2px' } } as const
export const focusRingInverse = { '&:focus-visible': { outline: '2px solid #FFFFFF', outlineOffset: '2px' } } as const

/** Visually hidden but read by screen readers. */
export const srOnly = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 } as const

/** Page gutters and the content width every page shares. */
export const layout = {
  maxWidth: 1440,
  gutter: { xs: '16px', md: '24px', lg: '32px' },
  /** Height of the sticky header, used for scroll-margin on anchors. */
  headerOffset: { xs: 128, lg: 164 },
} as const

export const z = { stickyBar: 1040, fab: 1050, header: 1100, menu: 1150, drawer: 1200, modal: 1300, toast: 1400 } as const

const font = 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'

const breakpoints = { xs: 0, sm: 500, md: 800, lg: 1100, xl: 1500 } as const
const up = (bp: 'sm' | 'md' | 'lg') => `@media (min-width:${breakpoints[bp]}px)`

// One createTheme call: a second argument would be merged raw, skipping typography/palette processing.
export const theme = createTheme({
  breakpoints: { values: breakpoints },
  palette: {
    mode: 'light',
    primary: { main: colors.red, dark: colors.redHover, light: colors.redTint, contrastText: '#FFFFFF' },
    secondary: { main: colors.navy, dark: colors.navyHover, light: colors.navyTint, contrastText: '#FFFFFF' },
    error: { main: colors.error, light: colors.errorTint, contrastText: '#FFFFFF' },
    success: { main: colors.success, light: colors.successTint, contrastText: '#FFFFFF' },
    warning: { main: colors.warning, light: colors.warningTint, contrastText: '#FFFFFF' },
    info: { main: colors.info, light: colors.infoTint, contrastText: '#FFFFFF' },
    text: { primary: colors.ink, secondary: colors.ink600, disabled: colors.ink400 },
    divider: colors.line,
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    grey: { 50: colors.subtle, 100: colors.sunken, 200: colors.line, 300: colors.line2, 400: colors.ink400, 500: colors.ink500, 600: colors.ink600, 700: colors.ink700, 900: colors.ink },
    action: { hover: alpha(colors.ink, 0.04), selected: colors.redTint, focus: alpha(colors.navy, 0.12) },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: font,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: 26, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em', [up('md')]: { fontSize: 32 } },
    h2: { fontSize: 21, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em', [up('md')]: { fontSize: 26 } },
    h3: { fontSize: 18, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' },
    h4: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: 15, fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: 16, fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: 14, fontWeight: 600, lineHeight: 1.45 },
    body1: { fontSize: 15, lineHeight: 1.6 },
    body2: { fontSize: 14, lineHeight: 1.55 },
    caption: { fontSize: 12.5, lineHeight: 1.45, color: colors.ink500 },
    overline: { fontSize: 12, fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.1em', textTransform: 'uppercase' },
    button: { fontSize: 14.5, fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitTextSizeAdjust: '100%' },
        body: { backgroundColor: '#FFFFFF', color: colors.ink, WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        '::selection': { backgroundColor: colors.redTint2, color: colors.ink },
        // Keyboard users always see where they are; mouse clicks don't leave rings behind.
        ':focus-visible': { outline: `2px solid ${colors.navy}`, outlineOffset: '2px' },
        'a': { color: 'inherit' },
        'img': { maxWidth: '100%' },
        // Floating support buttons and toasts read this to clear sticky mobile bars (set by StickyBottomBar).
        ':root': { '--sticky-bottom': '0px' },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { animationDuration: '0.01ms !important', animationIterationCount: '1 !important', transitionDuration: '0.01ms !important', scrollBehavior: 'auto !important' },
        },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius.md, minHeight: 44, paddingInline: 18, gap: 4, whiteSpace: 'nowrap',
          transition: `background-color ${motion.fast}, border-color ${motion.fast}, color ${motion.fast}, box-shadow ${motion.fast}, transform ${motion.fast}`,
          '&:active:not(.Mui-disabled)': { transform: 'translateY(1px)' },
          '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: '2px' },
          '& .MuiButton-startIcon': { marginRight: 4, marginLeft: -2 },
          '& .MuiButton-endIcon': { marginLeft: 4, marginRight: -2 },
        },
        sizeSmall: { minHeight: 36, paddingInline: 12, fontSize: 13.5, borderRadius: radius.sm },
        sizeLarge: { minHeight: 52, paddingInline: 24, fontSize: 16 },
        containedPrimary: { '&:hover': { backgroundColor: colors.redHover }, '&:active': { backgroundColor: colors.redPressed } },
        containedSecondary: { '&:hover': { backgroundColor: colors.navyHover } },
        contained: { '&.Mui-disabled': { backgroundColor: colors.sunken, color: colors.ink400 } },
        outlined: {
          borderColor: colors.line2, color: colors.ink, backgroundColor: '#FFFFFF',
          '&:hover': { borderColor: colors.ink400, backgroundColor: colors.subtle },
        },
        outlinedPrimary: { borderColor: colors.red, color: colors.redText, '&:hover': { borderColor: colors.redHover, backgroundColor: colors.redTint } },
        outlinedSecondary: { borderColor: colors.navy, color: colors.navy, '&:hover': { backgroundColor: colors.navyTint } },
        text: { paddingInline: 12, color: colors.ink, '&:hover': { backgroundColor: colors.sunken } },
        textPrimary: { color: colors.redText, '&:hover': { backgroundColor: colors.redTint } },
        textSecondary: { color: colors.navy, '&:hover': { backgroundColor: colors.navyTint } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md, color: colors.ink700, transition: `background-color ${motion.fast}, color ${motion.fast}`,
          '&:hover': { backgroundColor: colors.sunken },
          '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: '2px' },
        },
        sizeMedium: { width: 44, height: 44 },
        sizeSmall: { width: 36, height: 36 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.md, backgroundColor: '#FFFFFF', fontSize: 15,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.line2, transition: `border-color ${motion.fast}` },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.ink400 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.navy, borderWidth: 2 },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: colors.error },
          '&.Mui-disabled': { backgroundColor: colors.subtle },
        },
        input: { paddingTop: 11.5, paddingBottom: 11.5, '&::placeholder': { color: colors.ink500, opacity: 1 } },
        inputSizeSmall: { paddingTop: 8, paddingBottom: 8 },
        multiline: { padding: 0, '& textarea': { padding: '11.5px 14px' } },
      },
    },
    MuiFormHelperText: { styleOverrides: { root: { marginLeft: 0, marginTop: 6, fontSize: 13, lineHeight: 1.4 } } },
    MuiInputLabel: { styleOverrides: { root: { fontSize: 15 } } },
    MuiSelect: { defaultProps: { IconComponent: ChevronDownIcon }, styleOverrides: { icon: { color: colors.ink500, fontSize: 20, right: 10 } } },
    // Form-control glyphs come from the site's own SVG set too (components/ui/icons.tsx).
    MuiCheckbox: { defaultProps: { color: 'primary', icon: createElement(CheckboxIcon), checkedIcon: createElement(CheckboxCheckedIcon), indeterminateIcon: createElement(CheckboxIndeterminateIcon) }, styleOverrides: { root: { color: colors.ink400, '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: -4, borderRadius: 8 } } } },
    MuiRadio: { defaultProps: { color: 'primary', icon: createElement(RadioIcon), checkedIcon: createElement(RadioCheckedIcon) }, styleOverrides: { root: { color: colors.ink400 } } },
    MuiChip: {
      defaultProps: { deleteIcon: createElement(CloseIcon) },
      styleOverrides: {
        root: { borderRadius: radius.pill, fontWeight: 500, fontSize: 13.5, height: 34, '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: 2 } },
        sizeSmall: { height: 28, fontSize: 12.5 },
        outlined: { borderColor: colors.line2, backgroundColor: '#FFFFFF' },
        deleteIcon: { color: colors.ink500, '&:hover': { color: colors.ink } },
      },
    },
    MuiTooltip: {
      // describeChild: the tooltip describes the control instead of replacing its visible label (WCAG 2.5.3).
      defaultProps: { arrow: true, enterDelay: 300, describeChild: true },
      styleOverrides: { tooltip: { backgroundColor: colors.ink, fontSize: 12.5, fontWeight: 500, borderRadius: radius.sm, padding: '6px 10px' }, arrow: { color: colors.ink } },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: radius.lg } } },
    MuiPopover: { styleOverrides: { paper: { borderRadius: radius.lg, boxShadow: shadow.lg, border: `1px solid ${colors.line}` } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: radius.lg, boxShadow: shadow.lg, border: `1px solid ${colors.line}`, marginTop: 6 }, list: { padding: 6 } } },
    MuiMenuItem: { styleOverrides: { root: { borderRadius: radius.sm, minHeight: 44, fontSize: 14.5, gap: 10, '&.Mui-selected': { backgroundColor: colors.redTint } } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: radius.xl, boxShadow: shadow.lg } } },
    MuiDialogTitle: { styleOverrides: { root: { fontSize: 20, fontWeight: 600, padding: '20px 24px 8px' } } },
    MuiDialogContent: { styleOverrides: { root: { padding: '8px 24px 16px' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '8px 24px 20px', gap: 8 } } },
    MuiDrawer: { styleOverrides: { paper: { borderRadius: 0 } } },
    MuiBackdrop: { styleOverrides: { root: { backgroundColor: 'rgba(17,24,39,.45)' } } },
    MuiAlert: {
      defaultProps: { iconMapping: { success: createElement(CheckCircleIcon), info: createElement(InfoIcon), warning: createElement(AlertTriangleIcon), error: createElement(AlertCircleIcon) } },
      styleOverrides: {
        root: { borderRadius: radius.md, fontSize: 14, alignItems: 'flex-start', '& .MuiAlert-message': { paddingTop: 9 } },
        standardSuccess: { backgroundColor: colors.successTint, color: '#065F46', border: `1px solid ${colors.successLine}` },
        standardInfo: { backgroundColor: colors.infoTint, color: '#1E3A8A', border: `1px solid ${colors.infoLine}` },
        standardWarning: { backgroundColor: colors.warningTint, color: '#78350F', border: `1px solid ${colors.warningLine}` },
        standardError: { backgroundColor: colors.errorTint, color: '#7F1D1D', border: `1px solid ${colors.errorLine}` },
      },
    },
    MuiTabs: { styleOverrides: { root: { minHeight: 44 }, indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: colors.red } } },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', fontWeight: 600, fontSize: 14.5, minHeight: 44, color: colors.ink600, paddingInline: 14,
          '&.Mui-selected': { color: colors.ink }, '&.Mui-focusVisible': { outline: `2px solid ${colors.navy}`, outlineOffset: -2, borderRadius: 8 },
        },
      },
    },
    MuiSkeleton: { defaultProps: { animation: 'wave' }, styleOverrides: { root: { backgroundColor: colors.sunken }, rounded: { borderRadius: radius.md } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4, height: 6, backgroundColor: colors.sunken }, bar: { borderRadius: 4 } } },
    MuiBreadcrumbs: { styleOverrides: { root: { fontSize: 13.5 }, separator: { color: colors.ink400, marginInline: 6 } } },
    MuiPaginationItem: { defaultProps: { slots: { previous: ChevronLeftIcon, next: ChevronRightIcon } }, styleOverrides: { root: { borderRadius: radius.md, minWidth: 40, height: 40, fontSize: 14.5, fontWeight: 500, '&.Mui-selected': { backgroundColor: colors.ink, color: '#fff', '&:hover': { backgroundColor: colors.ink700 } } } } },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: { root: { border: `1px solid ${colors.line}`, borderRadius: `${radius.lg} !important`, '&::before': { display: 'none' }, '& + &': { marginTop: 8 } } },
    },
    MuiAccordionSummary: { styleOverrides: { root: { minHeight: 56, paddingInline: 18, '&.Mui-focusVisible': { backgroundColor: 'transparent', outline: `2px solid ${colors.navy}`, outlineOffset: -2, borderRadius: radius.lg } }, content: { fontWeight: 600, fontSize: 15 } } },
    MuiAccordionDetails: { styleOverrides: { root: { padding: '0 18px 18px', color: colors.ink600, fontSize: 14.5, lineHeight: 1.6 } } },
    MuiSlider: { styleOverrides: { thumb: { width: 22, height: 22, backgroundColor: '#fff', border: `2px solid ${colors.red}`, '&:hover, &.Mui-focusVisible': { boxShadow: `0 0 0 6px ${alpha(colors.red, 0.16)}` } }, rail: { backgroundColor: colors.line2, opacity: 1 } } },
    MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { color: colors.redText, fontWeight: 500 } } },
    MuiBadge: { styleOverrides: { badge: { fontWeight: 700, fontSize: 11, minWidth: 18, height: 18, padding: '0 5px' } } },
    MuiDivider: { styleOverrides: { root: { borderColor: colors.line } } },
    MuiSnackbarContent: { styleOverrides: { root: { borderRadius: radius.md } } },
    MuiSwitch: { defaultProps: { color: 'primary' } },
  },
})
