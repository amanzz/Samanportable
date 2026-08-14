import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';

import type { CalculatorConfig, CalculatorEstimate, EstimateLine } from '@/lib/cabinCalculatorSSR';
import {
  CANONICAL_CABIN_WARRANTY,
  ESTIMATE_CONTACTS,
  ESTIMATE_DELIVERY_AND_TURNAROUND,
  ESTIMATE_VALIDITY,
  GENERAL_ESTIMATE_DISCLOSURE,
} from '@/lib/cabinEstimateCopy';
import { GST_RATE } from '@/lib/taxRates';

export type DocumentProductMode = 'selected' | 'general';
export type ValidityState = 'D1' | 'D2' | 'D3' | 'D4';

export interface CabinEstimateDocumentInput {
  config: CalculatorConfig;
  estimate: CalculatorEstimate;
  productName: string;
  documentProductMode: DocumentProductMode;
  showGeneralDisclosure: boolean;
  generatedAt?: Date;
}

export interface SelectedValidityLine {
  key: ValidityState;
  text: string;
  characterCount: number;
  transportIncluded: boolean;
  installationIncluded: boolean;
}

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const money = (value: number): string => `INR ${INR.format(Math.round(value))}`;
const qty = (value: number): string => Number.isInteger(value) ? String(value) : value.toLocaleString('en-IN', { maximumFractionDigits: 2 });

export function selectEstimateValidityLine(estimate: CalculatorEstimate): SelectedValidityLine {
  const transportIncluded = Boolean(estimate.transportNote)
    || estimate.lines.some((line) => line.label.startsWith('Transport '));
  const installationIncluded = estimate.lines.some((line) => line.label.startsWith('Installation'));
  const key: ValidityState = transportIncluded
    ? installationIncluded ? 'D2' : 'D3'
    : installationIncluded ? 'D4' : 'D1';
  const text = ESTIMATE_VALIDITY[`line${key}`];
  return { key, text, characterCount: text.length, transportIncluded, installationIncluded };
}

function documentFilenamePart(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general';
}

export function cabinEstimateFilename(input: CabinEstimateDocumentInput): string {
  const date = (input.generatedAt || new Date()).toISOString().slice(0, 10);
  const product = input.documentProductMode === 'selected'
    ? documentFilenamePart(input.productName)
    : 'general';
  return `saman-estimate-${product}-${input.config.length}x${input.config.width}-ft-${date}.pdf`;
}

function lineRate(line: EstimateLine): string {
  if (line.unitRate == null || line.amount === null) return 'Confirmed in quotation';
  const basis = line.rateBasis === 'sq ft' ? '/ sq ft'
    : line.rateBasis === 'each' ? '/ each'
      : line.rateBasis === 'cabin' ? '/ cabin'
        : '/ configuration';
  return `${money(line.unitRate)} ${basis}`;
}

