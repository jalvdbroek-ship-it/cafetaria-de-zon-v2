// Bouwt de statische site: src/pages + src/partials + data/*.json -> HTML in de root.
// Gebruik: node tools/build.mjs            (preview)
//          node tools/build.mjs --productie (faalt bij plaatshouders of voorbeeldinhoud)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const productie = process.argv.includes("--productie");
const read = (p) => readFileSync(join(root, p), "utf8");
const site = JSON.parse(read("data/site.json"));
const menu = JSON.parse(read("data/menu.json"));
const fotos = JSON.parse(read("data/fotos.json"));
const hasExample = menu.categorieen.some((c) => c.items.some((i) => !i.bevestigd));

const DAYS = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const euro = (n) => "€ " + Number(n).toFixed(2).replace(".", ",");
const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

const unconfirmed = menu.categorieen.flatMap((c) => c.items).filter((i) => !i.bevestigd);

if (productie) {
  const problems = [];
  if (site.preview || site.siteUrl.includes("PLAATSHOUDER")) problems.push("site.json staat nog op preview (zet preview op false en vul het echte domein in)");
  if (unconfirmed.length) problems.push(`${unconfirmed.length} menu-items zijn nog voorbeeldinhoud`);
  if (problems.length) {
    console.error("Productiebouw geweigerd:\n- " + problems.join("\n- "));
    process.exit(1);
  }
}

// ---------- blokken ----------
const blocks = {
  nav: (ctx) =>
    `<ul>` +
    site.nav
      .map(
        (n) =>
          `<li><a href="${ctx.root}${n.href}"${ctx.meta.page === n.page ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`
      )
      .join("") +
    `</ul>`,

  "hours-table": () => {
    const rows = ORDER.map((d) => {
      const h = site.hours[d];
      return `<tr data-day="${d}"><th scope="row">${DAYS[d]}</th><td>${h ? `${h[0]} tot ${h[1]}` : "Gesloten"}</td></tr>`;
    }).join("");
    return `<table class="hours"><caption class="sr-only">Openingstijden per dag</caption><thead class="sr-only"><tr><th scope="col">Dag</th><th scope="col">Open</th></tr></thead><tbody>${rows}</tbody></table>`;
  },

  "hours-json": () => `<script type="application/json" id="hours-data">${JSON.stringify(site.hours)}</script>`,

  sprite: () => {
    const ill = read("src/partials/illustraties.svg").trim() + " " + (existsSync(join(root, "src/partials/cast.svg")) ? read("src/partials/cast.svg").trim() : "");
    const used = new Set();
    for (const f of ["src/pages", "src/partials"]) {
      for (const file of readdirSync(join(root, f))) {
        for (const m of read(`${f}/${file}`).matchAll(/#i-([a-z0-9-]+)/g)) used.add(m[1]);
      }
    }
    const icons = [...used]
      .sort()
      .filter((n) => existsSync(join(root, ".icons", `${n}.svg`)))
      .map((n) => {
        const svg = read(`.icons/${n}.svg`);
        const inner = svg.replace(/<!--[\s\S]*?-->/g, "").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
        return `<symbol id="i-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</symbol>`;
      })
      .join("");
    return `<svg class="sprite" aria-hidden="true" focusable="false">${icons}${ill}</svg>`;
  },

  "menu-notice": () =>
    unconfirmed.length
      ? `<p class="notice" role="note"><strong>Voorbeeldmenu.</strong> De producten en prijzen op deze pagina zijn voorbeelden en nog niet van De Zon. De echte kaart volgt. Wil je weten wat er te halen valt? Bel <a href="tel:${site.phone}">${site.phoneDisplay}</a>.</p>`
      : "",

  "foto-note": () =>
    Object.entries(fotos).some(([k, v]) => v && v.voorbeeld && existsSync(join(root, `assets/img/foto/${k}.webp`)))
      ? `<p class="foto-note rail">Foto's met het label "Voorbeeldfoto" zijn tijdelijke beelden van Pexels (vrij te gebruiken). Ze worden vervangen door foto's van De Zon.</p>`
      : "",

  robots: (ctx) => (site.preview || (ctx.meta.page === "menu" && unconfirmed.length) ? `<meta name="robots" content="noindex, nofollow">` : ""),

  "menu-nav": () =>
    `<nav class="cat-nav" aria-label="Categorieën"><ul>` +
    menu.categorieen.map((c) => `<li><a href="#${c.id}">${esc(c.naam)}</a></li>`).join("") +
    `</ul>${unconfirmed.length ? `<p class="nav-note">Voorbeeldmenu</p>` : ""}</nav>`,

  menu: () =>
    menu.categorieen
      .map((c) => {
        const sample = c.items.some((i) => !i.bevestigd);
        const photo = photoMarkup(c.id, { cls: "cat-photo", sizes: "(min-width: 800px) 60vw, 100vw", par: true });
        const items = c.items
          .map(
            (i) =>
              `<li class="item"${i.bevestigd ? "" : " data-voorbeeld"}><div class="item-text"><h3>${esc(i.naam)}</h3>${i.omschrijving ? `<p>${esc(i.omschrijving)}</p>` : ""}</div>${i.prijs != null ? `<span class="dots" aria-hidden="true"></span><span class="price">${euro(i.prijs)}</span>` : ""}</li>`
          )
          .join("");
        return `<section class="cat" id="${c.id}" aria-labelledby="${c.id}-t"><div class="cat-head"><div class="cat-art"><svg class="ill" aria-hidden="true"><use href="#ill-${c.illustratie}"/></svg></div><h2 id="${c.id}-t">${esc(c.naam)}</h2>${sample ? `<span class="tag">Voorbeeld</span>` : ""}</div>${photo}<ul class="items">${items}</ul></section>`;
      })
      .join(""),

  tiles: (ctx) => {
    const t = (c, cls) => {
      const photo = photoMarkup(c.id, { sizes: cls === "tile-big" ? "(min-width: 800px) 50vw, 100vw" : "(min-width: 800px) 25vw, 50vw", tag: true });
      return `<li class="tile ${cls} reveal"><a href="${ctx.root}menukaart/#${c.id}"${photo ? ' class="has-photo"' : ""}>${photo}<span class="tile-name">${esc(c.naam)}</span>${photo ? "" : `<span class="tile-art"><svg class="ill" aria-hidden="true"><use href="#ill-${c.illustratie}"/></svg></span>`}</a></li>`;
    };
    const by = Object.fromEntries(menu.categorieen.map((c) => [c.id, c]));
    return t(by.frites, "tile-big") + t(by.hamburgers, "") + t(by.snacks, "") + t(by.vegetarisch, "") + t(by.ijs, "") + t(by.dranken, "tile-wide");
  },

  photo: (ctx, arg) => {
    const [slot, ...opts] = arg.trim().split(/\s+/);
    return photoMarkup(slot, { cls: opts.find((o) => o.startsWith("cls=") )?.slice(4) || "foto", sizes: "(min-width: 800px) 40vw, 100vw", par: opts.includes("par"), tag: true });
  },

  jsonld: () => {
    const groups = {};
    for (const d of ORDER) {
      const h = site.hours[d];
      if (!h) continue;
      (groups[h.join("-")] ||= { opens: h[0], closes: h[1], days: [] }).days.push(SCHEMA_DAYS[d]);
    }
    const data = {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      "@id": `${site.siteUrl}/#bedrijf`,
      name: site.name,
      url: `${site.siteUrl}/`,
      telephone: site.phone,
      email: site.email,
      servesCuisine: site.cuisine,
      paymentAccepted: site.payment.join(", "),
      hasMenu: `${site.siteUrl}/menukaart/`,
      hasMap: site.mapsUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.street,
        postalCode: site.postal,
        addressLocality: site.city,
        addressCountry: "NL"
      },
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      openingHoursSpecification: Object.values(groups).map((g) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: g.days,
        opens: g.opens,
        closes: g.closes
      }))
    };
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  }
};

