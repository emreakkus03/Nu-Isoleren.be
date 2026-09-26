# Privacy, cookies en bedankpagina’s — launchrapport

Datum: 26 september 2026. Frontend en backend onderzocht. Alleen frontendbestanden gewijzigd; geen migrations, deployment of push. De working tree was bij de start schoon.

## 1. Implementatie en gewijzigde bestanden

- `i18n/config.ts`: twee routekeys en NL/FR/EN-paden.
- `app/[locale]/thank-you/contact/page.tsx`, `app/[locale]/thank-you/quote/page.tsx`: aparte contact-/offertebevestiging, noindex/follow, centrale metadata en self-canonical.
- `components/legal/ThankYouPage.tsx`: gedeeld ontwerp, gelokaliseerde homepage-/diensten-CTA’s; geen persoonsgegevens of referenties in URL’s.
- `components/contact/ContactForm.tsx`, `components/quote/QuoteForm.tsx`: alleen na HTTP-succes én `success === true` navigeren met bestaande next-intl router.replace. Synchrone ref-lock voorkomt dubbele in-flight submits; knop blijft uitgeschakeld tot navigatie. Bij fouten worden lock en knop vrijgegeven, met bestaande foutmelding. Geen wijziging van API-payloads. De offerteprivacytekst is nu een werkende beleidslink. De referentie blijft in backend/e-mail, niet op de publieke bedankpagina.
- `app/sitemap.ts`: thank-you routekeys expliciet uitgesloten; overige sitemaplogica intact.
- `app/[locale]/privacy-policy/page.tsx`, `app/[locale]/cookie-policy/page.tsx`: bestaande beleidsroutes daadwerkelijk bereikbaar.
- `components/legal/PolicyPage.tsx`: leesbare secties, bestaande bedrijfscontactgegevens, wijzigingsdatum, klachtenlink en voorkeurenknop.
- `components/legal/PolicyLinks.tsx`: gelokaliseerde beleidslinks; sluit het voorkeurenvenster bij navigatie.
- `components/cookie/CookieConsent.tsx`, `components/cookie/CookiePreferences.tsx`: alleen beleidslinks toegevoegd; opslag, GTM en consentmapping niet aangepast.
- `messages/nl.json`, `messages/fr.json`, `messages/en.json`: alleen nieuwe namespaces LegalPages en ThankYouPage. Bestaande vertalingen behouden.
- `tests/forms-legal.test.mjs`: zeven gerichte frontendtests.
- `docs/privacy-cookie-launch-report.md`: dit rapport.

De bestaande footerlinks en CookiePreferencesButton worden hergebruikt. Ook de beleidspagina’s staan voorlopig op noindex/follow en blijven buiten de sitemap: de teksten benoemen ontbrekende bedrijfsbeslissingen en zijn geen verklaring dat alle AVG-verplichtingen reeds zijn afgerond. Dit heeft geen invloed op de indexering van andere pagina’s.

## 2. Contactformulier: gegevens

API POST `/api/contact-submissions` met first_name, last_name, email, phone (optioneel), message, privacy_accepted, locale en source=contact_page. Servervalidatie: naamvelden maximaal 100, e-mail 255, telefoon 50, bericht 10–5000 tekens; privacybevestiging verplicht; locale nl/fr/en. Geen uploads.

`ContactSubmissionController` schrijft naar `contact_submissions`: bovenstaande persoonsgegevens, locale/source, privacy_accepted_at, status=new, crm_status=pending en timestamps. Het model ondersteunt ook internal_notes, crm_external_id en crm_synced_at. Dat bewijst geen actieve CRM-overdracht van contactaanvragen.

## 3. Offerteformulier: gegevens

API POST `/api/quote-requests` met first_name, last_name, email, phone, street, house_number, postcode, city, geselecteerde service_ids, optioneel message, locale en privacy_consent. Privacybevestiging verplicht. Service-IDs worden server-side op bestaan/geen duplicaten gecontroleerd. Geen uploads.

`QuoteRequestController` schrijft binnen een database-transactie naar `quote_requests`, met reference, status, privacy_consent_at en timestamps. Gekozen diensten komen in `quote_request_service`. De backend retourneert HTTP 201 met success=true en onder meer de referentie. Mislukte opslag geeft een fout; e-mailfouten na opslag betekenen niet dat het ontvangen verzoek ontbreekt.

