# STG-02A Form Test-Destination Requirements

Date: 2026-08-26
Final form status: `PROVIDER_SANDBOX_REQUIRED`

No Contact, Quote, Enquiry, Labour Colony Enquiry, or Review form was submitted. This is a read-only implementation/configuration assessment. Secret values and hard-coded recipient addresses are intentionally omitted.

## Form routes and outbound paths

| Form | API route | Email provider / recipient configuration | CRM, webhook, or other write path | Analytics | Anti-abuse |
|---|---|---|---|---|---|
| Contact | `POST /api/contact-form` | Nodemailer through Brevo SMTP. `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`; current process configuration missing. Recipients are a hard-coded production list in `src/config/emails.ts`; there is no recipient environment variable. | Zoho public web-form endpoint, hard-coded production destination; no staging override. No form-specific webhook or WhatsApp path. | `contact_form_submit` to the hard-coded production GTM container; no staging analytics override. | Required-field, email, and phone validation. No server honeypot, CAPTCHA, or rate limiter in the inspected route. |
| Quote | `POST /api/quote-request` | Same Brevo/Nodemailer variables and same hard-coded production recipients; current process configuration missing. | Same hard-coded Zoho public web-form endpoint; no staging override. No form-specific webhook or WhatsApp path. | `contact_form_submit`; hard-coded production GTM container. | Required-field, email, and phone validation. No server honeypot, CAPTCHA, or rate limiter in the inspected route. |
| Enquiry | `POST /api/enquiry` | Same Brevo/Nodemailer variables and production recipients; current process configuration missing. | General enquiries use the hard-coded Zoho public form. Labour Colony enquiries first use Zoho OAuth API and fall back to the public form. OAuth variables: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`; optional/default routing variables: `ZOHO_ACCOUNTS_URL`, `ZOHO_API_DOMAIN`, `ZOHO_SOUTH_OWNER_ID`, `ZOHO_NORTH_OWNER_ID`. No staging pipeline or endpoint override exists. | `contact_form_submit`; hard-coded production GTM container. | Hidden `website` honeypot plus validation. Filled honeypot is silently accepted without delivery. No rate limiter/CAPTCHA found. |
| Review | `POST /api/submit-review` | No email delivery path. | WooCommerce REST write to `WORDPRESS_API_URL` plus `WORDPRESS_REVIEW_WRITE_KEY` and `WORDPRESS_REVIEW_WRITE_SECRET`. `WORDPRESS_API_URL` defaults to the production blog API. A valid request creates a production data record with status `hold`; it is not auto-published, but it is still a real write. | No review-submit analytics event found in the inspected Review form. The page still uses the shared production GTM implementation. | Hidden `company` honeypot and server-side product/rating/name/email/review validation. |

## Provider/configuration status

| Provider/service | Environment variable name | Current state | Destination class | Safe marked staging submission now? | Existing staging override? |
|---|---|---|---|---|---|
| Brevo SMTP via Nodemailer | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Variables missing in the inspected process; host has a Brevo default. | Production-capable provider | No | No |
| Email recipients | No environment variable exists | Hard-coded production recipient list | Production | No | No |
| Zoho public form | No environment variable exists | Hard-coded production public-form endpoint | Production CRM lead path | No | No |
| Zoho OAuth CRM | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ACCOUNTS_URL`, `ZOHO_API_DOMAIN`, `ZOHO_SOUTH_OWNER_ID`, `ZOHO_NORTH_OWNER_ID` | Credentials missing in inspected process; production domains/owner IDs have defaults | Production-capable CRM | No | No sandbox/pipeline switch |
| WooCommerce reviews | `WORDPRESS_API_URL`, `WORDPRESS_REVIEW_WRITE_KEY`, `WORDPRESS_REVIEW_WRITE_SECRET` | Write credentials missing; API URL defaults to production | Production data write (`hold`) | No | URL can be overridden, but no verified staging destination is configured |
| Google Tag Manager | No environment variable exists; container ID is hard-coded | Production container configured in code | Production analytics | No marked test isolation | No |
| Generic form webhook | None for these four API routes | Not configured | None | Not applicable | No |
| WhatsApp lead delivery | None for these four API routes | Not configured | None | Not applicable | No |

The separate Google Ads lead webhook API is not invoked by these four form routes and is not a safe substitute for form-delivery QA.

## Environment behavior

- Development/local: application code uses the same hard-coded Zoho public-form endpoint and production recipient list if outbound credentials are supplied. The Review route defaults to the production WooCommerce API URL. There is no `NODE_ENV`-based non-delivery behavior.
- Preview/staging: no verified environment-specific form configuration, recipient override, Zoho sandbox switch, CRM test pipeline, review sandbox, or analytics test property is defined in the repository. A real submission could reach production systems.
- Production: Contact, Quote, and Enquiry deliver to Zoho plus Brevo email; Labour Colony can use the Zoho API first; Review writes a pending WooCommerce review.
- Existing safe evidence: STG-01C stubbed the outbound boundary and verified the no-JavaScript form contract with zero external deliveries. This proves application wiring but not provider delivery.

## Minimum safe test setup

The owner must supply or explicitly approve all destinations needed for the form family being tested:

1. A staging-only internal test inbox, plus an environment-driven recipient override such as `FORM_EMAIL_RECIPIENTS`. This variable does not exist yet and must not replace the production list globally.
2. A Zoho sandbox/staging destination: either a sandbox public-form endpoint exposed through a staging-only override such as `ZOHO_PUBLIC_FORM_ENDPOINT`, or sandbox OAuth credentials and test owner/pipeline IDs using the existing Zoho credential variables. Production lead ownership must be impossible in the staging environment.
3. A private non-production WordPress/WooCommerce base URL and non-production `WORDPRESS_REVIEW_WRITE_KEY` / `WORDPRESS_REVIEW_WRITE_SECRET` for Review QA. Test reviews must be visibly marked and covered by an owner-approved cleanup policy.
4. A staging GTM/test analytics property through a new environment override such as `NEXT_PUBLIC_GTM_ID`, or explicit approval to suppress analytics in staging. The current hard-coded production container is not safe marked-test isolation.
5. If no provider sandbox is available, approval for a local non-delivery sink that exercises validation, API routing, formatting, and provider adapters while blocking every external request.

A safe test must fail closed when any required staging destination is missing. No email address, credential, CRM ID, webhook, analytics identifier, or test data was added by STG-02A.
