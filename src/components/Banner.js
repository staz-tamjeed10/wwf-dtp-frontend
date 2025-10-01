// components/Banner.js
import { Box } from '@mui/material';

export default function Banner() {
  return (
    <Box
      component="img"
      src="/assets/banner.jpg" // 🖼️ Replace with your actual image path
      alt="Top Banner"
      sx={{
        width: '100%',
        height: { xs: '150px', md: '250px' }, // responsive height
        objectFit: 'cover',
        display: 'block',
      }}
    />
  );
}
