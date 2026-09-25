# FASE 2 — eindrapport

Datum: 24 september 2026. Implementatie lokaal afgerond; niet gedeployed. Productie vereist de configuratie en aangeleverde gegevens hieronder. Bestaande wijzigingen zijn behouden. Er zijn geen gegokte juridische teksten, trackinggegevens, bedrijfsgegevens of oude redirects toegevoegd.

## 1. Gewijzigde bestanden

De volledige lijst staat onderaan. Belangrijkste groepen: centrale frontend SEO-helpers, content-fetchers, locale-pagina’s, breadcrumbs/navigatielinks; backend publicatieregels, inventory, observers, refresh-job en Filament-widget. `middleware.ts` is vervangen door `proxy.ts` volgens Next.js 16. De backend Boost-developmentdependency en richtlijnen zijn toegevoegd conform de projectinstructies.

## 2. Migration

`2026_09_23_160549_add_seo_controls_to_content.php` voegt `is_indexable` toe aan diensten, artikelen, projecten en materialen, met default true. Materialen hebben zelfstandige publieke landingspagina’s. Cities krijgen afzonderlijk `is_published`, default true; hun bestaande `is_indexable` blijft behouden. De migration maakt tevens `seo_refresh_status` voor refreshresultaten.

Lokaal reeds uitgevoerd als batch 12. Eindcontrole: alle migrations Ran. Niet opnieuw uitgevoerd of achteraf gewijzigd om deze afronding te doen.

## 3. Environment

Frontend `.env.example`: `DEPLOYMENT_ENV`, `SITE_URL`, `SEO_INDEXING_ENABLED`, `API_URL`, `NEXT_PUBLIC_API_URL`, `MEDIA_URL`, `NEXT_PUBLIC_S3_PUBLIC_URL`, `REVALIDATION_SECRET`. Enkele API/mediawaarden bestonden al als aansluitpunt; het voorbeeld legt ze centraal vast.

Backend `.env.example`: `FRONTEND_URL`, `FRONTEND_REVALIDATION_URL`, `FRONTEND_REVALIDATION_SECRET`, `SEO_QUEUE_CONNECTION`.

Canonical productie-origin: `https://nu-isoleren.be`. Secrets zijn uitsluitend server-side; er staan geen echte secrets in git.

## 4. Frontend caching

Publieke content gebruikt Next Data Cache met 300 seconden revalidation en tags per contenttype: services, cities, articles, projects, materials, faqs en sitemap. Pagina’s kunnen nog server-rendered zijn; de onderliggende contentrequests zijn gecachet. Formulieren en request-/gebruikersgebonden flows worden niet algemeen gecachet. Google Reviews caching blijft behouden.

Cachegranulariteit is per contenttype en afhankelijke contenttypes, niet per individueel record. Dit voorkomt een volledige siteflush bij iedere wijziging zonder een tweede cachearchitectuur toe te voegen. Tijdelijke upstream errors worden doorgegeven als serverfout; alleen echte detail-404’s worden een ontbrekend record.

## 5. Backend invalidation

Model- en relevante relatie-events vragen gerichte refresh aan na succesvolle databasecommit. De backend inventorycache wordt ongeldig gemaakt en een queue-job roept het frontend POST-endpoint aan. Afhankelijke contenttags worden meegenomen. Geplande artikelpublicatie wordt via de scheduler opgemerkt.

De job gebruikt retries, timeouts, generieke foutlogging en opgeslagen succes-/foutstatus. `SEO_QUEUE_CONNECTION=database` voorkomt dat de bestaande lokale sync-queue CMS-saves afhankelijk maakt van een direct succesvolle frontend-call.

Het endpoint controleert een server-secret, toegestane tags, payloadvorm, contenttype en payloadgrootte. Willekeurige cachekeys worden niet geaccepteerd. De handmatige Filament-actie gebruikt exact dezelfde infrastructuur.

## 6. Sitemap

Eén `/sitemap.xml`, opgebouwd uit bestaande statische routekeys en de centrale CMS-inventory. Alleen publieke, indexeerbare records met echte taalcontent. Geen privacy/cookie-placeholders, drafts of noindex-content. Betrouwbare opgeslagen `updated_at` vormt lastmod; statische pagina’s krijgen geen verzonnen wijzigingsdatum.

