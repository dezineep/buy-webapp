/* BUY app shell: screen stack with slide transitions, floating cart pill (home only), sheet layer, toast and
   order notification. Every stack entry stays mounted (scroll position survives going back); entries below the top
   slide out to the left, popped entries slide out to the right before unmounting. */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from './engine.jsx';
import { STORE, P, inr, calcBill, nextOffer, V2 } from './data.js';
import { Ring } from './ui.jsx';
import { renderSheet, MODALS } from './Sheets.jsx';
import Home from './screens/Home.jsx';
import Product from './screens/Product.jsx';
import Cart from './screens/Cart.jsx';
import Address from './screens/Address.jsx';
import Addresses from './screens/Addresses.jsx';
import Search from './screens/Search.jsx';
import Order from './screens/Order.jsx';
import Orders from './screens/Orders.jsx';
import Store from './screens/Store.jsx';
import Refunds, { RefundDetail } from './screens/Refunds.jsx';

const SCREENS = { home: Home, product: Product, cart: Cart, address: Address, addresses: Addresses, search: Search, order: Order, orders: Orders, store: Store, refunds: Refunds, refund: RefundDetail };

function Scr({ e, cls }) {
  const ref = useRef(null);
  const C = SCREENS[e.n];
  const [enter, setEnter] = useState(e.n !== 'home' && !e.instant);
  useLayoutEffect(() => { if (enter) requestAnimationFrame(() => requestAnimationFrame(() => setEnter(false))); }, []);
  return (
    <div ref={ref} className={'ba-scr' + (enter ? ' in-r' : '') + (cls ? ' ' + cls : '')} data-n={e.n}>
      {C ? <C entry={e} scRef={ref} /> : null}
    </div>
  );
}

function Screens() {
  const { S } = useBuy();
  // popped entries are worked out during render (not in an effect), so a screen that leaves the stack is never
  // missing from the list for a render: it keeps its instance and simply switches to the slide-out class
  const [prev, setPrev] = useState(S.stack);
  const [leaving, setLeaving] = useState([]);
  if (prev !== S.stack) {
    const keys = new Set(S.stack.map(e => e.k));
    const gone = prev.filter(e => !keys.has(e.k));
    setPrev(S.stack);
    if (gone.length) setLeaving(l => [...l.filter(x => !keys.has(x.k)), ...gone]);
  }
  useEffect(() => {
    if (!leaving.length) return;
    const batch = leaving, t = setTimeout(() => setLeaving(l => l.filter(x => !batch.includes(x))), 400);
    return () => clearTimeout(t);
  }, [leaving]);
  const top = S.stack.length - 1;
  const keys = new Set(S.stack.map(e => e.k));
  return (
    <div className="ba-screens">
      {/* one keyed list, so moving from the stack to `leaving` never remounts a screen */}
      {[...S.stack.map((e, i) => [e, i < top ? 'under' : '']), ...leaving.filter(e => !keys.has(e.k)).map(e => [e, 'out-r'])]
        .map(([e, cls]) => <Scr key={e.k} e={e} cls={cls} />)}
    </div>
  );
}

