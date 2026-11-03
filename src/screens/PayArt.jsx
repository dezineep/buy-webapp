/* Payment illustrations in the order / search-empty style (black outline, offset black shadow, brand fills, a face).
   PayingArt : a smiling card slides into the wallet and back out on a loop while coins hop in; three dots bounce
               under it (the processing loader, Figma 2242:8034).
   FailedArt : the card droops and shakes with a worried face, a red cross badge is stamped on its corner, a sweat
               drop falls and the badge's rays pulse (payment failed, Figma 2242:8081).
   Styles: styles/pay.css (.bpa-*, .bpf-*) */
export function PayingArt() {
  return (
    <svg className="bpa" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bpa-floor" cx="110" cy="152" rx="66" ry="7" />
      <g className="bpa-sparks"><path d="M30 46v10M25 51h10" /><path d="M192 66v9M187.5 70.5h9" /><circle cx="180" cy="28" r="3" /><circle cx="26" cy="104" r="2.5" /></g>
      {/* the card goes in and comes back out of the wallet */}
      <g className="bpa-card">
        <rect x="74" y="34" width="76" height="50" rx="7" transform="translate(4 4)" fill="#000" />
        <rect x="74" y="34" width="76" height="50" rx="7" fill="var(--pk)" stroke="#000" strokeWidth="2.5" />
        <path d="M74 46h76" stroke="#000" strokeWidth="7" />
        <rect x="84" y="58" width="14" height="10" rx="2" fill="#f2b233" stroke="#000" strokeWidth="2" />
        <circle cx="117" cy="64" r="2.4" fill="#000" /><circle cx="131" cy="64" r="2.4" fill="#000" />
        <path d="M119 71q5 5 10 0" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {/* coins hopping into the wallet */}
      <g className="bpa-coin c1"><circle cx="58" cy="78" r="9" fill="#f2b233" stroke="#000" strokeWidth="2.2" /><path d="M55 74h6M55 78h6M58 74v8" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></g>
      <g className="bpa-coin c2"><circle cx="164" cy="80" r="8" fill="#f2b233" stroke="#000" strokeWidth="2.2" /><path d="M161 77h6M161 80h6M164 77v7" stroke="#000" strokeWidth="1.8" strokeLinecap="round" /></g>
      {/* wallet in front */}
      <g className="bpa-wallet">
        <path d="M58 80h104a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8Z" transform="translate(4 5)" fill="#000" />
        <path d="M58 80h104a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8H58a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8Z" fill="var(--r)" stroke="#000" strokeWidth="2.5" />
        <path d="M140 100h30v24h-30a12 12 0 0 1 0-24Z" fill="var(--side)" stroke="#000" strokeWidth="2.5" />
        <circle cx="142" cy="112" r="4" fill="#fff" stroke="#000" strokeWidth="2" />
        <circle className="bpa-eye" cx="88" cy="108" r="3" fill="#000" /><circle className="bpa-eye" cx="112" cy="108" r="3" fill="#000" />
        <path d="M93 118q7 7 14 0" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="80" cy="118" r="4" fill="var(--blush)" opacity=".85" /><circle cx="120" cy="118" r="4" fill="var(--blush)" opacity=".85" />
      </g>
      <g className="bpa-dots"><circle cx="96" cy="166" r="3.5" /><circle cx="110" cy="166" r="3.5" /><circle cx="124" cy="166" r="3.5" /></g>
    </svg>
  );
}

export function FailedArt() {
  return (
    <svg className="bpf" viewBox="0 0 220 170" width="220" height="170" aria-hidden="true">
      <ellipse className="bpf-floor" cx="108" cy="152" rx="62" ry="7" />
      <g className="bpf-card">
        <rect x="46" y="58" width="116" height="78" rx="10" transform="translate(5 5)" fill="#000" />
        <rect x="46" y="58" width="116" height="78" rx="10" fill="var(--pk)" stroke="#000" strokeWidth="2.5" />
        <path d="M46 76h116" stroke="#000" strokeWidth="9" />
        <rect x="60" y="94" width="20" height="14" rx="3" fill="#f2b233" stroke="#000" strokeWidth="2" />
        {/* worried face */}
        <path d="M104 96l8 3M136 96l-8 3" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        <circle className="bpf-eye" cx="112" cy="106" r="3" fill="#000" /><circle className="bpf-eye" cx="128" cy="106" r="3" fill="#000" />
        <path d="M112 122q8-7 16 0" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" />
        <path className="bpf-drop" d="M148 88c3 5 4 7 4 9a4 4 0 0 1-8 0c0-2 1-4 4-9Z" fill="#7cc4ff" stroke="#000" strokeWidth="1.8" />
      </g>
      {/* red cross badge stamped on the corner */}
      <g transform="translate(160 56)">
        <g className="bpf-badge">
          <g className="bpf-rays">{Array.from({ length: 8 }, (_, i) => <line key={i} x1="0" y1="-24" x2="0" y2="-31" transform={`rotate(${i * 45})`} />)}</g>
          <circle r="17" transform="translate(3 4)" fill="#000" />
          <circle r="17" fill="#e00004" stroke="#000" strokeWidth="2.5" />
          <path className="bpf-x" d="M-6-6L6 6M6-6L-6 6" />
        </g>
      </g>
    </svg>
  );
}
