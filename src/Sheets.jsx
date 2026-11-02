/* BUY · sheets & modals. The layer (dim + container) lives in App; each sheet renders only its inner content.
   more    Figma 1164:8920 (no "Coming soon" badges: every tile works)
   sort / amount / offers / details / pay / unlock / custom / quick — same as the demo
   variants  select size / colour + bulk pack for a product straight from the grid (same chips as the product page) */
import { useEffect, useRef, useState } from 'react';
import { useBuy } from './engine.jsx';
import { P, PRODUCTS, CATEGORIES, V2, FG, STORE, OFFERS, inr, calcBill, unitPrice, mrpOf, packPrice, customUnit, lineKey, selLabel, packText } from './data.js';
import { shopOf } from './shops.js';
import { THEME, DEFAULT_HEX } from './theme.js';
import { Otp } from './screens/Login.jsx';
import { iconUrl } from './catIcons.js';
import { SheetHead, Ring, PriceBox, PriceRow, BigStep, ICO, MiniCard } from './ui.jsx';
import { PackCards, OptionGroups } from './screens/Product.jsx';

const M = V2 + 'more/';

function More() {
  const { S, A } = useBuy();
  const u = S.user;
  const Tile = ({ on, icon, l1, l2 }) => (
    <button className="bsh-tile" onClick={on}><img src={M + icon} width="24" height="24" alt="" /><span className="bsh-tile-l">{l1}<br />{l2}</span></button>
  );
  return (
    <div className="bsh bsh-more"><SheetHead title="More Options" sub="Profile & Options" />
      <div className="bsh-body">
        <div className="bsh-prof">
          <span className="bsh-av"><img src={M + 'ic-user.svg'} width="24" height="24" alt="" /></span>
          <span className="bsh-who"><b>{u ? u.name : 'Guest Shopper'}</b><small>{u ? '+91 ' + u.phone.replace(/(\d{5})(\d{5})/, '$1 $2') : 'Add details at checkout'}</small></span>
          <button className="bsh-edit" onClick={A.details}>{u ? 'Edit Details' : 'Add Details'}<img src={M + 'ic-chev.svg'} width="18" height="18" alt="" /></button>
        </div>
        <div className="bsh-grid">
          <Tile on={A.myorders} icon="ic-orders.svg" l1="My" l2="Orders" />
          <Tile on={A.cart} icon="ic-cart.svg" l1="View" l2="Cart Items" />
          <Tile on={A.address} icon="ic-address.svg" l1="Saved" l2="Addresses" />
          <Tile on={A.refunds} icon="ic-refunds.svg" l1="My" l2="Refunds" />
          <Tile on={A.support} icon="ic-support.svg" l1="Store" l2="Support" />
          {u ? <Tile on={A.logout} icon="ic-logout.svg" l1="Log Out" l2="Now" /> : <Tile on={A.details} icon="ic-logout.svg" l1="Log In" l2="Now" />}
        </div>
        <button className="bsh-shop" onClick={() => A.openpicker(1)}>
          <i style={{ WebkitMaskImage: `url("${iconUrl(shopOf(S.shop).icon)}")`, maskImage: `url("${iconUrl(shopOf(S.shop).icon)}")` }} aria-hidden="true" />
          <span><small>Shop type</small><b>{shopOf(S.shop).name}</b></span>
          <em>Change</em>
        </button>
        <button className="bsh-shop" onClick={() => A.openpicker(2)}>
          <i className="bsh-theme-dot" aria-hidden="true" />
          <span><small>Brand colour</small><b>{THEME.hex === DEFAULT_HEX ? 'BUY Red (default)' : THEME.hex.toUpperCase()}</b></span>
          <em>Change</em>
        </button>
      </div>
    </div>
  );
}

