import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packPath = path.join(root, 'page-structure', 'content-drafts', 'C06-CONTENT-PACK-4pages-31Jul2026.md');
const pack = fs.readFileSync(packPath, 'utf8');
const addendumPath = path.join(root, 'page-structure', 'content-drafts', 'C06-PACK-ADDENDUM-REV1-31Jul2026.md');
const addendum = fs.readFileSync(addendumPath, 'utf8');
const imageReportPath = path.join(root, 'page-structure', 'c06-image-processing-report.json');
const publishedDimensions = new Map();
if (fs.existsSync(imageReportPath)) {
  const report = JSON.parse(fs.readFileSync(imageReportPath, 'utf8'));
  for (const image of report.images || []) {
    publishedDimensions.set(`/${image.target.replace(/^public\//, '')}`, image.targetDimensions);
  }
}

const pages = [
  {
    marker: '# PAGE: Labour Colony (hub)',
    slug: 'labor-colony',
    productName: 'Labour Colony (Labor Colony)',
    productSku: 'SP-90-24-LC-24',
  },
  {
    marker: '# PAGE: Labor Sheds',
    slug: 'labor-sheds',
    productName: 'Labor Sheds',
    productSku: 'CC-50-LS-2024',
  },
  {
    marker: '# PAGE: Labor Hutments',
    slug: 'labor-hutments',
    productName: 'Labor Hutments',
    productSku: 'SP-90-LH-2024',
  },
  {
    marker: '# PAGE: Prefab Labor Camps',
    slug: 'prefab-labor-camps',
    productName: 'Prefab Labor Camps',
    productSku: 'SP-90-PLC-2024',
  },
];

const hubVideo = {
  embedSrc: 'https://www.youtube-nocookie.com/embed/Q41RYemNB_E?autoplay=1',
  embedUrl: 'https://www.youtube-nocookie.com/embed/Q41RYemNB_E',
  posterSrc: '/images/products/labor-colony/120x24-gplus1/labor-colony-120x24-gplus1-exact-front-elevation.webp',
  posterAlt: 'Labour Colony for Construction Sites | SAMAN Portable Worker Accommodation',
  title: 'Labour Colony for Construction Sites | SAMAN Portable Worker Accommodation',
  schemaDescription: 'Walk through a completed labour colony built by SAMAN Portable for a live industrial project.',
  schemaThumbnailUrl: 'https://i.ytimg.com/vi/Q41RYemNB_E/hqdefault.jpg',
  uploadDate: '2026-07-27T02:22:28-07:00',
  duration: 'PT2M15S',
};

const sizeSlug = (label) => label
  .toLowerCase()
  .replace(' ft ', '-')
  .replace('g+1', 'gplus1')
  .replace('g+2', 'gplus2');

const stripMd = (value) => value.trim().replace(/^`|`$/g, '').replace(/^\*\*|\*\*$/g, '');
const price = (value) => Number(value.replace(/^Rs\s*/i, '').replaceAll(',', '').trim());
const area = (value) => Number(value.replaceAll(',', '').trim());

function pageBlock(page, index) {
  const start = pack.indexOf(page.marker);
  if (start < 0) throw new Error(`Missing page marker: ${page.marker}`);
  const next = index + 1 < pages.length ? pack.indexOf(pages[index + 1].marker, start + 1) : pack.indexOf('# INTERNAL LINKING', start + 1);
  if (next < 0) throw new Error(`Missing end marker for ${page.slug}`);
  return pack.slice(start, next);
}

function requireMatch(text, regex, label) {
  const match = text.match(regex);
  if (!match) throw new Error(`Missing ${label}`);
  return match[1].trim();
}

function tableRows(section) {
  return section
    .split('\n')
    .filter((line) => line.startsWith('|') && !/^\|[-\s|]+\|$/.test(line))
    .slice(1)
    .map((line) => line.slice(1, -1).split('|').map(stripMd));
}

function sectionBetween(text, startHeading, nextHeading) {
  const start = text.indexOf(startHeading);
  if (start < 0) throw new Error(`Missing heading: ${startHeading}`);
  const end = text.indexOf(nextHeading, start + startHeading.length);
  if (end < 0) throw new Error(`Missing next heading: ${nextHeading}`);
  return text.slice(start, end);
}

