import type { ReactNode } from 'react';

/**
 * Shared prop contracts for the SAMAN Design System.
 */

/** A call-to-action. Either an href (link) or an onClick (button) is expected. */
export interface DsCta {
  label: string;
  href?: string;
  onClick?: () => void;
  /** Native-ish semantics hint; purely presentational routing is caller's job. */
  ariaLabel?: string;
}

/**
 * Every image slot in the design system REQUIRES explicit width/height (L11):
 * intrinsic dimensions reserve space and guarantee zero CLS. `src` is a plain
 * URL string so components stay decoupled from next/image vs <img>.
 */
export interface DsImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** A single spec/price data point rendered in the utility (mono) face. */
export interface DsSpecItem {
  label: string;
  value: string;
}

export type DsNode = ReactNode;
