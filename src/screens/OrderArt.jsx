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
        <circle r={r} fill="#a52226" />
        <circle r={r - 4} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2" />
        <path className="boa-tick" d={`M${-r * .42} 0.5 L${-r * .1} ${r * .32} L${r * .45} ${-r * .3}`} />
      </g>
    </g>
  );
}

export function PlacedArt() {
  return (
    <svg className="boa boa-placed" viewBox="0 0 180 140" width="180" height="140" aria-hidden="true">
      <ellipse className="boa-shadow" cx="88" cy="128" rx="58" ry="6" />
      <g className="boa-box">
        {/* side, top, front */}
        <path d="M118 46 150 30v68l-32 22Z" fill="#efb2b4" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M38 46 70 30h80l-32 16Z" fill="#f7dfe0" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M92 30l-32 16h16l32-16Z" fill="#a52226" opacity=".9" />
        <path d="M38 46h80v74H38Z" fill="#f6e3e4" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M60 46h16v10l-4-3-4 3-4-3-4 3Z" fill="#a52226" opacity=".9" />
        <Badge x={78} y={86} r={15} />
      </g>
      <g className="boa-sparks"><path d="M22 40v10M17 45h10" /><path d="M162 18v8M158 22h8" /><circle cx="160" cy="70" r="2.6" /><circle cx="18" cy="96" r="2.2" /></g>
    </svg>
  );
}

const L_CLOSED = '40,62 80,48 115,48 75,62', L_UP = '40,62 80,48 80,12 40,26', L_OPEN = '40,62 80,48 52,30 12,44';
const R_CLOSED = '110,62 150,48 115,48 75,62', R_UP = '110,62 150,48 150,12 110,26', R_OPEN = '110,62 150,48 182,52 142,66';
const flap = (a, b, c) => <animate attributeName="points" values={`${a};${b};${c}`} keyTimes="0;0.45;1" calcMode="spline" keySplines=".4 0 .6 1;.2 .8 .3 1" dur=".75s" begin=".55s" fill="freeze" />;

export function DeliveredArt() {
  return (
    <svg className="boa boa-delivered" viewBox="0 0 196 140" width="196" height="140" aria-hidden="true">
      <ellipse className="boa-shadow" cx="95" cy="130" rx="66" ry="6" />
      <g className="boa-box">
        {/* inside of the box (seen once the flaps open) */}
        <path d="M40 62 80 48h70l-40 14Z" fill="#c98f92" stroke="#a52226" strokeWidth="2" strokeLinejoin="round" />
        {/* the badge sits inside and rises out after the flaps open */}
        <g className="boa-rise"><Badge x={95} y={70} r={16} /></g>
        <path d="M110 62 150 48v56l-40 18Z" fill="#efb2b4" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M40 62h70v60H40Z" fill="#f6e3e4" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M40 62h70v8H40Z" fill="#a52226" opacity=".12" />
        <polygon className="boa-flap" points={L_CLOSED} fill="#f7dfe0" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round">{flap(L_CLOSED, L_UP, L_OPEN)}</polygon>
        <polygon className="boa-flap" points={R_CLOSED} fill="#f2c9cb" stroke="#a52226" strokeWidth="2.2" strokeLinejoin="round">{flap(R_CLOSED, R_UP, R_OPEN)}</polygon>
      </g>
      <g className="boa-confetti">
        {[[60, 30, '#f2b233'], [128, 22, '#a52226'], [44, 52, '#01ae0f'], [150, 40, '#3f4ee3'], [96, 14, '#f2b233'], [72, 12, '#a52226'], [140, 64, '#01ae0f'], [34, 78, '#f2a0a4']].map(([cx, cy, c], i) => (
          <rect key={i} x={cx - 3} y={cy - 2} width="6" height="4" rx="1" fill={c} style={{ '--i': i, '--dx': `${(cx - 95) * .5}px`, '--dy': `${(cy - 70) * .6}px` }} />
        ))}
      </g>
    </svg>
  );
}
