import { cn } from '@/lib/utils';

type ProductZoneCtasProps = {
  variant?: 'strip' | 'card';
  className?: string;
};

const zones = [
  {
    label: 'Bangalore & South Zone',
    phoneHref: 'tel:+918861622859',
    email: 'sales@samanportable.com',
    emailHref: 'mailto:sales@samanportable.com',
  },
  {
    label: 'Delhi NCR & North Zone',
    phoneHref: 'tel:+918796039938',
    email: 'ncr@samanportable.com',
    emailHref: 'mailto:ncr@samanportable.com',
  },
];

const PhoneIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
  </svg>
);

const ZoneActions = ({ compact = false }: { compact?: boolean }) => (
  <>
    {zones.map((zone) => (
      <div
        key={zone.label}
        className={cn(
          'flex h-full flex-col rounded-lg border border-emerald-100 bg-white shadow-sm shadow-emerald-950/[0.04]',
          compact ? 'p-3' : 'p-4'
        )}
      >
        <div className="mb-3 flex min-h-[2rem] items-center justify-between gap-3">
          <p className={cn('font-bold text-slate-900', compact ? 'text-xs' : 'text-sm')}>
            {zone.label}
          </p>
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <a
            href={zone.phoneHref}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-center font-semibold text-white shadow-sm shadow-primary/20 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            <PhoneIcon />
            <span>Call</span>
          </a>
          <a
            href={zone.emailHref}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/5 px-3 text-center font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            <MailIcon />
            <span>Send Enquiry</span>
          </a>
        </div>
      </div>
    ))}
  </>
);

const ProductZoneCtas = ({ variant = 'card', className }: ProductZoneCtasProps) => {
  return (
    <section
      aria-label="Product enquiry contacts by zone"
      className={cn(
        'rounded-lg border border-emerald-100 bg-white/95 p-3 shadow-md shadow-emerald-950/[0.05]',
        className
      )}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ZoneActions compact={variant === 'strip'} />
      </div>
    </section>
  );
};

export default ProductZoneCtas;
