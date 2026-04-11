import type { CodeVolumeEntry, SessionEntry, BugEntry } from '../data/bipMetrics';
import type { DayEntry, WorkCategory, Project } from '../types/index';

// ── Types ──────────────────────────────────────────────────────────────────

export interface VelocityRow {
  projectId: string;
  projectName: string;
  locPerHour: number;
  prsPerSession: number;
  totalHours: number;
  totalLoc: number;
  hasEstimatedHours: boolean;
}

export interface DriverStats {
  totalLoc: number;
  totalHours: number;
  blockCount: number;
  bugsPerBlock: number;
}

export interface TimelineRow {
  projectId: string;
  projectName: string;
  firstDate: string;
  lastDate: string;
  sessionDates: string[];
}

export interface WorkMixRow {
  projectId: string;
  projectName: string;
  categories: Partial<Record<WorkCategory, number>>;
}

export interface BugLifecyclePhase {
  phase: 'Build-time' | 'Interaction' | 'Code Quality' | 'Systemic' | 'Integration';
  sessionRange: string;
  bugCount: number;
  description: string;
}

export interface BugProjectSummary {
  projectId: string;
  projectName: string;
  totalBugs: number;
  phases: BugLifecyclePhase[];
}

export interface ResearchComparison {
  source: string;
  finding: string;
  ourResult: string;
}

export interface PortfolioTotals {
  totalProjects: number;
  totalLoc: number;
  totalHours: number;
  totalPrs: number;
  totalBugsFixed: number;
  totalDays: number;
  totalBlocks: number;
}

export interface InsightsData {
  portfolio: PortfolioTotals;
  velocity: VelocityRow[];
  drivers: Record<string, DriverStats>;
  timeline: TimelineRow[];
  workMix: { aggregate: Partial<Record<WorkCategory, number>>; perProject: WorkMixRow[] };
  bugSummaries: BugProjectSummary[];
  researchComparisons: ResearchComparison[];
}

// ── Project data bundle type ───────────────────────────────────────────────

export interface ProjectBundle {
  project: Project;
  codeVolume: CodeVolumeEntry[];
  sessions: SessionEntry[];
  bugs: BugEntry[];
  days: DayEntry[];
}

// ── Projects with estimated hours (flagged in UI) ──────────────────────────

const ESTIMATED_HOURS_PROJECTS = new Set(['item-b-gone']);

// ── Day-derived aggregates (source of truth for portfolio totals) ──────────
// Legacy *CodeVolume and *Sessions arrays are stale for 6 of 9 projects since
// ~Mar 23, so portfolio totals must be derived from *Days blocks, which are
// the only structures maintained across all projects.

interface BundleAggregates {
  totalLoc: number;
  totalHours: number;
  totalBlocks: number;
  totalPrs: number;
  firstDate: string;
  lastDate: string;
  dayDates: string[];
}

const PR_NUMBER_REGEX = /\bPRs?\s*#?(\d+)/gi;

function collectPrNumbers(bundle: ProjectBundle): Set<number> {
  const prs = new Set<number>();
  const scan = (text?: string) => {
    if (!text) return;
    for (const m of text.matchAll(PR_NUMBER_REGEX)) prs.add(Number(m[1]));
  };
  for (const day of bundle.days) {
    for (const block of day.blocks) scan(block.note);
  }
  for (const bug of bundle.bugs) {
    scan(bug.status);
    scan(bug.source);
  }
  return prs;
}

function aggregateFromDays(bundle: ProjectBundle): BundleAggregates {
  // totalLoc uses gross lines added (not net) — a productivity metric, so
  // refactors/cleanups are counted as work, not subtracted from output.
  // This also avoids going negative on projects with heavy churn (e.g. IBG's
  // data.json history).
  let totalLoc = 0;
  let totalMinutes = 0;
  let totalBlocks = 0;
  for (const day of bundle.days) {
    for (const block of day.blocks) {
      totalLoc += block.linesAdded ?? 0;
      totalMinutes += block.timeMinutes ?? 0;
      totalBlocks += 1;
    }
  }
  const dayDates = bundle.days.map(d => d.date);
  const firstDate = dayDates[0] ?? '';
  const lastDate = dayDates[dayDates.length - 1] ?? '';
  return {
    totalLoc,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    totalBlocks,
    totalPrs: collectPrNumbers(bundle).size,
    firstDate,
    lastDate,
    dayDates,
  };
}

// ── Research comparisons (evidence-backed) ─────────────────────────────────

