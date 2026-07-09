import type { ReactNode, SVGProps } from 'react';

/**
 * Inline line icons for the SAMAN Design System (T0.1).
 * Zero dependencies (L11): hand-drawn SVG paths that inherit `currentColor`,
 * so colour is always token-driven by the consuming element — never hardcoded.
 * 24×24 viewBox, 1.6 stroke, no fill. Decorative by default (aria-hidden).
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6.5 3.5h3l1.2 4-2 1.3a11 11 0 0 0 4.2 4.2l1.3-2 4 1.2v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
    </Svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4.5" />
    </Svg>
  );
}

export function CheckSealIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.4 2.4 4.6-5" />
    </Svg>
  );
}

export function FactoryIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 20.5V10l5 3.2V10l5 3.2V9l7 1.5v10Z" />
      <path d="M3.5 20.5h17" />
      <path d="M7 20.5v-3M11 20.5v-3M15 20.5v-3" />
    </Svg>
  );
}

export function CertificateIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="12" rx="1.5" />
      <path d="M7.5 8h9M7.5 11h5" />
      <path d="M12 16v4l1.8-1.2L15.6 20v-4" />
    </Svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.2" />
      <path d="M9 7h2M13 7h2M9 10.5h2M13 10.5h2M9 14h2M13 14h2" />
      <path d="M10.5 20.5v-3h3v3" />
    </Svg>
  );
}

export function RegIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 8 3.5Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 15.5h4" />
    </Svg>
  );
}

export function CalculatorIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="5.5" y="3.5" width="13" height="17" rx="1.5" />
      <rect x="8" y="6" width="8" height="3" rx="0.6" />
      <path d="M8.5 13h0M12 13h0M15.5 13h0M8.5 16.5h0M12 16.5h0M15.5 16.5h.01" />
    </Svg>
  );
}

export function ChatQuoteIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 6.5A2 2 0 0 1 6.5 4.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5v-3.5H6.5a2 2 0 0 1-2-2Z" />
      <path d="M8.5 9h7M8.5 12h4" />
    </Svg>
  );
}

/** Ordered set used by TrustBadgeRow to auto-assign a glyph per item by index. */
export const TRUST_ICON_CYCLE = [ShieldIcon, CheckSealIcon, FactoryIcon, CertificateIcon, BuildingIcon, RegIcon] as const;
