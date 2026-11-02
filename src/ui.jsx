/* Shared UI atoms (classes styled in styles/base.css). Icons are the Figma exports from file FBuShw2V6BDtlsMePanuS7. */
import { useBuy } from './engine.jsx';
import { FG, V2, inr, off, P, qtyInCart, SWATCH, CATEGORIES, PRODUCTS } from './data.js';

const B = FG + 'base/';
const ic = (src, w, h = w) => <img src={src} width={w} height={h} alt="" aria-hidden="true" />;
export const ICO = {
  back: () => ic(B + 'ic-back.svg', 20),
  close: () => ic(V2 + 'more/ic-close.svg', 20),
  plus: () => ic(B + 'ic-plus-red.svg', 20),
  minus: () => ic(B + 'ic-minus-red.svg', 20),
  plusW: () => ic(V2 + 'home/ic-plus-white.svg', 20),
  minusW: () => ic(V2 + 'home/ic-minus-white.svg', 20),
  down: () => ic(V2 + 'product/ic-down.svg', 16),
  arrow: () => ic(B + 'ic-arrow-right-red.svg', 24),
  copy: () => <span className="ba-ic14">{ic(B + 'ic-copy.svg', 12.54)}</span>,
  search: () => ic(V2 + 'home/ic-search.svg', 16),
  share: () => ic(V2 + 'home/ic-share.svg', 20),
  shareSoft: () => ic(V2 + 'product/ic-share.svg', 20),
  more: () => ic(V2 + 'home/ic-more.svg', 20),
  cart: () => ic(V2 + 'product/ic-cart.svg', 20),
  verified: () => ic(V2 + 'home/ic-verified.svg', 16),
  scooterG: () => ic(V2 + 'home/ic-scooter-green.svg', 14),
  m17: () => ic(V2 + 'home/logo-m17.png', 29, 20),
};

export function Head({ title, sub, right }) {
  const { A } = useBuy();
  return (
    <div className="ba-head">
      <button className="ba-back" onClick={A.back} aria-label="Back">{ICO.back()}</button>
      <div className="ba-head-t"><b>{title}</b>{sub ? <small>{sub}</small> : null}</div>
      {right}
    </div>
  );
}

export const PriceRow = ({ price, mrp, big }) => (
  <div className={'ba-price' + (big ? ' big' : '')}><b>{inr(price)}</b>{mrp > price ? <s>{inr(mrp)}</s> : null}</div>
);
export const PriceBox = ({ price, mrp, big }) => (
  <div className="ba-pricebox"><PriceRow price={price} mrp={mrp} big={big} />{mrp > price ? <span className="ba-off">{off(price, mrp)}% OFF</span> : null}</div>
);

export function SheetHead({ title, sub }) {
  const { A } = useBuy();
  return (
    <div className="ba-sh-h">
      <div className="ba-sh-t"><b>{title}</b>{sub ? <small>{sub}</small> : null}</div>
      <button className="ba-x" onClick={A.close} aria-label="Close">{ICO.close()}</button>
    </div>
  );
}

