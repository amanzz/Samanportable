const https = require('https');
const url = require('url');

// Define API endpoint
const endpoint = 'https://blog.samanportable.com/wp-json/wp/v2/posts?_embed=true&per_page=100';

console.log('Fetching blog posts from WordPress REST API...');

function getJSON(apiUrl) {
  return new Promise((resolve, reject) => {
    https.get(apiUrl, {
      headers: {
        'User-Agent': 'Saman-Portable-Website-Audit/1.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  try {
    const posts = await getJSON(endpoint);
    console.log(`Successfully fetched ${posts.length} blog posts.`);

    const domains = new Set();
    const inventory = {}; // domain -> list of { slug, type }

    const addDomain = (imgUrl, slug, type) => {
      if (!imgUrl) return;
      try {
        const parsed = url.parse(imgUrl);
        if (parsed.hostname) {
          domains.add(parsed.hostname);
          if (!inventory[parsed.hostname]) {
            inventory[parsed.hostname] = [];
          }
          if (!inventory[parsed.hostname].some(item => item.slug === slug && item.type === type)) {
            inventory[parsed.hostname].push({ slug, type });
          }
        }
      } catch (e) {
        console.error(`Invalid URL: ${imgUrl}`, e);
      }
    };

    posts.forEach(post => {
      const slug = post.slug;

      // 1. Featured Image
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        const featMedia = post._embedded['wp:featuredmedia'][0];
        addDomain(featMedia.source_url, slug, 'Featured Image');
      }

      // 2. Author Image
      if (post._embedded && post._embedded.author && post._embedded.author[0] && post._embedded.author[0].avatar_urls) {
        const avatars = post._embedded.author[0].avatar_urls;
        Object.values(avatars).forEach(avatarUrl => {
          addDomain(avatarUrl, slug, 'Author Avatar');
        });
      }

      // 3. Embedded Content Images
      const content = post.content.rendered;
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        addDomain(match[1], slug, 'Embedded Content Image');
      }
    });

    console.log('\n--- UNIQUE HOSTNAMES FOUND ---');
    Array.from(domains).sort().forEach(domain => {
      console.log(`* ${domain}`);
    });

    console.log('\n--- DETAILED SUMMARY BY HOSTNAME ---');
    Object.keys(inventory).sort().forEach(domain => {
      const items = inventory[domain];
      const count = items.length;
      console.log(`Hostname: ${domain} (${count} references)`);
      const sampleSlugs = items.slice(0, 5).map(i => `${i.slug} (${i.type})`);
      console.log(`  Samples: ${sampleSlugs.join(', ')}${items.length > 5 ? '... and more' : ''}`);
    });

  } catch (error) {
    console.error('Audit failed:', error);
  }
}

run();