/* drag the handle / title area down to close a bottom sheet (tapping the dim behind it closes it too) */
function useDragClose() {
  const { A } = useBuy();
  const root = useRef(null), d = useRef(null);
  const sheet = () => root.current && root.current.closest('.ba-sheet');
  const onPointerDown = e => {
    const el = sheet(); if (!el) return;
    d.current = { y: e.clientY, t: performance.now(), dy: 0 };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    el.style.transition = 'none';
  };
  const onPointerMove = e => {
    const s = d.current, el = sheet(); if (!s || !el) return;
    const dy = e.clientY - s.y;
    s.dy = dy;
    el.style.transform = `translateY(${dy > 0 ? dy : dy / 6}px)`; // a little give upwards, free downwards
  };
  const onPointerUp = () => {
    const s = d.current, el = sheet(); d.current = null; if (!s || !el) return;
    const fast = s.dy / Math.max(1, performance.now() - s.t) > 0.6;
    el.style.transition = '';
    if (s.dy > Math.max(90, el.offsetHeight * 0.3) || (fast && s.dy > 40)) { el.style.transform = 'translateY(100%)'; A.close(); }
    else el.style.transform = '';
  };
  return { root, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}

/* Sort By — Figma 1476:4666: grab handle, 20px title, radio rows with a muted direction hint, dashed dividers */
const SORTS = [['rel', 'Relevance', '( Best match )'], ['low', 'Price', '( Low → High )'], ['high', 'Price', '( High → Low )'], ['off', 'Discount', '( High → Low )']];
function Sort() {
  const { S, A } = useBuy();
  const { root, handlers } = useDragClose();
  return (
    <div className="bso" ref={root}>
      <div className="bso-drag" {...handlers}><i className="bso-grab" aria-hidden="true" /><h3>Sort By</h3></div>
      <div className="bso-list" role="radiogroup" aria-label="Sort products">{SORTS.map(([k, l, h]) => {
        const on = (S.sort || 'rel') === k;
        return <button key={k} role="radio" aria-checked={on} className={'bso-row' + (on ? ' on' : '')} onClick={() => A.setsort(k)}><i className="bso-radio" /><span><b>{l}</b><small>{h}</small></span></button>;
      })}</div>
    </div>
  );
}

function Offers() {
  const { S } = useBuy();
  const b = calcBill(S.cart);
  return (
    <div className="bsh"><SheetHead title="Offers" sub="Available offers on this store" />
      <div className="bsh-body bsh-ofl">{OFFERS.map(o => {
        const ok = b.sub >= o.min;
        return <div key={o.id} className={'ba-of' + (ok ? ' done' : '')}><Ring p={b.sub / o.min} kind={o.kind} /><div><b>{ok ? o.done : o.title}</b><small>{ok ? 'Applied to your cart' : <>Shop for <strong>{inr(o.min - b.sub)}</strong> more</>}</small></div></div>;
      })}</div>
    </div>
  );
}

function Amount() {
  const { S } = useBuy();
  const b = calcBill(S.cart);
  const disc = b.disc + (b.mrp - b.sub);
  const Row = ({ l, v, cls }) => <div className="bsh-row"><span>{l}</span><span className={cls}>{v}</span></div>;
  return (
    <div className="bsh"><SheetHead title="Amount Summary" sub="View charges and discount applied" />
      <div className="bsh-body"><div className="bsh-amt">
        <div className="bsh-rows">
          <Row l={`Subtotal (${b.count} item${b.count === 1 ? '' : 's'})`} v={inr(b.sub)} />
          <Row l="Delivery Charge" v={b.delivery ? inr(b.delivery) : 'FREE'} cls={b.delivery ? '' : 'g'} />
          <Row l="GST applied" v={inr(b.gst)} />
          <Row l="Discount" v={'- ' + inr(disc)} cls="g" />
        </div>
        <img className="bsh-dash" src={FG + 'sheets/line-dash.svg'} alt="" />
        <div className="bsh-tot"><span>Total Amount to Pay</span><b>{inr(b.total)}</b></div>
      </div></div>
    </div>
  );
}

/* Option select sheet — Figma 2197:5439: photo + price + "Explore <category> >", option chips, quantity cards,
   full-width Add to Cart. Once in the cart the footer becomes View cart + stepper. */
function Variants({ pid }) {
  const { S, A } = useBuy();
  const p = P(pid), s = A.selOf(pid);
  const price = packPrice(p, s.sel, s.pack), mrp = mrpOf(p, unitPrice(p, s.sel)) * s.pack.n;
  const line = S.cart.find(l => l.key === lineKey(pid, s.sel, s.pack));
  const cat = CATEGORIES.find(c => c.id === p.cat && c.id !== 'all');
  return (
    <div className="bsh bsh-var"><SheetHead title={p.name} sub="Select Option" />
      <div className="bsh-body">
        <div className="bsh-vtop">
          <img src={p.img[0]} alt="" data-fly={p.id} />
          <div className="bsh-vinfo">
            <PriceBox price={price} mrp={mrp} big />
            {cat ? <button className="bsh-vcat" onClick={() => A.opencat(cat.id)}><small>Explore</small><b>{cat.name || cat.label.join(' ')}<i aria-hidden="true" /></b></button> : null}
          </div>
        </div>
        {p.opts.length ? <OptionGroups p={p} s={s} /> : null}
        {p.custom ? <div className="bsh-vqty"><p className="bp2-h bsh-vq">Quantity</p><PackCards p={p} s={s} /></div> : null}
        <div className="bsh-vfoot">
          {line ? <><button className="ba-btn soft grow" onClick={A.cart}>{ICO.cart()}View cart<em>{calcBill(S.cart).count}</em></button><BigStep line={line} grow /></>
            : <button className="ba-btn wide" onClick={() => A.addsel(pid)}>Add to Cart • {inr(price)}</button>}
        </div>
      </div>
    </div>
  );
}

/* custom quantity: a plain numeric field, so the phone's own number keyboard opens */
function Custom({ pid }) {
  const { S, A } = useBuy();
  const p = P(pid), s = A.selOf(pid), c = p.custom;
  const n = +(S.cq?.v || 0);
  const ok = n >= c.min && n <= c.max;
  const per = n ? customUnit(p, s.sel, n) : unitPrice(p, s.sel);
  return (
    <><SheetHead title="Custom Quantity" sub={`${p.name} · Minimum Qty: ${c.min} ${c.units}`} />
      <div className="bv-cq">
        <div className="bv-fld"><p className="bv-lbl"><span>Number of {c.units}</span><b>*</b></p>
          <div className="bv-in"><input className="bv-num" type="text" inputMode="numeric" pattern="[0-9]*" enterKeyHint="done" autoFocus placeholder="0" aria-label={`Number of ${c.units}`}
            value={S.cq?.v || ''} onChange={e => A.cqset(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && ok) A.setcustom(pid); }} />
            <span className="bv-unit"><button className="on">{c.units[0].toUpperCase() + c.units.slice(1)}</button></span></div></div>
        <div className="bv-tot"><div><small>Total Price</small><b>{inr(n ? per * n : 0)}</b></div><div className="r"><small>Rate per {c.unit}</small><span>{inr(per)}/{c.unit}</span></div></div>
        <p className={'bv-err' + ((n && n < c.min) || n > c.max ? '' : ' hint')}>{n && n < c.min ? `Minimum quantity is ${c.min} ${c.units}` : n > c.max ? `Maximum ${c.max} ${c.units} per order` : 'Bigger quantity, lower price per ' + c.unit}</p>
        <button className="ba-btn wide" onClick={() => A.setcustom(pid)} disabled={!ok}>Set Quantity</button>
      </div></>
  );
}

