/* BUY · MY ORDERS — Figma 857-1943 (same as the demo). Styles: styles/orders.css (.bm-*) */
import { Fragment } from 'react';
import { useBuy } from '../engine.jsx';
import { FG, inr, fmtShort } from '../data.js';
import { Head } from '../ui.jsx';

const O = FG + 'orders/';
const Ic = ({ f, s = 14 }) => <img src={O + f} width={s} height={s} alt="" aria-hidden="true" />;
const St = ({ kind, icon, label }) => <span className={'bm-st ' + kind}><Ic f={icon} />{label}</span>;

function OrderCard({ o }) {
  const { A } = useBuy();
  const refund = o.refund ? <St kind="wait" icon="ic-refund-orange.svg" label="Refund Pending" /> : null;
  const chips = {
    placed: <St kind="wait" icon="ic-clock-orange.svg" label="Order In Review" />,
    packed: <St kind="ok" icon="ic-check-green.svg" label="Packed" />,
    dispatched: <><St kind="ok" icon="ic-scooter-green.svg" label="On the Way" /><span className="bm-otp">OTP: {o.otp}</span></>,
    delivered: <><St kind="ok" icon="ic-check-green.svg" label="Delivered" />{refund}</>,
    cancelled: <><St kind="no" icon="ic-cancel-red.svg" label="Cancelled" />{refund}</>,
  }[o.status];
  const n = o.items.reduce((a, i) => a + i.qty, 0);
  const done = o.status === 'delivered' || o.status === 'cancelled';
  const when = o.status === 'cancelled' ? `Cancelled on ${fmtShort(o.placedAt)}` : `${done ? 'Delivered on' : 'Arriving on'} ${fmtShort(done && o.past ? o.placedAt : new Date(o.placedAt.getTime() + 2 * 864e5))}`;
  const shown = o.items.slice(0, 3), more = o.items.length - shown.length;
  return (
    <div className="bm-card" onClick={() => A.openorder(o.id)}>
      <div className="bm-top"><div className="bm-info"><div className="bm-chips">{chips}</div><small>{when}</small></div><b>{inr(o.bill.total)}</b></div>
      <div className="bm-items">
        {shown.map((i, k) => {
          const row = <span className="bm-it"><i>{i.qty}<small>&times;</small></i>{i.name}</span>;
          return <Fragment key={k}>{k === shown.length - 1 && more > 0 ? <span className="bm-row">{row}<em className="bm-more">{more} More</em></span> : row}</Fragment>;
        })}
      </div>
      <div className="bm-acts"><span className="bm-n"><em>{n}</em>Items</span>
        <button className="bm-again" onClick={e => { e.stopPropagation(); A.again(o.id); }}>Order Again<Ic f="ic-chev-red.svg" s={18} /></button></div>
    </div>
  );
}

export default function Orders() {
  const { S, A } = useBuy();
  const f = S.ofilter || 'all';
  const list = S.orders.filter(o => f === 'all' || (f === 'prog' && !['delivered', 'cancelled'].includes(o.status)) || (f === 'done' && o.status === 'delivered') || (f === 'cancel' && o.status === 'cancelled'));
  const tabs = [['all', 'All'], ['prog', 'In Progress'], ['done', 'Delivered'], ['cancel', 'Cancelled']];
  return (
    <div className="bm"><Head title="My Orders" />
      <div className="bm-body">
        <div className="bm-tabs">{tabs.map(([k, l]) => <button key={k} className={'bm-tab' + (f === k ? ' on' : '')} onClick={() => A.ofilter(k)}>{l}</button>)}</div>
        {list.length ? (
          <div className="bm-list">
            {list.map((o, i) => <Fragment key={o.id}>{i ? <img className="bm-div" src={O + 'divider.svg'} width="380" height="1" alt="" aria-hidden="true" /> : null}<OrderCard o={o} /></Fragment>)}
          </div>
        ) : <p className="ba-empty">No orders here yet.</p>}
      </div>
    </div>
  );
}
