const express = require('express');
const path = require('path');
const router = express.Router();

// Static game data
const games = [
  {
    id: '1',
    title: 'Word Quest',
    description: 'An exciting word puzzle adventure game',
    thumbnail: '/games/Word-Quest/thumbnail.png',
    folderName: 'Word-Quest'
  },
  {
    id: '2', 
    title: 'Math Adventure',
    description: 'Fun mathematical challenges and puzzles',
    thumbnail: '/games/Math-Adventure/thumbnail.png',
    folderName: 'Math-Adventure'
  },
  {
    id: '3',
    title: 'Color Memory Challenge',
    description: 'Test your memory with colorful patterns',
    thumbnail: '/games/Color-Memory-Challenge/thumbnail.png', 
    folderName: 'Color-Memory-Challenge'
  }
];

console.log('Game routes loaded');

// Test route
router.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ 
    message: 'Games API is working!',
    availableGames: games.length
  });
});

// Get all games
router.get('/', (req, res) => {
  console.log('Games list requested');
  res.json(games);
});

module.exports = router;


// GET /api/games/:folderName/play - Serve game's index.html
router.get('/:folderName/play', async (req, res) => {
  try {
    const { folderName } = req.params;
    console.log(`Play route hit for: ${folderName}`);
    
    // Validate folder name exists in our games list
    const game = games.find(g => g.folderName === folderName);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const indexPath = path.join(__dirname, '../../Games', folderName, 'index.html');
    console.log(`Serving file: ${indexPath}`);
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving game:', error);
    res.status(500).json({ error: 'Failed to serve game' });
  }
});

// GET /api/games/:id - Get single game metadata (MUST be last)
router.get('/:id', (req, res) => {
  console.log(`ID route hit for: ${req.params.id}`);
  const game = games.find(g => g.id === req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

module.exports = router;
