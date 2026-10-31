/* BUY · CART — Figma 747-1311 (same as the demo). Styles: styles/cart.css (.bc-*) */
import { useBuy } from '../engine.jsx';
import { PRODUCTS, STORE, DELIVERY, GIFT, inr, off, calcBill, nextOffer, lineInfo, FG } from '../data.js';
import { Head, PriceRow, Ring, OStep, MiniCard } from '../ui.jsx';

const plural = n => `${n} Item${n === 1 ? '' : 's'}`;

export function OfferCard() {
  const { S } = useBuy();
  const b = calcBill(S.cart), next = nextOffer(b.sub);
  if (!next) return <div className="ba-of done"><Ring p={1} kind="gift" /><div><b>All offers unlocked</b><small>Free delivery, 50% off and a free tote bag</small></div></div>;
  return <div className="ba-of"><Ring p={b.sub / next.min} kind={next.kind} /><div><b>{next.title}</b><small>Shop for <strong>{inr(next.min - b.sub)}</strong> more</small></div></div>;
}

function Bill() {
  const { S } = useBuy();
  const b = calcBill(S.cart), fresh = S.fresh || {};
  const Row = ({ cls = '', l, r }) => <div className={'bc-bill-r' + cls}><span>{l}</span><span>{r}</span></div>;
  return (
    <div className="bc-bill">
      <p className="bc-bill-h">Bill Details</p>
      <Row l={<>Item total <small>(MRP {inr(b.mrp)})</small></>} r={inr(b.sub)} />
      {b.delivery ? <Row l="Delivery charge" r={inr(b.delivery)} /> : <Row cls={' ok' + (fresh.free ? ' fresh' : '')} l={<>Delivery charge <em>FREE</em></>} r={<><s>{inr(DELIVERY)}</s> ₹0</>} />}
      {b.disc ? <Row cls={' ok' + (fresh.disc ? ' fresh' : '')} l={<>50% discount <em>APPLIED</em></>} r={`- ${inr(b.disc)}`} /> : null}
      {b.gift ? <Row cls={' ok' + (fresh.gift ? ' fresh' : '')} l={<>{GIFT.name.replace(' (free gift)', '')} <em>GIFT</em></>} r={<><s>{inr(GIFT.value)}</s> ₹0</>} /> : null}
      <Row l="GST (5%)" r={inr(b.gst)} />
      <i className="ba-div dash" />
      <Row cls=" tot" l="To Pay" r={inr(b.total)} />
    </div>
  );
}

/* empty cart: the trolley rocks on spinning wheels with a sad face, while a parcel keeps dropping towards it and
   fading out before it lands (same outlined, hard-shadow style as the search "no results" illustration) */
function EmptyCart() {
  return (
    <svg className="bc-ill" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bc-floor" cx="114" cy="156" rx="70" ry="6" />
      <g className="bc-sparks"><path d="M28 46v12M22 52h12" /><path d="M192 30v10M187 35h10" /><circle cx="196" cy="92" r="3.5" /><circle cx="22" cy="100" r="2.5" /></g>
      <g className="bc-speed"><path d="M6 96h16" /><path d="M12 110h12" /><path d="M2 124h18" /></g>
      <g className="bc-parcel">
        <rect x="102" y="10" width="26" height="22" rx="3" fill="#f2b233" stroke="#000" strokeWidth="2.5" />
        <path d="M115 10v22M102 18h26" stroke="#000" strokeWidth="2" />
      </g>
      <g className="bc-trolley">
        <path d="M28 42h16l10 16" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M54 58h126l-12 56H66Z" transform="translate(4 5)" fill="#000" />
        <path d="M54 58h126l-12 56H66Z" fill="#f4c8c9" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M54 58h126l-3 14H57Z" fill="#a52226" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 114l4 14h96" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="bc-eye" cx="104" cy="88" r="3" fill="#000" /><circle className="bc-eye" cx="130" cy="88" r="3" fill="#000" />
        <path d="M107 103c4-5 16-5 20 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        {[[84, 141], [154, 141]].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <g className="bc-wheel"><circle r="10" fill="#fff" stroke="#000" strokeWidth="2.5" /><path d="M0-6v12M-6 0h12" stroke="#a52226" strokeWidth="2.2" strokeLinecap="round" /></g>
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function Cart() {
  const { S, A } = useBuy();
  if (!S.cart.length) return (
    <div className="bc"><Head title="Cart Items" />
      <div className="bc-empty"><EmptyCart /><b>Your cart is empty</b><p>Find something you love at {STORE.name}.</p><button className="ba-btn" onClick={A.home}>Browse Products</button></div>
    </div>
  );
  const b = calcBill(S.cart);
  const more = PRODUCTS.filter(p => !S.cart.some(l => l.pid === p.id)).slice(0, 10);
  const ad = S.addr;
  const where = ad ? `${ad.area || ad.road || ad.street}, ${ad.city} - ${ad.pin}` : 'Add your delivery address';
  return (
    <div className="bc"><Head title="Cart Items" />
      <button className="bc-addr" onClick={A.address}><img src="/assets/fig/ic-pin.svg" alt="" /><span>Deliver to <b>{where}</b></span><em>Change</em></button>
      <div className="bc-body">
        <section className="bc-top">
          <div className="bc-items"><p className="bc-cnt">{plural(b.count)} added</p>
            <div className="bc-list">
              {S.cart.map((l, i) => {
                const x = lineInfo(l), o = x.mrp > x.price ? off(x.price, x.mrp) : 0;
                return [
                  i ? <i key={l.key + 'd'} className="ba-div" /> : null,
                  <div key={l.key} className="bc-row">
                    <img className="bc-row-img" src={x.p.img[0]} alt="" onClick={() => A.product(l.pid)} />
                    <div className="bc-row-i"><span className="ba-tag">{x.label}{x.custom ? ' · custom' : ''}</span><p>{x.p.name}</p>
                      <div className="bc-row-p"><PriceRow price={x.price} mrp={x.mrp} />{o ? <span className="ba-off">{o}% OFF</span> : null}</div></div>
                    <OStep line={l} />
                  </div>,
                ];
              })}
            </div>
          </div>
          <div className="bc-offer"><OfferCard /><button className="bc-link" onClick={A.offers}>See All Offers</button></div>
        </section>
        <Bill />
        {more.length ? <section className="bc-more"><p className="bc-h">Add more to your order</p><div className="bx-hlist">{more.map(p => <MiniCard key={p.id} p={p} />)}</div></section> : null}
      </div>
      <div className="ba-foot bc-foot"><div className="ba-amt bc-amt"><b>{inr(b.total)}</b><button onClick={A.amount}>Amount Summary</button></div>
        <button className="ba-btn" onClick={A.checkout}>Proceed to Pay</button></div>
    </div>
  );
}
