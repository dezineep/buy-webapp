/* Fly-to-cart: when a product is added, a copy of its photo glides down from where it was tapped (card,
   search row, variants sheet, quick view or product page — any visible img[data-fly=pid]) into its round thumbnail
   in the cart pill. The thumbnail stays hidden during the flight and pops in as the photo lands. Screens without the
   pill fly to the product page's "View Cart" button instead; with neither on screen nothing flies. */
const visibleArea = el => {
  const r = el.getBoundingClientRect();
  const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0));
  const h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
  return el.offsetParent || getComputedStyle(el).position === 'fixed' ? w * h : 0;
};

/* where the photo should land; dy corrects for a pill that is still sliding up into place */
function landing(pid, src) {
  const wrap = document.querySelector('.ba-pillwrap.on');
  if (wrap) {
    const thumb = [...wrap.querySelectorAll('.bh-thumbs img')].find(i => i.getAttribute('src') === src);
    // while the pill celebrates an unlocked offer it shows a message instead of thumbnails: land on its right end
    let el = thumb ? thumb.parentElement : wrap.querySelector('.bh-thumbs em') || wrap.querySelector('.bh-thumbs');
    if (!el) {
      const pill = wrap.querySelector('.ba-pill'); if (!pill) return null;
      const r = pill.getBoundingClientRect(), ty = new DOMMatrix(getComputedStyle(wrap).transform).m42;
      return { el: pill, hide: false, rect: new DOMRect(r.right - 48, r.top + r.height / 2 - 12, 24, 24), dy: -ty, soft: true };
    }
    const ty = new DOMMatrix(getComputedStyle(wrap).transform).m42; // pill entrance: still offset by this much
    return { el, hide: !!thumb, rect: el.getBoundingClientRect(), dy: -ty };
  }
  // product page: land small on the cart glyph itself, not across the whole (possibly wide) button
  const btn = document.querySelector('.ba-screens > :last-child .bp2-cartbtn');
  if (!btn) return null;
  const glyph = btn.querySelector('img') || btn;
  return { el: btn, hide: false, rect: glyph.getBoundingClientRect(), dy: 0, btn: true };
}

/* the most visible photo of the product right now (call before closing a sheet that holds it). The product page's
   own gallery never flies: the product is already full screen there, so only its "similar" cards do. */
export function flySource(pid) {
  const page = document.querySelector('.ba-screens > :last-child');
  const onProduct = page && page.querySelector('.bp2');
  const best = [...document.querySelectorAll(`img[data-fly="${pid}"]`)]
    // only photos on the screen in front (screens underneath stay rendered); on the product page only its
    // "Add more to your order" cards fly, never its gallery or a sheet opened from it
    .filter(el => onProduct ? page.contains(el) && el.closest('.bx-hlist') : !el.closest('.ba-screens > :not(:last-child)')).map(el => [el, visibleArea(el)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1])[0];
  return best ? { src: best[0].getAttribute('src'), rect: best[0].getBoundingClientRect() } : null;
}

export function flyToCart(pid, captured) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // let React paint the new cart line (and the pill) first
  requestAnimationFrame(() => {
    const from = captured || flySource(pid);
    if (!from) return;
    const src = from.src;
    const to = landing(pid, src);
    if (!to) return;
    const a = from.rect;
    const size = Math.min(a.width, a.height, 150);
    const sx = a.left + a.width / 2, sy = a.top + a.height / 2;
    const tx = to.rect.left + to.rect.width / 2, ty = to.rect.top + to.rect.height / 2 + to.dy;
    const end = Math.min(Math.max(to.rect.width, 20), 40);

    // outer box moves sideways steadily, inner box moves up-then-down: together they trace an arc
    const outer = document.createElement('div');
    outer.className = 'ba-fly';
    outer.style.cssText = `left:${sx - size / 2}px;top:${sy - size / 2}px;width:${size}px;height:${size}px`;
    const inner = document.createElement('div');
    inner.className = 'ba-fly-in';
    const img = document.createElement('img');
    img.src = src; img.alt = '';
    inner.append(img); outer.append(inner); document.body.append(outer);
    if (to.hide) to.el.style.opacity = '0';

    // no lift: sideways motion eases out while the drop eases in, so the photo glides out and falls into the cart
    // bar along a smooth downward curve, shrinking steadily and rounding into the thumbnail as it goes
    const dur = 720;
    outer.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${tx - sx}px)` }], { duration: dur, easing: 'cubic-bezier(.3, .6, .35, 1)', fill: 'forwards' });
    inner.animate([
      { transform: 'translateY(0) scale(1)', borderRadius: '14px', offset: 0 },
      { transform: `translateY(${(ty - sy) * .22}px) scale(${Math.max(.36, 56 / size)})`, borderRadius: '40%', offset: .4 },
      { transform: `translateY(${ty - sy}px) scale(${end / size})`, borderRadius: '50%', offset: 1 },
    ], { duration: dur, easing: 'cubic-bezier(.5, 0, .55, 1)', fill: 'forwards' });
    const done = () => {
      outer.remove();
      if (to.hide) to.el.style.opacity = '';
      // landing nudge: a pop for the round thumbnail, only a light press for a whole button
      if (to.btn) to.el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 300, easing: 'ease-out' });
      else if (!to.soft) to.el.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(.95)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
      const pill = document.querySelector('.ba-pillwrap.on .ba-pill');
      if (pill) pill.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(3px) scale(.985)' }, { transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
    };
    setTimeout(done, dur);
  });
}
