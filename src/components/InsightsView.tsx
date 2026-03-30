import { useMemo, useState, type ReactNode } from 'react';
import { C } from './MetricsCard';
import type { InsightsData, ProjectBundle } from '../utils/insightsData';
import { computeInsights } from '../utils/insightsData';
import { chapters, PORTFOLIO_HEADLINE, type ChapterId } from '../utils/insightsNarrative';

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

const CHAPTER_ORDER: ChapterId[] = ['theStory', 'whatWeLearned', 'byTheNumbers', 'forTeams', 'fromTheAI'];

// ── Color constants ────────────────────────────────────────────────────────

const PROJECT_COLORS = [
  'var(--theme-cyan)', 'var(--theme-emerald)', 'var(--theme-amber)', '#a78bfa',
  'var(--theme-rose)', '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
];

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

const CATEGORY_COLORS: Record<string, string> = {
  Feature: '#22d3ee', Bug: '#f43f5e', Refactor: '#a78bfa', UX: '#f59e0b',
  Tooling: '#34d399', Testing: '#818cf8', Docs: '#94a3b8', Scripting: '#34d399',
  Data: '#60a5fa', 'Local-Tooling': '#34d399', Planning: '#fbbf24',
};

const PHASE_COLORS: Record<string, string> = {
  'Build-time': '#60a5fa',
  'Interaction': '#f59e0b',
  'Code Quality': '#a78bfa',
  'Systemic': '#f43f5e',
  'Integration': '#22d3ee',
};

// ── Prose renderer (converts **bold** to <strong>) ─────────────────────────

function renderProse(prose: string): ReactNode[] {
  const parts = prose.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: C.white }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Main Component ─────────────────────────────────────────────────────────

