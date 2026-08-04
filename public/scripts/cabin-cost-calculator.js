/* SAMAN cabin calculator progressive enhancement. All content and rates are server-rendered. */
(() => {
  'use strict';

  const STORAGE_KEY = 'saman-cabin-calculator-v9';
  const THEME_KEY = '__theme';
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
    };
  }

  function applySavedTheme(root, saved) {
    const candidate = saved?.[THEME_KEY];
    if (candidate === 'light' || candidate === 'green') {
      root.dataset.theme = candidate;
    }
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
    const activeName = activeSection?.querySelector('h2')?.textContent || '';
    setText(root, '[data-step-name]', activeName.replace(/^Step \d+ of \d+:\s*/, ''));
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

  function areaBand(root, area) {
    if (area < 200) return num(root.dataset.areaBandUnder200);
    if (area > 600) return num(root.dataset.areaBandOver600);
    if (area > 400) return num(root.dataset.areaBandOver400);
    if (area > 300) return num(root.dataset.areaBandOver300);
    if (area > 200) return num(root.dataset.areaBandOver200);
    return num(root.dataset.areaBandAt200);
  }

  function publishedPrice(root, productId, length, width) {
    const table = Array.from(root.querySelectorAll('[data-product-price-table]'))
      .find((item) => item.dataset.productPriceTable === productId);
    if (!table) return null;
    const row = Array.from(table.querySelectorAll('[data-published-size]')).find((item) => (
      num(item.dataset.length, NaN) === length && num(item.dataset.width, NaN) === width
    ));
    return row ? num(row.dataset.priceExGst, NaN) : null;
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

  function updatePlan(root, length, width, area, planView, form) {
    root.querySelectorAll('[data-floor-plan]').forEach((svg) => {
      svg.querySelectorAll('[data-plan-view]').forEach((viewNode) => {
        viewNode.hidden = viewNode.dataset.planView !== planView;
      });
      const shell = svg.querySelector('[data-plan-view="plan"] .shell');
      if (!shell) return;
      const scale = Math.min(260 / Math.max(6, length), 130 / Math.max(6, width));
      const planWidth = length * scale;
      const planHeight = width * scale;
      shell.setAttribute('x', String((320 - planWidth) / 2));
      shell.setAttribute('y', String((190 - planHeight) / 2));
      shell.setAttribute('width', String(planWidth));
      shell.setAttribute('height', String(planHeight));
      svg.setAttribute('aria-label', `${length} by ${width} foot cabin plan, ${area} square feet`);
      const dimensions = svg.querySelector('[data-plan-dimensions]');
      if (dimensions) dimensions.textContent = `${length} × ${width} ft`;
      if (form) {
        repositionOpenings(svg, form, (320 - planWidth) / 2, (190 - planHeight) / 2, planWidth, planHeight);
      }
    });
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
    const quoteOnly = source(product)?.dataset.quoteOnly === 'true';
    const referenceRate = dataNumber(product, 'referenceRate');
    const ladderPrice = colony ? null : publishedPrice(root, productId, length, width);
    let base = colony
      ? dataNumber(colonyVariant, 'price', dataNumber(colonyVariant, 'priceExGst')) * quantity
      : (ladderPrice === null ? Math.round(area * referenceRate * areaBand(root, area)) : ladderPrice) * quantity;
    if (quoteOnly) base = 0;
    let total = base;
    const wallArea = 2 * (length + width) * height;

    if (!colony && !quoteOnly) {
      if (height > 8.5) total += Math.round((base / quantity) * num(root.dataset.heightRatePerFoot) * (height - 8.5)) * quantity;
      total += Math.round(base * dataNumber(chosen(form, 'roof'), 'rate') / 100);
      const rooms = Math.max(1, num(value(form, 'rooms', 1), 1));
      if (rooms > 1) total += Math.round((rooms - 1) * width * 8.5 * num(root.dataset.partitionRate) * quantity);
      total += Math.round(dataNumber(chosen(form, 'wallFinish'), 'rate') * wallArea * quantity);
      total += Math.round(dataNumber(chosen(form, 'ceiling'), 'rate') * area * quantity);
      total += Math.round(dataNumber(chosen(form, 'flooring'), 'rate') * area * quantity);
      total += Math.round(dataNumber(chosen(form, 'pufThickness'), 'rate') * (wallArea + area) * quantity);

      Array.from(form.querySelectorAll('input[name^="doors["][name$="[type]"]:checked')).filter(enabled).forEach((door, index) => {
        if (!(index === 0 && door.value === 'Steel door')) total += dataNumber(door, 'rate') * quantity;
      });
      Array.from(form.querySelectorAll('select[name^="windows["][name$="[type]"]')).filter(enabled).forEach((type) => {
        const match = type.name.match(/^windows\[(\d+)\]/);
        if (!match) return;
        const index = match[1];
        const windowWidth = num(value(form, `windows[${index}][width]`, 0));
        const windowHeight = num(value(form, `windows[${index}][height]`, 0));
        const trackFactor = dataNumber(chosen(form, `windows[${index}][track]`), 'rateMultiplier');
        total += Math.round(dataNumber(type, 'rate') * windowWidth * windowHeight * trackFactor * quantity);
      });
      form.querySelectorAll('input[name^="electrical["],input[name^="addOns["]').forEach((field) => {
        total += dataNumber(field, 'rate') * Math.max(0, num(field.value)) * quantity;
      });
    }

    const deliveryZone = value(form, 'deliveryZone');
    const distance = num(value(form, 'distanceKm'));
    if (deliveryZone === 'Other' && distance >= 100) {
      const bands = (root.dataset.freightBands || '').split(',').map(Number).filter(Number.isFinite);
      const band = Math.min(bands.length - 1, Math.max(0, Math.ceil((distance - 100) / 50) - 1));
      if (bands[band] !== undefined) {
        const longTrailer = length > 20 || colony ? num(root.dataset.freight40Delta) : 0;
        total += (bands[band] + longTrailer) * quantity;
      }
    }

    const gst = Math.round(total * num(root.dataset.gstRate));
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
    setText(root, '[data-estimate-ex-gst]', quoteOnly ? 'Price on request' : INR.format(total));
    setText(root, '[data-estimate-incl-gst]', quoteOnly ? 'Fixed quotation within 48 hours' : `${INR.format(total + gst)} incl. 18% GST`);
    setText(root, '[data-mobile-estimate]', quoteOnly ? 'On request' : INR.format(total));
    const configuration = form.querySelector('input[name="configuration"]');
    const estimateField = form.querySelector('input[name="estimate"]');
    if (configuration) configuration.value = JSON.stringify(readConfiguration(form));
    if (estimateField) estimateField.value = JSON.stringify({ areaSqft: area, totalExGst: total, gst, totalInclGst: total + gst, quoteOnly });
    ['length', 'width'].forEach((name) => chosen(form, name)?.setAttribute('aria-invalid', String(!validSize)));
    updatePlan(root, length, width, area, value(form, 'planView', 'plan'), form);
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
      if (action === 'theme') {
        root.dataset.theme = root.dataset.theme === 'light' ? 'green' : 'light';
      }
      if (action === 'pdf') {
        track('pdf_download', { page_path: window.location.pathname });
        window.print();
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
            applyConfiguration(form, saved);
            calculate(root, form);
            notice(root, message(root, 'restored'), true);
          }
        } catch (_error) { /* Storage is optional. */ }
      }
      if (action === 'start-over') {
        form.reset();
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
    form.addEventListener('change', () => calculate(root, form));
    form.addEventListener('submit', (event) => submitEnhanced(event, root, form));
  }

  document.querySelectorAll('[data-cabin-calculator]').forEach(enhance);
})();
