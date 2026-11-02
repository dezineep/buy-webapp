/* Order status illustrations drawn in SVG so every part can move (styles: order.css, .boa-*).
   placed    : the parcel drops in and squashes, the badge pops, the tick draws itself, then the rays burst out of it
               and keep pulsing while a ring ripples away.
   delivered : the box lands, both flaps swing open (SMIL point animation: closed → upright → folded out), the badge
               rises out of the box, the tick draws, rays burst and confetti pops. */

/* tick badge: circle + white check that draws + 10 rays that shoot outwards */
function Badge({ x, y, r = 16 }) {
  return (
    <g className="boa-badge" transform={`translate(${x} ${y})`}>
      <g className="boa-badge-in">
        <circle className="boa-ring" r={r} />
        <g className="boa-rays">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} x1="0" y1={-(r + 5)} x2="0" y2={-(r + 11)} transform={`rotate(${i * 36})`} style={{ '--i': i }} />
          ))}
        </g>
        <circle r={r} fill="var(--r)" />
        <circle r={r - 4} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2" />
        <path className="boa-tick" d={`M${-r * .42} 0.5 L${-r * .1} ${r * .32} L${r * .45} ${-r * .3}`} />
      </g>
    </g>
  );
}

/* placed: search "no results" style. The sealed, smiling parcel drops in, a red tick badge is stamped onto its
   corner (tick draws, rays burst and keep pulsing), and a little receipt slides out from behind it. */
