# Cafetaria De Zon – onderzoek en ontwerpplan (13 november 2026)

Status: **plan, nog niets gebouwd.** Alles hieronder is gemarkeerd als
**bevestigd** (met bron), **aanname** of **onbekend**.

---

## 1. Wat het onderzoek opleverde

### 1.1 De huidige Eatbu/DISH-site (https://cafetariadezon.eatbu.com/?lang=nl)

Bevestigd (broncode van de pagina zelf):

| Gegeven | Waarde |
| --- | --- |
| Adres | Noordeinde 12, 3238 BG Zwartewaal |
| Telefoon / e-mail | 0181 663 669 / cdezon146@gmail.com |
| Coördinaten | 51.8834283, 4.2249807 |
| Openingstijden | ma gesloten · di–do 12:30–22:00 · vr–za 12:30–23:00 · zo 12:30–21:00 |
| Diensten | "Afhaalservice" (alleen een label) |
| Betalen | contant, pin |
| Aanbod (llms.txt van Eatbu) | Nederlands, ijs, vegetarisch, frisdrank, burger, friet, fastfood |

**Belangrijke vondst:** de pagina bevat alleen deze modules: beschrijving,
diensten, openingstijden, betaalopties, promo, contactformulier, footer. Er is
**geen menukaart en geen bestelmodule.** `/menu` en `/order` geven 404.
"Afhaalservice" betekent dus: telefonisch of aan de balie, niet online.

Gevolgen:
- Er bestaat **geen bestaand bestelsysteem om naar door te linken.**
- De bestaande eenpagina-versie in deze map heeft "Bestel online"-knoppen naar
  die Eatbu-pagina. Dat is misleidend en moet eruit.
- Er is **geen echte menukaart of prijs** beschikbaar. Niets verzinnen.
- De Eatbu-pagina laadt Google Tag Manager en een cookiebanner. De nieuwe site
  heeft geen trackers nodig (zie 6).
- Het colofon op Eatbu noemt een privépersoon en een btw-nummer. Die nemen we
  **niet** over zonder dat de eigenaar dat bevestigt.
- Foto's: vier afbeeldingen op de DISH-CDN (hero). Rechten niet duidelijk, dus
  niet hotlinken en niet kopiëren zonder toestemming van de eigenaar.

Onbekend / nog te bevestigen: KvK-gegevens (tweede bron), eigen foto's,
sociale media, definitief domein, of er een DISH-kassa staat.
Alleen vermelding gevonden: Telefoonboek.nl (6,4 uit 26 beoordelingen). Dat is
een derde partij, niet verifieerbaar en wordt **niet** gebruikt. Er is geen
Google-beoordeling geverifieerd, dus geen sterren op de site.
Andere "De Zon"-bedrijven (o.a. Café De Zon in Lent) zijn niet dit bedrijf.

### 1.2 De vier referenties

Let op: de pagina's gaven alleen casetekst, geen beeld. Voor de bouwfase maak ik
zelf screenshots om de visuele kant te beoordelen. Wat de tekst al leert:

| Referentie | Wat we meenemen (als principe) | Wat we niet meenemen |
| --- | --- | --- |
| Oostvoorne (BDMNL) | Menu, openingstijden en sfeer snel bij elkaar; bestel- en reserveerroute duidelijk | Geschiedenis "sinds 1972", familieverhaal (dat is hún verhaal) |
| The Bridge (MADA) | Eenvoudige menustructuur + openingstijden; menu in dezelfde huisstijl als in de zaak; "ordering-ready" bouwen | Google-score en reviewaantallen |
| Amber (Digivisie) | Echte fotografie (gevel, interieur, eten, details); rustig kleurgebruik; afhalen zonder iDEAL | Biologisch/"Verantwoord Frituren"-claims |
| De Hoek (IT Live) | Opbouw categorie → kaart → knop → "zo bestel je" | **Alles verzonnen**: 500+ bestellingen, 9,1 reviews, "#1", sinds 1985 |

### 1.3 Skillry Premium

