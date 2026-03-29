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
  return <div style={{ color: C.muted }}>Velocity detail loading...</div>;
}

function EstimatesSection({ data }: SectionProps) {
  return <div style={{ color: C.muted }}>Estimates detail loading...</div>;
}

function DriversSection({ data }: SectionProps) {
  return <div style={{ color: C.muted }}>Drivers detail loading...</div>;
}

function TimelineSection({ data }: SectionProps) {
  return <div style={{ color: C.muted }}>Timeline detail loading...</div>;
}

function WorkMixSection({ data }: SectionProps) {
  return <div style={{ color: C.muted }}>Work Mix detail loading...</div>;
}

function BugTrendsSection({ data, setTooltip }: SectionProps) {
  return <div style={{ color: C.muted }}>Bug Trends detail loading...</div>;
}
