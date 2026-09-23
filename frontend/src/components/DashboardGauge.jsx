// Decorative speedometer-style gauge for the homepage hero — a literal nod to
// the automotive dashboard rather than a generic illustration.
export default function DashboardGauge() {
  const ticks = Array.from({ length: 13 });

  return (
    <svg viewBox="0 0 320 320" width="320" height="320" role="presentation" aria-hidden="true">
      <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      {ticks.map((_, i) => {
        const angle = -220 + (i * 260) / (ticks.length - 1);
        const rad = (angle * Math.PI) / 180;
        const isMajor = i % 3 === 0;
        const r1 = isMajor ? 118 : 124;
        const r2 = 132;
        const x1 = 160 + r1 * Math.cos(rad);
        const y1 = 160 + r1 * Math.sin(rad);
        const x2 = 160 + r2 * Math.cos(rad);
        const y2 = 160 + r2 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isMajor ? "#ef9d00" : "rgba(255,255,255,0.4)"}
            strokeWidth={isMajor ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Needle pointing toward the upper-right, mid-dial */}
      <g transform="rotate(28 160 160)">
        <line x1="160" y1="160" x2="230" y2="160" stroke="#ef9d00" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="160" cy="160" r="10" fill="#ef9d00" />
      <text x="160" y="215" textAnchor="middle" fill="#f4f1e8" fontSize="26" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">
        12,480+
      </text>
      <text x="160" y="236" textAnchor="middle" fill="#9aa19a" fontSize="11" letterSpacing="1">
        verified listings
      </text>
    </svg>
  );
}
