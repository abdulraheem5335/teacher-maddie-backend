const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000'];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Check Games directory path
const gamesPath = path.join(__dirname, process.env.GAMES_DIRECTORY || 'Games');
console.log(gamesPath)
console.log('Complete Games directory path:', gamesPath);
console.log('Games directory exists:', fs.existsSync(gamesPath));

if (fs.existsSync(gamesPath)) {
  const gamesFolders = fs.readdirSync(gamesPath);
  console.log('Available game folders:', gamesFolders);
} else {
  console.log('Games directory not found!');
}

// Serve static files from Games directory
app.use(process.env.STATIC_PATH || '/games', express.static(gamesPath));

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: process.env.SERVER_MESSAGE || 'Game Management Server is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message || process.env.ERROR_500_MESSAGE || 'Internal server error' });
});

// 404 handler - Use a function instead of wildcard route
app.use((req, res) => {
  res.status(404).json({ error: process.env.ERROR_404_MESSAGE || 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Complete path to Games: ${gamesPath}`);
  console.log(`Games available at:`);
  const baseUrl = process.env.RAILWAY_URL || `http://localhost:${PORT}`;
  console.log(`- Word Quest: ${baseUrl}${process.env.WORD_QUEST_URL || '/games/Word-Quest/index.html'}`);
  console.log(`- Math Adventure: ${baseUrl}${process.env.MATH_ADVENTURE_URL || '/games/Math-Adventure/index.html'}`);
  console.log(`- Color Memory Challenge: ${baseUrl}${process.env.COLOR_MEMORY_URL || '/games/Color-Memory-Challenge/index.html'}`);
});

module.exports = app;