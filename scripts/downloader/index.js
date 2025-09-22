#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { FlagpediaScraper } from './scraper.js';
import { FlagDownloader } from './downloader.js';

async function main() {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  const outputDir = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || './flags';

  try {
    console.log('🏴 Flag Downloader Started');
    console.log('==========================\n');

    const scraper = new FlagpediaScraper();
    const downloader = new FlagDownloader(outputDir);

    console.log('📋 Step 1: Getting list of sovereign states...');
    let countries = await scraper.getAllCountriesWithCodes();

    if (testMode) {
      console.log('\n🧪 Test mode: limiting to first 5 countries');
      countries = countries.slice(0, 5);
    }

    writeFileSync('./countries.json', JSON.stringify(countries, null, 2));
    console.log(`📝 Saved country list to countries.json (${countries.length} countries)\n`);

    console.log('⬇️  Step 2: Downloading flags...');
    const results = await downloader.downloadAllFlags(countries);

    writeFileSync('./download-results.json', JSON.stringify(results, null, 2));
    console.log('\n📝 Saved download results to download-results.json');

    const totalDownloads = results.reduce((sum, r) =>
      sum + (r.downloads?.filter(d => d.success).length || 0), 0
    );
    console.log(`\n✅ Complete! Downloaded ${totalDownloads} flag images`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}