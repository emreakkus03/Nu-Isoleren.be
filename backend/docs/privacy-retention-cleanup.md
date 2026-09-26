# Bewaartermijnen: veiligheidsaudit en geblokkeerde cleanup

## Uitkomst

Automatische verwijdering is voor beide aanvraagtypen gestopt conform de expliciete veiligheidsregel van deze opdracht. De bestaande gegevens kunnen niet betrouwbaar bewijzen dat een record uitsluitend een niet-klant betreft, noch wanneer het laatste relevante contact heeft plaatsgevonden. Er is geen cleanup-command, scheduler-entry of migration toegevoegd. Er zijn geen aanvraaggegevens gewijzigd of verwijderd. Frontend en privacybeleid zijn niet gewijzigd.

Alleen dit rapport is toegevoegd. De tweejaarstermijn uit het beleid wordt dus nog niet automatisch afgedwongen. Dit is een concrete technische mismatch, geen bewijs dat de termijn niet geldt. Er is geen onjuiste telling van nul verwijderbare records geproduceerd: geschiktheid is onbekend.

## Onderzochte architectuur

Laravel framework v13.31.0, Eloquent, Filament en PHPUnit. Modellen, migrations, controllers, Filament-formulieren en editpagina’s, listeners, CRM-webhookservice en scheduler onderzocht. De lokale daadwerkelijke tabelstructuren zijn aanvullend read-only gecontroleerd met `db:table`; geen persoonsgegevens uitgelezen. Productieschema/data zijn niet benaderd.

| Onderdeel | Contact | Offerte |
| --- | --- | --- |
| Model | ContactSubmission | QuoteRequest |
| Tabel | contact_submissions | quote_requests |
| Statussen in Filament | new, in_progress, contacted, closed | new, contacted, quoted, won, lost |
| Tijdvelden | created_at, updated_at, privacy_accepted_at, crm_synced_at | created_at, updated_at, privacy_consent_at |
| Klantrelatie / conversiedatum | Geen | Geen expliciete relatie/datum; alleen wijzigbare status won |
| Laatste-contactregistratie | Geen | Geen |
| Soft deletes | Geen | Geen |
| Relaties | Geen klantrelatie | services via quote_request_service |

`quote_request_service` wordt via foreign key cascade verwijderd wanneer een offerte wordt verwijderd. Dat is een dienstkoppeling, geen factuurrelatie. Er zijn geen Customer/Client/Invoice-modellen in deze repository gevonden; afwezigheid daarvan bewijst NIET dat er elders geen klant of wettelijke bewaarplicht bestaat.

Contactaanvragen worden als new opgeslagen, met crm_status=pending. Contactstatus en interne notities kunnen handmatig in Filament wijzigen. Offertes worden als new opgeslagen; de referentie wordt aansluitend bijgewerkt en diensten worden gekoppeld. Filament laat de status wijzigen, inclusief won en lost, zonder een onomkeerbare conversieregistratie of contacthistorie.

E-maillisteners verzenden interne meldingen en klantbevestigingen. De optionele CRM-webhook verzendt offertegegevens naar een configureerbare ontvanger. Er is geen aangetroffen betrouwbare terugkoppeling die de actuele klantrelatie en alle relevante contactmomenten synchroniseert. crm_synced_at is synchronisatietijd, geen klantcontact. crm_status zegt niets over klantwording.

## Waarom bestaande statussen en datums onvoldoende zijn

- Contact closed betekent afgesloten behandeling, niet bewezen geen klant.
- Offerte won is een expliciet beschermingssignaal; verwijderen is uitgesloten. Andere waarden bewijzen niet dat de persoon nooit klant is geworden, bijvoorbeeld via een andere offerte of extern CRM.
- Een status kan handmatig veranderen. Een huidige lost-status bewijst niet dat er nooit een klantrelatie of contractuele bewaarplicht is geweest.
- created_at registreert ontvangst, niet het laatste latere telefoongesprek, antwoord of e-mailcontact.
- updated_at verandert ook door interne notities, statuswijzigingen en het genereren van een referentie. Externe contacten hoeven dit veld juist niet bij te werken.
- privacy_accepted_at/privacy_consent_at zijn bevestigingstijdstippen, geen contacthistorie.
- Er is geen expliciete bewaarbeperking/legal hold die contractuele, administratieve of fiscale uitzonderingen beschermt.

Er bestaat dus momenteel geen veilige tweejaar-DELETE-query. Alle bestaande records worden voor automatische verwijdering als onvoldoende beoordeelbaar behandeld, niet als aangetoonde niet-klanten.

## Minimaal veilig vervolgvoorstel — nog niet geïmplementeerd

Onderstaande zijn expliciet VOORGESTELDE nieuwe registraties, geen bestaande databasefeiten of verzonnen huidige klantstatussen. Eerst moet vaststaan wie de bron van waarheid voor klantrelaties is en hoe contacten buiten de website worden verwerkt. Alleen velden toevoegen zonder die processen zou schijnveiligheid creëren.

