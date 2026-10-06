import Head from 'next/head'
import { useCart } from '../../lib/cart'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  useTheme,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormHelperText,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import HotelIcon from '@mui/icons-material/Hotel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import VerifiedIcon from '@mui/icons-material/Verified'
import AssignmentIcon from '@mui/icons-material/Assignment'
import React, { useState } from 'react'

type Props = Record<string, unknown>
type RouteProps = { url: string[] }

const primaryRed = '#FF0004'

// Figma Heading Style
const figmaHeadingSx = {
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 600,
  fontSize: { xs: '32px', md: '48px' },
  lineHeight: { xs: '40px', md: '56px' },
  letterSpacing: '0px',
  color: '#000000',
}

const faqs = [
  { q: 'Do you offer delivery or pickup?', a: 'We offer both Cash & Carry pickup and delivery services' },
  { q: 'What is the minimum order for delivery?', a: 'Minimums vary based on location and order type' },
  { q: 'Do I need a business account?', a: 'Yes, we primarily serve registered foodservice businesses' },
  { q: 'How fast is delivery?', a: 'Same day or next day delivery options are available.' },
]

// Ported from the live pages/service/contact-us.tsx; the submit is simulated.
function ContactUs(props: Props) {
  const title = 'Contact us'
  const { notify } = useCart()
  const [expanded, setExpanded] = useState<string | false>(false)
  const theme = useTheme()

  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    phone_number: '',
    email_address: '',
    business_type: '',
    location: '',
    monthly_spend: '',
    requirement_type: '',
    service_interest: [] as string[],
    product_categories: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  const handleInputChange = (field: keyof typeof formData) => (e: any) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear error on change
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const errors: Partial<Record<keyof typeof formData, string>> = {}
    if (!formData.business_name.trim()) errors.business_name = 'Business name is required.'
    if (!formData.contact_person.trim()) errors.contact_person = 'Contact person is required.'
    if (!formData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required.'
    } else {
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ''))) {
        errors.phone_number = 'Enter a valid 10-digit phone number.'
      }
    }
    if (!formData.email_address.trim()) {
      errors.email_address = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address.trim())) {
      errors.email_address = 'Enter a valid email address.'
    }
    if (!formData.monthly_spend) errors.monthly_spend = 'Please select an estimated monthly spend.'
    if (!formData.requirement_type) errors.requirement_type = 'Please select a requirement type.'
    return errors
  }

  const handleCheckboxChange = (label: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => {
      const interests = prev.service_interest
      if (e.target.checked) {
        return { ...prev, service_interest: [...interests, label] }
      } else {
        return { ...prev, service_interest: interests.filter(item => item !== label) }
      }
    })
  }

  const handleSubmit = async () => {
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      const firstErrorField = Object.keys(formData).find((key) => newErrors[key as keyof typeof formData])
      if (firstErrorField) {
        const el = document.getElementsByName(firstErrorField)[0]
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
        }
      }
      return
    }
    setFormErrors({})
    setLoading(true)
    setSubmitStatus({ type: null, message: '' })

    // Prototype: no backend — simulate the /api/contactus-info success response.
    await new Promise((r) => setTimeout(r, 700))
    setSubmitStatus({ type: 'success', message: 'Thank you! Your request has been sent successfully.' })
    notify('Thank you! Your request has been sent successfully.')
    setFormData({
      business_name: '', contact_person: '', phone_number: '', email_address: '',
      business_type: '', location: '', monthly_spend: '', requirement_type: '',
      service_interest: [], product_categories: '', message: ''
    })
    setLoading(false)
  }

  const handleAccordion = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const formSectionHeadingSx = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    fontSize: '16px',
    color: '#374151',
    mb: 1
  }

  const formLabelSx = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    fontSize: '13px',
    color: '#4b5563',
    mb: 0.5,
    display: 'block'
  }

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fcfcfd',
      borderRadius: '6px',
      '& fieldset': { borderColor: '#e5e7eb' },
      '& input': { p: '10px 14px', fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#4b5563', '&::placeholder': { color: '#9ca3af', opacity: 1 } },
      '& textarea': { p: '4px', fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#4b5563', '&::placeholder': { color: '#9ca3af', opacity: 1 } }
    }
  }

  const selectStyle = {
    bgcolor: '#fcfcfd',
    borderRadius: '6px',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
    '& .MuiSelect-select': { p: '10px 14px', fontSize: '13px', fontFamily: 'Poppins, sans-serif', color: '#4b5563' }
  }

  const heroPrimaryButtonSx = {
    bgcolor: '#FF0000',
    color: 'white',
    '&:hover': { bgcolor: '#cc0000' },
    fontWeight: 600,
    px: '32px',
    height: '58px',
    borderRadius: '8px',
    fontFamily: 'Poppins, sans-serif',
    textTransform: 'none',
    fontSize: '16px'
  }

  const heroSecondaryButtonSx = {
    bgcolor: 'white',
    color: 'black',
    '&:hover': { bgcolor: '#f0f0f0' },
    fontWeight: 600,
    px: '32px',
    height: '58px',
    borderRadius: '8px',
    fontFamily: 'Poppins, sans-serif',
    textTransform: 'none',
    fontSize: '16px'
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Head><title>{`${title} | MySupreme`}</title><meta name="description" content="Contact MySupreme Food Service – reach our team for wholesale pricing, supply solutions, and foodservice support." /></Head>

      {/* ── 1. HERO SECTION ── */}
      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          minHeight: { xs: '500px', md: '614px' },
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%), url('/assets/overlay.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6, lg: 10 } }}>
          <Box sx={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <Typography
              variant="h1"
              sx={{
                ...figmaHeadingSx,
                color: '#FFFFFF',
                fontSize: { xs: '28px', sm: '36px', md: '44px', lg: '48px' },
                lineHeight: { xs: '36px', sm: '44px', md: '52px', lg: '56px' },
                mb: { xs: 2, md: 3 },
              }}
            >
              Get in Touch with<br />MySupreme Food Service
            </Typography>
            <Typography sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: { xs: '15px', sm: '17px', md: '20px' },
              lineHeight: { xs: '22px', sm: '26px', md: '28px' },
              mb: { xs: 3, md: 4 },
              maxWidth: '671px',
              color: '#F1F5F9'
            }}>
              Wholesale food supply, bulk pricing, and reliable delivery for restaurants across the GTA, GTHA, and Niagara Region.
            </Typography>

            <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, flexWrap: 'wrap', mb: { xs: 3, md: 4 } }}>
              <Button
                component="a"
                href="https://api.whatsapp.com/send/?phone=13657770999&text&type=phone_number&app_absent=0&wame_ctl=1&source_surface=20"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                sx={{
                  ...heroPrimaryButtonSx,
                  height: { xs: '48px', md: '58px' },
                  fontSize: { xs: '14px', md: '16px' },
                  px: { xs: '20px', md: '32px' }
                }}>
                Request Pricing
              </Button>
              <Button
                component="a"
                href="tel:+13657770999"
                variant="contained"
                sx={{ ...heroSecondaryButtonSx, height: { xs: '48px', md: '58px' }, fontSize: { xs: '14px', md: '16px' }, px: { xs: '20px', md: '32px' } }}
              >
                Speak to Sales
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <VerifiedIcon sx={{ color: '#FF0000', fontSize: { xs: '16px', md: '18px' }, mt: '1px', flexShrink: 0 }} />
              <Typography sx={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '10px', sm: '11px' },
                letterSpacing: '0.5px',
                color: '#ecedf0ff',
                textTransform: 'uppercase',
                fontWeight: 700,
                lineHeight: 1.5,
              }}>
                SERVING RESTAURANTS, CAFES, CATERERS, AND FOODSERVICE BUSINESSES ACROSS ONTARIO.
              </Typography>
            </Box>

          </Box>
        </Container>
      </Box>

      {/* ── 2. TALK TO OUR TEAM DIRECTLY ── */}
      <Box sx={{ py: { xs: 5, sm: 6, md: 8 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h2"
            align="center"
            sx={{
              ...figmaHeadingSx,
              fontSize: { xs: '24px', sm: '32px', md: '40px', lg: '48px' },
              lineHeight: { xs: '32px', sm: '40px', md: '48px', lg: '56px' },
              mb: { xs: 3, sm: 4, md: 6 },
            }}
          >
            Talk to Our Team Directly
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} justifyContent="center">
            {[
              { icon: <PhoneIcon />, title: 'Sales & Support', desc: '+1 365-777-0999' },
              { icon: <EmailIcon />, title: 'Email Us', desc: 'sales@mysupreme.ca' },
              { icon: <AccountBalanceWalletIcon />, title: 'Business Hours', desc: 'Mon - Sat : 9am - 6pm' },
              { icon: <LocationOnIcon />, title: 'Service Areas', desc: 'GTA, GTHA, Niagara' },
            ].map((card, i) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                <Box
                  sx={{
                    bgcolor: primaryRed,
                    color: 'white',
                    borderRadius: { xs: '10px', md: '12px' },
                    p: { xs: 2, sm: 2.5, md: 3 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1.5, md: 2 },
                    boxShadow: '0 4px 15px rgba(255,0,0,0.2)',
                    height: '100%',
                    minHeight: { xs: '72px', sm: '80px', md: '88px' },
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(255,0,0,0.3)',
                    },
                  }}
                >
                  {/* Icon container — scales across breakpoints */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      width: { xs: 40, sm: 44, md: 48 },
                      height: { xs: 40, sm: 44, md: 48 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& > svg': { fontSize: { xs: 22, sm: 26, md: 28 } },
                    }}
                  >
                    {card.icon}
                  </Box>

                  {/* Text */}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                        opacity: 0.85,
                        lineHeight: 1.3,
                        mb: 0.25,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: '13px', sm: '14px', md: '15px', lg: '16px' },
                        lineHeight: 1.4,
                      }}
                    >
                      {card.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography
            align="center"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: { xs: '13px', sm: '14px', md: '15px' },
              mt: { xs: 3, md: 4 },
              color: '#555',
            }}
          >
            Need immediate help?{' '}
            <Box component="a" href="tel:+13657770999" sx={{ color: primaryRed, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Call our team now.
            </Box>
          </Typography>
        </Container>
      </Box>

      {/* ── 3. WAREHOUSE & FORM SECTION ── */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="flex-start">

            {/* Left Column: Warehouse */}
            <Grid item xs={12} lg={5}>
              <Typography variant="h2" sx={{ ...figmaHeadingSx, mb: { xs: 2, md: 3 } }}>
                Visit Our Wholesale Cash & Carry Warehouse
              </Typography>
              <Typography sx={{ fontFamily: 'Poppins, sans-serif', color: '#111827', mb: { xs: 4, md: 5 }, fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.6 }}>
                Shop directly from our warehouse and access thousands of products at competitive wholesale pricing. Ideal for urgent restocking and bulk purchases.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: { xs: 5, md: 6 } }}>
                {[
                  'walk in and explore products',
                  'Select what your business needs',
                  'Checkout and take it immediately'
                ].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: primaryRed, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, fontFamily: 'Poppins, sans-serif', flexShrink: 0 }}>
                      {i + 1}
                    </Box>
                    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '18px', lineHeight: '24px', color: '#111827' }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Button
                component="a"
                href="https://share.google/6dgfHkiflica2vsjB"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<LocationOnIcon />}
                sx={{ bgcolor: primaryRed, color: 'white', '&:hover': { bgcolor: '#cc0000' }, fontWeight: 600, px: 4, py: 1.5, borderRadius: '8px', fontFamily: 'Poppins, sans-serif', textTransform: 'none', fontSize: '16px' }}
              >
                Visit Our Warehouse
              </Button>
            </Grid>

            {/* Right Column: Form */}
            <Grid item xs={12} lg={7}>
              <Box sx={{ bgcolor: 'white', borderRadius: '16px', p: { xs: 3, sm: 5, md: 6 }, border: '1px solid #f0f0f0', boxShadow: '0px 4px 24px rgba(0,0,0,0.03)' }}>

                <Typography variant="h3" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '28px', mb: 1, color: '#111827' }}>
                  Request Pricing & Supply Solutions
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', color: '#6b7280', mb: 4, fontSize: '14px' }}>
                  Fill out the form below and our B2B team will respond within 2 business hours.
                </Typography>

                <Grid container spacing={2.5}>

                  {/* --- Business Information --- */}
                  <Grid item xs={12}>
                    <Typography sx={formSectionHeadingSx}>Business Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Business Name <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <TextField
                      fullWidth placeholder="Business Name" variant="outlined"
                      name="business_name"
                      sx={inputStyle} value={formData.business_name} onChange={handleInputChange('business_name')}
                      error={!!formErrors.business_name}
                      helperText={formErrors.business_name}
                      FormHelperTextProps={{ sx: { fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Contact Person <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <TextField
                      fullWidth placeholder="Contact Person" variant="outlined"
                      name="contact_person"
                      sx={inputStyle} value={formData.contact_person} onChange={handleInputChange('contact_person')}
                      error={!!formErrors.contact_person}
                      helperText={formErrors.contact_person}
                      FormHelperTextProps={{ sx: { fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Phone Number <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        px: 1.5, border: '1px solid', borderColor: '#e5e7eb',
                        borderRadius: '6px', bgcolor: '#f3f4f6', fontSize: '14px', fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif', color: '#374151', whiteSpace: 'nowrap', userSelect: 'none',
                      }}>
                        +1
                      </Box>
                      <TextField
                        fullWidth placeholder="e.g. 4165550199" variant="outlined"
                        name="phone_number"
                        sx={inputStyle} value={formData.phone_number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setFormData(prev => ({ ...prev, phone_number: val }))
                          if (formErrors.phone_number) setFormErrors(prev => ({ ...prev, phone_number: '' }))
                        }}
                        inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                        error={!!formErrors.phone_number}
                      />
                    </Box>
                    {formErrors.phone_number && (
                      <FormHelperText error sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0, mt: '3px' }}>
                        {formErrors.phone_number}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Email Address <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <TextField
                      fullWidth placeholder="Email Address" variant="outlined"
                      name="email_address"
                      sx={inputStyle} value={formData.email_address} onChange={handleInputChange('email_address')}
                      error={!!formErrors.email_address}
                      helperText={formErrors.email_address}
                      FormHelperTextProps={{ sx: { fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0 } }}
                    />
                  </Grid>

                  {/* --- Business Profile --- */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography sx={formSectionHeadingSx}>Business Profile</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Business Type</Typography>
                    <TextField fullWidth placeholder="e.g. Restaurant, Cafe, Bakery" variant="outlined" sx={inputStyle} value={formData.business_type} onChange={handleInputChange('business_type')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Location (City / Region)</Typography>
                    <TextField fullWidth placeholder="e.g. Toronto, Niagara, Mississauga" variant="outlined" sx={inputStyle} value={formData.location} onChange={handleInputChange('location')} />
                  </Grid>

                  {/* --- Purchase Requirements --- */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography sx={formSectionHeadingSx}>Purchase Requirements</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Estimated Monthly Spend <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <Select
                      fullWidth displayEmpty value={formData.monthly_spend}
                      onChange={handleInputChange('monthly_spend')}
                      inputProps={{ name: 'monthly_spend' }}
                      sx={{ ...selectStyle, ...(formErrors.monthly_spend ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d32f2f !important' } } : {}) }}
                      IconComponent={ExpandMoreIcon}
                      error={!!formErrors.monthly_spend}
                    >
                      <MenuItem value="" disabled><Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>$1K - $5K</Typography></MenuItem>
                      <MenuItem value="under1k">Under $1K</MenuItem>
                      <MenuItem value="1k-5k">$1K - $5K</MenuItem>
                      <MenuItem value="5k-15k">$5K - $15K</MenuItem>
                      <MenuItem value="15k-30k">$15K - $30K</MenuItem>
                      <MenuItem value="30k-60k">$30K - $60K</MenuItem>
                      <MenuItem value="60k-100k">$60K - $100K</MenuItem>
                    </Select>
                    {formErrors.monthly_spend && (
                      <FormHelperText error sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0, mt: '3px' }}>
                        {formErrors.monthly_spend}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography sx={formLabelSx}>Requirement Type <Box component="span" sx={{ color: primaryRed }}>*</Box></Typography>
                    <Select
                      fullWidth displayEmpty value={formData.requirement_type}
                      onChange={handleInputChange('requirement_type')}
                      inputProps={{ name: 'requirement_type' }}
                      sx={{ ...selectStyle, ...(formErrors.requirement_type ? { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d32f2f !important' } } : {}) }}
                      IconComponent={ExpandMoreIcon}
                      error={!!formErrors.requirement_type}
                    >
                      <MenuItem value="" disabled><Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>Regular Supply Partnership</Typography></MenuItem>
                      <MenuItem value="regular">Regular Supply Partnership</MenuItem>
                      <MenuItem value="bulk">Bulk Purchasing</MenuItem>
                      <MenuItem value="urgent">Urgent Restocking</MenuItem>
                      <MenuItem value="one-time">One-time Purchase</MenuItem>
                    </Select>
                    {formErrors.requirement_type && (
                      <FormHelperText error sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', ml: 0, mt: '3px' }}>
                        {formErrors.requirement_type}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* --- Service Interest & Categories --- */}
                  {/* <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                    <Typography sx={formLabelSx}>Service Interest</Typography>
                    <FormGroup sx={{ gap: 1 }}>
                      {['Cash & Carry Pickup', 'Delivery Service', 'Online Ordering ( mysupreme.ca )', 'Dedicated Sales Representative'].map((label, idx) => (
                        <Box key={idx} sx={{ border: '1px solid #f3f4f6', borderRadius: '6px', px: 1, py: 0, bgcolor: '#fbfcfd' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.service_interest.includes(label)}
                                onChange={handleCheckboxChange(label)}
                                sx={{ py: 1, color: '#d1d5db', '&.Mui-checked': { color: primaryRed } }}
                                size="small"
                              />
                            }
                            label={<Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#6b7280' }}>{label}</Typography>}
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Box>
                      ))}
                    </FormGroup>
                  </Grid> */}

                  {/* <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                    <Typography sx={formLabelSx}>Product Categories</Typography>
                    <Select fullWidth displayEmpty value={formData.product_categories} onChange={handleInputChange('product_categories')} sx={{ ...selectStyle, mb: 1, '& .MuiOutlinedInput-notchedOutline': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } }} IconComponent={ExpandMoreIcon}>
                      <MenuItem value="" disabled><Typography sx={{ color: '#9ca3af', fontSize: '13px' }}>Select product categories</Typography></MenuItem>
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="frozen">Frozen Foods</MenuItem>
                      <MenuItem value="dairy">Dairy & Cheese</MenuItem>
                      <MenuItem value="produce">Fresh Produce</MenuItem>
                      <MenuItem value="dry">Dry Goods</MenuItem>
                    </Select>

                    <Box sx={{ border: '1px solid #e5e7eb', borderTop: 'none', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', bgcolor: '#fcfcfd', mt: '-8px' }}>
                      {['Frozen Foods', 'Dairy & Cheese', 'Fresh Produce', 'Dry Goods'].map((item, i) => (
                        <Typography key={i} sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', color: '#6b7280', py: 1.2, px: 2, borderBottom: i !== 3 ? '1px solid #f3f4f6' : 'none' }}>
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  </Grid> */}

                  {/* --- Special Requirements --- */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography sx={formSectionHeadingSx}>Special Requirements / Message</Typography>
                    <TextField fullWidth placeholder="Tell us more about your specific needs..." variant="outlined" multiline rows={4} sx={inputStyle} value={formData.message} onChange={handleInputChange('message')} />
                  </Grid>

                  {/* --- Submit Section --- */}
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    {submitStatus.type && (
                      <Alert severity={submitStatus.type} sx={{ mb: 2, fontFamily: 'Poppins, sans-serif', borderRadius: '8px' }}>
                        {submitStatus.message}
                      </Alert>
                    )}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendOutlinedIcon sx={{ ml: 1 }} />}
                      sx={{ bgcolor: primaryRed, color: 'white', '&:hover': { bgcolor: '#cc0000' }, fontWeight: 600, py: 1.8, borderRadius: '6px', fontFamily: 'Poppins, sans-serif', textTransform: 'none', fontSize: '16px', '&.Mui-disabled': { bgcolor: '#ffb3b3', color: 'white' } }}
                    >
                      {loading ? 'Sending...' : 'Get Custom Pricing'}
                    </Button>
                    <Typography align="center" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#9ca3af', mt: 2 }}>
                      We respond within 24 hours with pricing and supply details tailored to your business
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── 4. FLEXIBLE SUPPLY OPTIONS ── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('/assets/flexible-supply.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ ...figmaHeadingSx, color: '#FFFFFF', mb: 2 }}>
            Flexible Supply Options Designed for Restaurants
          </Typography>
          <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '24px', color: '#FFFFFF', mb: 5 }}>
            MySupreme offers multiple ways to source your restaurant supplies based on your business needs
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, maxWidth: '1000px', mx: 'auto' }}>
            {[
              'Visit our Cash & Carry warehouse for immediate purchases',
              'Work directly with a dedicated sales representative',
              'Use our mobile app for fast reordering',
              'Order online anytime through mysupreme.ca',
              'Get fast delivery with same-day or next-day options'
            ].map((text, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#000000',
                  px: 3,
                  py: 1.5,
                  borderRadius: '30px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                {text}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 5. LONG-TERM SUPPLY PARTNER CTA ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFFFFF', display: 'flex', justifyContent: 'center' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              bgcolor: '#FF0000',
              color: 'white',
              borderRadius: '66px',
              maxWidth: '1214px',
              minHeight: { xs: 'auto', md: '409px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                ...figmaHeadingSx,
                color: '#FFFFFF',
                fontSize: { xs: '24px', sm: '32px', md: '40px', lg: '48px' },
                lineHeight: { xs: '32px', sm: '40px', md: '48px', lg: '56px' },
                mb: { xs: 2, md: 3 },
                textAlign: 'center',
              }}
            >
              Looking for a Long-Term Supply<br />Partner?
            </Typography>
            <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '14px', md: '16px' }, fontWeight: 400, mb: { xs: 3, md: 5 }, textAlign: 'center' }}>
              Reliable supply, competitive pricing, and dedicated support for your growing business.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: '26px' },
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                width: '100%',
                maxWidth: '912px',
                mx: 'auto'
              }}
            >
              <Button
                component="a"
                href="https://api.whatsapp.com/send/?phone=13657770999&text&type=phone_number&app_absent=0&wame_ctl=1&source_surface=20"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: '#FFF4F4',
                  color: '#FF0000',
                  '&:hover': { bgcolor: '#ffebeb' },
                  fontWeight: 700,
                  width: { xs: '100%', sm: '300px', md: '443px' },
                  height: { xs: '56px', md: '70px' },
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontSize: { xs: '15px', md: '18px' },
                  lineHeight: '28px',
                }}
              >
                Request Wholesale Pricing
              </Button>

              <Button
                component="a"
                href="tel:+13657770999"
                variant="contained"
                disableElevation
                sx={{
                  bgcolor: '#FFF4F4',
                  color: '#FF0000',
                  '&:hover': { bgcolor: '#ffebeb' },
                  fontWeight: 700,
                  width: { xs: '100%', sm: '300px', md: '443px' },
                  height: { xs: '56px', md: '70px' },
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontSize: { xs: '15px', md: '18px' },
                  lineHeight: '28px',
                }}
              >
                Schedule a Call with Our Sales Team
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── 6. TRUSTED BY FOODSERVICES ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <Typography variant="h2" align="center" sx={{ ...figmaHeadingSx, mb: 1 }}>
            Trusted by foodservices Businesses Across Ontario
          </Typography>
          <Typography
            align="center"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#000000',
              mb: 6
            }}
          >
            We proudly support:
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            {[
              { icon: <RestaurantIcon />, label: 'Restaurants' },
              { icon: <LocalCafeIcon />, label: 'Cafés' },
              { icon: <SoupKitchenIcon />, label: 'Caterers' },
              { icon: <BakeryDiningIcon />, label: 'Bakeries' },
              { icon: <LocalShippingIcon />, label: 'Food Trucks' },
              { icon: <HotelIcon />, label: 'Hospitality Businesses' },
            ].map((cat, i) => (
              <Grid item xs={6} sm={4} md={1.8} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                      transform: 'translateY(-2px)',
                      borderColor: primaryRed
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: '24px 12px !important' }}>
                    <Box
                      sx={{
                        color: primaryRed,
                        bgcolor: '#FFFFFF',
                        border: `1.5px solid ${primaryRed}`,
                        borderRadius: '8px',
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& > svg': { fontSize: 32 },
                        mb: 2
                      }}
                    >
                      {cat.icon}
                    </Box>
                    <Typography
                      align="center"
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#000000'
                      }}
                    >
                      {cat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Tags Section - Responsive 2x2 Grid Layout */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: '12px', sm: '16px', md: '20px' },
              maxWidth: '850px',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            {[
              { icon: <CheckCircleIcon sx={{ fontSize: { xs: '20px', sm: '22px' } }} />, text: 'Reliable product availability' },
              { icon: <LocalOfferIcon sx={{ fontSize: { xs: '20px', sm: '22px' } }} />, text: 'Wholesale pricing' },
              { icon: <LocalShippingIcon sx={{ fontSize: { xs: '20px', sm: '22px' } }} />, text: 'Fast and consistent delivery' },
              { icon: <SupportAgentIcon sx={{ fontSize: { xs: '20px', sm: '22px' } }} />, text: 'Customer support' },
            ].map((tag, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  gap: { xs: 1.5, sm: 2 },
                  bgcolor: '#FF0000',
                  color: 'white',
                  px: { xs: 3, sm: 4, md: 5 },
                  width: { xs: '100%', sm: 'calc(50% - 10px)', md: '400px' },
                  height: { xs: '56px', sm: '64px' },
                  borderRadius: '40px',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.9 }
                }}
              >
                {tag.icon}
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '14px', sm: '15px', md: '16px' }, fontWeight: 600 }}>
                  {tag.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── 7. FAQ ── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="md">
          <Typography variant="h2" align="center" sx={{ ...figmaHeadingSx, mb: 6 }}>
            Frequently Asked Questions
          </Typography>
          {faqs.map((faq, i) => (
            <Accordion
              key={i}
              expanded={expanded === `faq${i}`}
              onChange={handleAccordion(`faq${i}`)}
              disableGutters
              elevation={0}
              sx={{
                border: '1px solid #eee',
                borderBottom: i === faqs.length - 1 ? '1px solid #eee' : 0,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: primaryRed }} />} sx={{ px: 3, py: 1.5 }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '16px' }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ fontFamily: 'Poppins, sans-serif', color: '#555', fontSize: '15px', lineHeight: 1.6 }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ── 8. PRE-FOOTER CTA ── */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 8 },
        bgcolor: primaryRed,
        color: '#FFFFFF',
        textAlign: 'center',
        width: '100vw',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        boxSizing: 'border-box',
        mb: { xs: 6, md: 10 },
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              lineHeight: { xs: '2.8rem', sm: '3.2rem', md: '4.2rem' },
              mb: { xs: 3, md: 4 },
              textAlign: 'center',
            }}
          >
            Ready to Stock Your Business with Confidence?
          </Typography>
          <Typography sx={{
            fontFamily: 'Poppins, sans-serif',
            color: 'white',
            opacity: 0.92,
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '1rem', md: '1.15rem' },
            lineHeight: 1.8,
            maxWidth: '900px',
            mx: 'auto',
          }}>
            Get the products you need, when you need them at wholesale pricing.
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component="a"
              href="https://api.whatsapp.com/send/?phone=13657770999&text&type=phone_number&app_absent=0&wame_ctl=1&source_surface=20"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<AssignmentIcon />}
              sx={{
                bgcolor: 'white',
                color: primaryRed,
                '&:hover': { bgcolor: '#f0f0f0' },
                fontWeight: 600,
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                textTransform: 'none',
                fontSize: { xs: '14px', md: '16px' },
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Request Pricing
            </Button>
            <Button
              component="a"
              href="tel:+13657770999"
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{
                bgcolor: 'white',
                color: primaryRed,
                '&:hover': { bgcolor: '#f0f0f0' },
                fontWeight: 600,
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                textTransform: 'none',
                fontSize: { xs: '14px', md: '16px' },
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Call Sales
            </Button>
            <Button
              component="a"
              href="https://share.google/6dgfHkiflica2vsjB"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<LocationOnIcon />}
              sx={{
                bgcolor: 'white',
                color: primaryRed,
                '&:hover': { bgcolor: '#f0f0f0' },
                fontWeight: 600,
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                textTransform: 'none',
                fontSize: { xs: '14px', md: '16px' },
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Visit Warehouse
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default ContactUs
