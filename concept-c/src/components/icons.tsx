import { forwardRef, type ReactNode } from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

/**
 * MySupreme icon set — the site's own inline SVGs (no icon library).
 *
 * One style for every icon: 24×24 grid, 1.8px rounded strokes, no fills except small dots and the few glyphs that
 * are solid by nature (filled heart, star, play, brand marks). Icons inherit `currentColor` and size with
 * `font-size` (1em), so they take the colour and size of the text or button they sit in. Pass `sx={{ fontSize }}`
 * or `fontSize="small"` like any MUI icon. Several outlines follow Lucide's geometry (ISC licence, © Lucide
 * Contributors), redrawn for this grid.
 *
 * Decorative by default (aria-hidden); give the surrounding control the accessible name.
 */


const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const dot = { fill: 'currentColor', stroke: 'none' } as const

function make(name: string, children: ReactNode, opts: { solid?: boolean } = {}) {
  const Icon = forwardRef<SVGSVGElement, SvgIconProps>(function Icon({ sx, ...props }, ref) {
    return (
      <SvgIcon ref={ref} viewBox="0 0 24 24" {...props} sx={[opts.solid ? { fill: 'currentColor', stroke: 'none' } : stroke, ...(Array.isArray(sx) ? sx : [sx])]}>
        {children}
      </SvgIcon>
    )
  })
  Icon.displayName = name
  return Icon
}

/** Type for icon props/maps (department icons, value lists…). */
export type IconComponent = ReturnType<typeof make>

/* ------------------------------------------------------------------ Actions & navigation */

