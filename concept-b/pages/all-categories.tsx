import React, { useState } from 'react'
import Link from 'next/link'
import { Box, Button, Grid, Typography } from '@mui/material'
import CategoryCard from '../components/Pages/CategoryCard'
import { departments } from '../lib/data'

// Ported from the live pages/all-categories/index.tsx; reads data/categories.json instead of the menu query.
const AllCategories = () => {

  const categoryDetails = departments
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryDetails?.[0]?.name ?? null);

  const selectedCategoryObj = categoryDetails.find((cat) => cat.name === selectedCategory)

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { md: "40px", xs: "20px" }, pt: { xs: 0, md: "80px" } }}>
      <Box sx={{
        flexShrink: 0,
        width: { md: "350px", xs: "100%" },
        pl: { md: "50px", xs: "20px" },
        pb: { md: "40px", xs: "20px" },
        // Mobile Fixed & Desktop Sticky Styles
        position: { xs: "static", md: "sticky" },
        top: { md: "160px" },
        left: 0,
        zIndex: 100,
        bgcolor: "white",
        pt: { xs: "20px", md: 0 },
        borderBottom: { xs: "1px solid #f0f0f0", md: "none" },
        // Ensure sidebar is scrollable if content is tall on desktop
        maxHeight: { md: "calc(100vh - 180px)" },
        overflowY: { md: "auto" },
        // Hide scrollbar for cleaner look
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}>
        <Typography variant='h2' sx={{ fontWeight: 700, fontSize: { md: "28px", xs: "22px" }, fontFamily: "Poppins", pb: '24px', letterSpacing: '-0.02em', color: '#1a1a1a' }}>Categories</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, overflowX: { xs: 'auto', md: 'visible' }, gap: 2, pb: 2, '::-webkit-scrollbar': { display: 'none' } }}>
          {categoryDetails.map((item) => (
            <Box key={item.name} sx={{ minWidth: { xs: '180px', md: 'auto' }, flexShrink: 0 }}>
              <CategoryCard label={item.name} image={item.image} selected={selectedCategory === item.name} onClick={() => setSelectedCategory(item.name)} />
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0, pt: { xs: "10px", md: "65px" }, px: { xs: 2, md: 0 }, pr: { md: 5 } }}>
        {selectedCategoryObj && selectedCategoryObj.children.length > 0 ? (
          <Grid container spacing={3}>
            {selectedCategoryObj.children.map((subcategory) => (
              <Grid item xs={12} md={6} xl={4} key={subcategory.name}>
                <Button
                  component={Link}
                  href={`/${selectedCategoryObj.url_key}?sub=${subcategory.url_key}`}
                  sx={{
                    width: "100%",
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 3,
                    height: '100%',
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    border: '1px solid #EAEAEA',
                    textTransform: 'none',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transform: 'translateY(-2px)',
                      backgroundColor: '#FAFAFA'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      borderRadius: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#F5F5F5'
                    }}
                  >
                    <img
                      src={subcategory.image || '/assets/placeholder-image.png'}
                      alt={subcategory.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "16px",
                        fontFamily: 'Poppins',
                        color: '#333',
                        lineHeight: 1.4,
                        mb: 0.5,
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {subcategory.name}
                    </Typography>
                    {/* Optional: Add item count or status here if available in the future */}
                    {/* <Typography variant="caption" sx={{ color: '#888' }}>
                          View Products
                       </Typography> */}
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 15, textAlign: 'center', color: '#999', bgcolor: '#f9f9f9', borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>No items found</Typography>
            <Typography variant="body2">Select a different category to view available products</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default AllCategories
