// One-off converter: draft v2.0 Description tab (markdown) -> descriptionHtml string.
// Reads directly from the source file so copy stays byte-exact; only structural
// markdown syntax is translated to the site's existing HTML convention.
import fs from 'node:fs';

const SRC = 'D:\\Project-shekhar\\all-product-images\\Hub page (Container Offices)\\container-offices\\CO-00-container-offices-draft-v2.0.md';
const text = fs.readFileSync(SRC, 'utf8');
const lines = text.split(/\r?\n/);

// Description tab body: line 305 ("## What a container office...") through line 505
// (end of "New build or refurbished shell" section), 1-indexed in the editor.
const startIdx = lines.findIndex(l => l.trim() === '## What a container office is, and what it is not');
const endMarkerIdx = lines.findIndex(l => l.trim() === '#### Description tab, measured counts');
if (startIdx === -1 || endMarkerIdx === -1) throw new Error('markers not found');
const body = lines.slice(startIdx, endMarkerIdx).filter(l => l.trim() !== '---');

// Explicit image placement: Nth image markdown line (in document order) -> real output file.
const IMAGES = [
  { file: 'co-00-container-office-10x10-midnight-navy-finished-16x9.webp', w: 1600, h: 900 },
  { file: 'co-00-container-office-20x8-graphite-charcoal-finished-16x9.webp', w: 1600, h: 900 },
  { file: 'co-00-container-office-30x10-burnt-terracotta-finished-16x9.webp', w: 1600, h: 900 },
  { file: 'co-00-container-office-40x8-deep-burgundy-finished-16x9.webp', w: 1600, h: 900 },
  { file: 'co-00-container-office-40x10-pearl-white-finished-16x9.webp', w: 1280, h: 720 },
];
let imageCursor = 0;

function inlineMd(s) {
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, txt, url) => {
    const href = url.startsWith('http') ? url : `https://www.samanportable.com${url}`;
    return `<a href="${href}">${txt}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return s;
}

let html = '';
let i = 0;
let inFaqSection = false;
let pendingFaqQuestion = null;

while (i < body.length) {
  const raw = body[i];
  const line = raw.trim();

  if (line === '') { i++; continue; }

  if (line.startsWith('## ')) {
    const heading = line.slice(3).trim();
    inFaqSection = heading === 'Questions buyers ask before ordering';
    html += `<h2>${inlineMd(heading)}</h2>`;
    i++; continue;
  }

  if (line.startsWith('### ')) {
    const heading = line.slice(4).trim();
    if (inFaqSection) {
      pendingFaqQuestion = heading;
      html += `<h4><strong>${inlineMd(heading)}</strong></h4>`;
    } else {
      html += `<h3>${inlineMd(heading)}</h3>`;
    }
    i++; continue;
  }

  if (line.startsWith('![')) {
    const img = IMAGES[imageCursor++];
    const altMatch = line.match(/^!\[([^\]]*)\]/);
    const alt = altMatch ? altMatch[1] : '';
    html += `<img src="/images/products/container-offices/description/${img.file}" width="${img.w}" height="${img.h}" loading="lazy" alt="${alt}">`;
    i++; continue;
  }

  if (line.startsWith('|')) {
    // table block: collect contiguous | lines
    const tblLines = [];
    while (i < body.length && body[i].trim().startsWith('|')) {
      tblLines.push(body[i].trim());
      i++;
    }
    const rows = tblLines.map(l => l.slice(1, l.endsWith('|') ? -1 : undefined).split('|').map(c => c.trim()));
    const header = rows[0];
    const dataRows = rows.slice(2); // skip header + separator row
    html += '<table><thead><tr>' + header.map(h => `<th>${inlineMd(h)}</th>`).join('') + '</tr></thead><tbody>' +
      dataRows.map(r => '<tr>' + r.map(c => `<td>${inlineMd(c)}</td>`).join('') + '</tr>').join('') +
      '</tbody></table>';
    continue;
  }

  if (line.startsWith('- ')) {
    const items = [];
    while (i < body.length && body[i].trim().startsWith('- ')) {
      items.push(body[i].trim().slice(2).trim());
      i++;
    }
    html += '<ul>' + items.map(it => `<li>${inlineMd(it)}</li>`).join('') + '</ul>';
    continue;
  }

  if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
    html += `<p><em>${inlineMd(line.slice(1, -1))}</em></p>`;
    i++; continue;
  }

  if (line.startsWith('**') ) {
    // bold-lead paragraph, e.g. "**Why this is a table.** ..."
    html += `<p>${inlineMd(line)}</p>`;
    i++; continue;
  }

  // plain paragraph
  html += `<p>${inlineMd(line)}</p>`;
  i++;
}

fs.writeFileSync('scripts/co00-description-v2-output.html', html, 'utf8');
const wordCount = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
console.log('images placed:', imageCursor, '/ 5');
console.log('html length:', html.length);
console.log('approx word count (incl markup-stripped headings/table cells):', wordCount);