const RESEARCH_COMPARISONS: ResearchComparison[] = [
  {
    source: 'ISBSG 2026',
    finding: 'Developers perceive 24% speed increase; measured outcomes are mixed',
    ourResult: 'Portfolio built in ~206h across 9 projects — estimated 2–3x faster than solo traditional development',
  },
  {
    source: 'Cortex 2026 Benchmark',
    finding: 'AI-assisted teams deliver faster but with higher change failure rate',
    ourResult: '74 bugs across ~74K LOC (0.10 bugs/100 LOC). Most fixed, a few deferred. Higher early-stage bug rate, lower late-stage.',
  },
  {
    source: 'Portfolio self-assessment',
    finding: 'Honest multiplier range: 2–3x with ~20–30% higher long-term maintenance cost',
    ourResult: 'Based on actual hours vs comparable solo projects, excluding unmeasured human review/design time',
  },
];

// ── Bug lifecycle classification ───────────────────────────────────────────

function classifyBugPhase(bug: BugEntry, sessionIndex: number, totalSessions: number): BugLifecyclePhase['phase'] {
  const position = totalSessions > 0 ? sessionIndex / totalSessions : 0;
  const desc = (bug.summary ?? '').toLowerCase();

  // Heuristic classification based on bug description and position
  if (desc.includes('build') || desc.includes('import') || desc.includes('missing dep') || desc.includes('crash on load')) return 'Build-time';
  if (desc.includes('layout') || desc.includes('click') || desc.includes('scroll') || desc.includes('hover') || desc.includes('ux')) return 'Interaction';
  if (desc.includes('mojibake') || desc.includes('dead code') || desc.includes('unused') || desc.includes('duplicate') || desc.includes('perf')) return 'Code Quality';
  if (desc.includes('audit') || desc.includes('migration') || desc.includes('rearchitect') || desc.includes('data model')) return 'Systemic';
  if (desc.includes('regression') || desc.includes('removed') || desc.includes('broke') || desc.includes('missing prop')) return 'Integration';

  // Fallback: position-based
  if (position < 0.15) return 'Build-time';
  if (position < 0.4) return 'Interaction';
  if (position < 0.6) return 'Code Quality';
  if (position < 0.8) return 'Systemic';
  return 'Integration';
}

// ── Compute ────────────────────────────────────────────────────────────────