interface InsightsViewProps {
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function InsightsView({ setTooltip }: InsightsViewProps) {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('theStory');
  const data = useMemo(() => computeInsights(ALL_BUNDLES), []);
  const chapter = chapters[activeChapter];

  return (
    <div className="space-y-4">
      {/* Narrative headline */}
      <div className="text-center py-3">
        <p className="text-base font-medium" style={{ color: C.white }}>{PORTFOLIO_HEADLINE}</p>
      </div>

      {/* Compact stat row */}
      <div className="flex justify-center gap-6 text-xs" style={{ color: C.muted }}>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalProjects}</strong> projects</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalLoc.toLocaleString()}</strong> LOC</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalHours}</strong> hours</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalPrs}</strong> PRs</span>
        <span><strong style={{ color: C.white }}>{data.portfolio.totalBlocks}</strong> blocks</span>
      </div>

      {/* Chapter tabs — pill buttons */}
      <div className="flex gap-2 flex-wrap">
        {CHAPTER_ORDER.map(id => {
          const ch = chapters[id];
          const isActive = activeChapter === id;
          return (
            <button
              key={id}
              onClick={() => setActiveChapter(id)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition"
              style={{
                backgroundColor: isActive ? 'var(--theme-cyan)' : C.cardBg,
                color: isActive ? '#0f172a' : C.muted,
                border: `1px solid ${isActive ? 'var(--theme-cyan)' : C.border}`,
              }}
            >
              {ch.title}
            </button>
          );
        })}
      </div>

      {/* Chapter content */}
      <div className="rounded-xl border p-6" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        {chapter.intro && (
          <p className="text-sm mb-6" style={{ color: C.muted, lineHeight: 1.7 }}>{chapter.intro}</p>
        )}

        <div className="space-y-8">
          {chapter.sections.map(section => (
            <div key={section.id}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: C.white }}>{section.heading}</h3>
              <div className="text-xs leading-relaxed whitespace-pre-line" style={{ color: C.muted, lineHeight: 1.7 }}>
                {renderProse(section.prose)}
              </div>
              {section.disclaimer && (
                <div className="mt-2 text-[10px] italic px-3 py-2 rounded" style={{ color: C.muted, backgroundColor: C.bg, borderLeft: '3px solid var(--theme-amber)' }}>
                  {section.disclaimer}
                </div>
              )}
              {section.sources && section.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {section.sources.map((src, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: C.bg, color: C.muted }}>
                      {src.label}{src.note ? ` — ${src.note}` : ''}
                    </span>
                  ))}
                </div>
              )}
              {section.chartKey && (
                <div className="mt-4">
                  <ChartRenderer chartKey={section.chartKey} data={data} setTooltip={setTooltip} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Chart Dispatcher ───────────────────────────────────────────────────────

interface ChartProps {
  data: InsightsData;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

function ChartRenderer({ chartKey, data, setTooltip }: ChartProps & { chartKey: string }) {
  switch (chartKey) {
    case 'projectTimeline': return <TimelineChart data={data} setTooltip={setTooltip} />;
    case 'locPerHour': return <VelocityChart data={data} setTooltip={setTooltip} />;
    case 'driverBreakdown': return <DriverChart data={data} setTooltip={setTooltip} />;
    case 'workMix': return <WorkMixChart data={data} setTooltip={setTooltip} />;
    case 'bugLifecycle': return <BugLifecycleChart data={data} setTooltip={setTooltip} />;
    case 'realMultiplier': return <MultiplierChart data={data} setTooltip={setTooltip} />;
    case 'velocityVsQuality': return <VelocityQualityChart data={data} setTooltip={setTooltip} />;
    case 'testingImpact': return <TestingImpactChart data={data} setTooltip={setTooltip} />;
    case 'toolTransitionBugs': return <ToolTransitionChart data={data} setTooltip={setTooltip} />;
    case 'lifecyclePhases': return <LifecyclePhasesChart data={data} setTooltip={setTooltip} />;
    default: return null;
  }
}

// ── 1. TimelineChart ───────────────────────────────────────────────────────

function TimelineChart({ data }: ChartProps) {
  const allDates = Array.from(new Set(data.timeline.flatMap(r => [r.firstDate, r.lastDate, ...r.sessionDates]))).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [am, ad] = a.split(' ');
    const [bm, bd] = b.split(' ');
    return (months.indexOf(am) * 100 + parseInt(ad)) - (months.indexOf(bm) * 100 + parseInt(bd));
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

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth + labelWidth + 20} height={totalHeight} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 20} ${totalHeight}`}>
        {allDates.filter((_, i) => i % Math.max(1, Math.floor(allDates.length / 8)) === 0 || i === allDates.length - 1).map(date => {
          const x = labelWidth + (dateToX(date) / dateRange) * chartWidth;
          return <text key={date} x={x} y={totalHeight - 4} fill={C.muted} fontSize={9} textAnchor="middle">{date}</text>;
        })}
        {data.timeline.map((row, i) => {
          const y = i * (laneHeight + laneGap) + 4;
          const x1 = labelWidth + (dateToX(row.firstDate) / dateRange) * chartWidth;
          const x2 = labelWidth + (dateToX(row.lastDate) / dateRange) * chartWidth;
          const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
          return (
            <g key={row.projectId}>
              <text x={labelWidth - 8} y={y + laneHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{row.projectName}</text>
              <rect x={x1} y={y + 4} width={Math.max(x2 - x1, 4)} height={laneHeight - 8} rx={4} fill={color} opacity={0.2} />
              {row.sessionDates.map((date, di) => {
                const dx = labelWidth + (dateToX(date) / dateRange) * chartWidth;
                return <circle key={di} cx={dx} cy={y + laneHeight / 2} r={3} fill={color} opacity={0.9} />;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── 2. VelocityChart ───────────────────────────────────────────────────────

function VelocityChart({ data, setTooltip }: ChartProps) {
  const maxLoc = Math.max(...data.velocity.map(v => v.locPerHour), 1);
  const barHeight = 28;
  const labelWidth = 130;
  const chartWidth = 700;

  return (
    <div>
      <svg width={chartWidth + labelWidth + 80} height={data.velocity.length * (barHeight + 8) + 8} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 80} ${data.velocity.length * (barHeight + 8) + 8}`}>
        {data.velocity.map((row, i) => {
          const y = i * (barHeight + 8) + 4;
          const barW = maxLoc > 0 ? (row.locPerHour / maxLoc) * chartWidth : 0;
          const label = row.hasEstimatedHours ? `${row.projectName} †` : row.projectName;
          return (
            <g key={row.projectId}
              onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: (
                <div className="text-xs space-y-1">
                  <div style={{ color: C.white }} className="font-medium">{row.projectName}{row.hasEstimatedHours ? ' (estimated hours)' : ''}</div>
                  <div style={{ color: C.muted }}>{row.locPerHour.toLocaleString()} LOC/hr | {row.totalHours}h total | {row.prsPerSession} PRs/session</div>
                </div>
              )})}
              onMouseLeave={() => setTooltip(null)}
            >
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={12}>{label}</text>
              <rect x={labelWidth} y={y} width={barW} height={barHeight} rx={4} fill="var(--theme-cyan)" opacity={0.8} />
              <text x={labelWidth + barW + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={11}>{row.locPerHour.toLocaleString()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── 3. DriverChart ─────────────────────────────────────────────────────────

function DriverChart({ data }: ChartProps) {
  const drivers = Object.entries(data.drivers).sort((a, b) => b[1].totalLoc - a[1].totalLoc);
  const maxLoc = Math.max(...drivers.map(([, s]) => s.totalLoc), 1);

  return (
    <div className="space-y-4">
      {drivers.map(([driver, stats]) => {
        const color = DRIVER_COLORS[driver] ?? C.muted;
        const label = DRIVER_LABELS[driver] ?? driver;
        const barPct = maxLoc > 0 ? (stats.totalLoc / maxLoc) * 100 : 0;
        return (
          <div key={driver}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
              <span className="text-xs" style={{ color: C.muted }}>{stats.blockCount} blocks</span>
            </div>
            <div className="h-5 rounded-md overflow-hidden" style={{ backgroundColor: C.bg }}>
              <div className="h-full rounded-md transition-all" style={{ width: `${barPct}%`, backgroundColor: color, opacity: 0.8 }} />
            </div>
            <div className="mt-1 flex gap-4 text-[10px]" style={{ color: C.muted }}>
              <span>{stats.totalLoc.toLocaleString()} LOC</span>
              <span>{Math.round(stats.totalHours)}h</span>
              <span>{stats.bugsPerBlock} bugs/block</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 4. WorkMixChart ────────────────────────────────────────────────────────

function WorkMixChart({ data }: ChartProps) {
  const totalBlocks = Object.values(data.workMix.aggregate).reduce((s, n) => s + n, 0);
  const sortedAggregate = Object.entries(data.workMix.aggregate).sort((a, b) => b[1] - a[1]);

  return (
    <div>
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
                borderRight: '1px solid #0f172a',
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
                      borderRight: '1px solid #0f172a',
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

// ── 5. BugLifecycleChart ───────────────────────────────────────────────────

function BugLifecycleChart({ data, setTooltip }: ChartProps) {
  const projects = data.bugSummaries.filter(p => p.totalBugs > 0);
  if (projects.length === 0) return <div className="text-xs" style={{ color: C.muted }}>No bug data available.</div>;

  const maxBugs = Math.max(...projects.map(p => p.totalBugs), 1);
  const barHeight = 24;
  const labelWidth = 120;
  const chartWidth = 500;
  const phaseOrder: string[] = ['Build-time', 'Interaction', 'Code Quality', 'Systemic', 'Integration'];

  return (
    <div>
      <svg width={chartWidth + labelWidth + 60} height={projects.length * (barHeight + 8) + 40} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 60} ${projects.length * (barHeight + 8) + 40}`}>
        {projects.map((proj, i) => {
          const y = i * (barHeight + 8) + 4;
          let xOffset = labelWidth;
          return (
            <g key={proj.projectId}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{proj.projectName}</text>
              {phaseOrder.map(phase => {
                const p = proj.phases.find(ph => ph.phase === phase);
                if (!p || p.bugCount === 0) return null;
                const w = (p.bugCount / maxBugs) * chartWidth;
                const x = xOffset;
                xOffset += w;
                return (
                  <rect
                    key={phase}
                    x={x} y={y} width={w} height={barHeight} rx={2}
                    fill={PHASE_COLORS[phase] ?? C.muted}
                    opacity={0.85}
                    onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: (
                      <div className="text-xs">
                        <span style={{ color: C.white }}>{proj.projectName}</span>
                        <span style={{ color: C.muted }}> — {phase}: {p.bugCount} bugs</span>
                      </div>
                    )})}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
              <text x={xOffset + 6} y={y + barHeight / 2 + 4} fill={C.muted} fontSize={10}>{proj.totalBugs}</text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {phaseOrder.map(phase => (
          <div key={phase} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: PHASE_COLORS[phase] }} />
            {phase}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 6. MultiplierChart ─────────────────────────────────────────────────────

function MultiplierChart({ data }: ChartProps) {
  return (
    <div className="space-y-3">
      {data.researchComparisons.map((row, i) => (
        <div key={i} className="rounded-lg border p-3" style={{ backgroundColor: C.bg, borderColor: C.border }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--theme-amber)' }}>{row.source}</div>
          <div className="text-xs mb-1" style={{ color: C.muted }}><strong style={{ color: C.white }}>Finding:</strong> {row.finding}</div>
          <div className="text-xs" style={{ color: C.muted }}><strong style={{ color: C.white }}>Our result:</strong> {row.ourResult}</div>
        </div>
      ))}
    </div>
  );
}

// ── 7. VelocityQualityChart ────────────────────────────────────────────────

function VelocityQualityChart({ data, setTooltip }: ChartProps) {
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
  const pad = { left: 50, right: 20, top: 20, bottom: 40 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = chartH - pad.top - pad.bottom;

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

        {/* Dots */}
        {points.map((p, i) => {
          const x = pad.left + (p.locPerSession / maxX) * innerW;
          const y = pad.top + innerH - (p.bugsPer100 / maxY) * innerH;
          const r = 4 + (p.totalHours / maxHours) * 10;
          return (
            <circle
              key={i}
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
          );
        })}
      </svg>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            {p.projectName}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 8. TestingImpactChart ──────────────────────────────────────────────────

function TestingImpactChart({ data }: ChartProps) {
  const withTests = ['item-b-gone', 'note-worthy', 'on-the-move'];
  const withoutTests = ['meta-tracker', 'bip'];

  const getGroup = (ids: string[], label: string) => {
    const projects = data.bugSummaries.filter(b => ids.includes(b.projectId));
    const totalBugs = projects.reduce((s, p) => s + p.totalBugs, 0);
    return { label, projects, totalBugs };
  };

  const groups = [
    getGroup(withTests, 'With Playwright Tests'),
    getGroup(withoutTests, 'Without Playwright Tests'),
  ];

  const maxBugs = Math.max(...groups.flatMap(g => g.projects.map(p => p.totalBugs)), 1);
  const barHeight = 22;
  const labelWidth = 140;
  const chartWidth = 400;

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.label}>
          <div className="text-xs font-medium mb-2" style={{ color: group.label.includes('With') ? 'var(--theme-emerald)' : 'var(--theme-rose)' }}>
            {group.label} — {group.totalBugs} total bugs
          </div>
          <svg width={chartWidth + labelWidth + 40} height={group.projects.length * (barHeight + 6) + 4} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 40} ${group.projects.length * (barHeight + 6) + 4}`}>
            {group.projects.map((proj, i) => {
              const y = i * (barHeight + 6) + 2;
              const w = (proj.totalBugs / maxBugs) * chartWidth;
              const color = group.label.includes('With') ? 'var(--theme-emerald)' : 'var(--theme-rose)';
              return (
                <g key={proj.projectId}>
                  <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{proj.projectName}</text>
                  <rect x={labelWidth} y={y} width={w} height={barHeight} rx={3} fill={color} opacity={0.7} />
                  <text x={labelWidth + w + 6} y={y + barHeight / 2 + 4} fill={C.muted} fontSize={10}>{proj.totalBugs}</text>
                </g>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── 9. ToolTransitionChart ─────────────────────────────────────────────────

function ToolTransitionChart({ data }: ChartProps) {
  const mt = data.bugSummaries.find(b => b.projectId === 'meta-tracker');
  if (!mt || mt.phases.length === 0) return <div className="text-xs" style={{ color: C.muted }}>No Meta Tracker bug data.</div>;

  const maxBugs = Math.max(...mt.phases.map(p => p.bugCount), 1);
  const barHeight = 28;
  const labelWidth = 100;
  const chartWidth = 400;

  return (
    <div>
      <div className="text-xs mb-2" style={{ color: C.muted }}>Meta Tracker bugs by phase — highlighting integration regressions from tool transitions</div>
      <svg width={chartWidth + labelWidth + 60} height={mt.phases.length * (barHeight + 8) + 4} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 60} ${mt.phases.length * (barHeight + 8) + 4}`}>
        {mt.phases.map((phase, i) => {
          const y = i * (barHeight + 8) + 2;
          const w = (phase.bugCount / maxBugs) * chartWidth;
          const color = PHASE_COLORS[phase.phase] ?? C.muted;
          return (
            <g key={phase.phase}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{phase.phase}</text>
              <rect x={labelWidth} y={y} width={w} height={barHeight} rx={3} fill={color} opacity={0.85} />
              <text x={labelWidth + w + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={11}>{phase.bugCount}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── 10. LifecyclePhasesChart ───────────────────────────────────────────────

function LifecyclePhasesChart({ data }: ChartProps) {
  return (
    <div className="space-y-3">
      {data.workMix.perProject.map((row, pi) => {
        const projectTotal = Object.values(row.categories).reduce((s, n) => s + n, 0);
        if (projectTotal === 0) return null;
        const sorted = Object.entries(row.categories).sort((a, b) => b[1] - a[1]);
        return (
          <div key={row.projectId}>
            <div className="mb-1 text-xs" style={{ color: PROJECT_COLORS[pi % PROJECT_COLORS.length] }}>{row.projectName}</div>
            <div className="flex rounded-md overflow-hidden" style={{ height: 20 }}>
              {sorted.map(([cat, count]) => (
                <div
                  key={cat}
                  style={{
                    width: `${(count / projectTotal) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                    minWidth: count > 0 ? 3 : 0,
                    borderRight: '1px solid #0f172a',
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-3">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
