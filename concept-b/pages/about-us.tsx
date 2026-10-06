import { Box, Button, Container, Grid, Typography, useTheme, Card, CardContent, Popover } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import CelebrationIcon from '@mui/icons-material/Celebration';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import PaymentsIcon from '@mui/icons-material/Payments';
import GppGoodIcon from '@mui/icons-material/GppGood';
import SpeedIcon from '@mui/icons-material/Speed';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PhoneIcon from '@mui/icons-material/Phone';

const primaryRed = '#FF0004';

// Ported 1:1 from the live pages/about-us/index.tsx (GraphCommerce layout wrappers removed).
function AboutUs() {
    const theme = useTheme();
    const [contactAnchorEl, setContactAnchorEl] = useState<HTMLButtonElement | null>(null);
    const contactOpen = Boolean(contactAnchorEl);

    const handleContactClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setContactAnchorEl(event.currentTarget);
    };
    const handleContactClose = () => {
        setContactAnchorEl(null);
    };
    return (
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>

            {/* 1. Hero Section */}
            <Box
                sx={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minHeight: { xs: '480px', sm: '520px', md: '553px' },
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%), url('/assets/cooking-chefs.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white'
                }}
            >
                <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 6, md: 0 } }}>
                    <Box sx={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 800,
                                fontSize: { xs: '2rem', sm: '2.8rem', md: '4rem', lg: '64px' },
                                lineHeight: { xs: 1.15, sm: 1.1, md: '72px' },
                                letterSpacing: '-1px',
                                mb: { xs: 2.5, md: 4 }
                            }}
                        >
                            Built for Restaurants.<br />
                            Designed for Reliable<br />
                            Supply.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 400,
                                fontSize: { xs: '15px', sm: '16px', md: '18px' },
                                lineHeight: { xs: '24px', md: '28px' },
                                color: 'rgba(255,255,255,0.9)',
                                maxWidth: '600px',
                                mb: { xs: 3.5, md: 5 }
                            }}
                        >
                            Supreme Food Service is a modern wholesale distribution partner helping
                            restaurants across the GTA, GTHA, and Niagara Region access quality
                            products, competitive pricing, and dependable service.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, flexWrap: 'wrap' }}>
                            <Button
                                component="a"
                                href="https://api.whatsapp.com/send/?phone=13657770999&text&type=phone_number&app_absent=0&wame_ctl=1&source_surface=20"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                sx={{
                                    bgcolor: primaryRed,
                                    '&:hover': { bgcolor: '#cc0000' },
                                    fontWeight: 700,
                                    px: { xs: 3, md: 4 },
                                    py: { xs: 1.3, md: 2 },
                                    borderRadius: '8px',
                                    fontSize: { xs: '14px', md: '16px' },
                                    textTransform: 'none',
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Request Wholesale Pricing
                            </Button>
                            <Button
                                component="a"
                                href="https://share.google/6dgfHkiflica2vsjB"
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                sx={{
                                    bgcolor: 'white',
                                    color: 'black',
                                    '&:hover': { bgcolor: '#f0f0f0' },
                                    fontWeight: 700,
                                    px: { xs: 3, md: 4 },
                                    py: { xs: 1.3, md: 2 },
                                    borderRadius: '8px',
                                    fontSize: { xs: '14px', md: '16px' },
                                    textTransform: 'none',
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Visit Our Warehouse
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
                {/* 2. Trusted Partner Section */}
                <Box sx={{ bgcolor: '#FFFFFF', width: '100%', py: { xs: 4, md: 6 } }}>
                    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 600,
                                        fontSize: { xs: '26px', sm: '34px', md: '40px', lg: '48px' },
                                        color: '#000000',
                                        lineHeight: { xs: '34px', sm: '42px', md: '56px' },
                                        letterSpacing: '0px'
                                    }}
                                >
                                    Your Trusted <Box component="span" sx={{ color: primaryRed }}>Partner</Box> in Restaurant Supply
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: { xs: '15px', md: '17px', lg: '18px' },
                                        color: '#333333',
                                        lineHeight: { xs: '24px', md: '28px' },
                                        fontWeight: 400
                                    }}
                                >
                                    MySupreme Food Service is a full-service wholesale food distribution
                                    company built specifically for the foodservice industry. We support
                                    restaurants, cafs, caterers, bakeries, food trucks, and hospitality
                                    businesses with a complete supply solution designed for efficiency,
                                    reliability, and growth.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: { xs: '260px', sm: '320px', md: '360px' },
                                    borderRadius: '16px',
                                    backgroundImage: `url('/assets/trusted-partner.png')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    boxShadow: '0px 8px 30px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* 3. Our Mission */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: { xs: 5, md: 8 },
                        mb: { xs: 4, md: 6 }
                    }}
                >
                    <Box sx={{
                        bgcolor: '#FF0000',
                        color: 'white',
                        width: '100%',
                        maxWidth: '832px',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: { xs: 4, sm: 5, md: 6 },
                        gap: { xs: 2, md: 3 },
                        boxShadow: '0px 8px 30px rgba(255,0,0,0.2)'
                    }}>
                        <RestaurantIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 700,
                                fontSize: { xs: '22px', sm: '26px', md: '32px' },
                                lineHeight: 1.2,
                                m: 0
                            }}
                        >
                            Our Mission
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                maxWidth: '700px',
                                mx: 'auto',
                                fontWeight: 400,
                                lineHeight: { xs: '22px', md: '26px' },
                                fontSize: { xs: '14px', md: '16px' },
                                m: 0
                            }}
                        >
                            To provide restaurants with the best products, the best prices, and the most reliable service in the market. We are committed to helping foodservice businesses reduce operational stress, control costs, and maintain consistent quality through dependable supply.
                        </Typography>
                    </Box>
                </Box>

                {/* 4. Complete System */}
                <Box
                    sx={{
                        bgcolor: '#F9F8FF',
                        width: '100vw',
                        position: 'relative',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: { xs: 6, sm: 8, md: 10 },
                        mb: { xs: 6, md: 10 }
                    }}
                >
                    <Box sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 3, md: '10px' } }}>

                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '28px', md: '40px' },
                                color: '#000000',
                                textAlign: 'center',
                                mb: { xs: 2, md: 1 }
                            }}
                        >
                            A Complete Restaurant Supply System
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                color: '#000000',
                                textAlign: 'center',
                                maxWidth: '850px',
                                mx: 'auto',
                                mb: { xs: 4, md: 5 },
                                fontSize: { xs: '14px', md: '16px' },
                                lineHeight: 1.6,
                                fontWeight: 400
                            }}
                        >
                            MySupreme combines multiple service channels into one integrated system, giving restaurant operators complete flexibility in how they source their supplies.
                        </Typography>

                        <Grid container spacing={3} justifyContent="center" sx={{ mb: { xs: 4, md: 5 } }}>
                            {[
                                { icon: <StorefrontIcon />, title: "Cash & Carry warehouse for immediate purchases" },
                                { icon: <SupportAgentIcon />, title: "Online ordering platform ( mysupreme.ca )" },
                                { icon: <PhoneIphoneIcon />, title: "Mobile app for fast reordering" },
                                { icon: <SupportAgentIcon />, title: "Dedicated field sales representatives" },
                                { icon: <LocalShippingIcon />, title: "Same-day or next-day delivery network" },
                            ].map((item, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                                    <Card sx={{
                                        height: '100%',
                                        borderRadius: '16px',
                                        bgcolor: '#FFFFFF',
                                        boxShadow: '0px 4px 15px rgba(0,0,0,0.04)',
                                        border: '1px solid rgba(0,0,0,0.03)',
                                        '&:hover': { boxShadow: '0px 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-4px)', transition: 'all 0.3s' }
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ color: primaryRed, '& > svg': { fontSize: 36 } }}>
                                                {item.icon}
                                            </Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', lineHeight: 1.4, color: '#000000', fontFamily: 'Poppins, sans-serif' }}>
                                                {item.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Typography
                            variant="body2"
                            sx={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: 400,
                                fontSize: { xs: '13px', md: '15px' },
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            This multi-channel approach ensures restaurants can order, restock, and manage supplies in the way that works best for them.
                        </Typography>
                    </Box>
                </Box>
            </Container>


            {/* 5. Fast, Direct Access */}
            <Box sx={{ bgcolor: primaryRed, py: { xs: 8, md: 10 }, width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)', px: { xs: 2, md: 0 } }}>
                <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ textAlign: 'center', color: '#FFFFFF', mb: { xs: 5, md: 6 }, width: '100%' }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 600,
                                fontSize: { xs: '32px', md: '48px' },
                                lineHeight: { xs: '40px', md: '56px' },
                                mb: 3
                            }}
                        >
                            Fast, Direct Access to Wholesale Products
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 400,
                                fontSize: { xs: '16px', md: '18px' },
                                maxWidth: '1174px',
                                mx: 'auto',
                                color: '#FFFFFF',
                                lineHeight: '28px',
                                letterSpacing: '0px'
                            }}
                        >
                            Our Cash & Carry warehouse allows businesses to shop directly and purchase products at competitive wholesale pricing. Ideal for urgent restocking and bulk buying, customers can walk in, select products, and complete their purchase immediately.
                        </Typography>
                    </Box>

                    <Grid
                        container
                        spacing={1.875}
                        justifyContent="center"
                        sx={{ maxWidth: '1260px', width: '100%', mx: 'auto' }}
                    >
                        {[
                            { title: 'Fresh Produce', image: '/assets/produce.png' },
                            { title: 'Meat & Poultry', image: '/assets/chicken-meat.png' },
                            { title: 'Seafood', image: '/assets/sea-food.png' },
                            { title: 'Dairy products', image: '/assets/butter-milk.png' },
                            { title: 'Packaging & disposables', image: '/assets/packaging.png' },
                            { title: 'Dry Groceries', image: '/assets/dry-groceries.png' },
                            { title: 'Cleaning supplies', image: '/assets/cleaning.png' },
                            { title: 'Frozen Foods', image: '/assets/frozen-foods.png' },
                        ].map((category, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 240, md: 280 },
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        bgcolor: 'grey.300',
                                        backgroundImage: `url(${category.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        boxShadow: theme.shadows[4],
                                        transition: 'transform 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            zIndex: 10
                                        },
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '50%',
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 20,
                                            left: 20,
                                            color: '#FFFFFF',
                                            fontFamily: 'Poppins, sans-serif',
                                            fontWeight: 600,
                                            zIndex: 1,
                                            fontSize: '18px',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {category.title}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, display: 'flex', justifyContent: 'center' }}>
                {/* 6. Order Anytime */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    maxWidth: '1260px',
                    mx: 'auto',
                    gap: { xs: 3, md: 4 },
                    alignItems: 'stretch'
                }}>

                    {/* Left Red Block */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '826px' },
                            minHeight: { xs: 'auto', md: '626px' },
                            bgcolor: primaryRed,
                            color: 'white',
                            px: { xs: 4, md: 8 },
                            py: { xs: 5, md: 8 },
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0px 10px 30px rgba(255, 0, 4, 0.15)',
                            flexShrink: 0
                        }}
                    >
                        {/* Background Outline Watermark */}
                        <Box sx={{
                            position: 'absolute',
                            right: '-10%',
                            top: '5%',
                            opacity: 0.08,
                            transform: 'scale(1.5)',
                            pointerEvents: 'none',
                            color: 'white'
                        }}>
                            <ShoppingCartOutlinedIcon sx={{ fontSize: '30rem' }} />
                        </Box>

                        <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '2rem', md: '40px' }, lineHeight: 1.2, fontFamily: 'Poppins, sans-serif' }}>
                                Order Anytime, From<br />Anywhere
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    fontSize: '18px',
                                    mb: 4,
                                    maxWidth: '552px',
                                    lineHeight: '29.3px',
                                    fontWeight: 400,
                                    fontFamily: 'Poppins, sans-serif'
                                }}
                            >
                                Our digital platforms are designed to simplify purchasing for busy restaurant operators. The MySupreme mobile app extends this convenience, allowing businesses to manage orders, track deliveries, and stay updated on promotions directly from their phone.
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                {[
                                    'Real-time pricing for all stock items',
                                    'Easy search with SKU or name',
                                    'Full order history and 1-tap reordering',
                                    '24/7 access via web or mobile app'
                                ].map((text, i) => (
                                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                                        <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>
                                            {text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            {/* Spacer */}
                            <Box sx={{ flexGrow: 1 }} />

                            {/* Bottom Store Badges */}
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 'auto', pt: 4 }}>
                                <Link href="https://apps.apple.com/in/app/mysupreme/id6749691637" passHref target="_blank">
                                    <img
                                        src="/assets/appstore1.svg"
                                        alt="Download on the App Store"
                                        style={{ cursor: 'pointer', width: '160px', height: 'auto', display: 'block' }}
                                    />
                                </Link>
                                <Link href="https://play.google.com/store/apps/details?id=com.mysupreme.app" passHref target="_blank">
                                    <img
                                        src="/assets/playstore1.svg"
                                        alt="Get it on Google Play"
                                        style={{ cursor: 'pointer', width: '160px', height: 'auto', display: 'block' }}
                                    />
                                </Link>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Phone Block */}
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: { xs: 400, md: '626px' },
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#FFFFFF',
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0px 4px 20px rgba(0,0,0,0.02)'
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/order-anytime.png"
                            alt="App Interface Mockup"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>

                </Box>
            </Container>

            <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
                {/* 7. Personalized Support */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    maxWidth: '1268px',
                    mx: 'auto',
                    gap: { xs: 4, sm: 5, lg: 7 }, // Responsive gap for different screens
                    mb: { xs: 10, md: 16 },
                    alignItems: 'stretch' // Ensures both boxes are exactly the same height on desktop
                }}>
                    {/* Left Image Block */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '45%', lg: '500px' },
                            minHeight: { xs: '320px', sm: '400px', md: 'auto' }, // Lets flex-stretch control desktop height
                            borderRadius: '22px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                            display: 'flex' // Ensures child image scales correctly
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/personalized-support.png"
                            alt="Personalized Support Team"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>

                    {/* Right Red Block */}
                    <Box
                        sx={{
                            flex: 1,
                            bgcolor: primaryRed,
                            color: 'white',
                            p: { xs: 4, sm: 5, md: 6, lg: 8 }, // Dynamic padding prevents text from touching edges
                            borderRadius: '22px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            boxShadow: '0px 10px 30px rgba(255, 0, 4, 0.15)',
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                mb: { xs: 2, md: 3 },
                                fontSize: { xs: '28px', sm: '32px', md: '36px', lg: '40px' },
                                lineHeight: 1.2,
                                fontFamily: 'Poppins, sans-serif'
                            }}
                        >
                            Personalized Support for Your Business
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                                mb: { xs: 3, md: 4 },
                                opacity: 0.95,
                                lineHeight: 1.7,
                                fontWeight: 400,
                                fontFamily: 'Poppins, sans-serif',
                                maxWidth: '600px'
                            }}
                        >
                            Our field sales representatives work directly with restaurant operators to provide tailored supply solutions. This ensures every customer receives hands-on support aligned with their business needs.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                            {[
                                'Product recommendations',
                                'Cost optimization strategies',
                                'Menu-based supply planning',
                                'New product introductions',
                                'Inventory and order planning'
                            ].map((text, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <CheckCircleIcon sx={{ fontSize: { xs: 20, md: 22 }, color: 'white', flexShrink: 0, mt: '2px' }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: { xs: '14px', sm: '15px', md: '15px' },
                                            fontFamily: 'Poppins, sans-serif',
                                            lineHeight: 1.4
                                        }}
                                    >
                                        {text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* 8. Supply Delivered */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    maxWidth: '1216px',
                    mx: 'auto',
                    bgcolor: '#FFFFFF',
                    borderRadius: '16px',
                    p: { xs: 4, md: '64px 49px' },
                    gap: { xs: 6, md: '40px' },
                    mb: { xs: 10, md: 16 },
                    alignItems: 'center',
                    boxShadow: '0px 4px 20px rgba(0,0,0,0.04)'
                }}>
                    {/* Left Text Block */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', pr: { md: 4 } }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 600,
                                fontSize: { xs: '2rem', md: '48px' },
                                color: '#000000',
                                fontFamily: 'Poppins, sans-serif',
                                mb: 3,
                                lineHeight: 1.2
                            }}
                        >
                            Supply Delivered<br />When You Need It
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: { xs: '16px', md: '18px' },
                                color: '#000000',
                                mb: 4,
                                lineHeight: 1.6,
                                fontWeight: 400,
                                fontFamily: 'Poppins, sans-serif',
                                maxWidth: '520px'
                            }}
                        >
                            We provide same-day or next-day delivery across the GTA, GTHA, and Niagara Region. Restaurants can depend on consistent and timely supply without disruption.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            {[
                                'Scheduled delivery routes',
                                'Cold chain handling',
                                'Reliable product availability'
                            ].map((text, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CheckCircleIcon sx={{ fontSize: 24, color: primaryRed }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#000000',
                                            fontSize: '16px',
                                            fontFamily: 'Poppins, sans-serif'
                                        }}
                                    >
                                        {text}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Image Block */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '535px' },
                            height: { xs: '300px', md: '535px' },
                            borderRadius: 0,
                            overflow: 'hidden',
                            flexShrink: 0
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/truck.png"
                            alt="Supply Delivery Truck"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Box>

                {/* 9. Everything Your Kitchen Needs */}
                <Box sx={{
                    width: '100%',
                    maxWidth: '1440px',
                    mx: 'auto',
                    pt: { xs: 8, md: '64px' },
                    pb: { xs: 4, md: '0px' },
                    px: { xs: 3, md: '80px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#FFFFFF',
                    mb: { xs: 8, md: 10 }
                }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '28px', md: '40px' },
                            color: '#000000',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        Everything Your Kitchen Needs In One Place
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 400,
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#666666',
                            mb: 6,
                            textAlign: 'center',
                            maxWidth: '800px'
                        }}
                    >
                        MySupreme offers a growing catalog of thousands of products across all major restaurant supply categories.
                    </Typography>

                    <Grid container spacing={3} justifyContent="center" sx={{ width: '100%', mb: 5 }}>
                        {[
                            { icon: <RestaurantIcon sx={{ fontSize: 24 }} />, title: "Food Products (frozen, fresh, dairy, dry goods)" },
                            { icon: <InventoryIcon sx={{ fontSize: 24 }} />, title: "Packaging and eco-friendly disposables" },
                            { icon: <SoupKitchenIcon sx={{ fontSize: 24 }} />, title: "Kitchen tools and essentials" },
                            { icon: <SanitizerIcon sx={{ fontSize: 24 }} />, title: "Cleaning and sanitation supplies" },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    p: { xs: 3, md: 4 },
                                    borderRadius: '16px',
                                    bgcolor: '#FFFFFF',
                                    boxShadow: '0px 4px 20px rgba(0,0,0,0.04)',
                                    border: '1px solid rgba(0,0,0,0.02)',
                                    textAlign: 'center'
                                }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        bgcolor: primaryRed,
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                        flexShrink: 0
                                    }}>
                                        {item.icon}
                                    </Box>
                                    <Typography sx={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#000000',
                                        lineHeight: 1.5
                                    }}>
                                        {item.title}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: { xs: '13px', md: '14px' },
                            color: '#000000',
                            fontWeight: 500,
                            textAlign: 'center'
                        }}
                    >
                        Our goal is to become a single-source supplier for restaurants.
                    </Typography>
                </Box>

                {/* 10. Supporting Foodservice */}
                <Box sx={{
                    width: '100%',
                    maxWidth: '1280px',
                    mx: 'auto',
                    pt: { xs: 6, md: '64px' },
                    pb: { xs: 6, md: '64px' },
                    px: { xs: 3, md: '32px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '32px',
                    bgcolor: '#FFFFFF',
                    mb: { xs: 8, md: 10 }
                }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '28px', md: '40px' },
                            color: '#000000',
                            textAlign: 'center',
                            m: 0
                        }}
                    >
                        Supporting the Foodservice Industry
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#666666',
                            textAlign: 'center',
                            m: 0
                        }}
                    >
                        We proudly serve a wide range of businesses, including:
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'space-between' },
                        flexWrap: 'wrap',
                        columnGap: 2,
                        rowGap: 4,
                        width: '100%',
                    }}>
                        {[
                            { icon: <RestaurantIcon fontSize="small" />, label: 'Restaurants' },
                            { icon: <LocalCafeIcon fontSize="small" />, label: 'Cafes' },
                            { icon: <BakeryDiningIcon fontSize="small" />, label: 'Bakeries' },
                            { icon: <RoomServiceIcon fontSize="small" />, label: 'Catering\ncompanies' },
                            { icon: <DeliveryDiningIcon fontSize="small" />, label: 'Food trucks' },
                            { icon: <TakeoutDiningIcon fontSize="small" />, label: 'Ghost\nkitchens' },
                            { icon: <CelebrationIcon fontSize="small" />, label: 'Hospitality &\nevent venues' },
                        ].map((item, index) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                width: { xs: '100px', md: 'auto' }
                            }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    bgcolor: primaryRed,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    color: '#000000',
                                    textAlign: 'center',
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.3
                                }}>
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: { xs: '13px', md: '14px' },
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: 400,
                            m: 0
                        }}
                    >
                        From small independent operators to multi-location businesses, we provide scalable supply solutions.
                    </Typography>
                </Box>

                {/* 11. Committed to Your Success */}
                <Box sx={{
                    width: '100%',
                    maxWidth: '1440px',
                    mx: 'auto',
                    pt: { xs: 8, md: '64px' },
                    pb: { xs: 4, md: '0px' },
                    px: { xs: 3, md: '80px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: '#FFFFFF',
                    mb: { xs: 8, md: 10 }
                }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '28px', md: '40px' },
                            color: '#000000',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        Committed to Your Success
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 400,
                            fontSize: { xs: '14px', md: '16px' },
                            color: '#666666',
                            mb: 6,
                            textAlign: 'center',
                            maxWidth: '600px'
                        }}
                    >
                        At MySupreme Food Service, we are dedicated to building long-term partnerships through:
                    </Typography>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 2, md: 3 },
                        width: '100%',
                        mb: 6
                    }}>
                        {[
                            { icon: <AllInboxIcon sx={{ fontSize: 24 }} />, title: "Reliable Supply" },
                            { icon: <PaymentsIcon sx={{ fontSize: 24 }} />, title: "Competitive\nPricing" },
                            { icon: <GppGoodIcon sx={{ fontSize: 24 }} />, title: "Professional\nService" },
                            { icon: <SpeedIcon sx={{ fontSize: 24 }} />, title: "Fast Delivery" },
                            { icon: <WorkspacePremiumIcon sx={{ fontSize: 24 }} />, title: "Consistent\nProduct Quality" },
                        ].map((item, index) => (
                            <Card key={index} sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 18%' },
                                maxWidth: { md: '220px' },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: { xs: 3, md: 4 },
                                borderRadius: '16px',
                                bgcolor: primaryRed,
                                color: '#FFFFFF',
                                border: 'none',
                                textAlign: 'center',
                                aspectRatio: { md: '1 / 1' },
                                boxShadow: '0px 8px 24px rgba(255, 0, 4, 0.15)',
                            }}>
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    bgcolor: '#FFFFFF',
                                    color: primaryRed,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    flexShrink: 0
                                }}>
                                    {item.icon}
                                </Box>
                                <Typography sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: { xs: '14px', md: '15px' },
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    whiteSpace: 'pre-line'
                                }}>
                                    {item.title}
                                </Typography>
                            </Card>
                        ))}
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: { xs: '13px', md: '15px' },
                            color: '#000000',
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        Our goal is to help restaurants operate efficiently and grow with confidence.
                    </Typography>
                </Box>

                {/* 12. Partner with MySupreme Today */}
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    px: { xs: 2, md: 3 },
                    mb: { xs: 8, md: 12 }
                }}>
                    <Box sx={{
                        width: '100%',
                        maxWidth: '1216px',
                        bgcolor: '#FF0509',
                        borderRadius: '24px',
                        p: { xs: 4, md: '64px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0px 10px 40px rgba(255, 5, 9, 0.2)'
                    }}>
                        {/* Abstract Background Rings matching the design */}
                        <Box sx={{
                            position: 'absolute',
                            width: { xs: '400px', md: '600px' },
                            height: { xs: '400px', md: '600px' },
                            borderRadius: '50%',
                            border: '40px solid rgba(255, 255, 255, 0.04)',
                            top: { xs: '-200px', md: '-300px' },
                            left: { xs: '-100px', md: '-150px' },
                            pointerEvents: 'none'
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            width: { xs: '300px', md: '500px' },
                            height: { xs: '300px', md: '500px' },
                            borderRadius: '50%',
                            border: '40px solid rgba(255, 255, 255, 0.04)',
                            bottom: { xs: '-150px', md: '-250px' },
                            right: { xs: '-50px', md: '-100px' },
                            pointerEvents: 'none'
                        }} />

                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: 700,
                                fontSize: { xs: '32px', md: '48px' },
                                color: '#FFFFFF',
                                mb: 2,
                                zIndex: 1
                            }}
                        >
                            Partner with MySupreme Today
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: { xs: '15px', md: '16px' },
                                color: '#FFFFFF',
                                opacity: 0.95,
                                mb: { xs: 4, md: '40px' },
                                maxWidth: '650px',
                                lineHeight: 1.6,
                                zIndex: 1
                            }}
                        >
                            Experience a smarter, more reliable way to manage your restaurant<br />
                            supply with precision distribution.
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            zIndex: 1
                        }}>
                            {[
                                { text: 'Request Wholesale Pricing', href: 'https://api.whatsapp.com/send/?phone=13657770999&text&type=phone_number&app_absent=0&wame_ctl=1&source_surface=20' },
                                { text: 'Visit Our Warehouse', href: 'https://share.google/6dgfHkiflica2vsjB' },
                            ].map((btn, i) => (
                                <Button
                                    key={i}
                                    component="a"
                                    href={btn.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    sx={{
                                        bgcolor: '#FFFFFF',
                                        color: '#000000',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins, sans-serif',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        textTransform: 'none',
                                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            bgcolor: '#f5f5f5',
                                            transform: 'translateY(-2px)',
                                            transition: 'all 0.2s ease-in-out'
                                        }
                                    }}
                                >
                                    {btn.text}
                                </Button>
                            ))}

                            {/* Contact Our Team Button with Phone Popover */}
                            <Button
                                variant="contained"
                                onClick={handleContactClick}
                                sx={{
                                    bgcolor: '#FFFFFF',
                                    color: '#000000',
                                    fontWeight: 600,
                                    fontFamily: 'Poppins, sans-serif',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    textTransform: 'none',
                                    boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        bgcolor: '#f5f5f5',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.2s ease-in-out'
                                    }
                                }}
                            >
                                Contact Our Team
                            </Button>

                            <Popover
                                open={contactOpen}
                                anchorEl={contactAnchorEl}
                                onClose={handleContactClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        mt: 1.5,
                                        borderRadius: '16px',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        boxShadow: '0px 16px 48px rgba(0,0,0,0.14)',
                                        overflow: 'visible',
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: -8,
                                            left: '50%',
                                            transform: 'translateX(-50%) rotate(45deg)',
                                            width: 16,
                                            height: 16,
                                            bgcolor: 'background.paper',
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            borderBottom: 'none',
                                            borderRight: 'none',
                                            zIndex: 0,
                                        },
                                    }
                                }}
                            >
                                <Box sx={{ p: '20px 24px', minWidth: '270px' }}>
                                    {/* Header */}
                                    <Typography sx={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#999999',
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        mb: 1.5
                                    }}>
                                        Call Us Directly
                                    </Typography>

                                    {/* Phone Row */}
                                    <Box
                                        component="a"
                                        href="tel:+13657770999"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            mb: 2,
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            cursor: 'pointer',
                                            '&:hover .phone-number-text': {
                                                color: primaryRed
                                            }
                                        }}
                                    >
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: '#FFF0F0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <PhoneIcon sx={{ fontSize: 18, color: primaryRed }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                className="phone-number-text"
                                                sx={{
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '19px',
                                                    fontWeight: 700,
                                                    color: '#111111',
                                                    letterSpacing: '-0.3px',
                                                    lineHeight: 1.2,
                                                    transition: 'color 0.2s ease-in-out'
                                                }}
                                            >
                                                +1 365-777-0999
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Popover>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default AboutUs;