- **Verbinding werkt**: zoeken, `get_skill_access`, `list_installed_skills`
  geven antwoord. Toegang `member`, dagquotum 49/50 over. Er staan nu 0 Skills
  geïnstalleerd voor Claude Code (globaal).
- **De catalogus (±500 profielen) heeft geen Skill voor cafetaria's/
  restaurantmenu's, GSAP, scrollanimatie, lokale SEO, toegankelijkheid of
  Playwright-testen.** Zes zoekopdrachten leverden alleen sjablonen (SaaS,
  portfolio, drankmerk), losse hero-blokken, presentaties en video's op.
  Ik verzin dus geen "SEO-skill".

Shortlist van de dichtstbijzijnde kandidaten (10 bekeken):

| Skill | Prijs | Past? | Oordeel |
| --- | --- | --- | --- |
| bs-gridpaper-beverage-brand-site | gratis | Eten/drank-merk, product- en contactpagina's | Lawaaiig, fictieve inhoud, één-bestand-build; risico op "template-look" |
| bs-gradient-juice-brand-site | €4,99 | Drank/food-winkel, cafés genoemd | Zelfde risico, winkelmand/checkout niet nodig |
| bs-marker-doodle-brand-studio | gratis | Ontwerperswebsite | Past niet |
| bs-hero-* (6 blokken) | €4,99 elk | Alleen een hero | Niet aantoonbaar beter dan zelf bouwen |
| overige (dashboards, SaaS, video, decks, OG) | — | Nee | Afgevallen |

**Advies: geen Premium Skill installeren.** Geen enkele is aantoonbaar beter dan
de gratis route, en geen enkele is voor een cafetaria gemaakt. Optioneel kan de
gratis gridpaper-Skill als structuurreferentie, maar ik raad het af.

Wat ik wél gebruik (al aanwezig, gratis, eigen werkwijze):
- `website-standaard` (WebRnds-werkwijze: onderzoek → DESIGN.md → bouw →
  beoordeling tot 9+ → scripts voor contrast, a11y, content, formulier)
- `evidence-led-ui` (kwaliteitsrubric, 24 punten)
- `compliance-guard` (juridische controle, geen garanties)

---

## 2. Drie designrichtingen

Contrastwaarden zijn **gemeten** (WCAG-formule), niet geschat.

### A. "Zonnebrood" – warm en dagelijks
Crème `#FFF6E0`, zongeel `#F7B500`, bruin `#3B2314`, antraciet `#1F1B18`, oranje `#E8590C`.
- antraciet op geel 9,4:1 · bruin op crème 13,6:1 · antraciet op oranje 4,8:1
- wit op `#E8590C` is maar 3,6:1 → voor witte tekst of oranje tekst gebruik ik
  het donkerder `#B93D00` (5,6:1).
- Risico: alles geel wordt de standaard-snackbarlook.

### B. "Avondzon" – donker, na de zonsondergang
Antraciet `#1C1917`, amber `#FFB020`, koraal `#FF6B35`, crème `#FBF1DC`, roest `#8A3B12`.
- crème op antraciet 15,6:1 · amber op antraciet 9,6:1 · koraal op antraciet 6,2:1
- Past bij openingstijden tot 22/23 uur. Risico: donkere site oogt minder
  "dorpscafetaria", zwaarder voor ouderen.

### C. "Duinzon" – fris en natuurlijk (Amber-achtig)
Zand `#F3E6CC`, zeegroen `#2F6F62`, zonnegeel `#F2B632`, inkt `#1B2A27`, terracotta `#C8553D`.
- inkt op zand 12,1:1 · wit op zeegroen 5,9:1 · wit op terracotta 4,35:1 (te laag, wordt donkerder)
- Risico: groen suggereert "biologisch", wat we niet mogen claimen.

### Keuze: A als basis, met één donkere "avondband" uit B

Reden: De Zon is open van 12:30 tot 21–23 uur. De lichte crème/geel-site is
het dag-gevoel, en één donker blok (openingstijden + "nu open") wordt
automatisch het avond-gevoel. Geel wordt **accent**, geen vlak over de hele
pagina (anders is het de standaard-snackbarlook; de huidige eenpaginaversie
doet dat nog wel).

