const nextConfig = require('../next.config.js');

const EXPECTED_C06 = new Map([
  ['/product/labor-colony/', '/product/labor-colony'],
  ['/product/labor-colony/prefab-labor-sheds', '/product/labor-colony/labor-sheds'],
  ['/product/labor-colony/prefab-labor-hutments', '/product/labor-colony/labor-hutments'],
  ['/product/labor-colony/labor-camps', '/product/labor-colony/prefab-labor-camps'],
  ['/product/labor-colony/labor-accommodations', '/product/labor-colony'],
  ['/product/labor-colony/labor-cottages', '/product/labor-colony'],
  ['/product/labor-colony/labor-shelters', '/product/labor-colony'],
  ['/product/labor-colony/prefab-labour-colony', '/product/labor-colony'],
  ['/product-category/labor-colony', '/product/labor-colony'],
]);

const REPOINTED_TO_HUB = [
  '/project/bunkhouse-for-rent',
  '/project/bunkhouse-for-sale',
  '/project/portable-bunkhouse',
  '/project/prefab-labour-colony-in-bangalore',
];

function pathname(value) {
  try {
    return new URL(value, 'https://www.samanportable.com').pathname;
  } catch {
    return '';
  }
}

function isLiteral(source) {
  return (
    typeof source === 'string' &&
    !source.includes(':') &&
    !source.includes('*')
  );
}

async function main() {
  const redirects = await nextConfig.redirects();
  const firstLiteralBySource = new Map();
  for (const redirect of redirects) {
    if (isLiteral(redirect.source) && !firstLiteralBySource.has(redirect.source)) {
      firstLiteralBySource.set(redirect.source, redirect);
    }
  }

  const c06 = [];
  const errors = [];
  for (const [source, expectedDestination] of EXPECTED_C06) {
    const rule = firstLiteralBySource.get(source);
    const actualDestination = pathname(rule?.destination);
    const statusCode = rule?.statusCode || (rule?.permanent ? 308 : 307);
    c06.push({ source, statusCode, destination: actualDestination });
    if (!rule) errors.push(`${source}: missing`);
    if (statusCode !== 301) errors.push(`${source}: expected 301, got ${statusCode}`);
    if (actualDestination !== expectedDestination) {
      errors.push(`${source}: expected ${expectedDestination}, got ${actualDestination || 'none'}`);
    }
  }

  const chains = [];
  for (const [source, redirect] of firstLiteralBySource) {
    const destination = pathname(redirect.destination);
    if (!destination || destination === source) continue;
    const nextRule = firstLiteralBySource.get(destination);
    if (nextRule) {
      chains.push({
        source,
        via: destination,
        final: pathname(nextRule.destination),
      });
    }
  }

  const repointed = REPOINTED_TO_HUB.map((source) => ({
    source,
    destination: pathname(firstLiteralBySource.get(source)?.destination),
  }));
  for (const item of repointed) {
    if (item.destination !== '/product/labor-colony') {
      errors.push(`${item.source}: still targets ${item.destination || 'nothing'}`);
    }
  }

  const relevantChains = chains.filter(
    (chain) =>
      EXPECTED_C06.has(chain.source) ||
      EXPECTED_C06.has(chain.via) ||
      REPOINTED_TO_HUB.includes(chain.source)
  );
  if (relevantChains.length) {
    errors.push(`C-06 chain count: ${relevantChains.length}`);
  }

  console.log(JSON.stringify({
    c06,
    repointed,
    siteWideLiteralChains: chains,
    c06RelevantChains: relevantChains,
    errors,
  }, null, 2));

  if (process.argv.includes('--assert') && errors.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
