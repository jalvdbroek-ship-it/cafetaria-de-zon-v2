// Screenshots: node tools/shots.mjs  (server moet draaien)
import { loadPlaywright } from "./browser.mjs";
const base = process.env.URL || "http://localhost:4173";
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const sets = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobiel", { width: 390, height: 844 }],
];
const pages = [["home", "/"], ["menukaart", "/menukaart/"], ["contact", "/contact/"], ["bestellen", "/bestellen/"], ["over", "/over-de-zon/"]];
const only = process.env.ONLY?.split(",");
for (const [tag, viewport] of sets) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    if (only && !only.includes(name)) continue;
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(2300);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `.gg/screenshots/${tag}-${name}.png`, fullPage: true });
    console.log(`${tag}-${name}.png`);
  }
  await ctx.close();
}
await browser.close();
