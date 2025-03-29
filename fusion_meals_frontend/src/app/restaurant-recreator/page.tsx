'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import RestaurantRecreator from '@/components/restaurant-recreator/RestaurantRecreator';

export default function RestaurantRecreatorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Restaurant-to-Home Meal Recreator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Recreate your favorite restaurant dishes at home - healthier, cheaper, and customized to your dietary goals.
        </Typography>
      </Box>
      
      <RestaurantRecreator />
    </Container>
  );
} 