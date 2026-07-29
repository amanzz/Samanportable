import Link from 'next/link';
import type { ReactNode } from 'react';

const CABIN_HREF = '/product/porta-cabins';
const href = (slug: string) => `${CABIN_HREF}/${slug}`;

const bodyClass = 'text-sm leading-relaxed text-slate-700';
const linkClass = 'font-semibold text-[var(--ds-color-leaf)] underline underline-offset-2';

export interface RightToExistEntry {
  heading: string;
  body: ReactNode;
  comparison: ReactNode;
  appendix?: ReactNode;
}

const RIGHT_TO_EXIST_ENTRIES: Record<string, RightToExistEntry> = {
  'porta-cabins': {
    heading: 'The SAMAN porta cabin range at a glance',
    body: (
      <>
        Every porta cabin here is newly fabricated at our own works from MS sheet, MS pipe framing and aluminium sections — not a converted shipping container. The reference build carries a 1.2 mm corrugated exterior, a 1.4 mm roof, 8 mm pre-laminated interior lining and an 18 mm Bison floor panel, in nine standard sizes. The range then splits by grade, size band and fit-out; the eight pages below cover each configuration in full.
      </>
    ),
    comparison: (
      <>
        Not sure which grade fits? Compare the <Link className={linkClass} href={href('low-cost-porta-cabin')}>value line</Link>, the <Link className={linkClass} href={href('portacabin-office')}>upgraded office build</Link> and the <Link className={linkClass} href={href('ms-porta-cabin')}>heavy industrial build</Link>.
      </>
    ),
    appendix: (
      <> Beyond those, the <Link className={linkClass} href={href('luxury-porta-cabin')}>Luxury Porta Cabin</Link> covers client-facing rooms, the <Link className={linkClass} href={href('mini-porta-cabin')}>Mini Porta Cabin</Link> the four compact sizes, the <Link className={linkClass} href={href('steel-porta-cabin')}>Steel Porta Cabin</Link> units lifted between sites, the <Link className={linkClass} href={href('porta-cabin-shop')}>Porta Cabin Shop</Link> retail counters, and the <Link className={linkClass} href={href('porta-cabin-with-toilet')}>Porta Cabin with Toilet</Link> cabins that need their own facilities.</>
    ),
  },
  'low-cost-porta-cabin': {
    heading: 'Why choose the Low Cost Porta Cabin',
    body: (
      <>
        The value grade of our newly fabricated porta cabin, built on the identical welded MS frame and offered across all nine standard sizes. It specifies a 0.8–1.0 mm corrugated exterior, 6 mm pre-laminated lining and 1.5 mm vinyl over an 18 mm BWP plywood floor, saving on finish and never on structure. Choose it when the cabin serves your own team; move to the <Link className={linkClass} href={href('luxury-porta-cabin')}>Luxury Porta Cabin</Link> when clients will walk into it.
      </>
    ),
    comparison: (
      <>
        Only need a compact footprint? The <Link className={linkClass} href={href('mini-porta-cabin')}>Mini Porta Cabin</Link> covers the four smallest sizes at this same value grade.
      </>
    ),
  },
  'luxury-porta-cabin': {
    heading: 'Why choose the Luxury Porta Cabin',
    body: (
      <>
        The premium grade of the same newly fabricated cabin, specified for reception areas and client-facing rooms. It carries a 1.25–1.6 mm exterior, 12 mm plywood lining with laminate and HPL feature panels, a 12.5 mm gypsum ceiling and 5–6 mm SPC flooring over marine ply. Choose it where the room is seen by customers; the <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> covers working offices at upgraded rather than premium grade.
      </>
    ),
    comparison: (
      <>
        Want this finish without a desk layout? This page keeps the open room; <Link className={linkClass} href={href('portacabin-office')}>office fit-outs</Link> sit one grade below.
      </>
    ),
  },
  'mini-porta-cabin': {
    heading: 'Why choose the Mini Porta Cabin',
    body: (
      <>
        The compact end of our newly fabricated range, covering the four smallest sizes from a one-person duty post to a four-person room. It keeps the value specification — a 0.8–1.0 mm exterior with 6 mm lining — and adds a second window and separate socket circuit once the cabin passes 200 sq ft. Choose it for gate posts, kiosks and small teams; the <Link className={linkClass} href={href('low-cost-porta-cabin')}>Low Cost Porta Cabin</Link> carries the same grade in the larger sizes.
      </>
    ),
    comparison: (
      <>
        Need a fitted workspace rather than a duty room? The <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> adds workstations, storage and glazing.
      </>
    ),
  },
  'ms-porta-cabin': {
    heading: 'Why choose the MS Porta Cabin build',
    body: (
      <>
        The heavy industrial grade of our newly fabricated cabin, specified for plants, workshops and hostile environments. It carries a 1.6 mm exterior and roof, 8–10 mm fibre-cement lining, a 24 mm cement board floor and 2–3 mm commercial PVC or epoxy finish behind a single-leaf industrial door. Choose it for a fixed industrial position; the <Link className={linkClass} href={href('steel-porta-cabin')}>Steel Porta Cabin</Link> covers units that are lifted and re-sited repeatedly.
      </>
    ),
    comparison: (
      <>
        Housing an office rather than a workshop? The <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> trades industrial lining for a working fit-out.
      </>
    ),
  },
  'steel-porta-cabin': {
    heading: 'Why choose the Steel Porta Cabin',
    body: (
      <>
        The heavy relocation build of our newly fabricated cabin, made for units that are lifted, moved and stacked repeatedly. It takes the 1.6 mm exterior with a 0.50 mm pre-painted metal liner, a heavy MS floor plate with 3 mm chequered plate finish, double-leaf MS doors and upgraded lifting lugs. Choose it where the cabin moves between sites; the <Link className={linkClass} href={href('ms-porta-cabin')}>MS Porta Cabin</Link> suits a unit that stays in one position.
      </>
    ),
    comparison: (
      <>
        Need a lighter cabin that stays on one site? The <Link className={linkClass} href={CABIN_HREF}>Porta Cabins hub</Link> carries the standard reference specification.
      </>
    ),
  },
  'porta-cabin-shop': {
    heading: 'Why choose the Porta Cabin Shop',
    body: (
      <>
        The retail configuration of our newly fabricated cabin, planned around a front service counter with staff preparation and storage behind it. It carries 8–12 mm plywood with laminate or 6–8 mm HPL panels, a 4 mm ACP or decorative ceiling, 3–4 mm LVT flooring and large service glazing with a lockable counter opening. Choose it when customers are served at the cabin; the <Link className={linkClass} href={href('portacabin-office')}>Portacabin Office</Link> covers staff-only working space.
      </>
    ),
    comparison: (
      <>
        Selling food or drink rather than goods? The <Link className={linkClass} href="/product/container-cafe">container cafe range</Link> is planned around kitchen services instead.
      </>
    ),
  },
  'porta-cabin-with-toilet': {
    heading: 'Why choose the Porta Cabin with Toilet',
    body: (
      <>
        A working cabin with its own attached toilet in one newly fabricated unit — one delivery, one base, one drainage connection, no separate sanitary block. The wet zone uses 10–12 mm moisture-tolerant fibre-cement lining, an 18–24 mm cement board deck with waterproof membrane, and 2.5–3 mm anti-skid safety vinyl with sealed joints. Choose it wherever staff work and need facilities on the spot rather than at the far end of a site.
      </>
    ),
    comparison: (
      <>
        Need a standalone sanitary unit with no working space? The <Link className={linkClass} href="/product/portable-toilet">portable toilet range</Link> is sized by model, not by cabin.
      </>
    ),
  },
  'portacabin-office': {
    heading: 'Why choose the Portacabin Office',
    body: (
      <>
        The office configuration of our newly fabricated cabin — workstations, storage and an optional manager partition. Upgraded lining and flooring sit under office-grade glazing, with power and data drawn to your furniture plan and none of the gypsum ceiling or HPL panelling of the premium build. Choose it for any working office; at ₹1,450 per square foot it sits between the <Link className={linkClass} href={CABIN_HREF}>plain cabin</Link> and the <Link className={linkClass} href={href('luxury-porta-cabin')}>premium build</Link>.
      </>
    ),
    comparison: (
      <>
        Room will be seen by clients? The <Link className={linkClass} href={href('luxury-porta-cabin')}>Luxury Porta Cabin</Link> adds the gypsum ceiling, feature panelling and SPC flooring.
      </>
    ),
  },
};

export const hasRightToExistEntry = (slug: string): boolean =>
  Object.prototype.hasOwnProperty.call(RIGHT_TO_EXIST_ENTRIES, slug);

export const getRightToExistEntry = (slug: string): RightToExistEntry | undefined =>
  RIGHT_TO_EXIST_ENTRIES[slug];

// Existing DOM id contract. Kept in the data module so the renderer remains
// cluster-neutral while all currently rendered markup stays byte-identical.
export const getRightToExistHeadingId = (slug: string): string =>
  `c01-right-to-exist-${slug}`;