/* quick view (Instamart-style): scrollable body (photos, name, price, variants, quantity, full-details button) with a
   sticky bottom bar (chosen variant + price + Add / stepper). Scrolling the body a little — or the full-details
   button / the name — grows the card into the product page (FLIP: pin its box, animate box, corners and padding to
   the screen edges; the photo lands where the gallery sits, on the same slide). Pulling down at the top closes it. */
function Quick({ pid }) {
  const { S, A } = useBuy();
  const p = P(pid), s = A.selOf(pid);
  const price = packPrice(p, s.sel, s.pack), mrp = mrpOf(p, unitPrice(p, s.sel)) * s.pack.n;
  const line = S.cart.find(l => l.key === lineKey(pid, s.sel, s.pack));
  const label = [selLabel(p, s.sel), s.pack.n > 1 || s.pack.custom ? packText(p, s.pack) : (p.opts.length ? '' : p.tag || p.packs[0].label)].filter(Boolean).join(' · ');
  const root = useRef(null), scroller = useRef(null), track = useRef(null), drag = useRef(null), busy = useRef(false), timer = useRef(0);
  const [slide, setSlide] = useState(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const modal = () => root.current && root.current.closest('.ba-modal');
  const expand = () => {
    const m = modal(); if (!m || busy.current) return;
    busy.current = true;
    const r = m.getBoundingClientRect(), pr = m.parentElement.getBoundingClientRect();
    const t = track.current, img = t ? Math.round(t.scrollLeft / (t.clientWidth || 1)) : 0;
    Object.assign(m.style, { transition: 'none', transform: 'none', opacity: 1, top: r.top - pr.top + 'px', left: r.left - pr.left + 'px', right: pr.right - r.right + 'px', height: r.height + 'px' });
    void m.offsetHeight;
    m.classList.add('qv-full');
    Object.assign(m.style, { transition: '', top: '0px', left: '0px', right: '0px', height: pr.height + 'px' });
    if (scroller.current) scroller.current.scrollTo({ top: 0, behavior: 'smooth' });
    timer.current = setTimeout(() => A.openfull(pid, img), 400);
  };
  /* scroll freely until the options end (the description starts) in view; scrolling 24px past that opens the full page */
  const more = useRef(null);
  const onScroll = e => {
    const sc = e.currentTarget, b = more.current; if (!b) return;
    const edge = b.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
    if (sc.scrollTop >= Math.max(24, edge - sc.clientHeight + 24)) expand();
  };
  /* pull-down-to-close: vertical drags that start with the body scrolled to the top (first 8px decide the axis) */
  const onTouchStart = e => { if (busy.current) return; const t = e.touches[0]; drag.current = { x: t.clientX, y: t.clientY, dy: 0, axis: '', top: !scroller.current || scroller.current.scrollTop <= 0 }; };
  const onTouchMove = e => {
    const d = drag.current; if (!d || !d.top) return;
    const t = e.touches[0], dx = t.clientX - d.x, dy = t.clientY - d.y;
    if (!d.axis) { if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; d.axis = Math.abs(dy) > Math.abs(dx) && dy > 0 ? 'down' : 'other'; }
    if (d.axis !== 'down') return;
    d.dy = dy;
    const m = modal(); if (!m) return;
    m.style.transition = 'none';
    m.style.transform = `translateY(calc(-50% + ${Math.max(0, dy) * 0.35}px))`;
  };
  const onTouchEnd = () => {
    const d = drag.current; drag.current = null;
    const m = modal(); if (!m || !d || d.axis !== 'down') return;
    m.style.transition = ''; m.style.transform = '';
    if (d.dy > 90) A.close();
  };
  return (
    <div className="bp-qv" ref={root} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd}>
      <i className="bp-qv-grab" aria-hidden="true" />
      <div className="bp-qv-scroll" ref={scroller} onScroll={onScroll}>
        {/* close stays pinned to the top corner while the sheet scrolls (until it grows into the full page) */}
        <div className="bp-qv-xpin"><button className="bp-qv-x" onClick={A.close} aria-label="Close">{ICO.close()}</button></div>
        <div className="bp-qv-media">
          <div className="bp-track" ref={track} onScroll={e => setSlide(Math.round(e.currentTarget.scrollLeft / (e.currentTarget.clientWidth || 1)))}>{p.img.map((i, k) => <img key={i} src={i} alt={p.name} data-fly={k ? undefined : p.id} />)}</div>
          {p.img.length > 1 ? <div className="bp-qv-dots">{p.img.map((i, k) => <i key={i} className={k === slide ? 'on' : ''} />)}</div> : null}
        </div>
        <div className="bp-qv-info">
          {/* the chosen variant, as on the product page (price lives in the bottom bar) */}
          <div className="bp-qv-head">
            <div className="bp2-tags">{[...p.opts.map(o => s.sel[o.name]), ...(p.opts.length ? [] : [p.tag || p.packs[0].label]), s.pack.n > 1 || s.pack.custom ? packText(p, s.pack) : null].filter(Boolean).map(t => <span key={t} className="ba-tag">{t}</span>)}</div>
            <p className="bp-qv-name" onClick={expand}>{p.name}</p>
          </div>
          {p.opts.length ? <OptionGroups p={p} s={s} /> : null}
          {p.custom ? <div className="bp-qv-qty"><p className="bp2-ol">Quantity</p><PackCards p={p} s={s} /></div> : null}
          <div className="bp-qv-desc" ref={more}><p className="bp2-h">Description</p><p>{p.desc}</p></div>
          <div className="bp-qv-sim"><p className="bp2-h">Similar products</p>
            <div className="bx-hlist">{PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 6).map(o => <MiniCard key={o.id} p={o} />)}</div></div>
        </div>
      </div>
      <div className="bp-qv-foot">
        <div className="bp-qv-sum"><small>{label || 'Standard'}</small><PriceRow price={price} mrp={mrp} /></div>
        {line ? <BigStep line={line} /> : <button className="ba-btn" onClick={() => A.addsel(pid)}>Add</button>}
      </div>
    </div>
  );
}

