"""Generate the PWA icons (run once: python scripts/make_icons.py)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

GREEN = (31, 77, 58)
CREAM = (246, 241, 232)
OUT = Path(__file__).resolve().parent.parent / "public"
FONT = "C:/Windows/Fonts/georgia.ttf"


def make(size: int, name: str, padding: float = 0.0) -> None:
    img = Image.new("RGB", (size, size), GREEN)
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT, int(size * (0.62 - padding)))
    draw.text((size / 2, size / 2), "E", font=font, fill=CREAM, anchor="mm")
    # small underline accent, like a spoken cadence mark
    w = size * (0.3 - padding / 2)
    y = size * (0.79 - padding / 3)
    draw.rounded_rectangle(
        (size / 2 - w / 2, y, size / 2 + w / 2, y + size * 0.025), radius=size * 0.0125, fill=CREAM
    )
    img.save(OUT / name)


make(192, "pwa-192.png")
make(512, "pwa-512.png")
make(512, "pwa-maskable-512.png", padding=0.14)
make(180, "apple-touch-icon.png")
make(64, "favicon.png")
