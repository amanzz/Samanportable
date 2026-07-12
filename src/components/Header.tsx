import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, Phone, User, LogOut, Package, ArrowRight, Building2, Container } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { dsCssVariables } from '@/components/ds/tokens';
import { cn } from '@/lib/utils';

const LoginModal = dynamic(() => import('@/components/LoginModal'), { ssr: false });
const EnquiryDialog = dynamic(() => import('@/components/EnquiryDialog'), { ssr: false });

// T1 — SAP-aligned single-bar header. Content authority:
// page-structure/content-drafts/T1_Header_Redesign_SAP_Draft_v1_12Jul2026.md.
//
// The DS `--ds-*` custom properties are NOT defined globally (only the homepage main
// injects them), so this global-chrome component scopes its own [data-ds-root] token
// block onto the <header> — every var(--ds-*) below then resolves within the header
// subtree (including the SSR mega-menu). Generated from tokens.ts; components stay hex-free.
//
// Crawl-equity (draft §4): the Products mega-menu is rendered in the DOM on every load
// (visually hidden until open via opacity/visibility, NEVER conditionally mounted), so
// every category <a> is present in the server HTML. This replaces the old black
// CategoryMenu bar (+ its per-page /api/categories client fetch — now gone).

const UTILITY_PHONES = [
  { label: 'Sales', display: '+91 97089 89937', tel: 'tel:+919708989937' },
  { label: 'South', display: '+91 88616 22859', tel: 'tel:+918861622859' },
  { label: 'North', display: '+91 87960 39938', tel: 'tel:+918796039938' },
];

const NAV_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about-us' },
  { name: 'Products', href: '/product', menu: 'products' as const },
  { name: 'Rental Services', href: '/rental-services', menu: 'rental' as const },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

// Products mega-menu — 4 grouped columns (draft §2.3). All hrefs are /product/* hubs,
// a superset of the old two-bar system (adds Sandwich Panels; keeps Roofing Sheets).
const MEGA_COLUMNS = [
  {
    title: 'Cabins & Offices',
    items: [
      { name: 'Porta Cabin', href: '/product/porta-cabins' },
      { name: 'Portable Cabin', href: '/product/portable-cabin' },
      { name: 'Portable Office Cabin', href: '/product/portable-office' },
      { name: 'Container Office', href: '/product/container-offices' },
      { name: 'Container Cafe', href: '/product/container-cafe' },
      { name: 'Security Cabin', href: '/product/security-cabins' },
    ],
  },
  {
    title: 'Accommodation & Site',
    items: [
      { name: 'Labour Colony', href: '/product/labor-colony' },
      { name: 'Container House', href: '/product/container-houses' },
      { name: 'Portable Toilet', href: '/product/portable-toilet' },
    ],
  },
  {
    title: 'Structures & Buildings',
    items: [
      { name: 'Industrial Shed', href: '/product/industrial-sheds' },
      { name: 'PEB Construction', href: '/product/peb-constructions' },
      { name: 'Pre-Engineered Building', href: '/product/pre-engineered-buildings' },
      { name: 'Prefab Building', href: '/product/prefab-buildings' },
      { name: 'Prefabricated House', href: '/product/prefabricated-houses' },
    ],
  },
  {
    title: 'Panels & Sheets',
    items: [
      { name: 'PUF Panels', href: '/product/puf-panel' },
      { name: 'Sandwich Panels', href: '/product/sandwich-panel' },
      { name: 'Roofing Sheets', href: '/product/roofing-sheet' },
    ],
  },
];

