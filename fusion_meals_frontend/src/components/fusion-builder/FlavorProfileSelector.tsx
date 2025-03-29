'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Grid, 
  Paper,
  Stack
} from '@mui/material';

interface FlavorProfileSelectorProps {
  flavorProfile: {
    sweet: number;
    salty: number;
    sour: number;
    spicy: number;
    umami: number;
    bitter: number;
  };
  setFlavorProfile: React.Dispatch<React.SetStateAction<{
    sweet: number;
    salty: number;
    sour: number;
    spicy: number;
    umami: number;
    bitter: number;
  }>>;
}

interface FlavorInfo {
  name: string;
  description: string;
  examples: string[];
  color: string;
}

const flavorInfoMap: Record<string, FlavorInfo> = {
  sweet: {
    name: 'Sweet',
    description: 'Sweetness balances other flavors and adds depth',
    examples: ['Sugar', 'Honey', 'Fruits', 'Coconut milk'],
    color: '#ff9eb4'
  },
  salty: {
    name: 'Salty',
    description: 'Enhances flavors and balances sweetness',
    examples: ['Sea salt', 'Soy sauce', 'Olives', 'Cheese'],
    color: '#b0e0e6'
  },
  sour: {
    name: 'Sour',
    description: 'Adds brightness and cuts through richness',
    examples: ['Citrus', 'Vinegar', 'Yogurt', 'Tamarind'],
    color: '#ffffa0'
  },
  spicy: {
    name: 'Spicy',
    description: 'Adds heat and excitement to dishes',
    examples: ['Chili peppers', 'Black pepper', 'Ginger', 'Horseradish'],
    color: '#ff6b6b'
  },
  umami: {
    name: 'Umami',
    description: 'Savory, meaty taste that adds depth',
    examples: ['Mushrooms', 'Tomatoes', 'Soy sauce', 'Parmesan'],
    color: '#9d7e67'
  },
  bitter: {
    name: 'Bitter',
    description: 'Can add complexity and balance sweetness',
    examples: ['Dark chocolate', 'Coffee', 'Bitter greens', 'Citrus zest'],
    color: '#a5c3b4'
  }
};

const FlavorProfileSelector: React.FC<FlavorProfileSelectorProps> = ({ 
  flavorProfile, 
  setFlavorProfile 
}) => {
  const handleFlavorChange = (flavor: keyof typeof flavorProfile) => (
    event: Event, 
    newValue: number | number[]
  ) => {
    setFlavorProfile({
      ...flavorProfile,
      [flavor]: newValue as number
    });
  };

  // Returns intensity level text based on slider value
  const getIntensityText = (value: number) => {
    if (value < 30) return 'Subtle';
    if (value < 60) return 'Moderate';
    if (value < 85) return 'Prominent';
    return 'Intense';
  };

  // Creates a pentagon-shaped visualization of the flavor profile
  const createFlavorProfile = () => {
    const flavors = Object.entries(flavorProfile);
    const centerX = 125; // center of pentagon
    const centerY = 125;
    const maxRadius = 100; // max radius from center
    
    // Convert percentage to radius distance
    const getRadius = (percentage: number) => (percentage / 100) * maxRadius;
    
    // Calculate points on a pentagon
    const points = flavors.map(([flavor, value], index) => {
      // Angle in radians (360 degrees / 6 flavors)
      const angle = (index * 2 * Math.PI / 6) - Math.PI / 2; // start from top
      const radius = getRadius(value);
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return `${x},${y}`;
    });
    
    // Add the first point again to close the polygon
    points.push(points[0]);
    
    return points.join(' ');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Define Your Flavor Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Adjust the sliders to set the balance of flavors for your fusion recipe.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            {Object.entries(flavorProfile).map(([flavor, value]) => {
              const flavorKey = flavor as keyof typeof flavorProfile;
              const info = flavorInfoMap[flavorKey];
              
              return (
                <Box key={flavor} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      id={`${flavor}-slider`} 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: info.color,
                        textShadow: '0 0 1px rgba(0,0,0,0.3)'
                      }}
                    >
                      {info.name}
                    </Typography>
                    <Typography variant="body2">
                      {getIntensityText(value)}
                    </Typography>
                  </Box>
                  <Slider
                    aria-labelledby={`${flavor}-slider`}
                    value={value}
                    onChange={handleFlavorChange(flavorKey)}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                    sx={{
                      color: info.color,
                      '& .MuiSlider-thumb': {
                        height: 24,
                        width: 24,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${info.color} 30%, white 90%)`,
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, ml: 1, color: 'text.secondary' }}>
                    {info.description}
                  </Typography>
                </Box>
              );
            })}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Flavor Balance Visualization
            </Typography>
            
            <Box 
              sx={{ 
                width: '100%', 
                height: 250, 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative',
                mb: 2
              }}
            >
              <svg width="250" height="250" viewBox="0 0 250 250">
                {/* Background pentagon grid */}
                <polygon 
                  points="125,25 225,90 195,205 55,205 25,90" 
                  fill="none" 
                  stroke="#eaeaea" 
                  strokeWidth="1"
                />
                <polygon 
                  points="125,50 195,100 175,180 75,180 55,100" 
                  fill="none" 
                  stroke="#eaeaea" 
                  strokeWidth="1"
                />
                <polygon 
                  points="125,75 165,110 150,155 100,155 85,110" 
                  fill="none" 
                  stroke="#eaeaea" 
                  strokeWidth="1"
                />
                <circle cx="125" cy="125" r="3" fill="#666" />
                
                {/* Flavor polygon */}
                <polygon 
                  points={createFlavorProfile()} 
                  fill="rgba(25, 118, 210, 0.3)" 
                  stroke="#1976d2" 
                  strokeWidth="2" 
                />
                
                {/* Flavor labels */}
                <text x="125" y="15" textAnchor="middle" fontSize="12" fill="#666">Sweet</text>
                <text x="235" y="90" textAnchor="start" fontSize="12" fill="#666">Salty</text>
                <text x="205" y="220" textAnchor="middle" fontSize="12" fill="#666">Sour</text>
                <text x="45" y="220" textAnchor="middle" fontSize="12" fill="#666">Spicy</text>
                <text x="15" y="90" textAnchor="end" fontSize="12" fill="#666">Umami</text>
                <text x="125" y="125" textAnchor="middle" fontSize="12" fill="#666">Bitter</text>
              </svg>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Flavor Combinations Tips:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • Balance <strong>sweet</strong> with <strong>sour</strong> or <strong>bitter</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>Umami</strong> enhances <strong>salty</strong> flavors
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>Spicy</strong> pairs well with <strong>sweet</strong> or <strong>sour</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                • <strong>Bitter</strong> can add complexity to <strong>sweet</strong> dishes
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlavorProfileSelector; 