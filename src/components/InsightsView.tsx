import { useMemo, useState, type ReactNode } from 'react';
import { C } from './MetricsCard';
import type { InsightsData, ProjectBundle } from '../utils/insightsData';
import { computeInsights } from '../utils/insightsData';

// All project + metrics imports
import { bipProject } from '../data/bipProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDays } from '../data/bipMetrics';
import { metaProject } from '../data/metaProject';
import { metaCodeVolume, metaSessions, metaBugs, metaDays } from '../data/metaMetrics';
import { remnantsProject } from '../data/remnantsProject';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDays } from '../data/remnantsMetrics';
import { itemBGoneProject } from '../data/itemBGoneProject';
import { ibgCodeVolume, ibgSessions, ibgBugs, ibgDays } from '../data/itemBGoneMetrics';
import { vulnBankProject } from '../data/vulnBankProject';
import { vbCodeVolume, vbSessions, vbBugs, vbDays } from '../data/vulnBankMetrics';
import { landingProject } from '../data/landingProject';
import { landingCodeVolume, landingSessions, landingBugs, landingDays } from '../data/landingMetrics';
import { feedbackCaptureProject } from '../data/feedbackCaptureProject';
import { fcCodeVolume, fcSessions, fcBugs, fcDays } from '../data/feedbackCaptureMetrics';
import { noteWorthyProject } from '../data/noteWorthyProject';
import { nwCodeVolume, nwSessions, nwBugs, nwDays } from '../data/noteWorthyMetrics';
import { onTheMoveProject } from '../data/onTheMoveProject';
import { otmCodeVolume, otmSessions, otmBugs, otmDays } from '../data/onTheMoveMetrics';

const ALL_BUNDLES: ProjectBundle[] = [
  { project: bipProject, codeVolume: bipCodeVolume, sessions: bipSessions, bugs: bipBugs, days: bipDays },
  { project: metaProject, codeVolume: metaCodeVolume, sessions: metaSessions, bugs: metaBugs, days: metaDays },
  { project: remnantsProject, codeVolume: remnantsCodeVolume, sessions: remnantsSessions, bugs: remnantsBugs, days: remnantsDays },
  { project: itemBGoneProject, codeVolume: ibgCodeVolume, sessions: ibgSessions, bugs: ibgBugs, days: ibgDays },
  { project: vulnBankProject, codeVolume: vbCodeVolume, sessions: vbSessions, bugs: vbBugs, days: vbDays },
  { project: landingProject, codeVolume: landingCodeVolume, sessions: landingSessions, bugs: landingBugs, days: landingDays },
  { project: feedbackCaptureProject, codeVolume: fcCodeVolume, sessions: fcSessions, bugs: fcBugs, days: fcDays },
  { project: noteWorthyProject, codeVolume: nwCodeVolume, sessions: nwSessions, bugs: nwBugs, days: nwDays },
  { project: onTheMoveProject, codeVolume: otmCodeVolume, sessions: otmSessions, bugs: otmBugs, days: otmDays },
];

type InsightTab = 'velocity' | 'estimates' | 'drivers' | 'timeline' | 'workMix' | 'bugTrends';

const INSIGHT_CARDS: Array<{ id: InsightTab; label: string; color: string }> = [
  { id: 'velocity', label: 'Velocity', color: 'var(--theme-cyan)' },
  { id: 'estimates', label: 'Traditional Est.', color: '#a78bfa' },
  { id: 'drivers', label: 'Drivers', color: 'var(--theme-emerald)' },
  { id: 'timeline', label: 'Timeline', color: 'var(--theme-amber)' },
  { id: 'workMix', label: 'Work Mix', color: '#60a5fa' },
  { id: 'bugTrends', label: 'Bug Trends', color: 'var(--theme-rose)' },
];

