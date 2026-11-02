/* BUY customer app — engine. Owns state, navigation, sheets, cart logic and actions.
   State lives in one mutable object (S) held in a ref; every action mutates it and calls commit() to re-render,
   exactly like the landing-page demo engine, so screens stay simple readers of S.

   Screens: home, login, category{cat}, product{pid}, cart, address, order{id}, orders, store, refunds, refund{id}
   Sheets : more, sort, amount, offers, variants{pid}, custom{pid}, quick{pid} (modal), otp, m17, pay, unlock{id} (modal) */
import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { P, OFFERS, PARTNER, STORE, IMG, GIFT, calcBill, lineInfo, lineKey, defaultSel, seedOrders, seedRefunds, seedAddresses } from './data.js';
import { applyShop } from './shops.js';
import { flyToCart, flySource } from './fly.js';

/* the prototype opens on the shop-type picker; the last pick is remembered so it can be confirmed with one tap */
const SHOP_KEY = 'buy.shop';
const savedShop = (() => { try { return localStorage.getItem(SHOP_KEY) || 'fashion'; } catch { return 'fashion'; } })();
applyShop(savedShop);

const Ctx = createContext(null);
export const useBuy = () => useContext(Ctx);

const SAMPLE_ADDR = { street: 'Flat 23, 4th Cross, 6th Main', road: 'Near BDA Complex', area: 'HSR Layout', pin: '560102', city: 'Bengaluru', state: 'Karnataka' };
let K = 0;
const entry = (n, extra = {}) => ({ n, k: ++K, ...extra });

const initState = () => ({
  stack: [entry('home')], cart: [], cat: 'all', search: '', sort: 'rel', user: null, addr: null,
  orders: seedOrders(), refunds: seedRefunds(), addresses: seedAddresses(), unlocked: new Set(), checkout: false, fresh: {},
  sel: {}, sheet: null, pill: null, toast: null, notif: null, heroI: 0, rtab: 'pending', ofilter: 'all',
  shop: savedShop, picker: true,
});

