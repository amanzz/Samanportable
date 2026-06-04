import { useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Star, CheckCircle, MessageSquare, PenLine } from 'lucide-react';
import { ProductReview } from '@/config/api';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating?: string;
  ratingCount?: number;
  productId: number;
  productName?: string;
}

// Strip HTML/entities so review text renders as plain, safe text (no
// dangerouslySetInnerHTML — review bodies are user-generated backend content).
function stripHtml(html: string): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// DETERMINISTIC date formatter — no `Date`, no `toLocaleDateString`, no `Intl`,
// no timezone. Pure string manipulation → identical on server and client → no
// React hydration mismatch. (Unchanged from the approved review-rendering logic.)
function formatDate(iso: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return '';
  const year = m[1];
  const monthIndex = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const monthName = MONTH_NAMES[monthIndex];
  if (!monthName || !day) return '';
  return `${day} ${monthName} ${year}`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
}

/**
 * Customer Reviews panel (rendered inside the product "Reviews" tab).
 * - With approved backend reviews: real backend average + count + the latest
 *   approved review cards (the SAME reviews placed in the Review JSON-LD —
 *   visible === structured). No fake stars/cards/aggregate.
 * - With NO reviews: a clean zero-state, then the review submission form.
 * The "Write a Review" button scrolls to / focuses the in-page form — it does NOT
 * redirect to Contact Us. Submitted reviews go to WooCommerce as PENDING (admin
 * approval) via /api/submit-review; nothing here changes the approved-review
 * fetch or the Review/AggregateRating schema.
 */
export default function ProductReviews({ reviews, averageRating, ratingCount, productId, productName }: ProductReviewsProps) {
  const list = Array.isArray(reviews) ? reviews : [];
  const hasReviews = list.length > 0;
  const count = typeof ratingCount === 'number' && ratingCount > 0 ? ratingCount : 0;
  const avg = averageRating ? parseFloat(averageRating) : 0;
  const formRef = useRef<HTMLDivElement>(null);

  const focusForm = () => {
    const el = formRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const nameInput = el.querySelector<HTMLInputElement>('#rv-name');
    if (nameInput) window.setTimeout(() => nameInput.focus(), 350);
  };

  return (
    <section className="mt-0" aria-labelledby="customer-reviews-heading">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="customer-reviews-heading" className="text-2xl font-bold text-foreground">
                Customer Reviews
              </h2>
              {hasReviews && count > 0 ? (
                <div className="flex items-center gap-2 mt-1">
                  {avg > 0 && <Stars rating={Math.round(avg)} />}
                  <span className="text-sm text-muted-foreground">
                    {avg > 0 ? `${avg.toFixed(2)} out of 5 · ` : ''}
                    {count} {count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">0 reviews</p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={focusForm}
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
          >
            <PenLine className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </div>

        {hasReviews ? (
          <div className="space-y-4">
            {list.map((r) => {
              const text = stripHtml(r.review);
              const date = formatDate(r.date_created);
              return (
                <div key={r.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{r.reviewer}</span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  {text && <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>}
                  {date && <p className="text-xs text-muted-foreground mt-2">{date}</p>}
                </div>
              );
            })}
          </div>
        ) : (
          // Zero-review state: clear, honest, no fake reviewer cards / stars.
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <p className="text-sm font-medium text-foreground">No reviews yet. Be the first to review this product.</p>
          </div>
        )}

        {/* Real review submission form (pending admin approval). Single form, no
            duplication, no redirect to Contact. */}
        <ReviewForm ref={formRef} productId={productId} productName={productName} />
      </Card>
    </section>
  );
}