## 4. Backend, database en beheer

Beide verzoektypen hebben Filament-resources voor beheer. Er is geen automatische pruning/verwijderplanning voor deze gegevens gevonden. De openbare POST-routes hebben throttling en invoervalidatie. Geen IP-/user-agentvelden in de onderzochte aanvraagtabellen; dit betekent niet dat hosting-/accesslogs geen technische gegevens verwerken.

De privacycheckbox is geen afzonderlijke nieuwsbrief- of advertentietoestemming. Het formulier slaat een bevestigingstijdstip op, geen versie van de gelezen beleidstekst. De gekozen rechtsgrond voor niet-contractuele contactvragen en technische logging moet het bedrijf nog documenteren.

## 5. E-mail en CRM

`BrevoService` gebruikt in productie de Brevo SMTP-email REST API indien enabled en API-key aanwezig. Gebruiker bevestigt Brevo als transactionele dienst. Contact: interne melding met Reply-To van de aanvrager. Offerte: interne melding en klantbevestiging in NL/FR/EN via QuoteRequestCreated-listeners; de referentie staat in de klantmail. Lokaal schakelt de service naar Laravel Mail, dus lokale mailconfig is geen bewijs voor de productieontvanger.

Optioneel: `SendQuoteRequestToCrm` → `CrmWebhookService`, uitsluitend met CRM_ENABLED, URL en secret. Payload bevat contactgegevens, adres, diensten, bericht, referentie/status/locale en datums. HMAC-ondertekend. Werkelijke CRM-leverancier, activering, regio en bewaartermijn niet vastgesteld; geen leverancier verzonnen.

Exceptions worden gerapporteerd. Brevo-/CRM-foutresponses kunnen in foutlogs belanden. `config/logging.php` bevat meerdere mogelijke kanalen; bijvoorbeeld daily standaard 14 bestanden, maar dat is GEEN bewezen productiebeleid. `MAIL_MAILER=log` is een configfallback, geen bewijs dat productiemail wordt gelogd.

## 6. Bevestigde externe diensten en infrastructuur

| Dienst | Bewijs / verwerking |
| --- | --- |
| Vercel | Door gebruiker bevestigd voor frontendhosting; regio/loginstellingen onbekend. |
| Laravel Cloud | Door gebruiker bevestigd voor backend/database; regio/back-ups onbekend. |
| Brevo | Code plus gebruikersbevestiging; transactionele e-mails met aanvraaggegevens. |
| Google Tag Manager | Bestaande loader en noscript, container GTM-P6K3L9WQ via env. |
| Google Ads / Meta Pixel | Door gebruiker bevestigd als GTM-integraties; inhoud container niet in repository. |
| Google Places / Business Profile | Server-side Places API en 24-uurs cache voor reviews; reviewlinks en externe profielfoto’s. Geen toegevoegde Review/AggregateRating-schema’s. |
| Google Maps | Rechtstreeks iframe op contactpagina, lazy loading, geen bestaande consent-gate. |
| Object storage | Configureerbare S3-compatibele Laravel disk/CMS-media en frontend media-origins. Concrete productieprovider/locatie niet vastgesteld. Geen formulierbestanden. |
| CRM | Optionele webhook in code; actieve ontvanger niet vastgesteld. |

Standaard Laravel-configblokken voor SES, Postmark, Resend, Slack enz. bewijzen geen actief gebruik. Die zijn niet als actieve verwerkers opgevoerd. Google/Meta zijn niet zonder contractonderzoek categorisch als louter verwerker gekwalificeerd. De bestaande LinkedIn-link betreft de websitebouwer, geen bewijs voor een Nu-Isoleren-socialprofiel of trackingtag.

## 7. Cookies, localStorage en sessionStorage

| Naam / techniek | Vastgesteld doel | Termijn / beperking |
| --- | --- | --- |
| `nu-isoleren.consent` / localStorage | Categorieën, versie, savedAt/expiresAt | Maximaal 180 dagen geldige toestemming; localStorage verwijdert verlopen records niet vanzelf. |
| `NEXT_LOCALE` / first-party cookie | next-intl taalkeuze, wanneer nodig | Config bevat geen maxAge; sessiecookie, browserherstel kan sessie verlengen. Naam/defaults geverifieerd in geïnstalleerde next-intl-code. |
| Laravel sessiecookie | Backend/adminsessies | Naam en lifetime environment-afhankelijk; default config 120 minuten en APP_NAME-afgeleide naam, niet als bewezen publieke frontendcookie of productietermijn vermeld. |
| GTM/Google Ads/Meta/Maps | Externe tags/iframes kunnen opslag gebruiken | Exacte namen, domeinen, waarden, doeleinden en termijnen niet vastgesteld. |

