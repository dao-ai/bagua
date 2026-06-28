#!/usr/bin/env python3
"""Generate PWA icons for the bagua app — taiji symbol on a circular background."""

from PIL import Image, ImageDraw
import math

OUT_DIR = "public"
SIZES = [192, 512]
BG_COLOR = (36, 40, 47, 255)  # dark bg match —var(--bg)
YIN_COLOR = (10, 10, 20, 255)
YANG_COLOR = (240, 240, 245, 255)

def draw_taiji(draw, cx, cy, radius):
    """Draw a taiji (yin-yang) symbol centered at (cx, cy) with given radius."""
    half = radius / 2

    # Outer circle (fill with yang/light)
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=YANG_COLOR,
    )

    # Yin (dark) half — bottom semicircle
    draw.pieslice(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        start=180, end=0,
        fill=YIN_COLOR,
    )

    # Internal circle left (yang with yin dot)
    draw.ellipse(
        [cx - half - half/2, cy - half, cx - half + half/2, cy + half],
        fill=YANG_COLOR,
    )

    # Internal circle right (yin with yang dot)
    draw.ellipse(
        [cx + half - half/2, cy - half, cx + half + half/2, cy + half],
        fill=YIN_COLOR,
    )

    # Yin dot on left (yang circle)
    dot_r = half / 4
    draw.ellipse(
        [cx - half - dot_r, cy - dot_r, cx - half + dot_r, cy + dot_r],
        fill=YIN_COLOR,
    )

    # Yang dot on right (yin circle)
    draw.ellipse(
        [cx + half - dot_r, cy - dot_r, cx + half + dot_r, cy + dot_r],
        fill=YANG_COLOR,
    )

def main():
    import os
    os.makedirs(OUT_DIR, exist_ok=True)

    for size in SIZES:
        img = Image.new("RGBA", (size, size), BG_COLOR)
        draw = ImageDraw.Draw(img)

        # Circular background
        margin = int(size * 0.02)
        draw.ellipse(
            [margin, margin, size - margin - 1, size - margin - 1],
            fill=BG_COLOR,
            outline=YANG_COLOR,
            width=max(1, size // 64),
        )

        # Taiji in center
        taiji_r = size * 0.25
        draw_taiji(draw, size / 2, size / 2, taiji_r)

        path = os.path.join(OUT_DIR, f"icon-{size}.png")
        img.save(path, "PNG")
        print(f"✅ {path}  ({size}x{size})")

    # Also create a favicon (48x48)
    favicon = Image.new("RGBA", (48, 48), BG_COLOR)
    draw_fav = ImageDraw.Draw(favicon)
    m = 2
    draw_fav.ellipse([m, m, 45, 45], fill=BG_COLOR, outline=YANG_COLOR, width=1)
    draw_taiji(draw_fav, 24, 24, 10)
    favicon_path = os.path.join(OUT_DIR, "favicon.png")
    favicon.save(favicon_path, "PNG")
    print(f"✅ {favicon_path}  (48x48)")

    # apple-touch-icon (180x180)
    apple = Image.new("RGBA", (180, 180), BG_COLOR)
    draw_apple = ImageDraw.Draw(apple)
    am = int(180 * 0.02)
    draw_apple.ellipse([am, am, 179 - am, 179 - am], fill=BG_COLOR, outline=YANG_COLOR, width=2)
    draw_taiji(draw_apple, 90, 90, 45)
    apple_path = os.path.join(OUT_DIR, "apple-touch-icon.png")
    apple.save(apple_path, "PNG")
    print(f"✅ {apple_path}  (180x180)")

    # SVG icon (for manifest as fallback)
    svg_path = os.path.join(OUT_DIR, "icon.svg")
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <clipPath id="c"><circle cx="256" cy="256" r="250"/></clipPath>
  </defs>
  <rect width="512" height="512" fill="#24282f" rx="256"/>
  <g clip-path="url(#c)">
    <circle cx="256" cy="256" r="128" fill="#f0f0f5"/>
    <path d="M256 128 A128 128 0 0 1 256 384 A64 64 0 0 1 256 256 A64 64 0 0 0 256 128Z" fill="#0a0a14"/>
    <circle cx="192" cy="224" r="16" fill="#0a0a14"/>
    <circle cx="320" cy="288" r="16" fill="#f0f0f5"/>
  </g>
</svg>'''
    with open(svg_path, "w") as f:
        f.write(svg_content)
    print(f"✅ {svg_path}  (SVG)")

if __name__ == "__main__":
    main()
