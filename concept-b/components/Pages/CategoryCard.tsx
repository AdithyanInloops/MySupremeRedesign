// Ported 1:1 from the live components/CategoryCard/CategoryCard.tsx.
import { Box, Typography, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React from 'react';


interface Props {
  label: string;
  image: string | null;
  selected: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<Props> = ({ label, image, selected, onClick }) => {

  return (
    <Box
      onClick={onClick}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border="1px solid #ccc"
      borderRadius="5px"
      boxShadow={1}
      maxWidth={300}
      sx={{
        cursor: 'pointer',
        padding: { md: "10px", xs: "5px" },
        backgroundColor: selected ? '#e53935' : 'white',
        color: selected ? 'white' : 'black',
        transition: '0.3s',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          component="img"
          src={image ? image : "/assets/placeholder-image.png"}
          alt={label}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            objectFit: 'cover',
            backgroundColor: '#f0f0f0',
          }}
        />
        <Typography noWrap sx={{ color: selected ? 'white' : '#000000', fontFamily: "Poppins", fontWeight: 500, fontSize: { md: "16px" } }}>{label}</Typography>
      </Box>
      <IconButton size="small" sx={{ color: selected ? 'white' : 'black', ml: { md: "60px", xs: "25px" } }}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default CategoryCard;
