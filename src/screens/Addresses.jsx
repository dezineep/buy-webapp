/* BUY · MY SAVED ADDRESSES — no Figma frame; built from the BUY atoms with the Swiggy / Zomato address-book pattern:
   search, three quick actions (current location / add new / request on WhatsApp), then the saved list — type icon
   with distance from the store, "Selected" chip on the delivery address, ⋮ menu (edit / share / delete), View all.
   Tapping a card makes it the delivery address (and continues checkout when the cart sent us here).
   Styles: styles/addresses.css (.ba2-*) */
import { useState } from 'react';
import { useBuy } from '../engine.jsx';
import { addrLine, fmtDist } from '../data.js';
import { Head, ICO } from '../ui.jsx';

const sv = (d, extra) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...extra}>{d}</svg>;
export const AIC = {
  home: () => sv(<><path d="M3.5 10.5 12 4l8.5 6.5" /><path d="M5.5 9v10.5h13V9" /><path d="M10 19.5v-5h4v5" /></>),
  office: () => sv(<><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" /><path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" /><path d="M3.5 12.5h17" /></>),
  other: () => sv(<path d="M20 4 4.5 10.6l6.6 2.3 2.3 6.6Z" />),
  locate: () => sv(<><circle cx="12" cy="12" r="6.5" /><circle cx="12" cy="12" r="2.2" fill="currentColor" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" /></>),
  plus: () => sv(<><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8.5v7M8.5 12h7" /></>),
  wa: () => sv(<><path d="M4.5 19.5l1.1-3.6A7.8 7.8 0 1 1 8.4 18.6Z" /><path d="M9.3 8.8c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-1.2.6-3.4 0-5.3-1.9-1.9-1.9-2.5-3.9-2.1-5Z" fill="currentColor" stroke="none" /></>, { strokeWidth: 1.5 }),
  dots: () => sv(<><circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none" /></>),
  share: () => sv(<><path d="M12 15V4M8 7.5 12 4l4 3.5" /><path d="M5.5 12.5v5.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-5.5" /></>),
  edit: () => sv(<><path d="M4 20h4L19 9l-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>),
  trash: () => sv(<><path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5" /><path d="M10.5 11v5M13.5 11v5" /></>),
};

export default function Addresses() {
  const { S, A } = useBuy();
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  const picking = S.toCart || (S.checkout && S.cart.length);
  const list = S.addresses.filter(a => !q || (a.label + ' ' + addrLine(a)).toLowerCase().includes(q.toLowerCase()));
  const shown = all || q ? list : list.slice(0, 4);
  return (
    <div className="ba2"><Head title="My Saved Addresses" sub={picking ? 'Choose where to deliver this order' : `${S.addresses.length} saved address${S.addresses.length === 1 ? '' : 'es'}`} />
      <div className="ba2-body">
        <label className="ba-search ba2-search">{ICO.search()}<input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search an area or address" /></label>
        <div className="ba2-acts">
          <button className="ba2-act" onClick={() => { A.newaddr(); A.locate(); }}><i className="r">{AIC.locate()}</i><span>Use Current<br />Location</span></button>
          <button className="ba2-act" onClick={A.newaddr}><i className="r">{AIC.plus()}</i><span>Add New<br />Address</span></button>
          <button className="ba2-act" onClick={A.requestaddr}><i className="g">{AIC.wa()}</i><span>Request<br />Address</span></button>
        </div>
        <p className="ba2-h">Saved addresses</p>
        {shown.length ? (
          <div className="ba2-list">
            {shown.map((a, i) => {
              const on = S.addr && S.addr.id === a.id;
              return (
                <div key={a.id} className={'ba2-card' + (on ? ' on' : '')} style={{ animationDelay: `${i * 40}ms` }}>
                  <button className="ba2-main" onClick={() => A.pickaddr(a.id)}>
                    <span className="ba2-ic">{on ? <em className="ba2-tick" aria-hidden="true" /> : null}{(AIC[a.type] || AIC.other)()}<small>{on ? 'Selected' : fmtDist(a.dist)}</small></span>
                    <span className="ba2-t">
                      <span className="ba2-name"><b>{a.label}</b>{on ? <span className="ba2-chip">SELECTED</span> : null}</span>
                      <span className="ba2-line">{addrLine(a)}</span>
                      {a.phone ? <span className="ba2-ph">Phone number: <b>{a.phone}</b></span> : null}
                    </span>
                  </button>
                  <div className="ba2-foot">
                    <button className="ba2-rb" onClick={() => A.addrmenu(a.id)} aria-label={`More options for ${a.label}`}>{AIC.dots()}</button>
                    <button className="ba2-rb" onClick={() => A.shareaddr(a.id)} aria-label={`Share ${a.label}`}>{AIC.share()}</button>
                    {a.last ? <small>{a.last}</small> : null}
                  </div>
                </div>
              );
            })}
            {!all && !q && list.length > 4 ? <button className="ba2-all" onClick={() => setAll(true)}>View all <span>{ICO.down()}</span></button> : null}
          </div>
        ) : (
          <div className="ba2-empty"><span>{AIC.other()}</span><b>{q ? 'No address matches your search' : 'No saved addresses yet'}</b><p>Add an address once and pick it in a tap at checkout.</p><button className="ba-btn" onClick={A.newaddr}>Add New Address</button></div>
        )}
      </div>
    </div>
  );
}

/* ⋮ menu sheet for one address */
export function AddrMenu({ id }) {
  const { S, A } = useBuy();
  const a = S.addresses.find(x => x.id === id);
  if (!a) return null;
  const Row = ({ ic, l, on, danger }) => <button className={'ba2-mrow' + (danger ? ' danger' : '')} onClick={on}><i>{ic}</i>{l}</button>;
  return (
    <div className="bsh">
      <div className="ba-sh-h"><div className="ba-sh-t"><b>{a.label}</b><small>{addrLine(a)}</small></div><button className="ba-x" onClick={A.close} aria-label="Close">{ICO.close()}</button></div>
      <div className="bsh-body ba2-menu">
        <Row ic={AIC.edit()} l="Edit address" on={() => A.editaddr(id)} />
        <Row ic={AIC.share()} l="Share address" on={() => A.shareaddr(id)} />
        <Row ic={AIC.trash()} l="Delete address" on={() => A.deladdr(id)} danger />
      </div>
    </div>
  );
}
