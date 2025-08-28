# Game Management API Documentation

## Overview
This API provides complete game management functionality for a MERN teaching website, including CRUD operations, secure file serving, and admin upload capabilities.

## API Routes

### Game CRUD Operations

#### GET /api/games
Returns a list of all games with their metadata.

**Response:**
```json
[
  {
    "_id": "game_id",
    "title": "Tic Tac Toe",
    "description": "Classic tic-tac-toe game",
    "thumbnail": "thumbnail_url",
    "folderName": "tic-tac-toe",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/games/:id
Returns metadata for a specific game.

**Parameters:**
- `id`: MongoDB ObjectId of the game

**Response:**
```json
{
  "_id": "game_id",
  "title": "Tic Tac Toe",
  "description": "Classic tic-tac-toe game",
  "thumbnail": "thumbnail_url",
  "folderName": "tic-tac-toe",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

#### POST /api/games
Creates a new game entry (requires existing game folder).

**Request Body:**
```json
{
  "title": "Game Title",
  "description": "Game description",
  "thumbnail": "thumbnail_url",
  "folderName": "game-folder-name"
}
```

#### DELETE /api/games/:id
Deletes a game and its associated folder.

**Parameters:**
- `id`: MongoDB ObjectId of the game

### Game File Serving

#### GET /api/games/:folderName/play
Serves the main index.html file for a game.

**Parameters:**
- `folderName`: The folder name of the game

**Security Features:**
- Validates folder name format
- Checks game exists in database
- Serves from secure game directory

#### GET /api/games/:folderName/assets/*
Serves game assets (CSS, JS, images) securely.

**Parameters:**
- `folderName`: The folder name of the game
- `*`: Path to the asset file

**Security Features:**
- Prevents directory traversal attacks
- Validates folder name format
- Ensures files are within game folder
- Checks game exists in database

### Admin Upload

#### POST /api/games/upload
Uploads and extracts a game zip file.

**Request:**
- Content-Type: multipart/form-data
- File field: `gameZip` (must be .zip file)
- Form fields: `title`, `description`, `thumbnail`, `folderName`

**Features:**
- 50MB file size limit
- Automatic zip extraction
- Validates index.html presence
- Creates database entry
- Cleans up on errors

## Game Folder Structure

Games are stored in: `server/games/{folderName}/`

Required files:
- `index.html` (main game file)

Optional files:
- `style.css` (game styles)
- `script.js` (game logic)
- Any other assets (images, sounds, etc.)

## Sample Game

A sample Tic Tac Toe game is included at:
`server/games/tic-tac-toe/`

To add it to the database, make a POST request to `/api/games`:
```json
{
  "title": "Tic Tac Toe",
  "description": "Classic tic-tac-toe game for two players",
  "thumbnail": "https://example.com/tic-tac-toe-thumbnail.png",
  "folderName": "tic-tac-toe"
}
```

## Security Features

1. **Input Validation**: Folder names are validated to prevent malicious input
2. **Path Traversal Protection**: Prevents access to files outside game folders
3. **Database Verification**: All file serving requires valid database entries
4. **File Type Restrictions**: Upload only accepts .zip files
5. **Size Limits**: 50MB upload limit

## Installation

1. Install dependencies:
```bash
npm install adm-zip multer
```

2. Ensure your MongoDB connection is configured
3. Add the game routes to your Express app
4. Create the `server/games/` directory structure

## Error Handling

All routes include comprehensive error handling with appropriate HTTP status codes:
- 400: Bad Request (validation errors, missing files)
- 404: Not Found (game doesn't exist)
- 500: Internal Server Error (database/file system errors)
