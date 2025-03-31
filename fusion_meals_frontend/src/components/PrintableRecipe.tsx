import React from 'react';
import { Box, Typography, Divider, List, ListItem, Paper, Grid } from '@mui/material';
import { Clock, Users, Flame, Award } from 'lucide-react';

interface PrintableRecipeProps {
  recipe: string;
  imageUrl?: string;
  title?: string;
  showMetadata?: boolean;
}

const PrintableRecipe: React.FC<PrintableRecipeProps> = ({ 
  recipe, 
  imageUrl, 
  title, 
  showMetadata = true 
}) => {
  // Extract recipe sections (similar to FormattedRecipe but optimized for printing)
  const extractSection = (markdown: string, section: string) => {
    const regex = new RegExp(`\\*\\*${section}\\*\\*:([\\s\\S]*?)(?=\\*\\*|$)`);
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  };

  // Parse ingredients
  const parseIngredients = (text: string) => {
    const lines = text.split('\n').map(line => line.trim());
    const ingredients: { category: string; items: string[] }[] = [];
    let currentCategory = '';
    let currentItems: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('- **')) {
        // This is a category
        if (currentCategory && currentItems.length > 0) {
          ingredients.push({ category: currentCategory, items: currentItems });
          currentItems = [];
        }
        currentCategory = line.replace('- **', '').replace('**:', '').trim();
      } else if (line.startsWith('-')) {
        // This is an ingredient
        currentItems.push(line.replace('-', '').trim());
      }
    });

    // Add the last category if exists
    if (currentCategory && currentItems.length > 0) {
      ingredients.push({ category: currentCategory, items: currentItems });
    }

    return ingredients;
  };

  // Parse instructions
  const parseInstructions = (text: string) => {
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Extract instruction number if present (e.g., "1. Preheat oven")
        const match = line.match(/^\d+\.\s+(.+)$/);
        return match ? match[1] : line;
      });
  };

  // Parse macronutrients
  const parseMacronutrients = (text: string) => {
    const macros: Record<string, string> = {};
    
    text.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('-')) {
        const parts = trimmedLine
          .replace(/^\s*-\s*/, '') // Remove bullet point
          .split(':');
        
        if (parts.length === 2) {
          const [key, value] = parts.map(s => s.trim());
          macros[key] = value;
        }
      }
    });

    return macros;
  };

  const recipeName = title || extractSection(recipe, 'Recipe Name');
  const ingredients = extractSection(recipe, 'Ingredients');
  const parsedIngredients = parseIngredients(ingredients);
  const instructions = extractSection(recipe, 'Instructions');
  const parsedInstructions = parseInstructions(instructions);
  const cookingTime = extractSection(recipe, 'Cooking Time');
  const calories = extractSection(recipe, 'Calories per Serving');
  const macrosText = extractSection(recipe, 'Macronutrients');
  const macros = parseMacronutrients(macrosText);
  const healthScore = extractSection(recipe, 'Health Score').trim();

  // Extract serving size from the recipe if available
  const servingSize = recipe.match(/serves\s+(\d+)/i)?.[1] || '4';

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, maxWidth: "100%", overflow: "hidden" }}>
      {/* Header with logo and title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {recipeName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fusion Meals
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Recipe image and metadata */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {imageUrl && (
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={imageUrl}
              alt={recipeName}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 2,
              }}
            />
          </Grid>
        )}
        
        {showMetadata && (
          <Grid item xs={12} md={imageUrl ? 6 : 12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {cookingTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <Clock size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">{cookingTime}</Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                <Users size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2">Serves {servingSize}</Typography>
              </Box>
              
              {calories && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                  <Flame size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">{calories}</Typography>
                </Box>
              )}
              
              {healthScore && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Award size={16} style={{ marginRight: 8 }} />
                  <Typography variant="body2">Health Score: {healthScore}</Typography>
                </Box>
              )}
            </Box>
            
            {Object.keys(macros).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">Nutrition (per serving):</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  {Object.entries(macros).map(([name, value]) => (
                    <Typography key={name} variant="body2">
                      {name}: {value}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        )}
      </Grid>
      
      {/* Ingredients */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          Ingredients
        </Typography>
        {parsedIngredients.length > 0 ? (
          parsedIngredients.map((category, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {category.category && (
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  {category.category}
                </Typography>
              )}
              <List dense disablePadding>
                {category.items.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ py: 0.5 }}>
                    • {item}
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No ingredients listed
          </Typography>
        )}
      </Box>
      
      {/* Instructions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
          Instructions
        </Typography>
        <List>
          {parsedInstructions.map((instruction, index) => (
            <ListItem key={index} sx={{ alignItems: 'flex-start', py: 1 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography 
                  component="span" 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    mr: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Typography>
                <Typography variant="body1">{instruction}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* Footer */}
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Generated by Fusion Meals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PrintableRecipe; 