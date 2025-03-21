"use client"

import React from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  LinearProgress, 
  Chip,
  Paper,
  Divider,
  Alert
} from '@mui/material'

interface Substitute {
  name: string
  conversion_ratio: number
  nutrition_match: number
  taste_similarity: number
  description: string
  usage_tips: string
}

interface SubstitutionResponse {
  original_ingredient: string
  substitutes: Substitute[]
  dietary_note: string | null
}

interface SubstitutionResultsProps {
  results: SubstitutionResponse
}

export default function SubstitutionResults({ results }: SubstitutionResultsProps) {
  const formatScore = (score: number) => {
    return Math.round(score * 100)
  }
  
  const getScoreColor = (score: number) => {
    if (score >=.8) return '#4caf50'
    if (score >= .6) return '#8bc34a'
    if (score >= .4) return '#ffc107'
    if (score >= .2) return '#ff9800'
    return '#f44336'
  }
  
  const formatRatio = (ratio: number) => {
    return `1:${ratio.toFixed(2)}`
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Substitutes for {results.original_ingredient}
      </Typography>
      
      {results.dietary_note && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {results.dietary_note}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {results.substitutes.map((substitute, index) => (
          <Grid item xs={12} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                        {substitute.name}
                      </Typography>
                      <Chip 
                        label={`Conversion Ratio: ${formatRatio(substitute.conversion_ratio)}`} 
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body1" paragraph>
                      {substitute.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Usage Tips:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {substitute.usage_tips}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Nutrition Match
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={formatScore(substitute.nutrition_match)} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getScoreColor(substitute.nutrition_match)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatScore(substitute.nutrition_match)}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Taste Similarity
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={formatScore(substitute.taste_similarity)} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getScoreColor(substitute.taste_similarity)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {formatScore(substitute.taste_similarity)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
} 