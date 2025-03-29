'use client';

import React from 'react';
import { Container } from '@mui/material';
import CookingEducationHub from '@/components/cooking-education/CookingEducationHub';

export default function CookingEducationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CookingEducationHub />
    </Container>
  );
} 