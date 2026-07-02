import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { pushDataLayer } from '@/lib/analytics';

/**
 * Native guided-enquiry chatbot - GLOBAL MOUNT (one instance, in _app.tsx).
 *
 * PERFORMANCE ARCHITECTURE
 *  - Only this tiny floating button ships in the wrapper. It renders a single
 *    <button> with an inline SVG (no icon library, no external CSS/JS/fonts).
 *  - The full multi-step panel lives in ./ChatbotPanel and is code-split via
 *    next/dynamic (ssr:false). Its chunk is fetched ONLY on the first click -
 *    zero panel code in the initial bundle.
 *  - Fixed positioning + predefined panel size means no layout shift (CLS 0).
 *  - Never auto-opens: no timers, no scroll triggers, no popups.
 */

// Lazy chunk: downloaded on first open only. ssr:false keeps it fully client-side.
const ChatbotPanel = dynamic(() => import('./ChatbotPanel'), { ssr: false });

const TEASER_SEEN_KEY = 'saman_chatbot_teaser_seen';
const PULSE_STOPPED_KEY = 'saman_chatbot_pulse_stopped';

const EnquiryChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [pulseStopped, setPulseStopped] = useState(false);
  // We fully unmount the panel on close to keep the DOM minimal; the chunk is
  // already cached by the browser, so re-open is instant.
  const buttonRef = useRef<HTMLButtonElement>(null);
  const teaserClickTrackedRef = useRef(false);

  useEffect(() => {
    try {
      setPulseStopped(window.sessionStorage.getItem(PULSE_STOPPED_KEY) === '1');
    } catch {
      setPulseStopped(false);
    }

    let teaserSeen = false;
    try {
      teaserSeen = window.sessionStorage.getItem(TEASER_SEEN_KEY) === '1';
    } catch {
      teaserSeen = false;
    }

    if (teaserSeen) return undefined;

    const showTimer = window.setTimeout(() => {
      try {
        if (window.sessionStorage.getItem(TEASER_SEEN_KEY) === '1') return;
        window.sessionStorage.setItem(TEASER_SEEN_KEY, '1');
      } catch {
        // Keep the UI working if storage is unavailable.
      }
      setTeaserVisible(true);
      pushDataLayer('chatbot_teaser_shown');
    }, 8000);

    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!teaserVisible) return undefined;

    const dismissTimer = window.setTimeout(() => {
      setTeaserVisible(false);
    }, 12000);

    return () => window.clearTimeout(dismissTimer);
  }, [teaserVisible]);

  const markTeaserSeen = useCallback(() => {
    try {
      window.sessionStorage.setItem(TEASER_SEEN_KEY, '1');
    } catch {
      // Session storage can be unavailable in hardened browsers.
    }
  }, []);

  const dismissTeaser = useCallback((action?: 'bubble' | 'close' | 'launcher') => {
    markTeaserSeen();
    setTeaserVisible(false);

    if (action && !teaserClickTrackedRef.current) {
      teaserClickTrackedRef.current = true;
      pushDataLayer('chatbot_teaser_clicked', { action });
    }
  }, [markTeaserSeen]);

  const handleOpen = useCallback(() => {
    setPulseStopped(true);
    try {
      window.sessionStorage.setItem(PULSE_STOPPED_KEY, '1');
    } catch {
      // Pulse state is visual only; failure should not block the chatbot.
    }
    dismissTeaser(teaserVisible ? 'launcher' : undefined);
    setOpen(true);
    pushDataLayer('chatbot_open');
  }, [dismissTeaser, teaserVisible]);

  const handleTeaserClick = useCallback(() => {
    dismissTeaser('bubble');
    handleOpen();
  }, [dismissTeaser, handleOpen]);

  const handleTeaserClose = useCallback(() => {
    dismissTeaser('close');
  }, [dismissTeaser]);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Accessibility: return focus to the launcher when the panel closes.
    // Defer to next frame so the button is back in the DOM.
    requestAnimationFrame(() => buttonRef.current?.focus());
  }, []);

  return (
    <>
      {!open && (
        <div
          /* Mobile bottom offset clears MobileBottomNav; the sub-sm right offset
             keeps product-page scroll-to-top controls from overlapping the launcher. */
          className="chatbot-launcher fixed bottom-[4.75rem] right-20 z-[9990] sm:right-4 lg:bottom-6 lg:right-6"
        >
          {teaserVisible && (
            <div className="chatbot-teaser rounded-2xl border border-primary/15 bg-white p-3 text-left text-sm font-semibold leading-snug text-slate-800 shadow-xl shadow-black/15">
              <button
                type="button"
                onClick={handleTeaserClick}
                className="block pr-7 text-left transition-colors duration-150 hover:text-primary focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
              >
                Get the best price for your requirement
              </button>
              <button
                type="button"
                onClick={handleTeaserClose}
                aria-label="Dismiss chatbot price teaser"
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}

          {!pulseStopped && (
            <span aria-hidden="true" className="chatbot-pulse-ring pointer-events-none absolute inset-0 rounded-full" />
          )}

          <button
            ref={buttonRef}
            type="button"
            onClick={handleOpen}
            aria-haspopup="dialog"
            aria-label="Open enquiry chat to get best price"
            className="relative z-10 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg ring-1 ring-black/5 transition-[box-shadow,transform] duration-150 ease-out hover:scale-[1.04] hover:shadow-xl focus:outline-none focus-visible:scale-[1.04] focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-xl motion-reduce:transition-none"
          >
            {/* Inline chat SVG - no icon library. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>Get Best Price</span>
          </button>

          <style jsx>{`
            .chatbot-launcher {
              animation: chatbot-launcher-entry 520ms cubic-bezier(0.18, 0.89, 0.32, 1.28) 1.5s both;
            }

            .chatbot-pulse-ring {
              border: 2px solid hsl(var(--primary) / 0.42);
              animation: chatbot-pulse-cycle 17s ease-out infinite;
              transform-origin: center;
            }

            .chatbot-teaser {
              position: absolute;
              right: calc(100% + 0.75rem);
              bottom: 0.125rem;
              width: max-content;
              max-width: 240px;
              animation: chatbot-teaser-in 280ms ease-out both;
            }

            @media (max-width: 639px) {
              .chatbot-teaser {
                right: 0;
                bottom: calc(100% + 0.75rem);
                max-width: min(15rem, calc(100vw - 2rem));
              }
            }

            @keyframes chatbot-launcher-entry {
              0% {
                opacity: 0;
                transform: translateY(18px);
              }
              68% {
                opacity: 1;
                transform: translateY(-2px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes chatbot-pulse-cycle {
              0% {
                opacity: 0;
                transform: scale(1);
              }
              2.9% {
                opacity: 0.42;
                transform: scale(1.03);
              }
              5.9% {
                opacity: 0;
                transform: scale(1.42);
              }
              6% {
                opacity: 0;
                transform: scale(1);
              }
              8.9% {
                opacity: 0.36;
                transform: scale(1.04);
              }
              11.8% {
                opacity: 0;
                transform: scale(1.62);
              }
              100% {
                opacity: 0;
                transform: scale(1.62);
              }
            }

            @keyframes chatbot-teaser-in {
              0% {
                opacity: 0;
                transform: translateX(10px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .chatbot-launcher,
              .chatbot-teaser,
              .chatbot-pulse-ring {
                animation: none;
                opacity: 1;
                transform: none;
              }

              .chatbot-pulse-ring {
                display: none;
              }
            }
          `}</style>
        </div>
      )}

      {open && <ChatbotPanel onClose={handleClose} />}
    </>
  );
};

export default EnquiryChatbot;
