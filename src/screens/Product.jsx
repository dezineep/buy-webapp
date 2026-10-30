/* BUY · PRODUCT DETAILS — Figma 2167:5510 (with variants + bulk packs), 2167:5149 (no variants, item in cart)
   Bulk cards: each pack ("1 x Piece", "3 x Pieces" Best Value, …) + "Custom" (any quantity, sliding per-unit price).
   Select Variant: one chip row per option group (Size, Color). Tags above the name echo the chosen variant.
   Footer: Add to Cart -> [cart button with count] + stepper for the chosen variant/pack. */
import { useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { P, PRODUCTS, inr, unitPrice, mrpOf, packPrice, customUnit, lineKey, calcBill } from '../data.js';
import { Head, ICO, PriceBox, BigStep, MiniCard } from '../ui.jsx';

export function PackCards({ p, s }) {
  const { A } = useBuy();
  const custom = s.pack.custom;
  const lo = customUnit(p, s.sel, p.custom.max), hi = unitPrice(p, s.sel);
  return (
    <div className="bp2-packs">
      {p.packs.map(pk => (
        <button key={pk.n} className={'bp2-pack' + (!custom && s.pack.n === pk.n ? ' on' : '')} onClick={() => A.selpack(p.id, pk.n)}>
          {pk.best ? <em>Best Value</em> : null}
          <span>{pk.label}</span><b>{inr(packPrice(p, s.sel, pk)).replace('₹', '₹ ')}</b>
        </button>
      ))}
      <button className={'bp2-pack' + (custom ? ' on' : '')} onClick={() => A.custom(p.id)}>
        <span>{custom ? `Custom · ${s.pack.n} ${p.custom.units}` : 'Custom'}</span>
        <b>{custom ? inr(packPrice(p, s.sel, s.pack)).replace('₹', '₹ ') : <>₹ {hi.toLocaleString('en-IN')}- {lo.toLocaleString('en-IN')}<small> /{p.custom.unit}</small></>}</b>
      </button>
    </div>
  );
}

export function OptionGroups({ p, s }) {
  const { A } = useBuy();
  return (
    <div className="bp2-opts">
      {p.opts.map(o => (
        <div key={o.name} className="bp2-og">
          <p className="bp2-ol">{o.name}</p>
          <div className="bp2-chips">
            {o.values.map(v => (
              <button key={v.v} className={'bp2-chip' + (s.sel[o.name] === v.v ? ' on' : '')} onClick={() => A.selopt(p.id, o.name, v.v)}>{v.v}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductFoot({ pid }) {
  const { S, A } = useBuy();
  const s = A.selOf(pid);
  const line = S.cart.find(l => l.key === lineKey(pid, s.sel, s.pack));
  const n = calcBill(S.cart).count;
  const cartBtn = n ? <button className="bp2-cartbtn" onClick={A.cart} aria-label="View cart">{ICO.cart()}<em>{n}</em></button> : null;
  // after adding (Figma 593:2459): "View Cart" + count and the stepper share the bar equally
  if (line) return <><button className="bp2-cartbtn wide" onClick={A.cart}>{ICO.cart()}<span>View Cart</span><em>{n}</em></button><BigStep line={line} grow /></>;
  return <>{cartBtn}<button className="ba-btn grow" onClick={() => A.addsel(pid)}>Add to Cart</button></>;
}

export default function Product({ entry }) {
  const { A } = useBuy();
  const p = P(entry.pid), s = A.selOf(entry.pid);
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(entry.img || 0);
  const gal = useRef(null);
  // opened from an expanding quick view: start on the photo that was showing there
  useLayoutEffect(() => { const g = gal.current; if (g && entry.img) g.scrollLeft = entry.img * g.clientWidth; }, []);
  const price = packPrice(p, s.sel, s.pack), mrp = mrpOf(p, unitPrice(p, s.sel)) * s.pack.n;
  const tags = [...p.opts.map(o => s.sel[o.name]), ...(p.opts.length ? [] : [p.tag]), s.pack.n > 1 ? `${s.pack.n} ${p.custom.units}` : null].filter(Boolean);
  const others = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).concat(PRODUCTS.filter(x => x.cat !== p.cat)).slice(0, 8);
  return (
    <div className="bp2">
      <Head title="Product Details" />
      <div className="bp2-body">
        <div className="bp2-gal">
          <div className="bp2-track" ref={gal} onScroll={e => setSlide(Math.round(e.target.scrollLeft / e.target.clientWidth))}>
            {p.img.map(i => <img key={i} src={i} alt={p.name} />)}
          </div>
          {p.img.length > 1 && <div className="bp2-dots">{p.img.map((i, k) => <i key={i} className={k === slide ? 'on' : ''} />)}</div>}
        </div>
        <div className="bp2-info">
          <div className="bp2-head">
            {tags.length ? <div className="bp2-tags">{tags.map(t => <span key={t} className="ba-tag">{t}</span>)}</div> : null}
            <div className="bp2-row">
              <div className="bp2-nm"><p className="bp2-name">{p.name}</p><PriceBox price={price} mrp={mrp} big /></div>
              <button className="bp2-share" onClick={A.share} aria-label="Share">{ICO.shareSoft()}</button>
            </div>
            {p.left ? <p className="bp2-left">Only {p.left} left in stock</p> : null}
          </div>
          <PackCards p={p} s={s} />
          {p.opts.length ? <div className="bp2-var"><p className="bp2-h">Select Variant</p><OptionGroups p={p} s={s} /></div> : null}
          <div className="bp2-dsc">
            <div className="bp2-dsc-t"><p className="bp2-h">Description</p><p className={'bp2-desc' + (open ? ' open' : '')}>{p.desc}</p></div>
            <button className={'bp2-more' + (open ? ' open' : '')} onClick={() => setOpen(!open)}>{ICO.down()}<span>{open ? 'Read less' : 'Read more'}</span></button>
          </div>
        </div>
        <div className="bp2-addmore"><p className="bp2-h2">Add more to your order</p>
          <div className="bx-hlist">{others.map(o => <MiniCard key={o.id} p={o} />)}</div>
        </div>
      </div>
      <div className="ba-foot bp2-foot"><ProductFoot pid={p.id} /></div>
    </div>
  );
}
