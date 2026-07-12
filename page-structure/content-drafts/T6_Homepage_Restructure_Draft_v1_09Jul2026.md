# T6 — Homepage Restructure 17→9 — Content Draft v1
**Date:** 09 Jul 2026 · **Author:** Fable 5 · **Ticket:** SHIKHAR T6 (master file Phase 2)
**Status:** Owner-approved when SAMAN issues the T6 build prompt naming this file.
**Rulings:** (1) Phase-2 homepage work ships as ONE PR on feat/shikhar-T2-homepage-hero —
T6 continues on that branch. (2) Owner has delegated design judgment to Fable 5 specs +
DS system; owner approval remains the final gate on preview.

## 1. Target section order (master file, LOCKED — exactly these 9)

1. Hero (as built in T2/T2.1 — three CTAs, badges; slots ready for real photos later)
2. Calculator strip (NEW — copy in §2)
3. Six category cards (as built in T2.2 — untouched)
4. Specs section (existing SpecsTable — keep, restyle to DS only)
5. Clients + testimonials MERGED into one section (existing content, both kept verbatim)
6. Process steps COMPRESSED (existing 6-step copy verbatim, tighter single-view layout)
7. Top-5 FAQ (keep the FIRST FIVE FAQs exactly as currently ordered, questions and
   answers byte-identical; remaining homepage FAQs removed from homepage only —
   FAQPage schema updated to match visible content, G6)
8. CTA block (existing CTAStrip copy verbatim)
9. Footer (untouched — T3 is a separate ticket)

Every other current homepage section is REMOVED from the homepage. The 15-product
grid (ProductShowcase) moves off the homepage to /product per master T6. All removed
content continues to exist on its own pages; nothing is deleted from the site.

## 2. Calculator strip — the ONLY new copy in T6 (verbatim)

- Eyebrow: `INSTANT ESTIMATE`
- Heading: `Know your price in 60 seconds`
- Subline: `Choose your size and specification — instant estimate. No registration, no calls required.`
- Button label: `Open Price Calculator` → existing calculator route (same target as the
  header button). Secondary text under button: `Free · Takes about a minute`
- Design: full-width band directly under the hero, DS forest background, white text,
  leaf-green button. This is the competitor-beating price-transparency answer.

## 3. SEO LOCK confirmation

Title, meta, H1, hero copy, first-100-words: byte-identical. Kept sections' copy:
byte-identical (git diff proof). No new indexable copy anywhere except §2 strings.
Facts registry unchanged. No changes to any other route except mounting ProductShowcase
on /product (its existing copy transplants verbatim).

## 4. Out of scope

Footer (T3), sticky mobile bar (T2-master), header files (T1 branch), certification
numbers strip (pending owner-supplied registration numbers — future amendment),
hero real-photo swap (pending owner photos — separate mini-ticket).
