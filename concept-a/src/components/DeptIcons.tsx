import { forwardRef, type ReactNode } from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'

/**
 * Department outline icons, shared with Concept B (24×24 grid, 1.8px rounded strokes, currentColor).
 * Several outlines follow Lucide's geometry (ISC licence, © Lucide Contributors).
 */

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function make(name: string, children: ReactNode) {
  const Icon = forwardRef<SVGSVGElement, SvgIconProps>(function Icon({ sx, ...props }, ref) {
    return (
      <SvgIcon ref={ref} viewBox="0 0 24 24" {...props} sx={[stroke, ...(Array.isArray(sx) ? sx : [sx])]}>
        {children}
      </SvgIcon>
    )
  })
  Icon.displayName = name
  return Icon
}

export type DeptIcon = ReturnType<typeof make>

const BoxIcon = make('BoxIcon', <path d="M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8" />)
const BasketIcon = make('BasketIcon', <path d="M3 9.5h18l-1.8 9.2a1.5 1.5 0 0 1-1.5 1.3H6.3a1.5 1.5 0 0 1-1.5-1.3zM7.5 9.5l3-6m6 6-3-6M9 13.5v3M12 13.5v3M15 13.5v3" />)
const SnowflakeIcon = make('SnowflakeIcon', <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4 12 6l2.5-2M9.5 20l2.5-2 2.5 2M4.3 10.6l3-.7-.8-3M19.7 13.4l-3 .7.8 3M4.3 13.4l3 .7-.8 3M19.7 10.6l-3-.7.8-3" />)
const LeafIcon = make('LeafIcon', <path d="M5 19c0-8 5-13.5 14.5-14.5C19.5 14 14 19 6 19zM5 19c3-4 6-6.5 9.5-8.5" />)
const CupIcon = make('CupIcon', <path d="M6 8h12l-1.3 12.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3zM5 8h14M12 8l2-5h3" />)
const EggIcon = make('EggIcon', <path d="M12 21.5c3.9 0 7-3 7-7.2C19 9 15.8 2.5 12 2.5S5 9 5 14.3c0 4.2 3.1 7.2 7 7.2z" />)
const DrumstickIcon = make('DrumstickIcon', <path d="M15.5 3.5a5 5 0 0 1 4.6 6.9c-.9 2.3-3.4 3.4-5.6 3.6l-3 3a2.2 2.2 0 1 1-3.1 3.1 2.2 2.2 0 1 1-3.1-3.1l3-3c.2-2.2 1.3-4.7 3.6-5.6a5 5 0 0 1 3.6-4.9z" />)
const SprayIcon = make('SprayIcon', <path d="M9 9h6v2.5a2 2 0 0 1 1 1.7V20a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 20v-6.8a2 2 0 0 1 1-1.7zM10 9V5.5h4L16 7h2M20 4.5h.01M21.5 7h.01M20 9.5h.01" />)
const PotIcon = make('PotIcon', <path d="M3 10.5h18M5 10.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7.5M8.5 7.5c0-1.6 1.6-3 3.5-3s3.5 1.4 3.5 3M3 10.5 1.5 9M21 10.5 22.5 9" />)

export const deptIcons: Record<string, DeptIcon> = {
  packaging: BoxIcon,
  grocery: BasketIcon,
  frozen: SnowflakeIcon,
  produce: LeafIcon,
  beverage: CupIcon,
  'dairy-eggs': EggIcon,
  'meat-poultry': DrumstickIcon,
  janitorial: SprayIcon,
  'ware-equipment': PotIcon,
}