export async function buildCabinEstimatePdf(input: CabinEstimateDocumentInput): Promise<Buffer> {
  const { config, estimate } = input;
  const generatedAt = input.generatedAt || new Date();
  const validity = selectEstimateValidityLine(estimate);
  const doc = new PDFDocument({ size: 'A4', margins: { top: 44, right: 44, bottom: 44, left: 44 }, compress: true, info: {
    Title: 'SAMAN Portable Estimate',
    Author: 'SAMAN Portable Office Solutions',
    CreationDate: generatedAt,
  } });
  const chunks: Buffer[] = [];
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const left = 44;
  const pageWidth = doc.page.width - 88;
  const ink = '#16223A';
  const muted = '#546174';
  const rule = '#D9DEE7';
  const accent = '#B97816';

  const ensureSpace = (height: number) => {
    if (doc.y + height > doc.page.height - 44) doc.addPage();
    doc.x = left;
  };
  const sectionHeading = (text: string) => {
    ensureSpace(38);
    doc.moveDown(0.8).font('Helvetica-Bold').fontSize(10).fillColor(accent).text(text.toUpperCase(), left, doc.y, { width: pageWidth, characterSpacing: 0.7 });
    doc.moveDown(0.25).strokeColor(rule).lineWidth(0.7).moveTo(left, doc.y).lineTo(left + pageWidth, doc.y).stroke();
    doc.moveDown(0.45);
    doc.x = left;
  };
  const keyValue = (key: string, value: string) => {
    ensureSpace(22);
    const y = doc.y;
    doc.font('Helvetica').fontSize(9).fillColor(muted).text(key, left, y, { width: 112 });
    doc.font('Helvetica-Bold').fillColor(ink).text(value, left + 112, y, { width: pageWidth - 112 });
    doc.x = left;
    doc.y = Math.max(doc.y, y + 15);
  };

  doc.font('Helvetica-Bold').fontSize(22).fillColor(ink).text('SAMAN Portable Estimate', left, doc.y, { width: pageWidth });
  doc.moveDown(0.3).font('Helvetica').fontSize(9).fillColor(muted)
    .text(`Generated ${generatedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}`, left, doc.y, { width: pageWidth });

  sectionHeading('Configuration');
  if (input.documentProductMode === 'selected') keyValue('Product', input.productName);
  keyValue('Size', `${config.length} x ${config.width} ft`);
  keyValue('Floor area', `${estimate.areaSqft.toLocaleString('en-IN')} sq ft`);
  if (input.showGeneralDisclosure) {
    ensureSpace(40);
    doc.moveDown(0.2);
    const disclosureY = doc.y;
    doc.roundedRect(left, disclosureY, pageWidth, 31, 4).fill('#F5F7FA');
    doc.fillColor(ink).font('Helvetica').fontSize(8.5)
      .text(GENERAL_ESTIMATE_DISCLOSURE, left + 10, disclosureY + 10, { width: pageWidth - 20, lineGap: 1 });
    doc.x = left;
    doc.y = disclosureY + 38;
  }

  sectionHeading('Itemised estimate');
  const columns = { item: 250, quantity: 54, rate: 117, amount: pageWidth - 421 };
  const tableHeader = () => {
    const y = doc.y;
    doc.rect(left, y, pageWidth, 22).fill(ink);
    let x = left + 7;
    [['Item', columns.item], ['Qty', columns.quantity], ['Rate', columns.rate], ['Amount', columns.amount]].forEach(([label, width]) => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF').text(String(label), x, y + 7, { width: Number(width) - 10, align: label === 'Item' ? 'left' : 'right' });
      x += Number(width);
    });
    doc.x = left;
    doc.y = y + 22;
  };
  const tableRow = (label: string, quantity: string, rate: string, amount: string) => {
    const widths = [columns.item, columns.quantity, columns.rate, columns.amount];
    const values = [label, quantity, rate, amount];
    const heights = values.map((value, index) => doc.heightOfString(value, { width: widths[index] - 12, align: index === 0 ? 'left' : 'right' }));
    const height = Math.max(25, Math.max(...heights) + 12);
    if (doc.y + height > doc.page.height - 44) {
      doc.addPage();
      tableHeader();
    }
    const y = doc.y;
    let x = left;
    doc.rect(x, y, pageWidth, height).fillAndStroke('#FFFFFF', rule);
    values.forEach((value, index) => {
      doc.font(index === 0 ? 'Helvetica' : 'Helvetica').fontSize(8).fillColor(ink)
        .text(value, x + 6, y + 6, { width: widths[index] - 12, align: index === 0 ? 'left' : 'right' });
      x += widths[index];
    });
    doc.x = left;
    doc.y = y + height;
  };
  tableHeader();
  estimate.lines.forEach((line) => tableRow(
    line.documentLabel || line.label,
    qty(line.quantity || 1),
    lineRate(line),
    line.amount === null ? 'Confirmed in quotation' : money(line.amount),
  ));
  if (estimate.transportNote) {
    const included = estimate.transportNote === 'Free delivery zone';
    tableRow('Transport', qty(config.quantity), included ? 'Included' : 'Confirmed in quotation', included ? 'Included' : 'Confirmed in quotation');
  }

  ensureSpace(82);
  doc.moveDown(0.5);
  const totalLine = (label: string, value: string, strong = false) => {
    const y = doc.y;
    doc.font(strong ? 'Helvetica-Bold' : 'Helvetica').fontSize(strong ? 11 : 9).fillColor(strong ? ink : muted).text(label, left + 270, y, { width: 150, align: 'right' });
    doc.font('Helvetica-Bold').fillColor(ink).text(value, left + 420, y, { width: pageWidth - 420, align: 'right' });
    doc.x = left;
    doc.y = y + (strong ? 20 : 16);
  };
  totalLine('Total ex-GST', estimate.quoteOnly ? 'Confirmed in quotation' : money(estimate.totalExGst));
  totalLine(`GST at ${GST_RATE * 100}%`, estimate.quoteOnly ? 'Confirmed in quotation' : money(estimate.gst));
  totalLine('Total inclusive', estimate.quoteOnly ? 'Confirmed in quotation' : money(estimate.totalInclGst), true);

  sectionHeading('Estimate validity');
  [ESTIMATE_VALIDITY.lineA, ESTIMATE_VALIDITY.lineB, ESTIMATE_VALIDITY.lineC, validity.text].forEach((line) => {
    ensureSpace(30);
    doc.font('Helvetica').fontSize(8.7).fillColor(ink).text(line, { lineGap: 2 });
    doc.moveDown(0.35);
  });

  sectionHeading('Warranty');
  doc.font('Helvetica').fontSize(8.7).fillColor(ink).text(CANONICAL_CABIN_WARRANTY, { lineGap: 2 });
  sectionHeading('Delivery and quotation');
  doc.font('Helvetica').fontSize(8.7).fillColor(ink).text(ESTIMATE_DELIVERY_AND_TURNAROUND, { lineGap: 2 });
  sectionHeading('Contacts');
  ESTIMATE_CONTACTS.forEach((contact) => {
    ensureSpace(22);
    const y = doc.y;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(ink).text(contact.unit, left, y, { width: 155 });
    doc.font('Helvetica').text(`${contact.phone}  ${contact.email}`, left + 155, y, { width: pageWidth - 155 });
    doc.x = left;
    doc.y = y + 15;
  });

  doc.end();
  return finished;
}
