# Flag Game Build System

Builds the GitHub Pages version of the flag guessing game by embedding country data directly into the HTML template.

## Features

- Reads country data from `../downloader/countries.json`
- Embeds data directly into HTML template for static hosting
- Outputs to `../../docs/index.html` for GitHub Pages deployment
- Uses external CDN for flag images (flagcdn.com)
- Self-contained build system with minimal dependencies

## Usage

```bash
# Build and deploy to docs/ folder
npm start
```

## How It Works

1. **Reads** country data from the downloader
2. **Embeds** the data into an HTML template
3. **Generates** a static HTML file with no external dependencies
4. **Outputs** directly to `docs/index.html` for GitHub Pages

## Requirements

- Node.js 18+ (ES modules)
- Country data must exist at `../downloader/countries.json`

## Output

- Generates `../../docs/index.html` ready for GitHub Pages deployment
- File size: ~53KB (includes all 195 countries embedded)
- Works on any static hosting platform

## Integration

This build system is designed to work with:
- **Input**: Flag downloader system (`../downloader/`)
- **Output**: GitHub Pages deployment (`../../docs/`)
- **Root project**: Main flag game (`../../`)