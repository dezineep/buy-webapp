/* Shared UI atoms (classes styled in styles/base.css). Icons are the Figma exports from file FBuShw2V6BDtlsMePanuS7. */
import { useBuy } from './engine.jsx';
import { FG, V2, inr, off, P, qtyInCart, SWATCH } from './data.js';

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
export function Ctl({ pid }) {
  const { S, A } = useBuy();
  const p = P(pid), n = qtyInCart(S.cart, pid);
  if (!n) return <button className="ba-add" onClick={() => A.add(pid)} aria-label={`Add ${p.name}`}>{ICO.plus()}</button>;
  return (
    <span className="ba-step">
      <button onClick={() => A.pdec(pid)} aria-label="Remove one">{ICO.minusW()}</button>
      <b>{n}</b>
      <button onClick={() => A.pinc(pid)} aria-label="Add one">{ICO.plusW()}</button>
    </span>
  );
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
      <div className="bx-mini-img" onClick={() => A.quick(p.id)}><img src={p.img[0]} alt={p.name} loading="lazy" /></div>
      <span className="bx-mini-ctl"><Ctl pid={p.id} /></span>
      <VariantChips p={p} />
      <p className="bx-mini-name" onClick={() => A.product(p.id)}>{p.name}</p>
      <div onClick={() => A.product(p.id)}><PriceBox price={p.price} mrp={p.mrp} /></div>
    </div>
  );
}
