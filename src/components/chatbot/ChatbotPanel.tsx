import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { pushDataLayer, safeText } from '@/lib/analytics';

/**
 * Guided (step-form) enquiry panel — lazy-loaded on first FAB click.
 * NOT a free-text AI chat: it walks the user through 5 fixed steps and creates a
 * Zoho CRM lead on completion by POSTing to SAMAN's existing PUBLIC Zoho Forms
 * action URL (same endpoint + field link names the site's API routes already use).
 * No API keys / tokens ship in this client code — the endpoint is a public form.
 */

type ZoneKey = 'south' | 'north';

interface ZoneInfo {
  key: ZoneKey;
  /** Value shown in the dropdown + sent to Zoho. */
  label: string;
  /** Primary display number (already-approved zone number only). */
  primaryDisplay: string;
  /** Primary tel: number (digits only). */
  primaryTel: string;
  secondaryDisplay: string;
  secondaryTel: string;
  email: string;
}

// Only these four zone numbers may appear anywhere in this widget.
const ZONES: Record<ZoneKey, ZoneInfo> = {
  south: {
    key: 'south',
    label: 'South Zone (Karnataka, Tamil Nadu, Kerala, Andhra Pradesh, Telangana)',
    primaryDisplay: '+91 88616 22859',
    primaryTel: '+918861622859',
    secondaryDisplay: '+91 80886 85440',
    secondaryTel: '+918088685440',
    email: 'sales@samanportable.com',
  },
  north: {
    key: 'north',
    label: 'North Zone (All other states — North, West, East, Central India)',
    primaryDisplay: '+91 87960 39938',
    primaryTel: '+918796039938',
    secondaryDisplay: '+91 97089 89937',
    secondaryTel: '+919708989937',
    email: 'ncr@samanportable.com',
  },
};

const PRODUCTS = [
  'Portable Cabin',
  'Porta Cabin',
  'Container Office',
  'Portable Office Cabin',
  'Prefabricated House',
  'Labour Colony',
  'Labour Hutment',
  'Portable Toilet',
  'Security Cabin',
  'FRP Security Cabin',
  'PEB Shed',
  'Warehouse Shed',
  'Container Cafe',
  'Site Office Cabin',
];

// The Zoho "GetQuoteForm" Products dropdown (link name Dropdown1) is a REQUIRED
// field that only accepts its 7 predefined options — sending any other string is
// rejected (HTTP 409). So each of the 14 chatbot products is mapped to the closest
// valid Zoho option here, and the customer's EXACT product choice is additionally
// preserved verbatim in the free-text SingleLine field (see submit()), so nothing
// is lost in the CRM. Valid options confirmed from /Get_Quote_Form/index.html.
const PRODUCT_TO_ZOHO: Record<string, string> = {
  'Portable Cabin': 'MS Porta Cabin',
  'Porta Cabin': 'MS Porta Cabin',
  'Container Office': 'Container Office',
  'Portable Office Cabin': 'MS Porta Cabin',
  'Prefabricated House': 'MS Porta Cabin',
  'Labour Colony': 'Prefab Labor Colony',
  'Labour Hutment': 'Prefab Labor Colony',
  'Portable Toilet': 'Portable Toilets and Security',
  'Security Cabin': 'Portable Toilets and Security',
  'FRP Security Cabin': 'Portable Toilets and Security',
  'PEB Shed': 'PEB Buildings',
  'Warehouse Shed': 'PEB Buildings',
  'Container Cafe': 'Container Cafes',
  'Site Office Cabin': 'Marketing Office',
};

