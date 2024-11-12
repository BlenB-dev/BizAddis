import React from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const LoadingPage = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '100px' }}>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <CircularProgress size={60} />
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Waiting for backend response...
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingPage;
