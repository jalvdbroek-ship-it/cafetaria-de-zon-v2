// Maakt assets/img/og.png uit tools/og-bron.html. Gebruik: node tools/build-og.mjs
import { loadPlaywright } from "./browser.mjs";
import { fileURLToPath } from "node:url";

const source = new URL("./og-bron.html", import.meta.url).href;
const target = fileURLToPath(new URL("../assets/img/og.png", import.meta.url));
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(source);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: target });
await browser.close();
console.log("og.png gemaakt");