export function PlacedArt() {
  return (
    <svg className="bpl" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bpl-floor" cx="112" cy="157" rx="62" ry="7" />
      <g className="bpl-sparks"><path d="M26 40v10M21 45h10" /><path d="M196 104v9M191.5 108.5h9" /><circle cx="186" cy="20" r="3" /><circle cx="22" cy="108" r="2.5" /></g>
      {/* receipt slip sliding out from behind the parcel */}
      <g className="bpl-slip">
        <path d="M34 82h30v52l-5-3-5 3-5-3-5 3-5-3-5 3Z" transform="translate(3 4)" fill="#000" />
        <path d="M34 82h30v52l-5-3-5 3-5-3-5 3-5-3-5 3Z" fill="#fff" stroke="#000" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M40 92h18M40 100h14M40 108h18M40 118h10" stroke="#c9c9c9" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M52 118h6" stroke="var(--r)" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g className="bpl-box">
        <path d="M66 74h82v76H66ZM148 74l22-16v74l-22 18Z" transform="translate(4 5)" fill="#000" />
        <path d="M148 74l22-16v74l-22 18Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 74h82v76H66Z" fill="var(--pk)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 74l22-16h82l-22 16Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M100 74l22-16h14l-22 16Z" fill="#f2d3a4" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 74h14v14l-7-4-7 4Z" fill="#f2d3a4" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
        <circle className="bpl-eye" cx="94" cy="108" r="3.2" fill="#000" /><circle className="bpl-eye" cx="120" cy="108" r="3.2" fill="#000" />
        <path d="M98 122q9 9 18 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="86" cy="120" r="4" fill="var(--blush)" opacity=".8" /><circle cx="128" cy="120" r="4" fill="var(--blush)" opacity=".8" />
      </g>
      {/* tick badge stamped on the corner */}
      <g transform="translate(166 60)">
        <g className="bpl-badge">
          <g className="bpl-rays">{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-24" x2="0" y2="-31" transform={`rotate(${i * 45})`} />)}</g>
          <circle r="17" transform="translate(3 4)" fill="#000" />
          <circle r="17" fill="var(--r)" stroke="#000" strokeWidth="2.5" />
          <path className="bpl-tick" d="M-7.5 0.5l5 5L8-5.5" />
        </g>
      </g>
    </svg>
  );
}

/* delivered: search "no results" style (black 2.5 strokes, hard shadows, pink / red, a face). The happy parcel lands,
   both flaps swing open (SMIL: closed → upright → folded out), a green tick badge rises out and its tick draws,
   then confetti pops and keeps drifting. */
const L_CLOSED = '66,80 88,64 129,64 107,80', L_UP = '66,80 88,64 88,28 66,44', L_OPEN = '66,80 88,64 54,52 32,68';
const R_CLOSED = '148,80 170,64 129,64 107,80', R_UP = '148,80 170,64 170,28 148,44', R_OPEN = '148,80 170,64 200,76 178,92';
const flap = (a, b, c) => <animate attributeName="points" values={`${a};${b};${c}`} keyTimes="0;0.5;1" calcMode="spline" keySplines=".45 0 .55 1;.2 .8 .3 1" dur=".8s" begin=".6s" fill="freeze" />;

export function DeliveredArt() {
  return (
    <svg className="bod" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bod-floor" cx="118" cy="158" rx="64" ry="7" />
      <g className="bod-sparks"><path d="M22 36v11M16.5 41.5h11" /><path d="M200 26v9M195.5 30.5h9" /><circle cx="204" cy="118" r="3.5" /><circle cx="26" cy="112" r="2.5" /></g>
      <g className="bod-box">
        {/* inside of the box, seen once the flaps open */}
        <path d="M66 80l22-16h82l-22 16Z" fill="var(--r-deep)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        {/* green tick badge waits inside the box and rises out */}
        <g className="bod-rise">
          <g transform="translate(118 98)">
            <g className="bod-badge">
              <g className="bod-rays">{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-25" x2="0" y2="-32" transform={`rotate(${i * 45})`} />)}</g>
              <circle r="18" transform="translate(3 4)" fill="#000" />
              <circle r="18" fill="#01ae0f" stroke="#000" strokeWidth="2.5" />
              <path className="bod-tick" d="M-8 0.5l5.5 5.5L8.5-6" />
            </g>
          </g>
        </g>
        {/* hard offset shadow, side, front */}
        <path d="M66 80h82v70H66ZM148 80l22-16v72l-22 14Z" transform="translate(4 5)" fill="#000" />
        <path d="M148 80l22-16v72l-22 14Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 80h82v70H66Z" fill="var(--pk)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        {/* happy face: ^ ^ eyes, big smile, blush */}
        <path d="M89 111q5-6 10 0M115 111q5-6 10 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path className="bod-smile" d="M96 124q11 12 22 0Z" fill="var(--r)" stroke="#000" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="84" cy="122" r="4" fill="var(--blush)" opacity=".8" /><circle cx="130" cy="122" r="4" fill="var(--blush)" opacity=".8" />
        <polygon points={L_CLOSED} fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round">{flap(L_CLOSED, L_UP, L_OPEN)}</polygon>
        <polygon points={R_CLOSED} fill="var(--r2)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round">{flap(R_CLOSED, R_UP, R_OPEN)}</polygon>
      </g>
      <g className="bod-confetti">
        {[[78, 40, '#f2b233'], [156, 30, 'var(--r)'], [62, 62, '#01ae0f'], [176, 52, '#3f4ee3'], [118, 16, '#f2b233'], [92, 18, 'var(--r)'], [168, 84, '#01ae0f'], [48, 88, 'var(--blush)'], [140, 12, '#3f4ee3']].map(([cx, cy, c], i) => (
          <rect key={i} x={cx - 3.5} y={cy - 2.5} width="7" height="5" rx="1" fill={c} stroke="#000" strokeWidth=".8" style={{ '--i': i, '--dx': `${(cx - 118) * .55}px`, '--dy': `${(cy - 70) * .5}px` }} />
        ))}
      </g>
    </svg>
  );
}

/* cancelled: same outlined, hard-shadow style as the search "no results" art (black 2.5 strokes, pink fill, red
   accents, a face). A sad parcel gets a red ✕ badge slammed onto its corner, while a ₹ coin flips its way back
   along a dashed return arrow — the refund being processed. */
export function CancelledArt() {
  return (
    <svg className="boc" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="boc-floor" cx="112" cy="157" rx="62" ry="7" />
      <g className="boc-sparks"><path d="M186 30v11M180.5 35.5h11" /><path d="M24 40v9M19.5 44.5h9" /><circle cx="196" cy="104" r="3.5" /><circle cx="168" cy="16" r="2.5" /></g>
      {/* refund: dashed arrow from the parcel back to the coin, dashes flowing towards the coin */}
      <path className="boc-ret" d="M70 66C48 52 30 66 34 90" />
      <path className="boc-ret-head" d="M27 84l7 9 8-8" />
      <g className="boc-coin">
        <circle cx="36" cy="114" r="15" transform="translate(3 4)" fill="#000" />
        <circle cx="36" cy="114" r="15" fill="#f2b233" stroke="#000" strokeWidth="2.5" />
        <circle cx="36" cy="114" r="10" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="1.5" />
        <text x="36" y="119.5" textAnchor="middle" className="boc-rupee">₹</text>
      </g>
      <g className="boc-box">
        {/* hard offset shadow, then side, front, lid */}
        <path d="M66 74h82v76H66ZM148 74l22-16v74l-22 18Z" transform="translate(4 5)" fill="#000" />
        <path d="M148 74l22-16v74l-22 18Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 74h82v76H66Z" fill="var(--pk)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 74l22-16h82l-22 16Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M100 74l22-16h14l-22 16Z" fill="#f2d3a4" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 74h14v14l-7-4-7 4Z" fill="#f2d3a4" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
        <circle className="boc-eye" cx="94" cy="108" r="3.2" fill="#000" /><circle className="boc-eye" cx="120" cy="108" r="3.2" fill="#000" />
        <path d="M95 130c7-8 18-8 25 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path className="boc-tear" d="M90 115c-2.4 3.6-3.6 6-3.6 7.8a3.6 3.6 0 0 0 7.2 0c0-1.8-1.2-4.2-3.6-7.8Z" fill="#7fc3f2" stroke="#000" strokeWidth="1.5" />
      </g>
      {/* the ✕ badge stamped onto the parcel's corner */}
      <g className="boc-x" transform="translate(166 60)">
        <g className="boc-x-in">
          <circle r="17" transform="translate(3 4)" fill="#000" />
          <circle r="17" fill="var(--r)" stroke="#000" strokeWidth="2.5" />
          <path d="M-6.5-6.5l13 13M6.5-6.5l-13 13" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/* packed / on the way: same outlined style — a red delivery scooter carrying the smiling parcel, wheels spinning,
   the road and speed lines streaming past. `packed` parks it (wheels still, parcel bounces as it gets loaded). */
export function RideArt({ moving = true }) {
  const wheel = (cx, cy) => (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="15" transform="translate(3 4)" fill="#000" />
      <circle r="15" fill="#fff" stroke="#000" strokeWidth="2.5" />
      <g className="bor-spin"><path d="M0-9v18M-9 0h18" stroke="var(--r)" strokeWidth="2.6" strokeLinecap="round" /></g>
      <circle r="3.4" fill="#000" />
    </g>
  );
  return (
    <svg className={'bor' + (moving ? ' moving' : '')} viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bor-floor" cx="118" cy="158" rx="76" ry="6" />
      <path className="bor-road" d="M10 158h200" />
      <g className="bor-speed"><path d="M6 92h22" /><path d="M14 106h16" /><path d="M2 120h24" /></g>
      <g className="bor-sparks"><path d="M196 34v10M191 39h10" /><circle cx="30" cy="40" r="3" /></g>
      <g className="bor-bike">
        {/* parcel strapped on the back seat */}
        <g className="bor-box">
          <path d="M50 70h52v42H50ZM102 70l14-10v40l-14 12Z" transform="translate(4 5)" fill="#000" />
          <path d="M102 70l14-10v40l-14 12Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 70h52v42H50Z" fill="var(--pk)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 70l14-10h52l-14 10Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M70 70h12v10l-6-3-6 3Z" fill="#f2d3a4" stroke="#000" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M64 90q4-5 8 0M80 90q4-5 8 0" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M68 99q8 8 16 0" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
        </g>
        {/* scooter: rear body + seat, floorboard, front shield, handlebar */}
        <path d="M44 116h76v14H40q0-14 4-14Z" transform="translate(4 5)" fill="#000" />
        <path d="M44 116h76v14H40q0-14 4-14Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M118 130h30l-2-8h-28Z" fill="var(--r2)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M146 132l14-50h10l-12 52Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M156 80l-10-4M160 80h14" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        <circle cx="172" cy="94" r="5" fill="#f2b233" stroke="#000" strokeWidth="2" />
        <path className="bor-beam" d="M178 92l26-8v22Z" fill="#f2b233" opacity=".35" />
        {wheel(70, 138)}{wheel(164, 138)}
      </g>
    </svg>
  );
}

/* packed (not out for delivery yet): the smiling parcel sits on the counter while a tape roll runs across its lid,
   sealing it (the tape strip draws behind the roll), then a "PACKED" label is stuck on the side. */
export function PackedArt() {
  return (
    <svg className="bop" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bop-floor" cx="112" cy="157" rx="64" ry="7" />
      <g className="bop-sparks"><path d="M28 38v10M23 43h10" /><path d="M192 24v9M187.5 28.5h9" /><circle cx="198" cy="110" r="3.5" /><circle cx="24" cy="104" r="2.5" /></g>
      <g className="bop-box">
        <path d="M60 78h88v72H60ZM148 78l24-17v72l-24 17Z" transform="translate(4 5)" fill="#000" />
        <path d="M148 78l24-17v72l-24 17Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M60 78h88v72H60Z" fill="var(--pk)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M60 78l24-17h88l-24 17Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
        {/* tape being laid along the lid seam, then down the front */}
        <path className="bop-tape" d="M72 70.5h88" />
        <path className="bop-tape2" d="M104 78v14" />
        <path d="M89 108q5-6 10 0M113 108q5-6 10 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M98 122q8 8 16 0" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="84" cy="120" r="4" fill="var(--blush)" opacity=".8" /><circle cx="128" cy="120" r="4" fill="var(--blush)" opacity=".8" />
        {/* label stuck on the side once sealed */}
        <g className="bop-label">
          <path d="M152 92l16-11v22l-16 11Z" fill="#fff" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
          <path d="M155 98l9-6M155 104l9-6" stroke="#01ae0f" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </g>
      {/* tape dispenser rolling along the seam */}
      <g className="bop-roll">
        <g transform="translate(72 66)">
          <circle r="11" transform="translate(3 3)" fill="#000" />
          <circle r="11" fill="#f2d3a4" stroke="#000" strokeWidth="2.5" />
          <circle r="5" fill="#fff" stroke="#000" strokeWidth="2" />
          <path d="M4 8l12 4" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