Lokaal gecontroleerd: 117 unieke canonical URLs, waarvan 66 CMS-URLs met lastmod. Sitemapalternates zijn wederkerig. Bij upstream failure wordt niet stilzwijgend een lege succesvolle productiesitemap gemaakt; bestaande cache kan blijven dienen, anders faalt generatie zichtbaar.

## 7. Robots

Productie: publieke pagina’s crawlbaar, `/api/` uitgesloten, sitemap vermeld. Development/staging: indexing uit, robots blokkeren crawling, pagina’s krijgen noindex en geen production canonical/hreflang/schema-origin. Backend heeft een eigen blokkerende robotsroute.

Dit is geen vervanging voor hosting-authenticatie op staging of beveiliging van admin/API. Publieke noindex-content wordt in productie niet via robots geblokkeerd, zodat crawlers de metatag kunnen lezen.

## 8. Indexability

Publiek en indexeerbaar: index/follow en sitemap. Publiek maar niet indexeerbaar: noindex/follow, self-canonical, geen sitemap/hreflangcluster. Draft/inactief/niet gepubliceerd: niet publiek beschikbaar en geen sitemap. Geplande artikelen verschijnen pas op hun publicatiemoment. Unpublish bewaart de oorspronkelijke `published_at`.

## 9. Canonical en hreflang

Bestaande next-intl routekeys bepalen de localized paden. De CMS-inventory levert echte locale-slugs aan metadata en gerelateerde URL-resolutie. Iedere geldige taalpagina heeft een eigen canonical. Alternates: nl-BE, fr-BE, en; x-default verwijst naar NL wanneer beschikbaar. Geen fictieve fallbackvertalingen. Automatische next-intl alternates zijn uitgeschakeld om dubbele output te vermijden.

Verkeerde locale-slugs geven 404. Technische routekey-aliases verwijzen permanent met 308 naar bestaande localized URLs. Er is geen oude-website-redirectmapping verzonnen.

## 10. Schema.org

Centrale veilige JSON-LD-serialisatie en builders voor HomeAndConstructionBusiness, Service en Article, plus localized BreadcrumbList. Bestaande FAQPage-output voor zichtbare FAQ-inhoud blijft behouden en wordt veilig geserialiseerd.

De bedrijfsentity gebruikt een stabiele origin-gebonden @id, Nu-Isoleren.be, Neerstraat 5, 9220 Hamme, België, de bestaande `General.company.phoneHref` en maandag–vrijdag 09:00–17:00. Geen LocalBusiness per stad, fictieve auteurs/offers of self-serving AggregateRating. Onbevestigde e-mail, BTW en socialprofielen zijn niet aan de entity toegevoegd.

## 11. Filament

Widget “SEO & indexering”: indexeerbare aantallen per CMS-type, aantal CMS-taal-URLs, laatste succesvolle refresh en eventuele fout. Actie “SEO-cache & sitemap vernieuwen”, plus sitemap-/robotslinks. De actie vernieuwt eigen caches en claimt geen Google-indexering. Rendering en het aanroepen van dezelfde refresh-queue zijn getest.

## 12. Opgeloste auditbugs

- Exacte locale-slugs, inclusief cross-language slugcollision; geen duplicate 200.
- Localized breadcrumb-schema en project/realisatie-links.
- Franse EPC-dienstlink via echte CMS-slug.
- Tel-links via centrale correcte internationale waarde.
- Homepage prijs-CTA en resterende hardcoded dienstenlink.
- Prijzenmetadata aansluitend op actuele zichtbare content.
- Crawlbare artikel-/projectpagination, page=1-normalisatie en ongeldige pagina’s.
- Upstream storingen niet meer gelijkstellen aan ontbrekende records.
- Geen lokale OG-media-URLs in productie-output.
- Oorspronkelijke artikelpublicatiedatum blijft behouden bij unpublish.
- Verouderde ExampleTest verwacht nu de bestaande redirect naar /admin; productiegedrag ongewijzigd.

## 13. Validatie

