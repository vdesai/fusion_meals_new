"use client"

import React from 'react'
import RecipeSharingTool from '@/components/RecipeSharingTool'
import { Box, Container, Typography, Paper } from '@mui/material'

export default function RecipeSharingPage() {
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
          Share Your Recipe
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#555', maxWidth: '800px' }}>
          Create professional and engaging content to share your recipes on social media platforms 
          or via email. Get platform-optimized text, hashtag suggestions, image prompts, and the 
          best times to post for maximum engagement.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <RecipeSharingTool />
        </Box>
      </Paper>
    </Container>
  )
} 