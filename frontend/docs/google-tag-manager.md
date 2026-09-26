# Google Tag Manager en bestaande consent

## Configuratie

Stel bij build/deployment `NEXT_PUBLIC_GTM_ID=GTM-P6K3L9WQ` in. Deze publieke container-ID is geen secret. De locale root layout leest de variabele op één plek en valideert het formaat. Ontbrekend, leeg of ongeldig: geen GTM-component of noscript-iframe. De consentbanner blijft werken. Er is geen aparte GA-, Ads- of Meta-loader toegevoegd.

## Volgorde

De bestaande CookieConsent initialiseert de bestaande consent-store. Die roept synchroon `updateGoogleConsent` aan voordat de snapshot `ready=true` wordt gepubliceerd. De helper zet eenmaal per document alle vier Google Consent Mode v2-defaults op denied en verstuurt vervolgens de geldige opgeslagen voorkeuren, of de bestaande denied-voorkeuren bij ontbrekende/ongeldige/verlopen opslag.

Pas bij `ready=true` rendert GoogleTagManager het Next Script met `afterInteractive`. De standaard GTM-bootstrap plaatst `gtm.start`/`gtm.js` achter de consentcommando’s en laadt de container. Het wachten is uitsluitend op initialisatie, nooit op toestemming: ook na weigeren wordt GTM geladen. Next Script heeft een vaste ID om herhaald laden tijdens clientnavigatie te voorkomen.

De bestaande store blijft updates sturen bij accepteren, weigeren, selectie opslaan, wijzigingen via de footer, cross-tab storagewijzigingen en verlopen consent. Key `nu-isoleren.consent`, versie, 180 dagen, categorieën en vertalingen zijn ongewijzigd.

## GTM-event voor niet-Google tags

Na de Google consent-update wordt bij de eerste initialisatie en bij een echte categoriewijziging dit object gepusht:

```json
{
  "event": "nu_consent_update",
  "consent_necessary": true,
  "consent_analytics": false,
  "consent_marketing": false
}
```

De properties zijn booleans. Gebruik GTM Data Layer Variables voor `consent_analytics` en `consent_marketing` (default false). Een custom event-trigger `nu_consent_update` met `consent_marketing equals true` kan de Meta-initialisatie activeren, ook wanneer iemand pas later accepteert. Vermijd dubbele initialisatie bij herhaalde toestemmingswijzigingen. Het event is geen pageview en bevat geen persoonsgegevens.

Alle volgende Meta-events/conversietriggers moeten eveneens `consent_marketing === true` vereisen. Alleen een voorwaarde op de eerste initialisatietag is onvoldoende. Bij intrekken moet de container/provider-integratie verdere metingen stoppen; een reeds geladen pixel wordt niet automatisch door de frontend verwijderd. Controleer daarvoor de consentmogelijkheden van de gebruikte Meta-template. De frontend configureert de container niet.

## Handmatig controleren in GTM vóór productie

- Google Consent Mode: `analytics_storage` volgt analytics; `ad_storage`, `ad_user_data`, `ad_personalization` volgen marketing.
- Geen tweede CMP/default-tag die de websitekeuze overschrijft. Geen tweede GTM/GA/Ads/Meta-loader via hosting of plugins.
- Meta en overige niet-Google tags mogen niet via onvoorwaardelijke All Pages/Initialization-triggers vuren. Stel passende additional consent checks en categorievoorwaarden op alle triggers in.
- Google-tags met ingebouwde Consent Mode kunnen bij denied cookieless pings sturen. Als ook die requests ongewenst zijn, moet de container aanvullende consent-gating gebruiken terwijl GTM zelf geladen blijft.
- Controleer in GTM Preview/Tag Assistant: nieuwe bezoeker, weigeren, accepteren, alleen analytics, alleen marketing, reload en intrekken. Controleer daadwerkelijke requests/cookies; frontend-unitchecks bewijzen geen externe containerconfiguratie.
- Controleer SPA/history-pageviews zodat de bestaande App Router geen dubbele of ontbrekende metingen veroorzaakt. Er zijn geen nieuwe pageview-events in de frontend toegevoegd.

## Noscript-beperking

Het gevraagde standaard `noscript`-iframe staat bovenaan de body en wordt uitsluitend bij een geldige ID opgenomen. Met JavaScript ingeschakeld laadt dit iframe niet.

Zonder JavaScript kan de bestaande localStorage-consent noch Google Consent Mode uitgevoerd worden. Het standaard iframe heeft dus geen bewezen analytics-/marketingtoestemming. Zorg dat de GTM-container via deze fallback GEEN analytics-/marketingtags (waaronder Custom Image-tags) uitvoert. Het iframe zelf doet zonder JavaScript wel een request naar Google. Indien ook dat niet toegestaan is, moet deze fallback worden weggelaten of een afzonderlijk server-leesbaar consentmechanisme worden ontworpen. Er is hier bewust geen tweede consentopslag geïntroduceerd. De standaard noscript-fallback kan niet dezelfde garantie bieden als de JavaScript-flow.

## Validatie

`node scripts/check-consent.mjs` controleert opslagvalidatie, categoriecombinaties, Google-mapping, consent-event, cross-tab wijzigingen, storagefouten, opnieuw openen, verse reload en GTM-scriptinsertie ná default/update. De GTM-loader wordt hierbij gesimuleerd: de echte container is niet geconfigureerd of gepubliceerd vanuit deze repository.

Officiële referenties: [Consent Mode instellen](https://developers.google.com/tag-platform/security/guides/consent), [GTM consent support](https://support.google.com/analytics/answer/10718549?hl=en).
