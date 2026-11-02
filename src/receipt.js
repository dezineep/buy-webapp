/* Order receipt. downloadReceipt saves a PDF directly; receiptHTML is the same receipt as a styled HTML page. */
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

/* Download Receipt: builds a one-page PDF (jsPDF, loaded only when needed) and saves it straight away as
   BUY-Receipt-<id>.pdf — no new tab, no print sheet. Amounts use "Rs." because the built-in PDF fonts have no ₹. */
const R = [165, 34, 38], INK = [34, 34, 34], MUTED = [142, 142, 142], LINE = [228, 228, 228], GREEN = [1, 138, 12];
const rs = n => 'Rs. ' + Math.round(n).toLocaleString('en-IN');

export async function downloadReceipt(o) {
  const { jsPDF } = await import('jspdf');
  // lay the receipt out once on a tall page to measure it, then again on a page cut to fit (A5 width, never shorter)
  const probe = new jsPDF({ unit: 'pt', format: [419.53, 2400] });
  const h = Math.max(595.28, drawReceipt(probe, o) + 56);
  const doc = new jsPDF({ unit: 'pt', format: [419.53, h] });
  drawReceipt(doc, o);
  doc.save(`BUY-Receipt-${o.id}.pdf`);
}

/* draws the receipt top-down and returns where the content ends */
function drawReceipt(doc, o) {
  const b = o.bill || {}, a = o.addr || {}, u = o.user || {};
  const W = doc.internal.pageSize.getWidth(), M = 32;
  let y = 0;
  const text = (t, x, yy, { size = 10, color = INK, bold = false, align = 'left' } = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...color);
    doc.text(String(t), x, yy, { align });
  };
  const rule = (yy, dash) => { doc.setDrawColor(...LINE); doc.setLineWidth(.8); if (dash) doc.setLineDashPattern([3, 3], 0); doc.line(M, yy, W - M, yy); doc.setLineDashPattern([], 0); };

  // header band
  doc.setFillColor(249, 231, 232); doc.rect(0, 0, W, 96, 'F');
  text(STORE.name, M, 36, { size: 16, bold: true });
  text(`${STORE.area} · ${STORE.phone}`, M, 52, { size: 8.5, color: MUTED });
  doc.setFillColor(...R); doc.roundedRect(W - M - 46, 24, 46, 18, 9, 9, 'F');
  text('PAID', W - M - 23, 36.5, { size: 8.5, color: [255, 255, 255], bold: true, align: 'center' });
  text('ORDER RECEIPT', M, 80, { size: 9, color: R, bold: true });

  // meta
  y = 118;
  const meta = [['Order ID', '#' + o.id], ['Placed on', `${fmtShort(o.placedAt)}, ${fmtTime(o.placedAt)}`], ['Transaction ID', o.txn || '—'], ['Payment', 'Modulus Seventeen Pay']];
  meta.forEach(([k, v], n) => {
    const x = n % 2 ? W / 2 + 4 : M, yy = y + Math.floor(n / 2) * 30;
    text(k, x, yy, { size: 8, color: MUTED }); text(v, x, yy + 12, { size: 9.5, bold: true });
  });
  y += 66; rule(y, true);

  // items
  y += 22; text('ITEMS', M, y, { size: 9, color: R, bold: true });
  text('QTY', W - M - 90, y, { size: 8, color: MUTED, align: 'center' }); text('AMOUNT', W - M, y, { size: 8, color: MUTED, align: 'right' });
  y += 8;
  (o.items || []).forEach(i => {
    y += 18;
    const name = doc.splitTextToSize(i.name, W - 2 * M - 130);
    text(name[0], M, y, { size: 10, bold: true });
    text(i.qty, W - M - 90, y, { size: 10, align: 'center' });
    text(i.price ? rs(i.price * i.qty) : 'Free', W - M, y, { size: 10, align: 'right', color: i.price ? INK : GREEN });
    if (i.label) { y += 12; text(i.label, M, y, { size: 8, color: MUTED }); }
    y += 8; rule(y);
  });

  // bill
  y += 24; text('BILL DETAILS', M, y, { size: 9, color: R, bold: true });
  const row = (k, v, color = INK) => { y += 17; text(k, M, y, { size: 9.5, color: [85, 85, 85] }); text(v, W - M, y, { size: 9.5, color, align: 'right' }); };
  row(`Item total (${b.count || 0} item${b.count === 1 ? '' : 's'})`, rs(b.sub || 0));
  row('Delivery charge', b.delivery ? rs(b.delivery) : 'FREE', b.delivery ? INK : GREEN);
  if (b.disc) row('Discount', '- ' + rs(b.disc), GREEN);
  row('GST (5%)', rs(b.gst || 0));
  y += 12; doc.setDrawColor(0, 0, 0); doc.setLineWidth(1); doc.line(M, y, W - M, y);
  y += 20; text('Total paid', M, y, { size: 13, bold: true }); text(rs(b.total || 0), W - M, y, { size: 13, bold: true, align: 'right' });
  const saved = (b.mrp || 0) - (b.sub || 0) + (b.disc || 0);
  if (saved > 0) {
    y += 16; doc.setFillColor(230, 247, 231); doc.roundedRect(M, y, W - 2 * M, 22, 8, 8, 'F');
    text(`You saved ${rs(saved)} on this order`, M + 10, y + 14.5, { size: 9, color: GREEN, bold: true }); y += 22;
  }

  // deliver to
  y += 28; rule(y - 14, true);
  text('DELIVER TO', M, y, { size: 9, color: R, bold: true });
  const who = [u.name, u.phone && '+91 ' + u.phone].filter(Boolean).join('  ·  ');
  if (who) { y += 16; text(who, M, y, { size: 10, bold: true }); }
  else y += 3;
  const addr = doc.splitTextToSize([a.street, a.road, a.area, a.city && `${a.city} ${a.pin || ''}`].filter(Boolean).join(', '), W - 2 * M);
  addr.forEach(l => { y += 13; text(l, M, y, { size: 9, color: [85, 85, 85] }); });

  text(`Thank you for shopping with ${STORE.name} on BUY · a Modulus Seventeen product`, W / 2, doc.internal.pageSize.getHeight() - 24, { size: 7.5, color: MUTED, align: 'center' });
  return y;
}
