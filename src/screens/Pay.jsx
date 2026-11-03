/* BUY · CHECKOUT — "Proceed to Pay" lands here instead of a payment sheet.
   1. Opening (Figma 2242:8034 layout): the illustrated wallet loader while the Cashfree session is created.
   2. Cashfree checkout: the gateway's own hosted page, where the shopper picks UPI / card / net banking / wallet.
      A sandbox switch decides the result, like Cashfree's test mode.
   3. Processing (Figma 2242:8034): same loader, "Processing your payment…".
   4a. Success → the order is placed (engine placeOrder → order status screen).
   4b. Failed (Figma 2242:8081): animated failed card, order summary, Try again (back to Cashfree) / Back to cart.
   Styles: styles/pay.css (.bpy-*, .bcf-*) */
import { useEffect, useState } from 'react';
import { useBuy } from '../engine.jsx';
import { STORE, inr, calcBill } from '../data.js';
import { Head } from '../ui.jsx';
import { PayingArt, FailedArt } from './PayArt.jsx';

const CF = '/assets/pay/';
const Secured = () => (
  <div className="bpy-sec"><img src={CF + 'ic-locked.svg'} width="14" height="14" alt="" /><span>Secured by</span><img src={CF + 'cashfree-logo.svg'} width="62" height="18" alt="Cashfree Payments" /></div>
);

export default function Pay() {
  const { S, A } = useBuy();
  const b = calcBill(S.cart);
  const [phase, setPhase] = useState('opening'); // opening → gateway → processing → failed
  const [why, setWhy] = useState('declined');
  useEffect(() => {
    if (phase === 'opening') { const t = setTimeout(() => setPhase('gateway'), 1800); return () => clearTimeout(t); }
  }, [phase]);
  const pay = ok => {
    setPhase('processing');
    setTimeout(() => { if (ok) A.payok(); else { setWhy('declined'); setPhase('failed'); } }, 2400);
  };
  const cancel = () => { setWhy('cancelled'); setPhase('failed'); };

  if (phase === 'gateway') return <Gateway total={b.total} count={b.count} onPay={pay} onCancel={cancel} />;
  if (phase === 'failed') return (
    <div className="bpy bpy-fail">
      <Head title="Payment" />
      <div className="bpy-body">
        <div className="bpy-hero">
          <FailedArt />
          <h2>{why === 'cancelled' ? 'Payment cancelled' : 'Payment failed'}</h2>
          <p>{why === 'cancelled'
            ? `You closed the payment page before paying ${inr(b.total)}. Nothing was charged.`
            : `Your bank declined the payment of ${inr(b.total)}. Nothing was charged. If money was deducted, it’s refunded automatically in 5–7 working days.`}</p>
        </div>
        <div className="bpy-sum">
          <b>Order Summary</b>
          <p><span>Subtotal ({b.count} item{b.count === 1 ? '' : 's'})</span><span>{inr(b.sub)}</span></p>
          <p><span>Delivery charges</span><span>{b.delivery ? inr(b.delivery) : 'Free'}</span></p>
          {b.disc ? <p><span>Discount</span><span>− {inr(b.disc)}</span></p> : null}
          <p><span>GST (5%)</span><span>{inr(b.gst)}</span></p>
          <i />
          <p className="bpy-total"><span>To pay</span><span>{inr(b.total)}</span></p>
        </div>
        <p className="bpy-note">Your cart is saved. Try again or use another payment method.</p>
      </div>
      <div className="ba-foot bpy-foot">
        <button className="ba-btn wide" onClick={() => setPhase('opening')}>Try again</button>
        <button className="ba-btn wide bpy-ghost" onClick={A.backtocart}>Back to cart</button>
      </div>
    </div>
  );
  return (
    <div className="bpy bpy-wait">
      <div className="bpy-wait-in">
        <PayingArt />
        <h2>{phase === 'opening' ? 'Opening secure checkout…' : 'Processing your payment…'}</h2>
        <b className="bpy-amt">{inr(b.total)}</b>
        <p>Please don’t close this page or press back. This usually takes a few seconds.</p>
        <Secured />
      </div>
    </div>
  );
}

/* Cashfree's hosted checkout (their UI, not BUY's): merchant + amount bar, the payment methods, and their Pay button */
const APPS = [['GPay', '#4285f4'], ['PhonePe', '#5f259f'], ['Paytm', '#00b9f1'], ['BHIM', '#f47920']];
const METHODS = [['upi', 'UPI', 'Pay by any UPI app'], ['card', 'Debit / Credit Card', 'Visa, Mastercard, RuPay'], ['nb', 'Net Banking', 'All major banks'], ['wallet', 'Wallets', 'Amazon Pay, Mobikwik & more'], ['later', 'Pay Later', 'Simpl, LazyPay']];
function Gateway({ total, count, onPay, onCancel }) {
  const [m, setM] = useState('upi');
  const [app, setApp] = useState('GPay');
  const [ok, setOk] = useState(true);
  return (
    <div className="bcf">
      <div className="bcf-top">
        <button className="bcf-x" onClick={onCancel} aria-label="Cancel payment">×</button>
        <div className="bcf-mer"><img src={STORE.logo} alt="" /><span><b>{STORE.name}</b><small>{count} item{count === 1 ? '' : 's'} · Order via BUY</small></span></div>
        <div className="bcf-amt"><small>Amount</small><b>{inr(total)}</b></div>
      </div>
      <div className="bcf-body">
        <p className="bcf-h">Payment options</p>
        <div className="bcf-list">{METHODS.map(([k, t, s]) => (
          <div key={k} className={'bcf-m' + (m === k ? ' on' : '')}>
            <button className="bcf-mh" onClick={() => setM(k)}><i className={'bcf-ic ' + k} /><span><b>{t}</b><small>{s}</small></span><em /></button>
            {m === k && k === 'upi' ? (
              <div className="bcf-mb">
                <div className="bcf-apps">{APPS.map(([a, c]) => <button key={a} className={'bcf-app' + (app === a ? ' on' : '')} onClick={() => setApp(a)}><i style={{ background: c }}>{a[0]}</i><small>{a}</small></button>)}</div>
                <p className="bcf-or"><span>or pay with UPI ID</span></p>
                <input className="bcf-in" placeholder="yourname@okbank" defaultValue={ok ? 'testsuccess@gocash' : 'testfailure@gocash'} key={String(ok)} />
              </div>
            ) : m === k && k === 'card' ? (
              <div className="bcf-mb"><input className="bcf-in" defaultValue="4111 1111 1111 1111" /><div className="bcf-row"><input className="bcf-in" defaultValue="12 / 28" /><input className="bcf-in" defaultValue="123" /></div></div>
            ) : null}
          </div>
        ))}</div>
        <div className="bcf-test"><span>Sandbox · simulate result</span>
          <div className="bcf-seg"><button className={ok ? 'on' : ''} onClick={() => setOk(true)}>Success</button><button className={!ok ? 'on fail' : ''} onClick={() => setOk(false)}>Failure</button></div></div>
      </div>
      <div className="bcf-foot">
        <button className="bcf-pay" onClick={() => onPay(ok)}>Pay {inr(total)}</button>
        <div className="bcf-by"><img src={CF + 'ic-locked.svg'} width="12" height="12" alt="" /><span>Secured by</span><img src={CF + 'cashfree-logo.svg'} width="55" height="16" alt="Cashfree Payments" /></div>
      </div>
    </div>
  );
}
