'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  useTheme, 
  useMediaQuery, 
  Chip,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Restaurant,
  LocalFlorist,
  LocalDining,
  Info,
  SoupKitchen,
  BrunchDining
} from '@mui/icons-material';
import Link from 'next/link';
import { SeasonalIngredient, SeasonType, seasons, getIngredientsBySeason, getCurrentSeason, getMonthName } from '@/data/seasonal-ingredients';

interface SeasonalCarouselProps {
  defaultSeason?: string;
  defaultHemisphere?: 'northern' | 'southern';
}

const SeasonalCarousel: React.FC<SeasonalCarouselProps> = ({ 
  defaultSeason = getCurrentSeason(), 
  defaultHemisphere = 'northern' 
}) => {
  const [activeSeason, setActiveSeason] = useState<string>(defaultSeason);
  const [selectedIngredient, setSelectedIngredient] = useState<SeasonalIngredient | null>(null);
  const [hemisphere, setHemisphere] = useState<'northern' | 'southern'>(defaultHemisphere);
  
  const seasonalIngredients = getIngredientsBySeason(activeSeason as SeasonType);
  const currentSeason = seasons.find(s => s.name === activeSeason);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Handle image not found errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-food.jpg';
  };
  
  // Get season-specific background color
  const getSeasonColor = (season: string) => {
    switch(season) {
      case 'spring': return 'rgba(124, 179, 66, 0.8)'; // Light green
      case 'summer': return 'rgba(255, 179, 0, 0.8)'; // Amber
      case 'fall': return 'rgba(230, 81, 0, 0.8)'; // Deep orange
      case 'winter': return 'rgba(3, 169, 244, 0.8)'; // Light blue
      default: return theme.palette.primary.main;
    }
  };
  
  // Get icon for ingredient type
  const getIngredientIcon = (type: string) => {
    switch(type) {
      case 'vegetable': return <LocalFlorist />;
      case 'fruit': return <BrunchDining />;
      case 'herb': return <LocalDining />;
      case 'seafood': return <SoupKitchen />;
      default: return <Restaurant />;
    }
  };
  
  // Get months as a readable string
  const getMonthsString = (months: number[]) => {
    return months.map(m => getMonthName(m)).join(', ');
  };
  
  // Toggle between hemispheres
  const toggleHemisphere = () => {
    setHemisphere(hemisphere === 'northern' ? 'southern' : 'northern');
    
    // Find the equivalent season in the other hemisphere
    const currentSeasonObj = seasons.find(s => s.name === activeSeason);
    if (currentSeasonObj) {
      const currentMonth = new Date().getMonth() + 1;
      
      // Find which season contains this month in the new hemisphere
      const oppositeHemisphere = hemisphere === 'northern' ? 'southern' : 'northern';
      for (const season of seasons) {
        if (season.months[oppositeHemisphere].includes(currentMonth)) {
          setActiveSeason(season.name);
          break;
        }
      }
    }
  };
  
  return (
    <Box sx={{ width: '100%', position: 'relative', overflow: 'hidden', my: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: getSeasonColor(activeSeason)
        }}>
          Seasonal Ingredients
        </Typography>
        <Button 
          variant="outlined"
          onClick={toggleHemisphere}
          sx={{ borderRadius: 20 }}
        >
          {hemisphere === 'northern' ? 'Northern Hemisphere' : 'Southern Hemisphere'}
        </Button>
      </Box>
      
      {/* Season selection tabs */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 1,
        mb: 4
      }}>
        {seasons.map((season) => (
          <Button 
            key={season.name}
            variant={season.name === activeSeason ? "contained" : "outlined"}
            onClick={() => {
              setActiveSeason(season.name);
              setSelectedIngredient(null);
            }}
            sx={{ 
              borderRadius: '20px',
              px: 2,
              mx: 0.5,
              mb: 1,
              bgcolor: season.name === activeSeason ? getSeasonColor(season.name) : 'transparent',
              '&:hover': {
                bgcolor: season.name === activeSeason 
                  ? getSeasonColor(season.name) 
                  : `${getSeasonColor(season.name)}22`
              }
            }}
          >
            {season.displayName}
          </Button>
        ))}
      </Box>
      
      {/* Season description */}
      {currentSeason && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: `${getSeasonColor(activeSeason)}22`,
            borderRadius: 2
          }}
        >
          <Typography variant="h5" gutterBottom>
            {currentSeason.displayName} ({hemisphere === 'northern' 
              ? getMonthsString(currentSeason.months.northern)
              : getMonthsString(currentSeason.months.southern)})
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {currentSeason.description}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Characteristics:
          </Typography>
          <Grid container spacing={2}>
            {currentSeason.characteristics.map((char, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Chip
                  icon={<Info />}
                  label={char}
                  sx={{ 
                    bgcolor: 'white', 
                    '& .MuiChip-icon': { color: getSeasonColor(activeSeason) } 
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      
      {/* Selected ingredient detail or ingredient grid */}
      {selectedIngredient ? (
        <Box sx={{ mb: 4 }}>
          <Button 
            variant="text" 
            onClick={() => setSelectedIngredient(null)}
            sx={{ mb: 2 }}
          >
            ← Back to all ingredients
          </Button>
          
          <Card sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            overflow: 'hidden'
          }}>
            <CardMedia
              component="img"
              sx={{ 
                width: isMobile ? '100%' : 300,
                height: isMobile ? 200 : 300,
                objectFit: 'cover'
              }}
              image={selectedIngredient.imageUrl}
              alt={selectedIngredient.name}
              onError={handleImageError}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip 
                    icon={getIngredientIcon(selectedIngredient.type)}
                    label={selectedIngredient.type.charAt(0).toUpperCase() + selectedIngredient.type.slice(1)} 
                    size="small"
                    sx={{ mr: 1, bgcolor: `${getSeasonColor(activeSeason)}22` }}
                  />
                  <Typography variant="caption">
                    Peak season: {getMonthsString(selectedIngredient.peakMonths)}
                  </Typography>
                </Box>
                
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedIngredient.name}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {selectedIngredient.description}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Nutrition
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {selectedIngredient.nutrition}
                    </Typography>
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Common in These Cuisines
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedIngredient.cuisineAffinity.map((cuisine) => (
                        <Chip 
                          key={cuisine}
                          label={cuisine} 
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Culinary Uses
                    </Typography>
                    <List dense>
                      {selectedIngredient.culinaryUses.map((use, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Restaurant fontSize="small" sx={{ color: getSeasonColor(activeSeason) }} />
                          </ListItemIcon>
                          <ListItemText primary={use} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    href={`/generate-recipe?ingredients=${encodeURIComponent(selectedIngredient.name)}`}
                    sx={{ 
                      mr: 2,
                      bgcolor: getSeasonColor(activeSeason),
                      '&:hover': {
                        bgcolor: getSeasonColor(activeSeason),
                        opacity: 0.9
                      }
                    }}
                  >
                    Create Recipe with {selectedIngredient.name}
                  </Button>
                  <Button 
                    variant="outlined"
                    component={Link}
                    href={`/fusion-builder`}
                  >
                    Use in Fusion Recipe
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {seasonalIngredients.map((ingredient) => (
            <Grid item key={ingredient.name} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  },
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedIngredient(ingredient)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={ingredient.imageUrl}
                  alt={ingredient.name}
                  onError={handleImageError}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h3" noWrap>
                      {ingredient.name}
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: `${getSeasonColor(activeSeason)}22`
                    }}>
                      {getIngredientIcon(ingredient.type)}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {ingredient.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained"
          component={Link}
          href={`/seasonal-explorer`}
          sx={{ 
            borderRadius: 20,
            px: 4,
            bgcolor: getSeasonColor(activeSeason),
            '&:hover': {
              bgcolor: getSeasonColor(activeSeason),
              opacity: 0.9
            }
          }}
        >
          Explore All Seasonal Recipes
        </Button>
      </Box>
    </Box>
  );
};

export default SeasonalCarousel; 