const RENTAL_GROUPS = [
  {
    category: 'Porta Cabin Rentals',
    items: [
      { name: '40×10 Porta Cabin', href: '/container-rent-services/40x10-porta-cabin-rental', icon: Building2 },
      { name: '30×10 Porta Cabin', href: '/container-rent-services/30x10-porta-cabin-rental', icon: Building2 },
      { name: '20×10 Porta Cabin', href: '/container-rent-services/20x10-porta-cabin-rental', icon: Building2 },
      { name: '10×10 Porta Cabin', href: '/container-rent-services/10x10-porta-cabin-rental', icon: Building2 },
    ],
  },
  {
    category: 'Container Office Rentals',
    items: [
      { name: '40×8 Container Office', href: '/container-rent-services/40x8-container-office-rental', icon: Container },
      { name: '30×8 Container Office', href: '/container-rent-services/30x8-container-office-rental', icon: Container },
      { name: '20×8 Container Office', href: '/container-rent-services/20x8-container-office-rental', icon: Container },
      { name: '10×8 Container Office', href: '/container-rent-services/10x8-container-office-rental', icon: Container },
    ],
  },
];

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'products' | 'rental' | null>(null);
  const [condensed, setCondensed] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>('Cabins & Offices');
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll-condense: hide the utility strip past ~80px. rAF-throttled; only flips state
  // on threshold crossing (no per-scroll re-render). Utility strip collapses via
  // max-height/opacity above the fixed-height main bar → no reflow of in-view content.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setCondensed((prev) => {
          const next = window.scrollY > 80;
          return prev === next ? prev : next;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close any open desktop mega-menu on route change.
  useEffect(() => {
    const close = () => setActiveMenu(null);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);

  const openMenu = useCallback((menu: 'products' | 'rental') => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveMenu(menu), 120);
  }, []);
  const scheduleClose = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveMenu(null), 160);
  }, []);

  const isActive = (href: string) => router.pathname === href;

  return (
    <header
      data-ds-root=""
      className="sticky top-0 z-50 bg-white shadow-card"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setActiveMenu(null);
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `[data-ds-root]{${dsCssVariables()}}` }} />

      {/* Utility strip (desktop ≥lg only) — collapses on scroll-condense. */}
      <div
        className={cn(
          'hidden overflow-hidden bg-[var(--ds-color-forest)] text-[var(--ds-color-on-dark)] transition-all duration-300 lg:block',
          condensed ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        )}
        aria-hidden={condensed}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {UTILITY_PHONES.map((p, i) => (
              <React.Fragment key={p.tel}>
                {i > 0 && <span className="text-white/40">·</span>}
                <a href={p.tel} className="font-medium transition-colors hover:text-white">
                  <span className="text-white/60">{p.label}: </span>
                  {p.display}
                </a>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="mailto:sales@samanportable.com" className="font-medium transition-colors hover:text-white">
              sales@samanportable.com
            </a>
            <span className="text-white/40">·</span>
            <span className="text-white/80">Fixed-price quote in 48 hours</span>
          </div>
        </div>
      </div>

      {/* Main bar — fixed height (zero CLS on condense). */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center transition-opacity duration-200 hover:opacity-90">
            <Image
              src="/saman-logo.svg"
              alt="SAMAN Portable Logo"
              width={200}
              height={100}
              className="h-11 w-auto object-contain"
              unoptimized
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const hasMenu = !!item.menu;
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={hasMenu ? () => openMenu(item.menu!) : undefined}
                  onMouseLeave={hasMenu ? scheduleClose : undefined}
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-haspopup={hasMenu ? 'true' : undefined}
                      aria-expanded={hasMenu ? activeMenu === item.menu : undefined}
                      onKeyDown={
                        hasMenu
                          ? (e) => {
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActiveMenu(item.menu!);
                              }
                            }
                          : undefined
                      }
                      className={cn(
                        'group relative whitespace-nowrap px-3 py-2 text-base font-medium transition-colors',
                        isActive(item.href) ? 'text-[var(--ds-color-leaf)]' : 'text-gray-800 hover:text-[var(--ds-color-leaf)]'
                      )}
                    >
                      {item.name}
                      <span
                        className={cn(
                          'absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--ds-color-leaf)] transition-all duration-200',
                          isActive(item.href) || activeMenu === item.menu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        )}
                      />
                    </Link>
                    {hasMenu && (
                      <ChevronDown
                        className={cn(
                          'ml-0.5 h-4 w-4 text-gray-500 transition-transform duration-200',
                          activeMenu === item.menu && 'rotate-180'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
            <a
              href="tel:+919708989937"
              aria-label="Call SAMAN Portable sales"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--ds-color-forest)_20%,transparent)] text-[var(--ds-color-forest)] transition-colors hover:bg-[var(--ds-color-mist)]"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              type="button"
              onClick={() => setShowEnquiry(true)}
              className="inline-flex items-center rounded-full bg-[var(--ds-color-leaf)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--ds-color-forest)]"
            >
              Get Quote
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center space-x-2 transition-opacity hover:opacity-80">
                    <User className="h-6 w-6 text-gray-700" />
                    <ChevronDown className="h-4 w-4 text-gray-700" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="z-50 mt-2 w-56 rounded-md bg-white text-gray-900 shadow-lg">
                  <div className="border-b px-3 py-2">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <DropdownMenuItem className="cursor-pointer p-0">
                    <Link href="/my-orders" className="flex w-full items-center rounded-md px-3 py-2 text-left transition-colors hover:bg-primary hover:text-white">
                      <Package className="mr-3 h-4 w-4 text-muted-foreground" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer px-3 py-2 transition-colors hover:bg-red-50 hover:text-red-700">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                type="button"
                aria-label="Open login"
                className="cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => setShowLoginModal(true)}
              >
                <User className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:+919708989937"
              aria-label="Call SAMAN Portable sales"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--ds-color-forest)]"
            >
              <Phone className="h-5 w-5" />
            </a>
            <button
              className="rounded-full border border-border bg-gray-50 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Desktop mega-menu panels (SSR, always in DOM; toggled by visibility) ===== */}
      {/* Products */}
      <div
        className={cn(
          'absolute inset-x-0 top-full hidden border-t border-gray-100 bg-white shadow-lg transition-all duration-200 lg:block',
          activeMenu === 'products' ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        aria-hidden={activeMenu !== 'products'}
        aria-label="Products menu"
        onMouseEnter={() => openMenu('products')}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ds-color-forest)]">Products</p>
          <div className="grid grid-cols-4 gap-8">
            {MEGA_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">{col.title}</h3>
                <ul className="space-y-1">
                  {col.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        prefetch={false}
                        className="block rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-[var(--ds-color-mist)] hover:text-[var(--ds-color-leaf)]"
                        onClick={() => setActiveMenu(null)}
                      >
                        {it.name}
                      </Link>
                    </li>
                  ))}
                  {col.title === 'Panels & Sheets' && (
                    <li className="mt-4 rounded-xl bg-[var(--ds-color-mist)] p-4">
                      <p className="text-sm font-bold text-[var(--ds-color-forest)]">Not sure which fits?</p>
                      <p className="mt-1 text-xs text-gray-600">Send your size — get a fixed-price quote in 48 hours.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenu(null);
                          setShowEnquiry(true);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--ds-color-leaf)] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--ds-color-forest)]"
                      >
                        Get a Quote
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <Link
              href="/product"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
              onClick={() => setActiveMenu(null)}
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Rental Services */}
      <div
        className={cn(
          'absolute inset-x-0 top-full hidden border-t border-gray-100 bg-white shadow-lg transition-all duration-200 lg:block',
          activeMenu === 'rental' ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        aria-hidden={activeMenu !== 'rental'}
        aria-label="Rental Services menu"
        onMouseEnter={() => openMenu('rental')}
        onMouseLeave={scheduleClose}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ds-color-forest)]">Rental Services</p>
          <div className="grid grid-cols-3 gap-8">
            {RENTAL_GROUPS.map((group) => (
              <div key={group.category}>
                <h3 className="mb-3 text-sm font-semibold text-gray-900">{group.category}</h3>
                <ul className="space-y-1">
                  {group.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        prefetch={false}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-[var(--ds-color-mist)] hover:text-[var(--ds-color-leaf)]"
                        onClick={() => setActiveMenu(null)}
                      >
                        <it.icon className="h-4 w-4 text-gray-400" />
                        {it.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex items-end">
              <Link
                href="/rental-services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ds-color-leaf)] transition-colors hover:text-[var(--ds-color-forest)]"
                onClick={() => setActiveMenu(null)}
              >
                View all rental services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Mobile menu ===== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image src="/saman-logo.svg" alt="SAMAN Portable Logo" width={200} height={100} className="h-8 w-auto object-contain" unoptimized />
            </Link>
            <button className="p-2" onClick={() => setIsMenuOpen(false)} aria-label="Close mobile menu">
              <X className="h-6 w-6 text-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1" aria-label="Mobile">
              {NAV_ITEMS.filter((i) => !i.menu).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-2 py-2.5 text-base font-medium text-gray-800 transition-colors hover:bg-[var(--ds-color-mist)] hover:text-[var(--ds-color-leaf)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Product groups (collapsible) */}
              <div className="border-t pt-3">
                <p className="mb-1 px-2 text-xs font-bold uppercase tracking-widest text-[var(--ds-color-forest)]">Products</p>
                {MEGA_COLUMNS.map((col) => {
                  const open = mobileGroup === col.title;
                  return (
                    <div key={col.title}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileGroup(open ? null : col.title)}
                        aria-expanded={open}
                      >
                        {col.title}
                        <ChevronDown className={cn('h-4 w-4 text-gray-500 transition-transform', open && 'rotate-180')} />
                      </button>
                      {open && (
                        <div className="pb-2 pl-3">
                          {col.items.map((it) => (
                            <Link
                              key={it.href}
                              href={it.href}
                              prefetch={false}
                              className="block rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-[var(--ds-color-mist)] hover:text-[var(--ds-color-leaf)]"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {it.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <Link
                  href="/product"
                  className="mt-1 block rounded-md px-2 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View all products →
                </Link>
              </div>

              {/* Rental Services */}
              <div className="border-t pt-3">
                <p className="mb-1 px-2 text-xs font-bold uppercase tracking-widest text-[var(--ds-color-forest)]">Rental Services</p>
                {RENTAL_GROUPS.map((group) => (
                  <div key={group.category} className="mb-2">
                    <h4 className="px-2 py-1 text-sm font-medium text-gray-700">{group.category}</h4>
                    <div className="pl-3">
                      {group.items.map((it) => (
                        <Link
                          key={it.href}
                          href={it.href}
                          prefetch={false}
                          className="block rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-[var(--ds-color-mist)] hover:text-[var(--ds-color-leaf)]"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {it.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link
                  href="/rental-services"
                  className="block rounded-md px-2 py-2 text-sm font-semibold text-[var(--ds-color-leaf)] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View all rental services →
                </Link>
              </div>

              {/* Foot: Get Quote + auth */}
              <div className="space-y-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowEnquiry(true);
                  }}
                  className="w-full rounded-full bg-[var(--ds-color-leaf)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--ds-color-forest)]"
                >
                  Get Quote
                </button>
                {user ? (
                  <div className="space-y-3">
                    <div className="rounded-md bg-gray-50 px-3 py-2">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <Link
                      href="/my-orders"
                      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="mr-2 inline h-4 w-4" />
                      My Orders
                    </Link>
                    <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700" onClick={() => { logout(); setIsMenuOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={() => setShowLoginModal(false)} />
      <EnquiryDialog isOpen={showEnquiry} onClose={() => setShowEnquiry(false)} />
    </header>
  );
};

export default Header;