Geen eigen document.cookie-writes of sessionStorage-gebruik in frontendapplicatiecode gevonden. next-intl-cookies worden door middleware gezet, dus een zoekactie op document.cookie alleen is onvoldoende. Geen apart GA-script; gebruiker bevestigt dat het marketingbureau momenteel geen Google Analytics gebruikt.

## 8. Tracking en consent

Bestaande volgorde behouden: default denied voor alle vier Google Consent Mode v2-waarden → opgeslagen keuze verwerkt → GTM geladen. Updates lopen via de bestaande store/helper en nu_consent_update met consent_analytics/consent_marketing. Geen afzonderlijke Ads-/Meta-code toegevoegd; geen formuliervelden aan de dataLayer toegevoegd.

Containercontrole blijft noodzakelijk: Google-tags kunnen cookieless requests verzenden bij denied; Meta-/Custom HTML-tags moeten eigen toestemmingstriggers/checks hebben. Intrekken moet ook vervolgevents stoppen. Het noscript-iframe kan geen localStorage-consent lezen. Google Maps is momenteel niet geblokkeerd door marketing/analyticsconsent. Deze feiten staan eerlijk in het beleid; deze opdracht heeft geen nieuwe consentcategorie of Maps-gate geïntroduceerd.

## 9. Niet uit de repository vast te stellen — TODO

- Bevestigd: Nu-Isoleren.be BV is de verwerkingsverantwoordelijke; ondernemingsnummer 0726.774.181, BTW BE0726.774.181, Neerstraat 5, 9220 Hamme, België, info@nu-isoleren.be, +32 (0) 800 63 63 5. Deze gegevens staan consistent in beide beleidspagina’s en alle drie de talen.
- Productie-infrastructuurregio’s, subverwerkers, contracten/DPA’s, concrete internationale doorgiften en waarborgen.
- Werkelijke e-mailontvangers, toegangsmatrix, mailbox-/log-/backupbeleid, operationele verwijderprocedure.
- Activering/ontvanger CRM en object-storageleverancier.
- Rechtsgrond/belangenafweging algemene niet-contractuele contactvragen en technische logs; privacycheckbox niet als blanket consent gebruiken.
- Volledige productie-GTM-inhoud, geactiveerde tags, cookie-inventaris, eventuele enhanced conversions/form scraping en gegevens die tags verzamelen.

De beleidsteksten zijn inhoudelijk ingevuld voor alle gevraagde onderwerpen maar benoemen deze hiaten. Geen claim dat een onbekende bewaartermijn of doorgifte juridisch geregeld is. Laat de bedrijfsbeslissingen verwerken en inhoud juridisch beoordelen vóór publicatie als definitief beleid.

## 10. Bevestigde bewaartermijnen en resterende uitvoering

- Gewone leads/contactaanvragen zonder klantrelatie: maximaal 2 jaar na het laatste contact.
- Offerteaanvragen zonder klantrelatie: maximaal 2 jaar na het laatste contact.
- Daadwerkelijke klanten: noodzakelijke gegevens voor contractuitvoering, administratie, boekhouding, facturatie of wettelijke verplichtingen kunnen langer worden bewaard volgens toepasselijke wettelijke termijnen; niet automatisch alle prospectgegevens.
- Belgische boekhoudkundige/fiscale documenten: in principe 10 jaar, met toepasselijke regels en uitzonderingen. Dit is geen algemene termijn voor alle leads.
- Cookieconsent: maximaal 180 dagen, bestaande technische implementatie behouden.

TODO uitvoering: leg laatste-contactregistratie, klantstatus en verwijder-/anonimiseerprocedure vast en stem database, mailboxen, Brevo en eventuele CRM-kopieën af op dit beleid. Deze tekstwijziging voegt geen automatische databaseverwijdering toe. Afzonderlijke log-/backuptermijnen en externe opslagafspraken blijven nog te bepalen.

