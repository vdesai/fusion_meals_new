"use client"

import React from 'react'
import RecipeScaler from '@/components/RecipeScaler'
import { Box, Container, Typography, Paper } from '@mui/material'

export default function RecipeScalingPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          background: 'linear-gradient(145deg, #f0f7ff 0%, #ffffff 100%)',
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #2c3e50 0%, #4a6572 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'inline-block'
          }}
        >
          Recipe Scaling & Conversion
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#555', maxWidth: '800px' }}>
          Need to adjust a recipe for more or fewer servings? Our smart recipe scaling tool helps you
          scale ingredient quantities and convert between metric and imperial measurements.
          Just paste your recipe and choose your scaling options.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <RecipeScaler />
        </Box>
      </Paper>
    </Container>
  )
} 