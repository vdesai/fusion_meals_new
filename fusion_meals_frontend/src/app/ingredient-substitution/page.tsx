"use client"

import React from 'react'
import IngredientSubstitutionForm from '@/components/ingredient-substitution/IngredientSubstitutionForm'
import { Container, Typography, Paper, Box } from '@mui/material'

export default function IngredientSubstitutionPage() {
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
          Find Ingredient Substitutions
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#555', maxWidth: '800px' }}>
          Need to substitute an ingredient in your recipe? Our AI-powered tool can help you find
          suitable alternatives based on dietary restrictions, cooking purpose, and flavor profiles.
          Just tell us what you need to replace and we&apos;ll suggest the best substitutes.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <IngredientSubstitutionForm />
        </Box>
      </Paper>
    </Container>
  )
} 