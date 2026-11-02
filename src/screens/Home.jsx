/* BUY · HOME — Figma 2167:7001 (home with categories + new cart pill)
   Scroll behaviour (inside the .ba-scr scroller):
   - .bh-top (store bar) sits over the banner and scrolls away with it.
   - .bh-stick (delivery bar, Figma 2170:7403, + category tabs) pins to the top; once pinned the category photos fold
     away and the tabs show their names only.
   - Search: at the top of the page it is the full search bar under the delivery row; once the block pins it morphs
     (slides + shrinks) into the round search button beside "Deliver to" while the gap it leaves folds away, and
     expands back when the page returns to the top. Either form opens the separate search screen.
   Category tabs work like Blinkit / Zepto: an outlined tab slides to the selected category and opens into the
   line under the row; the product grid slides in from the side you moved towards (swipe the grid to switch too). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { STORE, CATEGORIES, V2, sortedProducts } from '../data.js';
import { ICO, Ctl, PriceBox, VariantChips } from '../ui.jsx';

const H = V2 + 'home/', Q = V2 + 'search/';

export function Card({ p }) {
  const { A } = useBuy();
  return (
    <div className="bh-card">
      <div className="bh-card-img" onClick={() => A.quick(p.id)}><img src={p.img[0]} alt={p.name} loading="lazy" data-fly={p.id} /></div>
      <span className="bh-card-ctl"><Ctl pid={p.id} /></span>
      <VariantChips p={p} />
      <p className="bh-card-name" onClick={() => A.product(p.id)}>{p.name}</p>
      <div className="bh-card-pr" onClick={() => A.product(p.id)}><PriceBox price={p.price} mrp={p.mrp} /></div>
    </div>
  );
}

/* One SVG path draws the row line and the selected tab's outline (line → foot curve → up the side → rounded top →
   down → foot curve → line), so the stroke is the same everywhere and nothing has to be masked out under the tab.
   The tab slides by tweening its x / width; the tint behind it (.bh-cat-ind) follows the same values. */
const FT = 10, RAD = 16, TOP = 2;
const tabPath = (x, w, W, H) => {
  const y = H - 0.5, L = x + 0.5, R = x + w - 0.5, t = TOP + 0.5;
  return `M0 ${y}H${L - FT}A${FT} ${FT} 0 0 0 ${L} ${y - FT}V${t + RAD}A${RAD} ${RAD} 0 0 1 ${L + RAD} ${t}H${R - RAD}A${RAD} ${RAD} 0 0 1 ${R} ${t + RAD}V${y - FT}A${FT} ${FT} 0 0 0 ${R + FT} ${y}H${W}`;
};
const ease = t => 1 - Math.pow(1 - t, 4);

