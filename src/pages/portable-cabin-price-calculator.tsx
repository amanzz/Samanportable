import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { RankMathSEOData } from '@/config/api';
import { siteConfig } from '@/config/seo';
import { PRICE_CALCULATOR_H1 } from '@/lib/priceCalculatorRouteCopy';
import {
  CABIN_CEILING_OPTIONS,
  CABIN_FLOORING_OPTIONS,
  CABIN_INTERNAL_WALL_OPTIONS,
  CABIN_MATERIAL_OPTIONS,
  ATTACHED_SCOPE_ADDONS,
  FURNITURE_INTERIOR_ADDONS,
  PANEL_PRODUCT_ADDON_NOTE,
  CABIN_WINDOW_OPTIONS,
  CalculatorProductId,
  CUSTOM_PRODUCT_ID,
  PANEL_CONFIG,
  PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES,
  PriceCalculatorEstimate,
  PriceCalculatorFormState,
  AddOnEntry,
  AddOnQuantity,
  getSelectedAddOnEntries,
  MAX_ADDON_QUANTITY,
  STANDARD_PRODUCTS,
  SPECIAL_FLOOR_STRUCTURE_OPTIONS,
  SPECIAL_PANEL_SHEET_OPTIONS,
  ZONE_CONTACTS,
  formatAddOnsForLeadPayload,
  sanitizeSelectedAddOns,
  currencyInRupee,
  getEstimateFromInput,
  getFixedSizeBasePrice,
  getPanelDefaultThickness,
  getProductName,
  isFixedSizeBasePriceProduct,
  isPanelProduct,
  isSpecialScopeProduct,
} from '@/lib/price-calculator-config';

type Zone = 'South' | 'North';

type ViewMode = 'idle' | 'ready' | 'custom' | 'error';

const CALCULATOR_TITLE = 'Portable Cabin Price Calculator | Customize & Price | SAMAN';
// L3-locked H1. Defined once in priceCalculatorRouteCopy so the header entry
// point renders the same approved string rather than a second copy of it.
const CALCULATOR_H1 = PRICE_CALCULATOR_H1;
const CALCULATOR_DESCRIPTION =
  'Estimate your SAMAN cabin, container office, labor colony, prefab and panel budget range using your selected specification and commercial inputs.';
const TRUST_BADGES = [
  'Budget Range Only',
  'GST / Transport / Installation Options',
  'Download SAMAN Estimate',
  'Zone-wise Support',
];

const EMAIL_ESTIMATE_PENDING_MESSAGE =
  'Email estimate will be enabled after production email/CRM configuration.';

const TRANSPORT_OPTIONS = [
  'Transport required',
  'Transport to be confirmed',
  'Discuss with SAMAN',
] as const;

const INSTALLATION_OPTIONS = [
  'Installation required',
  'Installation not required',
  'Discuss with SAMAN',
] as const;

const GST_OPTIONS = ['GST extra', 'GST included guidance', 'Discuss with SAMAN'] as const;

const FAQ_ITEMS = [
  {
    question: 'What does the SAMAN price calculator show?',
    answer:
      'It shows an estimated budget range based on product type, size, quantity, selected specification, GST, transport, installation, and optional add-ons. A written quotation is shared after drawing and requirement review.',
  },
  {
    question: 'Is the calculator budget the written quotation?',
    answer:
      'No. The calculator shows only a budget range. A written quotation depends on approved drawing, site location, material specification, transport, installation scope, GST treatment, and current market rates.',
  },
  {
    question: 'Why do I need to enter my mobile number before seeing the estimate?',
    answer:
      'SAMAN collects basic contact details so our team can understand your requirement, share the correct zone contact, and help with written quotation support.',
  },
  {
    question: 'Can I add furniture, toilet, pantry, or partition requirements?',
    answer:
      'Yes. You can select optional add-ons and quantity, such as workstation, chairs, attached toilet, pantry, urinal, washbasin, partition, cabinet, rack, or table. These items are reviewed before quotation approval.',
  },
  {
    question: 'Can the calculator estimate PUF, Rockwool, and PIR panels?',
    answer:
      'Yes. Panel products are calculated by square meter area, selected panel type, thickness, and quantity. Panel budget range may change based on coating, profile, order quantity, delivery location, and accessories.',
  },
];

const isValidName = (value: string): boolean => value.trim().length >= 2;
const isValidEmail = (value: string): boolean =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());

