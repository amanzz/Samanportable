const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const RETIRED_SLUGS = [
  'labor-accommodations',
  'labor-camps',
  'labor-cottages',
  'labor-shelters',
  'prefab-labor-hutments',
  'prefab-labor-sheds',
];

function registerTsLoader() {
  const originalResolve = Module._resolveFilename;
  Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
    if (request.startsWith('@/')) {
      return originalResolve.call(this, path.join(ROOT, 'src', request.slice(2)), parent, isMain, options);
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };

  require.extensions['.ts'] = function compileTs(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
        esModuleInterop: true,
      },
      fileName: filename,
    }).outputText;
    module._compile(output, filename);
  };
}

registerTsLoader();

const staticContent = require(path.join(ROOT, 'src', 'lib', 'staticContent.ts'));
const merchant = require(path.join(ROOT, 'src', 'lib', 'merchantFeed.ts'));
const localInventory = require(path.join(ROOT, 'src', 'lib', 'localInventoryFeed.ts'));

const RETIRED_HREF_PATTERN =
  /href=["'](?:https:\/\/www\.samanportable\.com)?(?:\/product\/labor-colony\/(?:prefab-labor-sheds|prefab-labor-hutments|labor-camps|labor-accommodations|labor-cottages|labor-shelters|prefab-labour-colony)|\/product-category\/labor-colony)(?=["'?#])/g;
const WINNER_SLUGS = ['labor-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps'];

function countRetiredHrefs(html) {
  return Array.from(String(html || '').matchAll(RETIRED_HREF_PATTERN)).length;
}

function visibleText(html) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const sourceProducts = staticContent.getAllProductsForFeed();
  const retiredProducts = sourceProducts.filter((product) => RETIRED_SLUGS.includes(product.slug));
  const retiredIds = new Set(retiredProducts.map((product) => String(product.id)));
  const { items: merchantItems } = merchant.buildMerchantProducts(sourceProducts);
  const retiredMerchantItems = merchantItems.filter((item) => retiredIds.has(item.id));
  const retiredLocalRows = localInventory
    .buildLocalInventoryRows(sourceProducts)
    .filter((row) => retiredIds.has(row.id));

  const winnerLinks = [];
  for (const slug of WINNER_SLUGS) {
    const raw = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src', 'data', 'wp-export', 'products', `${slug}.json`), 'utf8')
    ).description || '';
    const rendered = (await staticContent.fetchProductDescription(slug))?.description || '';
    winnerLinks.push({
      slug,
      sourceRetiredHrefs: countRetiredHrefs(raw),
      renderedRetiredHrefs: countRetiredHrefs(rendered),
      visibleTextUnchanged: visibleText(raw) === visibleText(rendered),
    });
  }

  const blogPost = await staticContent.fetchBlogPost('why-labor-camps-are-essential');
  const result = {
    retiredSourceProducts: retiredProducts.map((product) => ({
      id: String(product.id),
      slug: product.slug,
      price: product.price,
    })),
    merchantItems: retiredMerchantItems.map((item) => ({
      id: item.id,
      link: item.link,
      price: item.price,
    })),
    localInventoryRows: retiredLocalRows.map((row) => ({
      id: row.id,
      store_code: row.store_code,
      price: row.price,
    })),
    winnerLinks,
    remainingBlogRetiredHrefs: countRetiredHrefs(blogPost?.content?.rendered),
  };

  console.log(JSON.stringify(result, null, 2));

  if (process.argv.includes('--assert-retired-absent')) {
    const remaining =
      result.retiredSourceProducts.length +
      result.merchantItems.length +
      result.localInventoryRows.length +
      result.remainingBlogRetiredHrefs +
      result.winnerLinks.reduce((sum, winner) => sum + winner.renderedRetiredHrefs, 0);
    const changedVisibleText = result.winnerLinks.filter((winner) => !winner.visibleTextUnchanged);
    if (remaining > 0 || changedVisibleText.length > 0) {
      console.error(
        `C-06 audit failed: remaining=${remaining}, visibleTextChanged=${changedVisibleText.length}`
      );
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