/** Keep only letters/spaces (Zoho Name_First/Name_Last reject other characters). */
function lettersOnly(s: string): string {
  return s.replace(/[^A-Za-zÀ-ɏ ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

// Same PUBLIC form-action URL the site's server API routes already post to.
// This is a public Zoho Forms submission endpoint, NOT a secret/credential.
const ZOHO_FORM_ACTION =
  'https://forms.zohopublic.com/samanportable1/form/GetQuoteForm/formperma/-RQ6B5h5-oglLK1XIN6BcUhddk3Z4msxkoTE5r7OBok/htmlRecords/submit';

const TOTAL_STEPS = 5;
const MIN_FILL_MS = 3000; // Anti-spam: reject completions faster than 3s.

type Status = 'form' | 'submitting' | 'success' | 'error';

interface Props {
  onClose: () => void;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normalise an Indian mobile: strip spaces, leading 0 / +91, validate 6-9 + 9 digits. */
function normaliseMobile(raw: string): string | null {
  const digits = raw.replace(/[\s\-()]/g, '').replace(/^\+91/, '').replace(/^0+/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function compactText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 3))}...`;
}

const ChatbotPanel: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>('form');

  const [product, setProduct] = useState('');
  const [details, setDetails] = useState('');
  const [zone, setZone] = useState<ZoneKey | ''>('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  // Honeypot: real users never see/fill this. If filled → silently drop.
  const [company, setCompany] = useState('');

  const startedAt = useRef<number>(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLSelectElement | HTMLInputElement | null>(null);

  const zoneInfo = zone ? ZONES[zone] : null;

  // Record open time once (client only — Date.now avoided at module scope only).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // ---- Accessibility: focus trap + Escape to close + focus first field on step change ----
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [step, status]);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const goBack = useCallback(() => {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  }, []);

  const next = useCallback(() => {
    setError('');
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }, []);

  // ---- Step validation + progression ----
  const handleStep1 = () => {
    if (!product) {
      setError('Please select a product to continue.');
      return;
    }
    pushDataLayer('chatbot_product_selected', { product: safeText(product) });
    next();
  };

  const handleStep2 = () => {
    if (!zone) {
      setError('Please select your zone to continue.');
      return;
    }
    pushDataLayer('chatbot_zone_selected', { zone });
    next();
  };

  const handleStep3 = () => {
    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    pushDataLayer('chatbot_name_entered');
    next();
  };

  const handleStep4 = () => {
    if (!normaliseMobile(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    pushDataLayer('chatbot_mobile_entered');
    next();
  };

  // `skipEmail` bypasses the email (the Skip button): setEmail('') alone would be
  // stale inside this same tick, so the override is passed explicitly.
  const submit = useCallback(async (skipEmail = false) => {
    setError('');
    const finalEmail = skipEmail ? '' : email.trim();

    // Optional email — validate only if provided.
    if (finalEmail && !emailRegex.test(finalEmail)) {
      setError('That email doesn’t look right. Please check it or skip.');
      return;
    }

    const cleanMobile = normaliseMobile(mobile);
    if (!cleanMobile || !zone || !product || name.trim().length < 2) {
      setError('Some details are missing. Please go back and complete them.');
      return;
    }

    // Anti-spam: honeypot filled OR completed suspiciously fast → drop silently
    // (show the success screen so bots get no signal, but never send the lead).
    const tooFast = Date.now() - startedAt.current < MIN_FILL_MS;
    if (company.trim() || tooFast) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    pushDataLayer('chatbot_submitted', { product: safeText(product), zone });

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const submittedAt = new Date().toISOString();
    const customerEmailProvided = finalEmail ? 'Yes' : 'No';

    // Zoho Name fields reject anything except letters/spaces; Name_Last is
    // mandatory, so fall back to a benign word when the user gave one name.
    const nameParts = lettersOnly(name).split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Enquiry';

    // Pack the lead attributes the Zoho form has no dedicated field for into its
    // free-text SingleLine, matching the existing integration's shape. The exact
    // chatbot product is repeated here because Dropdown1 only accepts Zoho's own
    // 7 option labels (see PRODUCT_TO_ZOHO).
    const singleLine = [
      'Lead Source: Website Chatbot',
      `Product: ${product}`,
      details.trim()
        ? `Requirement: ${compactText(details, 50)}`
        : 'Requirement: (not specified)',
      `Zone: ${zone === 'south' ? 'South Zone' : 'North Zone'}`,
      `Page URL: ${compactText(pageUrl, 70)}`,
      `Submitted At: ${submittedAt}`,
      `Customer Email Provided: ${customerEmailProvided}`,
    ].join(' | ');

    const body = new URLSearchParams();
    body.append('Name_First', firstName);
    body.append('Name_Last', lastName);
    // Country code entry is disabled on the Zoho phone field → plain 10 digits.
    body.append('PhoneNumber_countrycode', cleanMobile);
    // Email is MANDATORY on the Zoho form but optional in the chat flow; when the
    // customer skips it, send a syntactically valid placeholder that the sales
    // team recognises as "not provided" (same domain as their own inbox).
    body.append('Email', finalEmail || 'no-email-given@samanportable.com');
    body.append('Dropdown1', PRODUCT_TO_ZOHO[product] || 'MS Porta Cabin'); // Product (Zoho option)
    body.append('Dropdown', zone === 'south' ? 'South India' : 'North India'); // Region (Zoho option)
    body.append('SingleLine', singleLine);

    try {
      // Public cross-origin form endpoint: use no-cors so the browser sends the
      // POST without a blocked preflight. Response is opaque (can't be read), so a
      // resolved promise = delivered, a thrown error = network failure.
      await fetch(ZOHO_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      pushDataLayer('chatbot_zoho_success', { zone });
      setStatus('success');
    } catch {
      pushDataLayer('chatbot_zoho_failed', { zone });
      setStatus('error');
    }
  }, [email, mobile, zone, product, name, details, company]);

  const restart = useCallback(() => {
    setProduct('');
    setDetails('');
    setZone('');
    setName('');
    setMobile('');
    setEmail('');
    setCompany('');
    setError('');
    setStatus('form');
    setStep(1);
    startedAt.current = Date.now();
  }, []);

  const titleId = 'saman-chatbot-title';

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-end p-0 sm:p-4"
      role="presentation"
    >
      {/* Backdrop — click to close. */}
      <div
        className="absolute inset-0 bg-black/40 motion-safe:transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[560px] sm:max-h-[85vh] sm:w-[380px] sm:rounded-2xl motion-safe:animate-[saman-chat-in_.2s_ease-out]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
          <div className="min-w-0">
            <p id={titleId} className="text-sm font-semibold leading-tight">
              SAMAN Portable — Enquiry
            </p>
            {status === 'form' && (
              <p className="text-xs text-primary-foreground/80">Step {step} of {TOTAL_STEPS}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry chat"
            className="shrink-0 rounded-full p-1.5 text-primary-foreground/90 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Honeypot — visually hidden, off-screen, not announced. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
            <label>
              Company (leave blank)
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
          </div>

          {status === 'form' && (
            <>
              {step === 1 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Let us know your requirement</h2>
                  <label className="block text-sm font-medium text-gray-700">
                    Product
                    <select
                      ref={firstFieldRef as React.RefObject<HTMLSelectElement>}
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select a product…</option>
                      {PRODUCTS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Any size or requirement details? (optional)
                    <input
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g. 20ft x 8ft, 2 rooms, delivery by Aug"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Please select your zone</h2>
                  <label className="block text-sm font-medium text-gray-700">
                    Zone
                    <select
                      ref={firstFieldRef as React.RefObject<HTMLSelectElement>}
                      value={zone}
                      onChange={(e) => setZone(e.target.value as ZoneKey)}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select your zone…</option>
                      <option value="south">{ZONES.south.label}</option>
                      <option value="north">{ZONES.north.label}</option>
                    </select>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Please enter your full name</h2>
                  <input
                    ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep3()}
                    autoComplete="name"
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Please enter your mobile number</h2>
                  <input
                    ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep4()}
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {step === 5 && (
                <div className="space-y-3">
                  <h2 className="text-base font-semibold text-gray-900">Please enter your email address <span className="font-normal text-gray-500">(optional)</span></h2>
                  <input
                    ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              {error && (
                <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>
              )}

              {/* Persistent "call us directly" line from step 2 onward. */}
              {zoneInfo && (
                <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                  Or call us directly:{' '}
                  <a href={`tel:${zoneInfo.primaryTel}`} className="font-semibold text-primary underline underline-offset-2">
                    {zoneInfo.primaryDisplay}
                  </a>
                </p>
              )}
            </>
          )}

          {status === 'submitting' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary motion-reduce:animate-none" aria-hidden="true" />
              <p className="text-sm text-gray-600">Sending your enquiry…</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 pt-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <h2 className="text-base font-semibold text-gray-900">Thanks for showing interest in our products.</h2>
                <p className="text-sm text-gray-600">Our team will contact you shortly.</p>
              </div>
              {zoneInfo && <UrgentSupport zone={zoneInfo} />}
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 pt-2 text-center">
                <h2 className="text-base font-semibold text-gray-900">We couldn’t send that just now.</h2>
                <p className="text-sm text-gray-600">Please call us directly — we’ll help right away.</p>
              </div>
              {zoneInfo && <UrgentSupport zone={zoneInfo} />}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {status === 'form' && (
          <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {step === 1 && details === '' && (
                <button type="button" onClick={handleStep1} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Skip
                </button>
              )}
              {step === 5 && (
                <button type="button" onClick={() => { setEmail(''); submit(true); }} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Skip
                </button>
              )}

              {step === 1 && (
                <PrimaryBtn onClick={handleStep1}>Next</PrimaryBtn>
              )}
              {step === 2 && <PrimaryBtn onClick={handleStep2}>Next</PrimaryBtn>}
              {step === 3 && <PrimaryBtn onClick={handleStep3}>Next</PrimaryBtn>}
              {step === 4 && <PrimaryBtn onClick={handleStep4}>Next</PrimaryBtn>}
              {step === 5 && <PrimaryBtn onClick={() => submit()}>Submit</PrimaryBtn>}
            </div>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
            <button type="button" onClick={restart} className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5">
              Restart Enquiry
            </button>
            <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
          </div>
        )}
      </div>

      {/* Keyframe for the slide-in (motion-safe only). Global-safe, tiny. */}
      <style>{`@keyframes saman-chat-in{from{transform:translateY(12px);opacity:.6}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
};

const PrimaryBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
  >
    {children}
  </button>
);

const UrgentSupport: React.FC<{ zone: ZoneInfo }> = ({ zone }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      Need urgent support? You may reach us below:
    </p>
    <p className="mt-2 text-sm font-medium text-gray-800">
      {zone.key === 'south' ? 'South Zone' : 'North Zone'}
    </p>
    <ul className="mt-1 space-y-1 text-sm">
      <li>
        Mobile:{' '}
        <a href={`tel:${zone.primaryTel}`} className="font-semibold text-primary underline underline-offset-2">{zone.primaryDisplay}</a>
      </li>
      <li>
        Mobile:{' '}
        <a href={`tel:${zone.secondaryTel}`} className="font-semibold text-primary underline underline-offset-2">{zone.secondaryDisplay}</a>
      </li>
      <li>
        Email:{' '}
        <a href={`mailto:${zone.email}`} className="font-semibold text-primary underline underline-offset-2">{zone.email}</a>
      </li>
    </ul>
  </div>
);

export default ChatbotPanel;
