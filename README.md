# Flag Guessing Game

A web-based flag guessing game that uses the flags downloaded from the `scripts/downloader` directory.

## Features

- 🏁 **195 flags** from all sovereign states (193 UN members + Vatican + Palestine)
- 🔍 **Smart autocomplete** with country name suggestions
- ⌨️ **Keyboard navigation** (arrow keys, Enter, Escape)
- 📊 **Score tracking** with detailed statistics
- 📱 **Responsive design** that works on mobile and desktop
- 🎯 **No repeats** until all flags have been shown

## Setup

1. **Make sure you have downloaded the flags:**
   ```bash
   cd scripts/downloader
   npm start  # Downloads all flag images
   cd ../..   # Return to flag-game directory
   ```

2. **Start the game server:**
   ```bash
   npm start
   ```

3. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## How to Play

1. A random flag will be displayed
2. Type the country name in the input field
3. Use the autocomplete suggestions to help you
4. Press Enter or click "Submit Guess" to check your answer
5. Click "Skip" if you don't know the answer
6. Click "Next Flag" to continue to the next flag

## Game Controls

- **Type to search**: Autocomplete will show matching countries
- **↑↓ Arrow keys**: Navigate autocomplete suggestions
- **Enter**: Select highlighted suggestion or submit guess
- **Escape**: Close autocomplete dropdown

## Technical Details

The game:
- Loads country data from `scripts/downloader/countries.json`
- Displays flag images from `scripts/downloader/flags/{country-slug}/2x.png`
- Strips "Flag of" prefix from country names for user-friendly display
- Tracks statistics for correct, incorrect, and skipped answers
- Prevents showing the same flag twice until all have been used

## Requirements

- Node.js 18+ (for the local server)
- Flags must be downloaded first using the downloader script

## Development

The game consists of:
- `index.html` - Complete single-page application with HTML, CSS, and JavaScript
- `server.js` - Simple HTTP server to serve files and avoid CORS issues
- `package.json` - Project configuration

To modify the game, edit `index.html` and restart the server.