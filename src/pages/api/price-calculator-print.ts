import { NextApiRequest, NextApiResponse } from 'next';
import {
  CalculatorProductId,
  PriceCalculatorEstimate,
  PriceCalculatorFormState,
  PriceCalculatorPrintPayload,
  CUSTOM_PRODUCT_ID,
  formatAddOnsForLeadPayload,
  sanitizeSelectedAddOns,
  ZONE_CONTACTS,
  buildPrintDate,
  getEstimateFromInput,
  safeEstimateRefToken,
  safeFileSlug,
  STANDARD_PRODUCTS,
} from '@/lib/price-calculator-config';

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatCurrency = (value: number): string => `Rs.${Math.round(value || 0).toLocaleString('en-IN')}`;

const getBodyObject = (body: unknown): Record<string, unknown> => {
  if (!body) {
    return {};
  }
  if (typeof body === 'object') {
    return body as Record<string, unknown>;
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
};

const normalisePayload = (rawBody: Record<string, unknown>): PriceCalculatorFormState | null => {
  const root = { ...rawBody };
  const payloadField = rawBody.payload;
  if (typeof payloadField === 'string') {
    const nested = getBodyObject(payloadField);
    if (Object.keys(nested).length > 0) {
      for (const [key, value] of Object.entries(nested)) {
        root[key] = value;
      }
    }
  }

  if (typeof root.productId !== 'string' || typeof root.zone !== 'string') {
    return null;
  }

  const zone = String(root.zone);
  if (zone !== 'South' && zone !== 'North') {
    return null;
  }

  const numberOfRooms = Number(root.numberOfRooms || 0);
  const rawProductId = String(root.productId);
  const validProductId =
    rawProductId === CUSTOM_PRODUCT_ID || STANDARD_PRODUCTS.includes(rawProductId as CalculatorProductId)
      ? (rawProductId as CalculatorProductId)
      : null;
  if (!validProductId) {
    return null;
  }

  const normalizedAddOns = sanitizeSelectedAddOns(validProductId, root.selectedAddOns);

  return {
    productId: validProductId,
    zone: zone as 'South' | 'North',
    length: String(root.length || ''),
    width: String(root.width || ''),
    quantity: String(root.quantity || ''),
    materialType: String(root.materialType || 'MS Cabin'),
    internalWall: String(root.internalWall || 'MDF 8MM Internal Wall'),
    ceiling: String(root.ceiling || 'MDF 8MM Ceiling'),
    flooring: String(root.flooring || 'Vinyl Flooring'),
    windowType: String(root.windowType || 'Aluminum'),
    panelThickness: Number(root.panelThickness || 0),
    transport: String(root.transport || 'Transport required'),
    installation: String(root.installation || 'Installation required'),
    gst: String(root.gst || 'GST extra'),
    specialPanelSheet: String(root.specialPanelSheet || 'PUF / Puff 50MM') as never,
    specialFloorStructure: String(root.specialFloorStructure || 'Single Floor') as never,
    numberOfRooms: numberOfRooms > 0 ? String(numberOfRooms) : '0',
    fullName: String(root.fullName || ''),
    email: String(root.email || ''),
    mobile: String(root.mobile || ''),
    requirementNotes: String(root.requirementNotes || ''),
    selectedAddOns: normalizedAddOns,
    selectedAddOnsSummary: formatAddOnsForLeadPayload(normalizedAddOns),
  } as PriceCalculatorFormState;
};

type EstimateWithBreakdown = Exclude<PriceCalculatorEstimate, { mode: 'custom' }>;

const getProductRows = (
  estimate: EstimateWithBreakdown,
  form: PriceCalculatorFormState,
): string => {
  const isPanel = estimate.mode === 'panel';
  const areaLabel = `${estimate.area.toLocaleString('en-IN')} ${isPanel ? 'm2' : 'sq ft'}`;
  const rows = [
    `<tr><td>Product</td><td>${escapeHtml(estimate.productName)}</td><td>${escapeHtml(areaLabel)}</td></tr>`,
    `<tr><td>Length</td><td>${estimate.length}</td><td>${escapeHtml(isPanel ? 'm' : 'ft')}</td></tr>`,
    `<tr><td>Width</td><td>${estimate.width}</td><td>${escapeHtml(isPanel ? 'm' : 'ft')}</td></tr>`,
    `<tr><td>Quantity</td><td>${escapeHtml(String(estimate.quantity))}</td><td>pcs</td></tr>`,
    `<tr><td>Zone</td><td>${escapeHtml(estimate.zone || '')}</td><td>-</td></tr>`,
  ];

  if (estimate.mode === 'panel') {
    rows.push(
      `<tr><td>Panel Type</td><td>${escapeHtml(estimate.productName)}</td><td>-</td></tr>`,
      `<tr><td>Panel Thickness</td><td>${escapeHtml(String(estimate.thicknessMm))} mm</td><td>-</td></tr>`,
      `<tr><td>Panel Cost Basis</td><td>Square meter based calculation</td><td>${escapeHtml(estimate.panelRatePerSqmText)}</td></tr>`,
    );
  } else if (estimate.mode === 'special') {
    rows.push(
      `<tr><td>Panel / Sheet</td><td>${escapeHtml(form.specialPanelSheet || '')}</td><td>-</td></tr>`,
      `<tr><td>Building Floor</td><td>${escapeHtml(form.specialFloorStructure || '')}</td><td>-</td></tr>`,
      `<tr><td>Number of Rooms</td><td>${escapeHtml(form.numberOfRooms || '')}</td><td>-</td></tr>`,
      `<tr><td>Civil Scope Note</td><td>Civil work is not included in SAMAN scope unless clearly mentioned in final quotation</td><td>-</td></tr>`,
    );
  } else {
    rows.push(
      `<tr><td>Material Type</td><td>${escapeHtml(estimate.materialType || 'N/A')}</td><td>-</td></tr>`,
      `<tr><td>Internal Wall</td><td>${escapeHtml(estimate.internalWall || 'N/A')}</td><td>-</td></tr>`,
      `<tr><td>Ceiling</td><td>${escapeHtml(estimate.ceiling || 'N/A')}</td><td>-</td></tr>`,
      `<tr><td>Flooring</td><td>${escapeHtml(estimate.flooring || 'N/A')}</td><td>-</td></tr>`,
      `<tr><td>Window</td><td>${escapeHtml(estimate.windowType || 'N/A')}</td><td>-</td></tr>`,
    );
  }

  rows.push(
    `<tr><td>Requirement Notes</td><td>${escapeHtml(form.requirementNotes || 'Not provided')}</td><td>-</td></tr>`,
  );

  return rows.join('');
};

const renderEstimateSection = (estimate: EstimateWithBreakdown): string => {
  const addOnText = estimate.budgetBreakdown.addOns.items.length
    ? estimate.budgetBreakdown.addOns.items
        .map(
          (item) => {
            if (!item.isIncludedInEstimate) {
              return `${escapeHtml(item.name)}: ${escapeHtml(String(item.quantity))} nos - Quotation review required`;
            }
            return `${escapeHtml(item.name)}: ${escapeHtml(String(item.quantity))} nos (${formatCurrency(
              item.lowRange,
            )} - ${formatCurrency(item.highRange)}; Typical: ${formatCurrency(item.typicalRange)})`;
          },
        )
        .join('<br />')
    : 'No optional add-ons selected.';

  return `
    <section class="section">
      <h2 class="section-title">Budget Breakdown</h2>
      <table>
        <tr><th>Line Item</th><th>Details</th><th>Estimated Range</th></tr>
        <tr>
          <td>Base Product</td>
          <td>${escapeHtml(estimate.budgetBreakdown.base.details)}</td>
          <td>${formatCurrency(estimate.budgetBreakdown.base.lowRange)} - ${formatCurrency(estimate.budgetBreakdown.base.highRange)}</td>
        </tr>
        <tr>
          <td>Specification / Material</td>
          <td>${escapeHtml(estimate.budgetBreakdown.specification.details)}</td>
          <td>${formatCurrency(estimate.budgetBreakdown.specification.lowRange)} - ${formatCurrency(estimate.budgetBreakdown.specification.highRange)}</td>
        </tr>
        <tr>
          <td>Optional Add-ons</td>
          <td>${addOnText}</td>
          <td>Priced subtotal: ${formatCurrency(estimate.budgetBreakdown.addOns.lowRange)} - ${formatCurrency(estimate.budgetBreakdown.addOns.highRange)}</td>
        </tr>
        <tr>
          <td>GST / Transport / Installation</td>
          <td>GST: ${escapeHtml(estimate.gst)} | Transport: ${escapeHtml(estimate.transport)} | Installation: ${escapeHtml(estimate.installation)}</td>
          <td>Included</td>
        </tr>
        <tr>
          <td>Estimated Budget Range</td>
          <td>${escapeHtml(estimate.currency || 'Rs.')}</td>
          <td>${formatCurrency(estimate.lowRange)} / ${formatCurrency(estimate.typicalRange)} / ${formatCurrency(estimate.highRange)}</td>
        </tr>
      </table>
      <p class="tiny">Estimated Budget Range - Contact SAMAN for Final Quotation.</p>
    </section>
  `;
};

const renderOptionalAddons = (estimate: EstimateWithBreakdown): string => {
  const items = estimate.budgetBreakdown.addOns.items;
  if (!items.length) {
    return `
      <section class="section">
        <h2 class="section-title">Optional Add-ons Selected</h2>
        <p>No optional add-ons selected.</p>
      </section>
    `;
  }

  return `
    <section class="section">
      <h2 class="section-title">Optional Add-ons Selected</h2>
      <table>
        <tr><th>Add-on</th><th>Quantity</th><th>Budget Range</th><th>Status</th></tr>
        ${items
          .map((item) => {
            const budgetRange = item.isIncludedInEstimate
              ? `${formatCurrency(item.lowRange)} - ${formatCurrency(item.highRange)}<br />Typical: ${formatCurrency(item.typicalRange)}`
              : 'Quotation review required';
            return `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(String(item.quantity))} nos</td><td>${budgetRange}</td><td>${escapeHtml(item.statusLabel)}</td></tr>`;
          })
          .join('')}
      </table>
      <p class="tiny">Optional add-ons are subject to final specification, drawing, and quotation approval.</p>
    </section>
  `;
};

