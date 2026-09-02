/* SAMAN cabin calculator progressive enhancement. All content and rates are server-rendered. */
(() => {
  'use strict';

  // LC-05 keeps the complete server-rendered quote-mode calculator in the
  // document, but its enhancement runtime is not needed in the first viewport.
  // Delay only an explicitly opted-in calculator until it approaches the
  // viewport. Every sibling follows the existing immediate enhancement path.
  const deferredCalculator = document.querySelector('[data-cabin-calculator][data-defer-enhancement="true"]');
  if (deferredCalculator && !window.__samanLc05CalculatorActivated) {
    if (window.__samanLc05CalculatorDeferred) return;
    window.__samanLc05CalculatorDeferred = true;

    let deferredObserver;
    const activateLc05Calculator = () => {
      deferredObserver?.disconnect();
      window.__samanLc05CalculatorActivated = true;
      const script = document.createElement('script');
      script.src = '/scripts/cabin-cost-calculator.js?lc05=active';
      script.async = true;
      document.head.appendChild(script);
    };

    const calculator = deferredCalculator;
    if (!calculator || !('IntersectionObserver' in window)) {
      activateLc05Calculator();
      return;
    }

    deferredObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) activateLc05Calculator();
    }, { rootMargin: '600px 0px' });
    deferredObserver.observe(calculator);
    return;
  }

  const RUNTIME_KEY = '__samanCabinCalculatorRuntime';
  if (window[RUNTIME_KEY]) return;
  window[RUNTIME_KEY] = true;

  const STORAGE_KEY = 'saman-cabin-calculator-v9';
  const THEME_KEY = '__theme';
  const DOCUMENT_PRODUCT_MODE_KEY = '__documentProductMode';
  const CONTACT_NAMES = new Set(['firstName', 'lastName', 'phone', 'email', 'company', 'city', 'state', 'notes', 'website', 'message', 'productName', 'pageUrl', 'returnTo']);
  const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const num = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const enabled = (field) => !field.matches(':disabled');
  const controls = (form, name) => Array.from(form.elements).filter((field) => field.name === name && enabled(field));
  const chosen = (form, name) => controls(form, name).find((field) => field.checked) || controls(form, name)[0] || null;
  const source = (field) => field instanceof HTMLSelectElement ? field.options[field.selectedIndex] : field;
  const value = (form, name, fallback = '') => chosen(form, name)?.value ?? fallback;
  const dataNumber = (field, key, fallback = 0) => num(source(field)?.dataset[key], fallback);
  const setText = (root, selector, text) => root.querySelectorAll(selector).forEach((node) => { node.textContent = text; });
  /** A control's own visible name, used when it declares no line label. */
  const labelOf = (field) => {
    if (!field) return '';
    if (field.tagName === 'OPTION') return field.textContent.trim();
    const own = field.closest('label');
    return (own?.querySelector('strong') || own?.querySelector('.choice-title'))?.textContent?.trim() || '';
  };
  const chosenProductField = (form) => chosen(form, 'productId');
  const productLabelOf = (field) => source(field)?.dataset?.label || labelOf(field) || 'Cabin';

  /**
   * Repaint the itemised estimate.
   *
   * The panel used to be server-rendered once and never touched: only the two
   * total figures moved, so a buyer could add four fittings and watch the list
   * below them stay exactly as it was at page load. The subtotal and GST labels
   * are read from the markup the server produced, never authored here.
   */
  const LINE_LABELS = new WeakMap();
  function renderEstimateLines(root, lines, transportNote, total, gst, quoteOnly) {
    // EVERY itemised list, not the first one.
    //
    // This was querySelector, singular. The page renders two estimate panels -
    // the sidebar, which is the one a buyer looks at through steps 1 to 8, and
    // a second copy inside step 9. The sidebar comes SECOND in the DOM, so the
    // singular selector updated the hidden panel and left the visible one at
    // whatever the server rendered at page load.
    //
    // What that looked like on screen: set the size to 8x6 and the sidebar
    // showed the line "Base cabin 20x10 ft  Rs 2,00,000" directly above its own
    // total of Rs 70,980. The totals were right - setText has always used
    // querySelectorAll - so the panel contradicted itself by Rs 1,29,020, and
    // its printed subtotal disagreed with the total two rows below it.
    //
    // Every estimate surface now repaints from this one call. LINE_LABELS is
    // keyed by the list element, so each panel keeps its own server-rendered
    // subtotal and GST labels rather than borrowing the other panel's.
    const lists = root.querySelectorAll('[data-estimate-lines]');
    if (!lists.length) return;
    const money = (amount) => (amount === null ? 'in quotation' : INR.format(amount));
    const row = (label, text, marker) => {
      const div = document.createElement('div');
      if (marker) div.setAttribute('data-estimate-line', '');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = text;
      div.append(dt, dd);
      return div;
    };
    lists.forEach((list) => {
      if (!LINE_LABELS.has(list)) {
        const tails = Array.from(list.children).slice(-2).map((item) => item.querySelector('dt')?.textContent || '');
        LINE_LABELS.set(list, { subtotal: tails[0] || '', gst: tails[1] || '' });
      }
      const { subtotal, gst: gstLabel } = LINE_LABELS.get(list);
      const next = document.createDocumentFragment();
      lines.forEach((line) => next.append(row(line.label, money(line.amount), true)));
      if (transportNote) next.append(row('Transport', transportNote, false));
      next.append(row(subtotal, quoteOnly ? 'in quotation' : INR.format(total), false));
      next.append(row(gstLabel, quoteOnly ? 'in quotation' : INR.format(gst), false));
      list.replaceChildren(next);
    });
  }
  const track = (event, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  };
  const notice = (root, text, restore = false) => {
    const node = root.querySelector(restore ? '[data-restore-banner]' : '[data-calculator-notice]');
    if (!node) return;
    node.textContent = text;
    node.hidden = false;
  };
  const message = (root, key) => root.querySelector(`[data-message="${key}"]`)?.textContent?.trim() || '';
  const pathFor = (name) => name.replace(/\]/g, '').split('[');
  const getPath = (object, name) => pathFor(name).reduce((current, key) => current?.[key], object);
  const setPath = (object, name, savedValue) => {
    const path = pathFor(name);
    let current = object;
    path.forEach((key, index) => {
      if (index === path.length - 1) current[key] = savedValue;
      else {
        const nextIsIndex = /^\d+$/.test(path[index + 1]);
        current[key] = current[key] || (nextIsIndex ? [] : {});
        current = current[key];
      }
    });
  };

  function readConfiguration(form) {
    const result = {};
    const names = new Set(Array.from(form.elements).filter(enabled).map((field) => field.name).filter(Boolean));
    names.forEach((name) => {
      if (CONTACT_NAMES.has(name) || name === 'configuration' || name === 'estimate') return;
      const fields = controls(form, name);
      const first = fields[0];
      if (first.type === 'radio') {
        const checked = fields.find((field) => field.checked);
        if (checked) setPath(result, name, checked.value);
      } else if (first.type === 'checkbox') {
        setPath(result, name, fields.length === 1 ? first.checked : fields.filter((field) => field.checked).map((field) => field.value));
      } else setPath(result, name, first.value);
    });
    return result;
  }

  function readSavedConfiguration(form, root) {
    return {
      ...readConfiguration(form),
      [THEME_KEY]: root?.dataset?.theme || 'light',
      [DOCUMENT_PRODUCT_MODE_KEY]: root?.dataset?.documentProductMode || 'selected',
    };
  }

  function applySavedTheme(root, saved) {
    const candidate = saved?.[THEME_KEY];
    if (candidate === 'light' || candidate === 'green') {
      root.dataset.theme = candidate;
    }
  }

  function applySavedDocumentProductMode(root, saved) {
    const candidate = saved?.[DOCUMENT_PRODUCT_MODE_KEY];
    root.dataset.documentProductMode = candidate === 'general' ? 'general' : 'selected';
  }

  function applyConfiguration(form, saved) {
    [['door', saved?.doors?.length], ['window', saved?.windows?.length]].forEach(([kind, count]) => {
      form.querySelectorAll(`[data-reserved-${kind}]`).forEach((slot, index) => {
        if (index < Math.max(0, num(count) - (kind === 'door' ? 1 : 2))) {
          slot.hidden = false;
          slot.disabled = false;
        }
      });
    });
    const names = new Set(Array.from(form.elements).filter(enabled).map((field) => field.name).filter(Boolean));
    names.forEach((name) => {
      if (CONTACT_NAMES.has(name)) return;
      const savedValue = getPath(saved, name);
      if (savedValue === undefined) return;
      controls(form, name).forEach((field) => {
        if (field.type === 'radio') field.checked = String(field.value) === String(savedValue);
        else if (field.type === 'checkbox') field.checked = Array.isArray(savedValue)
          ? savedValue.map(String).includes(field.value) : Boolean(savedValue);
        else if (typeof savedValue === 'string' || typeof savedValue === 'number') field.value = String(savedValue);
      });
    });
  }

  function encodeDesign(config) {
    const bytes = new TextEncoder().encode(JSON.stringify(config));
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function configuredUrl(form) {
    const url = new URL(window.location.href);
    url.searchParams.set('design', encodeDesign(readConfiguration(form)));
    url.hash = '';
    return url.toString();
  }

  /*
   * The band's CTA scrolls to the calculator already on this page. It never
   * navigates: sending the buyer to /cabin-cost-calculator threw away the
   * product context and their scroll position, and the back button then landed
   * them at the top of the product page rather than where they left it.
   *
   * The embed lives inside a <details>, so it has to be opened before the
   * scroll or the target has no height and the page jumps to the wrong place.
   * The hash is pushed so the position is shareable and back-button safe, and
   * focus lands on the first control so the keyboard follows the eye.
   */
  /*
   * The calculator is revealed by the CTA, not merely scrolled to.
   *
   * The SERVER renders it open, so a reader without JavaScript gets the whole
   * working calculator and the anchor still jumps to it. This script collapses
   * it on load instead - which means the closed state only ever exists where
   * there is something able to open it again.
   *
   * Arriving with #cabin-calculator in the URL opens it immediately, so a
   * shared link lands on an open designer.
   */
  const CLOSE_LABEL = 'Close the designer';

  function calculatorToggle() {
    const section = document.getElementById('cabin-calculator');
    const cta = document.querySelector('[data-calculator-entry] [data-copy-slot="cta"]');
    // No-prefill product pages deliberately have no entry band. With no CTA
    // there is nothing that can reopen a collapsed calculator, so those pages
    // retain the server-rendered open state.
    return section && cta ? { section, cta } : null;
  }

  function setCalculatorOpen(open) {
    const parts = calculatorToggle();
    if (!parts) return;
    const { section, cta } = parts;
    if (open) section.removeAttribute('hidden');
    else section.setAttribute('hidden', '');
    if (!cta) return;
    cta.setAttribute('aria-expanded', String(open));
    if (!cta.dataset.openLabel) cta.dataset.openLabel = cta.textContent.trim();
    cta.textContent = open ? CLOSE_LABEL : cta.dataset.openLabel;
  }

  // Collapse on load unless the URL asks for it open.
  if (calculatorToggle()) setCalculatorOpen(window.location.hash === '#cabin-calculator');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-calculator-entry] a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();

    // Second click closes it again, and takes the hash back off so the URL
    // never claims a state the page is not in.
    if (!target.hasAttribute('hidden') && link.getAttribute('aria-expanded') === 'true') {
      setCalculatorOpen(false);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', window.location.pathname + window.location.search);
      }
      link.focus({ preventScroll: true });
      return;
    }

    setCalculatorOpen(true);
    // Open only a details that actually WRAPS the calculator. A blind
    // querySelector('details') would find the freight ladder inside the
    // calculator and force that open instead.
    const holder = target.closest('details')
      || Array.from(target.querySelectorAll('details')).find((d) => d.querySelector('[data-cabin-calculator]'));
    if (holder) holder.open = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${id}`);
    } else {
      window.location.hash = id;
    }
    const settle = reduced ? 0 : 420;
    window.setTimeout(() => {
      /*
       * The first control a keyboard would reach, and the calculator itself if
       * there is none. Querying only for inputs inside the active step landed
       * on nothing and left focus on <body>: on this route the calculator sits
       * in a <details> that has only just been opened, and its first controls
       * are visually-hidden radios that a plain `input` query walked straight
       * past when the step had not been marked active yet.
       */
      const calc = target.querySelector('[data-cabin-calculator]') || target;
      const first = Array.from(calc.querySelectorAll('input, select, textarea, button, a[href]'))
        .find((el) => !el.disabled && el.getClientRects().length + (el.type === 'radio' ? 1 : 0) > 0);
      if (first) {
        first.focus({ preventScroll: true });
      } else if (calc) {
        if (!calc.hasAttribute('tabindex')) calc.setAttribute('tabindex', '-1');
        calc.focus({ preventScroll: true });
      }
    }, settle);
  });

  function showStep(root, step, focus) {
    const sections = Array.from(root.querySelectorAll('[data-step]'));
    const available = sections.map((section) => num(section.dataset.step));
    const target = available.includes(step) ? step : available[0];
    sections.forEach((section) => {
      const active = num(section.dataset.step) === target;
      section.hidden = !active;
      section.setAttribute('aria-hidden', String(!active));
      section.classList.toggle('is-active', active);
    });
    root.querySelectorAll('[data-step-link]').forEach((link) => {
      const active = num(link.dataset.stepLink) === target;
      link.setAttribute('aria-current', active ? 'step' : 'false');
      link.classList.toggle('is-active', active);
    });
    root.dataset.currentStep = String(target);
    const activeSection = sections.find((section) => num(section.dataset.step) === target);

    // Step counter, progress bar and the Back/Next affordances.
    const position = available.indexOf(target) + 1;
    const totalSteps = available.length;
    setText(root, '[data-step-current]', String(position));
    // The counter reads "Step 3 of 9" and nothing else. It used to repeat the
    // step name, word for word, one line above the step's own heading.
    const progress = root.querySelector('[data-step-progress]');
    if (progress) {
      progress.setAttribute('aria-valuenow', String(position));
      progress.setAttribute('aria-valuemax', String(totalSteps));
      const fill = progress.querySelector('[data-step-progress-fill]');
      if (fill) fill.style.width = `${Math.round((position / totalSteps) * 100)}%`;
    }
    root.querySelectorAll('[data-action="back"]').forEach((button) => { button.disabled = position <= 1; });
    root.querySelectorAll('[data-action="next"]').forEach((button) => { button.hidden = position >= totalSteps; });
    if (focus) activeSection?.focus({ preventScroll: false });
    track('step_view', { step_number: target, step_name: activeSection?.querySelector('h2')?.textContent || '' });
  }

  /**
   * SAMAN's base-cabin rate card, read from the root element the server wrote
   * it on. Ruling of 06 Aug 2026; the implementation it mirrors is
   * src/lib/baseCabinRateCard.ts and the two must never be edited apart.
   *
   *   base cabin price = floor area (L x W) x per-sq-ft rate, ex-GST
   *
   * Returns null where SAMAN has stated no rate — a floor area at or under
   * 50 sq ft that is not one of the five fixed sizes. Null means the estimate
   * asks; it never means zero and it never means "interpolate".
   *
   * This replaced two things at once: the six area-band multipliers, and
   * publishedPrice(), which read the base off the page's own price table. That
   * table publishes the FINISHED product with every fitting in it, so the
   * estimate opened at the finished price and then charged for the fittings a
   * second time as the buyer added them. The table still renders; it is no
   * longer the base.
   */
  function pairs(text) {
    return String(text || '').split(';').filter(Boolean).map((entry) => {
      const [key, value] = entry.split('=');
      return [key, Number(value)];
    });
  }

  /**
   * The monotonic cap: no cabin may cost more than a larger cabin.
   *
   *   price(a) = min( raw(a), raw(e) for every anchor e >= a )
   *
   * The anchor prices arrive already resolved from the server
   * (50=60000;70=80500;...) so the arithmetic that decides them lives in one
   * place. The cap only ever lowers a figure, so it cannot create an overcharge.
   */
  function applyCap(root, area, rawBase) {
    let ceiling = Infinity;
    pairs(root.dataset.baseCap).forEach(([anchor, price]) => {
      if (Number(anchor) >= area) ceiling = Math.min(ceiling, price);
    });
    return Math.min(rawBase, ceiling);
  }

  function baseCabinRate(root, length, width) {
    if (!(length > 0) || !(width > 0)) return null;
    const fixed = pairs(root.dataset.baseFixed);
    const match = fixed.find(([key]) => {
      const [l, w] = key.split('x').map(Number);
      return (l === length && w === width) || (l === width && w === length);
    });
    if (match) {
      const fixedArea = length * width;
      return { rate: match[1], base: applyCap(root, fixedArea, Math.round(fixedArea * match[1])) };
    }

    const area = length * width;
    const floor = num(root.dataset.baseUnratedCeiling, 36);
    // Below the floor only the fixed sizes exist. Everything else asks.
    if (area < floor) return null;

    // The 36-50 slide (rate card v2). The rate is carried at full precision and
    // only the total is rounded — rounding the rate re-introduces the very
    // inversions the slide exists to remove.
    const slide = String(root.dataset.baseSlide || '').split(';').filter(Boolean)
      .map((entry) => {
        const [span, rates] = entry.split('=');
        const [fromArea, toArea] = span.split(':').map(Number);
        const [fromRate, toRate] = rates.split(':').map(Number);
        return { fromArea, toArea, fromRate, toRate };
      })
      .find((s) => area > s.fromArea && area <= s.toArea);
    if (slide) {
      const rate = slide.fromRate
        + (area - slide.fromArea) * ((slide.toRate - slide.fromRate) / (slide.toArea - slide.fromArea));
      return { rate, base: applyCap(root, area, Math.round(area * rate)) };
    }
    // Exactly at the floor with dimensions other than the fixed size's.
    if (area === floor) {
      const anchor = num(String(root.dataset.baseSlide || '').split('=')[1]?.split(':')[0]);
      if (anchor) return { rate: anchor, base: applyCap(root, area, Math.round(area * anchor)) };
    }

    // Exclusive upper edges: SAMAN ruled that the edge takes the CHEAPER rate,
    // so exactly 70 sq ft is priced at 1150 and never at 1200.
    const band = pairs(root.dataset.baseBands).find(([edge]) => area < Number(edge));
    const rate = band ? band[1] : num(root.dataset.baseBandTop);
    if (!rate) return null;
    return { rate, base: applyCap(root, area, Math.round(area * rate)) };
  }

  /** PC-01 reads the exact maintained variant price already rendered by SSR. */
  function selectedVariantPrice(root, length, width) {
    const rows = Array.from(root.querySelectorAll('[data-published-size]'));
    const row = rows.find((entry) => {
      const rowLength = dataNumber(entry, 'length');
      const rowWidth = dataNumber(entry, 'width');
      return (rowLength === length && rowWidth === width)
        || (rowLength === width && rowWidth === length);
    });
    return row ? dataNumber(row, 'priceExGst', NaN) : null;
  }

  function isPublishedBaseIncludedWindow(root, form, type, index) {
    const included = String(root.dataset.publishedBaseIncludedWindows || '')
      .split(';')
      .filter(Boolean)
      .map((entry) => entry.split('|'))
      .find((entry) => entry[0] === String(index));
    if (!included) return false;
    return type.value === included[1]
      && num(value(form, `windows[${index}][width]`)) === num(included[2])
      && num(value(form, `windows[${index}][height]`)) === num(included[3])
      && value(form, `windows[${index}][track]`) === included[4];
  }

  /**
   * Moves the door and window markers the server drew to the positions the
   * form currently holds. Previously this only resized the shell, so after any
   * placement change the drawing contradicted the form until a reload —
   * measured as planChangedOnDoorMove: false.
   */
  function repositionOpenings(svg, form, x, y, planWidth, planHeight) {
    const point = (wall, pos) => {
      const ratio = Math.max(0, Math.min(100, pos)) / 100;
      if (wall === 'Front') return [x + planWidth * ratio, y + planHeight];
      if (wall === 'Rear') return [x + planWidth * ratio, y];
      if (wall === 'Left') return [x, y + planHeight * ratio];
      return [x + planWidth, y + planHeight * ratio];
    };
    const place = (kind) => {
      svg.querySelectorAll('[data-opening="' + kind + '"]').forEach((node) => {
        const index = num(node.dataset.openingIndex, 0);
        const wall = value(form, kind + 's[' + index + '][wall]', 'Front');
        const end = value(form, kind + 's[' + index + '][end]', 'Left');
        const distance = num(value(form, kind + 's[' + index + '][distance]', 0), 0);
        const span = (wall === 'Front' || wall === 'Rear')
          ? num(value(form, 'length', 20), 20)
          : num(value(form, 'width', 10), 10);
        const along = end === 'Left' ? distance : Math.max(0, span - distance);
        const pct = span > 0 ? (along / span) * 100 : 0;
        const [cx, cy] = point(wall, pct);
        if (node.tagName === 'circle') { node.setAttribute('cx', String(cx)); node.setAttribute('cy', String(cy)); }
        else { node.setAttribute('x', String(cx - 4)); node.setAttribute('y', String(cy - 4)); }
      });
    };
    place('door');
    place('window');
  }

  /* ===================== EVENT 3 · the drawing engine =====================
   *
   * Three views off one geometry, redrawn from scratch on every change. The
   * previous version moved one rectangle and left the four elevations as empty
   * grey boxes, which is what "the elevations are broken" meant: they had never
   * been drawn at all.
   *
   * The numbers here are the same ones drawGeometry() computes on the server,
   * and verify-drawing.mjs compares a browser redraw against a fresh server
   * render of the same configuration - so this cannot quietly drift the way the
   * pricing maths did.
   */
  const VIEW_W = 420;
  const VIEW_H = 260;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const WALL_ORDER = ['Front', 'Rear', 'Left', 'Right'];

  const feetInches = (v) => {
    const whole = Math.floor(v);
    const inches = Math.round((v - whole) * 12);
    return inches === 12 ? `${whole + 1}' 0"` : `${whole}' ${inches}"`;
  };

  const svgEl = (name, attrs, text) => {
    const node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach((key) => node.setAttribute(key, String(attrs[key])));
    if (text !== undefined) node.textContent = String(text);
    return node;
  };

  /** Read the whole drawing's inputs out of the form, once. */
  function readGeometry(form) {
    const length = num(value(form, 'length', 20), 20);
    const width = num(value(form, 'width', 10), 10);
    const height = num(value(form, 'height', 8.5), 8.5);
    const rooms = Math.max(1, num(value(form, 'rooms', 1), 1));
    const supplied = Array.from(form.querySelectorAll('[data-room-length]'))
      .slice(0, rooms).map((el) => num(el.value, 0)).filter((n) => n > 0);
    const equal = length / rooms;
    const lengths = supplied.length === rooms ? supplied : Array.from({ length: rooms }, () => equal);
    const sum = lengths.reduce((a, b) => a + b, 0) || length;
    const roomLengths = lengths.map((n) => (n / sum) * length);
    const openings = (kind) => Array.from(form.querySelectorAll(`[name^="${kind}s["][name$="[wall]"]`))
      .filter(enabled).map((wallField, index) => {
        const wall = wallField.value || 'Front';
        const end = value(form, `${kind}s[${index}][end]`, 'Left');
        const distance = num(value(form, `${kind}s[${index}][distance]`, 0), 0);
        const span = wall === 'Front' || wall === 'Rear' ? length : width;
        const along = end === 'Left' ? distance : Math.max(0, span - distance);
        return {
          index,
          code: `${kind === 'door' ? 'D' : 'W'}${index + 1}`,
          wall,
          position: span > 0 ? (along / span) * 100 : 0,
          width: num(value(form, `${kind}s[${index}][width]`, 3), 3),
          height: num(value(form, `${kind}s[${index}][height]`, 3), 3),
        };
      });
    return {
      length,
      width,
      height,
      rooms,
      roomLengths,
      carpetAreaSqft: Math.max(0, length * width - (rooms - 1) * 0.25 * width),
      doors: openings('door'),
      windows: openings('window'),
      roof: value(form, 'roof', 'Sloped'),
    };
  }

  const planFrame = (g, pad) => {
    const scale = Math.min((VIEW_W - pad * 2) / Math.max(6, g.length), (VIEW_H - pad * 2) / Math.max(6, g.width));
    const w = g.length * scale;
    const h = g.width * scale;
    return { scale, w, h, x: (VIEW_W - w) / 2, y: (VIEW_H - h) / 2 };
  };
  const wallPointAt = (f, wall, position) => {
    const r = Math.min(1, Math.max(0, position / 100));
    if (wall === 'Front') return [f.x + f.w * r, f.y + f.h];
    if (wall === 'Rear') return [f.x + f.w * r, f.y];
    if (wall === 'Left') return [f.x, f.y + f.h * r];
    return [f.x + f.w, f.y + f.h * r];
  };

  function drawPlanView(group, g) {
    const f = planFrame(g, 54);
    const next = document.createDocumentFragment();
    next.append(svgEl('rect', { x: f.x, y: f.y, width: f.w, height: f.h, class: 'dw-shell' }));
    let run = 0;
    g.roomLengths.slice(0, -1).forEach((roomLength) => {
      run += roomLength;
      const at = f.x + (run / g.length) * f.w;
      next.append(svgEl('line', { x1: at, y1: f.y, x2: at, y2: f.y + f.h, class: 'dw-partition' }));
    });
    g.doors.concat(g.windows).forEach((item, i) => {
      const isDoor = i < g.doors.length;
      const [cx, cy] = wallPointAt(f, item.wall, item.position);
      // A real break in the wall, with a swing arc on a door. The browser draws
      // what the server draws; a circle sitting on the line is not a plan.
      const horizontal = item.wall === 'Front' || item.wall === 'Rear';
      const half = isDoor ? 7 : 8;
      const inward = item.wall === 'Front' ? -1 : item.wall === 'Rear' ? 1 : 0;
      const inwardX = item.wall === 'Left' ? 1 : item.wall === 'Right' ? -1 : 0;
      next.append(horizontal
        ? svgEl('line', { x1: cx - half, y1: cy, x2: cx + half, y2: cy, class: 'dw-break' })
        : svgEl('line', { x1: cx, y1: cy - half, x2: cx, y2: cy + half, class: 'dw-break' }));
      if (isDoor) {
        const ex = cx - half + inwardX * half * 2;
        const ey = cy + inward * half * 2;
        next.append(svgEl('path', {
          d: `M ${cx - half} ${cy} A ${half * 2} ${half * 2} 0 0 1 ${inwardX ? ex : cx + half} ${inwardX ? ey : ey}`,
          class: 'dw-swing',
        }));
        next.append(svgEl('line', { x1: cx - half, y1: cy, x2: ex, y2: ey, class: 'dw-door-leaf' }));
      } else {
        next.append(horizontal
          ? svgEl('line', { x1: cx - half, y1: cy, x2: cx + half, y2: cy, class: 'dw-window' })
          : svgEl('line', { x1: cx, y1: cy - half, x2: cx, y2: cy + half, class: 'dw-window' }));
      }
      const lx = item.wall === 'Left' ? cx - 12 : item.wall === 'Right' ? cx + 12 : cx;
      const ly = item.wall === 'Rear' ? cy - 8 : item.wall === 'Front' ? cy + 14 : cy - 8;
      next.append(svgEl('text', { x: lx, y: ly, class: 'dw-code' }, item.code));
    });
    const dimY = f.y + f.h + 24;
    const dimX = f.x - 26;
    next.append(svgEl('line', { x1: f.x, y1: dimY, x2: f.x + f.w, y2: dimY, class: 'dw-dim' }));
    next.append(svgEl('text', { x: f.x + f.w / 2, y: dimY - 5, class: 'dw-dim-text', 'data-dim-length': '' }, feetInches(g.length)));
    next.append(svgEl('line', { x1: dimX, y1: f.y, x2: dimX, y2: f.y + f.h, class: 'dw-dim' }));
    // Rotated, not right-aligned into the margin: at anchor end it ran off
    // the left of the viewBox and the width read as a clipped stub.
    next.append(svgEl('text', {
      x: dimX - 6, y: f.y + f.h / 2, class: 'dw-dim-text',
      transform: `rotate(-90  )`, 'data-dim-width': '',
    }, feetInches(g.width)));
    next.append(svgEl('text', { x: VIEW_W / 2, y: 18, class: 'dw-title' }, '2D Plan'));
    group.replaceChildren(next);
  }

  function drawFloorView(group, g) {
    const f = planFrame(g, 40);
    const next = document.createDocumentFragment();
    next.append(svgEl('rect', { x: f.x, y: f.y, width: f.w, height: f.h, class: 'dw-shell' }));
    let run = 0;
    g.roomLengths.forEach((roomLength, index) => {
      const bx = f.x + (run / g.length) * f.w;
      const bw = (roomLength / g.length) * f.w;
      run += roomLength;
      const room = svgEl('g', { class: 'dw-room', 'data-room': index + 1 });
      room.append(svgEl('rect', { x: bx + 2, y: f.y + 2, width: Math.max(0, bw - 4), height: f.h - 4, class: 'dw-room-fill' }));
      room.append(svgEl('text', { x: bx + bw / 2, y: f.y + f.h / 2 - 4, class: 'dw-room-code' }, `R${index + 1}`));
      // Short label, never a dimension string. Dimensions belong to the 2D
      // Plan; repeating them here made the two views read as the same drawing
      // with different fills.
      room.append(svgEl('text', { x: bx + bw / 2, y: f.y + f.h / 2 + 11, class: 'dw-room-size' }, `Room ${index + 1}`));
      next.append(room);
    });
    next.append(svgEl('text', { x: VIEW_W / 2, y: 18, class: 'dw-title' }, 'Floor Plan'));
    group.replaceChildren(next);
  }

  function drawElevationsView(group, g) {
    const cellW = 186;
    const cellH = 100;
    const next = document.createDocumentFragment();
    WALL_ORDER.forEach((wall, i) => {
      const col = i % 2;
      const row = i < 2 ? 0 : 1;
      const ox = 18 + col * (cellW + 22);
      const oy = 30 + row * (cellH + 34);
      const spanFt = wall === 'Front' || wall === 'Rear' ? g.length : g.width;
      const scale = Math.min(cellW / Math.max(6, spanFt), cellH / Math.max(6, g.height));
      const w = spanFt * scale;
      const h = g.height * scale;
      const x = ox + (cellW - w) / 2;
      const y = oy + (cellH - h);
      const cell = svgEl('g', { class: 'dw-elevation', 'data-elevation': wall });
      cell.append(svgEl('rect', { x, y, width: w, height: h, class: 'dw-shell' }));
      cell.append(g.roof === 'Sloped'
        ? svgEl('polyline', { points: `${x},${y} ${x + w / 2},${y - 10} ${x + w},${y}`, class: 'dw-roof' })
        : svgEl('line', { x1: x, y1: y - 4, x2: x + w, y2: y - 7, class: 'dw-roof' }));
      g.doors.filter((d) => d.wall === wall).forEach((d) => {
        const cx = x + w * (d.position / 100);
        const dh = Math.min(h * 0.82, 7 * scale);
        cell.append(svgEl('rect', { x: cx - 1.6 * scale, y: y + h - dh, width: 3.2 * scale, height: dh, class: 'dw-door' }));
        cell.append(svgEl('text', { x: cx, y: y + h - dh - 3, class: 'dw-code' }, d.code));
      });
      g.windows.filter((item) => item.wall === wall).forEach((item) => {
        const cx = x + w * (item.position / 100);
        const ww = item.width * scale;
        const wh = item.height * scale;
        const wy = y + h - wh - Math.min(h * 0.3, 3 * scale);
        cell.append(svgEl('rect', { x: cx - ww / 2, y: wy, width: ww, height: wh, class: 'dw-window' }));
        cell.append(svgEl('text', { x: cx, y: wy - 3, class: 'dw-code' }, item.code));
      });
      cell.append(svgEl('text', { x: ox + cellW / 2, y: oy + cellH + 16, class: 'dw-elevation-label' }, `${wall} elevation`));
      next.append(cell);
    });
    next.append(svgEl('text', { x: VIEW_W / 2, y: 18, class: 'dw-title' }, '4 Elevations'));
    group.replaceChildren(next);
  }

  /** Keep one length box per room, so changing the room count changes the form. */
  function syncRoomLengthInputs(root, form, g) {
    root.querySelectorAll('[data-room-lengths]').forEach((holder) => {
      const boxes = Array.from(holder.querySelectorAll('[data-room-length]'));
      if (boxes.length === g.rooms) return;
      const button = holder.querySelector('[data-action="distribute-rooms"]');
      holder.querySelectorAll('label').forEach((label) => label.remove());
      const next = document.createDocumentFragment();
      for (let i = 0; i < g.rooms; i += 1) {
        const label = document.createElement('label');
        label.append(document.createTextNode(`Room ${i + 1} length in ft`));
        const input = document.createElement('input');
        input.type = 'number';
        input.inputMode = 'decimal';
        // step="any". An equal split of 20 ft across 6 rooms is 3.33 ft, and a
        // half-foot step made every such box invalid - which made the whole
        // form invalid, so the quotation could not be submitted at all.
        input.min = '0';
        input.max = '60';
        input.step = 'any';
        input.name = `roomLengths[${i}]`;
        input.dataset.roomLength = String(i);
        input.value = (g.roomLengths[i] || 0).toFixed(1);
        label.append(input);
        next.append(label);
      }
      holder.insertBefore(next, button || null);
    });
  }

  function updatePlan(root, length, width, area, planView, form) {
    if (!form) return null;
    const g = readGeometry(form);
    syncRoomLengthInputs(root, form, g);
    /*
     * The drawing renders in three places - step 2, step 5 and step 6 - and all
     * nine tabs share the radio name "planView". That makes them one radio
     * group, so only one of the nine was ever checked: the other two viewers
     * showed no tab selected at all, and clicking one silently deselected
     * another. One preference across all three viewers is the right behaviour,
     * so the preference is kept and every viewer is shown holding it.
     */
    root.querySelectorAll('[name="planView"]').forEach((radio) => {
      radio.checked = radio.value === planView;
    });
    root.querySelectorAll('[data-floor-plan]').forEach((svg) => {
      svg.dataset.view = planView;
      svg.setAttribute('aria-label',
        `Cabin drawing, ${length} by ${width} feet, ${area} square feet: 2D plan, floor plan and four elevations`);
      svg.querySelectorAll('[data-plan-view]').forEach((group) => {
        /*
         * setAttribute, not `.hidden`.
         *
         * `hidden` is an IDL attribute of HTMLElement. These groups are SVG
         * elements, so `group.hidden = true` set a plain JS property on them
         * and changed nothing on screen. The server-rendered `hidden` content
         * attribute was the only thing controlling display, and it was never
         * touched again - so the 2D Plan stayed visible and the other two
         * stayed hidden no matter which tab was clicked. The tab did change
         * the radio, the dataset and the redraw; the picture could not follow.
         */
        if (group.dataset.planView === planView) group.removeAttribute('hidden');
        else group.setAttribute('hidden', '');
        if (group.dataset.planView === 'plan') drawPlanView(group, g);
        else if (group.dataset.planView === 'floor') drawFloorView(group, g);
        else drawElevationsView(group, g);
      });
    });
    setText(root, '[data-carpet-area]', `${Math.round(g.carpetAreaSqft).toLocaleString('en-IN')} sq ft`);

    // Only the chosen room's socket panel renders. Eight panels stacked was
    // most of what made this step a pole.
    const activeRoom = value(form, 'socketRoom', '0');
    root.querySelectorAll('[data-socket-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.socketPanel !== String(activeRoom);
    });
    // A card with a quantity above zero reads as chosen, on the amber border
    // the rest of the calculator uses. Never a fill.
    root.querySelectorAll('.ec-card').forEach((card) => {
      const field = card.querySelector('input[type="number"]');
      card.classList.toggle('is-filled', Number(field?.value) > 0);
    });
    // A stepper at its limit says so. Without this the button still depresses
    // and nothing happens, which reads as the control being broken.
    root.querySelectorAll('.ec-stepper').forEach((stepper) => {
      const field = stepper.querySelector('input[type="number"]');
      if (!field) return;
      const value = Number(field.value) || 0;
      const min = field.min === '' ? -Infinity : Number(field.min);
      const max = field.max === '' ? Infinity : Number(field.max);
      const down = stepper.querySelector('[data-action="qty-down"]');
      const up = stepper.querySelector('[data-action="qty-up"]');
      if (down) down.disabled = value <= min;
      if (up) up.disabled = value >= max;
    });
    root.querySelectorAll('.quantity-row').forEach((row) => {
      const field = row.querySelector('input[type="number"]');
      row.classList.toggle('is-filled', Number(field?.value) > 0);
    });
    return g;
  }

  function calculate(root, form) {
    const product = chosen(form, 'productId');
    const productId = value(form, 'productId', 'porta-cabin');
    const colony = ['labour-colony', 'labor-sheds', 'labor-hutments', 'prefab-labor-camps'].includes(productId);
    const length = num(value(form, 'length', 20), 20);
    const width = num(value(form, 'width', 10), 10);
    const height = num(value(form, 'height', 8.5), 8.5);
    const quantity = Math.max(1, num(value(form, 'quantity', 1), 1));
    const colonyVariant = chosen(form, 'colonyVariant');
    const area = colony ? dataNumber(colonyVariant, 'area', dataNumber(colonyVariant, 'areaSqft')) : length * width;
    // Two ways an estimate carries no number, and they are different things:
    // the PRODUCT prices on drawing (Security Cabins), or the SIZE has no rate
    // in SAMAN's card (a floor area at or under 50 sq ft that is not one of the
    // five fixed sizes). Both render quote mode; neither invents a figure.
    const quoteProduct = source(product)?.dataset.quoteOnly === 'true';
    const selectedVariantAuthority = root.dataset.selectedVariantPriceBase === 'true';
    const publishedBase = selectedVariantAuthority ? selectedVariantPrice(root, length, width) : null;
    const rateCard = colony
      ? null
      : selectedVariantAuthority
        ? (publishedBase === null || Number.isNaN(publishedBase) ? null : { base: publishedBase })
        : baseCabinRate(root, length, width);
    const quoteOnly = quoteProduct || (!colony && rateCard === null);
    let base = colony
      ? dataNumber(colonyVariant, 'price', dataNumber(colonyVariant, 'priceExGst')) * quantity
      : (rateCard ? rateCard.base * quantity : 0);
    if (quoteOnly) base = 0;
    let total = base;
    const wallArea = 2 * (length + width) * height;

    const lines = [];
    const addLine = (label, amount) => {
      lines.push({ label, amount });
      if (amount !== null) total += amount;
    };
    lines.push({
      label: quoteOnly
        ? `${productLabelOf(chosenProductField(form))} base`
        : colony
          ? `${labelOf(colonyVariant)} × ${quantity}`
          : `Base cabin ${length}×${width} ft${quantity > 1 ? ` × ${quantity}` : ''}`,
      amount: quoteOnly ? null : base,
    });

    if (!colony && !quoteOnly) {
      if (height > 8.5) {
        addLine(`Height ${height} ft`,
          Math.round((base / quantity) * num(root.dataset.heightRatePerFoot) * (height - 8.5)) * quantity);
      }
      const rooms = Math.max(1, num(value(form, 'rooms', 1), 1));
      if (rooms > 1) {
        addLine(`${rooms} rooms, ${rooms - 1} partitions`,
          Math.round((rooms - 1) * width * 8.5 * num(root.dataset.partitionRate) * quantity));
      }

      /*
       * Every priced control, priced from what it declares about itself.
       *
       * This replaced six hard-coded control names. Those names had drifted
       * from the renderer - wallFinish, ceiling and flooring no longer existed,
       * and frame, wallBuild and insulation had never been added - so six
       * groups of chips selected correctly and were then never priced. Naming
       * controls here is what made that possible, so the script stops doing it.
       *
       * A control is priced if it carries data-rate and data-rate-basis. It is
       * counted when it is the checked radio, the selected option, or a
       * quantity above zero. Openings are excluded because a window's rate
       * multiplies by its own width, height and track, which no basis can
       * express; that block is directly below and stays bespoke.
       */
      const BASIS_AREA = {
        'per sq ft': area,
        'per sq ft of wall': wallArea,
        'per sq ft of wall and roof': wallArea + area,
        'per sq ft of wall and ceiling': wallArea + area,
      };
      Array.from(form.querySelectorAll('[data-rate][data-rate-basis]')).forEach((field) => {
        if (field.closest('.opening-card')) return;
        if (!enabled(field)) return;
        const basis = field.dataset.rateBasis;
        const rate = num(field.dataset.rate);
        let count = 0;
        if (field.tagName === 'OPTION') count = field.selected ? 1 : 0;
        else if (field.type === 'radio' || field.type === 'checkbox') count = field.checked ? 1 : 0;
        else count = Math.max(0, num(field.value));
        if (!count || !rate) return;
        const label = field.dataset.lineLabel || labelOf(field) || basis;
        if (basis === 'percent of base') {
          addLine(label, Math.round(base * (rate / 100)));
        } else if (basis === 'each') {
          addLine(field.dataset.lineQuantified ? `${count} × ${label}` : label, rate * count * quantity);
        } else if (BASIS_AREA[basis] !== undefined) {
          addLine(label, Math.round(rate * BASIS_AREA[basis] * count * quantity));
        } else {
          // A basis nobody taught this script. Priced at the plain rate and
          // named, so it shows up as wrong rather than vanishing.
          addLine(label, Math.round(rate * count * quantity));
        }
      });

      Array.from(form.querySelectorAll('input[name^="doors["][name$="[type]"]:checked')).filter(enabled).forEach((door, index) => {
        if (index === 0 && door.value === 'Steel door') return;
        addLine(`Door ${index + 1}: ${door.value}`, dataNumber(door, 'rate') * quantity);
      });
      Array.from(form.querySelectorAll('select[name^="windows["][name$="[type]"]')).filter(enabled).forEach((type) => {
        const match = type.name.match(/^windows\[(\d+)\]/);
        if (!match) return;
        const index = match[1];
        if (isPublishedBaseIncludedWindow(root, form, type, index)) return;
        const windowWidth = num(value(form, `windows[${index}][width]`, 0));
        const windowHeight = num(value(form, `windows[${index}][height]`, 0));
        const trackFactor = dataNumber(chosen(form, `windows[${index}][track]`), 'rateMultiplier') || 1;
        addLine(`Window ${Number(index) + 1}: ${type.value} ${windowWidth}×${windowHeight} ft`,
          Math.round(dataNumber(type, 'rate') * windowWidth * windowHeight * trackFactor * quantity));
      });
    }

    const deliveryZone = value(form, 'deliveryZone');
    const distance = num(value(form, 'distanceKm'));
    let transportNote = '';
    if (deliveryZone === 'Bangalore city' || deliveryZone === 'Delhi NCR') transportNote = 'Free delivery zone';
    else if (distance > 0 && distance < 100) transportNote = 'Under 100 km: confirmed at quotation';
    else if (deliveryZone === 'Other' && root.dataset.quoteFreightOutsideFreeZones === 'true') {
      transportNote = 'Quoted separately';
    }
    else if (deliveryZone === 'Other' && distance >= 100) {
      const bands = (root.dataset.freightBands || '').split(',').map(Number).filter(Number.isFinite);
      const band = Math.min(bands.length - 1, Math.max(0, Math.ceil((distance - 100) / 50) - 1));
      if (bands[band] !== undefined) {
        const longTrailer = length > 20 || colony ? num(root.dataset.freight40Delta) : 0;
        addLine(`Transport ${distance} km`, (bands[band] + longTrailer) * quantity);
      }
    }
    // IN-01 is on the hold list. It carries no figure and says so.
    if (chosen(form, 'installation')?.checked) addLine('Installation and fixing (IN-01)', null);

    const gst = Math.round(total * num(root.dataset.gstRate));
    renderEstimateLines(root, lines, transportNote, total, gst, quoteOnly);
    const validSize = colony || (length >= 6 && length <= 60 && width >= 6 && width <= 60);
    if (colony) {
      const workers = Math.max(0, num(value(form, 'workers')));
      const variants = Array.from(form.querySelectorAll('input[name="colonyVariant"]'));
      if (workers > 0 && variants.length) {
        const candidates = variants.map((variant) => {
          const capacity = Math.max(1, dataNumber(variant, 'capacityMax'));
          const blocks = Math.ceil(workers / capacity);
          return { variant, blocks, capacity, total: blocks * capacity, price: blocks * dataNumber(variant, 'price') };
        }).sort((a, b) => a.total - b.total || a.price - b.price);
        const suggestion = candidates[0];
        const label = suggestion.variant.closest('label')?.querySelector('strong')?.textContent || 'Colony building';
        setText(root, '[data-worker-suggestion]', `${label} × ${suggestion.blocks} accommodates at least ${workers.toLocaleString('en-IN')} workers.`);
      }
    }
    // C3: the wall build-up diagram named a thickness the server rendered and
    // never changed again. Follow the current choice.
    const thickness = value(form, 'pufThickness', '50');
    setText(root, '[data-wall-build-thickness]', `${thickness} mm`);

    /**
     * C4: electrical quantities derived from the entered floor area.
     *
     * Derivation, from the helper text already shipped and unchanged:
     *   LED Panel Light            ceil(area / 40)
     *   Ceiling Fan                ceil(area / 100)
     *   Plug Point                 ceil(area / 50)
     *   External / Entrance Light  1 per cabin
     * Applied only to inputs the buyer has not touched, so a typed quantity is
     * never overwritten. No rate is introduced: these are counts multiplied by
     * rates already in rate card v2.
     */
    const perArea = { 'LED Panel Light': 40, 'Ceiling Fan': 100, 'Plug Point': 50 };
    root.querySelectorAll('[data-electrical-item]').forEach((input) => {
      if (input.dataset.userSet === 'true') return;
      const label = input.dataset.electricalItem;
      const divisor = perArea[label];
      const suggested = divisor
        ? Math.max(1, Math.ceil(area / divisor))
        : (label === 'External / Entrance Light' ? 1 : null);
      if (suggested === null) return;
      if (String(input.value) !== String(suggested)) input.value = String(suggested);
    });

    // The sticky summary header binds to live state. It used to be server-
    // rendered once and never touched, so changing product or size left it
    // reading the value it was born with.
    const chosenProduct = chosen(form, 'productId');
    const productLabel = chosenProduct
      ? (chosenProduct.dataset.label
        || chosenProduct.closest('label')?.querySelector('.choice-title')?.textContent?.trim()
        || '')
      : '';
    if (productLabel) setText(root, '[data-summary-product]', productLabel);
    if (!colony) {
      setText(root, '[data-summary-size]',
        `${length}×${width} ft · ${area.toLocaleString('en-IN')} sq ft${quantity > 1 ? ` · quantity ${quantity}` : ''}`);
    }
    setText(root, '[data-summary-ex]', quoteOnly ? 'Price on request' : INR.format(total));
    setText(root, '[data-summary-incl]', quoteOnly ? 'Fixed quotation within 48 hours' : `${INR.format(total + gst)} incl. GST`);
    // The estimate card's own figure. It was never in this list, so the card
    // kept the number it was born with while the header above it moved.
    setText(root, '[data-estimate-total]', quoteOnly ? 'Price on request' : INR.format(total));
    // The card's floor-area line. It had no hook at all until the L2b sweep, so
    // it kept the server's figure through every size change: a cabin set to 8x6
    // read "Floor area 200 sq ft" directly above a base cabin line that
    // correctly said 8x6. Same defect class as the stale itemisation, one
    // paragraph higher, and invisible to an attribute sweep because it had no
    // attribute to find.
    setText(root, '[data-estimate-area]', `${area.toLocaleString('en-IN')} sq ft`);
    setText(root, '[data-estimate-ex-gst]', quoteOnly ? 'Price on request' : INR.format(total));
    setText(root, '[data-estimate-incl-gst]', quoteOnly ? 'Fixed quotation within 48 hours' : `${INR.format(total + gst)} incl. 18% GST`);
    // "Show GST as a line item" did nothing once the page was enhanced: the
    // server honours it, the script had never read it. Same wording as the
    // server's, so the toggle reads the same with and without JavaScript.
    const includeGst = form.querySelector('[name="includeGst"]')?.checked !== false;
    setText(root, '[data-estimate-total-note]', quoteOnly
      ? 'Fixed quotation within 48 hours'
      : (includeGst ? `${INR.format(total + gst)} incl. 18% GST` : 'GST line shown above'));
    setText(root, '[data-mobile-estimate]', quoteOnly ? 'On request' : INR.format(total));
    const configuration = form.querySelector('input[name="configuration"]');
    const estimateField = form.querySelector('input[name="estimate"]');
    if (configuration) configuration.value = JSON.stringify(readConfiguration(form));
    if (estimateField) estimateField.value = JSON.stringify({ areaSqft: area, totalExGst: total, gst, totalInclGst: total + gst, quoteOnly });
    ['length', 'width'].forEach((name) => chosen(form, name)?.setAttribute('aria-invalid', String(!validSize)));
    updatePlan(root, length, width, area, value(form, 'planView', 'plan'), form);
    // The Base Price tile shows the same figure as the estimate's first line.
    setText(root, '[data-base-price]', quoteOnly ? 'Quoted separately' : INR.format(base));
    return { area, total, gst, quoteOnly, validSize };
  }

  function summary(form, estimate) {
    const product = source(chosen(form, 'productId'));
    return [
      'SAMAN cabin cost calculator configuration',
      `Product: ${product?.dataset.label || product?.value || 'Portable cabin'}`,
      `Size: ${value(form, 'length', '-')} × ${value(form, 'width', '-')} ft`,
      `Area: ${estimate.area.toLocaleString('en-IN')} sq ft`,
      `Estimate ex-GST: ${estimate.quoteOnly ? 'price on request' : INR.format(estimate.total)}`,
      `GST at 18%: ${estimate.quoteOnly ? 'itemised in quotation' : INR.format(estimate.gst)}`,
    ].join('\n');
  }

  async function submitEnhanced(event, root, form) {
    event.preventDefault();
    const estimate = calculate(root, form);
    // Field names match the /api/enquiry contract exactly, so the enhanced path
    // and the no-JavaScript native POST send the same shape. They used to
    // differ, and only the enhanced path worked.
    const firstName = value(form, 'firstName').trim();
    const lastName = value(form, 'lastName').trim();
    const phone = value(form, 'phone').replace(/\D/g, '');
    const email = value(form, 'email').trim();
    if (!firstName || !lastName || !phone) { notice(root, message(root, 'requiredFields')); return; }
    if (!/^\d{10}$/.test(phone)) { notice(root, message(root, 'mobileInvalid')); return; }
    if (!email) { notice(root, message(root, 'emailRequired')); return; }
    if (!estimate.validSize || !form.reportValidity()) return;
    const product = source(chosen(form, 'productId'));
    const payload = {
      firstName,
      lastName,
      email,
      phone,
      message: `${summary(form, estimate)}\n\nFull configuration: ${value(form, 'configuration')}\n\n${value(form, 'notes')}`.trim(),
      region: value(form, 'state'),
      productName: product?.dataset.label || product?.value || '',
      pageUrl: window.location.href,
      companyName: value(form, 'company'),
      configuration: value(form, 'configuration'),
    };
    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      const response = await fetch(form.dataset.enhancedAction || '/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(String(response.status));
      notice(root, message(root, 'submitSuccess'));
      track('quote_submit', { product: payload.productName, page_path: window.location.pathname });
    } catch (_error) {
      notice(root, message(root, 'submitFailure'));
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function enhance(root) {
    const form = root.querySelector('[data-calculator-form]');
    if (!form) return;
    root.dataset.enhanced = 'true';
    root.classList.add('is-enhanced');
    const priceTables = root.querySelector('.price-tables');
    if (priceTables) {
      priceTables.hidden = true;
      priceTables.setAttribute('aria-hidden', 'true');
    }
    const firstStep = num(root.querySelector('[data-step]')?.dataset.step, 1);
    showStep(root, firstStep, false);
    calculate(root, form);

    root.addEventListener('click', async (event) => {
      const control = event.target.closest('[data-step-link],[data-action]');
      if (!control || !root.contains(control)) return;
      if (control.matches('[data-step-link]')) {
        event.preventDefault();
        showStep(root, num(control.dataset.stepLink), true);
        return;
      }
      const action = control.dataset.action;
      if (action === 'back' || action === 'next') {
        const steps = Array.from(root.querySelectorAll('[data-step]')).map((s) => num(s.dataset.step));
        const at = steps.indexOf(num(root.dataset.currentStep, steps[0]));
        const to = steps[Math.min(steps.length - 1, Math.max(0, at + (action === 'next' ? 1 : -1)))];
        showStep(root, to, true);
        return;
      }
      if (action === 'qty-up' || action === 'qty-down') {
        // Inline steppers on the electrical cards and the socket walls.
        const form = root.querySelector('form');
        const field = form?.querySelector(`[name="${CSS.escape(control.dataset.qtyTarget || '')}"]`);
        if (!field) return;
        const min = field.min === '' ? 0 : Number(field.min);
        const max = field.max === '' ? Infinity : Number(field.max);
        const step = Number(field.step) || 1;
        const next = Math.min(max, Math.max(min, (Number(field.value) || 0) + (action === 'qty-up' ? step : -step)));
        field.value = String(next);
        // A typed quantity is never overwritten by the area-derived suggestion,
        // and pressing a stepper counts as typing one.
        if (field.dataset.electricalItem) field.dataset.userSet = 'true';
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      if (action === 'distribute-rooms') {
        // Clear the boxes rather than writing equal numbers into them: empty
        // means "not chosen", and the geometry already divides equally then.
        // Writing the numbers in would make an untouched cabin look edited.
        const form = root.querySelector('form');
        root.querySelectorAll('[data-room-length]').forEach((input) => { input.value = ''; });
        const rooms = Math.max(1, num(value(form, 'rooms', 1), 1));
        const each = num(value(form, 'length', 20), 20) / rooms;
        root.querySelectorAll('[data-room-length]').forEach((input) => { input.value = each.toFixed(1); });
        calculate(root, form);
        return;
      }
      if (action === 'pdf') {
        control.disabled = true;
        try {
          const configuration = {
            ...readConfiguration(form),
            ladderKey: source(chosenProductField(form))?.dataset?.ladder || null,
          };
          const response = await fetch('/api/cabin-estimate-pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              configuration,
              documentProductMode: root.dataset.documentProductMode || 'selected',
              showGeneralDisclosure: Boolean(root.querySelector('[data-general-estimate-disclosure]')),
            }),
          });
          if (!response.ok) throw new Error(`PDF request failed with ${response.status}`);
          const disposition = response.headers.get('Content-Disposition') || '';
          const named = disposition.match(/filename="([^"]+)"/i)?.[1];
          const product = String(configuration.productId || 'general-cabin').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
          const size = `${configuration.length || '0'}x${configuration.width || '0'}-ft`;
          const fallbackName = `saman-estimate-${product}-${size}-${new Date().toISOString().slice(0, 10)}.pdf`;
          const url = URL.createObjectURL(await response.blob());
          const link = document.createElement('a');
          link.href = url;
          link.download = named || fallbackName;
          document.body.append(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          track('pdf_download', { page_path: window.location.pathname });
        } catch (error) {
          console.error(error);
        } finally {
          control.disabled = false;
        }
        return;
      }
      if (action === 'save') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(readSavedConfiguration(form, root)));
          notice(root, message(root, 'saved'));
        } catch (_error) { /* Storage is optional. */ }
      }
      if (action === 'restore') {
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
          if (saved) {
            applySavedTheme(root, saved);
            applySavedDocumentProductMode(root, saved);
            applyConfiguration(form, saved);
            calculate(root, form);
            notice(root, message(root, 'restored'), true);
          }
        } catch (_error) { /* Storage is optional. */ }
      }
      if (action === 'start-over') {
        form.reset();
        root.dataset.documentProductMode = root.dataset.initialDocumentProductMode || 'selected';
        calculate(root, form);
        showStep(root, firstStep, true);
      }
      if (action === 'copy-link') {
        const url = configuredUrl(form);
        try { await navigator.clipboard.writeText(url); } catch (_error) {
          const fallback = root.querySelector('[data-share-url]');
          if (fallback) { fallback.value = url; fallback.select(); document.execCommand('copy'); }
        }
        notice(root, message(root, 'linkCopied'));
      }
      if (action === 'whatsapp') {
        const estimate = calculate(root, form);
        const text = `${summary(form, estimate)}\n\n${configuredUrl(form)}`;
        track('whatsapp_share', { page_path: window.location.pathname });
        window.open(`https://wa.me/918861622859?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
      }
      if (action === 'add-door' || action === 'add-window') {
        const kind = action === 'add-door' ? 'door' : 'window';
        const reserved = root.querySelector(`[data-reserved-${kind}][hidden]`);
        if (reserved) {
          reserved.hidden = false;
          reserved.disabled = false;
          reserved.querySelector('input,select')?.focus();
          calculate(root, form);
        }
      }
    });
    form.addEventListener('input', (event) => {
      // A quantity the buyer typed is theirs. The area-derived suggestion
      // must never overwrite it afterwards.
      const target = event.target;
      if (target && target.dataset && target.dataset.electricalItem) target.dataset.userSet = 'true';
      calculate(root, form);
    });
    form.addEventListener('change', (event) => {
      if (event.target?.name === 'productId') root.dataset.documentProductMode = 'selected';
      calculate(root, form);
    });
    form.addEventListener('submit', (event) => submitEnhanced(event, root, form));
  }

  document.querySelectorAll('[data-cabin-calculator]').forEach(enhance);
  // Next.js can replace a product page without a full document navigation.
  // Keep the single delegated runtime and enhance only calculators added by
  // that route change, rather than loading a second copy of every listener.
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches('[data-cabin-calculator]')) enhance(node);
      node.querySelectorAll('[data-cabin-calculator]').forEach(enhance);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
