"use client"

import React, { useState } from 'react'
import { 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Box,
  Card,
  CardContent,
  Alert,
  Stack
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import SubstitutionResults from './SubstitutionResults'

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

export default function IngredientSubstitutionForm() {
  const [ingredient, setIngredient] = useState('')
  const [quantity, setQuantity] = useState('')
  const [dietaryRestriction, setDietaryRestriction] = useState('')
  const [purpose, setPurpose] = useState('cooking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SubstitutionResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ingredient.trim()) {
      setError('Please enter an ingredient')
      return
    }
    
    setLoading(true)
    setError(null)
    setResults(null)
    
    try {
      const response = await fetch('/api/ingredient-substitution/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredient,
          quantity: quantity.trim() || null,
          dietary_restriction: dietaryRestriction || null,
          purpose,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get substitutes')
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      console.error('Error fetching substitutes:', err)
      setError('Failed to get substitutes. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDietaryChange = (event: SelectChangeEvent) => {
    setDietaryRestriction(event.target.value as string)
  }
  
  const handlePurposeChange = (event: SelectChangeEvent) => {
    setPurpose(event.target.value as string)
  }
  
  const handleClear = () => {
    setIngredient('')
    setQuantity('')
    setDietaryRestriction('')
    setPurpose('cooking')
    setResults(null)
    setError(null)
  }

  return (
    <Box>
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 'rgba(0, 0, 0, 0.04) 0px 3px 5px' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ingredient to Substitute"
                  fullWidth
                  value={ingredient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIngredient(e.target.value)}
                  placeholder="e.g., butter, eggs, milk"
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Quantity (optional)"
                  fullWidth
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                  placeholder="e.g., 1 cup, 2 tablespoons"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="dietary-restriction-label">Dietary Restriction (optional)</InputLabel>
                  <Select
                    labelId="dietary-restriction-label"
                    value={dietaryRestriction}
                    onChange={handleDietaryChange}
                    label="Dietary Restriction (optional)"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                    <MenuItem value="dairy-free">Dairy-Free</MenuItem>
                    <MenuItem value="nut-free">Nut-Free</MenuItem>
                    <MenuItem value="keto">Keto</MenuItem>
                    <MenuItem value="paleo">Paleo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="purpose-label">Cooking Purpose</InputLabel>
                  <Select
                    labelId="purpose-label"
                    value={purpose}
                    onChange={handlePurposeChange}
                    label="Cooking Purpose"
                  >
                    <MenuItem value="cooking">General Cooking</MenuItem>
                    <MenuItem value="baking">Baking</MenuItem>
                    <MenuItem value="sauce">Sauce Making</MenuItem>
                    <MenuItem value="thickening">Thickening</MenuItem>
                    <MenuItem value="seasoning">Seasoning/Flavoring</MenuItem>
                  </Select>
                </FormControl>
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
                    disabled={loading || !ingredient.trim()}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Find Substitutes'}
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
      
      {results && <SubstitutionResults results={results} />}
    </Box>
  )
} 