/* BUY · HOME — Figma 2167:7001 (home with categories + new cart pill)
   Scroll behaviour (inside the .ba-scr scroller):
   - .bh-top (store bar) is sticky over the banner; turns solid white once the banner has scrolled behind it.
   - .bh-stick (search + category tabs) pins right below the store bar; .pinned adds a soft shadow.
   Category tabs work like Blinkit / Zepto: an outlined tab slides to the selected category and opens into the
   line under the row; the product grid slides in from the side you moved towards (swipe the grid to switch too). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { STORE, CATEGORIES, V2, sortedProducts, cardTag } from '../data.js';
import { ICO, Ctl, PriceBox } from '../ui.jsx';

const H = V2 + 'home/';

function Card({ p }) {
  const { A } = useBuy();
  return (
    <div className="bh-card">
      <div className="bh-card-img" onClick={() => A.quick(p.id)}><img src={p.img[0]} alt={p.name} loading="lazy" /></div>
      <span className="bh-card-ctl"><Ctl pid={p.id} /></span>
      <div className="bx-tagrow"><span className="ba-tag">{cardTag(p)}</span><span className="bx-rate">{ICO.star()}{p.rating}</span></div>
      <p className="bh-card-name" onClick={() => A.product(p.id)}>{p.name}</p>
      <div className="bh-card-pr" onClick={() => A.product(p.id)}><PriceBox price={p.price} mrp={p.mrp} /></div>
    </div>
  );
}

function CatTabs() {
  const { S, A } = useBuy();
  const row = useRef(null);
  const [ind, setInd] = useState(null);
  const place = (animate = true) => {
    const r = row.current; if (!r) return;
    const b = r.querySelector(`[data-cat="${S.cat}"]`); if (!b) return;
    setInd({ x: b.offsetLeft - 6, w: b.offsetWidth + 12, animate });
    // keep the selected tab comfortably in view
    const target = b.offsetLeft - (r.clientWidth - b.offsetWidth) / 2;
    r.scrollTo({ left: Math.max(0, target), behavior: animate ? 'smooth' : 'auto' });
  };
  useLayoutEffect(() => { place(ind !== null); }, [S.cat]);
  useEffect(() => { const f = () => place(false); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, [S.cat]);
  return (
    <div className="bh-cats" ref={row} role="tablist" aria-label="Categories">
      <div className="bh-cats-in">
        {ind && <span className={'bh-cat-ind' + (ind.animate ? ' anim' : '')} style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} aria-hidden="true" />}
        {CATEGORIES.map(c => (
          <button key={c.id} data-cat={c.id} role="tab" aria-selected={S.cat === c.id} className={'bh-cat' + (S.cat === c.id ? ' on' : '')} onClick={() => A.setcat(c.id)}>
            <i className="bh-cat-ic" style={{ WebkitMaskImage: `url(${c.icon})`, maskImage: `url(${c.icon})` }} />
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
  const [solid, setSolid] = useState(false), [pinned, setPinned] = useState(false);
  const a = S.addr;
  const list = sortedProducts(S);
  const idx = CATEGORIES.findIndex(c => c.id === S.cat), prevIdx = CATEGORIES.findIndex(c => c.id === S.prevCat);
  const dir = S.prevCat == null ? '' : idx > prevIdx ? 'from-r' : 'from-l';

  useEffect(() => {
    const el = scRef.current; if (!el) return;
    const sync = () => {
      const y = el.scrollTop;
      const barH = top.current.offsetHeight;
      setSolid(y >= 196 - barH - 2);
      setPinned(stick.current.getBoundingClientRect().top - el.getBoundingClientRect().top <= barH + 1);
    };
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    return () => el.removeEventListener('scroll', sync);
  }, []);

  // banner auto-advance
  useEffect(() => {
    const t = setInterval(() => { S.heroI = (S.heroI + 1) % STORE.banners.length; A.commit(); }, 3600);
    return () => clearInterval(t);
  }, []);

  // switching category: if the grid is scrolled past, bring its top back right under the sticky header
  useEffect(() => {
    if (S.prevCat == null) return;
    const el = scRef.current, w = gridWrap.current.previousElementSibling; // the "N Products" row
    const stickBottom = top.current.offsetHeight + stick.current.offsetHeight;
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
      <div ref={top} className={'bh-top' + (solid ? ' solid' : '')}>
        <button className="bh-store" onClick={A.store}>
          <img className="bh-logo" src={STORE.logo} alt="" />
          <span className="bh-store-t"><b>{STORE.name} {ICO.verified()}</b><small>{STORE.area}</small></span>
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
      <div className="bh-deliver">
        <button className="bh-addr" onClick={A.address}>
          <span className="bh-loc"><img src={H + 'ic-locate.svg'} width="14" height="14" alt="" /></span>
          <span className="bh-addr-t"><small>Deliver to</small><span><b>{a ? `${a.area}, ${a.city} - ${a.pin}` : 'Add your delivery address'}</b><i className="bh-chev"><img src={H + 'ic-chev.svg'} alt="" /></i></span></span>
        </button>
        <span className="bh-days">{ICO.scooterG()}{STORE.delivery}</span>
      </div>
      <div ref={stick} className={'bh-stick' + (pinned ? ' pinned' : '')}>
        <label className="ba-search bh-search">{ICO.search()}<input type="search" placeholder="Search for products, categories..." value={S.search} onChange={e => A.search(e.target.value)} aria-label="Search products" /></label>
        <CatTabs />
      </div>
      <div className="bh-count"><b>{list.length} Products</b><button onClick={A.sort}><img src={H + 'ic-sort.svg'} width="18" height="18" alt="" />Sort By</button></div>
      <div ref={gridWrap} className="bh-gridwrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div key={S.cat} className={'bh-grid ' + dir}>
          {list.length ? list.map(p => <Card key={p.id} p={p} />) : <p className="bh-empty">No products match “{S.search}”.</p>}
        </div>
      </div>
    </div>
  );
}
