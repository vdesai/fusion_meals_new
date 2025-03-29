'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Tabs, 
  Tab, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  LocalFireDepartment, 
  Restaurant, 
  Kitchen, 
  Help, 
  ExpandMore, 
  PlayCircleOutline,
  Search,
  Bookmark
} from '@mui/icons-material';
import Link from 'next/link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Sample data for cooking techniques
const cookingTechniques = [
  {
    id: 'sauteing',
    name: 'Sautéing',
    description: 'A method of cooking food that uses a small amount of oil in a shallow pan over relatively high heat.',
    difficulty: 'Beginner',
    image: '/images/education/techniques/saute.jpg',
    videoUrl: 'https://example.com/videos/sauteing',
    keyPoints: [
      'Use a wide pan with sloped sides',
      'Heat pan before adding oil',
      'Don\'t overcrowd the pan',
      'Keep food moving with a spatula or by tossing'
    ]
  },
  {
    id: 'braising',
    name: 'Braising',
    description: 'A combination cooking method that uses both moist and dry heat. Typically, the food is first seared at a high temperature, then finished in a covered pot with liquid.',
    difficulty: 'Intermediate',
    image: '/images/education/techniques/braise.jpg',
    videoUrl: 'https://example.com/videos/braising',
    keyPoints: [
      'Sear meat before adding liquid',
      'Use enough liquid to cover food halfway',
      'Simmer gently, don\'t boil',
      'Cook until fork-tender'
    ]
  },
  {
    id: 'roasting',
    name: 'Roasting',
    description: 'A dry heat cooking method where hot air surrounds the food to cook it evenly on all sides.',
    difficulty: 'Beginner',
    image: '/images/education/techniques/roast.jpg',
    videoUrl: 'https://example.com/videos/roasting',
    keyPoints: [
      'Preheat oven completely before adding food',
      'Use a rack to allow air circulation',
      'Baste occasionally for moisture',
      'Let meat rest after roasting'
    ]
  },
  {
    id: 'sous-vide',
    name: 'Sous Vide',
    description: 'A cooking technique where food is sealed in airtight plastic bags then placed in a water bath at precisely regulated temperatures.',
    difficulty: 'Advanced',
    image: '/images/education/techniques/sous-vide.jpg',
    videoUrl: 'https://example.com/videos/sous-vide',
    keyPoints: [
      'Vacuum seal food for best results',
      'Maintain precise temperature control',
      'Plan for longer cooking times',
      'Often finished with a quick sear for texture'
    ]
  }
];

// Sample data for ingredient knowledge
const ingredientKnowledge = [
  {
    id: 'herbs',
    name: 'Fresh Herbs',
    description: 'How to select, store, and use fresh herbs to elevate your cooking.',
    image: '/images/education/ingredients/herbs.jpg',
    tips: [
      'Store leafy herbs like cut flowers in a glass of water',
      'Dry herbs are more potent than fresh (use 1/3 the amount)',
      'Add hardy herbs (rosemary, thyme) early in cooking',
      'Add delicate herbs (basil, cilantro) at the end of cooking'
    ],
    commonTypes: ['Basil', 'Thyme', 'Rosemary', 'Cilantro', 'Mint', 'Sage']
  },
  {
    id: 'oils',
    name: 'Cooking Oils',
    description: 'Understanding different types of oils and their appropriate cooking uses.',
    image: '/images/education/ingredients/oils.jpg',
    tips: [
      'High smoke point oils (avocado, grapeseed) for high-heat cooking',
      'Medium smoke point oils (olive) for medium-heat cooking',
      'Flavorful oils (sesame, walnut) for finishing dishes',
      'Store oils away from heat and light'
    ],
    commonTypes: ['Olive', 'Canola', 'Avocado', 'Sesame', 'Coconut', 'Grapeseed']
  },
  {
    id: 'spices',
    name: 'Spices',
    description: 'How to build a spice collection and use spices effectively.',
    image: '/images/education/ingredients/spices.jpg',
    tips: [
      'Buy whole spices when possible and grind as needed',
      'Toast spices before using to enhance flavor',
      'Store in airtight containers away from heat and light',
      'Replace ground spices every 6-12 months'
    ],
    commonTypes: ['Cumin', 'Coriander', 'Turmeric', 'Paprika', 'Cinnamon', 'Cardamom']
  }
];

