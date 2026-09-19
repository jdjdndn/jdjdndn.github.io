const { readFileSync } = require('fs');
const src = readFileSync('src/data.js', 'utf-8');

function extractBracketBlock(src, startIdx) {
  let depth = 0, inString = false, stringChar = '';
  for (let i = startIdx; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === stringChar && src[i - 1] !== '\\') inString = false;
    } else {
      if (ch === "'" || ch === '"') { inString = true; stringChar = ch; }
      else if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
    }
  }
  return src.slice(startIdx);
}

const tabIdPattern = /\bid:\s*['"]([^'"]+)['"]/g;
const tabStarts = [];
let m;
while ((m = tabIdPattern.exec(src)) !== null) {
  const lineStart = src.lastIndexOf('\n', m.index) + 1;
  const line = src.slice(lineStart, src.indexOf('\n', m.index)).trim();
  if (line.startsWith('//')) continue;
  const lastSelfData = src.lastIndexOf('export const selfData', m.index);
  const lastTabs = src.lastIndexOf('export const tabs', m.index);
  if (lastSelfData < 0 && lastTabs < 0) continue;
  tabStarts.push({ id: m[1], pos: m.index });
}

const tabs = [];
for (let i = 0; i < tabStarts.length; i++) {
  const tabId = tabStarts[i].id;
  const start = tabStarts[i].pos;
  const end = i + 1 < tabStarts.length ? tabStarts[i + 1].pos : src.length;
  const tabBody = src.slice(start, end);
  const labelMatch = tabBody.match(/label:\s*['"]([^'"]+)['"]/);
  const tabLabel = labelMatch ? labelMatch[1] : tabId;
  const sections = [];
  const secArrStart = tabBody.indexOf('sections:');
  if (secArrStart === -1) continue;
  const bracketStart = tabBody.indexOf('[', secArrStart);
  if (bracketStart === -1) continue;
  const sectionsBody = extractBracketBlock(tabBody, bracketStart);
  const secParts = sectionsBody.split(/\{\s*title:/);
  for (let j = 1; j < secParts.length; j++) {
    const part = secParts[j];
    const titleMatch = part.match(/^\s*['"]([^'"]+)['"]/);
    if (!titleMatch) continue;
    const secTitle = titleMatch[1];
    const itemArrStart = part.indexOf('items:');
    if (itemArrStart === -1) continue;
    const itemBracketStart = part.indexOf('[', itemArrStart);
    if (itemBracketStart === -1) continue;
    const itemsBody = extractBracketBlock(part, itemBracketStart);
    const items = [];
    const itemPattern = /\{\s*name:\s*['"]([^'"]+)['"]/g;
    let itemMatch;
    while ((itemMatch = itemPattern.exec(itemsBody)) !== null) {
      const rest = itemsBody.slice(itemMatch.index, itemMatch.index + 500);
      const dlMatch = rest.match(/deadline:\s*['"]([^'"]+)['"]/);
      items.push({ name: itemMatch[1], deadline: dlMatch ? dlMatch[1] : null });
    }
    if (items.length > 0) sections.push({ title: secTitle, items });
  }
  if (sections.length > 0) tabs.push({ id: tabId, label: tabLabel, sections });
}

tabs.forEach(t => {
  const totalItems = t.sections.reduce((s, sec) => s + sec.items.length, 0);
  console.log(t.id + ': ' + t.label + ' (' + t.sections.length + ' sections, ' + totalItems + ' items)');
});
