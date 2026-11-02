/* BUY · STORE DETAILS — Figma 1073:2453. Styles: styles/store.css (.bs-*) */
import { useBuy } from '../engine.jsx';
import { STORE, OFFERS, V2, inr } from '../data.js';
import { Head, ICO, MapPin } from '../ui.jsx';
import { iconUrl } from '../catIcons.js';
import LiveMap, { STORE_LL } from '../LiveMap.jsx';

const S_ = V2 + 'store/';
const OI = { del: ['of-del.svg', 24], pct: ['of-pct.svg', 20], gift: ['of-gift.svg', 20] };

export default function Store() {
  const { A } = useBuy();
  return (
    <div className="bs">
      <Head title="Store Details" right={<button className="bp2-share" onClick={A.share} aria-label="Share store">{ICO.shareSoft()}</button>} />
      <div className="bs-body">
        <div className="bs-hero">
          <div className="bs-ban"><img src={STORE.banners[0]} alt="" /></div>
          <div className="bs-id">
            <img className="bs-logo" src={STORE.logo} alt="" />
            <div className="bs-idt">
              <div className="bs-nm"><b>{STORE.name}</b>{ICO.verified()}</div>
              <small className="bs-cat">{STORE.category}</small>
              <small className="bs-loc"><img src={S_ + 'ic-pin.svg'} alt="" width="10" height="10" />{STORE.area}</small>
            </div>
          </div>
        </div>
        <div className="bs-two"><button className="bs-ob" onClick={A.directions}>Get Directions</button><button className="bs-ob" onClick={A.whatsapp}>Whatsapp</button></div>
        <section><p className="bs-sub">Store open Days</p>
          <div className="bs-days">{STORE.days.map(([d, a, b]) => <span key={d} className={a ? '' : 'off'}><b>{d}</b><small>{a ? <>{a} -<br />{b}</> : 'Closed'}</small></span>)}</div>
        </section>
        <section><p className="bs-sub">Store Location</p>
          <div className="bs-map"><LiveMap center={STORE_LL} zoom={16} interactive={false}><MapPin icon={iconUrl('store-01')} /></LiveMap><button className="bs-ob bs-dir" onClick={A.directions}>Get Directions</button></div>
        </section>
        <section><p className="bs-sub">Offers Provided</p>
          <div className="bs-ofl">{OFFERS.map(o => (
            <div key={o.id} className="bs-of"><img src={S_ + OI[o.kind][0]} alt="" width={OI[o.kind][1]} height={OI[o.kind][1]} /><div><b>{o.title}</b><small>For cart total <strong>₹ {o.min.toLocaleString('en-IN')}</strong> and more</small></div></div>
          ))}</div>
        </section>
        <section><p className="bs-sub">About</p><p className="bs-about">{STORE.about}</p></section>
      </div>
    </div>
  );
}
