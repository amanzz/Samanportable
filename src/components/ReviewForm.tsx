import { useState, forwardRef } from 'react';
import { Button } from './ui/button';
import { Star, Loader2, CheckCircle, PenLine } from 'lucide-react';

interface ReviewFormProps {
  productId: number;
  productName?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Real product-review submission form. Posts to the same-origin server route
 * /api/submit-review, which forwards to WooCommerce as a PENDING review
 * (status: 'hold') for admin approval. No WooCommerce keys are ever exposed here.
 * Deterministic markup (no Date/locale) → hydration-safe.
 */
const ReviewForm = forwardRef<HTMLDivElement, ReviewFormProps>(({ productId, productName }, ref) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [company, setCompany] = useState(''); // honeypot — must stay empty for humans
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rating < 1 || rating > 5) { setError('Please select a star rating.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please enter a valid email address.'); return; }
    if (review.trim().length < 5) { setError('Please write a short review.'); return; }

    setStatus('submitting');
    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, name, email, review, rating, company }),
      });
      const data = await res.json().catch(() => ({} as any));
      if (res.ok && data && data.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setError((data && data.message) || 'We could not submit your review right now. Please try again later.');
      }
    } catch {
      setStatus('error');
      setError('We could not submit your review right now. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div
        ref={ref}
        id="review-form"
        className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center scroll-mt-24"
      >
        <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-600" />
        <p className="text-base font-semibold text-green-900">Thank you. Your review has been submitted and will be published after approval.</p>
        <p className="mt-1 text-sm text-green-700">Verified reviews appear on this page once our team approves them.</p>
      </div>
    );
  }

  const activeStar = hover || rating;

  return (
    <div ref={ref} id="review-form" className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 scroll-mt-24">
      <div className="mb-4 flex items-center gap-2">
        <PenLine className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Write a Review{productName ? ` for ${productName}` : ''}</h3>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Star rating (required) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Your rating <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                <Star className={`h-7 w-7 ${n <= activeStar ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
              </button>
            ))}
            {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rv-name" className="mb-1 block text-sm font-medium text-foreground">Name <span className="text-red-500">*</span></label>
            <input id="rv-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="rv-email" className="mb-1 block text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
            <input id="rv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={150}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            <p className="mt-1 text-xs text-muted-foreground">Your email is not published.</p>
          </div>
        </div>

        <div>
          <label htmlFor="rv-review" className="mb-1 block text-sm font-medium text-foreground">Your review <span className="text-red-500">*</span></label>
          <textarea id="rv-review" value={review} onChange={(e) => setReview(e.target.value)} required rows={4} maxLength={5000}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Share your experience with this product…" />
        </div>

        {/* Honeypot — visually hidden; bots fill it, humans don't. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="rv-company">Company</label>
          <input id="rv-company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="pb-20 sm:pb-0">
          <Button type="submit" disabled={status === 'submitting'} className="w-full sm:w-auto">
            {status === 'submitting' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>) : 'Submit Review'}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Reviews are published after approval by our team.</p>
        </div>
      </form>
    </div>
  );
});

ReviewForm.displayName = 'ReviewForm';
export default ReviewForm;