/* About Modulus Seventeen (the "17" button on the store bar): who makes BUY, what SELL is, and links to each landing page */
const M17 = [
  { id: 'buy', logo: 'logo-buy.svg', w: 80, who: 'For shoppers', text: 'Order from neighbourhood stores, pay online and track it live.', url: 'https://buy-preview.vercel.app', cta: 'Visit website' },
  { id: 'sell', logo: 'logo-sell.svg', w: 82, who: 'For shop owners', text: 'Billing, stock, sales and your BUY store, all in one app.', url: 'https://sell-landing-page-woad.vercel.app', cta: 'Visit website' },
];
function About17() {
  const open = u => window.open(u, '_blank', 'noopener');
  return (
    <><SheetHead title="Modulus Seventeen" sub="The team behind BUY & SELL" />
      <div className="bm-body">
        <div className="bm-hero">
          <img src="/assets/m17/logo-mark.svg" width="64" height="47" alt="Modulus Seventeen" />
          <p>One ecosystem for every Indian business. <b>SELL</b> runs the shop, <b>BUY</b> is where its customers order online, and both stay in sync.</p>
        </div>
        <div className="bm-apps">{M17.map(a => (
          <div key={a.id} className={'bm-app ' + a.id}>
            <img className="bm-logo" src={'/assets/m17/' + a.logo} width={a.w} height="40" alt={a.id.toUpperCase()} /><span className="bm-who">{a.who}</span>
            <p>{a.text}</p>
            <button className="bm-go" onClick={() => open(a.url)}>{a.cta}<i aria-hidden="true" /></button>
          </div>
        ))}</div>
        <button className="ba-btn wide" onClick={() => open('https://modulusseventeen.com')}>Explore Modulus Seventeen</button>
      </div></>
  );
}

