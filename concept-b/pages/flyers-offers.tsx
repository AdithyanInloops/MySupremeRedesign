import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SouthIcon from '@mui/icons-material/South'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import { CautionTapes } from '../components/Pages/FlyersOffers/CautionTapes'
import { DealShowcase } from '../components/Pages/FlyersOffers/DealShowcase'
import { DepartureBoard } from '../components/Pages/FlyersOffers/DepartureBoard'
import { HowItWorks } from '../components/Pages/FlyersOffers/HowItWorks'
import { OfferTeaserCard } from '../components/Pages/FlyersOffers/OfferTeaserCard'
import { Reveal } from '../components/Pages/FlyersOffers/Reveal'
import type { DealTypeId } from '../components/Pages/FlyersOffers/flyersOffersData'
import { dealTypes, offers, warehouses } from '../components/Pages/FlyersOffers/flyersOffersData'

const eyebrowSx = {
  fontSize: { xs: '11px', md: '12px' },
  fontWeight: 800,
  color: '#FF413D',
  letterSpacing: '2.5px',
  textTransform: 'uppercase',
}

const sectionTitleSx = {
  fontWeight: 900,
  color: '#0C0C0C',
  fontSize: { xs: '28px', md: '40px' },
  letterSpacing: '-1px',
  lineHeight: 1.1,
}

