/* BUY · SAVED ADDRESSES — Figma 2174:7883
   Header (title + count) -> search field -> three action tiles (Use Current Location / Add New Address / Request
   Address in Whatsapp) -> "Saved Addresses ( n )" -> rows: pincode (red when selected) + "x Km away" chip, 2-line
   address, radio on the right; dashed dividers. Tapping a row selects it as the delivery address (and continues
   checkout when the cart sent us here). Styles: styles/addresses.css (.sa-*) */
import { Fragment, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { V2, addrLine } from '../data.js';
import { Head } from '../ui.jsx';

const Q = V2 + 'addr/';
const km = d => (d < 1 ? `${Math.round(d * 1000)} m away` : `${Math.round(d)} Km away`);

export default function Addresses() {
  const { S, A } = useBuy();
  const [q, setQ] = useState('');
  const n = S.addresses.length;
  const list = S.addresses.filter(a => !q || addrLine(a).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="sa"><Head title="Saved Addresses" sub={`${n} Address${n === 1 ? '' : 'es'}`} />
      <div className="sa-body">
        <div className="sa-top">
          <label className="sa-search">
            <img src={Q + 'ic-search.svg'} width="16" height="16" alt="" />
            <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search Your Saved Addresses" aria-label="Search your saved addresses" />
          </label>
          <div className="sa-acts">
            <button className="sa-act" onClick={A.curaddr}><img src={Q + 'ic-locate.svg'} width="20" height="20" alt="" /><span>Use Current<br />Location</span></button>
            <button className="sa-act" onClick={A.newaddr}><img src={Q + 'ic-add.svg'} width="20" height="20" alt="" /><span>Add New<br />Address</span></button>
            <button className="sa-act wide" onClick={A.requestaddr}><img src={Q + 'ic-whatsapp.svg'} width="20" height="20" alt="" /><span>Request Address<br />in Whatsapp</span></button>
          </div>
        </div>
        <div className="sa-saved">
          <p className="sa-h">Saved Addresses ( {n} )</p>
          {list.length ? (
            <div className="sa-list">
              {list.map((a, i) => {
                const on = S.addr && S.addr.id === a.id;
                return (
                  <Fragment key={a.id}>
                    {i ? <img className="sa-div" src={Q + 'divider.svg'} alt="" aria-hidden="true" /> : null}
                    <button className={'sa-row' + (on ? ' on' : '')} role="radio" aria-checked={!!on} onClick={() => A.pickaddr(a.id)}>
                      <span className="sa-t">
                        <span className="sa-top-l"><b>{a.pin}</b><span className="sa-chip">{km(a.dist ?? 2)}</span></span>
                        <span className="sa-line">{addrLine(a)}</span>
                      </span>
                      <span className="sa-radio" aria-hidden="true">{on ? <img src={Q + 'radio-dot.svg'} width="18" height="18" alt="" /> : null}</span>
                    </button>
                  </Fragment>
                );
              })}
            </div>
          ) : <p className="sa-empty">{q ? 'No saved address matches your search.' : 'No saved addresses yet.'}</p>}
        </div>
      </div>
    </div>
  );
}
