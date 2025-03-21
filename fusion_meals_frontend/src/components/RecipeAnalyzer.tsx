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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import KitchenIcon from '@mui/icons-material/Kitchen'
import axios from 'axios'

interface RecipeAnalyzerProps {
  initialRecipe?: string
}

interface AnalysisResponse {
  original_recipe: string
  flavor_profile: {
    dominant_flavors: string[]
    balance: string
    missing_elements: string
    flavor_combinations: string
  }
  health_analysis: {
    estimated_nutrition: {
      calories_per_serving: string
      protein: string
      carbs: string
      fats: string
    }
    allergens: string[]
    health_benefits: string[]
    health_concerns: string[]
  }
  improvement_suggestions: {
    suggestion: string
    benefit: string
    implementation: string
  }[]
  technique_tips: string[]
  ingredient_insights: {
    key_ingredients: string[]
    alternative_ingredients: string[]
    special_ingredients: string[]
  }
}

export default function RecipeAnalyzer({ initialRecipe = '' }: RecipeAnalyzerProps) {
  const [recipeText, setRecipeText] = useState(initialRecipe)
  const [analysisFocus, setAnalysisFocus] = useState<string>('all')
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [skillLevel, setSkillLevel] = useState<string>('intermediate')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 
    'keto', 'low-carb', 'low-fat', 'paleo'
  ]

  const handleDietaryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDietaryPreferences(event.target.value as string[])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipeText.trim()) {
      setError('Please enter a recipe')
      return
    }
    
    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    
    try {
      const response = await axios.post('/api/recipe-analysis/analyze', {
        recipe_text: recipeText,
        analysis_focus: analysisFocus,
        dietary_preferences: dietaryPreferences,
        skill_level: skillLevel
      })
      
      setAnalysisResult(response.data)
    } catch (err) {
      console.error('Error analyzing recipe:', err)
      setError('Failed to analyze recipe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setRecipeText('')
    setAnalysisFocus('all')
    setDietaryPreferences([])
    setSkillLevel('intermediate')
    setAnalysisResult(null)
    setError(null)
  }

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
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="analysis-focus-label">Analysis Focus</InputLabel>
                  <Select
                    labelId="analysis-focus-label"
                    value={analysisFocus}
                    label="Analysis Focus"
                    onChange={(e) => setAnalysisFocus(e.target.value)}
                  >
                    <MenuItem value="all">All Aspects</MenuItem>
                    <MenuItem value="flavor">Flavor Profile</MenuItem>
                    <MenuItem value="health">Health & Nutrition</MenuItem>
                    <MenuItem value="technique">Cooking Techniques</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="dietary-preferences-label">Dietary Preferences</InputLabel>
                  <Select
                    labelId="dietary-preferences-label"
                    multiple
                    value={dietaryPreferences}
                    label="Dietary Preferences"
                    onChange={(e) => setDietaryPreferences(e.target.value as string[])}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {dietaryOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="skill-level-label">Skill Level</InputLabel>
                  <Select
                    labelId="skill-level-label"
                    value={skillLevel}
                    label="Skill Level"
                    onChange={(e) => setSkillLevel(e.target.value)}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
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
                    disabled={loading || !recipeText.trim()}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Recipe'}
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
      
      {analysisResult && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Recipe Analysis Results
          </Typography>
          
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="flavor-profile-content"
              id="flavor-profile-header"
              sx={{ background: 'linear-gradient(90deg, #f0f7ff, #ffffff)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocalDiningIcon color="primary" />
                <Typography variant="h6">Flavor Profile</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Dominant Flavors</Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                    {analysisResult.flavor_profile.dominant_flavors.map((flavor, index) => (
                      <Chip key={index} label={flavor} color="primary" variant="outlined" />
                    ))}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Flavor Balance</Typography>
                  <Typography variant="body2">{analysisResult.flavor_profile.balance}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Missing Elements</Typography>
                  <Typography variant="body2">{analysisResult.flavor_profile.missing_elements}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Notable Combinations</Typography>
                  <Typography variant="body2">{analysisResult.flavor_profile.flavor_combinations}</Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="health-analysis-content"
              id="health-analysis-header"
              sx={{ background: 'linear-gradient(90deg, #f0f7ff, #ffffff)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <FitnessCenterIcon color="primary" />
                <Typography variant="h6">Health & Nutrition</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Estimated Nutrition (Per Serving)
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Calories:</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {analysisResult.health_analysis.estimated_nutrition.calories_per_serving}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Protein:</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {analysisResult.health_analysis.estimated_nutrition.protein}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Carbs:</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {analysisResult.health_analysis.estimated_nutrition.carbs}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Fats:</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {analysisResult.health_analysis.estimated_nutrition.fats}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Allergens</Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 2 }}>
                    {analysisResult.health_analysis.allergens.map((allergen, index) => (
                      <Chip key={index} label={allergen} color="error" variant="outlined" size="small" />
                    ))}
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Health Benefits</Typography>
                  <List dense>
                    {analysisResult.health_analysis.health_benefits.map((benefit, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={600}>Health Concerns</Typography>
                  <List dense>
                    {analysisResult.health_analysis.health_concerns.map((concern, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={concern} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="suggestions-content"
              id="suggestions-header"
              sx={{ background: 'linear-gradient(90deg, #f0f7ff, #ffffff)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <TipsAndUpdatesIcon color="primary" />
                <Typography variant="h6">Improvement Suggestions</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {analysisResult.improvement_suggestions.map((suggestion, index) => (
                <Paper 
                  key={index} 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    background: index % 2 === 0 ? '#f9f9f9' : '#f5f5f5',
                    borderLeft: '4px solid #3f51b5',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>{suggestion.suggestion}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Benefit:</strong> {suggestion.benefit}
                  </Typography>
                  <Typography variant="body2">
                    <strong>How to implement:</strong> {suggestion.implementation}
                  </Typography>
                </Paper>
              ))}
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="technique-tips-content"
              id="technique-tips-header"
              sx={{ background: 'linear-gradient(90deg, #f0f7ff, #ffffff)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <KitchenIcon color="primary" />
                <Typography variant="h6">Technique Tips</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {analysisResult.technique_tips.map((tip, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                    <ListItemIcon>
                      <TipsAndUpdatesIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="ingredient-insights-content"
              id="ingredient-insights-header"
              sx={{ background: 'linear-gradient(90deg, #f0f7ff, #ffffff)' }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocalDiningIcon color="primary" />
                <Typography variant="h6">Ingredient Insights</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Key Ingredients</Typography>
                  <List dense>
                    {analysisResult.ingredient_insights.key_ingredients.map((ingredient, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Alternative Ingredients</Typography>
                  <List dense>
                    {analysisResult.ingredient_insights.alternative_ingredients.map((ingredient, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Special Ingredients</Typography>
                  <List dense>
                    {analysisResult.ingredient_insights.special_ingredients.map((ingredient, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  )
} 