const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store (replace with database in production)
let restaurantDishes = [];
let savedTransformations = [];

// Data file path
const dataFilePath = path.join(__dirname, 'data', 'restaurant-dishes.json');

// Load data on startup
const loadData = async () => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    restaurantDishes = JSON.parse(data);
    console.log(`Loaded ${restaurantDishes.length} dishes from data file`);
  } catch (error) {
    console.error('Error loading data:', error);
    // Create empty data file if it doesn't exist
    try {
      await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
      console.log('Created empty data file');
    } catch (err) {
      console.error('Failed to create data file:', err);
    }
  }
};

// API Routes

// Search dishes
app.get('/api/restaurant-dishes/search', (req, res) => {
  const { query } = req.query;
  console.log(`Search request received for: "${query}"`);
  
  if (!query) {
    return res.json(restaurantDishes);
  }
  
  const lowercaseQuery = query.toLowerCase();
  const results = restaurantDishes.filter(dish => 
    dish.originalName.toLowerCase().includes(lowercaseQuery) || 
    dish.restaurantName.toLowerCase().includes(lowercaseQuery)
  );
  
  console.log(`Found ${results.length} results for query: "${query}"`);
  res.json(results);
});

// Get dish by ID
app.get('/api/restaurant-dishes/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Request for dish ID: ${id}`);
  
  const dish = restaurantDishes.find(d => d.id === id);
  
  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }
  
  res.json(dish);
});

// Get popular dishes
app.get('/api/restaurant-dishes/popular', (req, res) => {
  console.log('Request for popular dishes');
  // In a real app, you might have some logic to determine popularity
  res.json(restaurantDishes.slice(0, 3));
});

// Get saved transformations
app.get('/api/user/saved-transformations', (req, res) => {
  console.log('Request for user saved transformations');
  res.json(savedTransformations);
});

// Save a transformation
app.post('/api/user/saved-transformations', (req, res) => {
  const { dishId } = req.body;
  console.log(`Request to save transformation for dish ID: ${dishId}`);
  
  if (!dishId) {
    return res.status(400).json({ error: 'dishId is required' });
  }
  
  const dish = restaurantDishes.find(d => d.id === dishId);
  
  if (!dish) {
    return res.status(404).json({ error: 'Dish not found' });
  }
  
  // In a real app, you would associate this with a user
  savedTransformations.push({
    id: Date.now().toString(),
    dishId,
    savedAt: new Date().toISOString()
  });
  
  res.json({ success: true });
});

// Add a new dish
app.post('/api/restaurant-dishes', async (req, res) => {
  const newDish = req.body;
  console.log('Request to add new dish:', newDish.originalName);
  
  if (!newDish.originalName || !newDish.restaurantName) {
    return res.status(400).json({ error: 'originalName and restaurantName are required' });
  }
  
  // Generate an ID
  newDish.id = (restaurantDishes.length + 1).toString().padStart(4, '0');
  
  restaurantDishes.push(newDish);
  
  // Save to file
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(restaurantDishes, null, 2));
    console.log('Data saved to file');
  } catch (error) {
    console.error('Error saving data:', error);
  }
  
  res.status(201).json(newDish);
});

// Start server
app.listen(PORT, async () => {
  await loadData();
  console.log(`Server running on port ${PORT}`);
}); 