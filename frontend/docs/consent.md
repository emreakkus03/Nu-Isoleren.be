# Cookie consent

## Audit

No analytics/marketing tags or tracking storage were found in the frontend. Existing script elements contain JSON-LD. Google Reviews is fetched on the server; its existing functionality is unchanged. next-intl manages locale routing and its functional locale cookie.

`ContactMap.tsx` embeds Google Maps. This is an existing third-party embed; this audit cannot establish its cookie/tracking behaviour. It has not been arbitrarily classified or removed. Confirm its behaviour and desired category before connecting it to the consent gate.

Privacy/cookie canonical route keys and footer links exist, but corresponding page implementations do not. Consent UI does not introduce additional broken policy links. Approved policy content/pages remain outstanding.

## State and storage

`lib/consent.ts` defines preferences, version 1 and validation. `lib/consent-store.ts` is the single client source of truth. It stores `nu-isoleren.consent` in localStorage with numeric `savedAt` and `expiresAt` timestamps, valid for 180 days. Necessary stays true; analytics and marketing default false. Missing, malformed, expired and older-version preferences are rejected. Storage events synchronize tabs; timers and visibility changes enforce expiry. Blocked storage retains the choice in memory and displays a localized notice.

`CookieConsent` is mounted once in the locale layout, under next-intl. Server and hydration snapshots are identical and deny optional categories until validation completes. The footer button opens a native modal dialog with explicit keyboard cycling, Escape, focus restoration and scroll locking.

## Future integrations

No tracking IDs, tags, network requests or demo integrations are added.

Wrap a future client integration in `ConsentGate category="analytics"` or `ConsentGate category="marketing"`. Do not initialize a vendor at module scope, in a server component, or in an unconditional script. Use `useConsent` for per-event checks and stop vendor listeners/timers on withdrawal. Unmounting a script component alone does not undo previously executed vendor code: each real vendor integration must implement its own disable/cleanup and cookie-removal behaviour as appropriate, and be tested for withdrawal and re-consent.

The store calls `updateGoogleConsent` before publishing a ready or changed state, so gated integrations see the Google default and current update before they can mount. The adapter queues all four Consent Mode v2 defaults as denied, then maps analytics to analytics_storage and marketing to ad_storage, ad_user_data and ad_personalization. This is an in-memory queue only; no Google library is loaded. Future tags must use the gate rather than run earlier through beforeInteractive or direct head scripts. Actual GTM integration may also require its own consent initialization template and category-specific tag triggers; a multi-purpose container must not bypass category gating.

The Google adapter uses Google's canonical Arguments-based gtag queue format. The narrow ESLint prefer-rest-params exception preserves that format; other lint rules remain enabled.

Reference: https://developers.google.com/tag-platform/security/guides/consent

## Validation

Run `node scripts/check-consent.mjs` for validation, version/expiry, independent categories, persistence, Google command order, storage events and storage-failure checks. Then run `npx tsc --noEmit` and `npm run lint`.

Browser checks should cover first visit, reject/accept/custom choices, refresh, footer reopening, Tab/Shift+Tab/Escape, all locales and the requested viewport widths. No real tracking is connected until the marketing partners supply configuration and vendor-specific lifecycle behaviour is implemented.

### Verification performed

- TypeScript and the consent regression script pass.
- Full ESLint reports the existing 21 errors and 2 warnings; the new consent code and test script pass targeted lint.
- `npm run build -- --webpack` passes.
- Banner and dialog checked in NL/FR/EN at 320, 375, 430, 768, 1024, 1280 and 1440 px (42 layout measurements, no component overflow).
- Browser checks cover reject, accept, analytics-only, marketing-only, refresh, footer reopening, focus cycling and Escape. Version/expiry/invalid data and storage failures are covered by the regression script.
- No hydration errors or targeted Image warnings appeared in the checked development/browser console. Production consent interactions and persistence also passed.
- The temporary production server logged failed background API fetches to localhost:9000 while rendering cached page content. No API configuration or backend code was changed.
- Existing uncommitted Hero and Google Reviews work was retained. Whole-tree diff checking finds pre-existing trailing whitespace in lib/google-reviews.ts; this task's changes pass diff checking.
