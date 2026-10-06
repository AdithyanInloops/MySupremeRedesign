import { Box, Typography } from '@mui/material'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import type { Offer } from './flyersOffersData'

type OfferTeaserCardProps = {
  offer: Offer
  dealLabel: string
  warehouseName: string
}

export function OfferTeaserCard(props: OfferTeaserCardProps) {
  const { offer, dealLabel, warehouseName } = props

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRadius: '16px',
        border: '1px solid #FFE5E5',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: '#FF413D',
          boxShadow: '0 12px 24px rgba(255, 65, 61, 0.12)',
        },
      }}
    >
      {/* Corner ribbon */}
      <Box
        sx={{
          position: 'absolute',
          top: 18,
          right: -34,
          width: 140,
          transform: 'rotate(45deg)',
          bgcolor: 'primary.main',
          color: '#fff',
          textAlign: 'center',
          fontSize: '10px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          py: 0.5,
          zIndex: 1,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >
        Coming soon
      </Box>

      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 10',
          backgroundImage: `url(${offer.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 12,
            bottom: 12,
            bgcolor: 'rgba(12,12,12,0.75)',
            color: '#fff',
            borderRadius: '40px',
            px: 1.25,
            py: 0.25,
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {offer.category}
        </Box>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75, flex: 1 }}>
        <Typography
          sx={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#FF413D',
          }}
        >
          {dealLabel}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: { xs: '15px', md: '16px' }, color: '#0C0C0C' }}>
          {offer.title}
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>{offer.teaser}</Typography>

        {/* Price placeholder until offers go live */}
        <Box sx={{ mt: 'auto', pt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              height: 22,
              width: 72,
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #F3F4F6 0%, #FFE5E5 50%, #F3F4F6 100%)',
              backgroundSize: '200% 100%',
              animation: 'flyersShimmer 1.8s linear infinite',
              '@keyframes flyersShimmer': {
                '0%': { backgroundPosition: '200% 0' },
                '100%': { backgroundPosition: '-200% 0' },
              },
            }}
          />
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF' }}>
            Price drops soon
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 1,
            pt: 1.25,
            borderTop: '1px dashed #E5E7EB',
            fontSize: '12px',
            color: '#4B5563',
          }}
        >
          <PlaceOutlinedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          {warehouseName} warehouse
        </Box>
      </Box>
    </Box>
  )
}