const isValidMobile = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getDefaultFormState = (): PriceCalculatorFormState => {
  return {
    productId: STANDARD_PRODUCTS[0],
    zone: 'South',
    length: '20',
    width: '10',
    quantity: '1',
    materialType: CABIN_MATERIAL_OPTIONS[0],
    internalWall: CABIN_INTERNAL_WALL_OPTIONS[0],
    ceiling: CABIN_CEILING_OPTIONS[0],
    flooring: CABIN_FLOORING_OPTIONS[0],
    windowType: CABIN_WINDOW_OPTIONS[0],
    panelThickness: getPanelDefaultThickness('puf_panel'),
    transport: TRANSPORT_OPTIONS[0],
    installation: INSTALLATION_OPTIONS[0],
    gst: GST_OPTIONS[0],
    specialPanelSheet: SPECIAL_PANEL_SHEET_OPTIONS[0],
    specialFloorStructure: SPECIAL_FLOOR_STRUCTURE_OPTIONS[0],
    numberOfRooms: '1',
    fullName: '',
    email: '',
    mobile: '',
    requirementNotes: '',
  selectedAddOns: {},
  };
};

const getPanelOptionValues = (productId: 'puf_panel' | 'rockwool_panel' | 'pir_panel'): number[] =>
  PANEL_CONFIG[productId].options.map((option) => option.thicknessMm);

const renderField = (
  htmlFor: string,
  label: string,
  input: React.ReactNode,
) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium">
    <span className="block mb-1">{label}</span>
    {input}
  </label>
);

