export type RelatedRailItem = {
  title: string;
  href: string;
  category: string;
  blurb: string;
  imageSrc?: string;
  imageAlt?: string;
};

export const C16_PANEL_CATALOG: Record<string, RelatedRailItem> = {
  'puf-panel': {
    title: 'PUF Panel',
    href: '/product/puf-panel',
    category: 'PUF Panels',
    imageSrc: '/panel-images/puf-panel/50mm-off-white-puf-panel-factory-stack.webp',
    imageAlt: 'Stack of 50 mm off-white PUF panels at the factory',
    blurb: 'Strong thermal insulation for the cost; the all-round default for cold rooms, cabins, cladding and roofing. From ₹1,050 / sq mt.',
  },
  'sandwich-panel': {
    title: 'Sandwich Panel',
    href: '/product/sandwich-panel',
    category: 'Sandwich Panels',
    blurb: 'Compare all five insulated cores and choose the right panel for your job. From ₹770 / sq mt.',
    imageSrc: '/panel-images/sandwich-panel/sandwich-panel-stack-facing-finishes.webp',
    imageAlt: 'Stack of new SAMAN sandwich panels showing steel facings and insulated core edges',
  },
  'pir-panel': {
    title: 'PIR Panel',
    href: '/product/pir-panel',
    category: 'PIR Panels',
    imageSrc: '/panel-images/pir-panel/50mm-black-pir-panel-qc-inspection-cut-section.webp',
    imageAlt: 'PIR panel cut section under quality inspection',
    blurb: 'Improved fire behaviour and higher service temperature than standard PUF; the premium thermal core. From ₹1,410 / sq mt.',
  },
  'eps-panel': {
    title: 'EPS Panel',
    href: '/product/eps-panel',
    category: 'EPS Panels',
    imageSrc: '/panel-images/eps-panel/eps-panel-wall-roof-stack-1x1.webp',
    imageAlt: 'Stack of SAMAN steel-faced EPS sandwich panels with visible white EPS core',
    blurb: 'Budget-friendly lightweight insulated panels for dry-use walls and partitions. From ₹770 / sq mt.',
  },
  'rockwool-panel': {
    title: 'Rockwool Panel',
    href: '/product/rockwool-panel',
    category: 'Rockwool Panels',
    imageSrc: '/panel-images/rockwool-panel/50mm-off-white-rockwool-panel-factory-stack.webp',
    imageAlt: 'Rockwool panel factory stack with visible core',
    blurb: 'Non-combustible stone wool core for fire-rated walls and acoustic enclosures. From ₹1,290 / sq mt.',
  },
  'glass-wool-panel': {
    title: 'Glass Wool Panel',
    href: '/product/glass-wool-panel',
    category: 'Glass Wool Panels',
    imageSrc: '/panel-images/glass-wool-panel/glass-wool-panel-stack-yellow-core.webp',
    imageAlt: 'Stack of SAMAN glass wool panels showing fibrous core and steel facings',
    blurb: 'Acoustic and thermal control from a mineral-fibre core for sound-sensitive and insulated partition work. From ₹1,010 / sq mt.',
  },
};

export const ROOFING_SHEET_HUB: RelatedRailItem = {
  title: 'Roofing Sheet',
  href: '/product/roofing-sheet',
  category: 'Roofing Sheets',
  imageSrc: '/panel-images/roofing-sheet/roofing-sheet-colour-coated-stack.webp',
  imageAlt: 'Stack of colour-coated roofing sheets in multiple colours at SAMAN supply yard',
  blurb: 'Compare every mainstream roof sheet type sold in India from one counter.',
};

export const METAL_ROOFING_SHEET: RelatedRailItem = {
  title: 'Metal Roofing Sheet',
  href: '/product/roofing-sheet/metal-roofing-sheet',
  category: 'Roofing Sheets',
  imageSrc: '/panel-images/metal-roofing-sheet/metal-roofing-sheet-colour-stack.webp',
  imageAlt: 'Stack of colour-coated metal roofing sheets at the SAMAN factory',
  blurb: 'GI, galvalume and colour-coated metal roofing sheets for sheds, warehouses and project roofs.',
};

export const POLYCARBONATE_ROOFING_SHEET: RelatedRailItem = {
  title: 'Polycarbonate Roofing Sheet',
  href: '/product/roofing-sheet/polycarbonate-roofing-sheet',
  category: 'Roofing Sheets',
  imageSrc: '/panel-images/polycarbonate-roofing-sheet/polycarbonate-roofing-sheet-clear-solid.webp',
  imageAlt: 'Clear solid polycarbonate roofing sheet held against the sky',
  blurb: 'UV-coated solid, multiwall and corrugated transparent sheets for daylight and canopy roofs.',
};

const ROOFING_PANEL_SLUGS = ['puf-panel', 'sandwich-panel', 'pir-panel', 'eps-panel', 'rockwool-panel'];
const METAL_ROOFING_SHEET_RAIL_SLUGS = ['puf-panel', 'sandwich-panel', 'pir-panel', 'eps-panel'];
const POLYCARBONATE_ROOFING_SHEET_RAIL_SLUGS = ['pir-panel', 'puf-panel', 'sandwich-panel', 'eps-panel'];
const C16_PANEL_SLUGS = ['puf-panel', 'sandwich-panel', 'pir-panel', 'eps-panel', 'rockwool-panel', 'glass-wool-panel'];

export function getRoofingPanelRail(): RelatedRailItem[] {
  return ROOFING_PANEL_SLUGS.map((slug) => C16_PANEL_CATALOG[slug]);
}

export function getMetalRoofingSheetRail(): RelatedRailItem[] {
  return [ROOFING_SHEET_HUB, ...METAL_ROOFING_SHEET_RAIL_SLUGS.map((slug) => C16_PANEL_CATALOG[slug])];
}

export function getPolycarbonateRoofingSheetRail(): RelatedRailItem[] {
  return [ROOFING_SHEET_HUB, ...POLYCARBONATE_ROOFING_SHEET_RAIL_SLUGS.map((slug) => C16_PANEL_CATALOG[slug])];
}

export function getPvcRoofingSheetRail(): RelatedRailItem[] {
  return [
    ROOFING_SHEET_HUB,
    POLYCARBONATE_ROOFING_SHEET,
    METAL_ROOFING_SHEET,
    C16_PANEL_CATALOG['puf-panel'],
    C16_PANEL_CATALOG['sandwich-panel'],
  ];
}

export function getPvcRoofingSheetRailWithPirFallback(): RelatedRailItem[] {
  return [
    ROOFING_SHEET_HUB,
    POLYCARBONATE_ROOFING_SHEET,
    C16_PANEL_CATALOG['pir-panel'],
    C16_PANEL_CATALOG['puf-panel'],
    C16_PANEL_CATALOG['sandwich-panel'],
  ];
}

export function getC16PanelSiblingRail(currentSlug: string): RelatedRailItem[] {
  return C16_PANEL_SLUGS
    .filter((slug) => slug !== currentSlug)
    .map((slug) => C16_PANEL_CATALOG[slug]);
}

export function isC16PanelSlug(slug: string): boolean {
  return C16_PANEL_SLUGS.includes(slug);
}
