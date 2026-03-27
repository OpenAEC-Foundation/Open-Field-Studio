# TODO: Installateur Inspectie Templates - Open Field Studio

**Repo:** https://github.com/OpenAEC-Foundation/Open-Field-Studio
**Bestand:** `public/app.js` - functie `getDefaultTemplates()` (regel ~277)
**Datum:** 2026-03-27

---

## Wat moet er gebeuren?

5 nieuwe checklist-templates toevoegen voor installateurs (vloerverwarming & ventilatie).
Templates passen in de bestaande structuur (JavaScript objecten in `app.js`).
Vertalingen toevoegen in `src/locales/nl.json`, `en.json`, `de.json`, `fr.json`.

---

## Template 1: Vloerverwarming - Voorinspectie (pass/fail, 14 items)

- id: `tpl_vloerverwarming_voor`
- category: `Installatie`

Items:
1. Warmteverliesberekening aanwezig (ISSO 51 / NEN-EN 12831)
2. Ondergrond vlak, droog en structureel geschikt
3. Isolatie aanwezig met voldoende Rc-waarde (>= 3,0 m2K/W begane grond)
4. Minimale dekking boven leidingen >= 25 mm (ISSO 49)
5. Hotspot-checklist legionella uitgevoerd (ISSO 110970)
6. Verlegtekeningen beschikbaar en correct
7. Drukverliesberekeningen per groep aanwezig
8. Randzone/verblijfszone-indeling conform ontwerp
9. Buigradius leidingen conform voorschrift fabrikant
10. Verdeler correct geplaatst en gelabeld per groep
11. Max. drukverlies per groep <= 20 kPa (ISSO 49)
12. Max. aanvoertemperatuur ingesteld op <= 40 C
13. CE-markering alle componenten aanwezig
14. Verwerkingsvoorschriften fabrikant op locatie beschikbaar

---

## Template 2: Vloerverwarming - Druktest & Oplevering (pass/fail, 16 items)

- id: `tpl_vloerverwarming_opl`
- category: `Installatie`

Items:
1. Druktest uitgevoerd VOOR storten dekvloer
2. Druktest per groep gedocumenteerd (druk, duur, resultaat)
3. Drukniveau stabiel gedurende voorgeschreven periode
4. Spoelprotocol per groep uitgevoerd (lucht en vuil verwijderd)
5. Waterzijdig inregelen uitgevoerd per groep
6. Inregelstaten per groep vastgelegd en gedocumenteerd
7. Opstookprotocol gevolgd (geleidelijke temperatuurverhoging)
8. Thermografische inspectie uitgevoerd (warmtebeeld)
9. Geen koude zones of luchtinsluiting geconstateerd
10. Verlegtekeningen as-built bijgewerkt
11. Foto's leidingwerk gemaakt voor bedekking
12. Conformiteitsverklaringen en certificaten compleet
13. Opleverdossier samengesteld conform Wkb-dossierplicht
14. Systeemdocumentatie overhandigd aan opdrachtgever
15. Garantieverklaring afgegeven
16. Handtekening opdrachtgever voor akkoord

---

## Template 3: Ventilatie - Kanaalwerk & Installatie (pass/fail, 14 items)

- id: `tpl_ventilatie_install`
- category: `Installatie`

Items:
1. Ventilatieberekening aanwezig conform NEN 1087
2. Kanalen schoon, vrij van beschadigingen en obstakels
3. Luchtdichtheidstest kanalen uitgevoerd (NEN-EN 15727)
4. Luchtdichtheidsklasse bepaald en gedocumenteerd (ATC2-ATC5)
5. Alle aansluitingen afgedicht en correct gemonteerd
6. Flexibele verbindingen correct aangebracht (geen knikken)
7. Isolatie kanaalwerk aanwezig en compleet
8. WTW-unit correct geplaatst en bereikbaar voor onderhoud
9. Buitenluchtaanzuiging: luchtsnelheid max. 3 m/s
10. Filters geplaatst conform NEN-EN-ISO 16890
11. Condensafvoer correct aangesloten en afschot gecontroleerd
12. Geluidsniveau <= 30 dB(A) in verblijfsruimten
13. CE-markering alle componenten aanwezig
14. Elektra-aansluiting conform NEN 1010

