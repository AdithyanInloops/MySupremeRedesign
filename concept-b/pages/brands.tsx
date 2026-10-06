import { Box, Container, Grid, Typography } from '@mui/material'
import React from 'react'
import Link from 'next/link'
import { brands } from '../lib/data'

// Ported from the live pages/brands/index.tsx; data comes from data/brands.json instead of BrandImagesDocument.
function BrandDetails() {
  const brandImages = brands;
  const brandsToDisplay = brandImages || [];

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 14 }, pb: { xs: 4, md: 8 } }}>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 6, paddingLeft: { xs: 2, md: 4 } }}>
        <Typography
          sx={{
            fontSize: { xs: '10px', sm: '12px' },
            fontWeight: 800,
            color: '#FF413D',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
          }}
        >
          Explore Collections
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            color: '#1C1C1C',
            fontSize: { xs: '24px', sm: '32px', md: '38px' },
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
          }}
        >
          Our Brands
        </Typography>
      </Box>

      {brandsToDisplay && brandsToDisplay.length > 0 ? (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ px: { xs: 1, md: 3 } }}>
          {brandsToDisplay.map((option, index) => {
            return (
              <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={`${option.brand_id}-${index}`}>
                <Link 
                  href={`/search/${encodeURIComponent(option.brand_name)}`} 
                  passHref 
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      p: { xs: 2, sm: 2.5 },
                      border: '1px solid #FFE5E5',
                      boxShadow: '0 4px 15px rgba(255, 65, 61, 0.01)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      height: '100%',
                      justifyContent: 'space-between',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: '#FF413D',
                        boxShadow: '0 12px 24px rgba(255, 65, 61, 0.12)',
                        '& .brand-name-text': {
                          color: '#FF413D',
                        }
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: { xs: '75px', sm: '90px', md: '100px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      {option.image_url ? (
                        <Box
                          component="img"
                          src={option.image_url}
                          alt={option.brand_name}
                          loading="lazy"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #FFF0F0 0%, #FFFDFD 100%)',
                            borderRadius: '12px',
                            border: '1px dashed #FFCDCD',
                            p: 1
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 700,
                              fontSize: { xs: '11px', sm: '13px', md: '14px' },
                              color: '#FF413D',
                              textAlign: 'center',
                              letterSpacing: '0.5px',
                              wordBreak: 'break-word',
                            }}
                          >
                            {option.brand_name}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Typography 
                      className="brand-name-text"
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "12px", sm: "14px" },
                        fontWeight: 700,
                        color: "#2C2C2C",
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {option.brand_name}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 8, color: '#666' }}>
          No brand data available
        </Typography>
      )}
    </Container>
  )
}

export default BrandDetails