interface InsightsViewProps {
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function InsightsView({ setTooltip }: InsightsViewProps) {
  const [activeTab, setActiveTab] = useState<InsightTab>('velocity');
  const data = useMemo(() => computeInsights(ALL_BUNDLES), []);

  const cardHeadlines: Record<InsightTab, string> = useMemo(() => {
    const fastest = data.velocity[0];
    const totalTraditional = data.estimates.reduce((s, e) => s + e.traditionalHours, 0);
    const totalActual = data.estimates.reduce((s, e) => s + e.actualHours, 0);
    const multiplier = totalActual > 0 ? Math.round(totalTraditional / totalActual) : 0;

    const topDriver = Object.entries(data.drivers).sort((a, b) => b[1].totalLoc - a[1].totalLoc)[0];
    const secondDriver = Object.entries(data.drivers).sort((a, b) => b[1].totalLoc - a[1].totalLoc)[1];
    const driverRatio = secondDriver && secondDriver[1].totalLoc > 0
      ? `${(topDriver[1].totalLoc / secondDriver[1].totalLoc).toFixed(1)}x`
      : '';
    const driverLabel = topDriver ? `${topDriver[0]}: ${driverRatio} output` : '';

    const dayCount = new Set(ALL_BUNDLES.flatMap(b => b.days.map(d => d.date))).size;

    const topCat = Object.entries(data.workMix.aggregate).sort((a, b) => b[1] - a[1])[0];
    const totalBlocks = Object.values(data.workMix.aggregate).reduce((s, n) => s + n, 0);
    const topPct = topCat && totalBlocks > 0 ? Math.round((topCat[1] / totalBlocks) * 100) : 0;

    const bugsWithData = data.bugTrends.flatMap(b => b.rateByAge).filter(p => p.bugsPerSession > 0);
    const avgAge = bugsWithData.length > 0
      ? Math.round(bugsWithData.reduce((s, p) => s + p.sessionAge, 0) / bugsWithData.length)
      : 0;

    return {
      velocity: fastest ? `${fastest.projectName}: ${fastest.locPerHour.toLocaleString()} LOC/hr` : 'No data',
      estimates: `${multiplier}x faster avg`,
      drivers: driverLabel,
      timeline: `${dayCount} days, ${data.portfolio.totalProjects} projects`,
      workMix: topCat ? `${topPct}% ${topCat[0]}` : 'No data',
      bugTrends: avgAge > 0 ? `Peak at session ${avgAge}` : 'No bugs tracked',
    };
  }, [data]);

  return (
    <div className="space-y-4">
      {/* Portfolio Banner */}
      <div
        className="grid grid-cols-5 gap-3 rounded-xl border p-4"
        style={{ backgroundColor: C.cardBg, borderColor: C.border }}
      >
        {[
          { label: 'Projects', value: data.portfolio.totalProjects },
          { label: 'Total LOC', value: data.portfolio.totalLoc.toLocaleString() },
          { label: 'Hours', value: data.portfolio.totalHours.toLocaleString() },
          { label: 'PRs', value: data.portfolio.totalPrs.toLocaleString() },
          { label: 'Bugs Fixed', value: data.portfolio.totalBugsFixed },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold" style={{ color: C.white }}>{stat.value}</div>
            <div className="text-xs" style={{ color: C.muted }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {INSIGHT_CARDS.map(card => {
          const isActive = activeTab === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className="rounded-xl border p-3 text-left transition"
              style={{
                backgroundColor: C.cardBg,
                borderColor: isActive ? card.color : C.border,
                borderWidth: isActive ? 2 : 1,
              }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: card.color }}>
                {card.label}
              </div>
              <div className="mt-1 text-sm font-medium truncate" style={{ color: C.white }}>
                {cardHeadlines[card.id]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Tab Content */}
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: C.cardBg, borderColor: C.border }}
      >
        {activeTab === 'velocity' && <VelocitySection data={data} setTooltip={setTooltip} />}
        {activeTab === 'estimates' && <EstimatesSection data={data} />}
        {activeTab === 'drivers' && <DriversSection data={data} />}
        {activeTab === 'timeline' && <TimelineSection data={data} />}
        {activeTab === 'workMix' && <WorkMixSection data={data} />}
        {activeTab === 'bugTrends' && <BugTrendsSection data={data} setTooltip={setTooltip} />}
      </div>
    </div>
  );
}

// ── Detail Sections (stubs — completed in Tasks 5-7) ──────────────

interface SectionProps {
  data: InsightsData;
  setTooltip?: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

function VelocitySection({ data, setTooltip }: SectionProps) {
  const maxLoc = Math.max(...data.velocity.map(v => v.locPerHour), 1);
  const barHeight = 28;
  const labelWidth = 120;
  const chartWidth = 700;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>LOC / Hour by Project</h3>
      <svg width={chartWidth + labelWidth + 80} height={data.velocity.length * (barHeight + 8) + 8} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 80} ${data.velocity.length * (barHeight + 8) + 8}`}>
        {data.velocity.map((row, i) => {
          const y = i * (barHeight + 8) + 4;
          const barW = maxLoc > 0 ? (row.locPerHour / maxLoc) * chartWidth : 0;
          return (
            <g key={row.projectId}
              onMouseEnter={(e) => setTooltip?.({ x: e.clientX, y: e.clientY, content: (
                <div className="text-xs space-y-1">
                  <div style={{ color: C.white }} className="font-medium">{row.projectName}</div>
                  <div style={{ color: C.muted }}>{row.locPerHour.toLocaleString()} LOC/hr | {row.totalHours}h total | {row.prsPerSession} PRs/session</div>
                </div>
              )})}
              onMouseLeave={() => setTooltip?.(null)}
            >
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={12}>{row.projectName}</text>
              <rect x={labelWidth} y={y} width={barW} height={barHeight} rx={4} fill="var(--theme-cyan)" opacity={0.8} />
              <text x={labelWidth + barW + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={11}>{row.locPerHour.toLocaleString()}</text>
            </g>
          );
        })}
      </svg>

      {/* Summary table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs" style={{ color: C.muted }}>
          <thead>
            <tr className="border-b" style={{ borderColor: C.border }}>
              <th className="py-2 text-left font-medium" style={{ color: C.white }}>Project</th>
              <th className="py-2 text-right font-medium" style={{ color: C.white }}>LOC/hr</th>
              <th className="py-2 text-right font-medium" style={{ color: C.white }}>PRs/session</th>
              <th className="py-2 text-right font-medium" style={{ color: C.white }}>Total Hours</th>
              <th className="py-2 text-right font-medium" style={{ color: C.white }}>Total LOC</th>
            </tr>
          </thead>
          <tbody>
            {data.velocity.map(row => (
              <tr key={row.projectId} className="border-b" style={{ borderColor: C.border }}>
                <td className="py-1.5">{row.projectName}</td>
                <td className="py-1.5 text-right">{row.locPerHour.toLocaleString()}</td>
                <td className="py-1.5 text-right">{row.prsPerSession}</td>
                <td className="py-1.5 text-right">{row.totalHours}</td>
                <td className="py-1.5 text-right">{row.totalLoc.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TIER_COLORS: Record<string, string> = {
  Simple: 'var(--theme-emerald)',
  Standard: 'var(--theme-cyan)',
  Complex: 'var(--theme-amber)',
  Specialized: '#a78bfa',
};

function EstimatesSection({ data }: SectionProps) {
  const maxHours = Math.max(...data.estimates.map(e => e.traditionalHours), 1);
  const barHeight = 20;
  const gap = 6;
  const rowHeight = barHeight * 2 + gap + 16;
  const labelWidth = 120;
  const chartWidth = 600;
  const totalTraditional = data.estimates.reduce((s, e) => s + e.traditionalHours, 0);
  const totalActual = data.estimates.reduce((s, e) => s + e.actualHours, 0);
  const overallMultiplier = totalActual > 0 ? Math.round(totalTraditional / totalActual) : 0;

  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold" style={{ color: C.white }}>Actual vs Traditional Estimate</h3>
      <p className="mb-3 text-xs" style={{ color: C.muted }}>
        Portfolio multiplier: <span style={{ color: '#a78bfa' }} className="font-bold">{overallMultiplier}x</span> — {totalActual}h actual vs {totalTraditional}h traditional
      </p>

      <svg width={chartWidth + labelWidth + 120} height={data.estimates.length * rowHeight + 8} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 120} ${data.estimates.length * rowHeight + 8}`}>
        {data.estimates.map((row, i) => {
          const y = i * rowHeight + 4;
          const actualW = maxHours > 0 ? (row.actualHours / maxHours) * chartWidth : 0;
          const tradW = maxHours > 0 ? (row.traditionalHours / maxHours) * chartWidth : 0;
          const tierColor = TIER_COLORS[row.tier] ?? C.muted;
          return (
            <g key={row.projectId}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={12}>{row.projectName}</text>
              {/* Tier badge */}
              <text x={labelWidth - 8} y={y + barHeight + gap + barHeight / 2 + 4} textAnchor="end" fill={tierColor} fontSize={10}>{row.tier}</text>
              {/* Actual bar */}
              <rect x={labelWidth} y={y} width={actualW} height={barHeight} rx={3} fill="var(--theme-cyan)" opacity={0.9} />
              <text x={labelWidth + actualW + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={10}>{row.actualHours}h actual</text>
              {/* Traditional bar */}
              <rect x={labelWidth} y={y + barHeight + gap} width={tradW} height={barHeight} rx={3} fill="#a78bfa" opacity={0.5} />
              <text x={labelWidth + tradW + 6} y={y + barHeight + gap + barHeight / 2 + 4} fill={C.muted} fontSize={10}>{row.traditionalHours}h ({row.traditionalWeeks}w)</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const DRIVER_COLORS: Record<string, string> = {
  'agent-led': 'var(--theme-cyan)',
  collaborative: 'var(--theme-amber)',
  human: 'var(--theme-emerald)',
  'human-only': '#a78bfa',
};

const DRIVER_LABELS: Record<string, string> = {
  'agent-led': 'Agent-Led',
  collaborative: 'Collaborative',
  human: 'Human',
  'human-only': 'Human Only',
};

function DriversSection({ data }: SectionProps) {
  const drivers = Object.entries(data.drivers).sort((a, b) => b[1].totalLoc - a[1].totalLoc);
  const maxLoc = Math.max(...drivers.map(([, s]) => s.totalLoc), 1);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>Output by Driver Type</h3>
      <div className="space-y-4">
        {drivers.map(([driver, stats]) => {
          const color = DRIVER_COLORS[driver] ?? C.muted;
          const label = DRIVER_LABELS[driver] ?? driver;
          const barPct = maxLoc > 0 ? (stats.totalLoc / maxLoc) * 100 : 0;
          return (
            <div key={driver}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color }}>{label}</span>
                <span className="text-xs" style={{ color: C.muted }}>{stats.sessionCount} blocks</span>
              </div>
              <div className="h-5 rounded-md overflow-hidden" style={{ backgroundColor: C.bg }}>
                <div className="h-full rounded-md transition-all" style={{ width: `${barPct}%`, backgroundColor: color, opacity: 0.8 }} />
              </div>
              <div className="mt-1 flex gap-4 text-[10px]" style={{ color: C.muted }}>
                <span>{stats.totalLoc.toLocaleString()} LOC</span>
                <span>{Math.round(stats.totalHours)}h</span>
                <span>{stats.bugsPerSession} bugs/block</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineSection({ data }: SectionProps) {
  const allDates = Array.from(new Set(data.timeline.flatMap(r => [r.firstDate, r.lastDate, ...r.sessionDates]))).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [am, ad] = a.split(' ');
    const [bm, bd] = b.split(' ');
    const ai = months.indexOf(am) * 100 + parseInt(ad);
    const bi = months.indexOf(bm) * 100 + parseInt(bd);
    return ai - bi;
  });

  if (allDates.length === 0) return <div style={{ color: C.muted }}>No timeline data</div>;

  const dateToX = (date: string) => {
    const idx = allDates.indexOf(date);
    return idx >= 0 ? idx : 0;
  };

  const laneHeight = 32;
  const laneGap = 8;
  const labelWidth = 120;
  const chartWidth = 700;
  const totalHeight = data.timeline.length * (laneHeight + laneGap) + 30;
  const dateRange = allDates.length - 1 || 1;

  const PROJECT_COLORS = [
    'var(--theme-cyan)', 'var(--theme-emerald)', 'var(--theme-amber)', '#a78bfa',
    'var(--theme-rose)', '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>Project Activity Timeline</h3>
      <div className="overflow-x-auto">
        <svg width={chartWidth + labelWidth + 20} height={totalHeight} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 20} ${totalHeight}`}>
          {/* X-axis date labels */}
          {allDates.filter((_, i) => i % Math.max(1, Math.floor(allDates.length / 8)) === 0 || i === allDates.length - 1).map(date => {
            const x = labelWidth + (dateToX(date) / dateRange) * chartWidth;
            return <text key={date} x={x} y={totalHeight - 4} fill={C.muted} fontSize={9} textAnchor="middle">{date}</text>;
          })}

          {/* Swim lanes */}
          {data.timeline.map((row, i) => {
            const y = i * (laneHeight + laneGap) + 4;
            const x1 = labelWidth + (dateToX(row.firstDate) / dateRange) * chartWidth;
            const x2 = labelWidth + (dateToX(row.lastDate) / dateRange) * chartWidth;
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
            return (
              <g key={row.projectId}>
                <text x={labelWidth - 8} y={y + laneHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{row.projectName}</text>
                {/* Lane bar */}
                <rect x={x1} y={y + 4} width={Math.max(x2 - x1, 4)} height={laneHeight - 8} rx={4} fill={color} opacity={0.2} />
                {/* Session dots */}
                {row.sessionDates.map((date, di) => {
                  const dx = labelWidth + (dateToX(date) / dateRange) * chartWidth;
                  return <circle key={di} cx={dx} cy={y + laneHeight / 2} r={3} fill={color} opacity={0.9} />;
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  Feature: '#22d3ee',
  Bug: '#f43f5e',
  Refactor: '#a78bfa',
  UX: '#f59e0b',
  Tooling: '#34d399',
  Testing: '#818cf8',
  Docs: '#94a3b8',
  Scripting: '#34d399',
  Data: '#60a5fa',
  'Local-Tooling': '#34d399',
  Planning: '#fbbf24',
};

function WorkMixSection({ data }: SectionProps) {
  const totalBlocks = Object.values(data.workMix.aggregate).reduce((s, n) => s + n, 0);
  const sortedAggregate = Object.entries(data.workMix.aggregate).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>Work Category Distribution</h3>

      {/* Aggregate bar */}
      <div className="mb-4">
        <div className="mb-1 text-xs" style={{ color: C.muted }}>Portfolio aggregate ({totalBlocks} blocks)</div>
        <div className="flex rounded-md overflow-hidden" style={{ height: 28 }}>
          {sortedAggregate.map(([cat, count]) => (
            <div
              key={cat}
              style={{
                width: `${(count / totalBlocks) * 100}%`,
                backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                minWidth: count > 0 ? 4 : 0,
                transition: 'width 0.5s ease',
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {sortedAggregate.map(([cat, count]) => (
            <div key={cat} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.muted }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8' }} />
              {cat}: {Math.round((count / totalBlocks) * 100)}%
            </div>
          ))}
        </div>
      </div>

      {/* Per-project stacked bars */}
      <div className="space-y-3">
        {data.workMix.perProject.map(row => {
          const projectTotal = Object.values(row.categories).reduce((s, n) => s + n, 0);
          if (projectTotal === 0) return null;
          const sorted = Object.entries(row.categories).sort((a, b) => b[1] - a[1]);
          return (
            <div key={row.projectId}>
              <div className="mb-1 text-xs" style={{ color: C.muted }}>{row.projectName}</div>
              <div className="flex rounded-md overflow-hidden" style={{ height: 20 }}>
                {sorted.map(([cat, count]) => (
                  <div
                    key={cat}
                    style={{
                      width: `${(count / projectTotal) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                      minWidth: count > 0 ? 3 : 0,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BugTrendsSection({ data, setTooltip }: SectionProps) {
  if (data.bugTrends.length === 0) {
    return (
      <div>
        <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>Bug Discovery Rate</h3>
        <div className="text-xs" style={{ color: C.muted }}>No bug data available across projects.</div>
      </div>
    );
  }

  const maxAge = Math.max(...data.bugTrends.flatMap(b => b.rateByAge.map(p => p.sessionAge)), 1);
  const maxBugs = Math.max(...data.bugTrends.flatMap(b => b.rateByAge.map(p => p.bugsPerSession)), 1);
  const chartW = 700;
  const chartH = 220;
  const pad = { left: 40, right: 20, top: 16, bottom: 28 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = chartH - pad.top - pad.bottom;

  const PROJECT_COLORS = [
    'var(--theme-cyan)', 'var(--theme-emerald)', 'var(--theme-amber)', '#a78bfa',
    'var(--theme-rose)', '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: C.white }}>Bug Discovery Rate by Session Age</h3>
      <div className="overflow-x-auto">
        <svg width={chartW} height={chartH} className="w-full" viewBox={`0 0 ${chartW} ${chartH}`}>
          {/* Y-axis labels */}
          {[0, Math.ceil(maxBugs / 2), maxBugs].map(v => {
            const y = pad.top + innerH - (v / maxBugs) * innerH;
            return (
              <g key={v}>
                <line x1={pad.left} y1={y} x2={chartW - pad.right} y2={y} stroke={C.border} strokeWidth={0.5} />
                <text x={pad.left - 6} y={y + 3} textAnchor="end" fill={C.muted} fontSize={9}>{v}</text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {Array.from({ length: Math.min(maxAge, 10) }, (_, i) => {
            const age = Math.round(((i + 1) / 10) * maxAge);
            const x = pad.left + (age / maxAge) * innerW;
            return <text key={age} x={x} y={chartH - 4} fill={C.muted} fontSize={9} textAnchor="middle">{age}</text>;
          })}

          {/* Lines per project */}
          {data.bugTrends.map((trend, ti) => {
            const color = PROJECT_COLORS[ti % PROJECT_COLORS.length];
            const points = trend.rateByAge.map(p => ({
              x: pad.left + (p.sessionAge / maxAge) * innerW,
              y: pad.top + innerH - (p.bugsPerSession / maxBugs) * innerH,
            }));
            if (points.length < 2) return null;
            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            return (
              <g key={trend.projectId}>
                <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} opacity={0.8} />
                {points.map((p, pi) => (
                  <circle
                    key={pi}
                    cx={p.x}
                    cy={p.y}
                    r={2.5}
                    fill={color}
                    opacity={trend.rateByAge[pi].bugsPerSession > 0 ? 1 : 0.3}
                    onMouseEnter={(e) => setTooltip?.({ x: e.clientX, y: e.clientY, content: (
                      <div className="text-xs">
                        <span style={{ color }}>{trend.projectName}</span>
                        <span style={{ color: C.muted }}> — Session {trend.rateByAge[pi].sessionAge}: {trend.rateByAge[pi].bugsPerSession} bugs</span>
                      </div>
                    )})}
                    onMouseLeave={() => setTooltip?.(null)}
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {data.bugTrends.map((trend, ti) => (
          <div key={trend.projectId} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: PROJECT_COLORS[ti % PROJECT_COLORS.length] }} />
            {trend.projectName}
          </div>
        ))}
      </div>
    </div>
  );
}