De 10-jaarstermijn is gecontroleerd bij [FOD Financiën — boekhouding](https://financien.belgium.be/nl/ondernemingen/vennootschapsbelasting/boekhouding) en [btw-boekhouding en facturering](https://financien.belgium.be/nl/ondernemingen/btw/boekhouding-facturering/boekhouding-facturering).

## 11. TODO GTM en marketingbureau

Maak met container- en browsertoegang een cookie-/requestinventaris per toestemmingsscenario: naam, aanbieder/domein, doel, soort opslag, termijn, trigger en bestemming. Test accept/reject, analytics-only, marketing-only, intrekken, reload, Maps en JavaScript uit.

Stel aparte conversies in voor contact en offerte, met marketingconsent. Navigatie gebruikt App Router router.replace: configureer pageviews/History Change in GTM zodat clientnavigatie wordt gezien zonder dubbele pageviews. Deze code configureert de container niet. Een bedankpagina is rechtstreeks bereikbaar en kan herladen worden: een pageview bewijst op zichzelf geen unieke nieuwe lead. Laat het bureau telling/deduplicatie controleren; er is geen server-side conversietoken of persoonsgegevens-query toegevoegd. De lock voorkomt dubbele submits binnen dezelfde form-instance, geen wereldwijd idempotente API.

## 12. Landingspagina

Door gebruiker aangeleverd voor de huidige campagne: 
https://www.nu-isoleren.be/nl/diensten/spouwmuurisolatie

Bestaande canonical configuratie blijft:
https://nu-isoleren.be/nl/diensten/spouwmuurisolatie

TODO hosting/bureau: bevestig dat www permanent naar non-www verwijst en dat campagneparameters behouden blijven. Stem advertentie-final URL af op de werkelijke canonical host; er is geen deployment of hostredirect gewijzigd.

## 13–14. Productie-bedank-URL’s voor marketing

| Taal | Contact | Offerte |
| --- | --- | --- |
| NL | https://nu-isoleren.be/nl/bedankt/contact | https://nu-isoleren.be/nl/bedankt/offerte |
| FR | https://nu-isoleren.be/fr/merci/contact | https://nu-isoleren.be/fr/merci/devis |
| EN | https://nu-isoleren.be/en/thank-you/contact | https://nu-isoleren.be/en/thank-you/quote |

Routes staan klaar in de lokale code, nog niet gedeployed. Alle zes noindex/follow, self-canonical in productie, geen sitemapvermelding. Geen persoonsgegevens in URL’s.

## Validatie

- `npm run lint`: groen, nul errors/warnings.
- `npx tsc --noEmit`: groen.
- `npm run build` met productie-SEO-config: geslaagd.
- `node --test tests/forms-legal.test.mjs`: 7 tests geslaagd. Echte component-submit-handlers met gesimuleerde HTTP-responses: succes, HTTP-fout, success=false, dubbele submit, retry, locale en metadata/sitemapuitsluiting. Geen testmails of fictieve aanvragen naar productie verstuurd.
- `npm run test:seo`: bestaande 4 tests groen.
- `node scripts/check-consent.mjs`: bestaande opslag-/consent-/GTM-volgordechecks groen.
- Backend `vendor/bin/phpunit --do-not-cache-result`: 11 tests, 34 assertions groen, geïsoleerde testdatabase. Backendcode ongewijzigd; geen volledige live Brevo/CRM-submit getest.
- Rendered HTTP: alle 12 nieuwe taalpagina’s 200, één H1, noindex/follow, correcte self-canonical en localized privacy-/cookielinks. Sitemap geldige XML, 117 URLs; geen nieuwe noindexpagina’s opgenomen.
- Browser: CookiePreferences opnieuw openen via footer werkt. Nieuwe beleidslinks sluiten het voorkeurenvenster bij navigatie.
- Diff gecontroleerd; bestaande vertalingen en overige SEO/consent/GTM-logica behouden.

## Juridische informatiebronnen

Algemene rechten/klachtenroute gecontroleerd bij de [Belgische Gegevensbeschermingsautoriteit](https://www.gegevensbeschermingsautoriteit.be/burger/acties/klacht-indienen) en de [AVG op EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679). Deze bronnen bewijzen geen specifieke bedrijfsprocessen of contracten; daarvoor gelden bovenstaande TODO’s.
