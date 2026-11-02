/* Store colour theme.
   A shopkeeper can brand their BUY store with any colour. From that one colour we build a full ladder of shades and
   map each rung to a design token, so every button, chip, gradient, border, illustration and icon keeps the BUY
   look in the new colour:

     --r        primary: buttons, prices in red, selected states, icons. Always dark enough for white text on it
                (WCAG AA 4.5:1) — a light pick (yellow, mint, sky) is pushed down the ladder to a deeper shade.
     --r2       one step lighter than --r (secondary fills)          --rd     two steps darker (pressed / deep text)
     --r-deep   dark, slightly muted (shadows inside illustrations)
     --side     ~76% lightness: shaded faces in illustrations        --blush  ~72%: cheeks, accents
     --pk       ~86%: light fills and borders                         --tint2  ~88%: banner / hero wash
     --pk2      ~94%: soft chip / pill backgrounds                    --tint   ~95%: header gradient top
     --soft     ~96%: pressed / hover backgrounds                     --pk3    primary at 10% alpha
   (+ --r-rgb / --tint-rgb / --tint2-rgb triples for rgba()).

   The default BUY red keeps its exact hand-picked Figma values. Swatches are generated at BUY red's own saturation
   and lightness, so every suggestion sits at the same visual weight. SVG <img> icons drawn in BUY red are recoloured
   on the fly (their file is fetched once, the brand hexes swapped, and the img pointed at the result). */

export const DEFAULT_HEX = '#a52226';

const DEFAULT = {
  '--r': '#a52226', '--r2': '#c23a3e', '--rd': '#6f1418', '--r-deep': '#8f3a3d',
  '--side': '#e9a9ab', '--blush': '#f2a0a4', '--pk': '#f4c8c9', '--tint2': '#f5cccd',
  '--pk2': '#fbeaea', '--tint': '#f9e7e8', '--soft': '#fbf3f3',
};

/* ---------- colour maths ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const hexToRgb = h => { const n = parseInt(h.replace('#', '').padEnd(6, '0').slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
export function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l * 100];
  const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s * 100, l * 100];
}
export function hsl(h, s, l) {
  s = clamp(s, 0, 100) / 100; l = clamp(l, 0, 100) / 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}
const lum = hex => { const c = hexToRgb(hex).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };

/* the full ladder for any colour (also what the picker shows as the shade strip) */
export function ladder(hex) {
  const [h, s0] = rgbToHsl(hexToRgb(hex));
  const s = s0 < 8 ? s0 : clamp(s0, 30, 85); // greys stay grey; washed-out picks get enough colour to read as a brand
  const tintS = Math.min(s, 75);
  return [96, 92, 86, 76, 64, 52, 44, 37, 28, 20].map((l, i) => hsl(h, i < 4 ? tintS : s, l));
}

/* tokens for a colour */
export function buildTheme(hex) {
  hex = hex.toLowerCase();
  if (hex === DEFAULT_HEX) return { ...DEFAULT };
  const [h, s0, l0] = rgbToHsl(hexToRgb(hex));
  const s = s0 < 8 ? s0 : clamp(s0, 30, 85), tintS = Math.min(s, 75);
  // primary: the picked colour if it carries white text, otherwise the nearest deeper shade that does
  let l = clamp(l0, 22, 46);
  while (l > 18 && contrast(hsl(h, s, l), '#ffffff') < 4.6) l -= 1;
  return {
    '--r': hsl(h, s, l), '--r2': hsl(h, s, Math.min(l + 9, 54)), '--rd': hsl(h, s, Math.max(l - 15, 12)), '--r-deep': hsl(h, s * .6, Math.max(l - 6, 16)),
    '--side': hsl(h, tintS, 76), '--blush': hsl(h, tintS + 10, 79), '--pk': hsl(h, tintS, 87), '--tint2': hsl(h, tintS, 88),
    '--pk2': hsl(h, tintS, 95), '--tint': hsl(h, tintS, 94.5), '--soft': hsl(h, tintS * .8, 97),
  };
}

