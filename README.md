# Open Field Studio

**Inspectie, Oplevering & Kwaliteitsborging voor bouwprojecten**

Open-source tool voor het uitvoeren van bouwkundige inspecties, energielabel opnames, monument inspecties, opleveringen en kwaliteitsborging. Draait volledig lokaal in de browser — geen server, geen account, geen kosten.

## Features

- **Tickets & gebrekenregistratie** op plattegronden met categorie, prioriteit, status-workflow en toewijzing
- **Checklist-inspecties** met 10 standaard templates (pass/fail en NEN 2767 scoring)
- **Energielabel opname** — volledige NTA 8800 data-verzameling in 43 items
- **Monument inspectie** — constructie, interieur, vocht/schade, instandhoudingsplan
- **Oplevering** met proces-verbaal, digitale handtekeningen en documenten
- **Dashboard** met real-time statistieken en grafieken
- **Camera-integratie** voor directe foto-opname op locatie
- **4 talen** — Nederlands, Engels, Duits, Frans (taalkiezer in header)
- **Offline beschikbaar** als PWA op alle apparaten
- **HTML/PDF rapporten** met opslaglocatie-keuze

## Installatie

### Windows
Dubbelklik `Setup.hta` — maakt automatisch snelkoppelingen op bureaublad en startmenu.

### Android / iPhone / macOS / Linux
Open `setup.html` in de browser — detecteert automatisch uw platform en toont de juiste installatiestappen.

### Overal
Open `index.html` direct in een moderne browser.

## Checklist templates

| Template | Items | Scoring |
|----------|-------|---------|
| Bouwkundige opname | 16 | Pass/fail |
| Installatie-inspectie | 16 | Pass/fail |
| Veiligheidsinspectie | 14 | Pass/fail |
| Oplevering voorinspectie | 16 | Pass/fail |
| Wkb-basiscontrole | 16 | Pass/fail |
| Energielabel - Volledige opname | 43 | NEN 2767 |
| Monument - Constructie & Schil | 18 | NEN 2767 |
| Monument - Historisch Interieur | 15 | NEN 2767 |
| Monument - Vocht & Schade | 18 | NEN 2767 |
| Monument - Instandhoudingsplan | 18 | NEN 2767 |

## Talen

| Taal | Code |
|------|------|
| Nederlands | NL (standaard) |
| English | EN |
| Deutsch | DE |
| Français | FR |

Taalvoorkeur wordt opgeslagen en blijft behouden.

## Technologie

- Vanilla HTML/CSS/JavaScript — geen frameworks, geen build tools
- localStorage voor data-opslag
- PDF.js voor PDF-plattegronden
- Service Worker voor offline gebruik
- OpenAEC Foundation huisstijl

## Licentie

CC BY-SA 4.0
