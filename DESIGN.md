# Cafetaria De Zon: ontwerpnotitie

Onderwerp en publiek: Cafetaria De Zon, Noordeinde 12, Zwartewaal. Publiek: mensen uit het dorp en de buurt die op hun telefoon willen weten of De Zon open is, wat er te halen valt en hoe ze moeten bellen of komen.
De enige taak van de site: **bellen of langskomen**, met de kaart als steun.

Signature: **de zonnewijzer**. Een zonneschijf op een stippelboog laat live (Nederlandse tijd) zien waar "de zon" staat tussen openen en sluiten. Na sluitingstijd gaat de zon onder en wordt het paneel donker, met "open morgen om 12:30". Dit is het enige opvallende element; de rest blijft rustig.

Type: Bricolage Grotesque (variabel, 200 tot 800, zelf gehost) voor alles. Koppen 800 met strakke tracking, lopende tekst 400 tot 600. Cijfers in tabellen met `tabular-nums`. Geen tweede lettertype: het karakter zit in de koppen.

Kleur (OKLCH, gemeten met `npm run contrast`, alle gebruikte paren halen WCAG 2.2 AA):
  --paper oklch(0.974 0.03 88)    --paper-2 oklch(0.938 0.059 88)
  --sun oklch(0.813 0.167 82)     --amber oklch(0.813 0.165 75)
  --ink oklch(0.24 0.032 55)      --ink-2 oklch(0.412 0.038 59)
  --ember oklch(0.533 0.169 39)   --ember-bright oklch(0.644 0.192 42) (alleen vlakken en illustraties, geen tekst)
  --night oklch(0.226 0.008 59)   --night-2 oklch(0.274 0.013 62)
  --night-ink oklch(0.96 0.03 86) --night-ink-2 oklch(0.81 0.035 80)
Geel is accent (hero-paneel, grote frites-tegel, contactband), geen achtergrond van de hele pagina. De donkere "avondband" (openingstijden) en het gesloten-paneel gebruiken dezelfde nacht-tinten.

Ruimte en dichtheid: basis 4px, schaal 4/8/12/16/24/40/64/96. Ruime sectiepadding (tot 96px desktop, 40px mobiel). Eén contentrail van 74rem met 20 tot 48px gutters voor header, hero, secties en footer.

Radius en materiaal: knoppen en tegels 14px, panelen 28px, tabs pillvormig (alleen filters). Geen schaduwen, geen glas, geen verlopen: vlakke kleurvlakken met een 2px inktlijn waar structuur nodig is.

Beeld: tijdelijke voorbeeldfoto's van Pexels (WebP, 1400 en 800 px) met een zichtbaar label "Voorbeeldfoto" en een voetnoot. Vaste fotoplekken (`assets/img/foto/<naam>.webp`, zie `data/fotos.json`); de site toont een foto zodra het bestand bestaat en anders een getekende categorie-illustratie (eigen SVG). Foto's vullen de tegels, de categorie-banners in de menukaart, een brede band op de voorpagina, een collage bij "Over" en de afhaalpagina.

Beweging (uitgebreid op verzoek): koppen van de hero schuiven regel voor regel omhoog, het zonnepaneel komt op, de zon glijdt naar zijn plek en de stralen draaien langzaam; een oranje ticker met de categorieen loopt door (pauzeert bij hover); blokken, tabelrijen en menu-items komen een voor een binnen bij scrollen; foto's schuiven licht mee bij het scrollen (parallax, alleen waar de browser scroll-gedreven animaties kent); tegels zoomen de foto of draaien de illustratie bij hover; knoppen kantelen hun icoon; pagina's wisselen met een zachte overgang (view transitions, waar ondersteund). Onder `prefers-reduced-motion` staat alles stil en alle blokken zijn meteen zichtbaar.

Uitlijning: links uitgelijnd, asymmetrisch; de frites-tegel is groter dan de rest omdat het de eerste categorie is.

Mobiel: vaste onderbalk met Kaart, Bel (primair) en Route; hamburgermenu voor de overige pagina's; categorie-tabs in de menukaart blijven plakken.

Vermeden slop-tells: gecentreerde gradient-hero, drie gelijke icoonkaarten, cijferstrook met verzonnen aantallen, sterrenscore, "ambachtelijk/vers/sinds"-claims, fade-in op elke sectie, hover-lift, emoji, nummering zonder volgorde, foto's van andere zaken.

Waar de referenties als houvast zijn gebruikt: volgorde menu, tijden, bel/route en afhalen (Oostvoorne, The Bridge), eigen fotografie als later doel (Amber), categorie, kaart, knop (De Hoek, zonder de verzonnen cijfers). Vorm, kleur, typografie en alle tekst zijn zelf gemaakt.

## Zelfbeoordeling (rubric evidence-led-ui, niet onafhankelijk)

| Criterium | Score | Opmerking |
| --- | --- | --- |
| 1 Specificiteit | 2 | Zonnewijzer, adres, bel-route zijn alleen voor De Zon |
| 2 Hiërarchie | 2 | Naam, bel en kaart als eerste drie stops |
| 3 Compositie | 2 | Eén rail, asymmetrische tegels |
| 4 Consistentie | 2 | Eén icoonset, één knopanatomie |
| 5 Typografie | 1 | Fallback-layoutverschuiving niet apart gemeten |
| 6 Materiaal | 2 | Vlak, tonaal, één lijnbreedte |
| 7 Staten | 2 | Open, gesloten, hover, focus, reduced motion, geen JS, lege fotoplek |
| 8 Responsive | 2 | 390, 768 en 1440 gecontroleerd, geen horizontaal scrollen |
| 9 Toegankelijkheid | 1 | Automatische controles groen; geen handmatige screenreader-test |
| 10 Beweging | 2 | Eén moment, reduced-motion getest |
| 11 Authenticiteit | 2 | Alleen bevestigde feiten; voorbeeldkaart gemarkeerd |
| 12 Onderscheidend | 1 | Herkenbaar, maar zonder echte foto's nog niet vol uitgespeeld |
| **Totaal** | **20/24** | Foto's van de zaak zijn de grootste winst |
