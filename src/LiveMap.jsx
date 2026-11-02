/* Real, finger-draggable map: MapLibre GL + OpenFreeMap vector tiles (OpenStreetMap data — free, no API key), with
   the "positron" style recoloured from the store's theme (tinted ground, buildings and major roads; natural green
   parks and blue water). The pin is not a map marker: it is the MapPin overlay fixed at the centre of
   the box, so dragging moves the streets under it and onMove reports the new centre when the map settles.
   MapLibre (~800 KB) is loaded on demand the first time a map is shown.
   Also: geocode() (search an area) and reverseGeocode() (centre → address) via OpenStreetMap Nominatim. */
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { THEME } from './theme.js';

export const BLR = [12.9116, 77.6474]; // HSR Layout, Bengaluru — default view
export const STORE_LL = [12.9352, 77.6245]; // the demo store (Koramangala)

const STYLE = 'https://tiles.openfreemap.org/styles/positron';
/* the store's theme over the positron layers (layer id → paint property → colour); parks / water stay natural */
const paintFor = t => ({
  background: { 'background-color': mix(t['--tint'], '#ffffff', .45) },
  landuse_residential: { 'fill-color': t['--soft'] },
  park: { 'fill-color': '#dff0dc' },
  landcover_wood: { 'fill-color': '#e2f1de' },
  water: { 'fill-color': '#d6e9f3' },
  waterway: { 'line-color': '#d6e9f3' },
  building: { 'fill-color': mix(t['--pk'], '#ffffff', .35), 'fill-outline-color': t['--pk'] },
  highway_minor: { 'line-color': '#ffffff' },
  highway_path: { 'line-color': t['--pk2'] },
  highway_major_casing: { 'line-color': t['--pk'] },
  highway_major_inner: { 'line-color': '#ffffff' },
  highway_major_subtle: { 'line-color': t['--pk'] },
  highway_motorway_casing: { 'line-color': t['--side'] },
  highway_motorway_inner: { 'line-color': mix(t['--side'], '#ffffff', .4) },
  highway_motorway_subtle: { 'line-color': t['--side'] },
  'highway-name-minor': { 'text-color': '#8a8080' },
  'highway-name-major': { 'text-color': mix(t['--r-deep'], '#888888', .4) },
  label_other: { 'text-color': '#9a9090' },
});
/* a + (b - a) * k, on hex colours */
function mix(a, b, k) {
  const p = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('');
}
const paint = m => {
  for (const [id, props] of Object.entries(paintFor(THEME))) {
    if (!m.getLayer(id)) continue;
    for (const [k, v] of Object.entries(props)) { try { m.setPaintProperty(id, k, v); } catch { /* property not on this layer */ } }
  }
};

export default function LiveMap({ center = BLR, zoom = 16, interactive = true, onMove, children }) {
  const box = useRef(null), map = useRef(null), cb = useRef(onMove), armed = useRef(false), want = useRef(center);
  cb.current = onMove; want.current = center;
  useEffect(() => {
    let m, ro, onTheme, dead = false;
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (dead) return;
      m = new maplibregl.Map({
        container: box.current, style: STYLE, center: [center[1], center[0]], zoom,
        interactive, dragRotate: false, pitchWithRotate: false, touchPitch: false,
        attributionControl: { compact: true },
      });
      if (interactive) { m.touchZoomRotate.disableRotation(); m.scrollZoom.setWheelZoomRate(1 / 300); }
      m.on('style.load', () => paint(m));
      onTheme = () => m.isStyleLoaded() && paint(m);
      window.addEventListener('buy-theme', onTheme);
      // report the centre only after the user dragged / zoomed or we flew somewhere (not for the first view)
      m.on('dragstart', () => { armed.current = true; });
      m.on('zoomstart', e => { if (e.originalEvent) armed.current = true; });
      m.on('moveend', () => { if (!armed.current) return; const c = m.getCenter(); cb.current && cb.current([c.lat, c.lng]); });
      map.current = m;
      // the box may still be sliding in with its screen: re-measure whenever its size settles / changes
      ro = new ResizeObserver(() => m.resize()); ro.observe(box.current);
      // a centre asked for while MapLibre was loading
      const [la, ln] = want.current; if (la !== center[0] || ln !== center[1]) { armed.current = true; m.jumpTo({ center: [ln, la] }); }
    });
    return () => { dead = true; ro && ro.disconnect(); onTheme && window.removeEventListener('buy-theme', onTheme); m && m.remove(); map.current = null; };
  }, []);
  // a new centre from outside (current location, a search) glides there
  useEffect(() => {
    const m = map.current; if (!m) return;
    const c = m.getCenter();
    if (Math.abs(c.lat - center[0]) > 1e-6 || Math.abs(c.lng - center[1]) > 1e-6) { armed.current = true; m.flyTo({ center: [center[1], center[0]], zoom: Math.max(m.getZoom(), 16), duration: 900 }); }
  }, [center[0], center[1]]);
  return <div className={'ba-lmap' + (interactive ? '' : ' static')}><div className="ba-lmap-tiles" ref={box} />{children}</div>;
}

const NOM = 'https://nominatim.openstreetmap.org';

/* centre → { road, area, pin, city, state } (fields left out when OSM has nothing for them) */
export async function reverseGeocode([lat, lng]) {
  const r = await fetch(`${NOM}/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`, { headers: { 'Accept-Language': 'en' } });
  if (!r.ok) throw new Error('reverse geocode failed');
  const a = (await r.json()).address || {};
  return {
    road: a.road || a.pedestrian || a.residential || '',
    area: a.suburb || a.neighbourhood || a.quarter || a.city_district || '',
    pin: (a.postcode || '').replace(/\D/g, '').slice(0, 6),
    city: a.city || a.town || a.county || a.state_district || '',
    state: a.state || '',
  };
}

/* "HSR Layout" → [lat, lng] of the best match in India, or null */
export async function geocode(q) {
  const r = await fetch(`${NOM}/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en' } });
  if (!r.ok) return null;
  const [hit] = await r.json();
  return hit ? [+hit.lat, +hit.lon] : null;
}

/* straight-line km between two points */
export const kmBetween = ([a, b], [c, d]) => {
  const R = 6371, dLat = (c - a) * Math.PI / 180, dLng = (d - b) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