export const SearchIcon = make('SearchIcon', <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></>)
export const SearchXIcon = make('SearchXIcon', <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8M8.6 8.6l4.8 4.8m0-4.8-4.8 4.8" /></>)
export const CloseIcon = make('CloseIcon', <path d="M18 6 6 18M6 6l12 12" />)
export const CheckIcon = make('CheckIcon', <path d="M20 6.5 9 17.5 4 12.5" />)
export const PlusIcon = make('PlusIcon', <path d="M12 5v14M5 12h14" />)
export const MinusIcon = make('MinusIcon', <path d="M5 12h14" />)
export const ChevronLeftIcon = make('ChevronLeftIcon', <path d="m15 18-6-6 6-6" />)
export const ChevronRightIcon = make('ChevronRightIcon', <path d="m9 18 6-6-6-6" />)
export const ChevronDownIcon = make('ChevronDownIcon', <path d="m6 9 6 6 6-6" />)
export const ArrowRightIcon = make('ArrowRightIcon', <path d="M4.5 12h15M13.5 6l6 6-6 6" />)
export const ArrowUpLeftIcon = make('ArrowUpLeftIcon', <path d="M17 17 7 7M7 15.5V7h8.5" />)
export const MenuIcon = make('MenuIcon', <path d="M4 7h16M4 12h16M4 17h16" />)
export const GridIcon = make('GridIcon', <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>)
export const SlidersIcon = make('SlidersIcon', <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>)
export const FilterXIcon = make('FilterXIcon', <><path d="M3 4.5h14l-5.5 7v6.5l-3 1.5v-8z" /><path d="m16 14.5 5 5m0-5-5 5" /></>)
export const TrashIcon = make('TrashIcon', <><path d="M4 7h16M9.5 7V4.5h5V7M6 7l1 13h10l1-13" /><path d="M10 11v5.5M14 11v5.5" /></>)
export const CopyIcon = make('CopyIcon', <><rect x="8.5" y="8.5" width="12" height="12" rx="2" /><path d="M15.5 8.5V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5" /></>)
export const UploadIcon = make('UploadIcon', <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" /></>)
export const PrinterIcon = make('PrinterIcon', <><path d="M6.5 9V3.5h11V9" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6.5 14h11v6.5h-11z" /></>)
export const ListPlusIcon = make('ListPlusIcon', <path d="M4 6h11M4 12h11M4 18h7M18 14v6M15 17h6" />)
export const RotateCcwIcon = make('RotateCcwIcon', <><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5" /><path d="M3.5 3.5v5h5" /></>)
export const HistoryIcon = make('HistoryIcon', <><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5" /><path d="M3.5 4v4.5H8M12 8v4.2l3 1.8" /></>)
export const TrendingUpIcon = make('TrendingUpIcon', <path d="m3 17 6-6 4 4 8-8M15 7h6v6" />)
export const LogOutIcon = make('LogOutIcon', <path d="M9.5 20.5h-4A1.5 1.5 0 0 1 4 19V5a1.5 1.5 0 0 1 1.5-1.5h4M15.5 16.5 20 12l-4.5-4.5M20 12H9.5" />)
export const PlayIcon = make('PlayIcon', <path d="M7.5 4.8v14.4a.8.8 0 0 0 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.7 4.1a.8.8 0 0 0-1.2.7z" />, { solid: true })
export const PauseIcon = make('PauseIcon', <><rect x="6.5" y="4.5" width="3.8" height="15" rx="1" /><rect x="13.7" y="4.5" width="3.8" height="15" rx="1" /></>, { solid: true })
export const EyeIcon = make('EyeIcon', <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>)
export const EyeOffIcon = make('EyeOffIcon', <path d="m3 3 18 18M10.6 5.6c.5-.1.9-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.5 6.6C3.9 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.4-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2" />)

/* ------------------------------------------------------------------ Status & feedback */

export const CheckCircleIcon = make('CheckCircleIcon', <><circle cx="12" cy="12" r="9" /><path d="m8 12.2 2.7 2.7L16 9.6" /></>)
export const AlertCircleIcon = make('AlertCircleIcon', <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.2" /><circle cx="12" cy="16.3" r="1" style={dot} /></>)
export const AlertTriangleIcon = make('AlertTriangleIcon', <><path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" /><path d="M12 9.5v4.2" /><circle cx="12" cy="16.8" r="1" style={dot} /></>)
export const InfoIcon = make('InfoIcon', <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.7" r="1" style={dot} /></>)
export const BadgeCheckIcon = make('BadgeCheckIcon', <><path d="M12 2.8 14.3 4.5l2.8-.1.9 2.7 2.3 1.6-.9 2.7.9 2.7-2.3 1.6-.9 2.7-2.8-.1L12 21.2l-2.3-1.7-2.8.1-.9-2.7-2.3-1.6.9-2.7-.9-2.7 2.3-1.6.9-2.7 2.8.1z" /><path d="m8.8 12 2.2 2.2 4.3-4.4" /></>)
export const BellIcon = make('BellIcon', <><path d="M6 9.5a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15.5 6 9.5z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></>)
export const ClockIcon = make('ClockIcon', <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></>)
export const TimerIcon = make('TimerIcon', <><circle cx="12" cy="13.5" r="7.5" /><path d="M12 10v3.5l2.3 1.4M9.5 2.5h5M12 2.5V6" /></>)
export const CalendarIcon = make('CalendarIcon', <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>)
export const LockIcon = make('LockIcon', <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5v-3a4 4 0 0 1 8 0v3" /></>)
export const StarIcon = make('StarIcon', <path d="m12 3.2 2.7 5.5 6 .9-4.4 4.2 1.1 6-5.4-2.8-5.4 2.8 1.1-6-4.4-4.2 6-.9z" />, { solid: true })
export const HeartIcon = make('HeartIcon', <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />)
export const HeartFilledIcon = make('HeartFilledIcon', <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />, { solid: true })

/* ------------------------------------------------------------------ Commerce */

export const CartIcon = make('CartIcon', <><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2.5 3.5h2.6l2.3 11.2A1.6 1.6 0 0 0 9 16h8.3a1.6 1.6 0 0 0 1.6-1.2l1.6-7.3H6.1" /></>)
export const CartPlusIcon = make('CartPlusIcon', <><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2.5 3.5h2.6l2.3 11.2A1.6 1.6 0 0 0 9 16h8.3a1.6 1.6 0 0 0 1.6-1.2l1.6-7.3H6.1M13.2 9.3v4M11.2 11.3h4" /></>)
export const CartCheckIcon = make('CartCheckIcon', <><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2.5 3.5h2.6l2.3 11.2A1.6 1.6 0 0 0 9 16h8.3a1.6 1.6 0 0 0 1.6-1.2l1.6-7.3H6.1m4.7 4 1.8 1.8 3.2-3.2" /></>)
export const BasketIcon = make('BasketIcon', <path d="M3 9.5h18l-1.8 9.2a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3zM7.5 9.5l3-6m6 6-3-6M9 13.5v3M12 13.5v3M15 13.5v3" />)
export const TagIcon = make('TagIcon', <><path d="M3 12.6V4a1 1 0 0 1 1-1h8.6a1 1 0 0 1 .7.3l7.4 7.4a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4 0L3.3 13.3a1 1 0 0 1-.3-.7z" /><circle cx="7.8" cy="7.8" r="1.4" /></>)
export const BoltIcon = make('BoltIcon', <path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z" />)
export const BoxIcon = make('BoxIcon', <path d="M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8" />)
export const ReceiptIcon = make('ReceiptIcon', <path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3L6 21zM9 8h6M9 12h6M9 16h4" />)
export const CreditCardIcon = make('CreditCardIcon', <><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 10h19M6.5 15h4" /></>)
export const BankIcon = make('BankIcon', <path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" />)
export const ReturnIcon = make('ReturnIcon', <><rect x="3.5" y="4" width="17" height="16" rx="2" /><path d="M9 9.5h5a2.8 2.8 0 0 1 0 5.5h-4M11 7.5l-2 2 2 2" /></>)
export const ScanIcon = make('ScanIcon', <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8m8 0h2.5A1.5 1.5 0 0 1 20 5.5V8m0 8v2.5a1.5 1.5 0 0 1-1.5 1.5H16m-8 0H5.5A1.5 1.5 0 0 1 4 18.5V16M7.5 12h9" />)
export const QrCodeIcon = make('QrCodeIcon', <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM14 20v.01M20 14v.01" /></>)

/* ------------------------------------------------------------------ People, places, contact */

export const UserIcon = make('UserIcon', <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>)
export const UserCheckIcon = make('UserCheckIcon', <><circle cx="10" cy="8" r="4" /><path d="M3 20.5a7 7 0 0 1 12.4-4.4M16 18.5l2 2 4-4" /></>)
export const HeadsetIcon = make('HeadsetIcon', <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19a3 3 0 0 1-3 2.5h-3" /></>)
export const HandshakeIcon = make('HandshakeIcon', <path d="m2.5 11 4-4 4 1.5 2.5-1.5 4.5 1L21.5 11M6.5 14.5l3.4 3.4a1.5 1.5 0 0 0 2.1 0l6-6M11 8.5l-2.8 2.8a1.4 1.4 0 0 0 2 2l2.6-2.4M2.5 11l4 3.5" />)
export const PhoneIcon = make('PhoneIcon', <path d="M20.5 16.5v2.7a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.8-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 2.5 5a1.8 1.8 0 0 1 1.8-2H7a1.8 1.8 0 0 1 1.8 1.6c.1.9.3 1.7.6 2.5a1.8 1.8 0 0 1-.4 1.9L7.8 10.1a14.4 14.4 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.5.6a1.8 1.8 0 0 1 1.8 1.9z" />)
export const MailIcon = make('MailIcon', <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>)
export const MailCheckIcon = make('MailCheckIcon', <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8M3.5 7l8.5 6 8.5-6M16 19l2 2 4-4" />)
export const ChatIcon = make('ChatIcon', <path d="M20.5 15a1.5 1.5 0 0 1-1.5 1.5H8l-4.5 4V5A1.5 1.5 0 0 1 5 3.5h14A1.5 1.5 0 0 1 20.5 5zM8 9h8M8 12.5h5" />)
export const MicIcon = make('MicIcon', <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></>)
export const CameraIcon = make('CameraIcon', <><path d="M4.5 7.5h3L9 5h6l1.5 2.5h3A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5V9a1.5 1.5 0 0 1 1.5-1.5z" /><circle cx="12" cy="13.5" r="3.5" /></>)
export const MapPinIcon = make('MapPinIcon', <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>)
export const MapIcon = make('MapIcon', <path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2zM9 4.5v13M15 6.5v13" />)
export const DirectionsIcon = make('DirectionsIcon', <path d="M12 2.8 21.2 12 12 21.2 2.8 12zM9.5 14.5v-3a1 1 0 0 1 1-1H15M13 8.5l2 2-2 2" />)
export const StoreIcon = make('StoreIcon', <path d="M3.5 9.5 5 4.5h14l1.5 5M3.5 9.5a2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.8 0 2.8 2.8 0 0 0 5.6 0M5 12v7.5h14V12M10 19.5V15h4v4.5" />)
export const WarehouseIcon = make('WarehouseIcon', <path d="M3 20.5v-12L12 4l9 4.5v12M7 20.5v-8h10v8M7 15.5h10" />)
export const TruckIcon = make('TruckIcon', <><path d="M13.5 15.5v-9a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1.3M13.5 8.5h3.6a1 1 0 0 1 .8.4l2.9 3.6a1 1 0 0 1 .2.6v1.9a1 1 0 0 1-1 1h-.8M9.1 15.5h5.8" /><circle cx="7" cy="16" r="2" /><circle cx="17" cy="16" r="2" /></>)
export const ScooterIcon = make('ScooterIcon', <><circle cx="6" cy="17.5" r="2.5" /><circle cx="18" cy="17.5" r="2.5" /><path d="M8.5 17.5H15l-2.5-7H10M15 17.5 16.6 9H19M2.5 8h5.5v4.5H2.5z" /></>)
export const AwardIcon = make('AwardIcon', <><circle cx="12" cy="9" r="6" /><path d="m8.5 13.8-1 7.2 4.5-2.5 4.5 2.5-1-7.2" /></>)
export const ChartIcon = make('ChartIcon', <path d="M4 4v16h16M7.5 14.5l3.5-4 3 3 5-6" />)
export const SparklesIcon = make('SparklesIcon', <path d="m12 3.5 1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8zM19 15v4M17 17h4M5 3.5v3M3.5 5h3" />)
export const FlameIcon = make('FlameIcon', <path d="M12 21.5a6.5 6.5 0 0 0 6.5-6.5c0-4-3-6.5-4-10-1.5 1.8-2 3.5-2 5-1.3-1-2-2.5-2-4-2.5 2.2-5 5.5-5 9a6.5 6.5 0 0 0 6.5 6.5z" />)
export const ShapesIcon = make('ShapesIcon', <><circle cx="7.5" cy="7.5" r="3.5" /><rect x="13.5" y="4" width="7" height="7" rx="1.5" /><path d="m7.5 13.5 4 7h-8z" /><circle cx="17" cy="17" r="3.5" /></>)

/* ------------------------------------------------------------------ Departments & business types */

export const UtensilsIcon = make('UtensilsIcon', <path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2 1.3-3 3.7-3 6.5V13h3" />)
export const CoffeeIcon = make('CoffeeIcon', <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10.5h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5V6M12 3.5V6" />)
export const BreadIcon = make('BreadIcon', <path d="M4 12a8 5.5 0 0 1 16 0v4.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5zM9 9.5v3M12 9v3.5M15 9.5v3" />)
export const BedIcon = make('BedIcon', <><path d="M3 18.5v-12M3 13.5h18v5M21 13.5V11a2.5 2.5 0 0 0-2.5-2.5H11v5" /><circle cx="7" cy="10.5" r="2" /></>)
export const LeafIcon = make('LeafIcon', <path d="M5 19c0-8 5-13.5 14.5-14.5C19.5 14 14 19 6 19zM5 19c3-4 6-6.5 9.5-8.5" />)
export const SnowflakeIcon = make('SnowflakeIcon', <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4 12 6l2.5-2M9.5 20l2.5-2 2.5 2M4.3 10.6l3-.7-.8-3M19.7 13.4l-3 .7.8 3M4.3 13.4l3 .7-.8 3M19.7 10.6l-3-.7.8-3" />)
export const CupIcon = make('CupIcon', <path d="M6 8h12l-1.3 12.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3zM5 8h14M12 8l2-5h3" />)
export const EggIcon = make('EggIcon', <path d="M12 21.5c3.9 0 7-3 7-7.2C19 9 15.8 2.5 12 2.5S5 9 5 14.3c0 4.2 3.1 7.2 7 7.2z" />)
export const DrumstickIcon = make('DrumstickIcon', <path d="M15.5 3.5a5 5 0 0 1 4.6 6.9c-.9 2.3-3.4 3.4-5.6 3.6l-3 3a2.2 2.2 0 1 1-3.1 3.1 2.2 2.2 0 1 1-3.1-3.1l3-3c.2-2.2 1.3-4.7 3.6-5.6a5 5 0 0 1 3.6-4.9z" />)
export const SprayIcon = make('SprayIcon', <path d="M9 9h6v2.5a2 2 0 0 1 1 1.7V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20v-6.8a2 2 0 0 1 1-1.7zM10 9V5.5h4L16 7h2M20 4.5h.01M21.5 7h.01M20 9.5h.01" />)
export const PotIcon = make('PotIcon', <path d="M3 10.5h18M5 10.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7.5M8.5 7.5c0-1.6 1.6-3 3.5-3s3.5 1.4 3.5 3M3 10.5 1.5 9M21 10.5 22.5 9" />)

/* ------------------------------------------------------------------ Brand marks (simplified, single colour) */

export const WhatsAppIcon = make('WhatsAppIcon', <><path d="M3.5 20.5 4.8 16.3A8.5 8.5 0 1 1 8 19.4z" /><path d="M9.2 8.6c.3-.6.8-1.1 1.3-1.1l1 2.1-.9 1a5 5 0 0 0 2.8 2.8l1-.9 2.1 1c0 .5-.5 1-1.1 1.3-3.4.8-7-2.8-6.2-6.2z" style={dot} /></>)
export const FacebookIcon = make('FacebookIcon', <path d="M14.5 21v-7.5h2.7l.4-3.1h-3.1V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1v2h-2.7v3.1h2.7V21z" />, { solid: true })
export const InstagramIcon = make('InstagramIcon', <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" style={dot} /></>)
export const LinkedInIcon = make('LinkedInIcon', <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5v6M8 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" /></>)

/* ------------------------------------------------------------------ Form controls (used through the MUI theme) */

export const CheckboxIcon = make('CheckboxIcon', <rect x="3.5" y="3.5" width="17" height="17" rx="4" />)
export const CheckboxCheckedIcon = make('CheckboxCheckedIcon', <><rect x="3" y="3" width="18" height="18" rx="4.5" style={dot} /><path d="m7.5 12.2 3 3 6-6.2" style={{ fill: 'none', stroke: '#fff', strokeWidth: 2.2 }} /></>)
export const CheckboxIndeterminateIcon = make('CheckboxIndeterminateIcon', <><rect x="3" y="3" width="18" height="18" rx="4.5" style={dot} /><path d="M8 12h8" style={{ fill: 'none', stroke: '#fff', strokeWidth: 2.2 }} /></>)
export const RadioIcon = make('RadioIcon', <circle cx="12" cy="12" r="8.5" />)
export const RadioCheckedIcon = make('RadioCheckedIcon', <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.2" style={dot} /></>)

/* ------------------------------------------------------------------ App (Concept C) */

export const HomeIcon = make('HomeIcon', <path d="M3.5 10.5 12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-6v6H5A1.5 1.5 0 0 1 3.5 19z" />)
export const HomeFilledIcon = make('HomeFilledIcon', <path d="M12 3a1 1 0 0 1 .6.2l8.5 7a1 1 0 0 1 .4.8V19a2.5 2.5 0 0 1-2.5 2.5h-3.5a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V21a.5.5 0 0 1-.5.5H5A2.5 2.5 0 0 1 2.5 19v-8a1 1 0 0 1 .4-.8l8.5-7A1 1 0 0 1 12 3z" />, { solid: true })
export const GridFilledIcon = make('GridFilledIcon', <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" /><rect x="13" y="13" width="7.5" height="7.5" rx="2" /></>, { solid: true })
export const CartFilledIcon = make('CartFilledIcon', <><path d="M1.75 3.5a1 1 0 0 1 1-1h2.35a1 1 0 0 1 .98.8l.4 1.95h14.02a1 1 0 0 1 .98 1.21l-1.6 7.3A2.6 2.6 0 0 1 17.33 16H9a2.6 2.6 0 0 1-2.55-2.08L4.29 4.5H2.75a1 1 0 0 1-1-1z" /><circle cx="9" cy="20" r="1.8" /><circle cx="18" cy="20" r="1.8" /></>, { solid: true })
export const TagFilledIcon = make('TagFilledIcon', <path d="M2.5 4a1.5 1.5 0 0 1 1.5-1.5h8.6a1.5 1.5 0 0 1 1 .4l7.9 7.9a1.5 1.5 0 0 1 0 2.1l-8.7 8.7a1.5 1.5 0 0 1-2.1 0L2.9 13.7a1.5 1.5 0 0 1-.4-1zM7.8 9.4a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />, { solid: true })
export const ReceiptFilledIcon = make('ReceiptFilledIcon', <path d="M5.5 2.5h13a1 1 0 0 1 1 1V21a.5.5 0 0 1-.8.4L17 20.2l-2 1.3a.5.5 0 0 1-.5 0l-2-1.3-2 1.3a.5.5 0 0 1-.5 0l-2-1.3-1.7 1.2a.5.5 0 0 1-.8-.4V3.5a1 1 0 0 1 1-1zM9 7.3a.8.8 0 0 0 0 1.6h6a.8.8 0 0 0 0-1.6zm0 4a.8.8 0 0 0 0 1.6h6a.8.8 0 0 0 0-1.6zm0 4a.8.8 0 0 0 0 1.6h3.5a.8.8 0 0 0 0-1.6z" />, { solid: true })
export const UserFilledIcon = make('UserFilledIcon', <><circle cx="12" cy="8" r="4.5" /><path d="M3.5 20.3a8.5 8.5 0 0 1 17 0 .7.7 0 0 1-.7.7H4.2a.7.7 0 0 1-.7-.7z" /></>, { solid: true })
export const GearIcon = make('GearIcon', <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" /></>)
export const DownloadIcon = make('DownloadIcon', <><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" /></>)
export const FileTextIcon = make('FileTextIcon', <><path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z" /><path d="M14 2.5v5h5M8.5 13h7M8.5 16.5h7M8.5 9.5h2" /></>)
export const HelpCircleIcon = make('HelpCircleIcon', <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .8c0 1.7-2.5 2.3-2.5 3.8" /><circle cx="12" cy="17" r="1" style={dot} /></>)
export const BarcodeIcon = make('BarcodeIcon', <path d="M3.5 7V5.5a2 2 0 0 1 2-2H7M17 3.5h1.5a2 2 0 0 1 2 2V7M20.5 17v1.5a2 2 0 0 1-2 2H17M7 20.5H5.5a2 2 0 0 1-2-2V17M7.5 8v8M10.5 8v8M13 8v8M16.5 8v8" />)
export const FlashlightIcon = make('FlashlightIcon', <path d="M7 2.5h10v4l-2.5 4v10.5a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5V10.5L7 6.5zM7 6.5h10M12 13.5v2" />)
export const WalletIcon = make('WalletIcon', <><path d="M19.5 7V5.5A1.5 1.5 0 0 0 18 4H5.5A2 2 0 0 0 3.5 6v12a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" /><path d="M21 9h-5a3 3 0 0 0 0 6h5a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 21 9z" /><circle cx="16.2" cy="12" r="1" style={dot} /></>)
export const ShareIcon = make('ShareIcon', <><circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" /><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1" /></>)
export const EditIcon = make('EditIcon', <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4" />)
export const MoreIcon = make('MoreIcon', <><circle cx="5.5" cy="12" r="1.4" style={dot} /><circle cx="12" cy="12" r="1.4" style={dot} /><circle cx="18.5" cy="12" r="1.4" style={dot} /></>)
export const PercentIcon = make('PercentIcon', <><path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></>)
export const ShieldIcon = make('ShieldIcon', <path d="M12 21.5s7.5-3.4 7.5-9.5V5.5L12 2.5 4.5 5.5V12c0 6.1 7.5 9.5 7.5 9.5zM8.8 12l2.2 2.2 4.2-4.2" />)
export const KeyboardIcon = make('KeyboardIcon', <><rect x="2.5" y="5.5" width="19" height="13" rx="2" /><path d="M6.5 9.5h.01M10 9.5h.01M13.5 9.5h.01M17 9.5h.01M6.5 13h.01M17 13h.01M9.5 15.5h5" /></>)
export const SunIcon = make('SunIcon', <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>)
export const ListIcon = make('ListIcon', <path d="M8.5 6h12M8.5 12h12M8.5 18h12M3.5 6h.01M3.5 12h.01M3.5 18h.01" />)
export const GridViewIcon = make('GridViewIcon', <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>)
export const GiftIcon = make('GiftIcon', <path d="M3.5 8.5h17v4h-17zM5 12.5v8h14v-8M12 8.5v12M12 8.5S11 4 8 4a2 2 0 0 0 0 4.5M12 8.5S13 4 16 4a2 2 0 0 1 0 4.5" />)
