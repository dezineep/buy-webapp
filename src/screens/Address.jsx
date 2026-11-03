/* BUY · ADDRESS FORM — Figma 2174:7989 "New Address" (search, 270px map with "Use Current Location", form) and
   2174:7773 "Your Current Location" (404px map, form prefilled from the location). Both end with the delivery-charge
   row and a full-width save button (checkout keeps the amount + "Proceed to Payment" footer).
   Styles: styles/address.css (fields .bd-*) + styles/addresses.css (.na-*) */
import { useBuy } from '../engine.jsx';
import { STORE, OFFERS, DELIVERY, V2, FG, inr, calcBill } from '../data.js';
import { Head, MapPin } from '../ui.jsx';
import LiveMap, { BLR } from '../LiveMap.jsx';

const Q = V2 + 'addr/';
const STATES = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'West Bengal', 'Telangana', 'Kerala', 'Gujarat'];

export default function Address() {
  const { S, A } = useBuy();
  const a = S.draft || S.addr || {};
  const b = calcBill(S.cart);
  const freeAt = OFFERS[0].min;
  const current = S.addrMode === 'current' && !S.editing;
  const first = S.addrFirst && !S.editing && !current;
  const pay = S.cart.length && S.checkout;
  const field = (k, label, ph, extra = {}) => (
    <label className={'bd-f' + (S.amiss && S.amiss.includes(k) ? ' bad' : '')}><span className="bd-l">{label}</span>
      <input className="bd-in" data-k={k} value={a[k] || ''} placeholder={ph} onChange={e => A.draft(k, e.target.value)} aria-invalid={S.amiss && S.amiss.includes(k) ? true : undefined} {...extra} /></label>
  );
  const dist = a.dist ?? 3.2;
  return (
    <div className="bd na">
      {/* first time from the cart bar: a friendlier header, and saving takes the shopper on to the cart */}
      <Head title={S.editing ? 'Edit Address' : current ? 'Your Current Location' : first ? 'Where should we deliver?' : 'New Address'}
        sub={current ? 'Save the address and select as Delivery location' : first ? 'Add your address once, we’ll remember it for next time' : 'Enter the address details to get the order delivery'} />
      <div className="na-body">
        {current ? (
          <div className="na-map tall"><LiveMap center={S.mapGo || BLR} onMove={A.mapmoved}><MapPin drop /></LiveMap>{S.locating ? <span className="na-finding">Finding your location…</span> : null}</div>
        ) : (
          <div className="na-top">
            <label className="na-search"><img src={Q + 'search-16.svg'} width="16" height="16" alt="" /><input placeholder="Search your area for delivery" aria-label="Search your area for delivery" enterKeyHint="search" onKeyDown={e => { if (e.key === 'Enter') { A.searcharea(e.currentTarget.value); e.currentTarget.blur(); } }} /></label>
            <div className="na-map">
              <LiveMap center={S.mapGo || BLR} onMove={A.mapmoved}><MapPin drop={S.located} /></LiveMap>
              {S.locating ? <span className="na-finding">Finding your location…</span> : null}
              <button className="na-loc" onClick={A.locate}><span className="na-loc-ic"><img src={FG + 'address/locate.svg'} width="16.875" height="16.875" alt="" /></span>Use Current Location</button>
            </div>
          </div>
        )}
        <div className="na-form">
          {field('street', 'Street / Building No.', 'e.g. Queenz Merian Tower', { autoComplete: 'address-line1' })}
          {field('road', 'Road Name/ Landmark', 'e.g. MG Road', { autoComplete: 'address-line2' })}
          {field('area', 'Area / Locality', 'e.g., Near BDA Complex')}
          <div className="bd-two">{field('pin', 'Pincode', '560102', { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}{field('city', 'City', 'Bengaluru', { autoComplete: 'address-level2' })}</div>
          <label className="bd-f"><span className="bd-l">State or Union Territory</span>
            <span className="bd-sel"><select className="bd-in" value={a.state || 'Karnataka'} onChange={e => A.draft('state', e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select><img src={Q + 'chev-down.svg'} width="18" height="18" alt="" /></span></label>
          {S.aerr ? <p className="ba-err">{S.aerr}</p> : null}
        </div>
        {/* delivery charge row (Figma 2174:8108) */}
        <div className="na-del">
          <div className="na-del-l"><img src={Q + 'scooter.svg'} width="51.545" height="54" alt="" />
            <div className="na-del-t"><span className="na-tag">Delivery Charge</span>
              <b>{b.delivery || !b.sub ? inr(DELIVERY).replace('₹', '₹ ') : 'FREE'}</b><small>{dist.toFixed(1)} km from {STORE.name}</small></div></div>
          <div className="na-del-r"><img src={Q + 'ic-info.svg'} width="12" height="12" alt="" /><p>{inr(DELIVERY)} flat ( below {inr(freeAt)} )<br />Free on orders {inr(freeAt)}+</p></div>
        </div>
      </div>
      <div className={'ba-foot' + (pay ? ' bd-foot' : '')}>
        {pay ? <><div className="ba-amt"><b>{inr(b.total)}</b><small>{b.delivery ? 'Delivery Charge Included' : 'Free delivery applied'}</small></div>
          <button className="ba-btn" onClick={A.saveaddr}>Proceed to Payment</button></>
          : <button className="ba-btn wide" onClick={A.saveaddr}>{S.addrFirst && !S.editing ? 'Save & View Cart' : current && S.fromHome ? 'Confirm Delivery Address' : current ? 'Save Current Location' : S.editing ? 'Save Changes' : 'Save Address'}</button>}
      </div>
    </div>
  );
}
