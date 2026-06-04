import type { NextApiRequest, NextApiResponse } from 'next';

// Server-side product-review submission proxy.
//
// - WooCommerce keys stay SERVER-SIDE (env) — never sent to or returned to the browser.
// - Reviews are created with status: 'hold' → PENDING. They are NEVER auto-published;
//   an admin approves them in WooCommerce → Products → Reviews. Only then does the
//   existing approved-reviews fetch (status=approved) pick them up for display + schema.
// - Input is validated server-side; the client only ever sees friendly messages
//   (no WooCommerce error text, no keys).
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  try {
    const body = (req.body && typeof req.body === 'object') ? req.body : {};
    const productId = parseInt(String((body as any).productId ?? ''), 10);
    const reviewer = String((body as any).name ?? '').trim().slice(0, 100);
    const reviewerEmail = String((body as any).email ?? '').trim().slice(0, 150);
    const review = String((body as any).review ?? '').trim().slice(0, 5000);
    const rating = parseInt(String((body as any).rating ?? ''), 10);
    const honeypot = String((body as any).company ?? '').trim(); // hidden field; real users leave empty

    // Spam honeypot: a filled hidden field = bot. Pretend success (don't create, don't reveal).
    if (honeypot) {
      return res.status(200).json({ ok: true, pending: true });
    }

    // Server-side validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail);
    if (!Number.isFinite(productId) || productId <= 0) {
      return res.status(400).json({ ok: false, message: 'Sorry, we could not identify the product.' });
    }
    if (!reviewer) return res.status(400).json({ ok: false, message: 'Please enter your name.' });
    if (!emailOk) return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    if (!review || review.length < 5) return res.status(400).json({ ok: false, message: 'Please write a short review (at least a few words).' });
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, message: 'Please select a rating from 1 to 5 stars.' });
    }

    const base = (process.env.WORDPRESS_API_URL || 'https://blog.samanportable.com/wp-json') + '/wc/v3';
    const key = process.env.WORDPRESS_REVIEW_WRITE_KEY || '';
    const secret = process.env.WORDPRESS_REVIEW_WRITE_SECRET || '';
    // Query-string auth (same method the working routes use); keys never leave the server.
    const auth = new URLSearchParams({ consumer_key: key, consumer_secret: secret });

    const wcRes = await fetch(`${base}/products/reviews?${auth.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        review,
        reviewer,
        reviewer_email: reviewerEmail,
        rating,
        status: 'hold', // PENDING — requires admin approval; never auto-published
      }),
    });

    if (wcRes.status === 201 || wcRes.ok) {
      return res.status(200).json({ ok: true, pending: true });
    }

    // WooCommerce returns 409 when the same email already reviewed this product.
    if (wcRes.status === 409) {
      return res.status(200).json({ ok: false, message: 'It looks like you have already submitted a review for this product.' });
    }

    // Any other failure: friendly message only. Never leak status text or keys.
    console.error('submit-review: WooCommerce responded with', wcRes.status);
    return res.status(502).json({ ok: false, message: 'We could not submit your review right now. Please try again in a little while.' });
  } catch (error) {
    console.error('submit-review failed:', error instanceof Error ? error.message : 'unknown error');
    return res.status(500).json({ ok: false, message: 'Something went wrong while submitting your review. Please try again later.' });
  }
}
