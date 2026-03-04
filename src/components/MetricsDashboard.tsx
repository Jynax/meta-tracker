import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDerived, bipStack, bipDateRange } from '../data/bipMetrics';
import { metaCodeVolume, metaSessions, metaBugs, metaDerived, metaStack, metaDateRange } from '../data/metaMetrics';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDerived, remnantsStack, remnantsDateRange } from '../data/remnantsMetrics';
import { remnantsProject } from '../data/remnantsProject';

import { Card, DonutBreakdown, C } from "./MetricsCard";
import { formatShortDate, formatSessionDate, buildSmoothPath } from "./chartUtils";
type MetricsTab = 'overview' | 'code' | 'bugs' | 'sessions';

interface MetricsDashboardProps {
  projectId: string;
  onJumpToChapter?: (chapterId: string) => void;
  initialTab?: MetricsTab;
  onTabChange?: (tab: MetricsTab) => void;


const TABS: Array<{ id: MetricsTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'code', label: 'Code' },
  { id: 'bugs', label: 'Bugs' },
  { id: 'sessions', label: 'Sessions' },
];


export default function MetricsDashboard({ projectId, onJumpToChapter, initialTab = 'overview', onTabChange }: MetricsDashboardProps) {
  const [tab, setTab] = useState<MetricsTab>(initialTab);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredCodeSession, setHoveredCodeSession] = useState<string | null>(null);
  const [hoveredNetSession, setHoveredNetSession] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);
  const [animateBugDonuts, setAnimateBugDonuts] = useState(false);
  const [expandedCodeRows, setExpandedCodeRows] = useState<Set<string>>(new Set());
  const [expandedNetRows, setExpandedNetRows] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setExpandedCodeRows(new Set());
    setExpandedNetRows(new Set());
  }, [projectId]);

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

  const sessionFocusMap = useMemo(() => {
    const map: Record<string, string> = {};
    selected.sessions.forEach((session) => {
      map[session.session] = session.focus;
    });
    return map;
  }, [selected.sessions]);

  const sessionDateMap = useMemo(() => {
    const map: Record<string, string> = {};
    selected.codeVolume.forEach((entry) => {
      map[entry.session] = entry.date;
    });
    return map;
  }, [selected.codeVolume]);

  const totalPRs = selected.sessions.reduce((sum, item) => sum + item.prs, 0);
  const totalHours = selected.sessions.reduce((sum, item) => sum + item.duration, 0);
  const currentLoc = selected.codeVolume[selected.codeVolume.length - 1]?.total ?? 0;
  const totalAdded = selected.codeVolume.reduce((sum, item) => sum + item.added, 0);
  const totalDeleted = selected.codeVolume.reduce((sum, item) => sum + item.deleted, 0);
  const firstDate = selected.codeVolume[0]?.date ?? selected.dateRange.start;
  const lastDate = selected.codeVolume[selected.codeVolume.length - 1]?.date ?? selected.dateRange.end;
  const timelineRange = `${firstDate} ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ ${lastDate}/26`;


  const codeEntriesWithActivity = useMemo(
    () => selected.codeVolume.filter((entry) => entry.added > 0 || entry.deleted > 0),
    [selected.codeVolume],
  );

  const dateGroups = useMemo(() => {
    const grouped = new Map<string, { date: string; entries: Array<(typeof codeEntriesWithActivity)[number]>; added: number; deleted: number }>();
    codeEntriesWithActivity.forEach((entry) => {
      const existing = grouped.get(entry.date);
      if (existing) {
        existing.entries.push(entry);
        existing.added += entry.added;
        existing.deleted += entry.deleted;
        return;
      }
      grouped.set(entry.date, { date: entry.date, entries: [entry], added: entry.added, deleted: entry.deleted });
    });
    return Array.from(grouped.values());
  }, [codeEntriesWithActivity]);

  const codeTopRows = useMemo(() => {
    if (dateGroups.length <= 8) {
      return dateGroups.map((group) => ({
        kind: 'date' as const,
        key: group.date,
        label: group.date,
        added: group.added,
        deleted: group.deleted,
        dates: [group],
      }));
    }

    const mergedDateCount = dateGroups.length - 7;
    const mergedDates = dateGroups.slice(0, mergedDateCount);
    const firstDate = mergedDates[0]?.date ?? '';
    const lastDate = mergedDates[mergedDates.length - 1]?.date ?? '';
    const [firstMonth, firstDay] = firstDate.split(' ');
    const [lastMonth, lastDay] = lastDate.split(' ');
    const rangeLabel = firstMonth === lastMonth ? `${firstMonth} ${firstDay}-${lastDay}` : `${firstDate}-${lastDate}`;

    const rangeRow = {
      kind: 'range' as const,
      key: rangeLabel,
      label: rangeLabel,
      added: mergedDates.reduce((sum, date) => sum + date.added, 0),
      deleted: mergedDates.reduce((sum, date) => sum + date.deleted, 0),
      dates: mergedDates,
    };

    const remainingRows = dateGroups.slice(mergedDateCount).map((group) => ({
      kind: 'date' as const,
      key: group.date,
      label: group.date,
      added: group.added,
      deleted: group.deleted,
      dates: [group],
    }));

    return [rangeRow, ...remainingRows];
  }, [dateGroups]);

  const codeDeltaMax = useMemo(
    () => Math.max(
      ...codeEntriesWithActivity.map((item) => Math.max(item.added, item.deleted)),
      ...codeTopRows.map((row) => Math.max(row.added, row.deleted)),
      1,
    ),
    [codeEntriesWithActivity, codeTopRows],
  );

  const netDateGroups = useMemo(() => {
    const grouped = new Map<string, { date: string; entries: Array<(typeof selected.codeVolume)[number]>; net: number }>();
    codeEntriesWithActivity.forEach((entry) => {
      const existing = grouped.get(entry.date);
      if (existing) {
        existing.entries.push(entry);
        existing.net += entry.net;
        return;
      }
      grouped.set(entry.date, { date: entry.date, entries: [entry], net: entry.net });
    });
    return Array.from(grouped.values());
  }, [codeEntriesWithActivity]);

  const netTopRows = useMemo(() => {
    if (netDateGroups.length <= 8) {
      return netDateGroups.map((group) => ({
        kind: 'date' as const,
        key: group.date,
        label: group.date,
        net: group.net,
        dates: [group],
      }));
    }

    const mergedDateCount = netDateGroups.length - 7;
    const mergedDates = netDateGroups.slice(0, mergedDateCount);
    const firstDate = mergedDates[0]?.date ?? '';
    const lastDate = mergedDates[mergedDates.length - 1]?.date ?? '';
    const [firstMonth, firstDay] = firstDate.split(' ');
    const [lastMonth, lastDay] = lastDate.split(' ');
    const rangeLabel = firstMonth === lastMonth ? `${firstMonth} ${firstDay}-${lastDay}` : `${firstDate}-${lastDate}`;

    const rangeRow = {
      kind: 'range' as const,
      key: rangeLabel,
      label: rangeLabel,
      net: mergedDates.reduce((sum, date) => sum + date.net, 0),
      dates: mergedDates,
    };

    const remainingRows = netDateGroups.slice(mergedDateCount).map((group) => ({
      kind: 'date' as const,
      key: group.date,
      label: group.date,
      net: group.net,
      dates: [group],
    }));

    return [rangeRow, ...remainingRows];
  }, [netDateGroups]);

  const maxNetAbsGrouped = useMemo(
    () => Math.max(
      ...selected.codeVolume.map((item) => Math.abs(item.net)),
      ...netTopRows.map((row) => Math.abs(row.net)),
      1,
    ),
    [selected.codeVolume, netTopRows],
  );

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
        focus: sessionFocusMap[entry.session] ?? '',
        x: chartDims.left + ratioX * chartInnerWidth,
        y: chartDims.top + (1 - ratioY) * chartInnerHeight,
      };
    }),
    [chartInnerHeight, chartInnerWidth, chartYMax, selected.codeVolume, sessionFocusMap],
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



  const sessionActivityPoints = useMemo(() => {
    const dims = chartDims;
    const innerWidth = chartInnerWidth;
    const innerHeight = chartInnerHeight;
    const yTicks = 4;
    const maxMetric = Math.max(...selected.sessions.map((item) => Math.max(item.prs, item.decisions, item.deadEnds)), 1);
    const raw = maxMetric / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const points = selected.sessions.map((entry, index) => {
      const ratioX = selected.sessions.length > 1 ? index / (selected.sessions.length - 1) : 0;
      const x = dims.left + ratioX * innerWidth;
      const date = sessionDateMap[entry.session] ?? entry.session;
      return {
        ...entry,
        date,
        dateLabel: formatShortDate(date),
        x,
        yPrs: dims.top + (1 - (entry.prs / yMax)) * innerHeight,
        yDecisions: dims.top + (1 - (entry.decisions / yMax)) * innerHeight,
        yDeadEnds: dims.top + (1 - (entry.deadEnds / yMax)) * innerHeight,
      };
    });

    return { dims, innerHeight, yTicks, step, yMax, points };
  }, [selected.sessions, sessionDateMap]);


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
      sessions: Array<(typeof selected.sessions)[number] & { date: string; displayDate: string }>;
      totalPRs: number;
      totalDecisions: number;
    }>();

    selected.sessions.forEach((entry) => {
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

    return Array.from(groups.values()).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [selected.sessions, sessionDateMap]);

  useEffect(() => {
    const latest = sessionsByMonth[sessionsByMonth.length - 1]?.key;
    setExpandedMonths(latest ? new Set([latest]) : new Set());
  }, [projectId, sessionsByMonth]);

  const { bySeverity, byCategory, bySource, fixedBugs, openBugs } = useMemo(() => {
    const bySev = selected.bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.severity] = (acc[bug.severity] ?? 0) + 1; return acc; }, {});
    const byCat = selected.bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.category] = (acc[bug.category] ?? 0) + 1; return acc; }, {});
    const bySrc = selected.bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.source] = (acc[bug.source] ?? 0) + 1; return acc; }, {});
    const fixed = selected.bugs.filter((bug) => bug.status.toLowerCase() === 'fixed').length;
    return { bySeverity: bySev, byCategory: byCat, bySource: bySrc, fixedBugs: fixed, openBugs: selected.bugs.length - fixed };
  }, [selected.bugs]);

  return (
    <>
      <div className="rounded-2xl border p-4" style={{ backgroundColor: C.bg, borderColor: C.border }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id);
              onTabChange?.(item.id);
            }}
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
            <Card label="Timeline" value={timelineRange} color={C.violet} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {selected.derived.map((metric) => (
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
                            <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic', maxWidth: 220 }}>{point.focus}</div>
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

                {chartPoints.map((point, index) => {
                  const y = index % 2 === 0 ? chartDims.height - 10 : chartDims.height - 22;
                  const baselineY = chartDims.height - chartDims.bottom;
                  return (
                    <g key={`${point.session}-label`}>
                      <line x1={point.x} y1={baselineY} x2={point.x} y2={y - 11} stroke={C.slate} strokeWidth="1" strokeOpacity="0.7" />
                      <text x={point.x} y={y} textAnchor="middle" fill={C.slate} fontSize="10">
                        {point.label}
                      </text>
                    </g>
                  );
                })}
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card label="Total Added" value={totalAdded.toLocaleString()} color={C.emerald} />
            <Card label="Total Deleted" value={totalDeleted.toLocaleString()} color={C.rose} />
            <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Lines Added vs Deleted</h3>
            <div className="space-y-2">
              {codeTopRows.map((row) => {
                const isRowExpanded = expandedCodeRows.has(row.key);
                const hasMultipleDates = row.kind === 'range' && row.dates.length > 1;
                const isDateExpandable = row.kind === 'date' && row.dates[0].entries.length > 1;
                const isExpandable = hasMultipleDates || isDateExpandable;

                const toggleRow = () => {
                  if (!isExpandable) return;
                  setExpandedCodeRows((prev) => {
                    const next = new Set(prev);
                    if (next.has(row.key)) next.delete(row.key);
                    else next.add(row.key);
                    return next;
                  });
                };

                return (
                  <div key={row.key} className="rounded-md" style={{ border: `1px solid ${C.border}` }}>
                    <div
                      onClick={toggleRow}
                      onMouseEnter={(event) => {
                        setHoveredCodeSession(row.key);
                        setTooltip({
                          x: event.clientX,
                          y: event.clientY,
                          content: (
                            <>
                              <div style={{ color: C.slate, fontSize: 12, fontWeight: 600 }}>{row.label}</div>
                              <div style={{ color: C.cyan, fontSize: 11 }}>Added: {row.added.toLocaleString()}</div>
                              <div style={{ color: C.rose, fontSize: 11 }}>Deleted: {row.deleted.toLocaleString()}</div>
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
                        backgroundColor: hoveredCodeSession === row.key ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
                        borderRadius: 6,
                        padding: 8,
                        cursor: isExpandable ? 'pointer' : 'default',
                      }}
                    >
                      <div className="mb-1 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                        <span
                          style={{
                            width: 12,
                            display: 'inline-block',
                            color: C.muted,
                            transform: isExpandable && isRowExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 150ms ease',
                          }}
                        >
                          {isExpandable ? 'ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¶' : ''}
                        </span>
                        <span>{row.label}</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-3 rounded" style={{ width: `${(row.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                        <div className="h-3 rounded" style={{ width: `${(row.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                      </div>
                    </div>

                    <div style={{ maxHeight: isRowExpanded ? 500 : 0, overflow: 'hidden', transition: 'max-height 150ms ease' }}>
                      {row.kind === 'range' && row.dates.map((dateGroup) => {
                        const isDateExpanded = expandedCodeRows.has(dateGroup.date);
                        const isNestedExpandable = dateGroup.entries.length > 1;
                        return (
                          <div key={dateGroup.date} style={{ paddingLeft: 20, paddingBottom: 4 }}>
                            <div
                              onClick={() => {
                                if (!isNestedExpandable) return;
                                setExpandedCodeRows((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(dateGroup.date)) next.delete(dateGroup.date);
                                  else next.add(dateGroup.date);
                                  return next;
                                });
                              }}
                              className="pt-1"
                              style={{ cursor: isNestedExpandable ? 'pointer' : 'default' }}
                            >
                              <div className="mb-1 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                                <span
                                  style={{
                                    width: 12,
                                    display: 'inline-block',
                                    transform: isNestedExpandable && isDateExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 150ms ease',
                                  }}
                                >
                                  {isNestedExpandable ? 'ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¶' : ''}
                                </span>
                                <span>{dateGroup.date}</span>
                              </div>
                              <div className="flex gap-2">
                                <div className="h-2.5 rounded" style={{ width: `${(dateGroup.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                                <div className="h-2.5 rounded" style={{ width: `${(dateGroup.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                              </div>
                            </div>

                            <div style={{ maxHeight: isDateExpanded ? 400 : 0, overflow: 'hidden', transition: 'max-height 150ms ease' }}>
                              {dateGroup.entries.map((entry) => (
                                <div
                                  key={entry.session}
                                  style={{ paddingLeft: 20, paddingTop: 4 }}
                                  onMouseEnter={(event) => {
                                    setHoveredCodeSession(entry.session);
                                    const focusText = sessionFocusMap[entry.session] ?? 'No focus recorded';
                                    setTooltip({
                                      x: event.clientX,
                                      y: event.clientY,
                                      content: (
                                        <>
                                          <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.session}</div>
                                          <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic' }}>{focusText}</div>
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
                                >
                                  <div className="mb-1 text-[11px]" style={{ color: C.white }}>{entry.session}</div>
                                  <div className="flex gap-2">
                                    <div className="h-2 rounded" style={{ width: `${(entry.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                                    <div className="h-2 rounded" style={{ width: `${(entry.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {row.kind === 'date' && row.dates[0].entries.length > 1 && (
                        <div style={{ paddingLeft: 20, paddingBottom: 6 }}>
                          {row.dates[0].entries.map((entry) => (
                            <div
                              key={entry.session}
                              style={{ paddingTop: 4 }}
                              onMouseEnter={(event) => {
                                setHoveredCodeSession(entry.session);
                                const focusText = sessionFocusMap[entry.session] ?? 'No focus recorded';
                                setTooltip({
                                  x: event.clientX,
                                  y: event.clientY,
                                  content: (
                                    <>
                                      <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.session}</div>
                                      <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic' }}>{focusText}</div>
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
                            >
                              <div className="mb-1 text-[11px]" style={{ color: C.white }}>{entry.session}</div>
                              <div className="flex gap-2">
                                <div className="h-2 rounded" style={{ width: `${(entry.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                                <div className="h-2 rounded" style={{ width: `${(entry.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'bugs' && (
        <div className="space-y-4">
          <div
            className="rounded-xl border"
            style={{ backgroundColor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 600 }}
          >
            <span style={{ color: C.white }}>{selected.bugs.length} total</span>
            <span style={{ color: C.border, margin: '0 10px' }}>|</span>
            <span style={{ color: C.emerald }}>{fixedBugs} fixed</span>
            <span style={{ color: C.border, margin: '0 10px' }}>|</span>
            <span style={{ color: C.amber }}>{openBugs} open/deferred</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <DonutBreakdown animate={animateBugDonuts} label="Severity"
              items={[
                { label: 'Critical', count: bySeverity.Critical ?? 0, color: '#ef4444' },
                { label: 'High', count: bySeverity.High ?? 0, color: '#f97316' },
                { label: 'Medium', count: bySeverity.Medium ?? 0, color: '#fbbf24' },
                { label: 'Low', count: bySeverity.Low ?? 0, color: '#64748b' },
              ]}
            />
            <DonutBreakdown animate={animateBugDonuts} label="Category"
              items={[
                { label: 'Technical', count: byCategory.Technical ?? 0, color: '#22d3ee' },
                { label: 'Functional', count: byCategory.Functional ?? 0, color: '#34d399' },
                { label: 'UX', count: byCategory.UX ?? 0, color: '#fbbf24' },
              ]}
            />
            <DonutBreakdown animate={animateBugDonuts} label="Source"
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
                  {['#', 'Session', 'Summary', 'Severity', 'Category', 'Source', 'Status'].map((header) => (
                    <th key={header} className="px-3 py-2 text-left font-semibold" style={{ color: C.slate }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.bugs.map((bug) => (
                  <tr key={bug.id} className="border-t" style={{ borderColor: C.border }}>
                    <td className="px-3 py-2">{bug.id}</td>
                    <td className="px-3 py-2" style={{ color: C.cyan }}>{bug.session}</td>
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
              <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Session activity chart">
                {Array.from({ length: sessionActivityPoints.yTicks + 1 }, (_, index) => {
                  const value = index * sessionActivityPoints.step;
                  const y = sessionActivityPoints.dims.top + sessionActivityPoints.innerHeight - (index / sessionActivityPoints.yTicks) * sessionActivityPoints.innerHeight;
                  return (
                    <g key={`session-activity-grid-${value}`}>
                      <line
                        x1={sessionActivityPoints.dims.left}
                        y1={y}
                        x2={sessionActivityPoints.dims.width - sessionActivityPoints.dims.right}
                        y2={y}
                        stroke={C.border}
                        strokeDasharray="4 4"
                        strokeOpacity="0.3"
                      />
                      <text x={sessionActivityPoints.dims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">
                        {value}
                      </text>
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
                            x: event.clientX,
                            y: event.clientY,
                            content: (
                              <>
                                <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.session}</div>
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
                        onMouseLeave={() => {
                          setHoveredPointIndex(null);
                          setTooltip(null);
                        }}
                      />
                    ))}
                    <line
                      x1={point.x}
                      y1={sessionActivityPoints.dims.height - sessionActivityPoints.dims.bottom}
                      x2={point.x}
                      y2={(index % 2 === 0 ? sessionActivityPoints.dims.height - 10 : sessionActivityPoints.dims.height - 22) - 11}
                      stroke={C.slate}
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />
                    <text
                      x={point.x}
                      y={index % 2 === 0 ? sessionActivityPoints.dims.height - 10 : sessionActivityPoints.dims.height - 22}
                      textAnchor="middle"
                      fill={C.slate}
                      fontSize="10"
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
              const firstSession = monthGroup.sessions[0]?.session ?? '';
              const lastSession = monthGroup.sessions[monthGroup.sessions.length - 1]?.session ?? '';
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
                      <span style={{ fontSize: 12, color: C.muted }}>Sessions {firstSession}-{lastSession}</span>
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
                        <h4 className="text-base font-semibold">{entry.session} - {entry.displayDate}</h4>
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
                          ÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂ³ View chapter: {chapterMap[entry.chapterId] ?? entry.chapterId}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
