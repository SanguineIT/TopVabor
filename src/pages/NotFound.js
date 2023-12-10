import React from 'react';
import { Box, Typography } from '@mui/material';
//import { purple } from '@mui/material/colors';



export default function Error() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1" style={{ color: 'black' }}>
      404 - Page Not Found
      </Typography>
    </Box>
  );
}