/* floating cart pill — Figma 2167:7332 (364 wide, p 10, radius 25, ring 30, CART + thumbs + chevrons) */
function Pill() {
  const { S, A } = useBuy();
  const top = S.stack[S.stack.length - 1].n;
  const show = (top === 'home' || top === 'search') && S.cart.length > 0;
  const b = calcBill(S.cart), next = nextOffer(b.sub);
  const st = S.pill?.state || '';
  const box = useRef(null);
  useEffect(() => { // confetti when an offer unlocks
    if (st !== 'congrats' || !box.current) return;
    const colors = ['#a52226', '#f2b233', '#01ae0f', '#3f4ee3', '#f2a0a4'];
    for (let i = 0; i < 18; i++) {
      const c = document.createElement('i');
      c.className = 'ba-conf';
      c.style.background = colors[i % colors.length];
      c.style.left = 20 + Math.random() * 60 + '%';
      c.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      c.style.setProperty('--dy', (-40 - Math.random() * 70) + 'px');
      c.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
      box.current.append(c);
      setTimeout(() => c.remove(), 1200);
    }
  }, [S.pill?.id]);
  let body;
  if (st === 'congrats') body = <div className="bh-pill-msg bh-congrats" role="status"><img className="bh-congrats-ic" src="/assets/figma/home/ic-congrats-scooter.svg" width="24" height="24" alt="" /><b>Congratulations !</b></div>;
  else if (st === 'saved') {
    const o = S.pill.offer;
    const saved = o.id === 'disc' ? b.disc : o.id === 'gift' ? 299 : 49;
    body = <button className="bh-pill-msg bh-saved" onClick={A.cart} role="status"><span>You have unlocked <em>{o.unlocked}</em></span><small>Saved <strong>{inr(saved)}</strong></small></button>;
  } else {
    const shown = S.cart.slice(0, 3), more = S.cart.length - shown.length;
    body = (
      <button key={S.pill?.id || 0} className={'bh-pill' + (S.pill?.enter ? ' enter' : '')} onClick={A.cart} aria-label="View cart">
        <span className="bh-pill-l">
          {next ? <Ring p={b.sub / next.min} kind={next.kind} /> : <Ring p={1} kind="gift" />}
          <span className="bh-pill-t">{next ? <><b>{next.short}</b><small>Add more <strong>{inr(next.min - b.sub).replace('₹', '₹ ')}</strong></small></> : <><b>All offers unlocked</b><small>You saved <strong>{inr(b.mrp - b.sub + b.disc)}</strong></small></>}</span>
        </span>
        <i className="bh-pill-sep" aria-hidden="true" />
        <span className="bh-pill-r">
          <span className="bh-pill-c"><b>CART</b><small>{b.count} Item{b.count === 1 ? '' : 's'}</small></span>
          <span className="bh-thumbs">{shown.map(l => <i key={l.key}><img src={P(l.pid).img[0]} alt="" /></i>)}{more > 0 ? <em>{more}+</em> : null}</span>
          <img className="bh-pill-go" src={V2 + 'home/ic-chevrons-right.svg'} width="20" height="20" alt="" />
        </span>
      </button>
    );
  }
  return <div className={'ba-pillwrap' + (show ? ' on' : '')}><div ref={box} className="ba-pill" data-state={st}>{body}</div></div>;
}

function Layer() {
  const { S, A } = useBuy();
  const sh = S.sheet;
  const kind = sh && MODALS.has(sh.name) ? 'modal' : 'sheet';
  return (
    <div className={'ba-layer' + (sh && sh.on ? ' on' : '')}>
      {sh ? <>
        <div className="ba-dim" onClick={A.close} />
        <div className={`ba-${kind} ba-sh-${sh.name}${sh.bye ? ' bye' : ''}${sh.paying ? ' paying' : ''}${sh.paid ? ' paid' : ''}`} role="dialog" aria-modal="true">
          {renderSheet(sh.name, sh.arg)}
        </div>
      </> : null}
    </div>
  );
}

function Notif() {
  const { S, A } = useBuy();
  const [last, setLast] = useState(null);
  useEffect(() => { if (S.notif) setLast(S.notif); }, [S.notif]);
  const n = S.notif || last;
  return (
    <div className={'ba-notif' + (S.notif ? ' on' : '')}>
      {n ? <button onClick={() => A.openorder(n.id)}><img src={STORE.logo} alt="" /><span><b>{STORE.name} · BUY</b><small>{n.text}</small></span></button> : null}
    </div>
  );
}

/* iOS Safari ignores interactive-widget=resizes-content, so the on-screen keyboard would cover bottom-anchored UI
   (the cart pill on search). Publish the keyboard height as --kb from the visual viewport; on Android the layout
   viewport already shrinks, so this stays 0 there. */
function useKeyboardInset() {
  useEffect(() => {
    const vv = window.visualViewport; if (!vv) return;
    const set = () => document.documentElement.style.setProperty('--kb', Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) + 'px');
    set();
    vv.addEventListener('resize', set); vv.addEventListener('scroll', set);
    return () => { vv.removeEventListener('resize', set); vv.removeEventListener('scroll', set); };
  }, []);
}

export default function App() {
  const { S } = useBuy();
  useKeyboardInset();
  const [msg, setMsg] = useState('');
  useEffect(() => { if (S.toast) setMsg(S.toast.msg); }, [S.toast]);
  return (
    <div className="ba">
      <Screens />
      <Pill />
      <Layer />
      <Notif />
      <div className={'ba-toast' + (S.toast ? ' on' : '')} role="status">{msg}</div>
    </div>
  );
}