/* offer progress ring (Figma "Frame 2147239373"): track #dbdbdb, progress red (green when done); size with --ring */
const RING_C = 119.38;
export function Ring({ p, kind }) {
  const done = p >= 1, k = kind === 'del' || kind === 'pct' ? kind : 'gift';
  const src = k === 'del' ? B + 'ic-scooter-red.svg' : k === 'pct' ? B + 'ic-discount-red.svg' : B + 'ring-gift.svg';
  const layers = k === 'gift' ? `radial-gradient(ellipse 35.3% 34.9% at 50.6% 48.8%, #000 98%, transparent 100%), url(${src})` : `url(${src})`;
  const len = Math.max(0, Math.min(1, p)) * RING_C;
  return (
    <span className={'ba-ring' + (done ? ' done' : '')} data-kind={k}>
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <circle cx="21" cy="21" r="19" fill="none" stroke="#dbdbdb" strokeWidth="4" />
        <circle cx="21" cy="21" r="19" fill="none" stroke={done ? '#01ae0f' : '#a52226'} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${len.toFixed(2)} ${RING_C}`} transform="rotate(-90 21 21)" opacity={len < 0.5 ? 0 : 1} />
      </svg>
      <i className="ba-ring-ic" style={{ WebkitMaskImage: layers, maskImage: layers }} />
    </span>
  );
}

/* + button / red stepper used on product cards (Figma 2167:7131 / 2167:7167) */
/* "+" that grows into a stepper: one pill whose width eases open while the − and the count fade in, so adding the
   first piece (and removing the last) morphs smoothly instead of swapping buttons. fill = the red filled stepper
   (cards); otherwise it stays white with red icons (search rows). */
/* product page: the product's category above the description (Figma 2189:5456); opens the category screen */
export function CatRow({ p }) {
  const { A } = useBuy();
  const c = CATEGORIES.find(x => x.id === p.cat);
  if (!c || c.id === 'all') return null;
  const n = PRODUCTS.filter(x => x.cat === c.id).length;
  return (
    <button className="bk-row" onClick={() => A.opencat(c.id)}>
      <span className="bk-row-l">
        <span className="bk-row-ic">{c.img ? <img src={c.img} alt="" /> : <i style={{ WebkitMaskImage: `url("${c.icon}")`, maskImage: `url("${c.icon}")` }} />}</span>
        <span className="bk-row-t"><small>Category</small><b>{c.name || c.label.join(' ')}</b></span>
      </span>
      <span className="bk-row-r">{n} {n === 1 ? 'Product' : 'Products'}<i aria-hidden="true" /></span>
    </button>
  );
}

/* map pin in the app's outlined style: red drop with a black stroke + hard shadow and a white disc holding either
   an icon (data URL / path, tinted red) or a red "you are here" dot. Its tip sits on the centre of the map (the
   parent must be position: relative), and a ring pulses out from that point. */
export function MapPin({ icon, drop }) {
  const m = icon ? { WebkitMaskImage: `url("${icon}")`, maskImage: `url("${icon}")` } : null;
  return (
    <span className={'ba-mpin' + (drop ? ' drop' : '')} aria-hidden="true">
      <i className="ba-mpin-ring" />
      <svg viewBox="0 0 44 54" width="44" height="54">
        <path d="M22 51C12 39 4 30 4 20a18 18 0 0 1 36 0c0 10-8 19-18 31Z" transform="translate(3 3)" fill="#000" />
        <path d="M22 51C12 39 4 30 4 20a18 18 0 0 1 36 0c0 10-8 19-18 31Z" fill="#a52226" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="22" cy="20" r="12" fill="#fff" stroke="#000" strokeWidth="2" />
        {icon ? null : <circle className="ba-mpin-dot" cx="22" cy="20" r="5" fill="#a52226" />}
      </svg>
      {icon ? <i className="ba-mpin-ic" style={m} /> : null}
    </span>
  );
}

export function AddStep({ n, onAdd, onInc, onDec, fill, label }) {
  const on = n > 0;
  return (
    <span className={'ba-mc' + (fill ? ' fill' : '') + (on ? ' on' : '')} style={{ '--w': n > 9 ? '96px' : '86px' }}>
      <button className="ba-mc-dec" onClick={onDec} tabIndex={on ? 0 : -1} aria-hidden={!on} aria-label="Remove one">{fill ? ICO.minusW() : ICO.minus()}</button>
      <b key={n} aria-live="polite">{on ? n : ''}</b>
      <button className="ba-mc-inc" onClick={on ? onInc : onAdd} aria-label={on ? 'Add one' : label}>
        <span className="ba-mc-p red">{ICO.plus()}</span>{fill ? <span className="ba-mc-p white">{ICO.plusW()}</span> : null}
      </button>
    </span>
  );
}

export function Ctl({ pid }) {
  const { S, A } = useBuy();
  const p = P(pid), n = qtyInCart(S.cart, pid);
  return <AddStep n={n} fill label={`Add ${p.name}`} onAdd={() => A.add(pid)} onInc={() => A.pinc(pid)} onDec={() => A.pdec(pid)} />;
}

export const OStep = ({ line }) => {
  const { A } = useBuy();
  return (
    <span className="ba-ostep">
      <button onClick={() => A.dec(line.key)} aria-label="Remove one">{ICO.minus()}</button>
      <b>{line.qty}</b>
      <button onClick={() => A.inc(line.key)} aria-label="Add one">{ICO.plus()}</button>
    </span>
  );
};
export const BigStep = ({ line, grow }) => {
  const { A } = useBuy();
  return (
    <span className={'ba-step big' + (grow ? ' grow' : '')}>
      <button onClick={() => A.dec(line.key)} aria-label="Remove one">{ICO.minusW()}</button>
      <b>{line.qty}</b>
      <button onClick={() => A.inc(line.key)} aria-label="Add one">{ICO.plusW()}</button>
    </span>
  );
};

/* variant chips on product cards: the first attribute only (Size), its first `max` values as chips and a "+N" chip
   for the rest; products without variants show their pack / size tag */
export function VariantChips({ p, max = 2, rows = 1 }) {
  if (!p.opts.length) return <div className="bx-vc"><div className="bx-vrow"><span className="ba-tag">{p.tag || p.packs[0].label}</span></div></div>;
  return (
    <div className="bx-vc">
      {p.opts.slice(0, rows).map(o => (
        <div key={o.name} className="bx-vrow" aria-label={`${o.name}: ${o.values.map(v => v.v).join(', ')}`}>
          {o.values.slice(0, max).map(v => (
            <span key={v.v} className="ba-tag">{o.name === 'Color' ? <i className="bx-sw" style={{ background: SWATCH[v.v] || '#ccc' }} /> : null}{v.v}</span>
          ))}
          {o.values.length > max ? <span className="ba-tag more">+{o.values.length - max}</span> : null}
        </div>
      ))}
    </div>
  );
}

/* "Add more to your order" card (Figma 2167:5763): 160 wide, + pill over the image's bottom-left corner */
export function MiniCard({ p }) {
  const { A } = useBuy();
  return (
    <div className="bx-mini">
      <div className="bx-mini-img" onClick={() => A.quick(p.id)}><img src={p.img[0]} alt={p.name} loading="lazy" data-fly={p.id} /></div>
      <span className="bx-mini-ctl"><Ctl pid={p.id} /></span>
      <VariantChips p={p} />
      <p className="bx-mini-name" onClick={() => A.product(p.id)}>{p.name}</p>
      <div onClick={() => A.product(p.id)}><PriceBox price={p.price} mrp={p.mrp} /></div>
    </div>
  );
}
