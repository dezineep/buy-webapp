/* BUY · MY REFUNDS — Figma 1164:6895 (Pending), 1164:7347 (Processed); detail 1164:8506 (pending), 1164:7853 (refunded)
   Styles: styles/refunds.css (.br-*) */
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { V2, inr, fmtShort, fmtTime, MONTHS } from '../data.js';
import { Head } from '../ui.jsx';
import { CopyBtn, ItemChips } from './Order.jsx';

const R = V2 + 'refund/';
const chip = r => r.status === 'refunded' ? <span className="br-chip ok">Refunded</span>
  : r.status === 'overdue' ? <span className="br-od"><span className="br-chip late">Overdue</span><em>{r.days} Days Pending</em></span>
  : <span className="br-chip wait">Pending</span>;

/* two-tab switcher (Figma 1164:7339): the outlined tab slides between Pending and Processed */
export function TopTabs({ tabs, value, onChange }) {
  const box = useRef(null);
  const [ind, setInd] = useState(null);
  useLayoutEffect(() => {
    const b = box.current.querySelector(`[data-t="${value}"]`);
    setInd(i => ({ x: b.offsetLeft, w: b.offsetWidth, anim: !!i }));
  }, [value]);
  return (
    <div className="br-tabs" ref={box} role="tablist">
      {ind && <span className={'br-tab-ind' + (ind.anim ? ' anim' : '')} style={{ transform: `translateX(${ind.x - 4}px)`, width: ind.w }} />}
      {tabs.map(([k, l]) => <button key={k} data-t={k} role="tab" aria-selected={value === k} className={'br-tab' + (value === k ? ' on' : '')} onClick={() => onChange(k)}>{l}</button>)}
    </div>
  );
}

export default function Refunds() {
  const { S, A } = useBuy();
  const tab = S.rtab;
  const list = S.refunds.filter(r => (tab === 'pending' ? r.status !== 'refunded' : r.status === 'refunded'));
  return (
    <div className="br"><Head title="My Refunds" sub={`${S.refunds.length} Refunds`} />
      <div className="br-body">
        <TopTabs tabs={[['pending', 'Pending'], ['done', 'Processed']]} value={tab} onChange={A.rtab} />
        <div key={tab} className={'br-list ' + (tab === 'done' ? 'from-r' : 'from-l')}>
          {list.length ? list.map((r, i) => (
            <Fragment key={r.id + r.code}>
              {i ? <img className="br-div" src={V2 + 'refunds/line-fade.svg'} alt="" aria-hidden="true" /> : null}
              <button className="br-row" onClick={() => A.openrefund(r.id)}>
                <span className="br-top">{chip(r)}</span>
                <span className="br-mid">
                  <span className="br-l"><b>#{r.id} • {r.code}</b><small>{r.reason}</small></span>
                  <span className="br-r"><b>{inr(r.amount)}</b><small>{fmtShort(r.at)} • {fmtTime(r.at)}</small></span>
                </span>
              </button>
            </Fragment>
          )) : <p className="ba-empty">No refunds here.</p>}
        </div>
      </div>
    </div>
  );
}

export function RefundDetail({ entry }) {
  const { S } = useBuy();
  const r = S.refunds.find(x => x.id === entry.id);
  if (!r) return null;
  const done = r.status === 'refunded';
  return (
    <div className="brd"><Head title={done ? 'Refund Processed' : 'Refund Details'} />
      <div className="brd-body">
        <div className="brd-info">
          {done ? (
            <div className="brd-ok" aria-hidden="true">
              <span className="brd-ok-c"><img src={R + 'check.svg'} width="31.834" height="23.49" alt="" /></span>
              <span className="brd-rays">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` }} />)}</span>
            </div>
          ) : (
            <div className="brd-hg" aria-hidden="true"><img src={R + 'hourglass.png'} alt="" /></div>
          )}
          <div className="brd-amt"><b>{inr(r.amount)}</b><p className={done ? 'ok' : ''}>{done ? 'Marked as Refunded !' : r.status === 'overdue' ? 'Refund is Overdue!' : 'Refund is Pending!'}</p></div>
          <small className={done ? 'when' : ''}>{done ? `${MONTHS[r.at.getMonth()]} ${r.at.getDate()} at ${fmtTime(r.at).replace(/^0/, '')}` : 'The Store owner has not processed your refund yet'}</small>
        </div>
        <div className="brd-card">
          <div className="brd-sec"><p className="brd-h">Items Ordered</p><ItemChips items={r.items} /></div>
          <div className="ba-div dash" />
          <div className="brd-sec"><p className="brd-h">Reason of Refund</p><p className="brd-t">{r.reason}</p></div>
          <div className="ba-div dash" />
          <div className="bo-row"><img src={R + 'order-box.svg'} width="30" height="30" alt="" /><div className="bo-row-t"><b>Order ID</b><small>#{r.order}</small></div><CopyBtn v={r.order} /></div>
          {r.utr ? <><div className="ba-div dash" />
            <div className="bo-row"><span className="brd-upi"><img src={R + 'upi.png'} alt="" /></span><div className="bo-row-t"><b>Refund Transaction ID</b><small>{r.utr}</small></div><CopyBtn v={r.utr} /></div></> : null}
        </div>
      </div>
    </div>
  );
}
