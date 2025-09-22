import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';
import https from 'https';

export class FlagDownloader {
  constructor(outputDir = './flags') {
    this.outputDir = outputDir;
    this.baseUrl = 'https://flagcdn.com';
  }

  async downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
      mkdirSync(dirname(filePath), { recursive: true });

      const file = createWriteStream(filePath);
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async downloadCountryFlags(country) {
    const { name, slug, code } = country;

    const downloads = [
      {
        url: `${this.baseUrl}/w160/${code}.png`,
        path: `${this.outputDir}/${slug}/1x.png`,
        size: '160x107'
      },
      {
        url: `${this.baseUrl}/w320/${code}.png`,
        path: `${this.outputDir}/${slug}/2x.png`,
        size: '320x214'
      }
    ];

    // Check if both files already exist
    const allExist = downloads.every(download => existsSync(download.path));

    if (allExist) {
      console.log(`Skipping ${name} (${code}) - files already exist`);
      return downloads.map(download => ({ success: true, skipped: true, ...download }));
    }

    console.log(`Downloading flags for ${name} (${code})...`);

    const results = [];
    for (const download of downloads) {
      try {
        if (existsSync(download.path)) {
          console.log(`  ⏭ ${download.size} already exists: ${download.path}`);
          results.push({ success: true, skipped: true, ...download });
        } else {
          await this.downloadFile(download.url, download.path);
          console.log(`  ✓ ${download.size} saved to ${download.path}`);
          results.push({ success: true, ...download });
        }
      } catch (error) {
        console.error(`  ✗ Failed to download ${download.size}: ${error.message}`);
        results.push({ success: false, error: error.message, ...download });
      }
    }

    return results;
  }

  async downloadAllFlags(countries) {
    console.log(`Starting download of flags for ${countries.length} countries...`);
    const results = [];

    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      console.log(`\n[${i + 1}/${countries.length}] Processing ${country.name}...`);

      try {
        const downloadResults = await this.downloadCountryFlags(country);
        results.push({
          country,
          downloads: downloadResults
        });
      } catch (error) {
        console.error(`Failed to process ${country.name}: ${error.message}`);
        results.push({
          country,
          error: error.message
        });
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const successful = results.filter(r => !r.error && r.downloads?.every(d => d.success));
    console.log(`\nDownload complete: ${successful.length}/${countries.length} countries successful`);

    return results;
  }
}