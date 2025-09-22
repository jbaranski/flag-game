import https from 'https';

export class FlagpediaScraper {
  constructor() {
    this.baseUrl = 'https://flagpedia.net';
  }

  async fetchHtml(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  async getSovereignStates() {
    console.log('Fetching sovereign states list...');
    const html = await this.fetchHtml(`${this.baseUrl}/sovereign-states`);

    const countries = [];
    const linkRegex = /<li[^>]*>\s*<a[^>]+href="\/([^"\/]+)"[^>]*>\s*<img[^>]+alt="Flag of[^"]*"[^>]*>\s*<span>([^<]+)<\/span>\s*<\/a>\s*<\/li>/g;

    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const countrySlug = match[1];
      const countryName = match[2];

      if (countrySlug && countryName &&
          !countrySlug.includes('/') &&
          !countrySlug.includes('?') &&
          countrySlug !== 'data' &&
          countrySlug !== 'continent' &&
          countrySlug !== 'download') {
        countries.push({
          name: `Flag of ${countryName}`,
          slug: countrySlug,
          url: `${this.baseUrl}/${countrySlug}`
        });
      }
    }

    const uniqueCountries = countries.filter((country, index, self) =>
      index === self.findIndex(c => c.slug === country.slug)
    );

    console.log(`Found ${uniqueCountries.length} sovereign states`);
    return uniqueCountries;
  }

  async getCountryCode(countrySlug) {
    try {
      const html = await this.fetchHtml(`${this.baseUrl}/${countrySlug}/download/icons`);

      const codeMatch = html.match(/flagcdn\.com\/w\d+\/([a-z]{2})\.png/);
      if (codeMatch) {
        return codeMatch[1];
      }

      const altMatch = html.match(/alt="[^"]*\b([A-Z]{2})\b[^"]*"/);
      if (altMatch) {
        return altMatch[1].toLowerCase();
      }

      console.warn(`Could not extract country code for ${countrySlug}`);
      return null;
    } catch (error) {
      console.error(`Error getting country code for ${countrySlug}:`, error.message);
      return null;
    }
  }

  async getAllCountriesWithCodes() {
    const countries = await this.getSovereignStates();
    const results = [];

    for (const country of countries) {
      const countryCode = await this.getCountryCode(country.slug);
      if (countryCode) {
        results.push({
          ...country,
          code: countryCode
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
}