const renderBody = (payload: PriceCalculatorPrintPayload & { referenceToken: string }): string => {
  const estimate = payload.estimate;
  if (estimate.mode === 'custom') {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Estimate Not Available</title>
</head>
<body>
  <main style="font-family: Arial, Helvetica, sans-serif; padding: 24px;">
    <h1>Estimate Not Available</h1>
    <p>Printable estimate is not available for custom requirement entries.</p>
  </main>
</body>
</html>`;
  }

  const dateStamp = buildPrintDate(new Date(payload.createdAt));
  const title = `SAMAN-Estimate-${safeFileSlug(payload.productName)}-${dateStamp}`;
  const reference = `SAMAN-CALC-${dateStamp}-${payload.referenceToken}`;
  const suggestedFile = `${title}.pdf`;

  const customerRows = [
    `<tr><td>Full Name</td><td>${escapeHtml(payload.customerName)}</td></tr>`,
    `<tr><td>Email Address</td><td>${escapeHtml(payload.customerEmail)}</td></tr>`,
    `<tr><td>Mobile Number</td><td>${escapeHtml(payload.customerMobile)}</td></tr>`,
    `<tr><td>Zone</td><td>${escapeHtml(payload.zone || 'N/A')}</td></tr>`,
  ].join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #0f172a; background: #fff; font-family: Arial, Helvetica, sans-serif; line-height: 1.35; }
    .wrap { padding: 14px 16px 18px; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; border-bottom: 1px solid #d6dde8; padding-bottom: 8px; margin-bottom: 10px; }
    .title { margin: 0; color: #0f766e; font-size: 20px; }
    .meta { text-align: right; color: #4b5563; font-size: 11px; }
    .section { border: 1px solid #d6dde8; border-radius: 6px; padding: 8px 10px; margin: 10px 0; page-break-inside: avoid; }
    .section-title { margin: 0 0 6px; color: #0b5f58; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #d6dde8; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { width: 38%; background: #f8fbff; color: #0b5f58; }
    .tiny { margin: 4px 0 0; font-size: 11px; color: #0b5f58; }
    .disclaimer { border: 1px solid #dce8ef; border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #52647e; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .contact-card { border: 1px solid #d3e0e9; border-radius: 6px; padding: 7px; background: #f8fcfc; font-size: 11px; color: #243748; }
    .btn { margin-top: 10px; padding: 10px 14px; border: 0; border-radius: 8px; background: #0f766e; color: #fff; font-weight: 700; cursor: pointer; }
    .note { margin: 8px 0 0; color: #4b5563; font-size: 11px; }
    @media print { .print-only { display: none !important; } .grid2 { grid-template-columns: repeat(2, 1fr); } }
  </style>
</head>
<body>
<main class="wrap">
  <div class="top">
    <div>
      <p class="section-title" style="margin:0 0 4px;">Estimate / Budget Range</p>
      <h1 class="title">SAMAN Portable Estimate</h1>
    </div>
    <div class="meta">
      <div>Estimate Ref: ${escapeHtml(reference)}</div>
      <div>Estimate Date: ${escapeHtml(
        new Date(payload.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      )}</div>
    </div>
  </div>

  <section class="section">
    <h2 class="section-title">Customer Details</h2>
    <table>
      ${customerRows}
    </table>
  </section>

  <section class="section">
    <h2 class="section-title">Product &amp; Size</h2>
    <table>
      ${getProductRows(estimate, payload as unknown as PriceCalculatorFormState)}
    </table>
  </section>

  ${renderOptionalAddons(estimate)}

  <section class="section">
    <h2 class="section-title">Commercial Options</h2>
    <table>
      <tr><th>GST</th><td>${escapeHtml(payload.gst)}</td></tr>
      <tr><th>Transport</th><td>${escapeHtml(payload.transport)}</td></tr>
      <tr><th>Installation</th><td>${escapeHtml(payload.installation)}</td></tr>
      <tr><th>Zone Contact</th><td>${escapeHtml(payload.zoneContact || 'Zone contact details pending internal review.')}</td></tr>
    </table>
  </section>

  ${renderEstimateSection(estimate)}

  <section class="section">
    <h2 class="section-title">Manufacturing Units</h2>
    <div class="grid2">
      <div class="contact-card">
        <strong>Manufacturing Unit - 1</strong><br />
        Sy No 34/2, near India Oil petrol pump, Gopasandra, Bengaluru, Karnataka 560099<br />
        +91 88616 22859<br />
        +91 80886 85440<br />
        sales@samanportable.com
      </div>
      <div class="contact-card">
        <strong>Manufacturing Unit - 2</strong><br />
        Khata No 226, Vill-Jalpura, Bisrakh Rd, Jalpura, Dadri, Greater Noida, Uttar Pradesh 201308<br />
        +91 8796039938<br />
        +91 9708989937<br />
        ncr@samanportable.com
      </div>
    </div>
  </section>

  <section class="section">
    <h2 class="section-title">Disclaimer</h2>
    <p class="disclaimer">
      This estimate is based on selected size and specification options. Final price depends on approved drawing,
      material specification, site location, transport, installation scope, GST treatment, and current market rates.
    </p>
  </section>

  <section class="section">
    <button class="btn print-only" onclick="window.print()">Print / Save as PDF</button>
    <p class="note">Suggested file name: ${escapeHtml(suggestedFile)}</p>
  </section>
</main>
</body>
</html>`;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = normalisePayload(getBodyObject(req.body));
  if (!payload) {
    return res.status(400).send('<h1>Invalid print payload</h1>');
  }

  try {
    const estimate = getEstimateFromInput(payload);
    const createdAt = new Date().toISOString();
    const dateToken = buildPrintDate(new Date(createdAt));
    const referenceToken = safeEstimateRefToken(`${payload.zone}-${payload.productId}-${dateToken}`);
    const zoneContact = payload.zone && ZONE_CONTACTS[payload.zone] ? ZONE_CONTACTS[payload.zone] : 'Zone contact details pending internal review.';
    const area = estimate.mode === 'custom' ? 0 : estimate.area;

    const printablePayload: PriceCalculatorPrintPayload & { referenceToken: string } = {
      productId: payload.productId,
      productName: estimate.productName,
      estimate,
      transport: payload.transport,
      installation: payload.installation,
      gst: payload.gst,
      zone: payload.zone,
      zoneContact,
      length: Number(payload.length) || 0,
      width: Number(payload.width) || 0,
      quantity: Number(payload.quantity) || 0,
      area,
      createdAt,
      customerName: payload.fullName,
      customerEmail: payload.email,
      customerMobile: payload.mobile,
      requirementNotes: payload.requirementNotes,
      specialPanelSheet: payload.specialPanelSheet,
      specialFloorStructure: payload.specialFloorStructure,
      numberOfRooms: Number(payload.numberOfRooms) || 0,
      selectedAddOns: payload.selectedAddOns,
      selectedAddOnsSummary: payload.selectedAddOnsSummary,
      referenceToken,
    };

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(renderBody(printablePayload));
  } catch {
    return res.status(400).send('<h1>Unable to generate printable estimate</h1>');
  }
}
