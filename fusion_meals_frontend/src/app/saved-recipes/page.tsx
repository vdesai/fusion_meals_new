'use client';

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  CircularProgress,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  TextField,
  InputAdornment
} from "@mui/material";
import { BookOpen, Search, Heart, Clock, Calendar, Filter, MoreVertical, Download, Share, Trash2 } from "lucide-react";
import Link from "next/link";

// Mock saved recipes data
const mockSavedRecipes = [
  {
    id: '1',
    title: 'Thai-Mexican Fusion Tacos',
    image: '/images/recipes/thai-mexican-tacos.jpg',
    tags: ['Thai', 'Mexican', 'Fusion', 'Dinner'],
    prepTime: 25,
    dateAdded: '2025-03-20',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Indian-Italian Curry Pasta',
    image: '/images/recipes/curry-pasta.jpg',
    tags: ['Italian', 'Indian', 'Fusion', 'Pasta'],
    prepTime: 30,
    dateAdded: '2025-03-15',
    isFavorite: false
  },
  {
    id: '3',
    title: 'Japanese-French Miso Glazed Salmon',
    image: '/images/recipes/miso-salmon.jpg',
    tags: ['Japanese', 'French', 'Seafood', 'Healthy'],
    prepTime: 35,
    dateAdded: '2025-03-10',
    isFavorite: true
  }
];

export default function SavedRecipesPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [savedRecipes, setSavedRecipes] = useState(mockSavedRecipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  // Set user name when user data is loaded
  useEffect(() => {
    if (isSignedIn && user) {
      setUserName(user.fullName || user.username || user.primaryEmailAddress?.emailAddress || 'Fusion Meals User');
    }
  }, [isSignedIn, user]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, recipeId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecipeId(recipeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRecipeId(null);
  };

  const handleDeleteRecipe = () => {
    if (selectedRecipeId) {
      setSavedRecipes(recipes => recipes.filter(recipe => recipe.id !== selectedRecipeId));
      handleMenuClose();
    }
  };

  const handleToggleFavorite = (recipeId: string) => {
    setSavedRecipes(recipes => 
      recipes.map(recipe => 
        recipe.id === recipeId 
          ? { ...recipe, isFavorite: !recipe.isFavorite } 
          : recipe
      )
    );
  };

  const filteredRecipes = savedRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isLoaded) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading saved recipes...
        </Typography>
      </Container>
    );
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Please sign in to view your saved recipes
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          href="/sign-in"
          sx={{ mt: 2 }}
        >
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {userName}&apos;s Saved Recipes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your recipe collection and quickly access your favorite dishes.
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          placeholder="Search recipes by name or tag..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <Button startIcon={<Filter size={18} />} variant="outlined">
          Filter
        </Button>
      </Paper>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={recipe.image || '/images/placeholder-recipe.jpg'}
                  alt={recipe.title}
                />
                <IconButton
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } 
                  }}
                  onClick={() => handleToggleFavorite(recipe.id)}
                >
                  <Heart 
                    size={18} 
                    fill={recipe.isFavorite ? '#f44336' : 'none'} 
                    color={recipe.isFavorite ? '#f44336' : '#616161'} 
                  />
                </IconButton>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {recipe.title}
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {recipe.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: 14 }}>
                    <Clock size={14} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {recipe.prepTime} min
                    </Typography>
                    <Box sx={{ mx: 1 }}>•</Box>
                    <Calendar size={14} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      Saved {new Date(recipe.dateAdded).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 1.5 }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    component={Link} 
                    href={`/recipes/${recipe.id}`}
                  >
                    View Recipe
                  </Button>
                  <IconButton
                    aria-label="recipe options"
                    onClick={(e) => handleMenuOpen(e, recipe.id)}
                  >
                    <MoreVertical size={18} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
          <BookOpen size={48} color="#9ca3af" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            No saved recipes found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? 
              "No recipes match your search criteria. Try a different search term." : 
              "You haven't saved any recipes yet. Explore our recipe collection to find dishes you love."}
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            href="/generate-recipe"
          >
            Discover Recipes
          </Button>
        </Paper>
      )}

      {/* Recipe Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={Link} href={`/recipes/${selectedRecipeId}`}>
          <BookOpen size={18} style={{ marginRight: 8 }} />
          View Recipe
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Calendar size={18} style={{ marginRight: 8 }} />
          Add to Meal Plan
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share size={18} style={{ marginRight: 8 }} />
          Share Recipe
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download size={18} style={{ marginRight: 8 }} />
          Download PDF
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteRecipe} sx={{ color: 'error.main' }}>
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Remove from Saved
        </MenuItem>
      </Menu>
    </Container>
  );
} 