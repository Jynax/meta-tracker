import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDerived, bipStack, bipDateRange } from '../data/bipMetrics';
import { metaCodeVolume, metaSessions, metaBugs, metaDerived, metaStack, metaDateRange } from '../data/metaMetrics';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDerived, remnantsStack, remnantsDateRange } from '../data/remnantsMetrics';
import { remnantsProject } from '../data/remnantsProject';

type MetricsTab = 'overview' | 'code' | 'bugs' | 'sessions';

interface MetricsDashboardProps {
  projectId: string;
  onJumpToChapter?: (chapterId: string) => void;
  initialTab?: MetricsTab;
}

const C = {
  cyan: '#22d3ee', emerald: '#34d399', rose: '#fb7185', amber: '#fbbf24',
  violet: '#a78bfa', slate: '#94a3b8', white: '#f8fafc', muted: '#64748b',
  bg: '#0f172a', cardBg: '#1e293b', border: '#334155',
};

const TABS: Array<{ id: MetricsTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'code', label: 'Code' },
  { id: 'bugs', label: 'Bugs' },
  { id: 'sessions', label: 'Sessions' },
];

export default function MetricsDashboard({ projectId, onJumpToChapter, initialTab = 'overview' }: MetricsDashboardProps) {
  const [tab, setTab] = useState<MetricsTab>(initialTab);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredCodeSession, setHoveredCodeSession] = useState<string | null>(null);
  const [hoveredNetSession, setHoveredNetSession] = useState<string | null>(null);
  const [hoveredSessionGroup, setHoveredSessionGroup] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);
  const [animateBugDonuts, setAnimateBugDonuts] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (tab !== 'bugs') return;
    setAnimateBugDonuts(false);
    const timer = window.setTimeout(() => setAnimateBugDonuts(true), 50);
    return () => window.clearTimeout(timer);
  }, [tab]);

  const selected = useMemo(() => {
    const project = projectId === 'meta' ? metaProject : projectId === 'remnants' ? remnantsProject : bipProject;
    const codeVolume = projectId === 'meta' ? metaCodeVolume : projectId === 'remnants' ? remnantsCodeVolume : bipCodeVolume;
    const sessions = projectId === 'meta' ? metaSessions : projectId === 'remnants' ? remnantsSessions : bipSessions;
    const bugs = projectId === 'meta' ? metaBugs : projectId === 'remnants' ? remnantsBugs : bipBugs;
    const derived = projectId === 'meta' ? metaDerived : projectId === 'remnants' ? remnantsDerived : bipDerived;
    const stack = projectId === 'meta' ? metaStack : projectId === 'remnants' ? remnantsStack : bipStack;
    const dateRange = projectId === 'meta' ? metaDateRange : projectId === 'remnants' ? remnantsDateRange : bipDateRange;
    return { project, codeVolume, sessions, bugs, derived, stack, dateRange };
  }, [projectId]);

  const chapterMap = useMemo(
    () => Object.fromEntries(selected.project.chapters.map((chapter) => [chapter.id, chapter.name])),
    [selected.project.chapters],
  );

  const totalPRs = selected.sessions.reduce((sum, item) => sum + item.prs, 0);
  const totalHours = selected.sessions.reduce((sum, item) => sum + item.duration, 0);
  const currentLoc = selected.codeVolume[selected.codeVolume.length - 1]?.total ?? 0;
  const totalAdded = selected.codeVolume.reduce((sum, item) => sum + item.added, 0);
  const totalDeleted = selected.codeVolume.reduce((sum, item) => sum + item.deleted, 0);
  const maxDelta = Math.max(...selected.codeVolume.map((item) => Math.max(item.added, item.deleted)), 1);
  const maxNetAbs = Math.max(...selected.codeVolume.map((item) => Math.abs(item.net)), 1);
  const maxSessionMetric = Math.max(...selected.sessions.map((item) => Math.max(item.prs, item.decisions, item.deadEnds)), 1);

  const chartDims = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
  const chartInnerWidth = chartDims.width - chartDims.left - chartDims.right;
  const chartInnerHeight = chartDims.height - chartDims.top - chartDims.bottom;
  const yTickCount = 4;
  const rawStep = currentLoc / yTickCount || 1;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const niceStep = Math.max(1, Math.ceil(rawStep / magnitude) * magnitude);
  const chartYMax = niceStep * yTickCount;

  const chartPoints = useMemo(
    () => selected.codeVolume.map((entry, index) => {
      const ratioX = selected.codeVolume.length > 1 ? index / (selected.codeVolume.length - 1) : 0;
      const ratioY = chartYMax > 0 ? entry.total / chartYMax : 0;
      return {
        ...entry,
        x: chartDims.left + ratioX * chartInnerWidth,
        y: chartDims.top + (1 - ratioY) * chartInnerHeight,
      };
    }),
    [chartInnerHeight, chartInnerWidth, chartYMax, selected.codeVolume],
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
  const sessionChartMaxHeight = 180;
  const scaleSessionBarHeight = (value: number) => Math.max(6, (value / maxSessionMetric) * sessionChartMaxHeight);

  const bySeverity = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.severity] = (acc[bug.severity] ?? 0) + 1;
    return acc;
  }, {});
  const byCategory = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.category] = (acc[bug.category] ?? 0) + 1;
    return acc;
  }, {});
  const bySource = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.source] = (acc[bug.source] ?? 0) + 1;
    return acc;
  }, {});

  const fixedBugs = selected.bugs.filter((bug) => bug.status.toLowerCase() === 'fixed').length;
  const openBugs = selected.bugs.length - fixedBugs;

  const Card = ({ label, value, color = C.white, detail }: { label: string; value: string | number; color?: string; detail?: string }) => (
    <div className="rounded-lg border" style={{ backgroundColor: C.cardBg, borderColor: C.border, padding: '8px 14px' }}>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide" style={{ color: C.muted }}>{label}</div>
      {detail && <div className="text-xs" style={{ color: C.muted }}>{detail}</div>}
    </div>
  );

  const DonutBreakdown = ({ title, label, items }: { title: string; label: string; items: Array<{ label: string; count: number; color: string }> }) => {
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const total = items.reduce((sum, item) => sum + item.count, 0);
    let accumulated = 0;
    const segments = items
      .filter((item) => item.count > 0)
      .map((item, index) => {
        const arcLength = total > 0 ? (item.count / total) * circumference : 0;
        const offset = -accumulated;
        accumulated += arcLength;
        return { ...item, arcLength, offset, index };
      });

    return (
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="mb-3 text-center text-sm font-semibold">{title}</h3>
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke={C.border} strokeWidth="14" opacity="0.3" />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={`${seg.arcLength} ${Math.max(circumference - seg.arcLength, 0)}`}
                strokeDashoffset={animateBugDonuts ? seg.offset : circumference}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.8s ease', transitionDelay: `${seg.index * 100}ms` }}
              />
            ))}
            <text x="60" y="56" textAnchor="middle" fill={C.white} fontSize="20" fontWeight="700">{total}</text>
            <text x="60" y="72" textAnchor="middle" fill={C.muted} fontSize="9">{label}</text>
          </svg>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 10 }}>
            {items.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: C.muted }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                {item.label} <span style={{ color: C.white, fontWeight: 600 }}>({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="rounded-2xl border p-4" style={{ backgroundColor: C.bg, borderColor: C.border }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: tab === item.id ? `${C.cyan}22` : C.cardBg,
              borderColor: tab === item.id ? C.cyan : C.border,
              color: tab === item.id ? C.cyan : C.slate,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card label="Sessions" value={selected.sessions.length} color={C.cyan} />
            <Card label="PRs Merged" value={totalPRs} color={C.emerald} />
            <Card label="Hours" value={`${totalHours}h`} color={C.amber} />
            <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
            <Card label="Timeline" value={`${selected.dateRange.start} – ${selected.dateRange.end}`} color={C.violet} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {selected.derived.map((metric) => (
              <Card key={metric.label} label={metric.label} value={metric.value} color={metric.color} detail={metric.detail} />
            ))}
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-2 text-sm font-semibold">Codebase Size Over Time</h3>
            <div className="relative">
              <svg viewBox={`0 0 ${chartDims.width} ${chartDims.height}`} style={{ width: '100%', height: 280 }}>
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
                      <line
                        x1={chartDims.left}
                        y1={y}
                        x2={chartDims.width - chartDims.right}
                        y2={y}
                        stroke={C.border}
                        strokeDasharray="4 4"
                        strokeOpacity="0.3"
                      />
                      <text x={chartDims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">
                        {value.toLocaleString()}
                      </text>
                    </g>
                  );
                })}

                <path d={areaPath} fill={`url(#locAreaGradient-${projectId})`} />
                <path d={smoothLinePath} fill="none" stroke={C.cyan} strokeWidth="2" />

                {hoveredPoint && (
                  <line
                    x1={hoveredPoint.x}
                    y1={hoveredPoint.y}
                    x2={hoveredPoint.x}
                    y2={chartDims.height - chartDims.bottom}
                    stroke={C.slate}
                    strokeDasharray="4 4"
                    strokeOpacity="0.45"
                  />
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
                      setTooltip({
                        x: event.clientX,
                        y: event.clientY,
                        content: (
                          <>
                            <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.label}</div>
                            <div style={{ color: C.cyan, fontSize: 11 }}>{point.total.toLocaleString()} LOC</div>
                          </>
                        ),
                      });
                    }}
                    onMouseMove={(event) => {
                      setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                    }}
                    onMouseLeave={() => {
                      setHoveredPointIndex(null);
                      setTooltip(null);
                    }}
                  />
                ))}

                {chartPoints.map((point) => (
                  <text
                    key={`${point.session}-label`}
                    x={point.x}
                    y={chartDims.height - 10}
                    textAnchor="middle"
                    fill={C.slate}
                    fontSize="10"
                  >
                    {point.label}
                  </text>
                ))}
              </svg>

            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Stack Profile</h3>
            <div className="flex flex-wrap gap-2">
              {selected.stack.map((item) => {
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
      )}

      {tab === 'code' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Total Added" value={totalAdded.toLocaleString()} color={C.emerald} />
            <Card label="Total Deleted" value={totalDeleted.toLocaleString()} color={C.rose} />
            <Card label="Net Change" value={(totalAdded - totalDeleted).toLocaleString()} color={C.cyan} />
            <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Lines Added vs Deleted</h3>
            <div className="space-y-3">
              {selected.codeVolume.filter((entry) => entry.added > 0 || entry.deleted > 0).map((entry) => (
                <div
                  key={entry.session}
                  onMouseEnter={(event) => {
                    setHoveredCodeSession(entry.session);
                    setTooltip({
                      x: event.clientX,
                      y: event.clientY,
                      content: (
                        <>
                          <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.session}</div>
                          <div style={{ color: C.cyan, fontSize: 11 }}>Added: {entry.added.toLocaleString()}</div>
                          <div style={{ color: C.rose, fontSize: 11 }}>Deleted: {entry.deleted.toLocaleString()}</div>
                        </>
                      ),
                    });
                  }}
                  onMouseMove={(event) => {
                    setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                  }}
                  onMouseLeave={() => {
                    setHoveredCodeSession(null);
                    setTooltip(null);
                  }}
                  style={{
                    backgroundColor: hoveredCodeSession === entry.session ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
                    borderRadius: 8,
                    padding: 6,
                  }}
                >
                  <div className="mb-1 text-xs" style={{ color: C.slate }}>{entry.session}</div>
                  <div className="flex gap-2">
                    <div className="h-3 rounded" style={{ width: `${(entry.added / maxDelta) * 100}%`, backgroundColor: C.emerald }} />
                    <div className="h-3 rounded" style={{ width: `${(entry.deleted / maxDelta) * 100}%`, backgroundColor: C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Net Change by Session</h3>
            <div className="space-y-3">
              {selected.codeVolume.map((entry) => (
                <div
                  key={`${entry.session}-net`}
                  onMouseEnter={(event) => {
                    setHoveredNetSession(entry.session);
                    setTooltip({
                      x: event.clientX,
                      y: event.clientY,
                      content: (
                        <>
                          <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.session}</div>
                          <div style={{ color: entry.net >= 0 ? C.emerald : C.rose, fontSize: 11 }}>
                            Net: {entry.net > 0 ? '+' : ''}{entry.net.toLocaleString()}
                          </div>
                        </>
                      ),
                    });
                  }}
                  onMouseMove={(event) => {
                    setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                  }}
                  onMouseLeave={() => {
                    setHoveredNetSession(null);
                    setTooltip(null);
                  }}
                  style={{
                    backgroundColor: hoveredNetSession === entry.session ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
                    borderRadius: 8,
                    padding: 6,
                  }}
                >
                  <div className="mb-1 flex justify-between text-xs" style={{ color: C.slate }}>
                    <span>{entry.session}</span>
                    <span>{entry.net > 0 ? '+' : ''}{entry.net}</span>
                  </div>
                  <div className="h-3 rounded" style={{ backgroundColor: '#0b1220' }}>
                    <div className="h-3 rounded" style={{ width: `${(Math.abs(entry.net) / maxNetAbs) * 100}%`, backgroundColor: entry.net >= 0 ? C.emerald : C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'bugs' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card label="Total" value={selected.bugs.length} color={C.rose} />
            <Card label="Fixed" value={fixedBugs} color={C.emerald} />
            <Card label="Open / Deferred" value={openBugs} color={C.amber} />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <DonutBreakdown
              title="By Severity"
              label="severity"
              items={[
                { label: 'Critical', count: bySeverity.Critical ?? 0, color: '#ef4444' },
                { label: 'High', count: bySeverity.High ?? 0, color: '#f97316' },
                { label: 'Medium', count: bySeverity.Medium ?? 0, color: '#fbbf24' },
                { label: 'Low', count: bySeverity.Low ?? 0, color: '#64748b' },
              ]}
            />
            <DonutBreakdown
              title="By Category"
              label="category"
              items={[
                { label: 'Technical', count: byCategory.Technical ?? 0, color: '#22d3ee' },
                { label: 'Functional', count: byCategory.Functional ?? 0, color: '#34d399' },
                { label: 'UX', count: byCategory.UX ?? 0, color: '#fbbf24' },
              ]}
            />
            <DonutBreakdown
              title="By Source"
              label="source"
              items={[
                { label: 'ChatGPT Code Review', count: bySource['ChatGPT Code Review'] ?? 0, color: '#22d3ee' },
                { label: 'Cowork Audit', count: bySource['Cowork Audit'] ?? 0, color: '#34d399' },
                { label: 'Code Review', count: bySource['Code Review'] ?? 0, color: '#a78bfa' },
                { label: 'Cowork Code Review', count: bySource['Cowork Code Review'] ?? 0, color: '#fbbf24' },
                { label: 'User Report', count: bySource['User Report'] ?? 0, color: '#fb7185' },
                { label: 'Codex Auto-Review', count: bySource['Codex Auto-Review'] ?? 0, color: '#64748b' },
              ]}
            />
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: '#162136' }}>
                  {['#', 'Summary', 'Severity', 'Category', 'Source', 'Status'].map((header) => (
                    <th key={header} className="px-3 py-2 text-left font-semibold" style={{ color: C.slate }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.bugs.map((bug) => (
                  <tr key={bug.id} className="border-t" style={{ borderColor: C.border }}>
                    <td className="px-3 py-2">{bug.id}</td>
                    <td className="px-3 py-2">{bug.summary}</td>
                    <td className="px-3 py-2" style={{ color: bug.severity === 'Critical' ? C.rose : bug.severity === 'High' ? C.amber : bug.severity === 'Medium' ? C.cyan : C.muted }}>{bug.severity}</td>
                    <td className="px-3 py-2">{bug.category}</td>
                    <td className="px-3 py-2">{bug.source}</td>
                    <td className="px-3 py-2" style={{ color: bug.status.toLowerCase() === 'fixed' ? C.emerald : C.amber }}>{bug.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Total PRs" value={totalPRs} color={C.emerald} />
            <Card label="Total Decisions" value={selected.sessions.reduce((sum, item) => sum + item.decisions, 0)} color={C.cyan} />
            <Card label="Total Dead Ends" value={selected.sessions.reduce((sum, item) => sum + item.deadEnds, 0)} color={C.rose} />
            <Card label="Total Hours" value={`${totalHours}h`} color={C.amber} />
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Session Activity</h3>
            <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
              <div style={{ position: 'absolute', inset: '20px 0 28px 0', pointerEvents: 'none' }}>
                {Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={`session-grid-${index}`}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: `${(index / 4) * sessionChartMaxHeight}px`,
                      borderTop: `1px dashed ${C.border}`,
                      opacity: 0.25,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '20px 0 28px', minHeight: 228, position: 'relative' }}>
                {selected.sessions.map((entry) => (
                  <div
                    key={`${entry.session}-activity`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '6px 8px',
                      borderRadius: 8,
                      backgroundColor: hoveredSessionGroup === entry.session ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      {[
                        { value: entry.prs, color: C.cyan },
                        { value: entry.decisions, color: C.emerald },
                        { value: entry.deadEnds, color: C.rose },
                      ].map((bar, idx) => (
                        <div
                          key={`${entry.session}-bar-${idx}`}
                          onMouseEnter={(event) => {
                            setHoveredSessionGroup(entry.session);
                            setTooltip({
                              x: event.clientX,
                              y: event.clientY,
                              content: (
                                <>
                                  <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.session}</div>
                                  <div style={{ color: C.cyan, fontSize: 11 }}>PRs Merged: {entry.prs}</div>
                                  <div style={{ color: C.emerald, fontSize: 11 }}>Decisions: {entry.decisions}</div>
                                  <div style={{ color: C.rose, fontSize: 11 }}>Dead Ends: {entry.deadEnds}</div>
                                </>
                              ),
                            });
                          }}
                          onMouseMove={(event) => {
                            setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                          }}
                          onMouseLeave={() => {
                            setHoveredSessionGroup(null);
                            setTooltip(null);
                          }}
                          style={{
                            width: 20,
                            height: scaleSessionBarHeight(bar.value),
                            background: bar.color,
                            borderRadius: '4px 4px 0 0',
                            transition: 'opacity 0.15s ease',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: C.muted, marginTop: 6, textAlign: 'center' }}>{entry.session}</span>
                  </div>
                ))}
              </div>
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
          <div className="grid gap-3 md:grid-cols-2">
            {selected.sessions.map((entry) => (
              <div key={`${entry.session}-detail`} className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
                <h4 className="text-base font-semibold">{entry.session}</h4>
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
                  🌳 View chapter: {chapterMap[entry.chapterId] ?? entry.chapterId}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      {tooltip && (
      <div
        style={{
          position: 'fixed',
          left: tooltip.x + 12,
          top: tooltip.y - 10,
          background: 'rgba(15, 23, 42, 0.95)',
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: '8px 12px',
          pointerEvents: 'none',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        {tooltip.content}
      </div>
      )}
    </>
  );
}
