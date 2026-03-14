import { useMemo, useState, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import { formatShortDate, buildSmoothPath } from './chartUtils';
import type { SessionEntry, SessionTool, SessionDriver } from '../data/metaMetrics';
import type { DayEntry, WorkDriver, WorkOperator } from '../types/index';

interface SessionsTabProps {
  sessions: SessionEntry[];
  days: DayEntry[];
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
  sessions, days, totalPRs, totalHours, projectId,
  sessionFocusMap, sessionDateMap, chapterMap,
  onJumpToChapter, hoveredPointIndex, setHoveredPointIndex, setTooltip,
}: SessionsTabProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [chartView, setChartView] = useState<'daily' | 'weekly'>('weekly');
  const [humanAttribution, setHumanAttribution] = useState(30);
  const [prevProjectId, setPrevProjectId] = useState(projectId);

  const toolColors: Record<SessionTool, string> = {
    'Claude Code': C.emerald,
    'Codex': C.amber,
    'Cowork': C.slate,
    'Mixed': C.violet,
  };
  const chartDims = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
  const chartInnerWidth = chartDims.width - chartDims.left - chartDims.right;
  const chartInnerHeight = chartDims.height - chartDims.top - chartDims.bottom;

  // Build a lookup of decisions-per-day from the authoritative DayEntry data
  const dayDecisionMap = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const map = new Map<string, number>();
    days.forEach((d) => {
      const [month = 'Jan', day = '1'] = d.date.split(' ');
      const dt = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const key = dt.toISOString().slice(0, 10);
      map.set(key, (map.get(key) ?? 0) + d.metrics.totalDecisions);
    });
    return map;
  }, [days]);

  const dailyData = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const dayBuckets = new Map<string, { dayLabel: string; prs: number; decisions: number; sessionCount: number }>();
    sessions.forEach((entry) => {
      const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
      const [month = 'Jan', day = '1'] = date.split(' ');
      const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const key = d.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = dayBuckets.get(key) ?? { dayLabel, prs: 0, decisions: 0, sessionCount: 0 };
      existing.prs += entry.prs;
      existing.sessionCount += 1;
      dayBuckets.set(key, existing);
    });
    // Use DayEntry decisions as the authoritative source for daily view
    for (const [key, bucket] of dayBuckets) {
      bucket.decisions = dayDecisionMap.get(key) ?? 0;
    }
    return Array.from(dayBuckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [sessions, sessionDateMap, dayDecisionMap]);

  const sessionActivityPoints = useMemo(() => {
    const yTicks = 4;

    const dataSource = chartView === 'weekly'
      ? dailyData.map((d) => ({
          session: d.dayLabel,
          label: d.sessionCount + ' session' + (d.sessionCount > 1 ? 's' : ''),
          date: d.dayLabel,
          prs: d.prs,
          decisions: d.decisions,
          deadEnds: 0,
        }))
      : sessions.map((entry) => ({
          ...entry,
          date: sessionDateMap[entry.session] ?? entry.session,
        }));

    const maxMetric = Math.max(...dataSource.map((item) => Math.max(item.prs, item.decisions)), 1);
    const raw = maxMetric / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const points = dataSource.map((entry, index) => {
      const ratioX = dataSource.length > 1 ? index / (dataSource.length - 1) : 0;
      const x = chartDims.left + ratioX * chartInnerWidth;
      return {
        ...entry,
        dateLabel: chartView === 'weekly' ? entry.date : formatShortDate(entry.date),
        x,
        yPrs: chartDims.top + (1 - (entry.prs / yMax)) * chartInnerHeight,
        yDecisions: chartDims.top + (1 - (entry.decisions / yMax)) * chartInnerHeight,
      };
    });

    return { dims: chartDims, innerHeight: chartInnerHeight, yTicks, step, yMax, points };
  }, [sessions, sessionDateMap, chartView, dailyData]);


  const avgTaskTimePoints = useMemo(() => {
    const validSessions = sessions.filter(s => s.taskCount > 0);
    if (!validSessions.length) return null;

    type AvgPoint = { session: string; date: string; dateLabel: string; label: string; avgMin: number; tool: string; taskCount: number; duration: number; x: number; y: number };

    let dataPoints: AvgPoint[];
    if (chartView === 'weekly') {
      // Aggregate by day
      const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const dayBuckets = new Map<string, { dayLabel: string; totalMinutes: number; totalTasks: number; tool: string }>();
      validSessions.forEach((entry) => {
        const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
        const [month = 'Jan', day = '1'] = date.split(' ');
        const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
        const key = d.toISOString().slice(0, 10);
        const existing = dayBuckets.get(key) ?? { dayLabel: date, totalMinutes: 0, totalTasks: 0, tool: entry.tool };
        existing.totalMinutes += entry.duration * 60;
        existing.totalTasks += entry.taskCount;
        dayBuckets.set(key, existing);
      });
      const sorted = Array.from(dayBuckets.entries()).sort(([a], [b]) => a.localeCompare(b));
      dataPoints = sorted.map(([, bucket], index) => {
        const avgMin = bucket.totalTasks > 0 ? bucket.totalMinutes / bucket.totalTasks : 0;
        const ratioX = sorted.length > 1 ? index / (sorted.length - 1) : 0;
        const x = chartDims.left + ratioX * chartInnerWidth;
        return {
          session: bucket.dayLabel, date: bucket.dayLabel, dateLabel: formatShortDate(bucket.dayLabel),
          label: `${bucket.totalTasks} tasks`, avgMin: Math.round(avgMin), tool: bucket.tool,
          taskCount: bucket.totalTasks, duration: Math.round(bucket.totalMinutes / 60),
          x, y: 0,
        };
      });
    } else {
      dataPoints = validSessions.map((entry, index) => {
        const avgMin = (entry.duration * 60) / entry.taskCount;
        const ratioX = validSessions.length > 1 ? index / (validSessions.length - 1) : 0;
        const x = chartDims.left + ratioX * chartInnerWidth;
        const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
        return {
          ...entry, date, dateLabel: formatShortDate(date),
          avgMin: Math.round(avgMin), tool: entry.tool, x, y: 0,
        };
      });
    }

    const yTicks = 4;
    const maxTime = Math.max(...dataPoints.map(p => p.avgMin), 1);
    const raw = maxTime / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const points = dataPoints.map(p => ({
      ...p,
      y: chartDims.top + (1 - (p.avgMin / yMax)) * chartInnerHeight,
    }));

    // Smart tick interval: show at most ~15 labels to avoid overlap
    const maxTicks = 15;
    const tickInterval = points.length > maxTicks ? Math.ceil(points.length / maxTicks) : 1;

    return { dims: chartDims, innerHeight: chartInnerHeight, yTicks, step, yMax, points, tickInterval };
  }, [sessions, sessionDateMap, chartView]);

  const avgTaskTimePaths = useMemo(() => {
    if (!avgTaskTimePoints) return {};
    const byTool: Record<string, Array<{ x: number; y: number }>> = {};
    avgTaskTimePoints.points.forEach(p => {
      const tool = p.tool as string;
      if (!byTool[tool]) byTool[tool] = [];
      byTool[tool].push({ x: p.x, y: p.y });
    });
    const paths: Record<string, string> = {};
    for (const [tool, pts] of Object.entries(byTool)) {
      paths[tool] = buildSmoothPath(pts);
    }
    return paths;
  }, [avgTaskTimePoints]);

  const driverColors: Record<SessionDriver, string> = {
    'human-only': C.cyan,
    'agent-led': C.emerald,
    collaborative: C.violet,
    human: C.cyan,
  };
  const driverLabels: Record<SessionDriver, string> = {
    'human-only': 'Human Only',
    'agent-led': 'Agent-Led',
    collaborative: 'Collaborative',
    human: humanAttribution > 0 ? 'Human (est.)' : 'Human',
  };

  const driverChartData = useMemo(() => {
    const drivers: SessionDriver[] = ['human-only', 'agent-led', 'collaborative', 'human'];
    const rawTotals: Record<SessionDriver, number> = { 'human-only': 0, 'agent-led': 0, collaborative: 0, human: 0 };

    // Group sessions by date to create bars
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const dayGroups = new Map<string, { dayLabel: string; counts: Record<SessionDriver, number> }>();

    sessions.forEach((entry) => {
      const driver = entry.driver;
      if (!driver) return;
      rawTotals[driver] = (rawTotals[driver] ?? 0) + 1;
      const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
      const [month = 'Jan', day = '1'] = date.split(' ');
      const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const key = d.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = dayGroups.get(key) ?? { dayLabel, counts: { 'human-only': 0, 'agent-led': 0, collaborative: 0, human: 0 } };
      existing.counts[driver] = (existing.counts[driver] ?? 0) + 1;
      dayGroups.set(key, existing);
    });

    // Apply human time attribution: shift a % of collaborative to human (est.)
    const attrFrac = humanAttribution / 100;
    const driverTotals = { ...rawTotals };
    driverTotals.human = (driverTotals.human ?? 0) + rawTotals.collaborative * attrFrac;
    driverTotals.collaborative = rawTotals.collaborative * (1 - attrFrac);

    const bars = Array.from(dayGroups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => {
        const adjusted = { ...v, counts: { ...v.counts } };
        const collabRaw = adjusted.counts.collaborative;
        adjusted.counts.human = (adjusted.counts.human ?? 0) + collabRaw * attrFrac;
        adjusted.counts.collaborative = collabRaw * (1 - attrFrac);
        return adjusted;
      });

    const maxStack = bars.length > 0 ? Math.max(...bars.map(b => drivers.reduce((s, d) => s + b.counts[d], 0))) : 0;
    const yTicks = 4;
    const raw = (maxStack / yTicks) || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    return { drivers, driverTotals, bars, yTicks, step, yMax };
  }, [sessions, sessionDateMap, humanAttribution]);

  const sessionLines = useMemo(() => {
    const pathBuilder = chartView === 'weekly'
      ? (pts) => pts.length ? 'M ' + pts.map(p => p.x + ' ' + p.y).join(' L ') : ''
      : buildSmoothPath;
    return {
      prs: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yPrs }))),
      decisions: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yDecisions }))),
    };
  }, [sessionActivityPoints.points, chartView]);

  const sortedDays = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    return [...days].sort((a, b) => {
      const [aMonth = 'Jan', aDay = '1'] = a.date.split(' ');
      const [bMonth = 'Jan', bDay = '1'] = b.date.split(' ');
      const aDate = new Date(2026, monthMap[aMonth] ?? 0, parseInt(aDay, 10));
      const bDate = new Date(2026, monthMap[bMonth] ?? 0, parseInt(bDay, 10));
      return bDate.getTime() - aDate.getTime(); // newest first
    });
  }, [days]);

  if (prevProjectId !== projectId) {
    setPrevProjectId(projectId);
    setExpandedDays(new Set());
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total PRs" value={totalPRs} color={C.emerald} />
        <Card label="Total Decisions" value={days.reduce((sum, d) => sum + d.metrics.totalDecisions, 0)} color={C.cyan} />
        <Card label="Total Dead Ends" value={sessions.reduce((sum, item) => sum + item.deadEnds, 0)} color={C.rose} />
        <Card label="Total Hours" value={`${totalHours}h`} color={C.amber} />
      </div>

      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Session Activity</h3>
          <div className="flex rounded-md border overflow-hidden" style={{ borderColor: C.border }}>
            <button
              onClick={() => setChartView('weekly')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{ backgroundColor: chartView === 'weekly' ? 'color-mix(in srgb, var(--theme-cyan) 13%, transparent)' : 'transparent', color: chartView === 'weekly' ? C.cyan : C.slate, borderRight: `1px solid ${C.border}` }}
            >By Day</button>
            <button
              onClick={() => setChartView('daily')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{ backgroundColor: chartView === 'daily' ? 'color-mix(in srgb, var(--theme-cyan) 13%, transparent)' : 'transparent', color: chartView === 'daily' ? C.cyan : C.slate }}
            >By Session</button>
          </div>
        </div>
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

            {sessionActivityPoints.points.map((point, index) => (
              <g key={`${point.session}-session-activity`}>
                {[
                  { label: 'PRs', value: point.prs, y: point.yPrs, color: C.cyan },
                  { label: 'Decisions', value: point.decisions, y: point.yDecisions, color: C.emerald },
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
                            <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{chartView === 'weekly' ? `${point.date} (${point.label})` : `${point.date} — ${point.label}`}</div>
                            <div style={{ color: C.slate, fontSize: 11 }}>{point.dateLabel}</div>
                            <div style={{ color: C.cyan, fontSize: 11 }}>PRs: {point.prs}</div>
                            <div style={{ color: C.emerald, fontSize: 11 }}>Decisions: {point.decisions}</div>
                            {chartView === 'daily' && <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic', maxWidth: 220 }}>{sessionFocusMap[point.session] ?? ''}</div>}
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
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.slate }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>


      {avgTaskTimePoints && (
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="text-sm font-semibold">Avg Task Time</h3>
        <div className="text-xs mb-3" style={{ color: C.muted }}>Minutes per task {chartView === 'weekly' ? 'by day' : 'by session'}</div>
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
          <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Average task time chart">
            {Array.from({ length: avgTaskTimePoints.yTicks + 1 }, (_, index) => {
              const value = index * avgTaskTimePoints.step;
              const y = avgTaskTimePoints.dims.top + avgTaskTimePoints.innerHeight - (index / avgTaskTimePoints.yTicks) * avgTaskTimePoints.innerHeight;
              return (
                <g key={`avg-task-grid-${value}`}>
                  <line x1={avgTaskTimePoints.dims.left} y1={y} x2={avgTaskTimePoints.dims.width - avgTaskTimePoints.dims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                  <text x={avgTaskTimePoints.dims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}m</text>
                </g>
              );
            })}

            {Object.entries(avgTaskTimePaths).map(([tool, d]) => (
              <path key={tool} d={d} fill="none" stroke={toolColors[tool as SessionTool] ?? C.violet} strokeWidth="2" strokeOpacity="0.6" />
            ))}

            {avgTaskTimePoints.points.map((point, index) => (
              <circle
                key={`avg-${point.session}-${index}`}
                cx={point.x}
                cy={point.y}
                r={hoveredPointIndex === index + 10000 ? 6 : 4}
                fill={toolColors[point.tool as SessionTool]}
                onMouseEnter={(event) => {
                  setHoveredPointIndex(index + 10000);
                  setTooltip({
                    x: event.clientX, y: event.clientY,
                    content: (
                      <>
                        <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.date} — {point.label}</div>
                        <div style={{ color: C.violet, fontSize: 11 }}>{point.avgMin} min/task</div>
                        <div style={{ color: C.slate, fontSize: 11 }}>{point.taskCount} tasks in {point.duration}h</div>
                        <div style={{ color: toolColors[point.tool as SessionTool], fontSize: 11 }}>{point.tool}</div>
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

            {avgTaskTimePoints.points.map((point, index) => {
              if (avgTaskTimePoints.tickInterval > 1 && index % avgTaskTimePoints.tickInterval !== 0 && index !== avgTaskTimePoints.points.length - 1) return null;
              const tickIndex = avgTaskTimePoints.tickInterval > 1
                ? Math.floor(index / avgTaskTimePoints.tickInterval)
                : index;
              return (
                <text
                  key={`avg-label-${index}`}
                  x={point.x}
                  y={tickIndex % 2 === 0 ? avgTaskTimePoints.dims.height - 10 : avgTaskTimePoints.dims.height - 22}
                  textAnchor="middle" fill={C.slate} fontSize="10"
                >
                  {point.dateLabel}
                </text>
              );
            })}
          </svg>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {Object.entries(toolColors).filter(([tool]) => avgTaskTimePoints.points.some(p => p.tool === tool)).map(([tool, color]) => (
              <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.slate }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Driver Breakdown */}
      {driverChartData.bars.length > 0 && (
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold" style={{ color: C.white }}>Driver Breakdown</h3>
          <div className="flex items-center gap-2">
            <label className="text-[10px]" style={{ color: C.muted }}>Human attribution</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={humanAttribution}
              onChange={(e) => setHumanAttribution(Number(e.target.value))}
              style={{ width: 80, accentColor: C.cyan }}
            />
            <span className="text-xs font-medium" style={{ color: C.cyan, minWidth: 30 }}>{humanAttribution}%</span>
          </div>
        </div>
        <div className="text-xs mb-2" style={{ color: C.muted }}>Who drove the work in each session{humanAttribution > 0 ? ` · ${humanAttribution}% of collaborative time attributed to human` : ''}</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {driverChartData.drivers.filter(d => driverChartData.driverTotals[d] > 0).map(d => (
            <span
              key={d}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `color-mix(in srgb, ${driverColors[d]} 13%, transparent)`,
                color: driverColors[d],
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: driverColors[d], display: 'inline-block' }} />
              {driverLabels[d]} {Math.round(driverChartData.driverTotals[d] * 10) / 10}
            </span>
          ))}
        </div>
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
          <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Driver breakdown chart">
            {Array.from({ length: driverChartData.yTicks + 1 }, (_, index) => {
              const value = index * driverChartData.step;
              const y = chartDims.top + chartInnerHeight - (index / driverChartData.yTicks) * chartInnerHeight;
              return (
                <g key={`driver-grid-${value}`}>
                  <line x1={chartDims.left} y1={y} x2={chartDims.width - chartDims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                  <text x={chartDims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}</text>
                </g>
              );
            })}

            {driverChartData.bars.map((bar, barIndex) => {
              const barWidth = driverChartData.bars.length > 1
                ? (chartInnerWidth / driverChartData.bars.length) * 0.7
                : 40;
              const barGap = driverChartData.bars.length > 1
                ? chartInnerWidth / driverChartData.bars.length
                : 40;
              const barX = chartDims.left + barIndex * barGap + (barGap - barWidth) / 2;
              const baseline = chartDims.top + chartInnerHeight;
              let stackY = baseline;

              return (
                <g key={`driver-bar-${barIndex}`}>
                  {driverChartData.drivers.map(d => {
                    const count = bar.counts[d];
                    if (count === 0) return null;
                    const h = (count / driverChartData.yMax) * chartInnerHeight;
                    stackY -= h;
                    return (
                      <rect
                        key={d}
                        x={barX}
                        y={stackY}
                        width={barWidth}
                        height={h}
                        rx={2}
                        fill={driverColors[d]}
                        opacity={0.8}
                        onMouseEnter={(event) => {
                          setTooltip({
                            x: event.clientX, y: event.clientY,
                            content: (
                              <>
                                <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{bar.dayLabel}</div>
                                {driverChartData.drivers.filter(dd => bar.counts[dd] > 0).map(dd => (
                                  <div key={dd} style={{ color: driverColors[dd], fontSize: 11 }}>
                                    {driverLabels[dd]}: {Math.round(bar.counts[dd] * 10) / 10}
                                  </div>
                                ))}
                              </>
                            ),
                          });
                        }}
                        onMouseMove={(event) => {
                          setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                  <text
                    x={barX + barWidth / 2}
                    y={barIndex % 2 === 0 ? chartDims.height - 10 : chartDims.height - 22}
                    textAnchor="middle" fill={C.slate} fontSize="10"
                  >
                    {bar.dayLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      )}

      {/* Day / Work Block list */}
      <div className="space-y-2">
        {sortedDays.map((day) => {
          const isExpanded = expandedDays.has(day.date);
          const totalMinutes = day.metrics.totalTimeMinutes;
          const hours = Math.floor(totalMinutes / 60);
          const mins = totalMinutes % 60;
          const timeStr = hours > 0 ? `${hours}h ${mins > 0 ? mins + 'm' : ''}` : `${mins}m`;

          const phaseColors: Record<string, string> = { Research: '#60a5fa', Spec: C.violet, Build: C.amber, Review: '#fb923c', Shipped: C.emerald };
          const operatorLabels: Record<WorkOperator, string> = { 'claude-code': 'Claude Code', 'claude-ai': 'Claude AI', cursor: 'Cursor', manual: 'Manual', mixed: 'Mixed' };
          const driverBadgeColors: Record<WorkDriver, string> = { human: C.cyan, 'human-only': C.cyan, ai: C.emerald, 'agent-led': C.emerald, collaborative: C.violet };
          const driverBadgeLabels: Record<WorkDriver, string> = { human: 'Human', 'human-only': 'Human Only', ai: 'Agent-Led', 'agent-led': 'Agent-Led', collaborative: 'Collaborative' };

          // Dominant driver for badge
          const { human: dHuman, ai: dAi, collaborative: dCollab } = day.driverSummary;
          const dominantDriver: WorkDriver = dCollab > 0 && dCollab >= dHuman && dCollab >= dAi ? 'collaborative'
            : dAi >= dHuman ? 'agent-led' : 'human';

          return (
            <div key={day.date}>
              {/* Day row — collapsed header */}
              <button
                onClick={() => {
                  setExpandedDays((prev) => {
                    const next = new Set(prev);
                    if (next.has(day.date)) next.delete(day.date);
                    else next.add(day.date);
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between rounded-lg border px-4 py-3"
                style={{ backgroundColor: C.cardBg, borderColor: isExpanded ? C.cyan : C.border, transition: 'border-color 200ms ease' }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{day.date}</span>
                  {day.title && <span style={{ fontSize: 13, color: C.slate }}>{day.title}</span>}
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `color-mix(in srgb, ${phaseColors[day.phase] ?? C.slate} 13%, transparent)`, color: phaseColors[day.phase] ?? C.slate }}>{day.phase}</span>
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `color-mix(in srgb, ${driverBadgeColors[dominantDriver]} 13%, transparent)`, color: driverBadgeColors[dominantDriver] }}>{driverBadgeLabels[dominantDriver]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: 12, color: C.muted }}>{day.blocks.length} block{day.blocks.length > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 12, color: C.slate }}>{timeStr}</span>
                  {day.metrics.linesAdded > 0 && <span style={{ fontSize: 11, color: C.emerald }}>+{day.metrics.linesAdded.toLocaleString()}</span>}
                  {day.metrics.linesDeleted > 0 && <span style={{ fontSize: 11, color: C.rose }}>-{day.metrics.linesDeleted.toLocaleString()}</span>}
                  {day.metrics.totalDecisions > 0 && <span style={{ fontSize: 11, color: C.cyan }}>{day.metrics.totalDecisions}d</span>}
                  <span style={{ color: C.muted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms ease', fontSize: 12 }}>&#9654;</span>
                </div>
              </button>

              {/* Expanded: Work Blocks */}
              <div style={{ maxHeight: isExpanded ? 2000 : 0, overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                <div className="ml-4 mt-1 space-y-1.5 border-l-2 pl-4 pb-2" style={{ borderColor: `color-mix(in srgb, ${C.cyan} 25%, transparent)` }}>
                  {day.blocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-lg border p-3"
                      style={{
                        backgroundColor: C.cardBg,
                        borderColor: C.border,
                        opacity: block.contextWindowOrigin ? 0.6 : 1,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ fontSize: 13, fontWeight: 500, color: C.white }}>{block.label}</span>
                          {block.contextWindowOrigin && (
                            <span className="rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: `color-mix(in srgb, ${C.muted} 15%, transparent)`, color: C.muted }}>context split</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `color-mix(in srgb, ${C.amber} 13%, transparent)`, color: C.amber }}>{block.workCategory}</span>
                          <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `color-mix(in srgb, ${driverBadgeColors[block.driver]} 13%, transparent)`, color: driverBadgeColors[block.driver] }}>{driverBadgeLabels[block.driver]}</span>
                          <span style={{ fontSize: 11, color: C.muted }}>{operatorLabels[block.operator] ?? block.operator}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: C.slate }}>
                        {block.timeMinutes > 0 && <span>{Math.floor(block.timeMinutes / 60)}h {block.timeMinutes % 60 > 0 ? (block.timeMinutes % 60) + 'm' : ''}</span>}
                        {block.linesAdded > 0 && <span style={{ color: C.emerald }}>+{block.linesAdded.toLocaleString()}</span>}
                        {block.linesDeleted > 0 && <span style={{ color: C.rose }}>-{block.linesDeleted.toLocaleString()}</span>}
                      </div>
                      {block.note && <p className="mt-1 text-xs" style={{ color: C.muted }}>{block.note}</p>}
                    </div>
                  ))}
                  {/* Chapter link at day level */}
                  {day.chapterId && (
                    <button
                      onClick={() => onJumpToChapter?.(day.chapterId!)}
                      className="mt-1 rounded-md border px-2.5 py-1 text-xs"
                      style={{ color: C.cyan, backgroundColor: 'var(--theme-accent-10)', borderColor: 'var(--theme-accent-33)' }}
                    >
                      {'\uD83C\uDF33'} View chapter: {chapterMap[day.chapterId] ?? day.chapterId}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
