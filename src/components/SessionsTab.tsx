import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import { formatShortDate, formatSessionDate, buildSmoothPath } from './chartUtils';
import type { SessionEntry, CodeVolumeEntry } from '../data/metaMetrics';

interface SessionsTabProps {
  sessions: SessionEntry[];
  codeVolume: CodeVolumeEntry[];
  totalPRs: number;
  totalHours: number;
  projectId: string;
  sessionFocusMap: Record<string, string>;
  sessionDateMap: Record<string, string>;
  chapterMap: Record<string, string>;
  onJumpToChapter?: (chapterId: string) => void;
  hoveredPointIndex: number | null;
  setHoveredPointIndex: (index: number | null) => void;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function SessionsTab({
  sessions, codeVolume, totalPRs, totalHours, projectId,
  sessionFocusMap, sessionDateMap, chapterMap,
  onJumpToChapter, hoveredPointIndex, setHoveredPointIndex, setTooltip,
}: SessionsTabProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const chartDims = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
  const chartInnerWidth = chartDims.width - chartDims.left - chartDims.right;
  const chartInnerHeight = chartDims.height - chartDims.top - chartDims.bottom;

  const sessionActivityPoints = useMemo(() => {
    const yTicks = 4;
    const maxMetric = Math.max(...sessions.map((item) => Math.max(item.prs, item.decisions, item.deadEnds)), 1);
    const raw = maxMetric / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const points = sessions.map((entry, index) => {
      const ratioX = sessions.length > 1 ? index / (sessions.length - 1) : 0;
      const x = chartDims.left + ratioX * chartInnerWidth;
      const date = sessionDateMap[entry.session] ?? entry.session;
      return {
        ...entry,
        date,
        dateLabel: formatShortDate(date),
        x,
        yPrs: chartDims.top + (1 - (entry.prs / yMax)) * chartInnerHeight,
        yDecisions: chartDims.top + (1 - (entry.decisions / yMax)) * chartInnerHeight,
        yDeadEnds: chartDims.top + (1 - (entry.deadEnds / yMax)) * chartInnerHeight,
      };
    });

    return { dims: chartDims, innerHeight: chartInnerHeight, yTicks, step, yMax, points };
  }, [sessions, sessionDateMap]);

  const sessionLines = useMemo(() => ({
    prs: buildSmoothPath(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yPrs }))),
    decisions: buildSmoothPath(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yDecisions }))),
    deadEnds: buildSmoothPath(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yDeadEnds }))),
  }), [sessionActivityPoints.points]);

  const sessionsByMonth = useMemo(() => {
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const groups = new Map<string, {
      key: string;
      label: string;
      monthIndex: number;
      sessions: Array<(typeof sessions)[number] & { date: string; displayDate: string }>;
      totalPRs: number;
      totalDecisions: number;
    }>();

    sessions.forEach((entry) => {
      const date = sessionDateMap[entry.session] ?? '';
      const [month = 'Jan'] = date.split(' ');
      const monthIndex = monthOrder.indexOf(month);
      const safeMonthIndex = monthIndex === -1 ? 0 : monthIndex;
      const key = `2026-${String(safeMonthIndex + 1).padStart(2, '0')}`;
      const label = `${month}/26`;
      const existing = groups.get(key) ?? { key, label, monthIndex: safeMonthIndex, sessions: [], totalPRs: 0, totalDecisions: 0 };
      existing.sessions.push({ ...entry, date, displayDate: formatSessionDate(date) });
      existing.totalPRs += entry.prs;
      existing.totalDecisions += entry.decisions;
      groups.set(key, existing);
    });

    return Array.from(groups.values()).sort((a, b) => b.monthIndex - a.monthIndex).map(g => ({ ...g, sessions: [...g.sessions].reverse() }));
  }, [sessions, sessionDateMap]);

  useEffect(() => {
    const latest = sessionsByMonth[0]?.key;
    setExpandedMonths(latest ? new Set([latest]) : new Set());
  }, [projectId, sessionsByMonth]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total PRs" value={totalPRs} color={C.emerald} />
        <Card label="Total Decisions" value={sessions.reduce((sum, item) => sum + item.decisions, 0)} color={C.cyan} />
        <Card label="Total Dead Ends" value={sessions.reduce((sum, item) => sum + item.deadEnds, 0)} color={C.rose} />
        <Card label="Total Hours" value={`${totalHours}h`} color={C.amber} />
      </div>

      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="mb-3 text-sm font-semibold">Session Activity</h3>
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
          <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Session activity chart">
            {Array.from({ length: sessionActivityPoints.yTicks + 1 }, (_, index) => {
              const value = index * sessionActivityPoints.step;
              const y = sessionActivityPoints.dims.top + sessionActivityPoints.innerHeight - (index / sessionActivityPoints.yTicks) * sessionActivityPoints.innerHeight;
              return (
                <g key={`session-activity-grid-${value}`}>
                  <line x1={sessionActivityPoints.dims.left} y1={y} x2={sessionActivityPoints.dims.width - sessionActivityPoints.dims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                  <text x={sessionActivityPoints.dims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}</text>
                </g>
              );
            })}

            <path d={sessionLines.prs} fill="none" stroke={C.cyan} strokeWidth="2" />
            <path d={sessionLines.decisions} fill="none" stroke={C.emerald} strokeWidth="2" />
            <path d={sessionLines.deadEnds} fill="none" stroke={C.rose} strokeWidth="2" />

            {sessionActivityPoints.points.map((point, index) => (
              <g key={`${point.session}-session-activity`}>
                {[
                  { label: 'PRs', value: point.prs, y: point.yPrs, color: C.cyan },
                  { label: 'Decisions', value: point.decisions, y: point.yDecisions, color: C.emerald },
                  { label: 'Dead Ends', value: point.deadEnds, y: point.yDeadEnds, color: C.rose },
                ].map((metric) => (
                  <circle
                    key={`${point.session}-${metric.label}`}
                    cx={point.x}
                    cy={metric.y}
                    r={hoveredPointIndex === index ? 6 : 4}
                    fill={metric.color}
                    onMouseEnter={(event) => {
                      setHoveredPointIndex(index);
                      setTooltip({
                        x: event.clientX, y: event.clientY,
                        content: (
                          <>
                            <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.date} — {point.label}</div>
                            <div style={{ color: C.slate, fontSize: 11 }}>{point.dateLabel}</div>
                            <div style={{ color: C.cyan, fontSize: 11 }}>PRs: {point.prs}</div>
                            <div style={{ color: C.emerald, fontSize: 11 }}>Decisions: {point.decisions}</div>
                            <div style={{ color: C.rose, fontSize: 11 }}>Dead Ends: {point.deadEnds}</div>
                            <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic', maxWidth: 220 }}>{sessionFocusMap[point.session] ?? ''}</div>
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
                <line
                  x1={point.x}
                  y1={sessionActivityPoints.dims.height - sessionActivityPoints.dims.bottom}
                  x2={point.x}
                  y2={(index % 2 === 0 ? sessionActivityPoints.dims.height - 10 : sessionActivityPoints.dims.height - 22) - 11}
                  stroke={C.slate} strokeWidth="1" strokeOpacity="0.7"
                />
                <text
                  x={point.x}
                  y={index % 2 === 0 ? sessionActivityPoints.dims.height - 10 : sessionActivityPoints.dims.height - 22}
                  textAnchor="middle" fill={C.slate} fontSize="10"
                >
                  {point.dateLabel}
                </text>
              </g>
            ))}
          </svg>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {[
              { label: 'PRs Merged', color: C.cyan },
              { label: 'Decisions', color: C.emerald },
              { label: 'Dead Ends', color: C.rose },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.slate }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sessionsByMonth.map((monthGroup) => {
          const isExpanded = expandedMonths.has(monthGroup.key);
          return (
            <div key={monthGroup.key} className="space-y-3">
              <button
                onClick={() => {
                  setExpandedMonths((prev) => {
                    const next = new Set(prev);
                    if (next.has(monthGroup.key)) next.delete(monthGroup.key);
                    else next.add(monthGroup.key);
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between rounded-lg border px-4 py-2.5"
                style={{ backgroundColor: C.cardBg, borderColor: C.border }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{monthGroup.label}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{monthGroup.sessions.length} session{monthGroup.sessions.length > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 12, color: C.slate }}>{monthGroup.totalPRs} PRs | {monthGroup.totalDecisions} decisions</span>
                </div>
                <span style={{ color: C.muted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>&#9654;</span>
              </button>
              <div
                className="grid gap-3 md:grid-cols-2"
                style={{ maxHeight: isExpanded ? 2000 : 0, overflow: 'hidden', transition: 'max-height 300ms ease' }}
              >
                {monthGroup.sessions.map((entry) => (
                  <div key={`${entry.session}-detail`} className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
                    <h4 className="text-base font-semibold">{entry.displayDate} — {entry.label}</h4>
                    <p className="mb-3 text-sm" style={{ color: C.cyan }}>{entry.focus}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: C.slate }}>
                      <span>Duration</span><span>{entry.duration}h</span>
                      <span>PRs</span><span>{entry.prs}</span>
                      <span>Decisions</span><span>{entry.decisions}</span>
                      <span>Dead Ends</span><span>{entry.deadEnds}</span>
                    </div>
                    <button
                      onClick={() => onJumpToChapter?.(entry.chapterId)}
                      className="mt-3 rounded-md border px-2.5 py-1 text-xs"
                      style={{ color: C.cyan, backgroundColor: '#22d3ee1a', borderColor: '#22d3ee55' }}
                    >
                      {'\uD83C\uDF33'} View chapter: {chapterMap[entry.chapterId] ?? entry.chapterId}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