1. Een nullable `last_contact_at` per aanvraag met datetime-cast. Nieuwe formulierontvangst is een werkelijk inbound contactmoment en mag bij ontvangst op de actuele tijd worden gezet. Bevestigde latere relevante inbound/outbound contacten moeten dit veld consequent bijwerken vanuit Filament/CRM. Interne edits, technische synchronisatie en automatische ontvangstbevestigingen zijn niet automatisch nieuw relevant contact. Leg bron/tijdzone en definitie vast; gebruik één tijdzone voor vergelijking.
2. Een expliciete gecontroleerde bewaarbeoordeling met drie uitkomsten: onbekend, bevestigd uitsluitend prospect, beschermd. Naamgeving pas vastleggen met het bestaande klant-/CRM-proces. Onbekend moet standaard zijn, óók voor nieuwe aanvragen: een bestaande klant kan opnieuw een formulier sturen. Er is een controleerbare bron/reviewer en beoordelingstijd nodig. Klantwording in een ander dossier moet alle betrokken aanvragen beschermen; een adresmatch alleen is geen betrouwbare identiteit.
3. Wettelijke/contractuele bewaarplicht moet expliciet worden uitgesloten voordat een aanvraag als uitsluitend prospect verwijderbaar wordt aangemerkt. Bestaande won-records altijd beschermen. Herclassificatie naar verwijderbaar mag niet met een gewone workflowstatuswijziging gebeuren. Bij ontbrekende of verouderde externe klantgegevens blijft de uitkomst onbekend/beschermd.

Additieve nullable velden zijn technisch backwards-compatible, maar zonder betrouwbare klantregistratie en contactworkflow nog geen oplossing. Daarom is er nu geen migration gemaakt of uitgevoerd. Bestaande records krijgen nooit retroactief created_at/updated_at als verzonnen contactdatum. Alleen aantoonbare brongegevens of gedocumenteerde menselijke verificatie kunnen historische informatie aanvullen; anders blijven velden null en records uitgesloten.

## Toekomstige query en command

Pas na betrouwbare registratie: leg één cutoff vast als `now()->subYears(2)`. Selecteer uitsluitend expliciet en actueel bevestigde niet-klanten zonder bewaarplicht, met niet-null last_contact_at **kleiner dan** cutoff. Exact op de grens blijft het record behouden; het wordt kandidaat zodra het ouder is dan twee jaar. Geen fallback naar created_at/updated_at. Controleer de grens in één vaste tijdzone, inclusief schrikkeldagen.

Voorgestelde naam: `privacy:cleanup-expired-leads`. Nog NIET geregistreerd. Dry-run moet dezelfde selectie gebruiken als normale verwerking, alleen tellingen per type tonen en geen persoonsgegevens loggen. Werkelijke verwerking later in batches, met hercontrole van klant-/contactstatus vlak vóór delete binnen passende transacties/locks, om een conversie tijdens de run niet te missen. Alle schrijfpaden naar contact- en klantgegevens moeten daarmee samenwerken. Geen willekeurige soft deletes introduceren; die wissen persoonsgegevens bovendien niet automatisch.

Voorgestelde scheduler: dagelijks, `withoutOverlapping()`, en bij meerdere schedulerinstanties één gedeelde lock of `onOneServer()` met geschikte cache. Deze planning is nu bewust NIET geregistreerd. Dagelijks uitvoeren kan technisch tot bijna één dag na cutoff uitstel geven; documenteer die granulariteit tegenover het beleid, of ontwerp bij een strikte maximale termijn een nauwkeuriger uitvoering. Beleid is niet stilzwijgend versoepeld.

## Uitsluitingen

Alle huidige aanvragen wegens ontbrekend bewijs; daarnaast in het toekomstige model expliciet: klanten/won, onzekere status, ontbrekende laatste-contactdatum, recente contacten, exact-cutoff, wettelijke of contractuele bewaarplicht, onbetrouwbare CRM-status, onvolledige identiteit/koppeling en concurrerende wijzigingen. Geen verwijdering van klanten, facturen, boekhouding of andere fiscale documenten.

Databasecleanup alleen verwijdert geen kopieën in mailboxen, Brevo, CRM, exports of back-ups. Hiervoor zijn afzonderlijke procedures nodig. Geen netwerkverwijderacties geïmplementeerd.

## Tests en veilige lokale commando’s

De bestaande PHPUnit-config gebruikt SQLite `:memory:`, array-mail/cache en APP_ENV=testing. De bestaande backendtests zijn uitgevoerd op die geïsoleerde database; geen cleanup op bestaande lokale of productiegegevens.

```sh
cd /Users/emre/Developer/Nu-Isoleren.be/backend
vendor/bin/phpunit --do-not-cache-result
```

Read-only lokale schemacontrole (DDEV):

```sh
ddev exec php artisan db:table contact_submissions --no-interaction
ddev exec php artisan db:table quote_requests --no-interaction
```

De gevraagde verwijdertests 1–10 zijn niet als fictief groene tests toegevoegd: zonder veilige selectie is verwijderen van de oude records uit cases 1 en 3 juist niet toegestaan. Na implementatie van betrouwbare registratie moeten alle tien scenario’s worden getest, plus null-datum, bewaarplicht, een klant via een ander dossier, CRM-onzekerheid, gelijktijdige conversie en ontbreken van persoonsgegevens in logs.

Voor later, uitsluitend NA veilige implementatie (deze commando’s bestaan nu niet):

```sh
php artisan privacy:cleanup-expired-leads --dry-run
```

Pas na beoordeling van dry-run en een veilige lokale testdataset zou de destructieve variant bestaan:

```sh
php artisan privacy:cleanup-expired-leads
```

Geen van beide commands uitgevoerd. Geen scheduler-run, data-migration, deployment of git push uitgevoerd.

Testresultaat: 11 bestaande backendtests geslaagd, 34 assertions. Dit valideert de bestaande applicatie, niet een nog niet geïmplementeerde cleanup.
