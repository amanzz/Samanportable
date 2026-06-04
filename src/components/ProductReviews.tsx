import Link from 'next/link';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Star, CheckCircle, MessageSquare, PenLine } from 'lucide-react';
import { ProductReview } from '@/config/api';

interface ProductReviewsProps {
  reviews: ProductReview[];
  averageRating?: string;
  ratingCount?: number;
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
// no timezone. WooCommerce `date_created` is a local "YYYY-MM-DDTHH:MM:SS" string;
// we read only the calendar date and format it with a fixed English month table.
// Because it is pure string manipulation, the server (Node) and the client
// (any browser/locale/timezone) produce the EXACT same output → no React
// hydration mismatch. (`toLocaleDateString` was the prior hydration cause: its
// output depends on the runtime's ICU/locale and system timezone.)
function formatDate(iso: string): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return '';
  const year = m[1];
  const monthIndex = parseInt(m[2], 10) - 1;
  const day = parseInt(m[3], 10);
  const monthName = MONTH_NAMES[monthIndex];
  if (!monthName || !day) return '';
  return `${day} ${monthName} ${year}`; // e.g. "15 January 2025"
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

// Safe, non-functional CTA. It does NOT submit a review and does NOT touch the
// backend — it links to the contact/enquiry page so a customer can share
// feedback, which is then published only after WooCommerce moderation. Rendered
// as a single <a> (Button asChild) to keep HTML nesting valid + hydration-safe.
function WriteReviewCta() {
  return (
    <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <Button asChild variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
        <Link href="/contact">
          <PenLine className="w-4 h-4 mr-2" />
          Write a Review
        </Link>
      </Button>
      <p className="text-xs text-muted-foreground">
        Share your experience with our team. Verified customer reviews are published after approval.
      </p>
    </div>
  );
}

/**
 * Renders the Customer Reviews section for a product.
 * - With approved backend reviews: shows the real backend average + count and
 *   the latest approved review cards (these are the SAME reviews placed in the
 *   Review JSON-LD — visible === structured).
 * - With NO reviews (rating_count = 0): shows a clear "no reviews yet" state with
 *   NO fake stars, NO aggregate, and (separately) NO Review/AggregateRating schema.
 * Every value rendered here is deterministic, so SSR and client output match.
 */
export default function ProductReviews({ reviews, averageRating, ratingCount }: ProductReviewsProps) {
  const list = Array.isArray(reviews) ? reviews : [];
  const hasReviews = list.length > 0;
  const count = typeof ratingCount === 'number' && ratingCount > 0 ? ratingCount : 0;
  const avg = averageRating ? parseFloat(averageRating) : 0;

  return (
    <section className="mt-4" aria-labelledby="customer-reviews-heading">
      <Card className="p-4 sm:p-6 md:p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
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
              // No fake stars — explicit zero state.
              <p className="text-sm text-muted-foreground mt-1">0 reviews</p>
            )}
          </div>
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
            <p className="text-sm font-medium text-foreground">No customer reviews yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to review this product.</p>
          </div>
        )}

        <WriteReviewCta />
      </Card>
    </section>
  );
}
