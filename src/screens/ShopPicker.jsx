/* BUY · SHOP TYPE PICKER — first screen of the prototype (and "Shop type" in More Options). Picking a type rewrites
   the store name and category tabs (shops.js). The selected card opens to preview that shop's category icons.
   Styles: styles/shoppicker.css (.bsp-*) */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { SHOPS } from '../shops.js';
import { iconUrl } from '../catIcons.js';

const Ic = ({ name, cls }) => { const u = `url("${iconUrl(name)}")`; return <i className={cls} style={{ WebkitMaskImage: u, maskImage: u }} aria-hidden="true" />; };

export default function ShopPicker() {
  const { S, A } = useBuy();
  const [pick, setPick] = useState(S.shop);
  const [mounted, setMounted] = useState(S.picker);
  useEffect(() => {
    if (S.picker) { setPick(S.shop); setMounted(true); return; }
    const t = setTimeout(() => setMounted(false), 400); return () => clearTimeout(t);
  }, [S.picker]);
  // open on the current shop's card
  const scr = useRef(null);
  useLayoutEffect(() => {
    if (!S.picker || !scr.current) return;
    const c = scr.current.querySelector('.bsp-card.on');
    if (c) scr.current.scrollTop = Math.max(0, c.offsetTop - scr.current.clientHeight / 2 + 60);
  }, [S.picker, mounted]);
  if (!mounted) return null;
  const sel = SHOPS.find(s => s.id === pick);
  return (
    <div className={'bsp' + (S.picker ? ' on' : '')} role="dialog" aria-modal="true" aria-labelledby="bsp-h">
      <div className="bsp-scr" ref={scr}>
        <div className="bsp-top">
          <span className="bsp-badge">BUY · Prototype</span>
          <h1 id="bsp-h">What kind of shop<br />are you opening?</h1>
          <p>We’ll set up the store name and category tabs for that shop. You can switch anytime from More Options.</p>
        </div>
        <div className="bsp-list" role="radiogroup" aria-label="Shop type">
          {SHOPS.map(s => {
            const on = s.id === pick;
            return (
              <button key={s.id} role="radio" aria-checked={on} className={'bsp-card' + (on ? ' on' : '')} onClick={e => { setPick(s.id); const card = e.currentTarget; setTimeout(() => card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 360); }}>
                <span className="bsp-row">
                  <span className="bsp-ic"><Ic name={s.icon} /></span>
                  <span className="bsp-t"><b>{s.name}</b><small>{s.store} · {s.cats.length} categories</small></span>
                  <span className="bsp-radio" />
                </span>
                <span className="bsp-cats" aria-hidden={!on}>
                  <span className="bsp-cats-in">
                    {s.cats.map(c => <span key={c.id} className="bsp-cat"><Ic name={c.icon} /><small>{c.label}</small></span>)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="bsp-foot">
        <button className="ba-btn wide" onClick={() => A.pickshop(pick)}>Open {sel.store}</button>
      </div>
    </div>
  );
}