- TypeScript: geslaagd na de laatste wijziging.
- Productiebuild: geslaagd met `npm run build -- --webpack`, productie-env ingeschakeld. Daarna geen applicatiecode gewijzigd.
- Frontend SEO-tests: 4 geslaagd, inclusief endpointsecurity en environmentveiligheid.
- Backend: 11 tests, 34 assertions geslaagd; inclusief Filament-fallback.
- Pint op gewijzigde backendbestanden uitgevoerd.
- Routecheck: inventoryroute aanwezig; migratiestatus volledig Ran.
- Rendered HTML: NL/FR/EN homepage, service, city, article en één realisatie gecontroleerd op title, description, canonical, hreflang, robots, OG en parsebare JSON-LD. Eerdere bredere controle omvatte de overige belangrijke pagina’s en materialen.
- Sitemap: 117 unieke URLs, 66 lastmods, reciprocal alternates, noindex uitgesloten.
- Verkeerde FR-slugs: 404. `/nl/projects/crepi-in-kortrijk`: 308 naar `/nl/realisaties/crepi-in-kortrijk`.
- Live frontend revalidation: 401 zonder authenticatie, 400 voor verboden tag, 200 bij geldige refresh. Backend HTTP-auth, after-commit en foutlogging via tests gecontroleerd. De uiteindelijke productieverbinding moet na deployment worden getest.
- Browserhomepage: geen geregistreerde consolewarnings/errors tijdens de controle. Geen volledige Core Web Vitals-meting of externe Rich Results Test uitgevoerd.
- `git diff --check`: geslaagd. Geen nieuwe ongewenste functionele wijzigingen geconstateerd.
- Lint: 7 bestaande errors en 2 warnings, uitsluitend in ongewijzigde bestanden: ServiceFaqs (5 any), lib/google-reviews (1 any), types/service (1 any), AreaCard (unused prop), GoogleReviewsCarousel (img).

## 14. Resterende issues en beperkingen

Privacy- en cookiebeleidpagina’s ontbreken nog en geven 404; dit is een launchblokkade voor de bestaande footerlinks. Geen juridische tekst verzonnen. Google Maps iframe en consentmodel zijn ongemoeid gelaten. Concrete vervolgstap: expliciete externe-media-toestemming ontwerpen, eventueel een aparte categorie met consentversiebump, en iframe pas na die keuze laden; categorie-indeling vereist een aparte beslissing.

Publieke media-origin/URL’s moeten bij deployment worden ingesteld; lokale CMS-media worden bewust niet als production OG-image gepubliceerd. Niet iedere pagina heeft daarom een OG-image. Lint is niet volledig groen. Field CWV, productie-netwerkbereikbaarheid, Google/Bing tools en een volledige oude-URL-inventaris zijn niet lokaal verifieerbaar.

Bij meerdere Next-instances is gedeelde cache/invalidation of fan-out nodig. Het huidige endpoint alleen aanroepen op één willekeurige instance is dan onvoldoende. Bulk database-updates buiten Eloquent-model/relatie-events vereisen expliciete refresh; de Filament-fallback is daarvoor beschikbaar.

## 15. Nog aan te leveren

- Definitieve publieke API- en media-origins en deploymenttopologie.
- Goedgekeurde privacy-/cookiebeleidsteksten per taal.
- Exacte bestaande fysieke QR-bestemmings-URL, inclusief eventuele querystring.
- Oude URL-inventaris met gewenste redirectbestemmingen.
- Bevestiging juridische naam, ondernemings-/BTW-nummer, officiële schema-e-mail en eventuele echte sociale profielen. Bestaande zichtbare waarden zijn niet automatisch als bevestigd schemafeit overgenomen.
- Later: Search Console/Bing verificationgegevens en marketingtrackinggegevens; geen fictieve waarden toegevoegd.

## 16. Productie/deploymentchecklist

