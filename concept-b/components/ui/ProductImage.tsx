import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { hasImage, type Product } from '../../lib/data'
import { colors } from '../../lib/theme'

/** Simplified MySupreme crown (single-colour line mark) for placeholders and empty states. */
export function CrownMark({ size = 40, color = colors.line2 }: { size?: number | '100%'; color?: string }) {
  return (
    <Box component="svg" viewBox="0 0 48 34" aria-hidden sx={{ width: size, maxWidth: '100%', height: 'auto', display: 'block', flexShrink: 0 }}>
      <path d="M5 25 3 7.5l11.5 8L24 2l9.5 13.5L45 7.5 43 25Z" fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M6 30.5h36" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="24" cy="17.5" r="2.6" fill={color} />
    </Box>
  )
}

/**
 * Calm placeholder for the many catalogue items without a photo: a soft panel with a muted crown, so a grid full of
 * them still reads as orderly (the old bold "SUPREME" wordmark dominated every grid).
 * TODO(asset): replace with product photography as Magento images are uploaded — nothing else changes.
 */
export function ProductPlaceholder({ caption = true }: { caption?: boolean }) {
  return (
    <Box role="img" aria-label="No product photo yet" sx={{ position: 'absolute', inset: 0, bgcolor: colors.subtle, display: 'grid', placeItems: 'center', containerType: 'inline-size' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6cqw', width: '100%' }}>
        <Box sx={{ width: '26cqw', minWidth: 20, maxWidth: 72 }}><CrownMark size="100%" color="#C9CDD4" /></Box>
        {caption && (
          <Typography aria-hidden sx={{ fontSize: 'clamp(9px, 6.4cqw, 13px)', fontWeight: 500, color: colors.ink400, letterSpacing: '.02em', '@container (max-width: 90px)': { display: 'none' } }}>
            Photo coming soon
          </Typography>
        )}
      </Box>
    </Box>
  )
}

/** Square product image (contain) that fades in, falling back to the placeholder if Magento has none or it fails. */
export default function ProductImage({ product, alt, caption = true, ratio = '1 / 1', padding = '8%' }: { product: Product; alt?: string; caption?: boolean; ratio?: string; padding?: string }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const show = hasImage(product) && !failed
  return (
    <Box sx={{ position: 'relative', width: '100%', aspectRatio: ratio, overflow: 'hidden', bgcolor: show ? '#fff' : colors.subtle }}>
      {show ? (
        <Box
          component="img"
          src={product.small_image!.url}
          alt={alt ?? product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          ref={(el: HTMLImageElement | null) => { if (el?.complete && el.naturalWidth) setLoaded(true) }}
          sx={{ position: 'absolute', inset: padding, width: `calc(100% - 2 * ${padding})`, height: `calc(100% - 2 * ${padding})`, objectFit: 'contain', opacity: loaded ? 1 : 0, transition: 'opacity .25s ease' }}
        />
      ) : (
        <ProductPlaceholder caption={caption} />
      )}
    </Box>
  )
}
