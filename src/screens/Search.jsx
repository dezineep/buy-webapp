/* BUY · SEARCH — Figma 2170:7430. Opened from the search button in the home delivery bar.
   - Header: white back button + search field (clear ✕ once something is typed); the field focuses on open so the
     phone keyboard comes up, and the cart pill floats above it.
   - No query yet: "Suggested for you" — best-rated products in the same row style as results.
   - Results: "N Products Found" + Sort By, rows split by the dashed divider; matched words are highlighted.
   - Nothing found: an animated illustration in the BUY style (black outlines, hard offset shadows, brand red + pink).
   Styles: styles/search.css (.bq-*) */
import { Fragment, useLayoutEffect, useRef } from 'react';
import { useBuy } from '../engine.jsx';
import { V2, CATEGORIES, searchProducts, searchTokens, catLabel, qtyInCart } from '../data.js';
import { PriceRow, ICO, VariantChips } from '../ui.jsx';

const Q = V2 + 'search/';

/* white + button / outlined stepper (Figma 2170:7482) */
function RowCtl({ pid }) {
  const { S, A } = useBuy();
  const n = qtyInCart(S.cart, pid);
  if (!n) return <button className="ba-oplus" onClick={() => A.add(pid)} aria-label="Add to cart"><img src={Q + 'ic-plus-red.svg'} width="20" height="20" alt="" /></button>;
  return (
    <span className="ba-ostep">
      <button onClick={() => A.pdec(pid)} aria-label="Remove one">{ICO.minus()}</button>
      <b>{n}</b>
      <button onClick={() => A.pinc(pid)} aria-label="Add one">{ICO.plus()}</button>
    </span>
  );
}

/* highlight the start of every name word that a query word matched (same word-start rule as searchProducts) */
function Hl({ text, q }) {
  const words = searchTokens(q);
  if (!words.length) return text;
  return text.split(/([\s-]+)/).map((w, i) => {
    const bare = w.toLowerCase().replace(/['’`]/g, '');
    const hit = words.filter(x => bare.startsWith(x)).sort((a, b) => b.length - a.length)[0];
    if (!hit) return <Fragment key={i}>{w}</Fragment>;
    // cover `hit.length` letters of the original word, skipping apostrophes
    let n = 0, k = 0;
    while (k < w.length && n < hit.length) { if (!/['’`]/.test(w[k])) n++; k++; }
    return <Fragment key={i}><mark>{w.slice(0, k)}</mark>{w.slice(k)}</Fragment>;
  });
}

function Row({ p, q, i }) {
  const { A } = useBuy();
  const off = Math.round((1 - p.price / p.mrp) * 100);
  return (
    <div className="bq-row" style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
      <img className="bq-img" src={p.img[0]} alt="" loading="lazy" onClick={() => A.quick(p.id)} />
      <button className="bq-info" onClick={() => A.product(p.id)}>
        <span className="bq-tags"><span className="ba-tag">{catLabel(p)}</span></span>
        <VariantChips p={p} max={3} rows={1} />
        <span className="bq-name"><Hl text={p.name} q={q} /></span>
        <span className="bq-pr"><PriceRow price={p.price} mrp={p.mrp} /><span className="ba-off">{off}% OFF</span></span>
      </button>
      <span className="bq-ctl"><RowCtl pid={p.id} /></span>
    </div>
  );
}

/* "nothing found": a shopping bag with an empty, wobbling hanger peeking out while a magnifier sweeps across it */
function NoResults({ q }) {
  const { A } = useBuy();
  return (
    <div className="bq-none">
      <svg className="bq-ill" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
        <ellipse className="bq-floor" cx="104" cy="156" rx="64" ry="7" />
        <g className="bq-sparks">
          <path d="M30 52v12M24 58h12" /><path d="M186 34v10M181 39h10" /><circle cx="176" cy="96" r="3.5" /><circle cx="40" cy="104" r="2.5" />
        </g>
        <g className="bq-bag">
          {/* hard offset shadow, then the bag */}
          <path d="M57 64h96l8 84H49Z" transform="translate(4 5)" fill="#000" />
          <path d="M57 64h96l8 84H49Z" fill="#f4c8c9" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M57 64h96l2 16H55Z" fill="#a52226" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <g className="bq-hanger">
            <path d="M99 37a6 6 0 1 1 6 6v7" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M105 50 80 64M105 50l25 14" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <path d="M92 118c6-8 20-8 26 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <circle className="bq-eye" cx="92" cy="102" r="3" fill="#000" /><circle className="bq-eye" cx="118" cy="102" r="3" fill="#000" />
        </g>
        <g className="bq-lens">
          <g transform="translate(150 92)">
            <path d="M18 18l17 17" stroke="#000" strokeWidth="9" strokeLinecap="round" transform="translate(3 4)" />
            <circle r="22" fill="#000" transform="translate(3 4)" />
            <path d="M18 18l17 17" stroke="#a52226" strokeWidth="9" strokeLinecap="round" />
            <circle r="22" fill="#fff" stroke="#000" strokeWidth="2.5" />
            <circle r="15" fill="#fbeaea" />
            <text className="bq-qm" y="7" textAnchor="middle">?</text>
          </g>
        </g>
      </svg>
      <b>No products found</b>
      <p>We couldn’t find anything for “{q.trim()}”.<br />Try a different word or browse a category.</p>
      <div className="bq-chips">
        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
          <button key={c.id} onClick={() => { A.setq(''); A.setcat(c.id); A.back(); }}>{c.label.join(' ')}</button>
        ))}
      </div>
    </div>
  );
}

export default function Search() {
  const { S, A } = useBuy();
  const inp = useRef(null);
  const q = S.q || '';
  const list = searchProducts(q, S.sort);
  const typed = q.trim().length > 0;
  // focus while the opening tap is still being handled (so mobile browsers raise the keyboard), without scrolling the
  // screen that is still sliding in
  useLayoutEffect(() => { inp.current && inp.current.focus({ preventScroll: true }); }, []);
  return (
    <div className="bq">
      <div className="bq-head">
        <button className="bq-back" onClick={A.back} aria-label="Back"><img src={Q + 'ic-back.svg'} width="20" height="20" alt="" /></button>
        <label className="bq-field">
          <input ref={inp} type="search" enterKeyHint="search" value={q} onChange={e => A.setq(e.target.value)} onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
            placeholder="Search for products, categories..." aria-label="Search products" autoComplete="off" />
          {q ? <button className="bq-clear" onClick={() => { A.setq(''); inp.current && inp.current.focus(); }} aria-label="Clear search"><img src={Q + 'ic-clear.svg'} width="18" height="18" alt="" /></button> : null}
        </label>
      </div>
      <div className="bq-body">
        {list.length ? <>
          <div className="bq-count"><span>{typed ? `${list.length} Product${list.length === 1 ? '' : 's'} Found` : 'Suggested for you'}</span>
            <button onClick={A.sort}><img src={Q + 'ic-sort.svg'} width="18" height="18" alt="" />Sort By</button></div>
          <div key={typed ? 'r' : 's'} className="bq-list">
            {list.map((p, i) => <Fragment key={p.id}>{i ? <img className="bq-div" src={Q + 'divider.svg'} alt="" aria-hidden="true" /> : null}<Row p={p} q={q} i={i} /></Fragment>)}
          </div>
        </> : <NoResults q={q} />}
      </div>
    </div>
  );
}