1. Backup database; zorg voor definitieve TLS-host `https://nu-isoleren.be`. Laat www permanent naar die host verwijzen. Zet staging achter toegangscontrole.
2. Backend dependencies installeren met `composer install --no-dev --optimize-autoloader`. Controleer `php artisan migrate:status`; voer alleen pending migrations uit met `php artisan migrate --force`. De nieuwe migration is lokaal al Ran, niet noodzakelijk op productie.
3. Backend configureren: `FRONTEND_URL=https://nu-isoleren.be`, `FRONTEND_REVALIDATION_URL=https://nu-isoleren.be/api/revalidate`, sterk nieuw `FRONTEND_REVALIDATION_SECRET` van minimaal 32 tekens, `SEO_QUEUE_CONNECTION=database`. Gebruik persistente database/cache en de bestaande jobs-tabellen. Voer `php artisan config:cache` uit.
4. Queueworker onder procesbeheer: `php artisan queue:work database --tries=5 --timeout=30`. Scheduler iedere minuut: `php artisan schedule:run` vanuit de backenddirectory. Na nieuwe deployments `php artisan queue:restart`. Monitor failed jobs en widgetstatus.
5. Frontend: `DEPLOYMENT_ENV=production`, `SITE_URL=https://nu-isoleren.be`, `SEO_INDEXING_ENABLED=true`; configureer echte `API_URL`, publieke API/mediawaarden waar bestaande frontendfunctionaliteit ze vereist, en `MEDIA_URL`. Zet `REVALIDATION_SECRET` gelijk aan het backendsecret. Geen secrets onder NEXT_PUBLIC.
6. Installeer met `npm ci`; voer TypeScript en `npm run test:seo` uit; bouw met `npm run build -- --webpack` en start met `npm run start` onder de hosting-runtime. De build moet de backend kunnen bereiken. Environmentwaarden moeten bij build én runtime kloppen: sitemap/robots kunnen tijdens build worden gegenereerd. Gebruik geen productiebuildartefact voor staging.
7. Staging/development: andere `DEPLOYMENT_ENV`, `SEO_INDEXING_ENABLED=false`; verifieer noindex/robots en ontbrekende production alternates. Bij meerdere frontendinstances eerst gedeelde cache of invalidation-fan-out configureren. Bescherm de revalidationroute aanvullend met passende ingress-rate-limiting.
8. Test vanuit backend een echte refresh, controleer success in Filament en vervolgens geactualiseerde frontend/sitemap. Test ook één gecontroleerde CMS-wijziging en terugzetting: publicatie, slug/indexability en afhankelijkheden. Controleer queueworker, scheduler en retrygedrag.
9. Publiceer aangeleverde beleidsteksten voordat de bestaande footerlinks live worden beoordeeld. Controleer echte publieke media, OG-images, formulieren, calculators, consent, taalwissel, pagination en foutpagina’s.
10. Controleer op de echte hostname canonical/hreflang, robots, sitemap/lastmod, noindex/draftuitsluiting, redirects en JSON-LD. Voer Rich Results Test en performancechecks uit. Voeg uitsluitend aangeleverde oude redirects/QR-mapping toe in de daarvoor bedoelde vervolgtaak.
11. Verifieer Search Console/Bing met echte gegevens en dien `/sitemap.xml` in. Gebruik URL inspection; geen Google Indexing API voor gewone content. Monitor crawl-, queue- en serverfouten na livegang.

## Volledige bestandslijst

Paden hieronder zijn gekoppeld aan de huidige working tree; inclusief nieuwe bestanden en het verwijderde middlewarebestand.

