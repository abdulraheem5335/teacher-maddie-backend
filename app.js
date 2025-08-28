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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Add debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Check Games directory path
const gamesPath = path.join(__dirname, 'Games');
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
app.use('/games', express.static(gamesPath));

// Routes
const gameRoutes = require('./routes/gameRoutes');
app.use('/api/games', gameRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Game Management Server is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// 404 handler - Use a function instead of wildcard route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Complete path to Games: ${gamesPath}`);
  console.log(`Games available at:`);
  console.log(`- Word Quest: http://localhost:${PORT}/games/Word-Quest/index.html`);
  console.log(`- Math Adventure: http://localhost:${PORT}/games/Math-Adventure/index.html`);
  console.log(`- Color Memory Challenge: http://localhost:${PORT}/games/Color-Memory-Challenge/index.html`);
});

module.exports = app;