function FlyersOffersContent() {
  const reduceMotion = useReducedMotion()
  const [warehouseId, setWarehouseId] = useState(warehouses[0].id)
  const [dealType, setDealType] = useState<DealTypeId>(dealTypes[0].id)

  const warehouse = warehouses.find((w) => w.id === warehouseId) ?? warehouses[0]
  const warehouseOffers = useMemo(
    () => offers.filter((o) => o.warehouseIds.includes(warehouseId)),
    [warehouseId],
  )
  const visibleOffers = warehouseOffers.filter((o) => o.dealType === dealType)
  const activeDeal = dealTypes.find((d) => d.id === dealType) ?? dealTypes[0]

  return (
    <Container disableGutters fixed maxWidth='xl'>
      <Head><title>Flyers & Offers - Coming Soon | MySupreme</title><meta name='description' content='Warehouse flyers, weekly hot picks, bulk savings and restaurant bundles are coming soon to MySupreme.' /></Head>

      <Box sx={{ mx: { xs: '6px', sm: '12px' }, mt: { xs: 1, md: 2 }, mb: 8 }}>
        <DepartureBoard />
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            mb: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography sx={{ color: '#4B5563', fontSize: { xs: '14px', md: '17px' }, maxWidth: 560 }}>
            Warehouse deals built for your kitchen. A monthly flyer, weekly hot picks, bulk savings and
            ready-made bundles are on their way to every MySupreme warehouse.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexShrink: 0 }}>
            <Button
              href='#deal-showcase'
              variant='contained'
              endIcon={<SouthIcon />}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '80px',
                height: 46,
                px: 3,
                textTransform: 'none',
                boxShadow: '0 10px 24px rgba(255,0,0,0.25)',
                '&:hover': { bgcolor: '#e63939' },
              }}
            >
              See what&apos;s coming
            </Button>
            <Button
              href='#warehouses'
              sx={{
                color: '#0C0C0C',
                fontWeight: 700,
                border: '2px solid #0C0C0C',
                borderRadius: '80px',
                height: 46,
                px: 3,
                textTransform: 'none',
                '&:hover': { bgcolor: '#0C0C0C', color: '#fff' },
              }}
            >
              Choose your warehouse
            </Button>
          </Box>
        </Box>
        <CautionTapes />
        <DealShowcase />

        {/* Warehouse picker */}
        <Box id='warehouses' sx={{ mt: { xs: 6, md: 10 }, scrollMarginTop: { xs: '130px', md: '160px' } }}>
          <Reveal>
            <Typography sx={eyebrowSx}>Your nearest warehouse</Typography>
            <Typography sx={sectionTitleSx}>Every warehouse gets its own flyer.</Typography>
          </Reveal>
          <Box
            role='radiogroup'
            aria-label='Warehouse'
            sx={{
              mt: 3,
              display: 'grid',
              gridAutoFlow: { xs: 'column', md: 'initial' },
              gridAutoColumns: { xs: '75%', sm: '45%' },
              gridTemplateColumns: { md: `repeat(${warehouses.length}, 1fr)` },
              gap: 2,
              overflowX: { xs: 'auto', md: 'visible' },
              scrollSnapType: 'x mandatory',
              pb: 1,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {warehouses.map((w, index) => {
              const selected = w.id === warehouseId
              const count = offers.filter((o) => o.warehouseIds.includes(w.id)).length
              return (
                <Reveal key={w.id} delay={index * 0.1} style={{ scrollSnapAlign: 'start' }}>
                  <Box
                    component='button'
                    type='button'
                    role='radio'
                    aria-checked={selected}
                    onClick={() => setWarehouseId(w.id)}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      font: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: { xs: 2, md: 2.5 },
                      borderRadius: '16px',
                      border: '2px solid',
                      borderColor: selected ? '#0C0C0C' : '#F0F0F0',
                      bgcolor: selected ? '#0C0C0C' : '#fff',
                      color: selected ? '#fff' : '#0C0C0C',
                      transform: selected ? 'translateY(-4px)' : 'none',
                      boxShadow: selected ? '0 14px 28px rgba(12,12,12,0.2)' : 'none',
                      transition: 'all 0.25s ease',
                      '&:hover': { borderColor: '#0C0C0C' },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 44, md: 52 },
                        height: { xs: 44, md: 52 },
                        borderRadius: '12px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: selected ? 'primary.main' : '#F3F4F6',
                        color: selected ? '#fff' : '#0C0C0C',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <WarehouseOutlinedIcon />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: '15px', md: '17px' }, color: 'inherit' }}>
                        {w.name}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: selected ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
                        {w.area}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '12px', fontWeight: 700, color: selected ? '#FFD600' : 'primary.main', mt: 0.5 }}
                      >
                        {count} offers coming soon
                      </Typography>
                    </Box>
                    {selected && (
                      <CheckCircleIcon
                        sx={{ position: 'absolute', top: 10, right: 10, fontSize: 20, color: '#FFD600' }}
                      />
                    )}
                  </Box>
                </Reveal>
              )
            })}
          </Box>
        </Box>

        {/* Offer preview */}
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <Reveal>
            <Typography sx={{ ...sectionTitleSx, fontSize: { xs: '22px', md: '30px' } }}>
              Sneak peek:{' '}
              <Box component='span' sx={{ color: 'primary.main' }}>
                {warehouse.name}
              </Box>
            </Typography>
          </Reveal>

          <Box
            sx={{
              position: 'sticky',
              top: { xs: 120, md: 144 },
              zIndex: 5,
              bgcolor: 'background.default',
              py: 1.5,
              borderBottom: '1px solid #EAEAEA',
            }}
          >
            <Tabs
              value={dealType}
              onChange={(_, value: DealTypeId) => setDealType(value)}
              variant='scrollable'
              scrollButtons='auto'
              allowScrollButtonsMobile
              sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTabs-flexContainer': { gap: 1 },
                '& .MuiTab-root': {
                  minHeight: 36,
                  py: 0.5,
                  px: 2,
                  borderRadius: '40px',
                  border: 1,
                  borderColor: '#E0E0E0',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '12px', sm: '14px' },
                  color: '#0C0C0C',
                },
                '& .MuiTab-root.Mui-selected': {
                  bgcolor: 'primary.main',
                  borderColor: 'primary.main',
                  color: '#fff',
                },
              }}
            >
              {dealTypes.map((d) => (
                <Tab
                  key={d.id}
                  value={d.id}
                  label={`${d.label} (${warehouseOffers.filter((o) => o.dealType === d.id).length})`}
                />
              ))}
            </Tabs>
          </Box>

          <Typography sx={{ color: '#6b7280', fontSize: { xs: '13px', md: '15px' }, mt: 2, mb: 2 }}>
            {activeDeal.description}
          </Typography>

          {visibleOffers.length > 0 ? (
            <Box
              // Re-mount the grid on every switch so the cards deal themselves out again.
              key={`${warehouseId}-${dealType}`}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))',
                },
                gap: { xs: 1.5, md: 3 },
                perspective: '1000px',
              }}
            >
              {visibleOffers.map((offer, index) => (
                <m.div
                  key={offer.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 40, rotateX: -25, rotate: index % 2 ? 3 : -3 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, rotate: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <OfferTeaserCard offer={offer} dealLabel={activeDeal.label} warehouseName={warehouse.name} />
                </m.div>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                textAlign: 'center',
                border: '1px dashed #FFD6D6',
                borderRadius: '16px',
                color: '#6b7280',
              }}
            >
              {activeDeal.label} for {warehouse.name} will be announced soon.
            </Box>
          )}
        </Box>

        <Box sx={{ mt: { xs: 7, md: 12 } }}>
          <HowItWorks />
        </Box>

        {/* Closing CTA */}
        <Reveal>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              mt: { xs: 7, md: 12 },
              p: { xs: 4, md: 7 },
              borderRadius: { xs: '16px', md: '28px' },
              bgcolor: '#0C0C0C',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: { xs: '90px', md: '220px' },
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.08)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              SOON
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: '26px', md: '44px' }, letterSpacing: '-1px' }}>
                Can&apos;t wait for the flyer?
              </Typography>
              <Typography sx={{ opacity: 0.75, fontSize: { xs: '14px', md: '17px' }, mt: 1, mb: 3 }}>
                Thousands of products are already available at wholesale prices.
              </Typography>
              <Button
                href='/all-categories'
                variant='contained'
                sx={{
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '80px',
                  height: 48,
                  px: 4,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#e63939', boxShadow: 'none' },
                }}
              >
                Shop all categories
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Box>
    </Container>
  )
}

// Ported from the live flyers-and-offers branch. The real _app wraps pages in LazyMotion; scoped here.
export default function FlyersOffersPage() {
  return (
    <LazyMotion features={domAnimation} strict>
      {/* Reveal slides in from the side; GraphCommerce's layout clips horizontal overflow, so clip here too. */}
      <Box sx={{ overflowX: 'clip' }}>
        <FlyersOffersContent />
      </Box>
    </LazyMotion>
  )
}
