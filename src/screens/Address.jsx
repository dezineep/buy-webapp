/* BUY · ADDRESS — Figma 730-2743 (same as the demo). Styles: styles/address.css (.bd-*) */
import { useBuy } from '../engine.jsx';
import { STORE, OFFERS, DELIVERY, FG, ADDR_TYPES, inr, calcBill } from '../data.js';
import { AIC } from './Addresses.jsx';
import { Head, ICO } from '../ui.jsx';

const A_ = FG + 'address/';
const STATES = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'West Bengal', 'Telangana', 'Kerala', 'Gujarat'];

export default function Address() {
  const { S, A } = useBuy();
  const a = S.draft || S.addr || {};
  const b = calcBill(S.cart);
  const freeAt = OFFERS[0].min;
  const field = (k, label, ph, extra = {}) => (
    <label className="bd-f"><span className="bd-l">{label}</span>
      <input className="bd-in" value={a[k] || ''} placeholder={ph} onChange={e => A.draft(k, e.target.value)} {...extra} /></label>
  );
  return (
    <div className="bd"><Head title={S.editing ? 'Edit Address' : 'Delivery Address'} sub="Enter the address details to get the order delivery" />
      <div className="bd-body">
        <div className="bd-top">
          <label className="ba-search bd-search">{ICO.search()}<input placeholder="Search your area for delivery" /></label>
          <div className="bd-map">
            <div className="bd-map-img"><img src={A_ + 'map.jpg'} alt="Map" /><img className={'bd-pin' + (S.located ? ' drop' : '')} src={A_ + 'map-pin.svg'} width="36" height="39" alt="" /></div>
            <button className="bd-loc" onClick={A.locate}><span className="bd-loc-ic"><img src={A_ + 'locate.svg'} width="16.875" height="16.875" alt="" /></span>Use Current Location</button>
          </div>
        </div>
        <div className="bd-form">
          <div className="bd-f"><span className="bd-l">Save address as</span>
            <div className="ba2-seg" role="radiogroup" style={{ '--i': Math.max(0, ADDR_TYPES.findIndex(([k]) => k === (a.type || 'home'))) }}>
              <i className="ba2-seg-ind" aria-hidden="true" />
              {ADDR_TYPES.map(([k, l]) => <button key={k} role="radio" aria-checked={(a.type || 'home') === k} className={(a.type || 'home') === k ? 'on' : ''} onClick={() => A.addrtype(k)}>{AIC[k]()}{l}</button>)}
            </div>
            {a.type === 'other' ? <input className="bd-in ba2-lbl" value={a.label || ''} placeholder="Name this address, e.g. Gym, Parents" onChange={e => A.draft('label', e.target.value)} autoFocus /> : null}
          </div>
          {field('street', 'Street / Building No.', 'e.g. Flat 12, Queenz Merian Tower', { autoComplete: 'address-line1' })}
          {field('road', 'Road Name/ Landmark', 'e.g. MG Road', { autoComplete: 'address-line2' })}
          {field('area', 'Area / Locality', 'e.g., Near BDA Complex')}
          <div className="bd-two">{field('pin', 'Pincode', '560102', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}{field('city', 'City', 'Bengaluru', { autoComplete: 'address-level2' })}</div>
          <label className="bd-f"><span className="bd-l">State or Union Territory</span>
            <span className="bd-sel"><select className="bd-in" value={a.state || 'Karnataka'} onChange={e => A.draft('state', e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select><img src={A_ + 'chevron-down.svg'} width="18" height="18" alt="" /></span></label>
          <p className="ba-err">{S.aerr}</p>
        </div>
        <div className="bd-del">
          <div className="bd-del-l"><img src={A_ + 'delivery-scooter.svg'} width="51.5455" height="54" alt="" />
            <div className="bd-del-t"><span className="bd-tag">Delivery Charge</span>
              <div className="bd-del-v"><b>{b.delivery ? inr(b.delivery) : 'FREE'}</b><small>3.2 km from {STORE.name}</small></div></div></div>
          <div className="bd-del-r"><img src={A_ + 'info.svg'} width="12" height="12" alt="" /><p>{inr(DELIVERY)} flat (below {inr(freeAt)})<br />Free on orders {inr(freeAt)}+</p></div>
        </div>
      </div>
      <div className="ba-foot bd-foot"><div className="ba-amt"><b>{inr(b.total)}</b><small>{b.delivery ? 'Delivery Charge Included' : 'Free delivery applied'}</small></div>
        <button className="ba-btn" onClick={A.saveaddr}>{S.cart.length && S.checkout ? 'Proceed to Payment' : 'Save Address'}</button></div>
    </div>
  );
}
