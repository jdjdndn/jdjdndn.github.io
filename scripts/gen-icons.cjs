#!/usr/bin/env node
/**
 * 生成 PWA 图标（纯 Node.js，无外部依赖）
 * 生成 192x192 和 512x512 两张 PNG
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, pixels) {
  // PNG 文件结构：签名 + IHDR + IDAT + IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // 像素数据（每行前加 filter byte = 0）
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 3)] = 0; // no filter
    for (let x = 0; x < width; x++) {
      const si = (y * width + x) * 3;
      const di = y * (1 + width * 3) + 1 + x * 3;
      raw[di] = pixels[si];
      raw[di + 1] = pixels[si + 1];
      raw[di + 2] = pixels[si + 2];
    }
  }

  const compressed = zlib.deflateSync(raw);

  function chunk(type, data) {
    const buf = Buffer.alloc(4 + 4 + data.length + 4);
    buf.writeUInt32BE(data.length, 0);
    buf.write(type, 4);
    data.copy(buf, 8);
    const crc = crc32(Buffer.concat([Buffer.from(type), data]));
    buf.writeInt32BE(crc, 8 + data.length);
    return buf;
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// CRC32
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
  }
  return (c ^ 0xffffffff) | 0;
}

function generateIcon(size) {
  const pixels = Buffer.alloc(size * size * 3);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42; // 心形外接圆半径

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3;
      const dx = (x - cx) / r;
      const dy = (y - cy) / r;

      // 心形方程: (x^2 + y^2 - 1)^3 - x^2 * y^3 < 0
      const v = dx * dx + dy * dy - 1;
      const inside = v * v * v - dx * dx * dy * dy * dy < 0;

      if (inside) {
        // #FF6B35
        pixels[idx] = 255;
        pixels[idx + 1] = 107;
        pixels[idx + 2] = 53;
      } else {
        // 白色背景
        pixels[idx] = 255;
        pixels[idx + 1] = 255;
        pixels[idx + 2] = 255;
      }
    }
  }

  return createPNG(size, size, pixels);
}

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

[192, 512].forEach((size) => {
  const png = generateIcon(size);
  const file = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`✓ ${file} (${(png.length / 1024).toFixed(1)} KB)`);
});
