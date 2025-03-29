'use client';

import React, { useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  CardActionArea,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TechniqueSelectorProps {
  selectedTechniques: string[];
  setSelectedTechniques: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCuisines: string[];
}

// Cooking techniques database
const allTechniques = {
  italian: [
    { id: 'al-dente', name: 'Al Dente Cooking', description: 'Cooking pasta or rice until firm to the bite' },
    { id: 'risotto-method', name: 'Risotto Method', description: 'Slowly adding liquid to create creamy rice dishes' },
    { id: 'pasta-rolling', name: 'Pasta Rolling', description: 'Creating thin sheets of fresh pasta' },
    { id: 'braising', name: 'Braising', description: 'Slow cooking in liquid for tenderization' }
  ],
  japanese: [
    { id: 'sushi-rolling', name: 'Sushi Rolling', description: 'Creating compact rolls of rice and fillings' },
    { id: 'tempura', name: 'Tempura Frying', description: 'Light batter frying for crisp texture' },
    { id: 'teriyaki', name: 'Teriyaki Glazing', description: 'Sweet-savory glazing method' },
    { id: 'donburi', name: 'Donburi Method', description: 'One-bowl cooking with protein over rice' }
  ],
  mexican: [
    { id: 'nixtamalization', name: 'Nixtamalization', description: 'Treating corn with alkaline solution' },
    { id: 'salsa-making', name: 'Fresh Salsa Making', description: 'Balancing fresh vegetables with heat and acid' },
    { id: 'tortilla-press', name: 'Tortilla Pressing', description: 'Creating thin corn or flour discs' },
    { id: 'mole-sauce', name: 'Mole Preparation', description: 'Complex sauce with chiles, nuts, and chocolate' }
  ],
  indian: [
    { id: 'tempering', name: 'Tempering Spices', description: 'Blooming spices in hot oil to release flavors' },
    { id: 'tandoori', name: 'Tandoor Cooking', description: 'High-heat clay oven cooking' },
    { id: 'curry-base', name: 'Curry Base', description: 'Creating aromatic onion-tomato-spice bases' },
    { id: 'dough-lamination', name: 'Dough Lamination', description: 'Creating flaky layers in breads' }
  ],
  thai: [
    { id: 'curry-paste', name: 'Curry Paste Preparation', description: 'Grinding herbs and spices for curry base' },
    { id: 'stir-fry', name: 'Wok Stir-Frying', description: 'High-heat quick cooking in a wok' },
    { id: 'coconut-milk', name: 'Coconut Milk Reduction', description: 'Reducing coconut milk for rich sauces' },
    { id: 'herb-infusion', name: 'Herb Infusion', description: 'Adding fresh herbs at the end for aromatics' }
  ],
  french: [
    { id: 'sous-vide', name: 'Sous Vide', description: 'Precision temperature water bath cooking' },
    { id: 'confit', name: 'Confit Method', description: 'Slow cooking in fat at low temperatures' },
    { id: 'sauce-reduction', name: 'Sauce Reduction', description: 'Slow simmering to concentrate flavors' },
    { id: 'flambeing', name: 'Flambéing', description: 'Adding and igniting alcohol for flavor' }
  ],
  chinese: [
    { id: 'wok-hei', name: 'Wok Hei', description: 'Creating "breath of the wok" high-heat flavor' },
    { id: 'steaming', name: 'Bamboo Steaming', description: 'Gentle cooking with steam' },
    { id: 'red-cooking', name: 'Red Cooking', description: 'Braising in soy sauce, sugar, and spices' },
    { id: 'velveting', name: 'Velveting', description: 'Tenderizing protein with cornstarch and oil' }
  ],
  'middle-eastern': [
    { id: 'mezze-plating', name: 'Mezze Plating', description: 'Arranging small dishes for communal eating' },
    { id: 'tagine', name: 'Tagine Cooking', description: 'Slow cooking in conical earthenware pot' },
    { id: 'pita-baking', name: 'Flatbread Baking', description: 'Creating pocket breads in high heat' },
    { id: 'stuffing', name: 'Stuffing Vegetables', description: 'Filling vegetables with rice and spiced mixtures' }
  ]
};

// Universal techniques that can be used with any cuisine
const universalTechniques = [
  { id: 'grilling', name: 'Grilling', description: 'Cooking over direct heat for char and smokiness' },
  { id: 'fermentation', name: 'Fermentation', description: 'Using bacteria or yeast to transform ingredients' },
  { id: 'smoking', name: 'Smoking', description: 'Infusing ingredients with wood smoke flavor' },
  { id: 'emulsification', name: 'Emulsification', description: 'Combining normally separate ingredients like oil and water' },
  { id: 'pickling', name: 'Pickling', description: 'Preserving in brine or acid for tanginess' },
  { id: 'curing', name: 'Curing', description: 'Preserving with salt, sugar, and spices' }
];

const TechniqueSelector: React.FC<TechniqueSelectorProps> = ({ 
  selectedTechniques, 
  setSelectedTechniques,
  selectedCuisines
}) => {
  const theme = useTheme();

  // Filter techniques based on selected cuisines
  const availableTechniques = useMemo(() => {
    let techniques = [...universalTechniques];
    
    selectedCuisines.forEach(cuisine => {
      if (allTechniques[cuisine as keyof typeof allTechniques]) {
        techniques = [
          ...techniques, 
          ...allTechniques[cuisine as keyof typeof allTechniques]
        ];
      }
    });
    
    // Remove duplicates by id
    return techniques.filter((technique, index, self) => 
      index === self.findIndex(t => t.id === technique.id)
    );
  }, [selectedCuisines]);

  const handleTechniqueClick = (techniqueId: string) => {
    if (selectedTechniques.includes(techniqueId)) {
      setSelectedTechniques(selectedTechniques.filter(id => id !== techniqueId));
    } else if (selectedTechniques.length < 4) {
      // Limit to 4 selections
      setSelectedTechniques([...selectedTechniques, techniqueId]);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Cooking Techniques
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Choose 1-4 cooking techniques that you'd like to incorporate in your fusion recipe.
        {selectedCuisines.length > 0 && (
          <Box component="span" sx={{ fontStyle: 'italic' }}>
            {' '}We've highlighted techniques from your selected cuisines, plus some universal options.
          </Box>
        )}
      </Typography>
      
      <Grid container spacing={2}>
        {availableTechniques.map((technique) => {
          const isSelected = selectedTechniques.includes(technique.id);
          const isCuisineTechnique = !universalTechniques.some(t => t.id === technique.id);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={technique.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 5px rgba(0,0,0,0.08)',
                  border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                  bgcolor: isCuisineTechnique ? 'rgba(25, 118, 210, 0.04)' : 'background.paper'
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%' }} 
                  onClick={() => handleTechniqueClick(technique.id)}
                >
                  {isSelected && (
                    <CheckCircleIcon 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        color: theme.palette.primary.main,
                        fontSize: 24,
                        zIndex: 1
                      }} 
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {technique.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {technique.description}
                    </Typography>
                    {isCuisineTechnique && (
                      <Chip 
                        size="small"
                        label={`Traditional technique`}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
        <Typography variant="subtitle1">
          Selected techniques: {selectedTechniques.length === 0 ? 'None' : selectedTechniques.map(id => {
            const technique = availableTechniques.find(t => t.id === id);
            return technique?.name;
          }).join(', ')}
        </Typography>
      </Box>
    </Box>
  );
};

export default TechniqueSelector; 