**Eén signatuurmotief: de zonnewijzer.** Een grote zonneschijf op een boog toont
live (Nederlandse tijd) waar "de zon" staat tussen openen en sluiten. Aan het
begin van de boog gaat De Zon open, aan het eind gaat ze onder. Gesloten =
zon onder de horizon, met "Open morgen om 12:30". Alles eromheen blijft rustig.

Wat ik bewust vermijd: stockfoto's van andere zaken, verzonnen scores, een
slideshow, kunstmatige "vers/ambachtelijk"-claims, GSAP-spektakel, kleurverlopen
en emoji-friet.

### Design system (wordt `DESIGN.md`, vóór de eerste regel code)
- **Kleuren** als OKLCH-tokens, gemeten met `tools/contrast.mjs`, alle paren ≥ 4,5:1.
- **Typografie:** Bricolage Grotesque (al lokaal, OFL-licentie), zelf gehost,
  dus geen Google Fonts-verbinding. Tweede lettertype alleen als het nodig blijkt.
- **Iconen:** Lucide (ISC), inline sprite.
- **Componenten:** knoppen (primair/bel/ghost), nav + mobiele onderbalk met
  vaste "Bel" en "Route", productkaart, categorietabs, prijsregel,
  openingstijdenblok, zonnewijzer.
- **Beweging:** hero-reveal, scroll-reveal, hover op kaarten, zonnewijzer. Alleen
  CSS en IntersectionObserver; `prefers-reduced-motion` zet alles stil.
- **Spacing:** schaal 4/8/12/16/24/40/64/96.

---

## 3. Sitestructuur

Statisch, meerdere pagina's (eigen URL per zoekintentie):

| URL | Inhoud |
| --- | --- |
| `/` | Hero, merknaam, bel- en menu-knop, zonnewijzer + tijden, uitgelichte categorieën, kort over, route |
| `/menukaart/` | Categorietabs, productkaarten, prijzen alleen als bevestigd |
| `/over-de-zon/` | Alleen bevestigde feiten, korte tekst |
| `/bestellen/` | Hoe afhalen nu werkt (bellen of aan de balie) + adviesroute voor later |
| `/contact/` | Adres, tel, e-mail, route-knop, tijden, kaartlink |
| `/privacy/` | Conceptverklaring, duidelijk gemarkeerd |
| `404.html` | Eigen 404 |

Bewust weggelaten (nu geen meerwaarde of niet te onderbouwen): fotogalerij tot er
echte foto's zijn, nieuws/aanbiedingen (geen bron), FAQ alleen met feiten uit
bronnen (openingstijden, betalen, afhalen), social media tot accounts bekend zijn,
reviews/sterren (geen geverifieerde score).

### Menukaart
- Data in `data/menu.json` (categorie, naam, omschrijving, prijs, `bevestigd:true/false`).
- Een klein script (`tools/build-menu.mjs`) schrijft de kaart als **statische HTML**,
  zodat Google de kaart leest en de site zonder JavaScript werkt.
- Bevestigd aanbod: alleen de categorieën friet, burger, snacks, vegetarisch,
  ijs, frisdrank. Producten en prijzen zijn **niet** bevestigd. Daarom
  een duidelijk gemarkeerde **voorbeeldkaart** ("Voorbeeld, nog te vervangen")
  zonder prijzen. Een controlescript faalt als onbevestigde items zonder
  markering op de site komen.
- Later de echte kaart invoeren = alleen `menu.json` aanpassen en één commando draaien.

### Online bestellen: onderscheid
1. **Doorlinken naar bestaand systeem:** niet mogelijk, het bestaat niet.
2. **Geïntegreerd systeem:** DISH biedt een "Ordering Website" die aan hun
   kassasysteem hangt (iDEAL e.d. te activeren; max. orders per tijdvak).
   Prijzen zijn niet gepubliceerd, en het kan alleen als de zaak een
   DISH-kassa heeft (onbekend). **Betaald, dus alleen met toestemming van
   de eigenaar.**
3. **Eigen platform:** niet doen. Geen eigen checkout.

