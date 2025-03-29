'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip,
  Divider,
  useTheme,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import { CalendarMonth, RestaurantMenu, LocalFlorist } from '@mui/icons-material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SeasonalCarousel from '@/components/seasonal-explorer/SeasonalCarousel';
import { 
  SeasonType, 
  seasons, 
  getIngredientsBySeason, 
  getCurrentSeason,
  getCurrentMonthIngredients,
  getMonthName
} from '@/data/seasonal-ingredients';

// Create a client component that uses useSearchParams
function SeasonalExplorerContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const initialSeason = (searchParams.get('season') as SeasonType) || getCurrentSeason();
  const initialHemisphere = searchParams.get('hemisphere') === 'southern' ? 'southern' : 'northern';
  
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>(initialSeason);
  const [hemisphere, setHemisphere] = useState<'northern' | 'southern'>(initialHemisphere);
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const getSeasonColor = useCallback((season: string) => {
    switch(season) {
      case 'spring': return 'rgba(124, 179, 66, 0.8)'; // Light green
      case 'summer': return 'rgba(255, 179, 0, 0.8)'; // Amber
      case 'fall': return 'rgba(230, 81, 0, 0.8)'; // Deep orange
      case 'winter': return 'rgba(3, 169, 244, 0.8)'; // Light blue
      default: return theme.palette.primary.main;
    }
  }, [theme.palette.primary.main]);
  
  const currentSeason = seasons.find(s => s.name === selectedSeason);
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthName = getMonthName(currentMonth);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Seasonal Recipe Explorer
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Discover ingredients at their peak freshness and create delicious dishes that celebrate the seasons.
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 3, 
        mb: 6, 
        bgcolor: `${getSeasonColor(selectedSeason)}22`,
        borderRadius: 2,
        position: 'relative'
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          p: 2
        }}>
          <Button
            variant="outlined"
            onClick={() => setHemisphere(hemisphere === 'northern' ? 'southern' : 'northern')}
            startIcon={<CalendarMonth />}
            size="small"
            sx={{ borderRadius: 20 }}
          >
            {hemisphere === 'northern' ? 'Northern Hemisphere' : 'Southern Hemisphere'}
          </Button>
        </Box>
        
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ color: getSeasonColor(selectedSeason) }}>
              {currentMonth ? (
                <>It&apos;s {currentMonthName} in the {hemisphere} hemisphere!</>
              ) : 'Discover what&apos;s in season right now'}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentSeason?.description || 'Eating seasonally means enjoying foods at their peak flavor, nutrition, and abundance.'}
            </Typography>
            <Typography variant="body1">
              Benefits of seasonal eating:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1">More flavorful, fresh ingredients</Typography>
              <Typography component="li" variant="body1">Higher nutritional value</Typography>
              <Typography component="li" variant="body1">More environmentally sustainable</Typography>
              <Typography component="li" variant="body1">Often more affordable</Typography>
              <Typography component="li" variant="body1">Supports local farming</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img" 
              src={currentSeason?.backgroundImage || "/images/seasons/default-season.jpg"} 
              alt={`${selectedSeason} season`}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
                height: 300,
                objectFit: 'cover'
              }}
            />
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ width: '100%', mb: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab 
              label="Current Season Ingredients" 
              icon={<LocalFlorist />} 
              iconPosition="start" 
            />
            <Tab 
              label="This Month's Highlights" 
              icon={<CalendarMonth />} 
              iconPosition="start" 
            />
            <Tab 
              label="Seasonal Recipes" 
              icon={<RestaurantMenu />} 
              iconPosition="start" 
            />
          </Tabs>
        </Box>
        
        {/* Season ingredients tab */}
        {tabValue === 0 && (
          <SeasonalCarousel 
            defaultSeason={selectedSeason} 
            defaultHemisphere={hemisphere} 
          />
        )}
        
        {/* This month's highlights */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              What&apos;s Fresh in {currentMonthName}
            </Typography>
            <Typography variant="body1" paragraph>
              These ingredients are at their peak this month. Perfect time to incorporate them into your meals!
            </Typography>
            
            <Grid container spacing={3}>
              {getCurrentMonthIngredients().map((ingredient) => (
                <Grid item xs={12} sm={6} md={4} key={ingredient.name}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 140,
                        bgcolor: 'grey.100',
                        backgroundImage: `url(${ingredient.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <Chip
                        label={ingredient.type}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.9)'
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {ingredient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {ingredient.description}
                      </Typography>
                      <Button 
                        size="small" 
                        component={Link}
                        href={`/generate-recipe?ingredients=${encodeURIComponent(ingredient.name)}`}
                        sx={{
                          textTransform: 'none',
                          color: getSeasonColor(selectedSeason)
                        }}
                      >
                        Generate Recipe →
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Seasonal recipes tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Recipe Ideas
            </Typography>
            <Typography variant="body1" paragraph>
              Try these delicious recipe ideas that make the most of {selectedSeason} ingredients.
            </Typography>
            
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6" paragraph>
                Create Your Own Seasonal Recipe
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  component={Link}
                  href="/generate-recipe"
                  sx={{ 
                    borderRadius: 20,
                    px: 3,
                    bgcolor: getSeasonColor(selectedSeason),
                    '&:hover': {
                      bgcolor: getSeasonColor(selectedSeason),
                      opacity: 0.9
                    }
                  }}
                >
                  Generate Custom Recipe
                </Button>
                <Button 
                  variant="outlined" 
                  component={Link}
                  href="/fusion-builder"
                  sx={{ borderRadius: 20, px: 3 }}
                >
                  Create Fusion Recipe
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" gutterBottom>
              Recipe Collections by Season
            </Typography>
            <Grid container spacing={3}>
              {seasons.map((season) => (
                <Grid item xs={12} sm={6} md={3} key={season.name}>
                  <Card sx={{ 
                    bgcolor: `${getSeasonColor(season.name)}22`,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => setSelectedSeason(season.name as SeasonType)}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {season.displayName} Recipes
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {season.description.split('.')[0]}.
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Key ingredients:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {getIngredientsBySeason(season.name as SeasonType)
                          .slice(0, 5)
                          .map(ingredient => (
                            <Chip 
                              key={ingredient.name}
                              label={ingredient.name}
                              size="small"
                              sx={{ mb: 0.5 }}
                            />
                          ))
                        }
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      
      <Box sx={{ 
        mt: 8, 
        p: 4, 
        bgcolor: theme.palette.grey[50], 
        borderRadius: 2,
        textAlign: 'center'
      }}>
        <Typography variant="h5" gutterBottom>
          Ready to cook with the seasons?
        </Typography>
        <Typography variant="body1" paragraph>
          Fusion Meals helps you create delicious dishes using what&apos;s currently in season.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained"
            component={Link}
            href={`/generate-recipe?season=${selectedSeason}`}
            sx={{ 
              borderRadius: 20,
              px: 3,
              bgcolor: getSeasonColor(selectedSeason),
              '&:hover': {
                bgcolor: getSeasonColor(selectedSeason),
                opacity: 0.9
              }
            }}
          >
            Generate a {selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)} Recipe
          </Button>
          <Button 
            variant="outlined"
            component={Link}
            href="/"
            sx={{ borderRadius: 20, px: 3 }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h6">Loading Seasonal Explorer...</Typography>
      </Box>
    </Container>
  );
}

// Main page component with Suspense boundary
export default function SeasonalExplorer() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SeasonalExplorerContent />
    </Suspense>
  );
} 