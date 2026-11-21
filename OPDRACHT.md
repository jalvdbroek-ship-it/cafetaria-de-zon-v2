# Opdracht: website Cafetaria De Zon (WebRnds)

Status per eis: **Waargemaakt**, **Niet waargemaakt** of **Openstaand**.

| Eis | Status | Waar |
| --- | --- | --- |
| Onderzoek huidige site, bedrijf en vier referenties | Waargemaakt | `ONDERZOEK-EN-PLAN.md` (referenties alleen als tekst gelezen; visueel niet beoordeeld) |
| Skillry gecontroleerd, shortlist, geen onnodige installatie | Waargemaakt | Plan 1.3; geen Premium Skill geïnstalleerd |
| Drie designrichtingen met HEX, onderbouwde keuze, design system | Waargemaakt | Plan sectie 2, `DESIGN.md` |
| Homepage: hero, CTA kaart + bel, openingstijden, kaart, intro, contact | Waargemaakt | `/` |
| Populaire producten | Niet waargemaakt | Geen bron voor wat populair is |
| Menukaart met categorieën, mobiel goed, geen PDF, uitbreidbaar | Waargemaakt (voorbeeldmenu met 32 items en voorbeeldprijzen, gemarkeerd als voorbeeld) | `/menukaart/`, `data/menu.json` |
| Echte producten en prijzen | Openstaand | Eigenaar moet kaart aanleveren |
| Over De Zon, alleen bevestigde informatie | Waargemaakt | `/over-de-zon/` |
| Contact en locatie, klikbare telefoon, e-mail, route, tijden | Waargemaakt | `/contact/`, onderbalk op mobiel |
| Acties, galerij, FAQ, social, nieuws | Niet waargemaakt | Geen bron of foto's; bewust weggelaten |
| Online bestellen onderzocht | Waargemaakt | Plan sectie 3; er is geen bestaand systeem; `/bestellen/` toont de afhaalroute |
| Online bestellen zelf | Openstaand | Betaald DISH-onderdeel, alleen met toestemming eigenaar |
| Stack gekozen en onderbouwd, reduced motion | Waargemaakt | Statisch, vanilla JS |
| Foto's | Deels | 11 tijdelijke Pexels-foto's met label "Voorbeeldfoto" (op verzoek mogen deze afwijken van het echte aanbod); eigen foto's blijven openstaand |
| SEO: titels, meta, headings, alt, links, JSON-LD, OG, sitemap, robots, canonical | Waargemaakt, met plaatshouder | Domein onbekend: `siteUrl` in `data/site.json` |
| Juridisch: licenties, AVG, cookies, privacy | Waargemaakt (concept) | `ASSETS-EN-LICENTIES.md`, `/privacy/` is concept |
| Test desktop/tablet/mobiel, links, console, a11y, performance | Waargemaakt, zie README | `npm run check:site`, `check:a11y` |
| Screenshots (desktop home, mobiele home, menukaart, contact) | Waargemaakt | `.gg/screenshots/` |
| Voorbeeldsite online (noindex), bestaande site niet gewijzigd | Waargemaakt | GitHub Pages: https://jalvdbroek-ship-it.github.io/cafetaria-de-zon-v2/ |
| GitHub volgens WebRnds-afspraken | Waargemaakt | Repo `jalvdbroek-ship-it/cafetaria-de-zon-v2` |

## Aannames die de eigenaar moet bevestigen

1. Afhalen gaat via bellen of aan de balie (Eatbu noemt alleen "Afhaalservice").
2. Er is geen online bestelsysteem (op Eatbu niet gevonden).
3. De openingstijden zijn de actuele (bron: Eatbu, 13 november 2026).
4. Betalen: pin en contant.
