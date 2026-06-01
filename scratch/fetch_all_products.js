const https = require('https');

const WP_URL = 'blog.samanportable.com';
const WC_PATH = '/wp-json/wc/v3/products';
const CK = 'ck_8649e855e2c557f0a545b674bd5fb1eacc32ad59';
const CS = 'cs_d9b9536ff84a86871d7877481225b939cd4bacb2';

function fetchProducts(page = 1) {
  const url = `https://${WP_URL}${WC_PATH}?consumer_key=${CK}&consumer_secret=${CS}&page=${page}&per_page=100`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (!Array.isArray(json)) {
          console.error('Error or no products returned:', json);
          return;
        }
        
        if (json.length === 0) {
          return;
        }
        
        json.forEach((product) => {
          console.log(JSON.stringify({
            name: product.name,
            slug: product.slug,
            permalink: product.permalink,
            categories: product.categories.map(c => ({ name: c.name, slug: c.slug }))
          }));
        });
        
        // Fetch next page
        fetchProducts(page + 1);
      } catch (err) {
        console.error('Parse error:', err);
      }
    });
  }).on('error', (err) => {
    console.error('Fetch error:', err);
  });
}

fetchProducts(1);
