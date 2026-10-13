import { Box, type SxProps, type Theme } from '@mui/material'
import { tokens } from '../theme'

const c = tokens.color

export function Crown({ size = 32, color = c.brandRed }: { size?: number; color?: string }) {
  return (
    <Box component="svg" viewBox="0 0 48 40" sx={{ width: size, height: size * (40 / 48), flexShrink: 0 }} aria-hidden>
      <path d="M4 30 1.5 8.5 14 18 24 3l10 15 12.5-9.5L44 30Z" fill={color} />
      <circle cx="1.8" cy="7.5" r="1.8" fill={color} />
      <circle cx="24" cy="2.4" r="2.2" fill={color} />
      <circle cx="46.2" cy="7.5" r="1.8" fill={color} />
      <rect x="4" y="33" width="40" height="5.5" rx="1.5" fill={color} />
    </Box>
  )
}

/**
 * MySupreme logo — the same artwork as Concept B: header_logo.svg on light backgrounds, footerLogo.png (white) for
 * `inverse` on navy. `compact` for the mobile header and drawer.
 */
export function Logo({ inverse = false, compact = false, sx }: { inverse?: boolean; compact?: boolean; sx?: SxProps<Theme> }) {
  return inverse ? (
    <Box component="img" src="/assets/footerLogo.png" alt="MySupreme Cash & Carry" sx={{ width: 128, height: 'auto', display: 'block', ...((sx as object) ?? {}) }} />
  ) : (
    <Box component="img" src="/assets/header_logo.svg" alt="MySupreme Cash & Carry" sx={{ height: compact ? 38 : 46, width: 'auto', display: 'block', ...((sx as object) ?? {}) }} />
  )
}

/**
 * Placeholder for products without a photo. Designed to look intentional in a grid of 20:
 * soft tint, crown watermark, brand initials. Replaces the grey "SUPREME" box used today.
 */
export function ProductPlaceholder({ brand, label, rounded = true }: { brand?: string; label?: string; rounded?: boolean }) {
  const initials = (brand ?? 'MS').split(/[\s-]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Box
      role="img"
      aria-label={label ? `${label} — photo coming soon` : 'Photo coming soon'}
      sx={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', containerType: 'size',
        // Thumbnail sizes (cart rows, search results, list view) drop the caption and shrink the monogram.
        '@container (max-width: 130px)': { '& .ph-cap': { display: 'none' }, '& .ph-mono': { width: 36, height: 36, fontSize: 12 } },
        borderRadius: rounded ? `${tokens.radius.sm}px` : 0,
        background: `radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, ${c.surface2} 70%)`,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', right: -18, bottom: -14, opacity: 0.06 }}>
        <Crown size={150} color={c.navy} />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          className="ph-mono"
          sx={{
            width: 64, height: 64, mx: 'auto', borderRadius: '50%', display: 'grid', placeItems: 'center',
            bgcolor: '#fff', border: `1px solid ${c.line}`, color: c.navy, fontWeight: 700, fontSize: 20, letterSpacing: '.04em',
            boxShadow: tokens.shadow.card,
          }}
        >
          {initials}
        </Box>
        <Box className="ph-cap" sx={{ mt: 1, fontSize: 10.5, fontWeight: 600, letterSpacing: '.14em', color: c.text3, textTransform: 'uppercase' }}>
          Photo coming soon
        </Box>
      </Box>
    </Box>
  )
}

/** Square product image box with placeholder fallback. */
export function ProductImage({ src, alt, brand, sx }: { src?: string; alt: string; brand?: string; sx?: SxProps<Theme> }) {
  return (
    <Box sx={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', borderRadius: `${tokens.radius.sm}px`, overflow: 'hidden', bgcolor: c.surface2, ...((sx as object) ?? {}) }}>
      {src ? (
        <Box component="img" src={src} alt={alt} loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <ProductPlaceholder brand={brand} label={alt} />
      )}
    </Box>
  )
}