function addendumDescriptionHtml(slug) {
  const marker = `### ${slug}`;
  const start = addendum.indexOf(marker);
  if (start < 0) throw new Error(`Missing addendum description: ${slug}`);
  const bodyStart = start + marker.length;
  const nextPage = addendum.indexOf('\n### ', bodyStart);
  const videoHeading = addendum.indexOf('\n## Hub video, L18', bodyStart);
  const candidates = [nextPage, videoHeading].filter((value) => value >= 0);
  const end = Math.min(...candidates);
  const paragraphs = addendum.slice(bodyStart, end).trim().split(/\n\n+/);
  if (paragraphs.length !== 3) throw new Error(`${slug}: expected 3 addendum description paragraphs`);
  return paragraphs
    .map((paragraph) => `<p>${paragraph.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')}</p>`)
    .join('');
}

function correctedComparison(slug) {
  const marker = `**${slug}:** `;
  const start = addendum.indexOf(marker);
  if (start < 0) throw new Error(`Missing corrected comparison: ${slug}`);
  return addendum.slice(start + marker.length, addendum.indexOf('\n', start)).replaceAll('**', '').trim();
}

function buildPage(page, index) {
  const block = pageBlock(page, index);
  const opener = requireMatch(
    block,
    /## Opener[^\n]*\n\n([\s\S]*?)\n\n## Size ladder/,
    `${page.slug} opener`,
  );

  const ladderSection = sectionBetween(block, '## Size ladder', '## Right-to-exist block');
  const ladder = tableRows(ladderSection).map(([label, areaSqft, workers, exGst, inclGst]) => ({
    label,
    sizeSlug: sizeSlug(label),
    dims: label,
    areaSqft: area(areaSqft),
    workers,
    priceExGst: price(exGst),
    priceInclGst: price(inclGst),
  }));
  if (ladder.length !== 6) throw new Error(`${page.slug}: expected 6 ladder rows, got ${ladder.length}`);

  const rteSection = sectionBetween(block, '## Right-to-exist block', '## Section H explorer');
  const rte = {
    heading: requireMatch(rteSection, /\*\*H2:\*\*\s*([^\n]+)/, `${page.slug} RTE heading`),
    body: requireMatch(rteSection, /\*\*Body:\*\*\s*([^\n]+)/, `${page.slug} RTE body`),
    comparison: page.slug === 'labor-colony'
      ? requireMatch(rteSection, /\*\*Comparison:\*\*\s*([^\n]+)/, `${page.slug} RTE comparison`)
      : correctedComparison(page.slug),
  };

  const explorerSection = sectionBetween(block, '## Section H explorer', '## Specifications');
  const explorerH2 = requireMatch(explorerSection, /## Section H explorer, H2:\s*([^\n]+)/, `${page.slug} explorer H2`);
  const tabRegex = /### Tab \d+:\s*([^\n]+)\n\n([\s\S]*?)\n\nUse-cases:\s*([^\n]+)/g;
  const tabs = [];
  for (const match of explorerSection.matchAll(tabRegex)) {
    tabs.push({
      title: match[1].trim(),
      body: match[2].trim(),
      applications: match[3].split('|').map((item) => item.trim()),
    });
  }
  if (tabs.length !== 6) throw new Error(`${page.slug}: expected 6 explorer tabs, got ${tabs.length}`);

  const specsSection = sectionBetween(block, '## Specifications', '## Images');
  const specifications = tableRows(specsSection).map(([group, component, detail]) => ({ group, component, detail }));
  if (specifications.length !== 30) throw new Error(`${page.slug}: expected 30 specification rows, got ${specifications.length}`);

  const imagesSection = block.slice(block.indexOf('## Images'));
  const images = tableRows(imagesSection).map(([size, sourceFolder, sourceViewToken, filename, slot, alt]) => ({
    size,
    sizeSlug: sizeSlug(size),
    sourceFolder,
    sourceViewToken,
    filename,
    slot,
    alt,
  }));
  if (images.length !== 36) throw new Error(`${page.slug}: expected 36 image rows, got ${images.length}`);

  const explorer = { h2: explorerH2 };
  const variants = ladder.map((entry, variantIndex) => {
    const variantImages = images.filter((image) => image.sizeSlug === entry.sizeSlug);
    if (variantImages.length !== 6) throw new Error(`${page.slug}/${entry.sizeSlug}: expected 6 images`);
    const sectionImage = variantImages.find((image) => image.slot === 'section2');
    const gallery = variantImages.filter((image) => image.slot === 'gallery');
    if (!sectionImage || gallery.length !== 5) throw new Error(`${page.slug}/${entry.sizeSlug}: expected 1 section2 + 5 gallery`);
    const tab = tabs[variantIndex];
    explorer[entry.sizeSlug] = {
      h2: tab.title,
      intro: tab.body,
      h3: 'Use-cases',
      applications: tab.applications,
      imageAlt: sectionImage.alt,
    };
    return {
      sizeSlug: entry.sizeSlug,
      label: entry.label,
      dims: entry.dims,
      areaSqft: entry.areaSqft,
      priceExGst: entry.priceExGst,
      priceInclGst: entry.priceInclGst,
      capacity: `${entry.workers} workers`,
      useCase: tab.applications[0],
      sku: page.productSku,
      images: gallery.map((image) => {
        const src = `/images/products/${page.slug}/${entry.sizeSlug}/${image.filename}`;
        const [width, height] = publishedDimensions.get(src) || [1200, 1200];
        return { src, alt: image.alt, provenance: 'render', width, height };
      }),
    };
  });

  const explorerImageTemplate = Object.fromEntries(
    images
      .filter((image) => image.slot === 'section2')
      .map((image) => [image.sizeSlug, `/images/products/${page.slug}/${image.sizeSlug}/${image.filename}`]),
  );

  const descriptionHtml = addendumDescriptionHtml(page.slug);

  return {
    page,
    opener,
    rte,
    specifications,
    images,
    explorer,
    product: {
      productSlug: page.slug,
      productName: page.productName,
      variantAxis: 'size',
      defaultVariant: '120x24-gplus1',
      hsn: '9406',
      gstPercent: 18,
      applicationsDataset: page.slug,
      explorerImageTemplate,
      emitAggregateOffer: true,
      productSku: page.productSku,
      specPdfHref: `/specs/${page.slug}-technical-specification.pdf`,
      priceCaption: 'Base specification price, customisations quoted separately.',
      opener,
      descriptionHtml,
      ...(page.slug === 'labor-colony' ? { hasProductVideo: true, video: hubVideo } : {}),
      variants,
    },
  };
}

const built = pages.map(buildPage);
const hubSpecs = new Map(built[0].specifications.map((row) => [row.component, row.detail]));
const c06Specifications = {
  products: Object.fromEntries(built.map(({ page, specifications }) => [
    page.slug,
    {
      name: page.productName,
      specifications: specifications.map((row) => ({
        ...row,
        differsFromHub: page.slug === 'labor-colony' ? false : hubSpecs.get(row.component) !== row.detail,
      })),
    },
  ])),
};

for (const { page, product } of built) {
  fs.writeFileSync(
    path.join(root, 'src', 'data', 'products', `${page.slug}.json`),
    `${JSON.stringify(product, null, 2)}\n`,
  );
}

const explorerPath = path.join(root, 'src', 'data', 'products', 'section-h-datasets.json');
const explorerData = JSON.parse(fs.readFileSync(explorerPath, 'utf8'));
for (const { page, explorer } of built) explorerData[page.slug] = explorer;
fs.writeFileSync(explorerPath, `${JSON.stringify(explorerData, null, 2)}\n`);

fs.writeFileSync(
  path.join(root, 'src', 'data', 'products', 'c06-specifications.json'),
  `${JSON.stringify(c06Specifications, null, 2)}\n`,
);

fs.writeFileSync(
  path.join(root, 'page-structure', 'c06-generated-manifest.json'),
  `${JSON.stringify({
    sourcePack: path.relative(root, packPath).replaceAll('\\', '/'),
    sourceAddendum: path.relative(root, addendumPath).replaceAll('\\', '/'),
    generatedAt: '2026-07-31',
    pages: built.map(({ page, opener, rte, images }) => ({ slug: page.slug, opener, rte, images })),
  }, null, 2)}\n`,
);

console.log(`Generated ${built.length} product datasets, 24 variants, ${built.reduce((sum, item) => sum + item.images.length, 0)} image records and ${built.reduce((sum, item) => sum + item.specifications.length, 0)} specification rows.`);
