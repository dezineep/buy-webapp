/* BUY · CATEGORY — Figma 2189:6079 (category screen) and 2189:6682 (searching inside it). Opened from the category
   row on the product page. Tapping search morphs the round search button into a pink search bar under the header;
   clearing an empty bar folds it back into the button. Reuses the home product card and grid.
   Styles: styles/category.css (.bk-*), cards from home.css */
import { useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { CATEGORIES, STORE, V2, sortedProducts, searchTokens } from '../data.js';
import { Head, ICO } from '../ui.jsx';
import { Card } from './Home.jsx';

const H = V2 + 'home/';

export default function Category({ entry }) {
  const { S, A } = useBuy();
  const c = CATEGORIES.find(x => x.id === entry.cat) || CATEGORIES[0];
  const name = c.name || c.label.join(' ');
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inp = useRef(null);
  const words = searchTokens(q);
  const list = sortedProducts(S, c.id).filter(p => {
    if (!words.length) return true;
    const t = searchTokens(p.name + ' ' + (p.tag || ''));
    return words.every(w => t.some(x => x.startsWith(w)));
  });
  const openSearch = () => { setOpen(true); setTimeout(() => inp.current?.focus({ preventScroll: true }), 60); };
  const clear = () => { if (q) { setQ(''); inp.current?.focus(); } else { setOpen(false); inp.current?.blur(); } };
  const share = () => {
    const url = `https://modulusbuy.com/${STORE.slug}/${c.id}`;
    if (navigator.share) navigator.share({ title: `${name} · ${STORE.name}`, url }).catch(() => {});
    else A.toast(`Link copied: ${url.replace('https://', '')}`);
  };
  return (
    <div className={'bk' + (open ? ' searching' : '')}>
      <Head title={name} sub={STORE.name} right={
        <span className="bk-acts">
          <button className="bp2-share bk-sbtn" onClick={openSearch} aria-label="Search in this category" tabIndex={open ? -1 : 0}><i className="bk-sic" /></button>
          <button className="bp2-share" onClick={share} aria-label="Share category">{ICO.shareSoft()}</button>
        </span>} />
      <div className="bk-sbar-wrap" aria-hidden={!open}><div className="bk-sbar-in">
        <label className="bk-sbar">
          <i className="bk-sic" />
          <input ref={inp} value={q} onChange={e => setQ(e.target.value)} placeholder={`Search in ${name}`} tabIndex={open ? 0 : -1} enterKeyHint="search" />
          <button onClick={clear} aria-label={q ? 'Clear search' : 'Close search'} tabIndex={open ? 0 : -1}><i className="bk-xic" /></button>
        </label>
      </div></div>
      <div className="bk-count"><b>{list.length} {list.length === 1 ? 'Product' : 'Products'}</b><button onClick={A.sort}><img src={H + 'ic-sort.svg'} width="18" height="18" alt="" />Sort By</button></div>
      <div className="bh-grid bk-grid">
        {list.length ? list.map(p => <Card key={p.id} p={p} />) : <p className="bh-empty">{q ? `Nothing matches “${q.trim()}” in ${name}.` : 'No products in this category yet.'}</p>}
      </div>
    </div>
  );
}
