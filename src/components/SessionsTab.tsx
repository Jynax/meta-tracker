import { useMemo, useState, useCallback, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import { formatShortDate, buildSmoothPath } from './chartUtils';
import { thinLabels, defaultWindow } from '../utils/brushUtils';
import type { SessionEntry, SessionTool, SessionDriver } from '../data/metaMetrics';
import type { DayEntry, WorkDriver, WorkOperator } from '../types/index';
import {
  MONTH_MAP,
  CHART_DIMS,
  CHART_INNER_WIDTH,
  CHART_INNER_HEIGHT,
  OPERATOR_DISPLAY_NAMES,
} from './sessions-tab/constants';
import { useBlockMetrics } from './sessions-tab/useBlockMetrics';

interface SessionsTabProps {
  sessions: SessionEntry[];
  days: DayEntry[];
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
  sessions, days, totalHours, projectId: _projectId,
  sessionFocusMap, sessionDateMap: _sessionDateMap, chapterMap,
  onJumpToChapter, hoveredPointIndex, setHoveredPointIndex, setTooltip,
}: SessionsTabProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [chartView, setChartView] = useState<'daily' | 'weekly'>('weekly');
  const [humanAttribution, setHumanAttribution] = useState(30);
  const [visibleRange, setVisibleRange] = useState<[number, number] | null>(null);
  const [visibleRangeAvg, setVisibleRangeAvg] = useState<[number, number] | null>(null);
  const [visibleRangeDriver, setVisibleRangeDriver] = useState<[number, number] | null>(null);

  const selectChartView = useCallback((nextView: 'daily' | 'weekly') => {
    setChartView(nextView);
    setVisibleRange(null);
    setVisibleRangeAvg(null);
    setVisibleRangeDriver(null);
  }, []);

  const toolColors: Record<SessionTool, string> = {
    'Claude Code': C.emerald,
    'Codex': C.amber,
    'Cowork': C.slate,
    'Mixed': C.violet,
  };
  // Per-block PR + decision lookup (Task #99 — see useBlockMetrics for context).
  const { getBlockPrs, getBlockDecisionsForDay } = useBlockMetrics(sessions);

  const dailyData = useMemo(() => {
    const dayBuckets = new Map<string, { dayLabel: string; prs: number; decisions: number; blockCount: number }>();
    days.forEach((d) => {
      const [month = 'Jan', day = '1'] = d.date.split(' ');
      const dt = new Date(2026, MONTH_MAP[month] ?? 0, parseInt(day, 10));
      const key = dt.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = dayBuckets.get(key) ?? { dayLabel, prs: 0, decisions: 0, blockCount: 0 };
      existing.prs += d.blocks.reduce((sum, b) => sum + getBlockPrs(b), 0);
      existing.decisions += d.metrics.totalDecisions;
      existing.blockCount += d.blocks.length;
      dayBuckets.set(key, existing);
    });
    return Array.from(dayBuckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [days, getBlockPrs]);

  /** Block-level view: one data point per work block */
  const blockData = useMemo(() => {
    const result: Array<{ session: string; label: string; date: string; prs: number; decisions: number; deadEnds: number }> = [];
    for (const d of [...days].sort((a, b) => {
      const [aMonth = 'Jan', aDay = '1'] = a.date.split(' ');
      const [bMonth = 'Jan', bDay = '1'] = b.date.split(' ');
      return new Date(2026, MONTH_MAP[aMonth] ?? 0, parseInt(aDay, 10)).getTime() -
             new Date(2026, MONTH_MAP[bMonth] ?? 0, parseInt(bDay, 10)).getTime();
    })) {
      const perBlockDecisions = getBlockDecisionsForDay(d);
      d.blocks.forEach((block, i) => {
        result.push({
          session: block.id,
          label: block.label,
          date: d.date,
          prs: getBlockPrs(block),
          decisions: perBlockDecisions[i] ?? 0,
          deadEnds: 0,
        });
      });
    }
    return result;
  }, [days, getBlockPrs, getBlockDecisionsForDay]);

  const sessionActivityPoints = useMemo(() => {
    const yTicks = 4;

    const dataSource = chartView === 'weekly'
      ? dailyData.map((d) => ({
          session: d.dayLabel,
          label: d.blockCount + ' block' + (d.blockCount > 1 ? 's' : ''),
          date: d.dayLabel,
          prs: d.prs,
          decisions: d.decisions,
          deadEnds: 0,
        }))
      : blockData;

    const maxMetric = Math.max(...dataSource.map((item) => Math.max(item.prs, item.decisions)), 1);
    const raw = maxMetric / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const allPoints = dataSource.map((entry) => ({
      ...entry,
      dateLabel: chartView === 'weekly' ? entry.date : formatShortDate(entry.date),
    }));

    const [defaultStart, defaultEnd] = defaultWindow(allPoints.length, 30);
    const range = visibleRange ?? [defaultStart, defaultEnd];
    const sliced = allPoints.slice(range[0], range[1] + 1);

    const points = sliced.map((entry, index) => {
      const ratioX = sliced.length > 1 ? index / (sliced.length - 1) : 0;
      const x = CHART_DIMS.left + ratioX * CHART_INNER_WIDTH;
      return {
        ...entry,
        x,
        yPrs: CHART_DIMS.top + (1 - (entry.prs / yMax)) * CHART_INNER_HEIGHT,
        yDecisions: CHART_DIMS.top + (1 - (entry.decisions / yMax)) * CHART_INNER_HEIGHT,
      };
    });

    return { dims: CHART_DIMS, innerHeight: CHART_INNER_HEIGHT, yTicks, step, yMax, points, allPoints, range };
  }, [chartView, dailyData, blockData, visibleRange]);


  const avgTaskTimePoints = useMemo(() => {
    // Filter to days that have blocks with time recorded
    const validDays = days.filter(d => d.blocks.some(b => (b.timeMinutes ?? 0) > 0));
    if (!validDays.length) return null;

    type AvgPoint = { session: string; date: string; dateLabel: string; label: string; avgMin: number; tool: string; taskCount: number; duration: number };

    let rawPoints: AvgPoint[];
    if (chartView === 'weekly') {
      // Day-level aggregation: avg time per block
      const dayBuckets = new Map<string, { dayLabel: string; totalMinutes: number; totalBlocks: number; operator: WorkOperator }>();
      validDays.forEach((d) => {
        const [month = 'Jan', day = '1'] = d.date.split(' ');
        const dt = new Date(2026, MONTH_MAP[month] ?? 0, parseInt(day, 10));
        const key = dt.toISOString().slice(0, 10);
        // Use the dominant operator for the day
        const opCounts = new Map<WorkOperator, number>();
        d.blocks.forEach(b => opCounts.set(b.operator, (opCounts.get(b.operator) ?? 0) + 1));
        const dominantOp = [...opCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'claude-code';
        const existing = dayBuckets.get(key) ?? { dayLabel: d.date, totalMinutes: 0, totalBlocks: 0, operator: dominantOp };
        existing.totalMinutes += d.metrics.totalTimeMinutes;
        existing.totalBlocks += d.blocks.length;
        dayBuckets.set(key, existing);
      });
      const sorted = Array.from(dayBuckets.entries()).sort(([a], [b]) => a.localeCompare(b));
      rawPoints = sorted.map(([, bucket]) => {
        const avgMin = bucket.totalBlocks > 0 ? bucket.totalMinutes / bucket.totalBlocks : 0;
        return {
          session: bucket.dayLabel, date: bucket.dayLabel, dateLabel: formatShortDate(bucket.dayLabel),
          label: bucket.totalBlocks + ' blocks', avgMin: Math.round(avgMin),
          tool: OPERATOR_DISPLAY_NAMES[bucket.operator] ?? bucket.operator,
          taskCount: bucket.totalBlocks, duration: Math.round(bucket.totalMinutes / 60),
        };
      });
    } else {
      // Block-level: each block is a data point
      rawPoints = [];
      const sortedDaysForAvg = [...validDays].sort((a, b) => {
        const [aM = 'Jan', aD = '1'] = a.date.split(' ');
        const [bM = 'Jan', bD = '1'] = b.date.split(' ');
        return new Date(2026, MONTH_MAP[aM] ?? 0, parseInt(aD, 10)).getTime() -
               new Date(2026, MONTH_MAP[bM] ?? 0, parseInt(bD, 10)).getTime();
      });
      for (const d of sortedDaysForAvg) {
        for (const block of d.blocks) {
          const mins = block.timeMinutes ?? 0;
          if (mins <= 0) continue;
          rawPoints.push({
            session: block.id, date: d.date, dateLabel: formatShortDate(d.date),
            label: block.label, avgMin: mins,
            tool: OPERATOR_DISPLAY_NAMES[block.operator] ?? block.operator,
            taskCount: 1, duration: Math.round(mins / 60),
          });
        }
      }
    }

    const yTicks = 4;
    const maxTime = Math.max(...rawPoints.map(p => p.avgMin), 1);
    const raw = maxTime / yTicks || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    const allPoints = rawPoints;
    const [defaultStart, defaultEnd] = defaultWindow(allPoints.length, 30);
    const range = visibleRangeAvg ?? [defaultStart, defaultEnd];
    const sliced = allPoints.slice(range[0], range[1] + 1);

    const points = sliced.map((p, index) => {
      const ratioX = sliced.length > 1 ? index / (sliced.length - 1) : 0;
      const x = CHART_DIMS.left + ratioX * CHART_INNER_WIDTH;
      return {
        ...p,
        x,
        y: CHART_DIMS.top + (1 - (p.avgMin / yMax)) * CHART_INNER_HEIGHT,
      };
    });

    return { dims: CHART_DIMS, innerHeight: CHART_INNER_HEIGHT, yTicks, step, yMax, points, allPoints, range };
  }, [days, chartView, visibleRangeAvg]);

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

    // Normalize WorkDriver → SessionDriver: 'ai' maps to 'agent-led', 'human' stays 'human'
    const normalizeDriver = (d: WorkDriver): SessionDriver =>
      d === 'ai' ? 'agent-led' : d as SessionDriver;

    // Group blocks by date to create bars
    const dayGroups = new Map<string, { dayLabel: string; counts: Record<SessionDriver, number> }>();

    days.forEach((d) => {
      const [month = 'Jan', day = '1'] = d.date.split(' ');
      const dt = new Date(2026, MONTH_MAP[month] ?? 0, parseInt(day, 10));
      const key = dt.toISOString().slice(0, 10);
      const dayLabel = month + ' ' + parseInt(day, 10);
      const existing = dayGroups.get(key) ?? { dayLabel, counts: { 'human-only': 0, 'agent-led': 0, collaborative: 0, human: 0 } };
      for (const block of d.blocks) {
        const driver = normalizeDriver(block.driver);
        rawTotals[driver] = (rawTotals[driver] ?? 0) + 1;
        existing.counts[driver] = (existing.counts[driver] ?? 0) + 1;
      }
      dayGroups.set(key, existing);
    });

    // Apply human time attribution: shift a % of collaborative to human (est.)
    const attrFrac = humanAttribution / 100;
    const driverTotals = { ...rawTotals };
    driverTotals.human = (driverTotals.human ?? 0) + rawTotals.collaborative * attrFrac;
    driverTotals.collaborative = rawTotals.collaborative * (1 - attrFrac);

    const allBars = Array.from(dayGroups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => {
        const adjusted = { ...v, counts: { ...v.counts } };
        const collabRaw = adjusted.counts.collaborative;
        adjusted.counts.human = (adjusted.counts.human ?? 0) + collabRaw * attrFrac;
        adjusted.counts.collaborative = collabRaw * (1 - attrFrac);
        return adjusted;
      });


    const [defaultStart, defaultEnd] = defaultWindow(allBars.length, 30);
    const range = visibleRangeDriver ?? [defaultStart, defaultEnd];
    const bars = allBars.slice(range[0], range[1] + 1);

    const maxStack = bars.length > 0 ? Math.max(...bars.map(b => drivers.reduce((s, d) => s + b.counts[d], 0))) : 0;
    const yTicks = 4;
    const raw = (maxStack / yTicks) || 1;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = Math.max(1, Math.ceil(raw / mag) * mag);
    const yMax = step * yTicks;

    return { drivers, driverTotals, bars, allBars, range, yTicks, step, yMax };
  }, [days, humanAttribution, visibleRangeDriver]);

  const sessionLines = useMemo(() => {
    const pathBuilder = chartView === 'weekly'
      ? (pts: Array<{ x: number; y: number }>) => pts.length ? 'M ' + pts.map(p => p.x + ' ' + p.y).join(' L ') : ''
      : buildSmoothPath;
    return {
      prs: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yPrs }))),
      decisions: pathBuilder(sessionActivityPoints.points.map((point) => ({ x: point.x, y: point.yDecisions }))),
    };
  }, [sessionActivityPoints.points, chartView]);

  const handleBrushDrag = useCallback((chartType: 'session' | 'avg' | 'driver') => (e: React.MouseEvent<SVGRectElement>) => {
    const svg = e.currentTarget.closest('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const startX = e.clientX;

    const allLen = chartType === 'session' ? sessionActivityPoints.allPoints.length
      : chartType === 'avg' ? (avgTaskTimePoints?.allPoints.length ?? 0)
      : driverChartData.allBars.length;

    const setRange = chartType === 'session' ? setVisibleRange
      : chartType === 'avg' ? setVisibleRangeAvg
      : setVisibleRangeDriver;

    const currentRange = chartType === 'session' ? (visibleRange ?? defaultWindow(allLen, 30))
      : chartType === 'avg' ? (visibleRangeAvg ?? defaultWindow(allLen, 30))
      : (visibleRangeDriver ?? defaultWindow(allLen, 30));

    const windowSize = currentRange[1] - currentRange[0];

    const onMove = (moveE: MouseEvent) => {
      const dx = moveE.clientX - startX;
      const pxPerPoint = (rect.width * 0.9) / Math.max(allLen, 1);
      const shift = Math.round(dx / pxPerPoint);
      const newStart = Math.max(0, Math.min(allLen - windowSize - 1, currentRange[0] + shift));
      setRange([newStart, newStart + windowSize]);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [sessionActivityPoints, avgTaskTimePoints, driverChartData, visibleRange, visibleRangeAvg, visibleRangeDriver]);

  const sortedDays = useMemo(() => {
    return [...days].sort((a, b) => {
      const [aMonth = 'Jan', aDay = '1'] = a.date.split(' ');
      const [bMonth = 'Jan', bDay = '1'] = b.date.split(' ');
      const aDate = new Date(2026, MONTH_MAP[aMonth] ?? 0, parseInt(aDay, 10));
      const bDate = new Date(2026, MONTH_MAP[bMonth] ?? 0, parseInt(bDay, 10));
      return bDate.getTime() - aDate.getTime(); // newest first
    });
  }, [days]);

  const derivedTotalPRs = useMemo(
    () => days.reduce((sum, d) => sum + d.blocks.reduce((s, b) => s + getBlockPrs(b), 0), 0),
    [days, getBlockPrs],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Total PRs" value={derivedTotalPRs} color={C.emerald} />
        <Card label="Total Decisions" value={days.reduce((sum, d) => sum + d.metrics.totalDecisions, 0)} color={C.cyan} />
        <Card label="Total Blocks" value={days.reduce((sum, d) => sum + d.blocks.length, 0)} color={C.rose} />
        <Card label="Total Hours" value={`${totalHours}h`} color={C.amber} />
      </div>

      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Session Activity</h3>
          <div className="flex rounded-md border overflow-hidden" style={{ borderColor: C.border }}>
            <button
              onClick={() => selectChartView('weekly')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{ backgroundColor: chartView === 'weekly' ? 'color-mix(in srgb, var(--theme-cyan) 13%, transparent)' : 'transparent', color: chartView === 'weekly' ? C.cyan : C.slate, borderRight: `1px solid ${C.border}` }}
            >By Day</button>
            <button
              onClick={() => selectChartView('daily')}
              className="px-3 py-1 text-xs font-medium transition-colors"
              style={{ backgroundColor: chartView === 'daily' ? 'color-mix(in srgb, var(--theme-cyan) 13%, transparent)' : 'transparent', color: chartView === 'daily' ? C.cyan : C.slate }}
            >By Session</button>
          </div>
        </div>
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
          {(() => {
            const { points, allPoints, range } = sessionActivityPoints;
            const labelVis = thinLabels(points.map(p => p.dateLabel), 20);
            const lastPoint = points[points.length - 1];
            return (
              <>
                <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Session activity chart">
                  {Array.from({ length: sessionActivityPoints.yTicks + 1 }, (_, index) => {
                    const value = index * sessionActivityPoints.step;
                    const y = sessionActivityPoints.dims.top + sessionActivityPoints.innerHeight - (index / sessionActivityPoints.yTicks) * sessionActivityPoints.innerHeight;
                    return (
                      <g key={'sa-grid-' + value}>
                        <line x1={sessionActivityPoints.dims.left} y1={y} x2={sessionActivityPoints.dims.width - sessionActivityPoints.dims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                        <text x={sessionActivityPoints.dims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}</text>
                      </g>
                    );
                  })}

                  <path d={sessionLines.prs} fill="none" stroke={C.cyan} strokeWidth="2" />
                  <path d={sessionLines.decisions} fill="none" stroke={C.emerald} strokeWidth="2" />

                  {lastPoint && (
                    <>
                      <text x={lastPoint.x + 8} y={lastPoint.yPrs} fill={C.cyan} fontSize={10} dominantBaseline="middle">PRs</text>
                      <text x={lastPoint.x + 8} y={lastPoint.yDecisions} fill={C.emerald} fontSize={10} dominantBaseline="middle">Decisions</text>
                    </>
                  )}

                  {points.map((point, index) => (
                    <g key={point.session + '-' + index + '-sa'}>
                      {[
                        { label: 'PRs', value: point.prs, y: point.yPrs, color: C.cyan },
                        { label: 'Decisions', value: point.decisions, y: point.yDecisions, color: C.emerald },
                      ].map((metric) => (
                        <circle
                          key={point.session + '-' + index + '-' + metric.label}
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
                                  <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{chartView === 'weekly' ? `${point.date} (${point.label})` : `${point.date} \u2014 ${point.label}`}</div>
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
                      {labelVis[index] && (
                        <>
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
                        </>
                      )}
                    </g>
                  ))}
                </svg>

                {allPoints.length > 30 && (
                  <div className="mt-1">
                    <svg viewBox="0 0 920 32" style={{ width: '100%', height: 32 }}>
                      <polyline
                        points={allPoints.map((p, i) => {
                          const x = CHART_DIMS.left + (i / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH;
                          const y = 24 - (p.prs / sessionActivityPoints.yMax) * 20;
                          return x + ',' + y;
                        }).join(' ')}
                        fill="none" stroke={C.cyan} strokeWidth="1" opacity="0.3"
                      />
                      <rect
                        x={CHART_DIMS.left + (range[0] / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH}
                        width={((range[1] - range[0]) / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH}
                        y={0} height={32} rx={4}
                        fill={C.cyan} opacity={0.08}
                        style={{ cursor: 'grab' }}
                        onMouseDown={handleBrushDrag('session')}
                      />
                    </svg>
                    <div className="flex justify-between text-[10px] px-12" style={{ color: C.muted }}>
                      <span>{allPoints[0]?.dateLabel}</span>
                      <span>{range[1] - range[0] + 1} of {allPoints.length}</span>
                      <span>{allPoints[allPoints.length - 1]?.dateLabel}</span>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
          </div>
        </div>


      {avgTaskTimePoints && (
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="text-sm font-semibold">Avg Task Time</h3>
        <div className="text-xs mb-3" style={{ color: C.muted }}>Minutes per task {chartView === 'weekly' ? 'by day' : 'by session'}</div>
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: 4 }}>
          {(() => {
            const { points, allPoints, range } = avgTaskTimePoints;
            const labelVis = thinLabels(points.map(p => p.dateLabel), 20);
            const lastByTool: Record<string, typeof points[number]> = {};
            points.forEach(p => { lastByTool[p.tool] = p; });
            return (
              <>
                <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Average task time chart">
                  {Array.from({ length: avgTaskTimePoints.yTicks + 1 }, (_, index) => {
                    const value = index * avgTaskTimePoints.step;
                    const y = avgTaskTimePoints.dims.top + avgTaskTimePoints.innerHeight - (index / avgTaskTimePoints.yTicks) * avgTaskTimePoints.innerHeight;
                    return (
                      <g key={'avg-grid-' + value}>
                        <line x1={avgTaskTimePoints.dims.left} y1={y} x2={avgTaskTimePoints.dims.width - avgTaskTimePoints.dims.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                        <text x={avgTaskTimePoints.dims.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}m</text>
                      </g>
                    );
                  })}

                  {Object.entries(avgTaskTimePaths).map(([tool, d]) => (
                    <path key={tool} d={d} fill="none" stroke={toolColors[tool as SessionTool] ?? C.violet} strokeWidth="2" strokeOpacity="0.6" />
                  ))}

                  {Object.entries(lastByTool).map(([tool, pt]) => (
                    <text key={'label-' + tool} x={pt.x + 8} y={pt.y} fill={toolColors[tool as SessionTool] ?? C.violet} fontSize={10} dominantBaseline="middle">{tool}</text>
                  ))}

                  {points.map((point, index) => (
                    <circle
                      key={'avg-' + point.session + '-' + index}
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
                              <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{point.date} \u2014 {point.label}</div>
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

                  {points.map((point, index) => {
                    if (!labelVis[index]) return null;
                    return (
                      <text
                        key={'avg-label-' + index}
                        x={point.x}
                        y={index % 2 === 0 ? avgTaskTimePoints.dims.height - 10 : avgTaskTimePoints.dims.height - 22}
                        textAnchor="middle" fill={C.slate} fontSize="10"
                      >
                        {point.dateLabel}
                      </text>
                    );
                  })}
                </svg>

                {allPoints.length > 30 && (
                  <div className="mt-1">
                    <svg viewBox="0 0 920 32" style={{ width: '100%', height: 32 }}>
                      <polyline
                        points={allPoints.map((p, i) => {
                          const x = CHART_DIMS.left + (i / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH;
                          const y = 24 - (p.avgMin / avgTaskTimePoints.yMax) * 20;
                          return x + ',' + y;
                        }).join(' ')}
                        fill="none" stroke={C.violet} strokeWidth="1" opacity="0.3"
                      />
                      <rect
                        x={CHART_DIMS.left + (range[0] / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH}
                        width={((range[1] - range[0]) / Math.max(allPoints.length - 1, 1)) * CHART_INNER_WIDTH}
                        y={0} height={32} rx={4}
                        fill={C.violet} opacity={0.08}
                        style={{ cursor: 'grab' }}
                        onMouseDown={handleBrushDrag('avg')}
                      />
                    </svg>
                    <div className="flex justify-between text-[10px] px-12" style={{ color: C.muted }}>
                      <span>{allPoints[0]?.dateLabel}</span>
                      <span>{range[1] - range[0] + 1} of {allPoints.length}</span>
                      <span>{allPoints[allPoints.length - 1]?.dateLabel}</span>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
      )}
      {/* Driver Breakdown */}
      {driverChartData.bars.length > 0 && (
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold" style={{ color: C.white }}>Driver Breakdown</h3>
          <div className="flex items-center gap-2">
            <label htmlFor="human-attribution" className="text-[10px]" style={{ color: C.muted }}>Human attribution</label>
            <input
              id="human-attribution"
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
          {(() => {
            const { bars, allBars, range } = driverChartData;
            const labelVis = thinLabels(bars.map(b => b.dayLabel), 20);
            return (
              <>
                <svg viewBox="0 0 920 280" style={{ width: '100%', height: 280 }} role="img" aria-label="Driver breakdown chart">
                  {Array.from({ length: driverChartData.yTicks + 1 }, (_, index) => {
                    const value = index * driverChartData.step;
                    const y = CHART_DIMS.top + CHART_INNER_HEIGHT - (index / driverChartData.yTicks) * CHART_INNER_HEIGHT;
                    return (
                      <g key={'driver-grid-' + value}>
                        <line x1={CHART_DIMS.left} y1={y} x2={CHART_DIMS.width - CHART_DIMS.right} y2={y} stroke={C.border} strokeDasharray="4 4" strokeOpacity="0.3" />
                        <text x={CHART_DIMS.left - 8} y={y + 4} textAnchor="end" fill={C.slate} fontSize="10">{value}</text>
                      </g>
                    );
                  })}

                  {bars.map((bar, barIndex) => {
                    const barWidth = bars.length > 1
                      ? (CHART_INNER_WIDTH / bars.length) * 0.7
                      : 40;
                    const barGap = bars.length > 1
                      ? CHART_INNER_WIDTH / bars.length
                      : 40;
                    const barX = CHART_DIMS.left + barIndex * barGap + (barGap - barWidth) / 2;
                    const baseline = CHART_DIMS.top + CHART_INNER_HEIGHT;
                    let stackY = baseline;

                    return (
                      <g key={'driver-bar-' + barIndex}>
                        {driverChartData.drivers.map(d => {
                          const count = bar.counts[d];
                          if (count === 0) return null;
                          const h = (count / driverChartData.yMax) * CHART_INNER_HEIGHT;
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
                        {labelVis[barIndex] && (
                          <text
                            x={barX + barWidth / 2}
                            y={barIndex % 2 === 0 ? CHART_DIMS.height - 10 : CHART_DIMS.height - 22}
                            textAnchor="middle" fill={C.slate} fontSize="10"
                          >
                            {bar.dayLabel}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {allBars.length > 30 && (
                  <div className="mt-1">
                    <svg viewBox="0 0 920 32" style={{ width: '100%', height: 32 }}>
                      {allBars.map((bar, i) => {
                        const x = CHART_DIMS.left + (i / Math.max(allBars.length - 1, 1)) * CHART_INNER_WIDTH;
                        const total = driverChartData.drivers.reduce((s, d) => s + bar.counts[d], 0);
                        const h = total > 0 ? (total / driverChartData.yMax) * 24 : 0;
                        return <rect key={i} x={x - 1} y={28 - h} width={2} height={h} fill={C.emerald} opacity={0.3} />;
                      })}
                      <rect
                        x={CHART_DIMS.left + (range[0] / Math.max(allBars.length - 1, 1)) * CHART_INNER_WIDTH}
                        width={((range[1] - range[0]) / Math.max(allBars.length - 1, 1)) * CHART_INNER_WIDTH}
                        y={0} height={32} rx={4}
                        fill={C.emerald} opacity={0.08}
                        style={{ cursor: 'grab' }}
                        onMouseDown={handleBrushDrag('driver')}
                      />
                    </svg>
                    <div className="flex justify-between text-[10px] px-12" style={{ color: C.muted }}>
                      <span>{allBars[0]?.dayLabel}</span>
                      <span>{range[1] - range[0] + 1} of {allBars.length}</span>
                      <span>{allBars[allBars.length - 1]?.dayLabel}</span>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
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
                type="button"
                aria-expanded={isExpanded}
                onClick={() => {
                  setExpandedDays((prev) => {
                    const next = new Set(prev);
                    if (next.has(day.date)) next.delete(day.date);
                    else next.add(day.date);
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between rounded-lg border px-4 py-3"
                style={{ backgroundColor: C.cardBg, borderColor: isExpanded ? C.cyan : C.border }}
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
                  <span style={{ color: C.muted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', fontSize: 12 }}>&#9654;</span>
                </div>
              </button>

              {/* Expanded: Work Blocks */}
              <div style={{ display: isExpanded ? 'block' : 'none' }}>
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
