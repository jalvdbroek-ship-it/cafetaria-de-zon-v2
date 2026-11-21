# Zet de bronfoto's in tools/bron-foto om naar WebP (1400 en 800 px breed) in assets/img/foto/.
# Gebruik: python tools/maak-fotos.py   (vereist Pillow). Eigen foto's: zet ze als <slot>.jpg in tools/bron-foto en voeg de slot toe.
from PIL import Image
import os

SRC = "tools/bron-foto"
OUT = "assets/img/foto"
# slot: (bestand zonder .jpg, uitsnede als fracties (links, boven, rechts, onder) of None)
SLOTS = {
    "frites": ("29150162", None),
    "hamburgers": ("1639562", None),
    "snacks": ("1105752", None),
    "vegetarisch": ("3607284", None),
    "ijs": ("1294943", None),
    "dranken": ("16404143", (0, 0.11, 1, 0.91)),
    "sauzen": ("3622479", None),
    "interieur": ("29179403", None),
    "sfeer": ("18713424", None),
    "afhalen": ("4109273", None),
    "band": ("16222103", None),
}
os.makedirs(OUT, exist_ok=True)
for slot, (name, crop) in SLOTS.items():
    im = Image.open(f"{SRC}/{name}.jpg").convert("RGB")
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    for width, suffix in ((1400, ""), (800, "-800")):
        out = im.copy()
        if out.width > width:
            out = out.resize((width, round(out.height * width / out.width)), Image.LANCZOS)
        path = f"{OUT}/{slot}{suffix}.webp"
        out.save(path, "WEBP", quality=76, method=6)
    print(slot, im.size, os.path.getsize(f"{OUT}/{slot}.webp") // 1024, "kB")
