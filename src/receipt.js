/* Order receipt: a self-contained, print-ready HTML page (BUY red, Plus Jakarta Sans) opened in a new tab with the
   browser's print / "Save as PDF" sheet. If the browser blocks the new tab, the same page downloads as an .html file. */
import { STORE, inr, fmtTime, fmtShort } from './data.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function receiptHTML(o) {
  const b = o.bill || {}, a = o.addr || {}, u = o.user || {};
  const rows = (o.items || []).map(i => `<tr><td><b>${esc(i.name)}</b><small>${esc(i.label || '')}</small></td><td class="c">${i.qty}</td><td class="r">${i.price ? inr(i.price * i.qty) : 'Free'}</td></tr>`).join('');
  const line = (l, v, cls = '') => `<div class="row ${cls}"><span>${l}</span><span>${v}</span></div>`;
  const savings = (b.mrp || 0) - (b.sub || 0) + (b.disc || 0);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>BUY Receipt ${esc(o.id)}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box} body{margin:0;background:#f6f1f1;font:14px/1.45 "Plus Jakarta Sans",system-ui,sans-serif;color:#222}
  .sheet{max-width:560px;margin:24px auto;background:#fff;border:1px solid #000;border-radius:20px;box-shadow:3px 4px 0 #000;overflow:hidden}
  header{padding:22px 24px 18px;background:linear-gradient(180deg,#f9e7e8,#fff)}
  .brand{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
  .brand b{font-size:20px;letter-spacing:-.4px} .brand small{display:block;color:#777;font-size:12px}
  .tag{display:inline-block;padding:4px 10px;border-radius:20px;background:#a52226;color:#fff;font-size:11px;font-weight:600;letter-spacing:.4px}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;margin-top:16px;font-size:12px}
  .meta span{display:block;color:#8e8e8e} .meta b{font-weight:600;color:#000;word-break:break-all}
  section{padding:16px 24px;border-top:1px dashed #e4e4e4}
  h3{margin:0 0 10px;font-size:13px;letter-spacing:.5px;text-transform:uppercase;color:#a52226}
  table{width:100%;border-collapse:collapse} td{padding:8px 0;vertical-align:top;border-bottom:1px solid #f1eeee}
  td small{display:block;color:#8e8e8e;font-size:11px} .c{text-align:center;width:40px} .r{text-align:right;white-space:nowrap}
  .row{display:flex;justify-content:space-between;padding:4px 0;color:#555} .row.g span:last-child{color:#01ae0f}
  .row.tot{margin-top:8px;padding-top:10px;border-top:1px solid #000;color:#000;font-size:18px;font-weight:700}
  .save{margin-top:10px;padding:8px 12px;border-radius:12px;background:rgba(1,174,15,.1);color:#018a0c;font-size:12px;font-weight:600}
  footer{padding:14px 24px 20px;color:#8e8e8e;font-size:11px;text-align:center}
  .print{display:block;margin:0 auto 24px;padding:12px 28px;border:1px solid #a52226;border-radius:16px;background:#a52226;color:#fff;font:600 15px "Plus Jakarta Sans",sans-serif;box-shadow:2px 3px 0 #000;cursor:pointer}
  @media print{body{background:#fff}.sheet{margin:0;box-shadow:none;border:0;border-radius:0}.print{display:none}}
</style></head><body>
<div class="sheet">
  <header>
    <div class="brand"><div><b>${esc(STORE.name)}</b><small>${esc(STORE.area)} · ${esc(STORE.phone)}</small></div><span class="tag">PAID</span></div>
    <div class="meta">
      <div><span>Order ID</span><b>#${esc(o.id)}</b></div>
      <div><span>Placed on</span><b>${fmtShort(o.placedAt)}, ${fmtTime(o.placedAt)}</b></div>
      <div><span>Transaction ID</span><b>${esc(o.txn || '—')}</b></div>
      <div><span>Payment</span><b>Modulus Seventeen Pay</b></div>
    </div>
  </header>
  <section><h3>Items</h3><table>${rows}</table></section>
  <section><h3>Bill details</h3>
    ${line(`Item total (${b.count || 0} item${b.count === 1 ? '' : 's'})`, inr(b.sub || 0))}
    ${line('Delivery charge', b.delivery ? inr(b.delivery) : 'FREE', b.delivery ? '' : 'g')}
    ${b.disc ? line('Discount', '- ' + inr(b.disc), 'g') : ''}
    ${line('GST (5%)', inr(b.gst || 0))}
    ${line('Total paid', inr(b.total || 0), 'tot')}
    ${savings > 0 ? `<div class="save">You saved ${inr(savings)} on this order</div>` : ''}
  </section>
  <section><h3>Deliver to</h3><div><b>${esc(u.name || '')}</b>${u.phone ? ` · +91 ${esc(u.phone)}` : ''}</div>
    <div style="color:#555">${esc([a.street, a.road, a.area].filter(Boolean).join(', '))}${a.city ? `, ${esc(a.city)} ${esc(a.pin || '')}` : ''}</div></section>
  <footer>Thank you for shopping with ${esc(STORE.name)} on BUY · a Modulus Seventeen product</footer>
</div>
<button class="print" onclick="window.print()">Save as PDF / Print</button>
</body></html>`;
}

export function downloadReceipt(o) {
  const html = receiptHTML(o);
  const w = window.open('', '_blank');
  if (w) {
    w.document.open(); w.document.write(html); w.document.close();
    // give the web font a moment, then raise the print / Save as PDF sheet (once, whichever fires first)
    let done = false;
    const go = () => { if (done) return; done = true; try { w.focus(); w.print(); } catch {} };
    w.addEventListener('load', () => setTimeout(go, 350));
    setTimeout(go, 1500);
    return true;
  }
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: `BUY-Receipt-${o.id}.html` });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return false;
}
