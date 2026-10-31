/* BUY · LOG IN — Figma 724:2021 (enter number), 724:2395 (OTP sheet, see Sheets.jsx Otp), 724:2507 (verified number
   + name). The phone's own number keyboard opens (no drawn keypad). Styles: styles/login.css (.bl-*) */
import { useEffect, useRef } from 'react';
import { useBuy } from '../engine.jsx';
import { V2 } from '../data.js';
import { Head, SheetHead } from '../ui.jsx';

const L = V2 + 'login/';
const fmt = p => (p.length > 5 ? p.slice(0, 5) + ' ' + p.slice(5) : p);

export default function Login() {
  const { S, A } = useBuy();
  const l = S.login || {};
  const phone = useRef(null), name = useRef(null);
  // focus the field the step is waiting for (the number first, then the name once it is verified)
  useEffect(() => {
    const t = setTimeout(() => { if (S.sheet) return; (l.verified ? name : phone).current?.focus({ preventScroll: true }); }, 380);
    return () => clearTimeout(t);
  }, [l.verified, l.focusKey]);
  return (
    <div className="bl">
      <Head title="Log In with Mobile No." sub="Enter your mobile number to place the order" />
      <div className="bl-body">
        <label className="bl-f">
          <span className="bl-l">Phone Number<i>*</i></span>
          <span className={'bl-in bl-ph' + (l.verified ? ' ok' : '')} onClick={() => { if (l.verified) A.changephone(); }}>
            <span className="bl-cc">+91{l.verified ? <img src={L + 'ic-chev.svg'} width="18" height="18" alt="" /> : null}</span>
            <input ref={phone} value={fmt(l.phone || '')} readOnly={l.verified} onChange={e => A.lset('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={e => { if (e.key === 'Enter') A.sendotp(); }} inputMode="numeric" autoComplete="tel-national" placeholder="Enter Mobile No." aria-label="Mobile number" />
            {l.verified ? <img className="bl-ok" src={L + 'ic-ok.svg'} width="24" height="24" alt="Verified" /> : null}
          </span>
        </label>
        {l.verified ? (
          <label className="bl-f bl-in-anim">
            <span className="bl-l">Customer’s Name<i>*</i></span>
            <input ref={name} className="bl-in bl-nm" value={l.name || ''} onChange={e => A.lset('name', e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') A.loginsave(); }} autoComplete="name" placeholder="Enter Your Name" />
          </label>
        ) : null}
        <p className="ba-err bl-err">{l.err}</p>
      </div>
      <div className="bl-foot">
        {l.verified
          ? <button className="ba-btn wide" onClick={A.loginsave}>Log In Profile</button>
          : <button className="ba-btn wide" onClick={A.sendotp}>Verify Mobile No.</button>}
      </div>
    </div>
  );
}

/* OTP bottom sheet (Figma 724:2395): six boxes over one hidden input so paste / SMS autofill fill them all at once */
export function Otp() {
  const { S, A } = useBuy();
  const l = S.login || {};
  const inp = useRef(null);
  const v = l.otp || '';
  useEffect(() => { const t = setTimeout(() => inp.current?.focus({ preventScroll: true }), 320); return () => clearTimeout(t); }, []);
  return (
    <div className="bl-otp">
      <SheetHead title="Verify Mobile No." sub={`verification code has been sent to ****${(l.phone || '').slice(-4)}`} />
      <div className="bl-chg"><b>Want to enter different mobile number?</b><button className="bl-link" onClick={A.changephone}>Change Mobile no.</button></div>
      <label className="bl-boxes" onClick={() => inp.current?.focus()}>
        <input ref={inp} className="bl-otp-in" value={v} onChange={e => A.lotp(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') A.verifyotp(); }}
          inputMode="numeric" autoComplete="one-time-code" maxLength={6} aria-label="Verification code" />
        {[0, 1, 2, 3, 4, 5].map(i => <span key={i} className={'bl-box' + (i === Math.min(v.length, 5) ? ' on' : '') + (v[i] ? ' f' : '')}>{v[i] || '-'}</span>)}
      </label>
      <p className="ba-err bl-err">{l.oerr}</p>
      <div className="bl-re"><span>Didn’t received OTP ?</span><button className="bl-link" onClick={A.resendotp}>Resend It</button></div>
      <button className="ba-btn wide bl-confirm" onClick={A.verifyotp}>Confirm Verification</button>
    </div>
  );
}
