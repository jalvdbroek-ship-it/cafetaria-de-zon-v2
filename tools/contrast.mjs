// WCAG 2.2 contrast voor het De Zon-palet (OKLCH-tokens uit assets/css/style.css). Run: node tools/contrast.mjs
import { readFileSync } from "node:fs";
const css = readFileSync(new URL("../assets/css/style.css", import.meta.url), "utf8");
const T = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/g)) T[m[1]] = [+m[2], +m[3], +m[4]];
const clamp = (v) => Math.min(1, Math.max(0, v));
function lin([L, C, H]) {
  const h = (H * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(clamp);
}
const Y = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
const ratio = (a, b) => { const [x, y] = [Y(lin(T[a])), Y(lin(T[b]))].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pairs = [
  ["ink", "paper", 4.5], ["ink", "paper-2", 4.5], ["ink", "sun", 4.5], ["ink-2", "paper", 4.5], ["ink-2", "paper-2", 4.5],
  ["paper", "ember", 4.5], ["ember", "paper", 4.5], ["ember", "paper-2", 4.5], ["paper", "ink", 4.5],
  ["night-ink", "night", 4.5], ["night-ink-2", "night", 4.5], ["amber", "night", 4.5], ["amber", "night-2", 4.5], ["night-ink", "night-2", 4.5],
  ["night-ink", "night", 4.5], ["ink", "ember-bright", 3], ["ink", "amber", 4.5],
  ["line-strong", "paper", 3], ["line-strong", "paper-2", 3], ["ink", "line", 3], ["ember-bright", "paper", 3], ["ember-bright", "night", 3], ["amber", "night", 3],
];
let fails = 0;
for (const [a, b, min] of pairs) {
  const r = ratio(a, b), ok = r >= min;
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(6)} (min ${min})  ${a} op ${b}`);
}
console.log(fails ? `\n${fails} paar/paren onder de norm` : "\nAlle paren halen de norm");
process.exit(fails ? 1 : 0);