const ProductCalculatorPage = () => {
  const [formData, setFormData] = useState<PriceCalculatorFormState>(getDefaultFormState);
  const [result, setResult] = useState<PriceCalculatorEstimate | null>(null);
  const [mode, setMode] = useState<ViewMode>('idle');
  const [statusMessage, setStatusMessage] = useState('Enter required details to unlock estimate.');
  const [printPayload, setPrintPayload] = useState<string>('');
  const printFormRef = useRef<HTMLFormElement>(null);

  const isCustom = formData.productId === CUSTOM_PRODUCT_ID;
  const isPanel = isPanelProduct(formData.productId);
  const isSpecial = isSpecialScopeProduct(formData.productId);
  const isFixedSizeBase = isFixedSizeBasePriceProduct(formData.productId);
  const isLaborColony = formData.productId === 'labor_colony';
  const currentProductName = getProductName(formData.productId);
  const currentZoneContact = formData.zone ? ZONE_CONTACTS[formData.zone] : '';
  const selectedAddOns = formData.selectedAddOns;
  const orderedSelectedAddOnEntries: AddOnEntry[] = useMemo(() => {
    const entries: AddOnEntry[] = [];
    ATTACHED_SCOPE_ADDONS.forEach((addOn) => {
      const qty = selectedAddOns[addOn];
      if (qty && qty > 0) {
        entries.push({ name: addOn, quantity: qty });
      }
    });
    FURNITURE_INTERIOR_ADDONS.forEach((addOn) => {
      const qty = selectedAddOns[addOn];
      if (qty && qty > 0) {
        entries.push({ name: addOn, quantity: qty });
      }
    });
    return entries;
  }, [selectedAddOns]);
  const dateStamp = useMemo(() => {
    const safe = new Date();
    return `${safe.getFullYear().toString().padStart(4, '0')}${(safe.getMonth() + 1).toString().padStart(2, '0')}${safe
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    // T30: `result` was an unnecessary dep (the body reads only `new Date()`); the
    // stamp is a same-day value used solely in the suggested PDF filename, so
    // computing it once per mount is behaviourally identical. (react-hooks/exhaustive-deps)
  }, []);
  const budgetBreakdown = result && result.mode !== 'custom' ? result.budgetBreakdown : null;
  const fixedSizeBasePrice = useMemo(
    () => getFixedSizeBasePrice(formData.productId, toNumber(formData.length), toNumber(formData.width)),
    [formData.productId, formData.length, formData.width],
  );
  const fixedSizeHelpText = PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES.map(
    (item) => `${item.lengthFt}x${item.widthFt}x${item.heightFt}`,
  ).join(', ');
  const selectedFixedSizeKey = fixedSizeBasePrice
    ? `${fixedSizeBasePrice.lengthFt}x${fixedSizeBasePrice.widthFt}x${fixedSizeBasePrice.heightFt}`
    : '';

  const customerDetailsValid = () =>
    isValidName(formData.fullName) &&
    isValidEmail(formData.email) &&
    isValidMobile(formData.mobile) &&
    (formData.zone === 'South' || formData.zone === 'North');

  const dimensionsValid = () => {
    const length = toNumber(formData.length);
    const width = toNumber(formData.width);
    const quantity = Math.max(1, Math.floor(toNumber(formData.quantity) || 0));
    if (isFixedSizeBase) {
      return Boolean(fixedSizeBasePrice) && quantity >= 1;
    }
    return isCustom || (length > 0 && width > 0 && quantity >= 1);
  };

  const laborRoomsValid = () => {
    if (!isSpecial) return true;
    if (!isLaborColony) return true;
    return Math.max(1, Math.floor(toNumber(formData.numberOfRooms))) >= 1;
  };

  const readyToEstimate = customerDetailsValid() && dimensionsValid() && laborRoomsValid();

  const zoneContactLines = currentZoneContact
    ? [
        ...currentZoneContact.split('|').map((line) => line.trim()),
      ]
    : [];

  const unitArea = useMemo(() => {
    const length = toNumber(formData.length);
    const width = toNumber(formData.width);
    return length > 0 && width > 0 ? length * width : 0;
  }, [formData.length, formData.width]);

  // T30: clearResult + setFormValue wrapped in useCallback so their identities are
  // stable across renders (they close over only stable setState setters). This lets
  // the product-change effects below list setFormValue in their dependency arrays
  // (react-hooks/exhaustive-deps) without re-running every render. Behaviour identical.
  const clearResult = useCallback(() => {
    setResult(null);
    setMode('idle');
    setStatusMessage('Enter required details to unlock estimate.');
    setPrintPayload('');
  }, []);

  const setFormValue = useCallback(<K extends keyof PriceCalculatorFormState>(key: K, value: PriceCalculatorFormState[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearResult();
  }, [clearResult]);

  const setOptionValue = <K extends keyof PriceCalculatorFormState>(key: K, value: string) =>
    setFormValue(key, value as PriceCalculatorFormState[K]);

  const onFixedSizeChange = (value: string) => {
    const selectedSize = PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES.find(
      (item) => `${item.lengthFt}x${item.widthFt}x${item.heightFt}` === value,
    );
    if (!selectedSize) return;
    setFormData((prev) => ({
      ...prev,
      length: String(selectedSize.lengthFt),
      width: String(selectedSize.widthFt),
    }));
    clearResult();
  };

  const setSelectedAddOns = (nextAddOns: PriceCalculatorFormState['selectedAddOns']) => {
    const normalized = sanitizeSelectedAddOns(formData.productId, nextAddOns);
    setFormValue('selectedAddOns', normalized);
  };

  const setAddOnQuantity = (addOn: AddOnEntry['name'], quantity: number) => {
    const safeQty = Math.max(0, Math.min(MAX_ADDON_QUANTITY, Math.floor(quantity || 0)));
    const nextSelected = { ...selectedAddOns };
    if (safeQty <= 0) {
      delete nextSelected[addOn];
      setSelectedAddOns(nextSelected);
      return;
    }
    nextSelected[addOn] = safeQty as AddOnQuantity;
    setSelectedAddOns(nextSelected);
  };

  useEffect(() => {
    if (!isPanel) return;
    setFormValue('panelThickness', getPanelDefaultThickness(formData.productId as 'puf_panel' | 'rockwool_panel' | 'pir_panel'));
  }, [formData.productId, isPanel, setFormValue]);

  useEffect(() => {
    if (isPanel) {
      return;
    }
    setFormValue('specialPanelSheet', SPECIAL_PANEL_SHEET_OPTIONS[0]);
    setFormValue('specialFloorStructure', SPECIAL_FLOOR_STRUCTURE_OPTIONS[0]);
  }, [isPanel, setFormValue]);

  useEffect(() => {
    if (!isPanel && !isSpecial) {
      return;
    }
    setFormValue('materialType', CABIN_MATERIAL_OPTIONS[0]);
  }, [isPanel, isSpecial, setFormValue]);

  const onProductChange = (productId: CalculatorProductId) => {
    const fixedSizeDefault = isFixedSizeBasePriceProduct(productId)
      ? PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES[0]
      : null;
    setFormData((prev) => ({
      ...prev,
      productId,
      length: fixedSizeDefault ? String(fixedSizeDefault.lengthFt) : prev.length,
      width: fixedSizeDefault ? String(fixedSizeDefault.widthFt) : prev.width,
      specialPanelSheet: SPECIAL_PANEL_SHEET_OPTIONS[0],
      specialFloorStructure: SPECIAL_FLOOR_STRUCTURE_OPTIONS[0],
      numberOfRooms: isSpecialScopeProduct(productId) && productId === 'labor_colony' ? '1' : '0',
      panelThickness:
        productId === 'puf_panel' || productId === 'rockwool_panel' || productId === 'pir_panel'
          ? getPanelDefaultThickness(productId)
          : prev.panelThickness,
      selectedAddOns: sanitizeSelectedAddOns(productId, prev.selectedAddOns),
    }));
    clearResult();
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!customerDetailsValid()) {
      setMode('error');
      setStatusMessage('Enter Full Name, valid Email Address, 10-digit Mobile Number, and Zone to unlock estimate.');
      return;
    }

    if (!dimensionsValid()) {
      setMode('error');
      setStatusMessage(
        isFixedSizeBase
          ? `Select one of the standard sizes: ${fixedSizeHelpText}.`
          : 'Enter valid dimensions and quantity.',
      );
      return;
    }

    if (!laborRoomsValid()) {
      setMode('error');
      setStatusMessage('Number of Rooms is required for Labor Colony.');
      return;
    }

    let estimate: PriceCalculatorEstimate;
    try {
      const normalizedAddOns = sanitizeSelectedAddOns(formData.productId, formData.selectedAddOns);
      const addOnSummaryForLead = formatAddOnsForLeadPayload(normalizedAddOns);
      const payload: PriceCalculatorFormState = {
        ...formData,
        selectedAddOns: normalizedAddOns,
        selectedAddOnsSummary: addOnSummaryForLead,
      };
      estimate = getEstimateFromInput(payload);
      setPrintPayload(JSON.stringify(payload));
      setResult(estimate);
    } catch {
      setMode('error');
      setStatusMessage('Unable to generate estimate. Please review your inputs.');
      return;
    }

    if (estimate.mode === 'custom') {
      setMode('custom');
      setStatusMessage('Custom quotation required. Contact SAMAN for a written quotation.');
      return;
    }

    setMode('ready');
    setStatusMessage('Estimated budget range is shown below. Contact SAMAN for a written quotation.');
  };

  const handlePrint = () => {
    if (!printPayload || !printFormRef.current) {
      setMode('error');
      setStatusMessage('Generate a valid estimate first before opening printable estimate.');
      return;
    }
    printFormRef.current.submit();
  };

  const panelThicknessOptions = useMemo(() => {
    if (!isPanel) {
      return [];
    }
    return getPanelOptionValues(formData.productId as 'puf_panel' | 'rockwool_panel' | 'pir_panel');
  }, [isPanel, formData.productId]);

  const structuredData = useMemo(() => {
    const calculatorUrl = `${siteConfig.url}/portable-cabin-price-calculator`;
    const webpage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${calculatorUrl}#webpage`,
      url: calculatorUrl,
      name: CALCULATOR_H1,
      description: CALCULATOR_DESCRIPTION,
      isPartOf: {
        '@id': `${siteConfig.url}/#website`,
      },
      publisher: {
        '@id': `${siteConfig.url}/#organization`,
      },
      inLanguage: 'en-IN',
    };
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteConfig.url}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Portable Cabin Price Calculator',
          item: calculatorUrl,
        },
      ],
    };

    const faqSchema = FAQ_ITEMS.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

    return {
      '@context': 'https://schema.org',
      '@graph': [webpage, breadcrumb, ...(faqSchema ? [faqSchema] : [])],
    };
  }, []);

  return (
    <Layout>
      <UnifiedSEO
        rankMathSEO={{
          title: CALCULATOR_TITLE,
          description: CALCULATOR_DESCRIPTION,
          canonical: `${siteConfig.url}/portable-cabin-price-calculator`,
        }}
        fallbackTitle={CALCULATOR_TITLE}
        fallbackDescription={CALCULATOR_DESCRIPTION}
        fallbackCanonical={`${siteConfig.url}/portable-cabin-price-calculator`}
        structuredData={structuredData}
      />

      <main className="bg-background min-h-screen">
        <section className="border-b border-emerald-200 bg-gradient-to-b from-emerald-50/80 to-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-emerald-950">{CALCULATOR_H1}</h1>
              <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-3xl">
                Get an estimated budget range for cabins, container offices, labor colonies, prefab structures, and panel products.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Budget output is shown as low, typical and high range only. A written quotation will be shared after drawing and specification review.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TRUST_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Customer Details</h2>
                {renderField(
                  'fullName',
                  'Full Name',
                  <input
                    id="fullName"
                    className="w-full h-10 border border-input rounded-md px-3"
                    value={formData.fullName}
                    onChange={(event) => setFormValue('fullName', event.target.value)}
                    required
                    autoComplete="name"
                    minLength={2}
                  />,
                )}
                {renderField(
                  'email',
                  'Email Address',
                  <input
                    id="email"
                    type="email"
                    className="w-full h-10 border border-input rounded-md px-3"
                    value={formData.email}
                    onChange={(event) => setFormValue('email', event.target.value)}
                    required
                    autoComplete="email"
                  />,
                )}
                {renderField(
                  'mobile',
                  'Mobile Number',
                  <input
                    id="mobile"
                    type="tel"
                    className="w-full h-10 border border-input rounded-md px-3"
                    value={formData.mobile}
                    onChange={(event) => setFormValue('mobile', event.target.value)}
                    required
                    autoComplete="tel"
                  />,
                )}
                {renderField(
                  'zone',
                  'Zone',
                  <select
                    id="zone"
                    className="w-full h-10 border border-input rounded-md px-3 bg-white"
                    value={formData.zone}
                    onChange={(event) => setFormValue('zone', event.target.value as Zone)}
                    required
                  >
                    <option value="">Select Zone</option>
                    <option value="South">South</option>
                    <option value="North">North</option>
                  </select>,
                )}
              </div>

              {renderField(
                'requirementNotes',
                'Requirement Notes',
                <textarea
                  id="requirementNotes"
                  className="w-full rounded-md border border-input px-3 py-2"
                  rows={3}
                  value={formData.requirementNotes}
                  onChange={(event) => setFormValue('requirementNotes', event.target.value)}
                  placeholder="Optional notes for review."
                />,
              )}

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Product &amp; Size</h2>
                {renderField(
                  'productId',
                  'Product',
                  <select
                    id="productId"
                    className="w-full h-10 border border-input rounded-md px-3 bg-white"
                    value={formData.productId}
                    onChange={(event) => onProductChange(event.target.value as CalculatorProductId)}
                  >
                    {STANDARD_PRODUCTS.map((productId) => (
                      <option key={productId} value={productId}>
                        {getProductName(productId)}
                      </option>
                    ))}
                    <option value={CUSTOM_PRODUCT_ID}>Custom Requirement Quote</option>
                  </select>,
                )}

                {isFixedSizeBase && (
                  <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-3">
                    {renderField(
                      'standardFixedSize',
                      'Standard Size',
                      <select
                        id="standardFixedSize"
                        className="w-full h-10 border border-input rounded-md px-3 bg-white"
                        value={selectedFixedSizeKey}
                        onChange={(event) => onFixedSizeChange(event.target.value)}
                      >
                        <option value="">Select standard size</option>
                        {PORTABLE_TOILET_SECURITY_CABIN_BASE_PRICES.map((item) => {
                          const optionKey = `${item.lengthFt}x${item.widthFt}x${item.heightFt}`;
                          return (
                            <option key={optionKey} value={optionKey}>
                              {optionKey} ft - {currencyInRupee(item.basePrice)} base
                            </option>
                          );
                        })}
                      </select>,
                    )}
                    <p className="text-xs text-muted-foreground">
                      Base price excludes GST, transport, installation, optional add-ons, and custom changes.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    {renderField(
                      'length',
                      `Length (${isPanel ? 'm' : 'ft'})`,
                      <input
                        id="length"
                        type="number"
                        min="0.1"
                        step="0.1"
                        className={`w-full h-10 border border-input rounded-md px-3 ${isFixedSizeBase ? 'bg-muted/30' : ''}`}
                        value={formData.length}
                        readOnly={isFixedSizeBase}
                        onChange={(event) => setFormValue('length', event.target.value)}
                      />,
                    )}
                  </div>
                  <div>
                    {renderField(
                      'width',
                      `Width (${isPanel ? 'm' : 'ft'})`,
                      <input
                        id="width"
                        type="number"
                        min="0.1"
                        step="0.1"
                        className={`w-full h-10 border border-input rounded-md px-3 ${isFixedSizeBase ? 'bg-muted/30' : ''}`}
                        value={formData.width}
                        readOnly={isFixedSizeBase}
                        onChange={(event) => setFormValue('width', event.target.value)}
                      />,
                    )}
                  </div>
                  <div>
                    {renderField(
                      'quantity',
                      'Quantity',
                      <input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        className="w-full h-10 border border-input rounded-md px-3"
                        value={formData.quantity}
                        onChange={(event) => setFormValue('quantity', event.target.value)}
                      />,
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total area: {unitArea.toLocaleString('en-IN')} {isPanel ? 'm²' : 'sq ft'}
                </p>
                {isFixedSizeBase && (
                  <p className="text-xs text-muted-foreground">
                    Standard sizes: {fixedSizeHelpText}. Select a listed size to use approved base pricing.
                  </p>
                )}
              </div>

              {isPanel && (
                <div className="space-y-3 rounded-md border border-border/70 bg-muted/20 p-3">
                  <p className="text-sm text-foreground">Panel estimate is calculated by square meter area, selected thickness, and quantity.</p>
                  {renderField(
                    'panelThickness',
                    'Panel Thickness (mm)',
                    <select
                      id="panelThickness"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.panelThickness}
                      onChange={(event) => setFormValue('panelThickness', Number(event.target.value))}
                    >
                      {panelThicknessOptions.map((thickness) => (
                        <option key={thickness} value={thickness}>
                          {thickness} mm
                        </option>
                      ))}
                    </select>,
                  )}
                </div>
              )}

              {!isPanel && (
                <div className="space-y-4">
                  {isSpecial ? (
                    <>
                      {renderField(
                        'specialPanelSheet',
                        'Panel / Sheet Option',
                    <select
                      id="specialPanelSheet"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.specialPanelSheet}
                      onChange={(event) => setOptionValue('specialPanelSheet', event.target.value)}
                    >
                          {SPECIAL_PANEL_SHEET_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                      {renderField(
                        'specialFloorStructure',
                        'Building Floor',
                    <select
                      id="specialFloorStructure"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.specialFloorStructure}
                      onChange={(event) => setOptionValue('specialFloorStructure', event.target.value)}
                    >
                          {SPECIAL_FLOOR_STRUCTURE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                      {renderField(
                        'numberOfRooms',
                        `Number of Rooms ${isLaborColony ? '(required)' : '(optional)'}`,
                        <input
                          id="numberOfRooms"
                          type="number"
                          min={isLaborColony ? 1 : 0}
                          step="1"
                          className="w-full h-10 border border-input rounded-md px-3"
                          value={formData.numberOfRooms}
                          onChange={(event) => setFormValue('numberOfRooms', event.target.value)}
                        />,
                      )}
                      <p className="text-xs text-muted-foreground">
                        Civil work is not included in SAMAN scope unless clearly included in the written quotation.
                      </p>
                    </>
                  ) : (
                    <>
                      {renderField(
                        'materialType',
                        'Material Type',
                      <select
                        id="materialType"
                        className="w-full h-10 border border-input rounded-md px-3 bg-white"
                        value={formData.materialType}
                        onChange={(event) => setOptionValue('materialType', event.target.value)}
                      >
                          {CABIN_MATERIAL_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                      {formData.materialType === 'MS Cabin' &&
                        renderField(
                          'internalWall',
                          'MS Internal Wall',
                            <select
                          id="internalWall"
                          className="w-full h-10 border border-input rounded-md px-3 bg-white"
                          value={formData.internalWall}
                          onChange={(event) => setOptionValue('internalWall', event.target.value)}
                        >
                            {CABIN_INTERNAL_WALL_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>,
                        )}
                      {renderField(
                        'ceiling',
                        'Top Roof / Ceiling',
                        <select
                          id="ceiling"
                          className="w-full h-10 border border-input rounded-md px-3 bg-white"
                          value={formData.ceiling}
                          onChange={(event) => setOptionValue('ceiling', event.target.value)}
                        >
                          {CABIN_CEILING_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                      {renderField(
                        'flooring',
                        'Flooring',
                        <select
                          id="flooring"
                          className="w-full h-10 border border-input rounded-md px-3 bg-white"
                          value={formData.flooring}
                          onChange={(event) => setOptionValue('flooring', event.target.value)}
                        >
                          {CABIN_FLOORING_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                      {renderField(
                        'windowType',
                        'Window',
                        <select
                          id="windowType"
                          className="w-full h-10 border border-input rounded-md px-3 bg-white"
                          value={formData.windowType}
                          onChange={(event) => setOptionValue('windowType', event.target.value)}
                        >
                          {CABIN_WINDOW_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>,
                      )}
                    </>
                  )}
                </div>
                )}

                {!isPanel && (
                  <div className="space-y-4 rounded-md border border-emerald-200 bg-emerald-50/40 p-3">
                    <h2 className="text-lg font-semibold text-foreground">Optional Add-ons</h2>
                    <p className="text-xs text-muted-foreground">
                      Select quantity if required. Add-ons are estimated separately and reviewed by SAMAN before quotation approval.
                    </p>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-medium">Attached scope add-ons</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ATTACHED_SCOPE_ADDONS.map((addOn) => {
                          const selectedQty = selectedAddOns[addOn] || 0;
                          return (
                            <label key={addOn} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm text-foreground">
                              <span>{addOn}</span>
                              <input
                                type="number"
                                min={0}
                                max={MAX_ADDON_QUANTITY}
                                step={1}
                                className="w-20 h-8 border border-input rounded-md px-2"
                                value={selectedQty}
                                onChange={(event) => setAddOnQuantity(addOn, Number(event.target.value))}
                                aria-label={`${addOn} quantity`}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-medium">Furniture / interior add-ons</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {FURNITURE_INTERIOR_ADDONS.map((addOn) => {
                          const selectedQty = selectedAddOns[addOn] || 0;
                          return (
                            <label key={addOn} className="grid grid-cols-[1fr_auto] items-center gap-2 text-sm text-foreground">
                              <span>{addOn}</span>
                              <input
                                type="number"
                                min={0}
                                max={MAX_ADDON_QUANTITY}
                                step={1}
                                className="w-20 h-8 border border-input rounded-md px-2"
                                value={selectedQty}
                                onChange={(event) => setAddOnQuantity(addOn, Number(event.target.value))}
                                aria-label={`${addOn} quantity`}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    {isSpecial && (
                      <p className="text-xs text-muted-foreground">
                        Civil scope note: Civil work is not included in SAMAN scope unless clearly included in the written quotation.
                      </p>
                    )}
                  </div>
                )}

                {isPanel && (
                  <div className="space-y-3 rounded-md border border-border/70 bg-muted/20 p-3">
                    <h2 className="text-lg font-semibold text-foreground">Optional Add-ons</h2>
                    <p className="text-sm text-foreground">{PANEL_PRODUCT_ADDON_NOTE}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {renderField(
                    'gst',
                    'GST',
                    <select
                      id="gst"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.gst}
                      onChange={(event) => setOptionValue('gst', event.target.value)}
                    >
                    {GST_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>,
                )}
                {renderField(
                  'transport',
                  'Transport',
                    <select
                      id="transport"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.transport}
                      onChange={(event) => setOptionValue('transport', event.target.value)}
                    >
                    {TRANSPORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>,
                )}
                {renderField(
                  'installation',
                  'Installation',
                    <select
                      id="installation"
                      className="w-full h-10 border border-input rounded-md px-3 bg-white"
                      value={formData.installation}
                      onChange={(event) => setOptionValue('installation', event.target.value)}
                    >
                    {INSTALLATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>,
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-700 text-white h-12 font-semibold shadow-md hover:bg-emerald-800 disabled:opacity-50"
                disabled={!readyToEstimate}
              >
                Calculate Budget Range
              </button>
            </div>

            <aside className="space-y-4">
              <section className="rounded-lg border border-emerald-200 bg-card p-5 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold mb-3 text-emerald-950">Estimate Summary</h2>
                <p className={`text-sm ${mode === 'error' ? 'text-red-600' : 'text-muted-foreground'}`}>{statusMessage}</p>

                {result && result.mode !== 'custom' && readyToEstimate && budgetBreakdown && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="font-medium">{currentProductName}</h3>
                      <p className="text-sm text-muted-foreground">Estimated budget range for selected requirements.</p>
                    </div>

                    <section className="rounded-md border border-border p-3 space-y-2">
                      <p className="text-sm font-semibold">Base Product Estimate</p>
                      <p className="text-xs text-muted-foreground">{budgetBreakdown.base.details}</p>
                      <p className="text-sm">
                        {currencyInRupee(budgetBreakdown.base.lowRange)} to {currencyInRupee(budgetBreakdown.base.highRange)}
                      </p>
                    </section>

                    <section className="rounded-md border border-border p-3 space-y-2">
                      <p className="text-sm font-semibold">Specification Adjustment</p>
                      <p className="text-xs text-muted-foreground">{budgetBreakdown.specification.details}</p>
                      <p className="text-sm">
                        {currencyInRupee(budgetBreakdown.specification.lowRange)} to{' '}
                        {currencyInRupee(budgetBreakdown.specification.highRange)}
                      </p>
                      <p className="text-xs text-muted-foreground">{budgetBreakdown.specification.note}</p>
                    </section>

                    <section className="rounded-md border border-border p-3 space-y-2">
                      <p className="text-sm font-semibold">Optional Add-ons</p>
                      {budgetBreakdown.addOns.items.length > 0 ? (
                        <ul className="text-sm space-y-1">
                          {budgetBreakdown.addOns.items.map((item) => (
                            <li key={item.name} className="text-muted-foreground">
                              {item.name}: {item.quantity} nos -{' '}
                              {item.isIncludedInEstimate ? (
                                <>
                                  {currencyInRupee(item.lowRange)} to {currencyInRupee(item.highRange)}
                                  <span className="block text-xs text-muted-foreground">
                                    Typical: {currencyInRupee(item.typicalRange)}
                                  </span>
                                </>
                              ) : (
                                <span>Quotation review required</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No optional add-ons selected.</p>
                      )}
                      <p className="text-sm font-medium">
                        Priced add-ons subtotal: {currencyInRupee(budgetBreakdown.addOns.lowRange)} to{' '}
                        {currencyInRupee(budgetBreakdown.addOns.highRange)}
                        <span className="block text-xs text-muted-foreground">
                          Typical: {currencyInRupee(budgetBreakdown.addOns.typicalRange)}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Review-required add-ons are listed separately and are not included until priced by SAMAN.
                      </p>
                    </section>

                    <section className="rounded-md border border-border p-3 space-y-2">
                      <p className="text-sm font-semibold">Commercial Options</p>
                      <p className="text-xs text-muted-foreground">GST: {result.gst}</p>
                      <p className="text-xs text-muted-foreground">Transport: {result.transport}</p>
                      <p className="text-xs text-muted-foreground">Installation: {result.installation}</p>
                      <p className="text-xs text-muted-foreground">Zone: {result.zone}</p>
                    </section>

                    <section className="rounded-md border border-emerald-300 bg-emerald-50 p-3">
                      <p className="text-sm font-semibold text-emerald-900">Estimated Budget Range</p>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Low</p>
                          <p className="font-semibold">{currencyInRupee(result.lowRange)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Typical</p>
                          <p className="font-semibold">{currencyInRupee(result.typicalRange)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">High</p>
                          <p className="font-semibold">{currencyInRupee(result.highRange)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Basic to Premium Range: Low / Typical / High
                      </p>
                    </section>

                    <p className="text-sm text-foreground">
                      Contact SAMAN for a written quotation. A written quotation will be shared after drawing and specification review.
                    </p>

                    {currentZoneContact && (
                      <p className="text-xs text-muted-foreground">{zoneContactLines.join(' | ')}</p>
                    )}

                    <div className="space-y-2">
                      <button
                        type="button"
                        className="w-full rounded-full bg-emerald-700 text-white px-3 py-2 font-semibold shadow-sm hover:bg-emerald-800 disabled:opacity-50"
                        onClick={handlePrint}
                        disabled={mode !== 'ready'}
                      >
                        Download SAMAN Estimate
                      </button>
                      <Link
                        href="/contact"
                        className="block w-full rounded-full border border-emerald-700 bg-white px-3 py-2 text-center font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        Contact SAMAN for a Written Quotation
                      </Link>
                      <button
                        type="button"
                        className="w-full rounded-full border border-border bg-slate-900/90 text-white px-3 py-2 disabled:opacity-60"
                        disabled
                        aria-disabled="true"
                      >
                        Email Estimate
                      </button>
                      <p className="text-xs text-muted-foreground">{EMAIL_ESTIMATE_PENDING_MESSAGE}</p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Suggested file name: SAMAN-Estimate-{currentProductName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')}-{dateStamp}.pdf
                    </p>
                  </div>
                )}

                {result && result.mode === 'custom' && (
                  <div className="mt-4 space-y-2 text-sm">
                    <p>Custom quotation required.</p>
                    <section className="rounded border border-border p-2 bg-muted/10 space-y-2">
                      <p className="text-sm font-medium">Optional Add-ons Selected</p>
                      {orderedSelectedAddOnEntries.length ? (
                        <ul className="text-sm text-foreground space-y-1">
                          {orderedSelectedAddOnEntries.map((entry) => (
                            <li key={entry.name}>
                              - {entry.name}: {entry.quantity} nos
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No optional add-ons selected.</p>
                      )}
                    </section>
                    <p className="text-muted-foreground">Contact SAMAN for a written quotation.</p>
                  </div>
                )}

                <p className="mt-4 text-xs text-muted-foreground">
                  This estimate is shown as budget range only. Written quotation depends on approved drawing, site location,
                  material specification, transport, installation scope, GST treatment, and current market rates.
                </p>
              </section>

              {currentZoneContact && (
                <section className="rounded-lg border border-border bg-card p-5">
                  <h2 className="font-semibold">Selected Zone Contact</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{currentZoneContact}</p>
                </section>
              )}

              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="font-semibold">FAQ</h2>
                <div className="space-y-3 mt-2">
                  {FAQ_ITEMS.map((faq) => (
                    <div key={faq.question}>
                      <p className="text-sm font-semibold">{faq.question}</p>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </form>
        </section>
      </main>

      <form ref={printFormRef} method="POST" action="/api/price-calculator-print" target="_blank" className="hidden">
        <input type="hidden" name="payload" value={printPayload} />
      </form>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const rankMathSEO: RankMathSEOData = {
    title: CALCULATOR_TITLE,
    description: CALCULATOR_DESCRIPTION,
    canonical: `${siteConfig.url}/portable-cabin-price-calculator`,
  };

  return {
    props: {
      rankMathSEO,
    },
  };
};

export default ProductCalculatorPage;