function CatTabs() {
  const { S, A } = useBuy();
  const row = useRef(null), inner = useRef(null), cur = useRef(null), raf = useRef(0);
  const [ind, setInd] = useState(null);
  const [box, setBox] = useState({ W: 0, H: 0 });
  const target = () => {
    const b = row.current?.querySelector(`[data-cat="${S.cat}"]`);
    return b ? { x: b.offsetLeft - 6, w: b.offsetWidth + 12 } : null;
  };
  const place = (animate = true) => {
    const r = row.current, to = target(); if (!r || !to) return;
    cancelAnimationFrame(raf.current);
    const from = cur.current;
    if (!animate || !from) { cur.current = to; setInd(to); }
    else {
      const t0 = performance.now();
      const step = now => {
        const k = ease(Math.min(1, (now - t0) / 420));
        cur.current = { x: from.x + (to.x - from.x) * k, w: from.w + (to.w - from.w) * k };
        setInd(cur.current);
        if (k < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }
    // keep the selected tab comfortably in view
    const b = r.querySelector(`[data-cat="${S.cat}"]`);
    r.scrollTo({ left: Math.max(0, b.offsetLeft - (r.clientWidth - b.offsetWidth) / 2), behavior: animate ? 'smooth' : 'auto' });
  };
  useLayoutEffect(() => { place(ind !== null); }, [S.cat]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  // the row's size changes on resize and when the photos fold away while the header is pinned
  useEffect(() => {
    const el = inner.current; if (!el) return;
    const ro = new ResizeObserver(() => { setBox({ W: el.offsetWidth, H: el.offsetHeight }); const to = target(); if (to) { cur.current = to; setInd(to); } });
    ro.observe(el);
    return () => ro.disconnect();
  }, [S.cat]);
  return (
    <div className="bh-cats" ref={row} role="tablist" aria-label="Categories">
      <div className="bh-cats-in" ref={inner}>
        {ind && <span className="bh-cat-ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} aria-hidden="true" />}
        {ind && box.W ? <svg className="bh-cat-line" width={box.W} height={box.H} aria-hidden="true"><path d={tabPath(ind.x, ind.w, box.W, box.H)} /></svg> : null}
        {CATEGORIES.map(c => (
          <button key={c.id} data-cat={c.id} role="tab" aria-selected={S.cat === c.id} className={'bh-cat' + (S.cat === c.id ? ' on' : '')} onClick={() => A.setcat(c.id)}>
            <span className="bh-cat-im">{c.img ? <img src={c.img} alt="" draggable="false" /> : <i className="bh-cat-ic" style={{ WebkitMaskImage: `url("${c.icon}")`, maskImage: `url("${c.icon}")` }} />}</span>
            <span>{c.label.map((l, i) => <span key={i}>{l}</span>)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home({ scRef }) {
  const { S, A } = useBuy();
  const top = useRef(null), stick = useRef(null), gridWrap = useRef(null);
  const [pinned, setPinned] = useState(false);
  const a = S.addr;
  const list = sortedProducts(S);
  const idx = CATEGORIES.findIndex(c => c.id === S.cat), prevIdx = CATEGORIES.findIndex(c => c.id === S.prevCat);
  const dir = S.prevCat == null ? '' : idx > prevIdx ? 'from-r' : 'from-l';

  useEffect(() => {
    const el = scRef.current; if (!el) return;
    const sync = () => {
      // pinned once it reaches its sticky offset (the safe-area inset)
      setPinned(stick.current.getBoundingClientRect().top - el.getBoundingClientRect().top <= parseFloat(getComputedStyle(stick.current).top) + 1);
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    return () => el.removeEventListener('scroll', sync);
  }, []);

  /* store bar intro: only the logo shows and spins, then the name / address and the three buttons fly out of it;
     the name then stays open (tap the pill for store details). Replays whenever the
     shop-type picker closes (first open and every shop switch). */
  const [intro, setIntro] = useState('i0');
  useEffect(() => {
    if (S.picker) { setIntro('i0'); return; }
    const t1 = setTimeout(() => setIntro('i1'), 380);
    return () => clearTimeout(t1);
  }, [S.picker, S.shop]);

  // banner auto-advance
  useEffect(() => {
    const t = setInterval(() => { S.heroI = (S.heroI + 1) % STORE.banners.length; A.commit(); }, 3600);
    return () => clearInterval(t);
  }, []);

  // switching category: if the grid is scrolled past, bring its top back right under the sticky header
  useEffect(() => {
    if (S.prevCat == null) return;
    const el = scRef.current, w = gridWrap.current.previousElementSibling; // the "N Products" row
    const stickBottom = stick.current.offsetHeight;
    const gridTop = w.getBoundingClientRect().top - el.getBoundingClientRect().top - 16;
    if (gridTop < stickBottom) el.scrollTo({ top: el.scrollTop + gridTop - stickBottom, behavior: 'smooth' });
  }, [S.cat]);

  // horizontal swipe on the grid moves to the neighbouring category
  const touch = useRef(null);
  const onTouchStart = e => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = e => {
    if (!touch.current) return;
    const t = e.changedTouches[0], dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    const n = idx + (dx < 0 ? 1 : -1);
    if (n >= 0 && n < CATEGORIES.length) A.setcat(CATEGORIES[n].id);
  };

  return (
    <div className="bh">
      <div ref={top} className={'bh-top ' + intro}>
        <button className="bh-store" onClick={A.store} aria-label={`${STORE.name} store details`}>
          <img className="bh-logo" src={STORE.logo} alt="" />
          <span className="bh-store-t"><b><span>{STORE.name}</span>{ICO.verified()}</b></span>
        </button>
        <span className="bh-btns">
          <button className="ba-rbtn navy" onClick={A.m17} aria-label="Modulus Seventeen">{ICO.m17()}</button>
          <button className="ba-rbtn" onClick={A.share} aria-label="Share store">{ICO.share()}</button>
          <button className="ba-rbtn" onClick={A.more} aria-label="More options">{ICO.more()}</button>
        </span>
      </div>
      <div className="bh-hero">
        <div className="bh-hero-track" style={{ transform: `translateX(${-S.heroI * 100}%)` }}>{STORE.banners.map(b => <img key={b} src={b} alt="" />)}</div>
        <div className="bh-dots" aria-hidden="true">{STORE.banners.map((b, i) => <i key={b} className={i === S.heroI ? 'on' : ''} />)}</div>
      </div>
      <div ref={stick} className={'bh-stick' + (pinned ? ' pinned' : '')}>
        <div className="bh-deliver">
          <button className="bh-addr" onClick={A.address}>
            <span className="bh-loc"><img src={Q + 'ic-locate.svg'} width="20" height="20" alt="" /></span>
            <span className="bh-addr-t"><small>Deliver to</small><span><b>{a ? `${a.area}, ${a.city} - ${a.pin}` : 'Add your delivery address'}</b><i className="bh-chev"><img src={Q + 'ic-chev.svg'} alt="" /></i></span></span>
          </button>
        </div>
        <button className="bh-sbar" onClick={A.opensearch} aria-label="Search products">
          <img src={Q + 'ic-search.svg'} width="16" height="16" alt="" /><span>Search for products, categories...</span>
        </button>
        <i className="bh-sgap" aria-hidden="true" />
        <CatTabs />
      </div>
      <div className="bh-count"><b>{list.length} Products</b><button onClick={A.sort}><img src={H + 'ic-sort.svg'} width="18" height="18" alt="" />Sort By</button></div>
      <div ref={gridWrap} className="bh-gridwrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div key={S.cat} className={'bh-grid ' + dir}>
          {list.length ? list.map(p => <Card key={p.id} p={p} />) : <p className="bh-empty">No products in this category yet.</p>}
        </div>
      </div>
    </div>
  );
}
