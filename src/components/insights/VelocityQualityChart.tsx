import { C } from '../MetricsCard';
import { PROJECT_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function VelocityQualityChart({ data, setTooltip }: ChartProps) {
  // Build scatter data: x = avg LOC/session, y = bugs per 100 LOC
  const points = data.velocity.map((v, i) => {
    const bugEntry = data.bugSummaries.find(b => b.projectId === v.projectId);
    const totalBugs = bugEntry?.totalBugs ?? 0;
    const bugsPer100 = v.totalLoc > 0 ? Math.round((totalBugs / v.totalLoc) * 10000) / 100 : 0;
    const sessionCount = v.totalHours > 0 ? Math.max(1, Math.round(v.totalHours)) : 1;
    const locPerSession = Math.round(v.totalLoc / sessionCount);
    return { ...v, bugsPer100, locPerSession, totalBugs, color: PROJECT_COLORS[i % PROJECT_COLORS.length] };
  });

  const maxX = Math.max(...points.map(p => p.locPerSession), 1);
  const maxY = Math.max(...points.map(p => p.bugsPer100), 0.1);
  const maxHours = Math.max(...points.map(p => p.totalHours), 1);

  const chartW = 600;
  const chartH = 300;
  const pad = { left: 50, right: 80, top: 20, bottom: 40 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = chartH - pad.top - pad.bottom;

  // Aggressive short-name map so labels actually fit in a crowded chart.
  const shortName = (name: string) => {
    if (name.startsWith('BIP')) return 'BIP';
    if (name.startsWith('Remnants')) return 'Remnants';
    if (name.startsWith('JynaxxApps')) return 'Landing';
    if (name === 'Item-B-Gone') return 'IBG';
    if (name === 'On the Move') return 'OTM';
    if (name === 'Note Worthy') return 'NW';
    if (name === 'Meta Tracker') return 'Meta';
    if (name === 'Feedback Capture') return 'FC';
    if (name === 'Vuln Bank') return 'VB';
    return name;
  };

  // 2-D collision-avoiding label placement.
  // Strategy: try candidate anchor positions around each dot in preference order
  // (above → below → right → left), pick the first that doesn't overlap either
  // a previously placed label or the x-axis "safe zone" at the bottom.
  const CHAR_W = 5;        // approx pixel width per char at font-size 9
  const LABEL_H = 11;
  const LABEL_GAP = 3;     // dot-to-label gap
  const SAFE_BOTTOM = chartH - pad.bottom - 4; // labels must stay above this

  interface LabelBox { x: number; y: number; w: number; h: number; }
  const overlaps = (a: LabelBox, b: LabelBox) =>
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  const placed: LabelBox[] = [];

  const rawPositions = points
    .map((p, i) => {
      const x = pad.left + (p.locPerSession / maxX) * innerW;
      const y = pad.top + innerH - (p.bugsPer100 / maxY) * innerH;
      const r = 4 + (p.totalHours / maxHours) * 10;
      return { i, x, y, r, p };
    })
    // Place crowded bottom-right dots first so they get priority slots
    .sort((a, b) => (b.y - a.y) || (b.x - a.x));

  const labelPositions = rawPositions.map(({ i, x, y, r, p }) => {
    const label = shortName(p.projectName);
    const w = label.length * CHAR_W + 2;
    const h = LABEL_H;

    // Candidate anchors: [textAnchor, box topLeft x, box topLeft y]
    const candidates: Array<{ labelX: number; labelY: number; anchor: 'start' | 'end' | 'middle'; box: LabelBox }> = [
      // Above, centered
      { labelX: x, labelY: y - r - LABEL_GAP, anchor: 'middle',
        box: { x: x - w / 2, y: y - r - LABEL_GAP - h + 2, w, h } },
      // Below, centered
      { labelX: x, labelY: y + r + LABEL_GAP + h - 2, anchor: 'middle',
        box: { x: x - w / 2, y: y + r + LABEL_GAP, w, h } },
      // Right of dot
      { labelX: x + r + LABEL_GAP, labelY: y + 3, anchor: 'start',
        box: { x: x + r + LABEL_GAP, y: y - h / 2, w, h } },
      // Left of dot
      { labelX: x - r - LABEL_GAP, labelY: y + 3, anchor: 'end',
        box: { x: x - r - LABEL_GAP - w, y: y - h / 2, w, h } },
      // Above-right diagonal
      { labelX: x + r + LABEL_GAP, labelY: y - r - LABEL_GAP, anchor: 'start',
        box: { x: x + r + LABEL_GAP, y: y - r - LABEL_GAP - h + 2, w, h } },
    ];

    let chosen = candidates[0];
    for (const c of candidates) {
      const inSafeZone = c.box.y + c.box.h > SAFE_BOTTOM;
      const outOfLeft = c.box.x < pad.left - 4;
      const outOfRight = c.box.x + c.box.w > chartW - 4;
      if (inSafeZone || outOfLeft || outOfRight) continue;
      const collides = placed.some(b => overlaps(b, c.box));
      if (!collides) { chosen = c; break; }
    }

    placed.push(chosen.box);
    return { i, x, y, r, p, label, labelX: chosen.labelX, labelY: chosen.labelY, anchor: chosen.anchor };
  });

  return (
    <div className="overflow-x-auto">
      <svg width={chartW} height={chartH} className="w-full" viewBox={`0 0 ${chartW} ${chartH}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const y = pad.top + innerH * (1 - pct);
          const val = (maxY * pct).toFixed(1);
          return (
            <g key={pct}>
              <line x1={pad.left} y1={y} x2={chartW - pad.right} y2={y} stroke={C.border} strokeWidth={0.5} />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" fill={C.muted} fontSize={9}>{val}</text>
            </g>
          );
        })}
        {/* X-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map(pct => {
          const x = pad.left + innerW * pct;
          const val = Math.round(maxX * pct);
          return <text key={pct} x={x} y={chartH - 8} fill={C.muted} fontSize={9} textAnchor="middle">{val}</text>;
        })}
        <text x={chartW / 2} y={chartH - 0} fill={C.muted} fontSize={9} textAnchor="middle">LOC / session</text>
        <text x={10} y={pad.top + innerH / 2} fill={C.muted} fontSize={9} textAnchor="middle" transform={`rotate(-90, 10, ${pad.top + innerH / 2})`}>Bugs / 100 LOC</text>

        {/* Dots + direct labels */}
        {labelPositions.map(({ i, x, y, r, p, label, labelX, labelY, anchor }) => (
          <g key={i}>
            <circle
              cx={x} cy={y} r={r}
              fill={p.color} opacity={0.7}
              onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: (
                <div className="text-xs">
                  <div style={{ color: C.white }} className="font-medium">{p.projectName}</div>
                  <div style={{ color: C.muted }}>{p.locPerSession} LOC/session | {p.bugsPer100} bugs/100 LOC | {p.totalHours}h</div>
                </div>
              )})}
              onMouseLeave={() => setTooltip(null)}
            />
            <text x={labelX} y={labelY} textAnchor={anchor} fill={C.muted} fontSize={9} style={{ pointerEvents: 'none' }}>
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