// Sample data for equipment guides
const equipmentGuides = [
  {
    id: 'knives',
    name: 'Kitchen Knives',
    description: 'Essential types of knives and proper techniques for chopping, slicing, and dicing.',
    image: '/images/education/equipment/knives.jpg',
    mustHave: ['Chef\'s knife', 'Paring knife', 'Serrated knife'],
    niceToHave: ['Santoku knife', 'Boning knife', 'Cleaver'],
    maintenanceTips: [
      'Hand wash and dry immediately after use',
      'Sharpen regularly with a whetstone',
      'Hone before each use with a honing steel',
      'Store in a knife block, on a magnetic strip, or with blade guards'
    ]
  },
  {
    id: 'pots-pans',
    name: 'Pots & Pans',
    description: 'Different types of cookware and when to use them.',
    image: '/images/education/equipment/pots-pans.jpg',
    mustHave: ['Stainless steel skillet', 'Non-stick pan', 'Dutch oven', 'Saucepan'],
    niceToHave: ['Cast iron skillet', 'Wok', 'Roasting pan', 'Double boiler'],
    maintenanceTips: [
      'Follow manufacturer\'s instructions for cleaning',
      'Season cast iron regularly',
      'Don\'t use metal utensils on non-stick surfaces',
      'Allow pans to cool before washing'
    ]
  },
  {
    id: 'tools',
    name: 'Essential Tools',
    description: 'Must-have kitchen tools for the home cook.',
    image: '/images/education/equipment/tools.jpg',
    mustHave: ['Cutting board', 'Measuring cups/spoons', 'Mixing bowls', 'Colander'],
    niceToHave: ['Food processor', 'Stand mixer', 'Immersion blender', 'Kitchen scale'],
    maintenanceTips: [
      'Sanitize cutting boards regularly',
      'Hand wash wooden utensils',
      'Clean small appliances after each use',
      'Replace plastic items when they become worn or scratched'
    ]
  }
];

