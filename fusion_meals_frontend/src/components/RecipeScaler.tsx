"use client"

import React, { useState } from 'react'
import { 
  TextField, 
  Button, 
  Grid, 
  CircularProgress,
  Box,
  Card,
  CardContent,
  Alert,
  Stack,
  Typography,
  Slider,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Paper,
  Chip
} from '@mui/material'
import axios from 'axios'

interface ScalingConversionDetails {
  original_serving_size: number | null
  new_serving_size: number | null
  significant_changes: string[]
}

interface ScalingResponse {
  original_recipe: string
  scaled_recipe: string
  original_serving_size: number | null
  new_serving_size: number | null
  conversion_details: ScalingConversionDetails | null
}

interface RecipeScalerProps {
  initialRecipe?: string
  onScaledRecipe?: (scaledRecipe: string) => void
}

export default function RecipeScaler({ initialRecipe = '', onScaledRecipe }: RecipeScalerProps) {
  const [recipeText, setRecipeText] = useState(initialRecipe)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [servingSize, setServingSize] = useState<number | null>(null)
  const [unitSystem, setUnitSystem] = useState<string | null>('')
  const [scaledRecipe, setScaledRecipe] = useState<ScalingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scaleType, setScaleType] = useState('factor') // 'factor' or 'servings'

  const handleUnitSystemChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnitSystem: string | null,
  ) => {
    setUnitSystem(newUnitSystem);
  };

  const handleScaleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newScaleType: string | null,
  ) => {
    if (newScaleType !== null) {
      setScaleType(newScaleType);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipeText.trim()) {
      setError('Please enter a recipe')
      return
    }
    
    setLoading(true)
    setError(null)
    setScaledRecipe(null)
    
    try {
      const response = await axios.post('/api/recipe-scaling/scale', {
        recipe_text: recipeText,
        scale_factor: scaleFactor,
        convert_units: unitSystem === '' ? null : unitSystem,
        serving_size: scaleType === 'servings' ? servingSize : null
      })
      
      setScaledRecipe(response.data)
      
      if (onScaledRecipe) {
        onScaledRecipe(response.data.scaled_recipe)
      }
    } catch (err) {
      console.error('Error scaling recipe:', err)
      setError('Failed to scale recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setRecipeText('')
    setScaleFactor(1)
    setServingSize(null)
    setUnitSystem('')
    setScaleType('factor')
    setScaledRecipe(null)
    setError(null)
  }

  const renderScaleFactorInput = () => (
    <Box sx={{ width: '100%', pl: 2, pr: 2 }}>
      <Typography id="scale-factor-slider" gutterBottom>
        Scale Factor: {scaleFactor}x
      </Typography>
      <Slider
        value={scaleFactor}
        onChange={(_, newValue) => setScaleFactor(newValue as number)}
        step={0.25}
        marks={[
          { value: 0.25, label: '¼x' },
          { value: 0.5, label: '½x' },
          { value: 1, label: '1x' },
          { value: 2, label: '2x' },
          { value: 3, label: '3x' },
          { value: 4, label: '4x' }
        ]}
        min={0.25}
        max={4}
        valueLabelDisplay="auto"
        aria-labelledby="scale-factor-slider"
      />
    </Box>
  )

  const renderServingSizeInput = () => (
    <TextField
      label="Target Serving Size"
      fullWidth
      type="number"
      value={servingSize || ''}
      onChange={(e) => setServingSize(parseInt(e.target.value) || null)}
      placeholder="e.g., 6"
      inputProps={{ min: 1 }}
      variant="outlined"
    />
  )

  return (
    <Box>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Recipe Text"
                  fullWidth
                  multiline
                  rows={8}
                  value={recipeText}
                  onChange={(e) => setRecipeText(e.target.value)}
                  placeholder="Paste your recipe here..."
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <ToggleButtonGroup
                  color="primary"
                  value={scaleType}
                  exclusive
                  onChange={handleScaleTypeChange}
                  aria-label="Scale Type"
                  fullWidth
                >
                  <ToggleButton value="factor">Scale by Factor</ToggleButton>
                  <ToggleButton value="servings">Scale by Servings</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              
              <Grid item xs={12}>
                {scaleType === 'factor' ? renderScaleFactorInput() : renderServingSizeInput()}
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Unit Conversion (Optional)
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={unitSystem}
                  exclusive
                  onChange={handleUnitSystemChange}
                  aria-label="Unit System"
                >
                  <ToggleButton value="">No Conversion</ToggleButton>
                  <ToggleButton value="metric">Convert to Metric</ToggleButton>
                  <ToggleButton value="imperial">Convert to Imperial</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button 
                    variant="outlined" 
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !recipeText.trim()}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Scale Recipe'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {scaledRecipe && (
        <Box>
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scaled Recipe
            </Typography>
            
            {scaledRecipe.conversion_details?.significant_changes && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Key Changes:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {scaledRecipe.conversion_details.significant_changes.map((change, index) => (
                    <Chip 
                      key={index}
                      label={change}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            
            {(scaledRecipe.original_serving_size || scaledRecipe.new_serving_size) && (
              <Box sx={{ mb: 2 }}>
                {scaledRecipe.original_serving_size && (
                  <Typography variant="body2">
                    Original Serving Size: {scaledRecipe.original_serving_size}
                  </Typography>
                )}
                {scaledRecipe.new_serving_size && (
                  <Typography variant="body2">
                    New Serving Size: {scaledRecipe.new_serving_size}
                  </Typography>
                )}
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'inherit',
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '4px'
            }}>
              {scaledRecipe.scaled_recipe}
            </pre>
          </Paper>
        </Box>
      )}
    </Box>
  )
} 