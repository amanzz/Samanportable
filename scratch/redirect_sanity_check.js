const path = require('path');

console.log('Running Redirect Sanity Check...');

async function main() {
  try {
    const nextConfig = require('../next.config.js');
    const redirects = await nextConfig.redirects();
    console.log(`Successfully exported ${redirects.length} active redirects.`);

    // Build a map of source -> destination for quick lookup
    const redirectMap = {};
    redirects.forEach(r => {
      // Normalize source by removing trailing slashes and making lowercase for standard checking
      const src = r.source.toLowerCase().replace(/\/$/, '');
      const dest = r.destination.toLowerCase().replace(/\/$/, '');
      redirectMap[src] = dest;
    });

    const results = [];
    let issueCount = 0;

    // We will audit ALL redirects
    redirects.forEach(r => {
      const originalSource = r.source;
      const originalDest = r.destination;
      
      let currentSrc = originalSource.toLowerCase().replace(/\/$/, '');
      let currentDest = originalDest.toLowerCase().replace(/\/$/, '');
      
      let hopCount = 1;
      let pathTrace = [currentSrc];
      let finalStatus = 'OK';
      let isLoop = false;
      let isChain = false;

      // Trace the redirect path to check for chains and loops
      while (redirectMap[currentDest]) {
        const nextDest = redirectMap[currentDest];
        
        if (pathTrace.includes(currentDest)) {
          isLoop = true;
          finalStatus = 'LOOP';
          break;
        }
        
        pathTrace.push(currentDest);
        currentDest = nextDest;
        hopCount++;
        isChain = true;
      }

      if (isLoop) {
        finalStatus = 'LOOP DETECTED';
        issueCount++;
      } else if (isChain) {
        finalStatus = 'CHAIN DETECTED';
        issueCount++;
      }

      // Check if destination matches specific types
      const isProductCategory = originalDest.includes('/product-category/');
      const isProduct = originalDest.includes('/product/');
      const isRental = originalDest.includes('/rental-services') || originalDest.includes('/container-rent-services/');
      // Blog pages can be identified by exclusion of products, static files, checkout/cart, home, and standard pages, or typical blog slug formats
      const isBlog = !isProductCategory && !isProduct && !isRental && 
                     originalDest !== '/' && 
                     !originalDest.startsWith('/api') && 
                     !originalDest.startsWith('/static') &&
                     !['/about-us', '/contact', '/cart', '/checkout', '/privacy-policy', '/terms-and-conditions', '/delivery-policy', '/refund-and-return-policy', '/gallery', '/404', '/410'].includes(originalDest);

      const isTargetType = isProductCategory || isProduct || isRental || isBlog;

      if (isTargetType) {
        results.push({
          source: originalSource,
          destination: originalDest,
          finalDestination: isLoop ? 'LOOP' : pathTrace[pathTrace.length - 1],
          hopCount,
          finalStatus,
          type: isProductCategory ? 'Product Category' : isProduct ? 'Product' : isRental ? 'Rental' : 'Blog'
        });
      }
    });

    console.log(`\nAudited redirects targeting product-category, products, blog, and rental pages: ${results.length}`);
    
    // Print summary table of redirects targeting specified paths
    console.log('\n| Source | Destination | Final Status | Hop Count | Type |');
    console.log('|---|---|---|---|---|');
    
    results.slice(0, 40).forEach(r => {
      console.log(`| \`${r.source}\` | \`${r.destination}\` | **${r.finalStatus}** | ${r.hopCount} | ${r.type} |`);
    });
    if (results.length > 40) {
      console.log(`| ... and ${results.length - 40} more entries | | | | |`);
    }

    // Specially verify recently added Blog Dedupe Redirects
    console.log('\n--- VERIFYING RECENTLY ADDED BLOG DEDUPE REDIRECTS ---');
    const blogDedupeSources = [
      '/portacabins-for-sale-in-hosur',
      '/affordable-prefabricated-homes-delhi',
      '/warehouse-manufacturer-in-bangalore',
      '/low-cost-porta-cabins',
      '/office-cabin-rentals-in-delhi',
      '/prefabricated-porta-cabin-in-delhi-ncr',
      '/porta-cabin-in-delhi-ncr',
      '/trusted-porta-cabin-dealer-in-delhi-ncr',
      '/porta-cabin-price-in-delhi',
      '/porta-cabin-manufacturer-in-delhi',
      '/porta-cabin-manufacturer-in-delhi-ncr',
      '/porta-cabin-manufacturer-in-bangalore',
      '/porta-cabin-size',
      '/portacabins-for-sale-in-anekal',
      '/portacabins-for-sale-in-banashankari',
      '/porta-cabins-in-bannerghatta-road',
      '/portacabins-for-sale-in-bellandur',
      '/portacabins-for-sale-in-btm-layout',
      '/portacabins-for-sale-in-domlur',
      '/portacabins-for-sale-in-electronic-city',
      '/portacabins-for-sale-in-hebbal',
      '/portacabins-for-sale-in-hsr-layout',
      '/portacabins-for-sale-in-jayanagar',
      '/portacabins-for-sale-in-jigani',
      '/portacabins-for-sale-in-jp-nagar',
      '/portacabins-for-sale-in-kengeri',
      '/portacabins-for-sale-in-koramangala',
      '/portacabins-for-sale-in-malleshwaram',
      '/portacabins-for-sale-in-marathahalli',
      '/portacabins-for-sale-in-nagarbhavi',
      '/portacabins-for-sale-in-peenya',
      '/portacabins-for-sale-in-rajajinagar',
      '/portacabins-for-sale-in-rt-nagar',
      '/portacabins-for-sale-in-sarjapur-road',
      '/portacabins-for-sale-in-ulsoor',
      '/portacabins-for-sale-in-vijayanagar',
      '/porta-cabins-in-whitefield',
      '/portacabins-for-sale-in-yelahanka',
      '/portable-cabin-suppliers-in-bangalore',
      '/portable-cabins-for-sale-in-bangalore-option',
      '/portable-cabin-solutions-in-hennur',
      '/trusted-porta-cabins-in-shivajinagar'
    ];

    let blogDedupePassed = true;
    console.log('\n| Source (Blog Dedupe) | Destination | Final Status | Hop Count |');
    console.log('|---|---|---|---|');
    
    blogDedupeSources.forEach(src => {
      const srcNormalized = src.toLowerCase().replace(/\/$/, '');
      const match = redirects.find(r => r.source.toLowerCase().replace(/\/$/, '') === srcNormalized);
      
      if (match) {
        let currentSrc = srcNormalized;
        let currentDest = match.destination.toLowerCase().replace(/\/$/, '');
        let hopCount = 1;
        let pathTrace = [currentSrc];
        let status = 'OK';
        
        while (redirectMap[currentDest]) {
          const nextDest = redirectMap[currentDest];
          if (pathTrace.includes(currentDest)) {
            status = 'LOOP DETECTED';
            blogDedupePassed = false;
            break;
          }
          pathTrace.push(currentDest);
          currentDest = nextDest;
          hopCount++;
          status = 'CHAIN DETECTED';
          blogDedupePassed = false;
        }
        
        console.log(`| \`${src}\` | \`${match.destination}\` | **${status}** | ${hopCount} |`);
      } else {
        console.log(`| \`${src}\` | *Not Found in Active Redirects* | **WARN** | - |`);
      }
    });

    console.log('\n--- SANITY CHECK SUMMARY ---');
    console.log(`Total issues identified: ${issueCount}`);
    if (issueCount === 0 && blogDedupePassed) {
      console.log('🎉 ALL REDIRECTS PASSED SANITY CHECK! NO LOOPS, NO CHAINS, NO ISSUES FOUND!');
    } else {
      console.error('❌ REDIRECT ISSUES IDENTIFIED (See details above)');
    }

  } catch (error) {
    console.error('Sanity check failed to execute:', error);
  }
}

main();