export function computeInsights(bundles: ProjectBundle[]): InsightsData {
  // Pre-compute day-based aggregates once per bundle
  const aggregates = new Map<string, BundleAggregates>();
  for (const b of bundles) aggregates.set(b.project.id, aggregateFromDays(b));
  const agg = (id: string) => aggregates.get(id)!;

  // Portfolio totals — all derived from *Days blocks (correctness bug fix, Task #95)
  const portfolio: PortfolioTotals = {
    totalProjects: bundles.length,
    totalLoc: bundles.reduce((sum, b) => sum + agg(b.project.id).totalLoc, 0),
    totalHours: Math.round(bundles.reduce((sum, b) => sum + agg(b.project.id).totalHours, 0) * 10) / 10,
    totalPrs: bundles.reduce((sum, b) => sum + agg(b.project.id).totalPrs, 0),
    totalBugsFixed: bundles.reduce((sum, b) =>
      sum + b.bugs.filter(bug => bug.status.toLowerCase().startsWith('fixed')).length, 0),
    totalDays: new Set(bundles.flatMap(b => b.days.map(d => d.date))).size,
    totalBlocks: bundles.reduce((sum, b) => sum + agg(b.project.id).totalBlocks, 0),
  };

  // Velocity — per-project totals from day aggregates
  const velocity: VelocityRow[] = bundles.map(b => {
    const a = agg(b.project.id);
    const blockCount = a.totalBlocks;
    return {
      projectId: b.project.id,
      projectName: b.project.name,
      locPerHour: a.totalHours > 0 ? Math.round(a.totalLoc / a.totalHours) : 0,
      prsPerSession: blockCount > 0 ? Math.round((a.totalPrs / blockCount) * 10) / 10 : 0,
      totalHours: a.totalHours,
      totalLoc: a.totalLoc,
      hasEstimatedHours: ESTIMATED_HOURS_PROJECTS.has(b.project.id),
    };
  }).sort((a, b) => b.locPerHour - a.locPerHour);

  // Drivers — aggregate from DayEntry blocks
  const driverMap: Record<string, DriverStats> = {};
  const driverBugCounts: Record<string, number> = {};
  for (const b of bundles) {
    for (const day of b.days) {
      for (const block of day.blocks) {
        const d = block.driver === 'ai' ? 'agent-led' : block.driver;
        if (!driverMap[d]) driverMap[d] = { totalLoc: 0, totalHours: 0, blockCount: 0, bugsPerBlock: 0 };
        driverMap[d].totalLoc += (block.linesAdded ?? 0);
        driverMap[d].totalHours += (block.timeMinutes ?? 0) / 60;
        driverMap[d].blockCount += 1;
      }
    }
    // Attribute each bug to a day-block driver (match by block.label first, then session number in id)
    const allBlocks = b.days.flatMap(d => d.blocks);
    for (const bug of b.bugs) {
      const sessionNum = bug.session.match(/\d+/)?.[0];
      const match = allBlocks.find(bl => bl.label === bug.label)
        ?? (sessionNum ? allBlocks.find(bl => bl.id.endsWith(`-${sessionNum}`) || bl.id.includes(`session-${sessionNum}`)) : undefined);
      const rawDriver = match?.driver ?? 'collaborative';
      const d = rawDriver === 'ai' ? 'agent-led' : rawDriver;
      driverBugCounts[d] = (driverBugCounts[d] ?? 0) + 1;
    }
  }
  for (const [d, stats] of Object.entries(driverMap)) {
    stats.bugsPerBlock = stats.blockCount > 0
      ? Math.round(((driverBugCounts[d] ?? 0) / stats.blockCount) * 100) / 100
      : 0;
  }

  // Timeline — derived from days
  const timeline: TimelineRow[] = bundles
    .map(b => {
      const a = agg(b.project.id);
      return {
        projectId: b.project.id,
        projectName: b.project.name,
        firstDate: a.firstDate,
        lastDate: a.lastDate,
        sessionDates: a.dayDates,
      };
    })
    .filter(r => r.firstDate !== '');

  // Work Mix
  const aggregateMix: Partial<Record<WorkCategory, number>> = {};
  const perProject: WorkMixRow[] = bundles.map(b => {
    const cats: Partial<Record<WorkCategory, number>> = {};
    for (const day of b.days) {
      for (const block of day.blocks) {
        cats[block.workCategory] = (cats[block.workCategory] ?? 0) + 1;
        aggregateMix[block.workCategory] = (aggregateMix[block.workCategory] ?? 0) + 1;
      }
    }
    return { projectId: b.project.id, projectName: b.project.name, categories: cats };
  });

  // Bug summaries with lifecycle phases — position derived from bug index in its
  // own array (bugs are authored in chronological order per project data files)
  const bugSummaries: BugProjectSummary[] = bundles
    .filter(b => b.bugs.length > 0)
    .map(b => {
      const phaseCounts: Record<BugLifecyclePhase['phase'], number> = {
        'Build-time': 0, 'Interaction': 0, 'Code Quality': 0, 'Systemic': 0, 'Integration': 0,
      };
      for (let i = 0; i < b.bugs.length; i++) {
        const phase = classifyBugPhase(b.bugs[i], i, b.bugs.length);
        phaseCounts[phase]++;
      }
      const allPhases: BugLifecyclePhase[] = [
        { phase: 'Build-time', sessionRange: 'Sessions 1–3', bugCount: phaseCounts['Build-time'], description: 'Missing deps, build failures, library conflicts' },
        { phase: 'Interaction', sessionRange: 'Sessions 4–11', bugCount: phaseCounts['Interaction'], description: 'Layout, events, UX issues found by users' },
        { phase: 'Code Quality', sessionRange: 'Sessions 12–16', bugCount: phaseCounts['Code Quality'], description: 'Mojibake, dead code, performance issues found by audit' },
        { phase: 'Systemic', sessionRange: 'Sessions 12–20', bugCount: phaseCounts['Systemic'], description: 'Data model issues, architecture gaps' },
        { phase: 'Integration', sessionRange: 'Sessions 20+', bugCount: phaseCounts['Integration'], description: 'Regressions from tool transitions and refactors' },
      ];
      const phases = allPhases.filter(p => p.bugCount > 0);

      return {
        projectId: b.project.id,
        projectName: b.project.name,
        totalBugs: b.bugs.length,
        phases,
      };
    });

  return {
    portfolio,
    velocity,
    drivers: driverMap,
    timeline,
    workMix: { aggregate: aggregateMix, perProject },
    bugSummaries,
    researchComparisons: RESEARCH_COMPARISONS,
  };
}
