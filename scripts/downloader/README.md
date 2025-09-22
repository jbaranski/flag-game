# Flag Downloader

Downloads flags for all sovereign states from Flagpedia.net.

## Features

- Zero dependencies (Node.js 24+ built-ins only)
- Downloads flags for all 195 sovereign states (193 UN members + Vatican + Palestine)
- Downloads both 1x (160×107px) and 2x (320×214px) PNG flags
- Automatic country code detection
- Progress tracking and error handling
- Test mode for development

## Usage

```bash
# Download all flags
npm start

# Test with first 5 countries only
npm start -- --test

# Specify custom output directory
npm start -- --output=./my-flags

# Combined options
npm start -- --test --output=./test-flags

# Check total number of countries
npm run count
```

## Output Structure

```
flags/
├── afghanistan/
│   ├── 1x.png (160×107px)
│   └── 2x.png (320×214px)
├── albania/
│   ├── 1x.png
│   └── 2x.png
└── ...
```

## Generated Files

- `countries.json` - List of all countries with metadata
- `download-results.json` - Detailed download results and errors