// Sample data for troubleshooting
const troubleshootingGuides = [
  {
    id: 'over-under-cooking',
    name: 'Over or Under Cooking',
    problem: 'Food is either too raw or too well-done',
    solutions: [
      'Use a kitchen thermometer to check doneness',
      'Learn visual cues for different types of food',
      'Use timers and follow recipes until you build experience',
      'Consider the carryover cooking effect'
    ]
  },
  {
    id: 'too-salty',
    name: 'Too Salty Dishes',
    problem: 'Added too much salt to your dish',
    solutions: [
      'Add more liquid or unsalted ingredients to dilute',
      'Add starch (potato, rice, pasta) to absorb some salt',
      'Balance with acid (lemon juice, vinegar)',
      'For future cooking, salt gradually and taste as you go'
    ]
  },
  {
    id: 'burned-food',
    name: 'Burned or Scorched Food',
    problem: 'Bottom of pot is burned or food is scorched',
    solutions: [
      'Don\'t scrape the burnt part - transfer unburned food to a new pot',
      'For slight burns, add liquid and reduce heat immediately',
      'Use heavy-bottomed pots for more even heat distribution',
      'Don\'t leave food unattended on high heat'
    ]
  },
  {
    id: 'soggy-vegetables',
    name: 'Soggy Vegetables',
    problem: 'Vegetables are overcooked and mushy',
    solutions: [
      'Don\'t overcrowd the pan - cook in batches if needed',
      'Use high heat for quick cooking vegetables',
      'Consider blanching and shocking method',
      'Pat vegetables dry before cooking'
    ]
  }
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`education-tabpanel-${index}`}
      aria-labelledby={`education-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CookingEducationHub = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedTechnique(null);
    setSelectedIngredient(null);
    setSelectedEquipment(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

  // Handle image not found errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-food.jpg';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Cooking Education Hub
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Master essential cooking techniques, understand ingredients, and solve common kitchen challenges.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<LocalFireDepartment />} iconPosition="start" label="Cooking Techniques" />
          <Tab icon={<Restaurant />} iconPosition="start" label="Ingredient Knowledge" />
          <Tab icon={<Kitchen />} iconPosition="start" label="Equipment Guides" />
          <Tab icon={<Help />} iconPosition="start" label="Troubleshooting" />
        </Tabs>
      </Box>

      {/* Cooking Techniques Tab */}
      <TabPanel value={tabValue} index={0}>
        {selectedTechnique ? (
          // Detailed technique view
          (() => {
            const technique = cookingTechniques.find(t => t.id === selectedTechnique);
            if (!technique) return null;
            
            return (
              <Box>
                <Button 
                  variant="text" 
                  onClick={() => setSelectedTechnique(null)}
                  sx={{ mb: 2 }}
                >
                  ← Back to all techniques
                </Button>
                
                <Card sx={{ mb: 4, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="400"
                    image={technique.image}
                    alt={technique.name}
                    onError={handleImageError}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
                        {technique.name}
                      </Typography>
                      <Chip 
                        label={technique.difficulty} 
                        color={getDifficultyColor(technique.difficulty) as any}
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {technique.description}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Key Points:
                    </Typography>
                    <List>
                      {technique.keyPoints.map((point, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <LocalFireDepartment color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={point} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      variant="contained"
                      startIcon={<PlayCircleOutline />}
                      href={technique.videoUrl}
                      target="_blank"
                      sx={{ mt: 3 }}
                    >
                      Watch Video Tutorial
                    </Button>
                  </CardContent>
                </Card>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Try these recipes using this technique:
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={Link}
                    href={`/generate-recipe?technique=${encodeURIComponent(technique.name)}`}
                    sx={{ mr: 2 }}
                  >
                    Generate Recipe Using {technique.name}
                  </Button>
                </Box>
              </Box>
            );
          })()
        ) : (
          // Techniques grid view
          <>
            <Typography variant="h5" gutterBottom>
              Essential Cooking Techniques
            </Typography>
            <Typography variant="body1" paragraph>
              Master these fundamental cooking methods to expand your culinary repertoire.
            </Typography>
            
            <Grid container spacing={3}>
              {cookingTechniques.map((technique) => (
                <Grid item key={technique.id} xs={12} sm={6} md={3}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => setSelectedTechnique(technique.id)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={technique.image}
                      alt={technique.name}
                      onError={handleImageError}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {technique.name}
                        </Typography>
                        <Chip 
                          label={technique.difficulty} 
                          size="small"
                          color={getDifficultyColor(technique.difficulty) as any}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {technique.description.substring(0, 120)}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </TabPanel>

      {/* Ingredient Knowledge Tab */}
      <TabPanel value={tabValue} index={1}>
        {selectedIngredient ? (
          // Detailed ingredient view
          (() => {
            const ingredient = ingredientKnowledge.find(i => i.id === selectedIngredient);
            if (!ingredient) return null;
            
            return (
              <Box>
                <Button 
                  variant="text" 
                  onClick={() => setSelectedIngredient(null)}
                  sx={{ mb: 2 }}
                >
                  ← Back to all ingredients
                </Button>
                
                <Card sx={{ mb: 4, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={ingredient.image}
                    alt={ingredient.name}
                    onError={handleImageError}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {ingredient.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {ingredient.description}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Essential Tips:
                    </Typography>
                    <List>
                      {ingredient.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Restaurant color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Common Types:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {ingredient.commonTypes.map((type) => (
                        <Chip 
                          key={type}
                          label={type}
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom>
                    Recipe Suggestions:
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={Link}
                    href={`/generate-recipe?ingredients=${encodeURIComponent(ingredient.name)}`}
                    sx={{ mr: 2 }}
                  >
                    Find Recipes Using {ingredient.name}
                  </Button>
                </Box>
              </Box>
            );
          })()
        ) : (
          // Ingredients grid view
          <>
            <Typography variant="h5" gutterBottom>
              Ingredient Knowledge Base
            </Typography>
            <Typography variant="body1" paragraph>
              Learn how to select, store, and use different ingredients to maximize flavor and freshness.
            </Typography>
            
            <Grid container spacing={3}>
              {ingredientKnowledge.map((ingredient) => (
                <Grid item key={ingredient.id} xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => setSelectedIngredient(ingredient.id)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={ingredient.image}
                      alt={ingredient.name}
                      onError={handleImageError}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {ingredient.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {ingredient.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                        {ingredient.commonTypes.slice(0, 3).map((type) => (
                          <Chip 
                            key={type}
                            label={type}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                        {ingredient.commonTypes.length > 3 && (
                          <Chip 
                            label={`+${ingredient.commonTypes.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </TabPanel>

      {/* Equipment Guides Tab */}
      <TabPanel value={tabValue} index={2}>
        {selectedEquipment ? (
          // Detailed equipment view
          (() => {
            const equipment = equipmentGuides.find(e => e.id === selectedEquipment);
            if (!equipment) return null;
            
            return (
              <Box>
                <Button 
                  variant="text" 
                  onClick={() => setSelectedEquipment(null)}
                  sx={{ mb: 2 }}
                >
                  ← Back to all equipment
                </Button>
                
                <Card sx={{ mb: 4, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={equipment.image}
                    alt={equipment.name}
                    onError={handleImageError}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {equipment.name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {equipment.description}
                    </Typography>
                    
                    <Grid container spacing={4} sx={{ mt: 2 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Essential Items:
                        </Typography>
                        <List dense>
                          {equipment.mustHave.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Kitchen color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Nice to Have:
                        </Typography>
                        <List dense>
                          {equipment.niceToHave.map((item, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Kitchen color="secondary" />
                              </ListItemIcon>
                              <ListItemText primary={item} />
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Maintenance Tips:
                    </Typography>
                    <List>
                      {equipment.maintenanceTips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Kitchen color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={tip} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            );
          })()
        ) : (
          // Equipment grid view
          <>
            <Typography variant="h5" gutterBottom>
              Essential Kitchen Equipment
            </Typography>
            <Typography variant="body1" paragraph>
              Learn about the tools every home cook should have and how to use them effectively.
            </Typography>
            
            <Grid container spacing={3}>
              {equipmentGuides.map((equipment) => (
                <Grid item key={equipment.id} xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => setSelectedEquipment(equipment.id)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={equipment.image}
                      alt={equipment.name}
                      onError={handleImageError}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {equipment.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {equipment.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          icon={<Kitchen />} 
                          label={`${equipment.mustHave.length} Essential Items`} 
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </TabPanel>

      {/* Troubleshooting Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h5" gutterBottom>
          Common Cooking Problems & Solutions
        </Typography>
        <Typography variant="body1" paragraph>
          Quick fixes for everyday kitchen mishaps and cooking challenges.
        </Typography>
        
        {troubleshootingGuides.map((guide, index) => (
          <Accordion key={guide.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel-${guide.id}-content`}
              id={`panel-${guide.id}-header`}
            >
              <Typography variant="h6">{guide.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Problem: {guide.problem}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Solutions:
              </Typography>
              <List dense>
                {guide.solutions.map((solution, sIndex) => (
                  <ListItem key={sIndex}>
                    <ListItemIcon>
                      <Help color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={solution} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </TabPanel>

      {/* Call to Action */}
      <Box 
        sx={{ 
          mt: 6, 
          p: 4, 
          bgcolor: 'primary.main', 
          color: 'white', 
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to apply your new cooking knowledge?
        </Typography>
        <Typography variant="body1" paragraph>
          Use what you've learned to create amazing dishes with Fusion Meals.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained"
            component={Link}
            href="/generate-recipe"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            startIcon={<Search />}
          >
            Find a Recipe
          </Button>
          <Button 
            variant="outlined"
            component={Link}
            href="/seasonal-explorer"
            sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' } }}
            startIcon={<Bookmark />}
          >
            Explore Seasonal Ingredients
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CookingEducationHub; 