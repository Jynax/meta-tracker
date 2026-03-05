import { useMemo, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import type { CodeVolumeEntry, SessionEntry, DerivedMetric, StackEntry, WorkCategory } from '../data/metaMetrics';

interface OverviewTabProps {
  sessions: SessionEntry[];
  codeVolume: CodeVolumeEntry[];
  derived: DerivedMetric[];
  stack: StackEntry[];
  totalPRs: number;
  totalHours: number;
  currentLoc: number;
  timelineRange: string;
  projectId: string;
  sessionFocusMap: Record<string, string>;
  hoveredPointIndex: number | null;
  setHoveredPointIndex: (index: number | null) => void;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function OverviewTab({
  sessions, codeVolume, derived, stack,
  totalPRs, totalHours, currentLoc, timelineRange, projectId,
  sessionFocusMap, hoveredPointIndex, setHoveredPointIndex, setTooltip,
}: OverviewTabProps) {
  const chartDims = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
  const chartInnerWidth = chartDims.width - chartDims.left - chartDims.right;
  const chartInnerHeight = chartDims.height - chartDims.top - chartDims.bottom;
  const yTickCount = 4;
  const rawStep = currentLoc / yTickCount || 1;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const niceStep = Math.max(1, Math.ceil(rawStep / magnitude) * magnitude);
  const chartYMax = niceStep * yTickCount;

  const chartPoints = useMemo(
    () => codeVolume.map((entry, index) => {
      const ratioX = codeVolume.length > 1 ? index / (codeVolume.length - 1) : 0;
      const ratioY = chartYMax > 0 ? entry.total / chartYMax : 0;
      return {
        ...entry,
        focus: sessionFocusMap[entry.session] ?? '',
        x: chartDims.left + ratioX * chartInnerWidth,
        y: chartDims.top + (1 - ratioY) * chartInnerHeight,
      };
    }),
    [chartInnerHeight, chartInnerWidth, chartYMax, codeVolume, sessionFocusMap],
  );

  const smoothLinePath = useMemo(() => {
    if (!chartPoints.length) return '';
    if (chartPoints.length === 1) return `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    let path = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i += 1) {
      const previous = chartPoints[i - 1];
      const current = chartPoints[i];
      const midX = (previous.x + current.x) / 2;
      const midY = (previous.y + current.y) / 2;
      path += ` Q ${previous.x} ${previous.y} ${midX} ${midY}`;
    }
    const last = chartPoints[chartPoints.length - 1];
    path += ` L ${last.x} ${last.y}`;
    return path;
  }, [chartPoints]);

  const areaPath = useMemo(() => {
    if (!chartPoints.length || !smoothLinePath) return '';
    const first = chartPoints[0];
    const last = chartPoints[chartPoints.length - 1];
    const baseline = chartDims.height - chartDims.bottom;
    return `${smoothLinePath} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
  }, [chartPoints, smoothLinePath]);

  const hoveredPoint = hoveredPointIndex === null ? null : chartPoints[hoveredPointIndex];
  const milestoneFlags = useMemo(
    () => codeVolume.map((entry, index) => {
      if (index === 0 || index === codeVolume.length - 1) return true;
      const prev = codeVolume[index - 1].total;
      return entry.total - prev >= 500;
    }),
    [codeVolume],
  );

  const cats: Array<{ key: WorkCategory; color: string }> = [
    { key: 'Feature', color: C.cyan },
    { key: 'Refactor', color: C.violet },
    { key: 'Bug', color: C.rose },
    { key: 'Tooling', color: C.amber },
  ];
  const workMixCounts = useMemo(() => cats.map(c => ({
    ...c,
    count: sessions.filter(s => s.workCategory === c.key).length,
  })), [sessions]);
  const workMixTotal = workMixCounts.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card label="Sessions" value={sessions.length} color={C.cyan} />
        <Card label="PRs Merged" value={totalPRs} color={C.emerald} />
        <Card label="Hours" value={`${totalHours}h`} color={C.amber} />
        <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
        <Card label="Timeline" value={timelineRange} color={C.violet} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {derived.map((metric) => (
          <Card
            key={metric.label}
            label={metric.label}
            value={metric.value}
            color={metric.color}
            detail={metric.detail}
            tooltip={{
              'Churn Rate': 'Ratio of lines deleted to lines added',
              'Codex Success': 'Percentage of Codex tasks that produced clean PRs',
              'Cycle Time': 'Average time from PR creation to merge',
              Decisions: 'Average decisions tracked per work session',
              'Bug Rate': 'Average bugs discovered per PR merged',
            }[metric.label]}
          />
        ))}
      </div>

      {workMixTotal > 0 && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
          <h3 className="text-sm font-semibold" style={{ color: C.white }}>Work Mix</h3>
          <div className="text-xs mb-3" style={{ color: C.muted }}>Sessions by category</div>
          <div className="flex rounded-md overflow-hidden" style={{ height: 28 }}>
            {workMixCounts.filter(c => c.count > 0).map(c => (
              <div
                key={c.key}
                style={{
                  width: `${(c.count / workMixTotal) * 100}%`,
                  backgroundColor: c.color,
                  minWidth: 4,
                  transition: 'width 0.5s ease',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
            {workMixCounts.filter(c => c.count > 0).map(c => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                {c.key} <span style={{ color: C.white, fontWeight: 600 }}>{c.count}</span>
                <span style={{ color: C.slate }}>({Math.round((c.count / workMixTotal) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="mb-2 text-sm font-semibold">Codebase Size Over Time</h3>
        <div className="relative">
          <svg viewBox={`0 0 ${chartDims.width} ${chartDims.height}`} style={{ width: '100%', height: 280 }} role="img" aria-label="Codebase size over time chart">
            <defs>
              <linearGradient id={`locAreaGradient-${projectId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.cyan} stopOpacity="0.3" />
                <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
              </linearGradient>
            </defs>

            {Array.from({ length: yTickCount + 1 }, (_, index) => {
              const value = index * niceStep;
              const y = chartDims.top + chartInnerHeight - (index / yTickCount) * chartInnerHeight;
              return (
                <g key={`tick-${value}`}>
                  <line x1={chartDims.left} y1={y} x2={chartDims.width - chartDims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                  <text x={chartDims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value.toLocaleString()}</text>
                </g>
              );
            })}

            <path d={areaPath} fill={`url(#locAreaGradient-${projectId})`} />
            <path d={smoothLinePath} fill="none" stroke={C.cyan} strokeWidth="2" />

            {hoveredPoint && (
              <line x1={hoveredPoint.x} y1={hoveredPoint.y} x2={hoveredPoint.x} y2={chartDims.height - chartDims.bottom} stroke={C.slate} strokeDasharray="4 4" strokeOpacity="0.45" />
            )}

            {chartPoints.map((point, index) => (
              <circle
                key={point.session}
                cx={point.x}
                cy={point.y}
                r={hoveredPointIndex === index ? 6 : 4}
                fill={C.cyan}
                onMouseEnter={(event) => {
                  setHoveredPointIndex(index);
                  const delta = index > 0 ? point.total - codeVolume[index - 1].total : 0;
                  setTooltip({
                    x: event.clientX, y: event.clientY,
                    content: (
                      <>
                        <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.label}</div>
                        <div style={{ color: C.cyan, fontSize: 11 }}>{point.total.toLocaleString()} LOC</div>
                        {index > 0 && (
                          <div style={{ color: delta >= 0 ? C.emerald : C.rose, fontSize: 11 }}>
                            {delta >= 0 ? '+' : ''}{delta.toLocaleString()} lines
                          </div>
                        )}
                        <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic', maxWidth: 220 }}>{point.focus}</div>
                      </>
                    ),
                  });
                }}
                onMouseMove={(event) => {
                  setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                }}
                onMouseLeave={() => { setHoveredPointIndex(null); setTooltip(null); }}
              />
            ))}

            {chartPoints.map((point, index) => {
              if (!milestoneFlags[index]) return null;
              const milestoneIndex = milestoneFlags.slice(0, index + 1).filter(Boolean).length - 1;
              const y = milestoneIndex % 2 === 0 ? chartDims.height - 10 : chartDims.height - 22;
              const baselineY = chartDims.height - chartDims.bottom;
              return (
                <g key={`${point.session}-label`}>
                  <line x1={point.x} y1={baselineY} x2={point.x} y2={y - 11} stroke={C.slate} strokeWidth="1" strokeOpacity="0.7" />
                  <text x={point.x} y={y} textAnchor="middle" fill={C.slate} fontSize="10">{point.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="mb-3 text-sm font-semibold">Stack Profile</h3>
        <div className="flex flex-wrap gap-2">
          {stack.map((item) => {
            const dot = item.cat === 'Core' ? C.cyan : item.cat === 'UI' ? C.emerald : item.cat === 'Build' ? C.amber : C.violet;
            return (
              <div key={`${item.name}-${item.cat}`} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: C.border, backgroundColor: '#111b30' }}>
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
                <span>{item.name}</span>
                <span style={{ color: C.muted }}>({item.cat})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
