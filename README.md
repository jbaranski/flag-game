# Flag Guessing Game

A web-based flag guessing game featuring all 195 sovereign state flags with smart autocomplete and automated deployment.

## ✨ Features

- 🏁 **195 flags** from all sovereign states (193 UN members + Vatican + Palestine)
- 🔍 **Smart autocomplete** with country name suggestions
- ⌨️ **Keyboard navigation** (arrow keys, Enter, Escape)
- 📊 **Real-time score tracking** with detailed statistics
- 📱 **Responsive design** that works on mobile and desktop
- 🎯 **No repeats** until all flags have been shown
- ⚡ **Auto-advance** after correct answers
- 🌐 **GitHub Pages ready** with automated build system

## 🚀 Quick Start

### Local Development
```bash
# 1. Download flag images
cd scripts/downloader && npm start && cd ../..

# 2. Start development server
npm start

# 3. Open http://localhost:3000
```

### GitHub Pages Deployment
```bash
# 1. Build for deployment (auto-deploys to docs/ folder)
cd scripts/build && npm start && cd ../..

# 2. Commit and push
git add docs/ && git commit -m "Deploy to GitHub Pages" && git push

# 3. Enable GitHub Pages from docs/ folder in repository settings
```

## 🎮 How to Play

1. **View the flag** - A random flag is displayed
2. **Type the country** - Use the smart autocomplete for suggestions
3. **Submit your guess** - Press Enter or click Submit
4. **Track your progress** - See your score and statistics
5. **Keep playing** - Correct answers auto-advance to the next flag

### ⌨️ Controls
- **Type to search** - Autocomplete shows matching countries
- **↑↓ Arrow keys** - Navigate suggestions
- **Enter** - Select suggestion or submit guess
- **Escape** - Close autocomplete

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start local development server |

### Build System Commands
| Command | Description |
|---------|-------------|
| `cd scripts/build && npm start` | Build and deploy to docs/ folder |

### Downloader Commands
| Command | Description |
|---------|-------------|
| `cd scripts/downloader && npm start` | Download all flag images |

## 🏗️ Project Structure

```
flag-game/
├── 📄 index.html              # Local development version
├── 🖥️ server.js               # Development server
├── 📋 package.json            # Root project configuration
├── 📁 docs/
│   └── index.html             # GitHub Pages deployment
└── 📁 scripts/
    ├── downloader/            # Flag downloading system
    │   ├── countries.json     # Country data (195 countries)
    │   ├── flags/             # Downloaded flag images
    │   └── package.json       # Downloader configuration
    └── build/                 # GitHub Pages build system
        ├── index.js           # Build script
        └── package.json       # Build system configuration
```

## ⚙️ Technical Details

### Local Version
- Uses local flag images from `scripts/downloader/flags/`
- Loads country data from `scripts/downloader/countries.json`
- Requires development server to avoid CORS issues

### GitHub Pages Version
- Uses external CDN for flag images (flagcdn.com)
- Embeds country data directly in HTML
- Works on any static hosting platform
- Auto-generated and deployed to `docs/` folder

### Build System
The build system (`scripts/build/`) automatically:
- ✅ Reads latest country data from `scripts/downloader/countries.json`
- ✅ Embeds data into HTML template
- ✅ Outputs directly to `docs/index.html`
- ✅ Keeps root directory clean
- ✅ Self-contained with its own package.json

## 📦 Requirements

- **Node.js 18+** (for development server and build system)
- **Flag images** (download with `cd scripts/downloader && npm start`)

## 🛠️ Development

To modify the game:
1. Edit `index.html` for local changes
2. Run `cd scripts/build && npm start` to update GitHub Pages version
3. Test locally with `npm start`
4. Deploy with `git add docs/ && git commit && git push`