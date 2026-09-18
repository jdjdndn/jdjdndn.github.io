#!/usr/bin/env node
/**
 * 生成 OG 分享图 PNG（纯 Node.js，无外部依赖）
 * 生成 1200x630 的 PNG，用于社交平台分享（Facebook/Twitter/微信等不支持 SVG）
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1200, H = 630;

// ========== PNG 基础设施 ==========
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
  }
  return (c ^ 0xffffffff) | 0;
}

function pngChunk(type, data) {
  const buf = Buffer.alloc(4 + 4 + data.length + 4);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  buf.writeInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 8 + data.length);
  return buf;
}

function createPNG(pixels) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const raw = Buffer.alloc(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    pixels.copy(raw, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
  }
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ========== 像素绘制 ==========
const px = Buffer.alloc(W * H * 3);

function setPixel(x, y, r, g, b) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + Math.floor(x)) * 3;
  px[i] = r; px[i + 1] = g; px[i + 2] = b;
}

function fillRect(x0, y0, w, h, r, g, b) {
  for (let y = y0; y < y0 + h && y < H; y++)
    for (let x = x0; x < x0 + w && x < W; x++) setPixel(x, y, r, g, b);
}

function fillCircle(cx, cy, radius, r, g, b) {
  for (let y = cy - radius; y <= cy + radius; y++)
    for (let x = cx - radius; x <= cx + radius; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) setPixel(x, y, r, g, b);
}

// ========== 渐变背景 ==========
for (let y = 0; y < H; y++) {
  const t = y / H;
  const r = Math.round(255 * (1 - t) + 229 * t);
  const g = Math.round(107 * (1 - t) + 90 * t);
  const b = Math.round(53 * (1 - t) + 43 * t);
  for (let x = 0; x < W; x++) setPixel(x, y, r, g, b);
}

// ========== 3x5 位图字体 ==========
const FONT = {
  'A':[7,14,21,14,14],'B':[7,14,7,14,7],'C':[7,14,16,14,7],'D':[7,14,21,14,7],
  'E':[31,16,6,16,31],'F':[31,16,6,2,2],'G':[7,14,19,15,7],'H':[17,17,31,17,17],
  'I':[14,4,4,4,14],'J':[1,1,1,17,7],'K':[17,18,12,18,17],'L':[16,16,16,16,31],
  'M':[17,27,21,17,17],'N':[17,25,21,19,17],'O':[7,17,17,17,7],'P':[7,17,7,2,2],
  'Q':[7,17,21,19,31],'R':[7,17,7,18,17],'S':[7,16,7,1,14],'T':[31,4,4,4,4],
  'U':[17,17,17,17,7],'V':[17,17,17,10,4],'W':[17,17,21,27,17],'X':[17,10,4,10,17],
  'Y':[17,10,4,4,4],'Z':[31,2,4,8,31],
  '0':[7,17,17,17,7],'1':[2,6,2,2,7],'2':[7,16,7,1,14],'3':[7,16,7,16,7],
  '4':[17,17,31,1,1],'5':[31,1,7,16,7],'6':[7,1,7,16,7],'7':[31,16,4,4,4],
  '8':[7,17,7,17,7],'9':[7,17,7,16,7],
  '.':[0,0,0,0,2],',':[0,0,0,2,4],':':[0,2,0,2,0],'/':[1,2,4,8,16],
  '-':[0,0,14,0,0],' ':[0,0,0,0,0],
};

function drawChar(ch, x, y, scale, r, g, b) {
  const rows = FONT[ch];
  if (!rows) return 4 * scale;
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 7; col++)
      if (rows[row] & (1 << (6 - col)))
        fillRect(x + col * scale, y + row * scale, scale, scale, r, g, b);
  return 8 * scale;
}

function drawText(text, centerX, y, scale, r, g, b) {
  const charW = 8 * scale;
  const totalW = text.length * charW;
  let x = centerX - totalW / 2;
  for (const ch of text) { drawChar(ch, x, y, scale, r, g, b); x += charW; }
}

// ========== 绘制内容 ==========
// 标题
drawText('优惠活动聚合', W / 2, 200, 3, 255, 255, 255);
// 副标题
drawText('COUPON HUB', W / 2, 310, 2, 255, 255, 255);
// 装饰线
fillRect(W / 2 - 150, 380, 300, 3, 255, 255, 255);
// 域名
drawText('jdjdndn.github.io', W / 2, 440, 2, 200, 200, 200);
// 底部装饰圆点
fillCircle(W / 2 - 60, 540, 4, 255, 255, 255);
fillCircle(W / 2, 540, 4, 255, 255, 255);
fillCircle(W / 2 + 60, 540, 4, 255, 255, 255);

// ========== 输出 ==========
const outDir = path.join(__dirname, '..', 'public');
const outFile = path.join(outDir, 'og-image.png');

// 脚本内容未变则跳过生成
try {
  const outStat = fs.statSync(outFile);
  const srcStat = fs.statSync(__filename);
  if (outStat.mtimeMs > srcStat.mtimeMs) {
    console.log(`✓ og-image.png (cached)`);
    process.exit(0);
  }
} catch {}

fs.mkdirSync(outDir, { recursive: true });
const png = createPNG(px);
fs.writeFileSync(outFile, png);
console.log(`✓ ${outFile} (${(png.length / 1024).toFixed(1)} KB)`);
