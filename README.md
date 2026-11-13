# Cafetaria De Zon: website (ontwikkelversie)

Statische website voor Cafetaria De Zon, Noordeinde 12, Zwartewaal. **Voorbeeldsite** (noindex) op https://jalvdbroek-ship-it.github.io/cafetaria-de-zon-v2/ . De huidige Eatbu-site en de bestaande repo `cafetaria-de-zon` zijn niet aangeraakt.

## De site lokaal openen

Voor de tests is Playwright nodig (eenmalig de dependencies van `package.json` ophalen). Daarna:

```
npm run build      # bouwt de pagina's uit src/ en data/
npm start          # http://localhost:4173/
```

## Mapstructuur

- `src/pages`, `src/partials`: sjablonen. `npm run build` schrijft de HTML in de root (`index.html`, `menukaart/`, `contact/` enz.).
- `data/site.json`: adres, telefoon, tijden, domein. `data/menu.json`: de kaart. `data/fotos.json`: alt-teksten van fotoplekken.
- `assets/`: css, js, lettertype, favicon, `og.png`, `img/foto/` voor echte foto's.
- `tools/`: build, contrast en controles. `v0-eenpager/`: de eerdere eenpager, bewaard.
- `DESIGN.md`, `OPDRACHT.md`, `ONDERZOEK-EN-PLAN.md`, `ASSETS-EN-LICENTIES.md`.

## De echte menukaart invoeren

Nu staat er een **voorbeeldmenu** met 32 items en voorbeeldprijzen, duidelijk gemarkeerd op de pagina (banner, label per categorie, label in de navigatie). De menukaartpagina staat op `noindex` en niet in de sitemap zolang er voorbeeld-items zijn.

1. Zet in `data/menu.json` per item `"bevestigd": true` en `"prijs": 3.5`. Voeg items of categorieën toe.
2. `npm run build:productie`. Die weigert te bouwen zolang er voorbeeld-items of een plaatshouderdomein zijn.

## Foto's vervangen of toevoegen

Nu staan er 11 tijdelijke voorbeeldfoto's (Pexels) op de site, elk met het label "Voorbeeldfoto". Eigen foto's: zet het bronbestand als `<naam>.jpg` in `tools/bron-foto/`, pas de lijst bovenin `tools/maak-fotos.py` aan, draai `python tools/maak-fotos.py` en daarna `npm run build`. Zet in `data/fotos.json` `voorbeeld` op `false`, dan verdwijnt het label.

Oude werkwijze (direct plaatsen): zet `frites.webp`, `hamburgers.webp`, `snacks.webp`, `vegetarisch.webp`, `ijs.webp`, `dranken.webp`, `gevel.webp` of `interieur.webp` in `assets/img/foto/` (AVIF, WebP of JPG, liefst maximaal 1600 px breed) en bouw opnieuw. Gewenste opnames: gevel overdag en 's avonds, balie, frites, hamburger, twee of drie snacks, ijs.

## Controle (uitgevoerd 13 november 2026, tegen de lokale server)

- `npm run contrast`: 23 paren, alle geslaagd.
- `npm run check:site`: alle pagina's op 1440, 768 en 390 px: geen console-fouten, geen mislukte of externe verzoeken, geen horizontaal scrollen, titels, descriptions, canonical, JSON-LD, interne links, tel/mailto/route-links, open- en gesloten-staat met vaste klok, reduced motion, mobiel menu, categorietabs.
- `npm run check:a11y` en `check:content`: geslaagd op de voorpagina en menukaart. Op de andere pagina's faalt alleen de heuristiek "meer dan 20 focusbare elementen" (16 tot 20 aanwezig); dat is geen echt probleem op een korte pagina.
- Gewicht voorpagina: 78 kB totaal, LCP 0,15 s (desktop) en 0,9 s (mobiel, lokaal), CLS 0.
- Niet gedaan: Lighthouse, handmatige screenreader- en toetsenbordtest op een echt toestel, controle op echte telefoons.

## Wat nog moet voor livegang

- [ ] Echte kaart en prijzen vervangen het voorbeeldmenu, daarna `build:productie`.
- [ ] Definitief domein in `data/site.json` (canonical, sitemap, Open Graph).
- [ ] Eigen foto's vervangen de voorbeeldfoto's (en het label verdwijnt).
- [ ] Privacyverklaring laten controleren, "Concept"-blok weghalen.
- [ ] Eigenaar bevestigt de aannames in `OPDRACHT.md`.
- [ ] Besluit over online bestellen (DISH Ordering Website is betaald).
- [ ] Hosting kiezen; de 404-pagina gebruikt absolute paden en werkt alleen op een eigen domein.
