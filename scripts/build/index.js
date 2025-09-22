#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flag Guessing Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #333;
        }

        .game-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
        }

        .header {
            margin-bottom: 2rem;
        }

        .header h1 {
            color: #333;
            margin-bottom: 0.5rem;
        }

        .score {
            color: #666;
            font-size: 1.1rem;
        }

        .flag-container {
            margin: 2rem 0;
            position: relative;
            display: inline-block;
        }

        .flag {
            max-width: 320px;
            width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }

        .flag:hover {
            transform: scale(1.05);
        }

        .input-container {
            position: relative;
            margin: 2rem 0;
        }

        .country-input {
            width: 100%;
            padding: 1rem;
            font-size: 1.1rem;
            border: 2px solid #ddd;
            border-radius: 10px;
            outline: none;
            transition: border-color 0.3s ease;
        }

        .country-input:focus {
            border-color: #667eea;
        }

        .autocomplete-container {
            position: relative;
        }

        .autocomplete-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 10px 10px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        }

        .autocomplete-item {
            padding: 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            text-align: left;
        }

        .autocomplete-item:hover,
        .autocomplete-item.selected {
            background: #f0f0f0;
        }

        .autocomplete-item:last-child {
            border-bottom: none;
        }

        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #f1f1f1;
            color: #333;
        }

        .btn-secondary:hover {
            background: #e1e1e1;
            transform: translateY(-2px);
        }

        .feedback {
            margin: 1rem 0;
            padding: 1rem;
            border-radius: 10px;
            font-weight: 600;
            display: none;
        }

        .feedback.correct {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .feedback.incorrect {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #666;
            margin-top: 0.25rem;
        }

        .loading {
            color: #666;
            font-style: italic;
        }

        @media (max-width: 600px) {
            .game-container {
                padding: 1.5rem;
            }

            .buttons {
                flex-direction: column;
            }

            .stats {
                grid-template-columns: 1fr;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="header">
            <h1>🏁 Flag Guessing Game</h1>
            <div class="score">Score: <span id="score">0</span> / <span id="total">0</span></div>
        </div>

        <div class="flag-container">
            <img id="flag" class="flag" src="" alt="Flag to guess" style="display: none;">
            <div id="loading" class="loading">Loading game...</div>
        </div>

        <div class="input-container">
            <div class="autocomplete-container">
                <input
                    type="text"
                    id="countryInput"
                    class="country-input"
                    placeholder="Type the country name..."
                    autocomplete="off"
                    disabled
                >
                <div id="autocompleteList" class="autocomplete-list"></div>
            </div>
        </div>

        <div id="feedback" class="feedback"></div>

        <div class="buttons">
            <button id="submitBtn" class="btn btn-primary" disabled>Submit Guess</button>
            <button id="skipBtn" class="btn btn-secondary" disabled>Skip</button>
            <button id="nextBtn" class="btn btn-primary" style="display: none;">Next Flag</button>
        </div>

        <div class="stats">
            <div class="stat">
                <div id="correctCount" class="stat-number">0</div>
                <div class="stat-label">Correct</div>
            </div>
            <div class="stat">
                <div id="incorrectCount" class="stat-number">0</div>
                <div class="stat-label">Incorrect</div>
            </div>
            <div class="stat">
                <div id="skippedCount" class="stat-number">0</div>
                <div class="stat-label">Skipped</div>
            </div>
        </div>
    </div>

    <script>
        // Countries data - automatically generated from scripts/downloader/countries.json
        const COUNTRIES_DATA = {{COUNTRIES_DATA}};

        class FlagGame {
            constructor() {
                this.countries = [];
                this.currentFlag = null;
                this.usedFlags = new Set();
                this.score = 0;
                this.total = 0;
                this.correct = 0;
                this.incorrect = 0;
                this.skipped = 0;
                this.selectedIndex = -1;

                this.init();
            }

            async init() {
                this.loadCountries();
                this.setupEventListeners();
                this.nextFlag();
            }

            loadCountries() {
                this.countries = COUNTRIES_DATA.map(country => ({
                    ...country,
                    displayName: country.name.replace('Flag of ', '')
                }));

                document.getElementById('loading').style.display = 'none';
                document.getElementById('flag').style.display = 'block';
                document.getElementById('countryInput').disabled = false;
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('skipBtn').disabled = false;
            }

            setupEventListeners() {
                const input = document.getElementById('countryInput');
                const submitBtn = document.getElementById('submitBtn');
                const skipBtn = document.getElementById('skipBtn');
                const nextBtn = document.getElementById('nextBtn');
                const autocompleteList = document.getElementById('autocompleteList');

                input.addEventListener('input', (e) => this.handleInput(e));
                input.addEventListener('keydown', (e) => this.handleKeydown(e));
                input.addEventListener('blur', () => this.hideAutocomplete());

                submitBtn.addEventListener('click', () => this.submitGuess());
                skipBtn.addEventListener('click', () => this.skipFlag());
                nextBtn.addEventListener('click', () => this.nextFlag());

                autocompleteList.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                });
                autocompleteList.addEventListener('click', (e) => {
                    if (e.target.classList.contains('autocomplete-item')) {
                        this.selectAutocompleteItem(e.target.textContent);
                    }
                });
            }

            handleInput(e) {
                const value = e.target.value.trim();
                if (value.length > 0) {
                    this.showAutocomplete(value);
                } else {
                    this.hideAutocomplete();
                }
                this.selectedIndex = -1;
            }

            handleKeydown(e) {
                const autocompleteList = document.getElementById('autocompleteList');
                const items = autocompleteList.querySelectorAll('.autocomplete-item');

                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
                        this.updateSelection(items);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                        this.updateSelection(items);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                            this.selectAutocompleteItem(items[this.selectedIndex].textContent);
                        } else {
                            this.submitGuess();
                        }
                        break;
                    case 'Escape':
                        this.hideAutocomplete();
                        break;
                }
            }

            updateSelection(items) {
                items.forEach((item, index) => {
                    item.classList.toggle('selected', index === this.selectedIndex);
                });
            }

            showAutocomplete(query) {
                const matches = this.countries
                    .filter(country =>
                        country.displayName.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 8)
                    .sort((a, b) => {
                        const aStarts = a.displayName.toLowerCase().startsWith(query.toLowerCase());
                        const bStarts = b.displayName.toLowerCase().startsWith(query.toLowerCase());
                        if (aStarts && !bStarts) return -1;
                        if (!aStarts && bStarts) return 1;
                        return a.displayName.localeCompare(b.displayName);
                    });

                const autocompleteList = document.getElementById('autocompleteList');

                if (matches.length > 0) {
                    autocompleteList.innerHTML = matches
                        .map(country => \`<div class="autocomplete-item">\${country.displayName}</div>\`)
                        .join('');
                    autocompleteList.style.display = 'block';
                } else {
                    this.hideAutocomplete();
                }
            }

            hideAutocomplete() {
                document.getElementById('autocompleteList').style.display = 'none';
                this.selectedIndex = -1;
            }

            selectAutocompleteItem(countryName) {
                document.getElementById('countryInput').value = countryName;
                this.hideAutocomplete();
                this.submitGuess();
            }

            nextFlag() {
                if (this.usedFlags.size >= this.countries.length) {
                    this.showGameComplete();
                    return;
                }

                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * this.countries.length);
                } while (this.usedFlags.has(randomIndex));

                this.currentFlag = this.countries[randomIndex];
                this.usedFlags.add(randomIndex);

                const flagImg = document.getElementById('flag');
                // Use flagcdn.com for GitHub Pages compatibility
                flagImg.src = \`https://flagcdn.com/320x214/\${this.currentFlag.code}.png\`;
                flagImg.alt = \`Flag of \${this.currentFlag.displayName}\`;

                // Fallback to local flags if needed (uncomment for local deployment)
                // flagImg.src = \`./scripts/downloader/flags/\${this.currentFlag.slug}/2x.png\`;

                document.getElementById('countryInput').value = '';
                document.getElementById('countryInput').disabled = false;
                document.getElementById('submitBtn').disabled = false;
                document.getElementById('skipBtn').disabled = false;
                document.getElementById('nextBtn').style.display = 'none';
                document.getElementById('feedback').style.display = 'none';

                this.hideAutocomplete();
                document.getElementById('countryInput').focus();
            }

            submitGuess() {
                const guess = document.getElementById('countryInput').value.trim();
                if (!guess) return;

                const isCorrect = guess.toLowerCase() === this.currentFlag.displayName.toLowerCase();
                this.total++;

                if (isCorrect) {
                    this.score++;
                    this.correct++;
                    this.showFeedback('Correct! 🎉', 'correct');
                    this.updateStats();

                    setTimeout(() => {
                        this.nextFlag();
                    }, 1500);
                } else {
                    this.incorrect++;
                    this.showFeedback(\`Incorrect. The answer was: \${this.currentFlag.displayName}\`, 'incorrect');
                    this.updateStats();
                    this.disableInputs();
                    document.getElementById('nextBtn').style.display = 'inline-block';
                }
            }

            skipFlag() {
                this.total++;
                this.skipped++;
                this.showFeedback(\`Skipped. The answer was: \${this.currentFlag.displayName}\`, 'incorrect');
                this.updateStats();
                this.disableInputs();
                document.getElementById('nextBtn').style.display = 'inline-block';
            }

            showFeedback(message, type) {
                const feedback = document.getElementById('feedback');
                feedback.textContent = message;
                feedback.className = \`feedback \${type}\`;
                feedback.style.display = 'block';
            }

            disableInputs() {
                document.getElementById('countryInput').disabled = true;
                document.getElementById('submitBtn').disabled = true;
                document.getElementById('skipBtn').disabled = true;
                this.hideAutocomplete();
            }

            updateStats() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('total').textContent = this.total;
                document.getElementById('correctCount').textContent = this.correct;
                document.getElementById('incorrectCount').textContent = this.incorrect;
                document.getElementById('skippedCount').textContent = this.skipped;
            }

            showGameComplete() {
                if (this.total === 0) {
                    this.showFeedback('No flags were loaded. Please check the setup.', 'incorrect');
                    return;
                }
                const percentage = Math.round((this.score / this.total) * 100);
                this.showFeedback(\`Game Complete! Final Score: \${this.score}/\${this.total} (\${percentage}%)\`, 'correct');
                document.getElementById('nextBtn').textContent = 'Play Again';
                document.getElementById('nextBtn').onclick = () => location.reload();
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            new FlagGame();
        });
    </script>
</body>
</html>`;

function buildGitHubVersion() {
    try {
        console.log('🔨 Building GitHub Pages version...');

        // Read countries data from the downloader (go up two levels from scripts/build)
        const rootDir = join(process.cwd(), '..', '..');
        const countriesPath = join(rootDir, 'scripts', 'downloader', 'countries.json');
        const countriesData = readFileSync(countriesPath, 'utf8');
        const countries = JSON.parse(countriesData);

        console.log(`📊 Found ${countries.length} countries`);

        // Generate HTML with embedded data
        const html = TEMPLATE.replace('{{COUNTRIES_DATA}}', JSON.stringify(countries, null, 8));

        // Write directly to docs/ folder for GitHub Pages deployment
        const docsDir = join(rootDir, 'docs');
        const docsPath = join(docsDir, 'index.html');

        try {
            // Create docs directory if it doesn't exist
            if (!existsSync(docsDir)) {
                mkdirSync(docsDir, { recursive: true });
            }
            writeFileSync(docsPath, html, 'utf8');
            console.log(`✅ Deployed: ${docsPath}`);
        } catch (error) {
            console.log(`⚠️  Could not deploy to docs/ folder: ${error.message}`);
        }

        console.log(`📁 File size: ${(html.length / 1024).toFixed(1)}KB`);
        console.log('');
        console.log('🚀 Ready for GitHub Pages deployment!');
        console.log('   📤 Commit and push: git add docs/ && git commit -m "Deploy to GitHub Pages" && git push');
        console.log('   ⚙️  Enable GitHub Pages from docs/ folder in repository settings');

    } catch (error) {
        console.error('❌ Build failed:', error.message);

        if (error.code === 'ENOENT' && error.path?.includes('countries.json')) {
            console.error('');
            console.error('Make sure to download flags first:');
            console.error('  cd ../../scripts/downloader');
            console.error('  npm start');
            console.error('  cd ../build');
        }

        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    buildGitHubVersion();
}

export { buildGitHubVersion };