- [backend/.env.example](</Users/emre/Developer/Nu-Isoleren.be/backend/.env.example>)
- [backend/AGENTS.md](</Users/emre/Developer/Nu-Isoleren.be/backend/AGENTS.md>)
- [backend/app/Filament/Resources/Cities/CityResource.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Resources/Cities/CityResource.php>)
- [backend/app/Filament/Resources/KnowledgeArticles/Schemas/KnowledgeArticleForm.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Resources/KnowledgeArticles/Schemas/KnowledgeArticleForm.php>)
- [backend/app/Filament/Resources/Materials/Schemas/MaterialForm.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Resources/Materials/Schemas/MaterialForm.php>)
- [backend/app/Filament/Resources/Projects/ProjectResource.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Resources/Projects/ProjectResource.php>)
- [backend/app/Filament/Resources/Services/ServiceResource.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Resources/Services/ServiceResource.php>)
- [backend/app/Filament/Widgets/SeoOverview.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Filament/Widgets/SeoOverview.php>)
- [backend/app/Http/Controllers/Api/MaterialController.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Http/Controllers/Api/MaterialController.php>)
- [backend/app/Http/Controllers/Api/SeoInventoryController.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Http/Controllers/Api/SeoInventoryController.php>)
- [backend/app/Http/Middleware/PublicContentSeo.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Http/Middleware/PublicContentSeo.php>)
- [backend/app/Jobs/RefreshFrontendSeo.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Jobs/RefreshFrontendSeo.php>)
- [backend/app/Models/City.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/City.php>)
- [backend/app/Models/KnowledgeArticle.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/KnowledgeArticle.php>)
- [backend/app/Models/Material.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/Material.php>)
- [backend/app/Models/Project.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/Project.php>)
- [backend/app/Models/SeoRelation.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/SeoRelation.php>)
- [backend/app/Models/Service.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Models/Service.php>)
- [backend/app/Observers/SeoContentObserver.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Observers/SeoContentObserver.php>)
- [backend/app/Providers/AppServiceProvider.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Providers/AppServiceProvider.php>)
- [backend/app/Services/SeoInventory.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Services/SeoInventory.php>)
- [backend/app/Services/SeoRefresh.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Services/SeoRefresh.php>)
- [backend/app/Support/ContentResponse.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Support/ContentResponse.php>)
- [backend/app/Support/ContentSeo.php](</Users/emre/Developer/Nu-Isoleren.be/backend/app/Support/ContentSeo.php>)
- [backend/boost.json](</Users/emre/Developer/Nu-Isoleren.be/backend/boost.json>)
- [backend/bootstrap/app.php](</Users/emre/Developer/Nu-Isoleren.be/backend/bootstrap/app.php>)
- [backend/composer.json](</Users/emre/Developer/Nu-Isoleren.be/backend/composer.json>)
- [backend/composer.lock](</Users/emre/Developer/Nu-Isoleren.be/backend/composer.lock>)
- [backend/config/seo.php](</Users/emre/Developer/Nu-Isoleren.be/backend/config/seo.php>)
- [backend/database/migrations/2026_09_23_160549_add_seo_controls_to_content.php](</Users/emre/Developer/Nu-Isoleren.be/backend/database/migrations/2026_09_23_160549_add_seo_controls_to_content.php>)
- [backend/resources/views/filament/widgets/seo-overview.blade.php](</Users/emre/Developer/Nu-Isoleren.be/backend/resources/views/filament/widgets/seo-overview.blade.php>)
- [backend/routes/api.php](</Users/emre/Developer/Nu-Isoleren.be/backend/routes/api.php>)
- [backend/routes/console.php](</Users/emre/Developer/Nu-Isoleren.be/backend/routes/console.php>)
- [backend/routes/web.php](</Users/emre/Developer/Nu-Isoleren.be/backend/routes/web.php>)
- [backend/tests/Feature/ExampleTest.php](</Users/emre/Developer/Nu-Isoleren.be/backend/tests/Feature/ExampleTest.php>)
- [backend/tests/Feature/SeoContentTest.php](</Users/emre/Developer/Nu-Isoleren.be/backend/tests/Feature/SeoContentTest.php>)
- [frontend/.env.example](</Users/emre/Developer/Nu-Isoleren.be/frontend/.env.example>)
- [frontend/.gitignore](</Users/emre/Developer/Nu-Isoleren.be/frontend/.gitignore>)
- [frontend/app/[locale]/about/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/about/page.tsx>)
- [frontend/app/[locale]/areas/[slug]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/areas/[slug]/page.tsx>)
- [frontend/app/[locale]/areas/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/areas/page.tsx>)
- [frontend/app/[locale]/contact/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/contact/page.tsx>)
- [frontend/app/[locale]/faq/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/faq/page.tsx>)
- [frontend/app/[locale]/grants/brussels/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/grants/brussels/page.tsx>)
- [frontend/app/[locale]/grants/flanders/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/grants/flanders/page.tsx>)
- [frontend/app/[locale]/grants/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/grants/page.tsx>)
- [frontend/app/[locale]/grants/wallonia/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/grants/wallonia/page.tsx>)
- [frontend/app/[locale]/knowledge/[slug]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/knowledge/[slug]/page.tsx>)
- [frontend/app/[locale]/knowledge/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/knowledge/page.tsx>)
- [frontend/app/[locale]/layout.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/layout.tsx>)
- [frontend/app/[locale]/materials/[slug]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/materials/[slug]/page.tsx>)
- [frontend/app/[locale]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/page.tsx>)
- [frontend/app/[locale]/prices/energy-savings-calculator/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/prices/energy-savings-calculator/page.tsx>)
- [frontend/app/[locale]/prices/epc-calculator/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/prices/epc-calculator/page.tsx>)
- [frontend/app/[locale]/prices/home-insulation-check/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/prices/home-insulation-check/page.tsx>)
- [frontend/app/[locale]/prices/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/prices/page.tsx>)
- [frontend/app/[locale]/projects/[slug]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/projects/[slug]/page.tsx>)
- [frontend/app/[locale]/projects/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/projects/page.tsx>)
- [frontend/app/[locale]/quote/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/quote/page.tsx>)
- [frontend/app/[locale]/services/[slug]/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/services/[slug]/page.tsx>)
- [frontend/app/[locale]/services/page.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/[locale]/services/page.tsx>)
- [frontend/app/api/revalidate/route.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/api/revalidate/route.ts>)
- [frontend/app/robots.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/robots.ts>)
- [frontend/app/sitemap.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/app/sitemap.ts>)
- [frontend/components/grants/GrantsFaqSection.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/grants/GrantsFaqSection.tsx>)
- [frontend/components/home/Hero.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/home/Hero.tsx>)
- [frontend/components/home/ServicesSection.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/home/ServicesSection.tsx>)
- [frontend/components/knowledge/KnowledgePagination.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/knowledge/KnowledgePagination.tsx>)
- [frontend/components/layout/FloatingButtons.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/layout/FloatingButtons.tsx>)
- [frontend/components/layout/Footer.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/layout/Footer.tsx>)
- [frontend/components/layout/LanguageSwitcher.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/layout/LanguageSwitcher.tsx>)
- [frontend/components/layout/MobileMenu.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/layout/MobileMenu.tsx>)
- [frontend/components/layout/MobileQuickContact.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/layout/MobileQuickContact.tsx>)
- [frontend/components/prices/energy-savings/EnergySavingsFaqSection.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/prices/energy-savings/EnergySavingsFaqSection.tsx>)
- [frontend/components/prices/epc/EpcFaqSection.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/prices/epc/EpcFaqSection.tsx>)
- [frontend/components/prices/epc/EpcImprovements.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/prices/epc/EpcImprovements.tsx>)
- [frontend/components/prices/home-insulation-check/HomeInsulationCheckFaqSection.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/prices/home-insulation-check/HomeInsulationCheckFaqSection.tsx>)
- [frontend/components/projects/Pagination.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/projects/Pagination.tsx>)
- [frontend/components/seo/JsonLd.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/seo/JsonLd.tsx>)
- [frontend/components/services/ServiceAlternateLinks.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/services/ServiceAlternateLinks.tsx>)
- [frontend/components/ui/Breadcrumbs.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/ui/Breadcrumbs.tsx>)
- [frontend/components/ui/ServiceCard.tsx](</Users/emre/Developer/Nu-Isoleren.be/frontend/components/ui/ServiceCard.tsx>)
- [frontend/docs/seo-fase-2-eindrapport.md](</Users/emre/Developer/Nu-Isoleren.be/frontend/docs/seo-fase-2-eindrapport.md>)
- [frontend/i18n/config.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/i18n/config.ts>)
- [frontend/i18n/routing.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/i18n/routing.ts>)
- [frontend/lib/cities.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/cities.ts>)
- [frontend/lib/content-api.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/content-api.ts>)
- [frontend/lib/faqs.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/faqs.ts>)
- [frontend/lib/knowledge.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/knowledge.ts>)
- [frontend/lib/materials.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/materials.ts>)
- [frontend/lib/projects.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/projects.ts>)
- [frontend/lib/seo/config.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/config.ts>)
- [frontend/lib/seo/inventory.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/inventory.ts>)
- [frontend/lib/seo/json.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/json.ts>)
- [frontend/lib/seo/metadata.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/metadata.ts>)
- [frontend/lib/seo/pagination.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/pagination.ts>)
- [frontend/lib/seo/revalidation.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/revalidation.ts>)
- [frontend/lib/seo/schema.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/schema.ts>)
- [frontend/lib/seo/urls.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/seo/urls.ts>)
- [frontend/lib/services.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/lib/services.ts>)
- [frontend/messages/en.json](</Users/emre/Developer/Nu-Isoleren.be/frontend/messages/en.json>)
- [frontend/messages/fr.json](</Users/emre/Developer/Nu-Isoleren.be/frontend/messages/fr.json>)
- [frontend/messages/nl.json](</Users/emre/Developer/Nu-Isoleren.be/frontend/messages/nl.json>)
- [frontend/middleware.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/middleware.ts>)
- [frontend/next.config.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/next.config.ts>)
- [frontend/package.json](</Users/emre/Developer/Nu-Isoleren.be/frontend/package.json>)
- [frontend/proxy.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/proxy.ts>)
- [frontend/tests/seo.test.mjs](</Users/emre/Developer/Nu-Isoleren.be/frontend/tests/seo.test.mjs>)
- [frontend/types/city.ts](</Users/emre/Developer/Nu-Isoleren.be/frontend/types/city.ts>)
