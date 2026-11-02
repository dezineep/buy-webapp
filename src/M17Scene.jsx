/* The modulusseventeen.com hero, in miniature: SELL and BUY with the |17| badge between them.
   Same pixel art and the same idle life as the landing page (breathing, blinking, eyes that glance at each other),
   plus the order loop: a "New order" chip leaves BUY's bag, crosses the badge to SELL, SELL bills it and sends
   "Rider assigned" back, and they high five. Tap a bot: it hops, hearts float up and it says a line.
   Styles: styles/m17.css (.m17-*) */
import { useEffect, useRef } from 'react';
import { SELL_BOT, BUY_BOT } from './m17bots.js';

const LINES = {
  sell: ['Hi, I’m SELL! I run your shop.', 'Stock, bills, orders, sorted.', 'Billing in one tap!', 'Hehe, that tickles!'],
  buy: ['Hi, I’m BUY! I bring you customers.', 'Zero commission. Promise.', 'Your shop, online in minutes.', 'Hehe, stop it!'],
};
const ORDERS = [840, 1250, 2460, 3100];
const HEART = ['01010', '11111', '11111', '01110', '00100'];
const COLOR = { sell: '#261f8e', buy: '#a52226' };
const heartSvg = c => `<svg viewBox="0 0 5 5" fill="${c}" shape-rendering="crispEdges">${HEART.map((r, y) => [...r].map((v, x) => (v === '1' ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : '')).join('')).join('')}</svg>`;
const wait = ms => new Promise(r => setTimeout(r, ms));
const rs = n => '₹' + n.toLocaleString('en-IN');

export default function M17Scene() {
  const stage = useRef(null), sell = useRef(null), buy = useRef(null), badge = useRef(null);
  const taps = useRef({ sell: 0, buy: 0 });

  useEffect(() => {
    const st = stage.current; if (!st) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bots = { sell: sell.current, buy: buy.current };
    let alive = true;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(() => alive && fn(), ms));

    const hop = b => { b.classList.remove('is-hopping'); void b.offsetWidth; b.classList.add('is-hopping'); later(() => b.classList.remove('is-hopping'), 650); };
    const say = (b, text, ms = 1900) => {
      const bub = b.querySelector('.m17-bubble'); bub.textContent = text;
      b.classList.add('has-bubble'); clearTimeout(b._bt); b._bt = setTimeout(() => b.classList.remove('has-bubble'), ms);
    };
    const hearts = (b, name, n = 2) => {
      if (reduce) return;
      for (let i = 0; i < n; i++) later(() => {
        const fx = document.createElement('span'); fx.className = 'm17-fx';
        fx.style.setProperty('--fx-x', 25 + Math.random() * 45 + '%'); fx.innerHTML = heartSvg(COLOR[name]);
        b.append(fx); setTimeout(() => fx.remove(), 1000);
      }, i * 140);
    };
    st._react = name => {
      const b = bots[name]; const t = taps.current[name]++;
      hop(b); hearts(b, name, 2); say(b, LINES[name][t % LINES[name].length]);
    };

    // blinking at random intervals, like the landing page
    Object.values(bots).forEach(b => {
      const blink = () => { b.classList.add('is-blinking'); later(() => { b.classList.remove('is-blinking'); later(blink, 2200 + Math.random() * 3600); }, 140); };
      later(blink, 900 + Math.random() * 1500);
    });

    // an order flies between them as a labelled chip (bag → badge → bag), centred on the bags
    const point = (el, side) => {
      const r = el.getBoundingClientRect(), s = st.getBoundingClientRect();
      const bag = el.querySelector('.bot-bag');
      const br = bag ? bag.getBoundingClientRect() : r;
      return side === 'badge' ? { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 } : { x: br.left - s.left + br.width / 2, y: br.top - s.top + br.height / 2 };
    };
    const fly = (from, to, label, color, ms) => new Promise(done => {
      if (reduce) return done();
      const chip = document.createElement('span'); chip.className = 'm17-chip'; chip.textContent = label; chip.style.setProperty('--c', color);
      st.append(chip);
      const a = chip.animate([
        { transform: `translate(${from.x}px, ${from.y}px) scale(.4)`, opacity: 0 },
        { transform: `translate(${from.x + (to.x - from.x) * .15}px, ${from.y - 14}px) scale(1)`, opacity: 1, offset: .2 },
        { transform: `translate(${to.x - (to.x - from.x) * .1}px, ${to.y - 14}px) scale(1)`, opacity: 1, offset: .85 },
        { transform: `translate(${to.x}px, ${to.y}px) scale(.5)`, opacity: 0 },
      ], { duration: ms, easing: 'cubic-bezier(.45, 0, .3, 1)' });
      a.onfinish = () => { chip.remove(); done(); };
    });
    const pulse = () => { const b = badge.current; b.classList.remove('is-pulse'); void b.offsetWidth; b.classList.add('is-pulse'); };

    (async () => {
      await wait(900);
      let i = 0;
      while (alive) {
        const amt = ORDERS[i++ % ORDERS.length];
        say(bots.buy, 'New order! ' + rs(amt)); hop(bots.buy);
        await wait(500); if (!alive) return;
        const b = point(badge.current, 'badge');
        await fly(point(bots.buy), b, 'New order ' + rs(amt), COLOR.buy, 1000); if (!alive) return;
        pulse();
        await fly(b, point(bots.sell), 'Synced', COLOR.buy, 900); if (!alive) return;
        hop(bots.sell); say(bots.sell, 'Got it, billing now!');
        await wait(1300); if (!alive) return;
        await fly(point(bots.sell), b, 'Rider assigned', '#3f4ee3', 1000); if (!alive) return;
        pulse();
        await fly(b, point(bots.buy), 'On the way', '#3f4ee3', 900); if (!alive) return;
        say(bots.buy, 'Delivered! ' + rs(amt) + ' paid'); say(bots.sell, 'High five!');
        st.classList.add('is-high-five'); hop(bots.sell); hop(bots.buy); hearts(bots.sell, 'sell'); hearts(bots.buy, 'buy');
        await wait(900); st.classList.remove('is-high-five');
        await wait(2600);
      }
    })();
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  const tap = name => stage.current && stage.current._react && stage.current._react(name);
  return (
    <div className="m17-stage" ref={stage}>
      <button className="m17-bot bot-sell" ref={sell} onClick={() => tap('sell')} aria-label="Say hi to SELL">
        <span className="m17-bubble" aria-hidden="true" /><span className="m17-art" dangerouslySetInnerHTML={{ __html: SELL_BOT }} />
      </button>
      <span className="m17-badge" ref={badge}><img src="/assets/m17/logo-mark.svg" alt="Modulus Seventeen" /></span>
      <button className="m17-bot bot-buy" ref={buy} onClick={() => tap('buy')} aria-label="Say hi to BUY">
        <span className="m17-bubble" aria-hidden="true" /><span className="m17-art" dangerouslySetInnerHTML={{ __html: BUY_BOT }} />
      </button>
    </div>
  );
}