export function BuyProvider({ children }) {
  const ref = useRef(null);
  if (!ref.current) ref.current = initState();
  const S = ref.current;
  const [, tick] = useReducer(x => x + 1, 0);
  const commit = tick;
  const timers = useRef({});
  const later = (name, fn, ms) => { clearTimeout(timers.current[name]); timers.current[name] = setTimeout(fn, ms); };

  const cur = () => S.stack[S.stack.length - 1];
  const openLogin = () => {
    S.login = { phone: S.user?.phone || '', name: S.user?.name || '', verified: !!S.user, otp: '', err: '', oerr: '' };
    if (S.sheet) closeSheet();
    if (cur().n !== 'login') go('login'); else commit();
  };
  const toast = msg => { S.toast = { msg, id: Date.now() }; commit(); later('toast', () => { S.toast = null; commit(); }, 2200); };

  /* ---------- navigation (each push adds a browser history entry so the phone's back gesture works) ---------- */
  const go = (n, extra) => { S.stack = [...S.stack, entry(n, extra)]; history.pushState({ buy: S.stack.length }, ''); commit(); };
  const reset = (...entries) => { S.stack = [S.stack[0], ...entries.map(([n, x]) => entry(n, x))]; history.pushState({ buy: S.stack.length }, ''); commit(); };
  const pop = (depth = S.stack.length - 1) => {
    if (S.sheet) closeSheet();
    const n = Math.max(1, Math.min(depth, S.stack.length));
    if (n < S.stack.length) { S.stack = S.stack.slice(0, n); commit(); }
  };
  const back = () => { if (S.stack.length > 1 && history.state && history.state.buy > 1) history.back(); else pop(); };
  useEffect(() => {
    // the history entry we land on knows how deep the stack was when it was pushed
    // a smaller depth than now means the user jumped several entries back; anything else (including stale entries
    // left from before a page reload) is a plain one-step back
    history.replaceState({ buy: 1 }, '');
    const onPop = e => {
      // phone back with a sheet open only closes the sheet: put back the entry the browser just consumed
      if (S.sheet && !S.sheet.bye) { closeSheet(); history.pushState({ buy: S.stack.length }, ''); return; }
      const d = e.state && e.state.buy; pop(d && d < S.stack.length ? d : S.stack.length - 1);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const home = () => { S.stack = [S.stack[0]]; commit(); };

  /* ---------- sheets ---------- */
  const openSheet = (name, arg) => { S.sheet = { name, arg, on: false, id: Date.now() }; commit(); requestAnimationFrame(() => requestAnimationFrame(() => { if (S.sheet) { S.sheet.on = true; commit(); } })); };
  const closeSheet = () => {
    if (!S.sheet) return;
    const id = S.sheet.id;
    S.sheet = { ...S.sheet, on: false, bye: true }; commit();
    later('sheet', () => { if (S.sheet && S.sheet.id === id) { S.sheet = null; commit(); } }, 320);
  };

  /* ---------- cart ---------- */
  // fly: the photo flies into the cart pill — on every "+" / "Add to Cart", never on stepper increments
  const addLine = (pid, sel, pack, fly) => {
    const key = lineKey(pid, sel, pack);
    const l = S.cart.find(x => x.key === key);
    if (fly) requestAnimationFrame(() => flyToCart(pid, typeof fly === 'object' ? fly : null));
    if (l) S.cart = S.cart.map(x => (x === l ? { ...x, qty: x.qty + 1 } : x));
    else S.cart = [...S.cart, { key, pid, sel: { ...sel }, pack: { ...pack }, qty: 1 }];
    cartChanged();
  };
  const changeKey = (key, d) => {
    S.cart = S.cart.map(x => (x.key === key ? { ...x, qty: x.qty + d } : x)).filter(x => x.qty > 0);
    cartChanged();
  };
  const cartChanged = () => {
    const b = calcBill(S.cart);
    S.fresh = {};
    const newly = [];
    OFFERS.forEach(o => {
      if (b.sub >= o.min && !S.unlocked.has(o.id)) { S.unlocked.add(o.id); newly.push(o); S.fresh[o.id] = true; }
      if (b.sub < o.min) S.unlocked.delete(o.id);
    });
    if (newly.length) {
      const o = newly[newly.length - 1];
      S.pill = { state: 'congrats', offer: o, id: Date.now() };
      later('pill', () => {
        S.pill = { state: 'saved', offer: o, id: Date.now() }; commit();
        later('pill', () => { S.pill = { state: '', id: Date.now(), enter: true }; commit(); }, 2200);
      }, 1400);
      // the pill celebrates on home / search; elsewhere a pop-up does, unless another sheet is open
      // screens with the floating cart bar already celebrate the unlock there, so the modal only shows elsewhere
      const pillHere = () => ['home', 'search', 'category'].includes(cur().n);
      if (!pillHere()) later('unlock', () => { if (!pillHere() && (!S.sheet || S.sheet.bye)) openSheet('unlock', o.id); }, 250);
    }
    commit();
  };

  /* current selection on a product page / variants sheet: { sel: {Size, Color}, pack: { n, custom } } */
  const selOf = pid => {
    const p = P(pid);
    if (!S.sel[pid]) S.sel[pid] = { sel: defaultSel(p), pack: { n: p.packs[0].n } };
    return S.sel[pid];
  };

  /* ---------- orders ---------- */
  const placeOrder = () => {
    const b = calcBill(S.cart);
    const now = new Date();
    const L = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const o = {
      id: 'ORD' + (4100 + Math.floor(Math.random() * 899)) + L() + L(),
      otp: String(1000 + Math.floor(Math.random() * 9000)), status: 'placed', placedAt: now, times: { placed: now },
      txn: 'T' + Date.now().toString().slice(-6) + String(Math.floor(Math.random() * 1e10)).padStart(10, '0'),
      items: S.cart.map(l => { const i = lineInfo(l); return { pid: l.pid, name: i.p.name, label: i.label, qty: l.qty, price: i.price, img: i.p.img[0] }; }),
      bill: b, user: { ...S.user }, addr: { ...S.addr },
    };
    if (b.gift) o.items.push({ pid: 'gift', name: GIFT.name, label: 'Free', qty: 1, price: 0, img: IMG + 'm-shirts.jpg' });
    S.orders = [o, ...S.orders];
    S.cart = []; S.unlocked.clear(); S.checkout = false; S.pill = null;
    reset(['order', { id: o.id, fresh: true }]);
    // the store moves the order along so the status screen comes alive
    const steps = [['accepted', 6000], ['packed', 14000], ['dispatched', 24000], ['delivered', 40000]];
    steps.forEach(([st, ms]) => setTimeout(() => setStatus(o.id, st), ms));
  };
  const notify = (text, id) => { S.notif = { text, id, k: Date.now() }; commit(); later('notif', () => { S.notif = null; commit(); }, 4200); };
  const setStatus = (id, status) => {
    const o = S.orders.find(x => x.id === id);
    if (!o) return;
    if (status !== 'accepted') o.status = status;
    o.times[status] = new Date();
    const msg = { accepted: 'The store has accepted your order', packed: 'Your order has been packed', dispatched: `${PARTNER.name} is on the way. Your OTP is ${o.otp}`, delivered: 'Order delivered. Enjoy your purchase!' }[status];
    commit();
    if (msg) notify(msg, id);
  };

  /* ---------- actions ---------- */
  // saved addresses exist -> let the customer pick one (Swiggy style); none yet -> straight to the form
  const toAddr = () => { S.addrFirst = false; if (S.addresses.length) go('addresses'); else { S.editing = null; S.addrMode = 'new'; S.draft = {}; go('address'); } };

  const A = {
    back, home, go, toast, openSheet, closeSheet, selOf, commit,
    close: closeSheet,
    store: () => { closeSheet(); go('store'); },
    opencat: cat => { closeSheet(); go('category', { cat }); },
    openpicker: () => { closeSheet(); S.picker = true; commit(); },
    pickshop: id => {
      applyShop(id); S.shop = id; S.cat = 'all'; S.prevCat = 'all'; S.picker = false;
      try { localStorage.setItem(SHOP_KEY, id); } catch { /* private mode */ }
      if (S.stack.length > 1) pop(1);
      commit();
    },
    m17: () => openSheet('m17'),
    share: () => { const url = `modulusbuy.com/${STORE.slug}`; if (navigator.share) navigator.share({ title: STORE.name, url: 'https://' + url }).catch(() => {}); else toast(`Store link copied: ${url}`); },
    more: () => openSheet('more'),
    /* address book: opening it from the home "Deliver to" row / More sheet / cart picks the delivery address */
    address: () => { S.fromHome = cur().n === 'home' && !S.sheet; closeSheet(); S.checkout = false; S.toCart = false; S.addrFirst = false; go('addresses'); },
    /* Figma 2174:7989 "New Address" (search + map + form) and 2174:7773 "Your Current Location" (map + prefilled form) */
    newaddr: () => { closeSheet(); S.addrFirst = false; S.editing = null; S.located = false; S.addrMode = 'new'; S.draft = {}; go('address'); },
    curaddr: () => { closeSheet(); S.editing = null; S.located = true; S.addrMode = 'current'; S.draft = { ...SAMPLE_ADDR, dist: 1.4 }; go('address'); },
    editaddr: id => { closeSheet(); S.addrFirst = false; const a = S.addresses.find(x => x.id === id); S.editing = id; S.located = true; S.addrMode = 'new'; S.draft = { ...a }; go('address'); },
    deladdr: id => { closeSheet(); S.addresses = S.addresses.filter(x => x.id !== id); if (S.addr && S.addr.id === id) S.addr = null; commit(); toast('Address deleted'); },
    shareaddr: id => { closeSheet(); const a = S.addresses.find(x => x.id === id); const t = `${a.label}: ${[a.street, a.road, a.area, a.city, a.pin].filter(Boolean).join(', ')}`; if (navigator.share) navigator.share({ text: t }).catch(() => {}); else { navigator.clipboard && navigator.clipboard.writeText(t).catch(() => {}); toast('Address copied to share'); } },
    requestaddr: () => window.open('https://wa.me/?text=' + encodeURIComponent(`Hi! Please share your delivery address for my ${STORE.name} order on BUY.`), '_blank'),
    pickaddr: id => {
      S.addr = S.addresses.find(x => x.id === id);
      if (S.toCart) { S.toCart = false; S.stack = S.stack.slice(0, -1); go('cart'); }
      else if (S.checkout && S.cart.length) { back(); setTimeout(() => openSheet('pay'), 400); }
      else { toast(`Delivering to ${S.addr.label}`); back(); }
    },
    sort: () => openSheet('sort'),
    setsort: s => { S.sort = s; closeSheet(); },
    setcat: c => { if (S.cat !== c) { S.prevCat = S.cat; S.cat = c; commit(); } },
    opensearch: () => { closeSheet(); S.q = ''; go('search'); },
    setq: v => { S.q = v; commit(); },
    /* + on a card: products with sizes / colours open the variant sheet, the rest add one piece */
    add: pid => { const p = P(pid); if (p.opts.length) openSheet('variants', pid); else addLine(pid, {}, { n: p.packs[0].n }, true); },
    pinc: pid => { const lines = S.cart.filter(l => l.pid === pid); if (lines.length !== 1) openSheet('variants', pid); else changeKey(lines[0].key, 1); },
    pdec: pid => { const lines = S.cart.filter(l => l.pid === pid); if (lines.length > 1) openSheet('variants', pid); else if (lines[0]) changeKey(lines[0].key, -1); },
    addsel: pid => {
      const s = selOf(pid);
      // from the variants sheet: note where its photo is, close the sheet so the cart bar is in view, then fly
      if (S.sheet && S.sheet.name === 'variants' && !S.sheet.bye) { const from = flySource(pid); closeSheet(); addLine(pid, s.sel, s.pack, from || true); return; }
      addLine(pid, s.sel, s.pack, true);
    },
    inc: key => changeKey(key, 1),
    dec: key => changeKey(key, -1),
    product: pid => { closeSheet(); go('product', { pid }); },
    quick: pid => openSheet('quick', pid),
    /* quick view finished growing to full screen: swap in the product page without a slide, drop the modal at once */
    openfull: (pid, img = 0) => {
      // the quick view may have been closed (back / ✕) while it was growing: then stay where we are
      if (!S.sheet || S.sheet.name !== 'quick' || S.sheet.arg !== pid || S.sheet.bye) return;
      S.sheet = null; S.stack = [...S.stack, entry('product', { pid, instant: true, img })]; history.pushState({ buy: S.stack.length }, ''); commit();
    },
    selopt: (pid, name, v) => { const s = selOf(pid); s.sel = { ...s.sel, [name]: v }; commit(); },
    selpack: (pid, n) => { const s = selOf(pid); s.pack = { n }; commit(); },
    custom: pid => { S.cq = { v: '', pid }; openSheet('custom', pid); },
    cqset: v => { S.cq.v = v.replace(/\D/g, '').replace(/^0+/, '').slice(0, 3); commit(); },
    setcustom: pid => { const n = +S.cq.v; const s = selOf(pid); s.pack = { n, custom: true }; closeSheet(); commit(); toast(`Custom quantity set: ${n} ${P(pid).custom.units}`); },
    cart: () => {
      closeSheet();
      if (cur().n === 'cart') return;
      // the cart opens straight away; login and the delivery address are asked for at checkout
      go('cart');
    },
    // cart bar: a shopper without a delivery location adds one first (New Address screen), then lands on the cart;
    // once a location is set (it's remembered), the bar goes straight to the cart
    cartpill: () => {
      closeSheet();
      if (S.addr) { if (cur().n !== 'cart') go('cart'); return; }
      S.toCart = true; S.addrFirst = true; S.editing = null; S.located = false; S.addrMode = 'new'; S.draft = {};
      go('address');
    },
    offers: () => openSheet('offers'),
    amount: () => openSheet('amount'),
    checkout: () => {
      S.checkout = true;
      if (!S.user) openLogin();
      else if (!S.addr) toAddr();
      else openSheet('pay');
    },
    /* log in (Figma 724:2021 → OTP sheet 724:2395 → 724:2507): number → OTP → name. Any 6 digits verify in the demo. */
    details: () => openLogin(),
    lset: (k, v) => { S.login[k] = v; S.login.err = ''; commit(); },
    sendotp: () => {
      if (!/^[6-9]\d{9}$/.test(S.login.phone || '')) { S.login.err = 'Enter a valid 10-digit mobile number'; return commit(); }
      S.login.err = ''; S.login.otp = ''; S.login.oerr = ''; openSheet('otp');
    },
    lotp: v => { S.login.otp = v.replace(/\D/g, '').slice(0, 6); S.login.oerr = ''; commit(); },
    resendotp: () => { S.login.otp = ''; S.login.oerr = ''; commit(); toast(`New code sent to ****${S.login.phone.slice(-4)}`); },
    verifyotp: () => {
      if ((S.login.otp || '').length < 6) { S.login.oerr = 'Enter the 6-digit code'; return commit(); }
      S.login.verified = true; closeSheet(); toast('Mobile number verified');
    },
    changephone: () => { closeSheet(); S.login.verified = false; S.login.focusKey = Date.now(); commit(); },
    loginsave: () => {
      const name = (S.login.name || '').trim();
      if (name.length < 2) { S.login.err = 'Please enter your name'; return commit(); }
      S.user = { name, phone: S.login.phone };
      back();
      later('login', () => {
        if (S.toCart && !S.addr) toAddr();
        else if (S.toCart) { S.toCart = false; go('cart'); }
        else if (S.checkout && !S.addr) toAddr();
        else if (S.checkout) openSheet('pay');
        else toast(`Logged in as ${name}`);
      }, 360);
    },
    draft: (k, v) => { S.draft = S.draft || {}; S.draft[k] = k === 'pin' ? v.replace(/\D/g, '') : v; commit(); },
    locate: () => { S.located = true; S.draft = { ...SAMPLE_ADDR }; commit(); toast('Location found'); },
    saveaddr: () => {
      const a = S.draft || {};
      const miss = [['street', 'Street / Building'], ['area', 'Area / Locality'], ['city', 'City']].find(([k]) => !(a[k] || '').trim());
      if (miss) { S.aerr = `Please fill ${miss[1]}`; return commit(); }
      if (!/^\d{6}$/.test(a.pin || '')) { S.aerr = 'Enter a valid 6-digit pincode'; return commit(); }
      S.aerr = '';
      const saved = { state: 'Karnataka', type: 'home', label: 'Home', phone: S.user?.phone || '', dist: +(0.5 + Math.random() * 4).toFixed(1), ...a, id: S.editing || 'a' + Date.now() };
      S.addresses = S.editing ? S.addresses.map(x => (x.id === S.editing ? saved : x)) : [saved, ...S.addresses];
      S.addr = saved; S.editing = null;
      const fromBook = S.stack.length > 1 && S.stack[S.stack.length - 2].n === 'addresses';
      if (S.toCart) { S.toCart = false; S.addrFirst = false; S.stack = S.stack.slice(0, fromBook ? -2 : -1); go('cart'); }
      else if (S.checkout && S.cart.length) openSheet('pay');
      // picked "Use Current Location" from the home delivery bar: confirm it and go straight back home
      else if (S.fromHome) { S.fromHome = false; home(); toast(`Delivering to ${saved.area || saved.city}`); }
      else { toast('Address saved'); back(); }
    },
    paynow: () => {
      S.sheet = { ...S.sheet, paying: true }; commit();
      setTimeout(() => { S.sheet = { ...S.sheet, paying: false, paid: true }; commit(); }, 1500);
      setTimeout(() => { closeSheet(); placeOrder(); }, 2500);
    },
    myorders: () => { closeSheet(); reset(['orders']); },
    refunds: () => { closeSheet(); reset(['refunds']); },
    openrefund: id => go('refund', { id }),
    rtab: t => { S.rtab = t; commit(); },
    openorder: id => { closeSheet(); S.notif = null; reset(['order', { id }]); },
    ofilter: f => { S.ofilter = f; commit(); },
    again: id => {
      const o = S.orders.find(x => x.id === id);
      o.items.forEach(i => {
        if (i.pid === 'gift') return;
        const p = P(i.pid); const sel = defaultSel(p);
        p.opts.forEach(op => { const v = op.values.find(x => i.label.split(' · ').includes(x.v)); if (v) sel[op.name] = v.v; });
        for (let k = 0; k < i.qty; k++) addLine(p.id, sel, { n: p.packs[0].n });
      });
      reset(['cart']);
      toast('Items added back to your cart');
    },
    logout: () => { S.user = null; S.addr = null; closeSheet(); toast('Logged out. Your cart is still here.'); },
    copy: v => { navigator.clipboard && navigator.clipboard.writeText(v).catch(() => {}); toast('Copied ' + v); },
    callp: () => { location.href = 'tel:' + PARTNER.phone.replace(/\s/g, ''); },
    callstore: () => { location.href = 'tel:' + STORE.phone.replace(/\s/g, ''); },
    directions: () => window.open('https://maps.google.com/?q=' + encodeURIComponent(STORE.name + ' ' + STORE.area), '_blank'),
    whatsapp: () => window.open('https://wa.me/' + STORE.phone.replace(/\D/g, ''), '_blank'),
    support: () => { closeSheet(); go('store'); },
  };

  return <Ctx.Provider value={{ S, A }}>{children}</Ctx.Provider>;
}
