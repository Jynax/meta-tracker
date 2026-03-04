import { useState, useRef } from "react";

const C = {
  cyan: '#22d3ee', emerald: '#34d399', rose: '#fb7185', amber: '#fbbf24',
  violet: '#a78bfa', slate: '#94a3b8', white: '#f8fafc', muted: '#94a3b8',
  bg: '#0f172a', cardBg: '#1e293b', border: '#334155',
};

function Card({ label, value, color = C.white, detail, tooltip: tooltipText }: { label: string; value: string | number; color?: string; detail?: string; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  useEffect(() => () => {
    if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
  }, []);
  const handleMouseEnter = () => {
    if (!tooltipText) return;
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    showTimerRef.current = window.setTimeout(() => setShowTooltip(true), 300);
  };
  const handleMouseLeave = () => {
    if (!tooltipText) return;
    if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setShowTooltip(false), 200);
  };
  return (
    <div style={{ position: 'relative' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="rounded-lg border" style={{ backgroundColor: C.cardBg, borderColor: C.border, padding: '8px 14px' }}>
        <div className="text-xl font-bold" style={{ color }}>{value}</div>
        <div className="text-[11px] uppercase tracking-wide" style={{ color: C.muted }}>{label}</div>
        {detail && <div className="text-xs" style={{ color: C.muted }}>{detail}</div>}
      </div>
      {tooltipText && showTooltip && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#94a3b8', zIndex: 50, whiteSpace: 'nowrap', pointerEvents: 'none', marginBottom: 6, }} >
          {tooltipText}
        </div>
      )}
    </div>
  );
}

function DonutBreakdown({ label, items, animate }: { label: string; items: Array<{ label: string; count: number; color: string }>; animate: boolean }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let accumulated = 0;
  const segments = items
    .filter((item) => item.count > 0)
    .map((item, index) => {
      const fullArcLength = total > 0 ? (item.count / total) * circumference : 0;
      const arcLength = Math.max(fullArcLength - 2, 0);
      const offset = -accumulated - 1;
      accumulated += fullArcLength;
      return { ...item, arcLength, offset, index };
    });
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
      <div className="flex flex-col items-center justify-center">
        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }} role="img" aria-label={`${label} breakdown chart`}>
          <circle cx="60" cy="60" r={radius} fill="none" stroke={C.border} strokeWidth="14" opacity="0.3" />
          {segments.map((seg) => (
            <circle key={seg.label} cx="60" cy="60" r={radius} fill="none" stroke={seg.color} strokeWidth="14" strokeDasharray={`${seg.arcLength} ${Math.max(circumference - seg.arcLength, 0)}`} strokeDashoffset={animate ? seg.offset : circumference} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 0.8s ease', transitionDelay: `${seg.index * 100}ms` }} />
          ))}
          <text x="60" y="56" textAnchor="middle" fill={C.muted} fontSize="12">{label}</text>
          <text x="60" y="72" textAnchor="middle" fill={C.white} fontSize="22" fontWeight="700">{total}</text>
        </svg>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
          {items.filter((item) => item.count > 0).map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              {item.label} <span style={{ color: C.white, fontWeight: 600 }}>({item.count})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export { Card, DonutBreakdown, C };
