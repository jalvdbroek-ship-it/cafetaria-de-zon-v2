// Controleert alle pagina's: console, links, bestanden, SEO, horizontaal scrollen, gesloten/open-staat.
// Gebruik: node tools/check-site.mjs  (server moet draaien)
import { loadPlaywright } from "./browser.mjs";
import { readFileSync } from "node:fs";

const base = process.env.URL || "http://localhost:4173";
const site = JSON.parse(readFileSync(new URL("../data/site.json", import.meta.url), "utf8"));
const pages = ["/", "/menukaart/", "/bestellen/", "/over-de-zon/", "/contact/", "/privacy/"];
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
let fails = 0;
const rec = (name, pass, detail = "") => { if (!pass) fails++; console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  -> " + detail : ""}`); };

for (const path of pages) {
  for (const [tag, vp] of [["1440", { width: 1440, height: 900 }], ["768", { width: 768, height: 1024 }], ["390", { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const errors = [], bad = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("response", (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
    const external = [];
    page.on("request", (r) => { const u = new URL(r.url()); if (u.origin !== new URL(base).origin) external.push(r.url()); });
    await page.goto(base + path, { waitUntil: "networkidle" });
    const label = `${path} @${tag}`;
    rec(`${label} geen console-fouten`, errors.length === 0, errors.join(" | "));
    rec(`${label} geen mislukte verzoeken`, bad.length === 0, bad.join(" | "));
    rec(`${label} geen externe verzoeken`, external.length === 0, external.join(" | "));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    rec(`${label} geen horizontaal scrollen`, overflow <= 0, `${overflow}px`);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
    await page.waitForTimeout(500);
    if (tag === "1440") {
      const info = await page.evaluate(() => ({
        title: document.title, desc: document.querySelector('meta[name="description"]')?.content,
        canon: document.querySelector('link[rel="canonical"]')?.href, h1: document.querySelectorAll("h1").length,
        og: document.querySelector('meta[property="og:title"]')?.content,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)["@type"]; } catch { return "ONGELDIG"; } }),
        imgsBroken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        noAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
        links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
        lang: document.documentElement.lang,
      }));
      rec(`${path} title 20-65 tekens`, info.title.length >= 20 && info.title.length <= 65, `${info.title.length}: ${info.title}`);
      rec(`${path} description 70-165 tekens`, info.desc && info.desc.length >= 70 && info.desc.length <= 165, `${info.desc?.length}`);
      rec(`${path} canonical aanwezig`, !!info.canon, info.canon);
      rec(`${path} precies een h1`, info.h1 === 1);
      rec(`${path} lang=nl, og:title, JSON-LD geldig`, info.lang === "nl" && !!info.og && !info.ld.includes("ONGELDIG"), info.ld.join(","));
      rec(`${path} afbeeldingen laden, alt aanwezig`, info.imgsBroken.length === 0 && info.noAlt === 0);
      const tel = info.links.filter((h) => h.startsWith("tel:"));
      const mail = info.links.filter((h) => h.startsWith("mailto:"));
      rec(`${path} tel- en mailto-links kloppen`, tel.every((h) => h === `tel:${site.phone}`) && mail.every((h) => h === `mailto:${site.email}`), `${tel.length} tel, ${mail.length} mail`);
      for (const href of new Set(info.links.filter((h) => !/^(tel:|mailto:|https?:|#)/.test(h)))) {
        const url = new URL(href, base + path);
        const r = await ctx.request.get(url.href);
        rec(`${path} interne link ${href}`, r.status() === 200, String(r.status()));
      }
      for (const href of new Set(info.links.filter((h) => h.startsWith("https://www.google.com/maps")))) rec(`${path} routelink heeft adres/bestemming`, /destination=|query=/.test(href), href);
    }
    await ctx.close();
  }
}

// Open- en gesloten-staat met vaste klok (vrijdag 18:00, maandag 12:00, zaterdag 23:30)
const cases = [
  ["2026-11-13T18:00:00+01:00", "open", /^Nu open/, /tot 23:00 uur/],
  ["2026-11-16T12:00:00+01:00", "closed", /^Nu gesloten/, /Open morgen om 12:30 uur/],
  ["2026-11-14T23:30:00+01:00", "closed", /^Nu gesloten/, /Open morgen om 12:30 uur/],
  ["2026-11-17T12:00:00+01:00", "closed", /^Nu gesloten/, /Open vandaag om 12:30 uur/],
];
for (const [time, state, textRe, detailRe] of cases) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, timezoneId: "America/New_York" });
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date(time) });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({ state: document.getElementById("dial").dataset.state, text: document.getElementById("status-state").textContent, detail: document.getElementById("status-detail").textContent, today: document.querySelector(".hours tr[data-today] th")?.textContent }));
  rec(`klok ${time} -> ${state}`, r.state === state && textRe.test(r.text) && detailRe.test(r.detail), JSON.stringify(r));
  await ctx.close();
}

// Reduced motion: geen lopende animaties
{
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const n = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  const tiles = await page.evaluate(() => [...document.querySelectorAll(".tile")].every((t) => getComputedStyle(t).opacity === "1"));
  rec("reduced motion: geen lopende animaties, tegels zichtbaar", n === 0 && tiles, `${n} animaties`);
  await ctx.close();
}

// Mobiel menu en categorie-navigatie
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const hiddenBefore = !(await page.locator("#nav").isVisible());
  await page.click(".nav-toggle");
  const shown = await page.locator("#nav").isVisible();
  await page.keyboard.press("Escape");
  const hiddenAfter = !(await page.locator("#nav").isVisible());
  rec("mobiel menu opent en sluit (Escape)", hiddenBefore && shown && hiddenAfter);
  const dock = await page.locator(".dock").isVisible();
  rec("mobiele onderbalk zichtbaar", dock);
  await page.goto(base + "/menukaart/", { waitUntil: "networkidle" });
  await page.click('.cat-nav a[href="#ijs"]');
  await page.waitForTimeout(900);
  const cur = await page.locator('.cat-nav a[aria-current="true"]').textContent();
  rec("categorie-tab volgt scrollpositie", cur.trim() === "IJs", cur.trim());
  await ctx.close();
}

await browser.close();
console.log(fails ? `\n${fails} controle(s) mislukt` : "\nAlle controles geslaagd");
process.exit(fails ? 1 : 0);
