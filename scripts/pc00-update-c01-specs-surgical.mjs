// Surgical raw-string edit of c01-specifications.json's porta-cabins `diagram`
// field -> `diagrams` (2) + `diagramsIntro`. The file uses CRLF line endings;
// JSON.parse/stringify would silently flatten every line to LF and produce a
// spurious full-file diff, so this edits the exact substring in place instead,
// preserving every other byte (including line endings) untouched.
import fs from 'node:fs';

const PATH = 'src/data/products/c01-specifications.json';
const raw = fs.readFileSync(PATH, 'utf8');

const oldBlock = '"diagram": {\r\n        "src": "/images/products/porta-cabins/diagrams/saman-porta-cabin-build-anatomy.webp",\r\n        "alt": "Exploded diagram of porta cabin layers from MS chassis to corrugated roof with labelled thicknesses",\r\n        "caption": "SAMAN porta cabin build anatomy — Illustrative, not for construction. Source: SP-PC-HUB-01-TS-R1.",\r\n        "width": 1672,\r\n        "height": 941\r\n      },';

const count = raw.split(oldBlock).length - 1;
if (count !== 1) throw new Error(`expected exactly 1 occurrence, found ${count}`);

const newBlock = '"diagramsIntro": "The two diagrams below show where the specification is actually made or lost. The first covers the frame joint and the sheet seal, which decide squareness and weather performance. The second covers the window seal and the circuit split, which decide how the cabin behaves once it is powered on site.",\r\n      "diagrams": [\r\n        {\r\n          "src": "/images/products/porta-cabins/specifications/porta-cabin-diagram-1-frame-and-sheet-assembly.webp",\r\n          "alt": "SAMAN diagram of porta cabin frame assembly: align and clamp, tack and weld, then seal the sheet",\r\n          "caption": "Detail 01 - frame and corrugated sheet assembly. Buyer-facing diagram; approved shop drawings and qualified welding procedures govern fabrication.",\r\n          "width": 1920,\r\n          "height": 1080\r\n        },\r\n        {\r\n          "src": "/images/products/porta-cabins/specifications/porta-cabin-diagram-2-window-electrical-fan.webp",\r\n          "alt": "SAMAN diagram of window sealing, distribution board circuits and fan installation checks",\r\n          "caption": "Detail 02 - window, electrical and fan installation. Buyer-facing diagram; the approved electrical drawing, final load schedule and licensed installation govern execution.",\r\n          "width": 1920,\r\n          "height": 1080\r\n        }\r\n      ],';

const updated = raw.replace(oldBlock, newBlock);
fs.writeFileSync(PATH, updated, 'utf8');

// sanity: valid JSON, and the change is scoped
JSON.parse(updated);
console.log('c01-specifications.json updated surgically, JSON still valid.');
