import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RelatedRailItem } from '@/lib/c16PanelCatalog';

type RelatedProductRailProps = {
  items: RelatedRailItem[];
  currentHref?: string;
  className?: string;
  scroll?: boolean;
};

const RelatedProductRail = ({ items, currentHref, className, scroll = false }: RelatedProductRailProps) => {
  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
          <Package className="h-5 w-5 text-emerald-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950">Explore the Range</h2>
          <p className="text-sm text-slate-500">Related products</p>
        </div>
      </div>

      <div className={cn('space-y-3 related-products-list', scroll && 'max-h-[60vh] overflow-y-auto pr-2')}>
        {items.length > 0 ? (
          items.map((item) => {
            const isCurrent = currentHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-related-product-rail-card="true"
                className={cn(
                  'group relative block rounded-lg border p-3 transition hover:border-emerald-300 hover:bg-emerald-50',
                  isCurrent ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm' : 'border-slate-200 bg-white'
                )}
              >
                <div className="flex gap-3">
                  <div
                    className={cn(
                      'relative h-14 w-14 shrink-0 overflow-hidden rounded-md border',
                      isCurrent ? 'border-white/30 bg-white/15' : 'border-slate-200 bg-slate-50'
                    )}
                  >
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.title}
                        className="h-full w-full object-cover"
                        width={56}
                        height={56}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center" data-rail-fallback="true">
                        <Package className={cn('h-5 w-5', isCurrent ? 'text-white' : 'text-slate-500 group-hover:text-emerald-700')} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-normal',
                        isCurrent ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700'
                      )}
                    >
                      {item.category}
                    </p>
                    <p className={cn('mt-1 font-semibold leading-snug', isCurrent ? 'text-white' : 'text-slate-950')}>
                      {item.title}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
            <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No related products available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProductRail;