function photoMarkup(slot, { cls = "", sizes = "100vw", par = false, tag = true } = {}) {
  const meta = fotos[slot];
  if (!meta || !existsSync(join(root, `assets/img/foto/${slot}.webp`))) return "";
  const small = existsSync(join(root, `assets/img/foto/${slot}-800.webp`));
  const img = `<img src="@ROOT@assets/img/foto/${slot}.webp"${small ? ` srcset="@ROOT@assets/img/foto/${slot}-800.webp 800w, @ROOT@assets/img/foto/${slot}.webp 1400w" sizes="${sizes}"` : ""} alt="${esc(meta.alt)}" loading="lazy" decoding="async">`;
  const label = tag && meta.voorbeeld ? `<span class="ph-tag">Voorbeeldfoto</span>` : "";
  return `<span class="ph${cls ? " " + cls : ""}${par ? " par" : ""}">${img}${label}</span>`;
}

// ---------- sjablonen ----------
function render(src, ctx, depth = 0) {
  if (depth > 5) throw new Error("Te diepe include");
  let out = src.replace(/\{\{>\s*([a-z-]+)\s*\}\}/g, (_, name) => render(read(`src/partials/${name}.html`), ctx, depth + 1));
  out = out.replace(/\{\{@([a-z-]+)([^}]*)\}\}/g, (_, name, arg) => {
    if (!blocks[name]) throw new Error(`Onbekend blok: ${name}`);
    return blocks[name](ctx, arg);
  });
  out = out.replace(/\{\{([a-zA-Z.]+)\}\}/g, (_, path) => {
    const v = get(ctx, path);
    if (v == null) throw new Error(`Onbekende waarde: ${path}`);
    return v;
  });
  return out.replaceAll("@ROOT@", ctx.root);
}

const written = [];
for (const file of readdirSync(join(root, "src/pages")).filter((f) => f.endsWith(".html"))) {
  let src = read(`src/pages/${file}`);
  const m = src.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: meta ontbreekt`);
  const meta = JSON.parse(m[1]);
  src = src.slice(m[0].length);
  const depth = meta.path === "/" || meta.path === "/404" ? 0 : 1;
  const ctx = {
    site,
    meta: { ...meta, canonical: `${site.siteUrl}${meta.path === "/404" ? "/" : meta.path}` },
    root: depth ? "../" : ""
  };
  const html = render(src, ctx);
  const outPath = meta.path === "/" ? "index.html" : meta.path === "/404" ? "404.html" : join(meta.path.slice(1), "index.html");
  mkdirSync(dirname(join(root, outPath)), { recursive: true });
  writeFileSync(join(root, outPath), html);
  if (meta.path !== "/404" && !meta.noindex && !(meta.page === "menu" && hasExample)) written.push(meta.path);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    written.map((p) => `  <url><loc>${site.siteUrl}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`
);
writeFileSync(
  join(root, "robots.txt"),
  site.preview ? `User-agent: *\nDisallow: /\n` : `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`
);

console.log(`Gebouwd: ${written.length} pagina's + 404, sitemap, robots.${unconfirmed.length ? ` Let op: ${unconfirmed.length} voorbeeld-items in de kaart.` : ""}`);
if (site.preview) console.log("Let op: preview-modus (noindex, robots Disallow). Zet preview op false en vul het echte domein in voor livegang.");
