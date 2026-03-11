import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import { formatShortDate, formatSessionDate, buildSmoothPath } from './chartUtils';
import type { SessionEntry, SessionTool, SessionDriver, PRDetail } from '../data/metaMetrics';

interface SessionsTabProps {
  sessions: SessionEntry[];
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
  sessions, totalPRs, totalHours, projectId,
  sessionFocusMap, sessionDateMap, chapterMap,
  onJumpToChapter, hoveredPointIndex, setHoveredPointIndex, setTooltip,
}: SessionsTabProps) {
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [chartView, setChartView] = useState<'daily' | 'weekly'>('weekly');


  const toolColors: Record<SessionTool, string> = {
    'Claude Code': C.emerald,
    'Codex': C.amber,
    'Cowork': C.slate,
    'Mixed': C.violet,
  };
  const chartDims = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
  const chartInnerWidth = chartDims.width - chartDims.left - chartDims.right;
  const chartInnerHeight = chartDims.height - chartDims.top - chartDims.bottom;

  const dailyData = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const days = new Map<string, { dayLabel: string; prs: number; decisions: number; sessionCount: number }>();
    sessions.forEach((entry) => {
      const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
      const [month = 'Jan', day = '1'] = date.split(' ');
      const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const key = d.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = days.get(key) ?? { dayLabel, prs: 0, decisions: 0, sessionCount: 0 };
      existing.prs += entry.prs;
      existing.decisions += entry.decisions;
      existing.sessionCount += 1;
      days.set(key, existing);
    });
    return Array.from(days.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [sessions, sessionDateMap]);

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
    const yTicks = 4;
    const avgTimes = validSessions.map(s => (s.duration * 60) / s.taskCount);
    const maxTime = Math.max(...avgTimes, 1);
    const raw = maxTime / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const points = validSessions.map((entry, index) => {
      const avgMin = (entry.duration * 60) / entry.taskCount;
      const ratioX = validSessions.length > 1 ? index / (validSessions.length - 1) : 0;
      const x = chartDims.left + ratioX * chartInnerWidth;
      const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
      return {
        ...entry,
        date,
        dateLabel: formatShortDate(date),
        avgMin: Math.round(avgMin),
        tool: entry.tool,
        x,
        y: chartDims.top + (1 - (avgMin / yMax)) * chartInnerHeight,
      };
    });

    return { dims: chartDims, innerHeight: chartInnerHeight, yTicks, step, yMax, points };
  }, [sessions, sessionDateMap]);

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
  const repoUrls: Record<string, string> = {
    meta: 'https://github.com/Jynax/meta-tracker',
    bip: 'https://github.com/Jynax/buriedinprint-reading-app',
    remnants: 'https://github.com/Jynax/remnants-game',
    'item-b-gone': 'https://github.com/Jynax/item-b-gone-dashboard',
    'vuln-bank': 'https://github.com/hrpatel/vuln-bank',
  };

  const driverLabels: Record<SessionDriver, string> = {
    'human-only': 'Human Only',
    'agent-led': 'Agent-Led',
    collaborative: 'Collaborative',
    human: 'Human',
  };

  const driverChartData = useMemo(() => {
    const drivers: SessionDriver[] = ['human-only', 'agent-led', 'collaborative', 'human'];
    const driverTotals: Record<SessionDriver, number> = { 'human-only': 0, 'agent-led': 0, collaborative: 0, human: 0 };

    // Group sessions by date to create bars
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const dayGroups = new Map<string, { dayLabel: string; counts: Record<SessionDriver, number> }>();

    sessions.forEach((entry) => {
      const driver = entry.driver;
      if (!driver) return;
      driverTotals[driver] = (driverTotals[driver] ?? 0) + 1;
      const date = sessionDateMap[entry.session] ?? entry.date ?? entry.session;
      const [month = 'Jan', day = '1'] = date.split(' ');
      const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const key = d.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = dayGroups.get(key) ?? { dayLabel, counts: { human: 0, ai: 0, collaborative: 0 } };
      existing.counts[driver] = (existing.counts[driver] ?? 0) + 1;
      dayGroups.set(key, existing);
    });

    const bars = Array.from(dayGroups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    const maxStack = bars.length > 0 ? Math.max(...bars.map(b => drivers.reduce((s, d) => s + b.counts[d], 0))) : 0;
    const yTicks = 4;
    const raw = (maxStack / yTicks) || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    return { drivers, driverTotals, bars, yTicks, step, yMax };
  }, [sessions, sessionDateMap]);

  const sessionLines = useMemo(() => {
    const pathBuilder = chartView === 'weekly'
      ? (pts) => pts.length ? 'M ' + pts.map(p => p.x + ' ' + p.y).join(' L ') : ''
      : buildSmoothPath;
    return {
      prs: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yPrs }))),
      decisions: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yDecisions }))),
    };
  }, [sessionActivityPoints.points, chartView]);

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
        <div className="text-xs mb-3" style={{ color: C.muted }}>Minutes per task by session</div>
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

            {avgTaskTimePoints.points.map((point, index) => (
              <text
                key={`avg-label-${index}`}
                x={point.x}
                y={index % 2 === 0 ? avgTaskTimePoints.dims.height - 10 : avgTaskTimePoints.dims.height - 22}
                textAnchor="middle" fill={C.slate} fontSize="10"
              >
                {point.dateLabel}
              </text>
            ))}
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
        <h3 className="text-sm font-semibold" style={{ color: C.white }}>Driver Breakdown</h3>
        <div className="text-xs mb-2" style={{ color: C.muted }}>Who drove the work in each session</div>
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
              {driverLabels[d]} {driverChartData.driverTotals[d]}
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
                                    {dd.charAt(0).toUpperCase() + dd.slice(1)}: {bar.counts[dd]}
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
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-semibold">{entry.displayDate} — {entry.label}</h4>
                      <div className="flex items-center gap-1.5">
                        {entry.phase && (() => {
                          const phaseColors: Record<string, string> = { Research: '#60a5fa', Spec: C.violet, Build: C.amber, Review: '#fb923c', Shipped: C.emerald };
                          return (
                            <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `color-mix(in srgb, ${phaseColors[entry.phase] ?? C.slate} 13%, transparent)`, color: phaseColors[entry.phase] ?? C.slate }}>{entry.phase}</span>
                          );
                        })()}
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `color-mix(in srgb, ${toolColors[entry.tool as SessionTool]} 13%, transparent)`, color: toolColors[entry.tool as SessionTool] }}>{entry.tool}</span>
                      </div>
                    </div>
                    <p className="mb-3 text-sm" style={{ color: C.cyan }}>{entry.focus}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: C.slate }}>
                      <span>Duration</span>
                      <span>
                        {entry.duration}h
                        {entry.prDetails && entry.prDetails.length > 0 && (() => {
                          const first = new Date(Math.min(...entry.prDetails.map(p => new Date(p.createdAt).getTime())));
                          const last = new Date(Math.max(...entry.prDetails.map(p => new Date(p.mergedAt).getTime())));
                          const spanMin = Math.round((last.getTime() - first.getTime()) / 60000);
                          const h = Math.floor(spanMin / 60);
                          const m = spanMin % 60;
                          const spanStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
                          return <span style={{ color: C.muted, marginLeft: 6 }} title="Actual span from first PR created to last PR merged">({spanStr} measured)</span>;
                        })()}
                      </span>
                      <span>PRs</span>
                      <span>
                        {entry.prDetails && entry.prDetails.length > 0 ? (
                          <span className="flex flex-wrap gap-1">
                            {entry.prDetails.map((pr) => (
                              <a
                                key={pr.number}
                                href={`${repoUrls[projectId] ?? '#'}/pull/${pr.number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={pr.title}
                                className="hover:underline"
                                style={{ color: C.cyan }}
                              >
                                #{pr.number}
                              </a>
                            ))}
                          </span>
                        ) : (
                          entry.prs
                        )}
                      </span>
                      <span>Decisions</span><span>{entry.decisions}</span>
                      <span>Dead Ends</span><span>{entry.deadEnds}</span>
                    </div>
                    <button
                      onClick={() => onJumpToChapter?.(entry.chapterId)}
                      className="mt-3 rounded-md border px-2.5 py-1 text-xs"
                      style={{ color: C.cyan, backgroundColor: 'var(--theme-accent-10)', borderColor: 'var(--theme-accent-33)' }}
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
