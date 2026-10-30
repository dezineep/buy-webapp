/* BUY · ORDER STATUS — Figma 925-3325 placed, 781-2949 packed, 786-5443 on the way, 983-2725 delivered (same as the demo)
   OrderSummary is reused by the refund detail screen. Styles: styles/order.css (.bo-*) */
import { useBuy } from '../engine.jsx';
import { FG, PARTNER, MON, STORE, fmtTime, fmtDay, fmtLong } from '../data.js';
import { Head, ICO } from '../ui.jsx';

const O = FG + 'order/';
const Img = ({ f, w, h, cls }) => <img className={cls} src={O + f} width={w} height={h} alt="" aria-hidden="true" />;

export const CopyBtn = ({ v }) => {
  const { A } = useBuy();
  return <button className="bo-copy" onClick={() => A.copy(v)}>{ICO.copy()}<span>Copy</span></button>;
};

export function ItemChips({ items }) {
  const more = items.length > 3 ? items.length - 3 : 0;
  const Item = ({ i }) => <span className="bo-it"><i>{i.qty}x</i>{i.name}{i.label ? ` · ${i.label}` : ''}</span>;
  return (
    <div className="bo-items">
      {items.slice(0, 3).map((i, n) => (n === 2 && more ? <span key={n} className="bo-it-row"><Item i={i} /><em>{more} More</em></span> : <Item key={n} i={i} />))}
    </div>
  );
}

function OrderSummary({ o }) {
  const a = o.addr;
  return (
    <div className="bo-sum">
      <div className="bo-sum-top"><p className="bo-sum-h">Order Summary</p><ItemChips items={o.items || []} /></div>
      <div className="ba-div dash" />
      <div className="bo-row"><Img f="ic-order-box.svg" w={30} h={30} /><div className="bo-row-t"><b>Order ID</b><small>#{o.id}</small></div><CopyBtn v={o.id} /></div>
      {o.txn ? <><div className="ba-div dash" /><div className="bo-row"><Img f="ic-txn.svg" w={30} h={30} /><div className="bo-row-t"><b>Transaction ID</b><small>{o.txn}</small></div><CopyBtn v={o.txn} /></div></> : null}
      {a && a.street ? <><div className="ba-div dash" />
        <div className="bo-row addr"><Img f="ic-pin.svg" w={30} h={30} /><div className="bo-row-t"><b>Delivery Address</b><small>{[a.street, a.area].filter(Boolean).join(', ')},<br />{[a.road, a.city].filter(Boolean).join(', ')} {a.pin}</small></div></div></> : null}
    </div>
  );
}

export default function Order({ entry }) {
  const { S, A } = useBuy();
  const o = S.orders.find(x => x.id === entry.id);
  if (!o) return null;
  const t = o.times || {}, st = o.status;
  const title = { placed: 'Order Placed', packed: 'Order Packed', dispatched: 'On the Way', delivered: 'Order Delivered', cancelled: 'Order Cancelled' }[st];
  const arrive = new Date(o.placedAt.getTime() + 2 * 864e5);
  const arriveShort = `${arrive.getDate()} ${MON[arrive.getMonth()]}`;
  let ill, h, p, small = '';
  if (st === 'placed') {
    ill = <Img f="ill-placed.png" w={130} h={104} cls="bo-ill placed" />;
    h = 'Order Placed !';
    p = 'Your order has been placed successfully and the items are yet to be packed soon';
    small = `Order placed on ${fmtTime(o.placedAt)}, ${fmtLong(o.placedAt)}`;
  } else if (st === 'packed' || st === 'dispatched') {
    ill = <Img f="ill-packed.png" w={151} h={115} cls="bo-ill ride" />;
    h = <>Your order is Arriving on<br />{fmtDay(arrive)}!</>;
    p = <>Your order has been packed and is arriving on {arriveShort}.<br />{st === 'packed' ? 'Delivery partner is yet to be assigned to your order' : 'Delivery partner has been assigned to your order'}</>;
    if (st === 'packed') small = `Order Packed on ${fmtTime(t.packed || new Date())}, ${fmtLong(t.packed || new Date())}`;
  } else if (st === 'cancelled') {
    ill = <Img f="ill-placed.png" w={130} h={104} cls="bo-ill placed" />;
    h = 'Order Cancelled';
    p = 'This order was cancelled by the store. Your refund is being processed.';
  } else {
    ill = <Img f="ill-delivered.png" w={191} h={124} cls="bo-ill box" />;
    h = 'Your order has been delivered!';
    p = `Your order from ${STORE.name} has reached you safely. Thank you for shopping with us, we hope you love the fit!`;
  }
  const at = t.dispatched || new Date();
  return (
    <div className={'bo st-' + st}><Head title={title} />
      <div className="bo-body">
        <div className="bo-info">
          {ill}
          <span className="bo-chip">{st === 'delivered' || st === 'cancelled' ? `Order #${o.id}` : `OTP : ${o.otp}`}</span>
          <div className="bo-msg"><h3 className="bo-h">{h}</h3><p className="bo-p">{p}</p></div>
          {small ? <p className="bo-small">{small}</p> : null}
        </div>
        {st === 'dispatched' ? (
          <div className="bo-partner">
            <p className="bo-partner-h">Assigned Delivery Partner</p>
            <div className="bo-pcard">
              <div className="bo-pmain"><Img f="avatar-partner.svg" w={56} h={77} cls="bo-pav" />
                <div className="bo-pinfo">
                  <div className="bo-ptop"><div className="bo-pname"><b>{PARTNER.name}</b><small>{PARTNER.phone}</small></div>
                    <button className="bo-call" onClick={A.callp} aria-label="Call delivery partner"><Img f="ic-call.svg" w={24} h={24} /></button></div>
                  <p className="bo-pat">Assigned at {fmtTime(at)}</p>
                </div>
              </div>
              <p className="bo-out"><Img f="ic-truck.svg" w={16} h={16} /><span>Out for delivery since {fmtTime(at)}</span></p>
            </div>
          </div>
        ) : null}
        {st !== 'delivered' && st !== 'cancelled' ? (
          <div className="bo-btns"><button className="ba-btn wide" onClick={A.myorders}>Track Order Status</button>
            <button className="ba-btn wide soft" onClick={A.home}>Continue Shopping</button></div>
        ) : null}
        <OrderSummary o={o} />
      </div>
    </div>
  );
}
