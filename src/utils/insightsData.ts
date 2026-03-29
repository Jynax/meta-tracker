import type { CodeVolumeEntry, SessionEntry, BugEntry } from '../data/bipMetrics';
import type { DayEntry, WorkCategory, Project } from '../types/index';

// ── Types ──────────────────────────────────────────────────────────────────

export type ComplexityTier = 'Simple' | 'Standard' | 'Complex' | 'Specialized';

export interface VelocityRow {
  projectId: string;
  projectName: string;
  locPerHour: number;
  prsPerSession: number;
  sessionsToMvp: number;
  totalHours: number;
  totalLoc: number;
}

export interface EstimateRow {
  projectId: string;
  projectName: string;
  actualHours: number;
  traditionalHours: number;
  traditionalWeeks: number;
  tier: ComplexityTier;
}

export interface DriverStats {
  totalLoc: number;
  totalHours: number;
  bugsPerSession: number;
  sessionCount: number;
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

export interface BugTrendPoint {
  sessionAge: number;
  bugsPerSession: number;
}

export interface BugTrendRow {
  projectId: string;
  projectName: string;
  rateByAge: BugTrendPoint[];
}

export interface PortfolioTotals {
  totalProjects: number;
  totalLoc: number;
  totalHours: number;
  totalPrs: number;
  totalBugsFixed: number;
}

export interface InsightsData {
  portfolio: PortfolioTotals;
  velocity: VelocityRow[];
  estimates: EstimateRow[];
  drivers: Record<string, DriverStats>;
  timeline: TimelineRow[];
  workMix: { aggregate: Partial<Record<WorkCategory, number>>; perProject: WorkMixRow[] };
  bugTrends: BugTrendRow[];
}

// ── Project data bundle type ───────────────────────────────────────────────

export interface ProjectBundle {
  project: Project;
  codeVolume: CodeVolumeEntry[];
  sessions: SessionEntry[];
  bugs: BugEntry[];
  days: DayEntry[];
}

// ── Tier config ──────────────────────────────────────────────────────────

const TIER_CONFIG: Record<string, { tier: ComplexityTier; multiplier: number }> = {
  landing: { tier: 'Simple', multiplier: 4 },
  remnants: { tier: 'Simple', multiplier: 4 },
  meta: { tier: 'Standard', multiplier: 6.5 },
  bip: { tier: 'Standard', multiplier: 6.5 },
  'item-b-gone': { tier: 'Standard', multiplier: 6.5 },
  'feedback-capture': { tier: 'Standard', multiplier: 6.5 },
  'on-the-move': { tier: 'Complex', multiplier: 10 },
  'vuln-bank': { tier: 'Complex', multiplier: 10 },
  'note-worthy': { tier: 'Specialized', multiplier: 12.5 },
};

// ── Compute ────────────────────────────────────────────────────────────────

export function computeInsights(bundles: ProjectBundle[]): InsightsData {
  // Portfolio totals
  const portfolio: PortfolioTotals = {
    totalProjects: bundles.length,
    totalLoc: bundles.reduce((sum, b) => {
      const last = b.codeVolume[b.codeVolume.length - 1];
      return sum + (last?.total ?? 0);
    }, 0),
    totalHours: bundles.reduce((sum, b) =>
      sum + b.sessions.reduce((s, sess) => s + sess.duration, 0), 0),
    totalPrs: bundles.reduce((sum, b) =>
      sum + b.sessions.reduce((s, sess) => s + sess.prs, 0), 0),
    totalBugsFixed: bundles.reduce((sum, b) =>
      sum + b.bugs.filter(bug => bug.status.toLowerCase().startsWith('fixed')).length, 0),
  };

  // Velocity
  const velocity: VelocityRow[] = bundles.map(b => {
    const totalHours = b.sessions.reduce((s, sess) => s + sess.duration, 0);
    const lastVol = b.codeVolume[b.codeVolume.length - 1];
    const totalLoc = lastVol?.total ?? 0;
    const totalPrs = b.sessions.reduce((s, sess) => s + sess.prs, 0);
    const sessionCount = b.sessions.length;
    return {
      projectId: b.project.id,
      projectName: b.project.name,
      locPerHour: totalHours > 0 ? Math.round(totalLoc / totalHours) : 0,
      prsPerSession: sessionCount > 0 ? Math.round((totalPrs / sessionCount) * 10) / 10 : 0,
      sessionsToMvp: sessionCount,
      totalHours,
      totalLoc,
    };
  }).sort((a, b) => b.locPerHour - a.locPerHour);

  // Estimates
  const estimates: EstimateRow[] = bundles.map(b => {
    const actualHours = b.sessions.reduce((s, sess) => s + sess.duration, 0);
    const cfg = TIER_CONFIG[b.project.id] ?? { tier: 'Standard' as ComplexityTier, multiplier: 6.5 };
    const traditionalHours = actualHours * cfg.multiplier;
    return {
      projectId: b.project.id,
      projectName: b.project.name,
      actualHours,
      traditionalHours: Math.round(traditionalHours),
      traditionalWeeks: Math.round((traditionalHours / 40) * 10) / 10,
      tier: cfg.tier,
    };
  }).sort((a, b) => b.traditionalHours - a.traditionalHours);

  // Drivers — aggregate from DayEntry blocks
  const driverMap: Record<string, DriverStats> = {};
  const driverBugCounts: Record<string, number> = {};
  for (const b of bundles) {
    for (const day of b.days) {
      for (const block of day.blocks) {
        const d = block.driver === 'ai' ? 'agent-led' : block.driver;
        if (!driverMap[d]) driverMap[d] = { totalLoc: 0, totalHours: 0, bugsPerSession: 0, sessionCount: 0 };
        driverMap[d].totalLoc += (block.linesAdded ?? 0);
        driverMap[d].totalHours += (block.timeMinutes ?? 0) / 60;
        driverMap[d].sessionCount += 1;
      }
    }
    for (const bug of b.bugs) {
      const sess = b.sessions.find(s => s.session === bug.session);
      const d = sess?.driver === 'ai' ? 'agent-led' : (sess?.driver ?? 'agent-led');
      driverBugCounts[d] = (driverBugCounts[d] ?? 0) + 1;
    }
  }
  for (const [d, stats] of Object.entries(driverMap)) {
    stats.bugsPerSession = stats.sessionCount > 0
      ? Math.round(((driverBugCounts[d] ?? 0) / stats.sessionCount) * 100) / 100
      : 0;
  }

  // Timeline
  const timeline: TimelineRow[] = bundles
    .map(b => ({
      projectId: b.project.id,
      projectName: b.project.name,
      firstDate: b.codeVolume[0]?.date ?? b.days[0]?.date ?? '',
      lastDate: b.codeVolume[b.codeVolume.length - 1]?.date ?? b.days[b.days.length - 1]?.date ?? '',
      sessionDates: b.days.map(d => d.date),
    }))
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

  // Bug Trends
  const bugTrends: BugTrendRow[] = bundles
    .filter(b => b.bugs.length > 0)
    .map(b => {
      const sessionList = b.sessions.map(s => s.session);
      const bugsBySession: Record<string, number> = {};
      for (const bug of b.bugs) {
        bugsBySession[bug.session] = (bugsBySession[bug.session] ?? 0) + 1;
      }
      const rateByAge: BugTrendPoint[] = sessionList.map((sess, idx) => ({
        sessionAge: idx + 1,
        bugsPerSession: bugsBySession[sess] ?? 0,
      }));
      return { projectId: b.project.id, projectName: b.project.name, rateByAge };
    });

  return { portfolio, velocity, estimates, drivers: driverMap, timeline, workMix: { aggregate: aggregateMix, perProject }, bugTrends };
}