---

## Template 4: Ventilatie - Inregelen & Oplevering (pass/fail, 16 items)

- id: `tpl_ventilatie_opl`
- category: `Installatie`

Items:
1. Alle ventielen volledig geopend voor startmeting
2. Totaal luchtdebiet ingesteld op WTW-unit
3. Debietmeting per toevoerpunt uitgevoerd en genoteerd
4. Debietmeting per afzuigpunt uitgevoerd en genoteerd
5. Woonkamer: min. 1 dm3/s per m2 (min. 21 dm3/s) behaald
6. Keuken: min. 21 dm3/s afzuigcapaciteit behaald
7. Badkamer: min. 14 dm3/s afzuigcapaciteit behaald
8. Toilet: min. 7 dm3/s afzuigcapaciteit behaald
9. Slaapkamers: min. 1 dm3/s per m2 (min. 7 dm3/s) behaald
10. Balans toevoer en afvoer correct (geen over-/onderdruk)
11. CO2-meting uitgevoerd en genoteerd
12. Temperatuurmeting toevoer/afvoer uitgevoerd
13. Geluidsmeting per ruimte gedocumenteerd (max. 30 dB(A))
14. Meetrapport opgesteld met alle waarden per ventilatiepunt
15. Opleverdossier compleet conform Wkb-dossierplicht
16. Instructie bewoner/gebruiker uitgevoerd (filteronderhoud, bediening)

---

## Template 5: Installatie - NEN 2767 Conditiemeting (NEN 2767 scoring 1-6, 18 items)

- id: `tpl_installatie_nen2767`
- category: `Installatie`
- scoring: `nen2767`

Items:
1. Verwarmingsinstallatie (ketel / warmtepomp)
2. Vloerverwarmingssysteem
3. Radiatoren / convectoren
4. Verdeler / collectoren vloerverwarming
5. Leidingwerk verwarming
6. Mechanische ventilatie-unit (WTW / MVS)
7. Kanaalwerk ventilatie
8. Ventielen en roosters
9. Filters luchtbehandeling
10. Koudwaterinstallatie
11. Warmwaterinstallatie (boiler / doorstromer)
12. Riolering en afvoerleidingen
13. Elektrische installatie / groepenkast
14. Schakelmateriaal en wandcontactdozen
15. Brandbeveiligingsinstallatie
16. Zonwering en regeling
17. Domotica / gebouwautomatisering
18. Koelinstallatie (indien aanwezig)

---

## Technische instructies

### Template format in app.js (invoegen voor regel `// ===== ENERGIELABEL TEMPLATE =====`):
```javascript
{
    id: 'tpl_vloerverwarming_voor',
    name: 'Vloerverwarming - Voorinspectie',
    category: 'Installatie',
    items: [
        'Item 1',
        'Item 2',
        // ...
    ]
}
```
Voor NEN 2767 template: voeg `scoring: 'nen2767'` toe.

### Vertalingen nodig in 4 locale-bestanden (`src/locales/`):
- Templatecategorie "Installatie" vertalen naar EN/DE/FR
- Templatenamen vertalen

---

## Relevante normen (referentie)

| Domein | Normen |
|---|---|
| Vloerverwarming ontwerp | ISSO 49, NEN-EN 1264 |
| Warmteverlies | ISSO 51, NEN-EN 12831-1 |
| Legionella/hotspots | ISSO 110970/110971, NEN 1006 |
| Ventilatie ontwerp | NEN 1087, NPR 1088 |
| Kanaal luchtdichtheid | NEN-EN 15727 |
| Filters | NEN-EN-ISO 16890 |
| Conditiemeting | NEN 2767 |
| Kwaliteitsborging | Wkb (sinds jan 2024) |
| Energieprestatie | NEN 8088, NTA 8800 |