function Pay() {
  const { S, A } = useBuy();
  const b = calcBill(S.cart);
  const opts = [['UPI', 'Google Pay, PhonePe, Paytm & more', <img key="u" src={FG + 'cart/ic-upi.svg'} width="30" height="30" alt="" />], ['Credit / Debit Card', 'Visa, Mastercard, RuPay'], ['Net Banking', 'All major banks']];
  return (
    <div className="bc-pay"><SheetHead title="Modulus Seventeen Pay" sub={`Paying ${STORE.name}`} />
      <div className="bc-sh">
        <div className="bc-pay-amt"><small>Amount to pay</small><b>{inr(b.total)}</b><span className="bc-pay-n">{b.count} Item{b.count === 1 ? '' : 's'} · {STORE.name}</span></div>
        <div className="bc-pay-o">{opts.map(([t, s, ic], i) => <label key={t}><input type="radio" name="bapm" defaultChecked={!i} /><span className="bc-pay-t"><b>{t}</b><small>{s}</small></span>{ic}</label>)}</div>
        <p className="bc-note">Your money is held safely in the Modulus Seventeen gateway and settled to the store only after delivery.</p>
        <button className="ba-btn wide" onClick={A.paynow}>Pay {inr(b.total)}</button>
      </div>
      <div className="bc-paying"><span className="bc-spin" /><b>Processing payment</b><small>Do not close this window</small></div>
      <div className="bc-paid"><span className="bc-tick"><img src={FG + 'cart/ic-check-green.svg'} width="14" height="14" alt="" /></span><b>Payment successful</b><span className="bc-ok"><img src={FG + 'cart/ic-check-green.svg'} width="14" height="14" alt="" />{inr(b.total)} paid</span></div>
    </div>
  );
}

function Unlock({ id }) {
  const { S, A } = useBuy();
  const o = OFFERS.find(x => x.id === id) || OFFERS[0], b = calcBill(S.cart);
  const btn = <button className="ba-btn outline wide bu-ok" onClick={A.close}>Woohoo! Thanks</button>;
  if (o.id === 'free') return (
    <div className="bu"><div className="bu-ill"><span className="bu-lines"><i /><i /><i /></span><img src="/assets/fig/scooter.svg" alt="" /></div>
      <span className="bu-chip">Congrats!</span><p className="bu-big"><b>Free</b><s>₹49</s></p><p className="bu-sub">You unlocked Free Delivery</p>{btn}</div>
  );
  return (
    <div className="bu"><div className="bu-tick"><span className="bu-rays">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</span><span className="bu-c"><svg viewBox="0 0 24 24" width="32" height="32"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
      <p className="bu-t">{o.id === 'disc' ? 'Festive Offer' : 'Free Gift Unlocked'}</p><p className="bu-sub2">{o.id === 'disc' ? '50% Off Applied !' : 'Canvas Tote Bag added !'}</p>
      <p className="bu-saved">You saved {inr(o.id === 'disc' ? b.disc : 299)}</p>{btn}<span className="bu-conf">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span></div>
  );
}

export const SHEETS = { more: More, sort: Sort, offers: Offers, amount: Amount, variants: Variants, custom: Custom, quick: Quick, otp: Otp, m17: About17, pay: Pay, unlock: Unlock };
export const MODALS = new Set(['quick', 'unlock']);
export const renderSheet = (name, arg) => { const C = SHEETS[name]; return C ? <C pid={arg} id={arg} /> : null; };
