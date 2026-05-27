#!/usr/bin/env python3
"""Generate PWA icons for NORU app using only Python stdlib (struct, zlib)."""

import struct
import zlib
import os


def make_png(width, height, rgb):
    """Create a solid-color PNG with a white pixel-art 'N' centered."""
    r, g, b = rgb

    # Build raw image data row by row
    # Each row: filter byte (0 = None) + RGB pixels
    rows = []
    for y in range(height):
        row = bytearray()
        for x in range(width):
            row += bytes([r, g, b])
        rows.append(bytes([0]) + bytes(row))  # prepend filter byte

    # Draw white 'N' letter as pixel art on top
    # N glyph: 7 wide x 9 tall (scaled proportionally to icon size)
    # Scale factor so N is ~25% of icon width
    scale = max(1, width // 30)
    glyph_w = 7 * scale
    glyph_h = 9 * scale
    off_x = (width - glyph_w) // 2
    off_y = (height - glyph_h) // 2

    # 7-column pixel art for 'N' (9 rows)
    n_bitmap = [
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
    ]

    # Rebuild rows with the N glyph overlaid
    rows = []
    for y in range(height):
        row = bytearray([0])  # filter byte
        for x in range(width):
            # Check if this pixel is inside the glyph area
            gx = x - off_x
            gy = y - off_y
            if 0 <= gy < glyph_h and 0 <= gx < glyph_w:
                col = gx // scale
                row_idx = gy // scale
                if n_bitmap[row_idx][col] == 1:
                    row += bytes([255, 255, 255])  # white
                else:
                    row += bytes([r, g, b])
            else:
                row += bytes([r, g, b])
        rows.append(bytes(row))

    raw_data = b''.join(rows)
    compressed = zlib.compress(raw_data, 9)

    def chunk(name, data):
        c = name + data
        crc = zlib.crc32(c) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)

    png = b'\x89PNG\r\n\x1a\n'
    # IHDR: width, height, bit depth=8, color type=2 (RGB), compression=0, filter=0, interlace=0
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    png += chunk(b'IHDR', ihdr_data)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')
    return png


INDIGO = (79, 70, 229)  # #4F46E5

output_dir = '/Users/koizumishota0323/bar-exchange'

for size in (192, 512):
    path = os.path.join(output_dir, f'icon-{size}.png')
    data = make_png(size, size, INDIGO)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'Written {path} ({len(data)} bytes)')

print('Done.')
