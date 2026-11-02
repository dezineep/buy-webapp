/* BUY · SHOP TYPE PICKER — first screen of the prototype (and "Shop type" in More Options). Picking a type rewrites
   the store name and category tabs (shops.js). The selected card opens to preview that shop's category icons.
   Styles: styles/shoppicker.css (.bsp-*) */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { SHOPS, catPhoto } from '../shops.js';
import { iconUrl } from '../catIcons.js';
import { SWATCHES, DEFAULT_HEX, ladder, buildTheme } from '../theme.js';

const Ic = ({ name, cls }) => { const u = `url("${iconUrl(name)}")`; return <i className={cls} style={{ WebkitMaskImage: u, maskImage: u }} aria-hidden="true" />; };

export default function ShopPicker() {
  const { S, A } = useBuy();
  const [pick, setPick] = useState(S.shop);
  const [step, setStep] = useState(S.pickerStep || 1);
  const [mounted, setMounted] = useState(S.picker);
  useEffect(() => {
    if (S.picker) { setPick(S.shop); setStep(S.pickerStep || 1); setMounted(true); return; }
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
  const go2 = () => { setStep(2); scr.current && scr.current.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (
    <div className={'bsp' + (S.picker ? ' on' : '') + ' step' + step} role="dialog" aria-modal="true" aria-labelledby="bsp-h">
      <div className="bsp-scr" ref={scr}>
        {step === 1 ? <>
          <div className="bsp-top">
            <span className="bsp-badge">BUY · Prototype · 1 / 2</span>
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
                      {s.cats.map(c => { const ph = catPhoto(s.id, c.id); return <span key={c.id} className="bsp-cat">{ph ? <img src={ph} alt="" loading="lazy" /> : <Ic name={c.icon} />}<small>{c.label}</small></span>; })}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </> : <ThemeStep store={sel.store} />}
      </div>
      <div className="bsp-foot">
        {step === 1
          ? <button className="ba-btn wide" onClick={go2}>Next: Brand colour</button>
          : <div className="bsp-foot2"><button className="ba-btn outline" onClick={() => setStep(1)}>Back</button><button className="ba-btn grow" onClick={() => A.pickshop(pick)}>Open {sel.store}</button></div>}
      </div>
    </div>
  );
}

/* step 2 — brand colour: BUY default, 14 suggestions at BUY red's weight, or any colour from the picker. Tapping one
   re-themes the whole app live (theme.js builds the shade ladder and maps it onto every token). */
function ThemeStep({ store }) {
  const { S, A } = useBuy();
  const cur = (S.theme || DEFAULT_HEX).toLowerCase();
  const isPreset = cur === DEFAULT_HEX || SWATCHES.some(([, h]) => h.toLowerCase() === cur);
  const shades = ladder(cur), t = buildTheme(cur);
  const Sw = ({ hex, name, big }) => (
    <button role="radio" aria-checked={cur === hex.toLowerCase()} aria-label={name} className={'bsp-sw' + (big ? ' big' : '') + (cur === hex.toLowerCase() ? ' on' : '')} style={{ '--c': hex }} onClick={() => A.settheme(hex)}>
      <i />{big ? <span><b>{name}</b><small>Default BUY colour</small></span> : null}
    </button>
  );
  return (
    <>
      <div className="bsp-top">
        <span className="bsp-badge">BUY · Prototype · 2 / 2</span>
        <h1 id="bsp-h">Pick your store’s<br />brand colour</h1>
        <p>Buttons, chips, highlights and illustrations all follow it. Any colour works: we build its lighter and darker shades automatically.</p>
      </div>
      <div className="bsp-th" role="radiogroup" aria-label="Brand colour">
        <Sw hex={DEFAULT_HEX} name="BUY Red" big />
        <p className="bsp-th-h">Suggested colours</p>
        <div className="bsp-sws">{SWATCHES.map(([n, h]) => <Sw key={n} hex={h} name={n} />)}</div>
        <p className="bsp-th-h">Your own colour</p>
        <label className={'bsp-custom' + (!isPreset ? ' on' : '')}>
          <span className="bsp-custom-sw" style={{ '--c': cur }}><input type="color" value={cur} onChange={e => A.settheme(e.target.value)} aria-label="Pick any colour" /></span>
          <span className="bsp-custom-t"><b>Pick any colour</b><small>{!isPreset ? cur.toUpperCase() : 'Opens the colour picker'}</small></span>
          <span className="bsp-radio" />
        </label>
        {/* live preview: the generated shades and how they land on the UI */}
        <div className="bsp-prev">
          <div className="bsp-ladder">{shades.map((h, i) => <i key={i} style={{ background: h }} />)}</div>
          <div className="bsp-mock">
            <div className="bsp-mock-head"><span className="bsp-mock-back" /><span><b>{store}</b><small>Your BUY store</small></span></div>
            <div className="bsp-mock-row"><span className="ba-tag">M</span><span className="ba-tag">Black</span><span className="ba-off">31% OFF</span></div>
            <div className="bsp-mock-row"><span className="bsp-mock-plus">+</span><span className="bsp-mock-step">− 2 +</span><span className="bsp-mock-chip">Selected</span></div>
            <span className="ba-btn wide bsp-mock-btn">Add to Cart • ₹1,199</span>
            <small className="bsp-mock-note">Button colour {t['--r'].toUpperCase()}{t['--r'].toLowerCase() !== cur ? ' (deepened so white text stays readable)' : ''}</small>
          </div>
        </div>
      </div>
    </>
  );
}