Nu: een "Bel en haal af"-route (klikbaar telefoonnummer, mobiele onderbalk),
niets dat een bestelling suggereert die niet bestaat. De pagina is zo gebouwd
dat een DISH-bestelknop later op één plek kan worden toegevoegd.
Geen contactformulier (er is geen backend; een formulier zonder eerlijke
succesmelding mag niet). E-mail en telefoon zijn de route.

---

## 4. Techniek

**Voorstel: statische HTML/CSS/vanilla JS, geen framework.** Redenen: dit zijn
6–7 pagina's met een kaart die zelden wijzigt; snelst mogelijk (LCP), simpel te
hosten, past bij `website-standaard` en bij de bestaande map. React/Next/Tailwind/
GSAP zouden alleen build- en onderhoudskosten toevoegen. De scroll- en
hero-effecten zijn met CSS en één kleine observer te doen.

Doelen: Lighthouse performance/SEO/a11y/best-practices ≥ 95 (gemeten, niet beloofd),
afbeeldingen als AVIF/WebP met `srcset`, geen externe verzoeken behalve een
Google Maps-**link**.

Foto's: vaste bestandsnamen ("drop-in") met een getekende illustratie als
terugval, zodat de site er ook zonder foto's af uitziet. Fotolijst voor de
eigenaar: gevel (dag en avond), balie/interieur, frites, burger, 2–3 snacks,
ijs, kaart aan de muur. AI-foodfoto's raad ik **af** voor producten (misleidend
en rechten onzeker); stockfoto's alleen met licentie en duidelijk als sfeerbeeld.

## 5. SEO

- Titels en meta's per pagina; zoekwoorden: cafetaria Zwartewaal, snackbar
  Zwartewaal, friet/snacks Zwartewaal, eten afhalen Zwartewaal. Plaatsen in de
  omgeving pas na keuze door de eigenaar.
- `FoodEstablishment` JSON-LD met alleen bevestigde gegevens, **zonder**
  `aggregateRating`.
- `sitemap.xml`, `robots.txt`, canonical, Open Graph (afbeelding komt zodra er een
  echte foto is).
- **Blokkade:** het definitieve domein is onbekend, dus canonical en sitemap
  krijgen een duidelijke plaatshouder.

## 6. Juridisch en privacy (geen garanties)

- Geen cookies, geen analytics, geen embeds, zelf gehoste lettertypen: dan is
  geen cookiebanner nodig. (Nu staat er op Eatbu GTM + banner.)
- Google Maps alleen als link, geen ingebedde kaart.
- Privacyverklaring is een **concept** voor de eigenaar om te controleren.
- Assetregister: elk lettertype, icoon, foto en script met bron en licentie.
- Naam en btw-nummer van de eigenaar niet publiceren zonder bevestiging.

## 7. Kwaliteitscontrole

- Playwright op 1440 / 768 / 390 px: homepage, menukaart, contact; links
  (tel, mailto, route), consolefouten, afbeeldingen, reduced-motion.
- Scripts van `website-standaard`: contrast, a11y, content, links.
- Screenshots: desktop-home, mobiele home, menukaart, contact.
- Beoordeling met rubric `evidence-led-ui`, doel ≥ 20/24, max 2 rondes.
- Alleen echte uitkomsten worden gerapporteerd.

## 8. Opleveringsregels
- Niets live, niets gepubliceerd zonder jouw expliciete toestemming. Het
  `website-standaard`-stap "publiceren" sla ik daarom over.
- De bestaande eenpagina-versie in deze map blijft als `v0-eenpager/`
  bewaard (niet overschrijven); de nieuwe site komt ernaast.
- Einde: de vaste goedkeuringsvraag, en dan stop ik.

## 9. Openstaande aandachtspunten (voor de klant)
1. Echte menukaart en prijzen.
2. Eigen foto's en toestemming voor de vier Eatbu-foto's.
3. Definitief domein.
4. KvK-bevestiging en wat er in het colofon/privacyverklaring mag.
5. Wil de eigenaar online bestellen (betaald DISH-onderdeel) of blijft het bellen?
6. Sociale media-accounts (indien aanwezig).