/* suggestions: BUY red's own saturation / lightness, spread round the colour wheel (+ a deep slate) */
const [, BS, BL] = rgbToHsl(hexToRgb(DEFAULT_HEX));
export const SWATCHES = [
  ['Tangerine', hsl(18, BS, BL + 2)], ['Amber', hsl(34, BS, BL + 2)], ['Olive', hsl(62, BS * .7, BL - 2)],
  ['Forest', hsl(138, BS * .75, BL - 6)], ['Emerald', hsl(158, BS * .85, BL - 6)], ['Teal', hsl(184, BS * .85, BL - 6)],
  ['Ocean', hsl(204, BS, BL)], ['Royal', hsl(224, BS, BL + 2)], ['Indigo', hsl(248, BS * .8, BL + 4)],
  ['Violet', hsl(270, BS * .8, BL + 2)], ['Plum', hsl(294, BS * .7, BL)], ['Magenta', hsl(322, BS, BL)],
  ['Rose', hsl(342, BS, BL + 4)], ['Slate', hsl(215, 22, BL - 4)],
];

/* ---------- apply ---------- */
export let THEME = { hex: DEFAULT_HEX, ...DEFAULT };
const rgbStr = hex => hexToRgb(hex).join(', ');

export function applyTheme(hex) {
  const t = buildTheme(hex);
  THEME = { hex: hex.toLowerCase(), ...t };
  const st = document.documentElement.style;
  for (const [k, v] of Object.entries(t)) st.setProperty(k, v);
  st.setProperty('--r-rgb', rgbStr(t['--r']));
  st.setProperty('--tint-rgb', rgbStr(t['--tint']));
  st.setProperty('--tint2-rgb', rgbStr(t['--tint2']));
  st.setProperty('--pk3', `rgba(${rgbStr(t['--r'])}, .1)`);
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', t['--tint']);
  recolorAll();
  window.dispatchEvent(new CustomEvent('buy-theme', { detail: THEME }));
}

/* ---------- SVG <img> icons drawn in BUY colours ---------- */
const ICON_MAP = () => ({
  '#a52226': THEME['--r'], '#6f1418': THEME['--rd'], '#c23a3e': THEME['--r2'], '#f4c8c9': THEME['--pk'],
  '#fbeaea': THEME['--pk2'], '#f9e7e8': THEME['--tint'], '#f5cccd': THEME['--tint2'], '#e9a9ab': THEME['--side'], '#f2a0a4': THEME['--blush'],
});
const files = new Map(); // svg url → text (or null when it has no brand colours)
const made = new Map(); // `${theme}|${url}` → data url
const brandRe = /#(a52226|6f1418|c23a3e|f4c8c9|fbeaea|f9e7e8|f5cccd|e9a9ab|f2a0a4)\b/gi;

async function recolor(img) {
  const orig = img.dataset.osrc || img.getAttribute('src');
  if (!orig || !/\.svg(\?|$)/i.test(orig) || orig.startsWith('data:')) return;
  if (THEME.hex === DEFAULT_HEX) { if (img.dataset.osrc) { img.setAttribute('src', orig); delete img.dataset.osrc; } return; }
  const key = THEME.hex + '|' + orig;
  if (made.has(key)) { img.dataset.osrc = orig; if (img.getAttribute('src') !== made.get(key)) img.setAttribute('src', made.get(key)); return; }
  if (!files.has(orig)) {
    files.set(orig, fetch(orig).then(r => r.text()).then(t => (t.match(brandRe) ? t : null)).catch(() => null));
  }
  const text = await files.get(orig);
  if (!text) return;
  const map = ICON_MAP();
  const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(text.replace(brandRe, m => map[m.toLowerCase()] || m));
  made.set(key, url);
  if ((img.dataset.osrc || img.getAttribute('src')) !== orig && img.getAttribute('src') !== made.get(key)) return; // src changed meanwhile
  img.dataset.osrc = orig; img.setAttribute('src', url);
}
function recolorAll() { document.querySelectorAll('img').forEach(recolor); }

let watching = false;
export function watchIcons() {
  if (watching) return; watching = true;
  new MutationObserver(list => {
    if (THEME.hex === DEFAULT_HEX) return;
    for (const m of list) {
      if (m.type === 'attributes') { const img = m.target; if (img.tagName === 'IMG' && !img.getAttribute('src')?.startsWith('data:')) { delete img.dataset.osrc; recolor(img); } continue; }
      m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') recolor(n); else n.querySelectorAll?.('img').forEach(recolor); });
    }
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
}
