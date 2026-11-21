// Maakt src/partials/cast.svg: de figuurtjes uit het social media pakket als sprite-symbolen voor de site.
// Gebruik: node tools/maak-cast.mjs   (daarna: npm run build)
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { char } = await import(pathToFileURL(join(root, "social-media/src/personages.mjs")).href);

const lijst = [
  ["zon", "cool", "wave"],
  ["zon", "sleep", "none"],
  ["zon", "wow", "up"],
  ["frietje", "happy", "wave"],
  ["burg", "cool", "hips"],
  ["snack", "wink", "cheer"],
  ["ijsje", "happy", "wave"],
  ["slaatje", "happy", "hips"],
];
const symbols = lijst
  .map(([n, mood, pose]) => {
    const inner = char(n, { mood, pose }).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    return `<symbol id="cast-${n}-${mood}" viewBox="-30 -10 260 280">${inner}</symbol>`;
  })
  .join("\n");
writeFileSync(join(root, "src/partials/cast.svg"), symbols + "\n");
console.log(`${lijst.length} figuurtjes geschreven`);
