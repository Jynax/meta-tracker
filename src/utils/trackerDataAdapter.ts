// Transforms generated-tracker-data.ts (Epic/Task model) into shapes
// consumed by dashboard components. Only used when projectId === 'meta'.
// See specs/2026-04-14-data-model-rethink.md §4.

import { epics, tasks, generatedAt } from '../data/generated-tracker-data';
import type { Epic, Task, Decision, TaskEvent, TaskOutput } from '../types/tracker';
import { metaDays } from '../data/metaMetrics';

// ── Overview stat card data ─────────────────────────────────────────

export interface OverviewStats {
  activeEpics: number;
  totalEpics: number;
  tasksCompleted: number;
  tasksThisWeek: number;
  totalPRs: number;
  totalSpecs: number;
  totalDocs: number;
  totalOtherOutputs: number;
  totalHours: number;
  decisionCount: number;
}

function deriveHoursFromBlocks(): number {
  return (
    metaDays.reduce(
      (sum, day) => sum + day.blocks.reduce((s, b) => s + (b.timeMinutes ?? 0), 0),
      0,
    ) / 60
  );
}

export function getOverviewStats(): OverviewStats {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const doneTasks = tasks.filter((t) => t.status === 'Done');
  const outputs = doneTasks.flatMap((t) => t.outputs ?? []);

  return {
    activeEpics: epics.filter((e) => e.status === 'In Progress').length,
    totalEpics: epics.length,
    tasksCompleted: doneTasks.length,
    tasksThisWeek: doneTasks.filter((t) => {
      const d = t.dates?.completed;
      return d != null && new Date(d) >= weekAgo;
    }).length,
    totalPRs: outputs.filter((o) => o.type === 'PR').length,
    totalSpecs: outputs.filter((o) => o.type === 'Spec').length,
    totalDocs: outputs.filter((o) => o.type === 'Doc').length,
    totalOtherOutputs: outputs.filter(
      (o) => o.type === 'Brainstorm' || o.type === 'Other',
    ).length,
    totalHours: deriveHoursFromBlocks(),
    decisionCount: doneTasks.reduce((sum, t) => sum + (t.decisions?.length ?? 0), 0),
  };
}

// ── Epic Gantt data ─────────────────────────────────────────────────

export interface GanttBar {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string | null;
  taskCount: number;
}

export function getEpicGanttBars(): GanttBar[] {
  return epics
    .filter((e) => e.project === 'meta' || e.project === 'shared')
    .map((e) => ({
      id: e.id,
      title: e.title,
      status: e.status,
      startDate: e.startDate,
      endDate: e.endDate,
      taskCount: tasks.filter((t) => t.epic === e.id).length,
    }))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

// ── Tasks tab data ──────────────────────────────────────────────────

export interface WeekBucket {
  weekStart: string; // YYYY-MM-DD (Monday)
  tasks: Task[];
  byEpic: Map<string, Task[]>;
}

export function getWeeklyTaskBuckets(): WeekBucket[] {
  const done = tasks
    .filter((t) => t.status === 'Done' && t.dates?.completed != null)
    .sort(
      (a, b) =>
        new Date(a.dates.completed!).getTime() - new Date(b.dates.completed!).getTime(),
    );

  const bucketMap = new Map<string, Task[]>();
  for (const t of done) {
    const d = new Date(t.dates.completed!);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    if (!bucketMap.has(key)) bucketMap.set(key, []);
    bucketMap.get(key)!.push(t);
  }

  return [...bucketMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, weekTasks]) => {
      const byEpic = new Map<string, Task[]>();
      for (const t of weekTasks) {
        const epicId = t.epic ?? 'unassigned';
        if (!byEpic.has(epicId)) byEpic.set(epicId, []);
        byEpic.get(epicId)!.push(t);
      }
      return { weekStart, tasks: weekTasks, byEpic };
    });
}

export interface DecisionPin {
  date: string;
  taskId: string;
  decision: Decision;
}

export function getDecisionPins(): DecisionPin[] {
  return tasks
    .filter((t) => t.decisions && t.decisions.length > 0)
    .flatMap((t) =>
      t.decisions.map((d) => ({
        date: d.date,
        taskId: t.id,
        decision: d,
      })),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ── Epic Tree data ──────────────────────────────────────────────────

export interface TaskTreeNode {
  type: 'task';
  id: string;
  title: string;
  status: string;
  epic: string | null;
  priority: string;
  tool: string | null;
  driver: string | null;
  outputs: TaskOutput[];
  dates: { created: string; started: string | null; completed: string | null };
  decisions: Decision[];
  events: TaskEvent[];
}

export interface EpicTreeNode {
  type: 'epic';
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string | null;
  children: TaskTreeNode[];
}

export function getEpicTree(): EpicTreeNode[] {
  const mtEpics = epics.filter((e) => e.project === 'meta' || e.project === 'shared');
  return mtEpics.map((e) => ({
    type: 'epic' as const,
    id: e.id,
    title: e.title,
    status: e.status,
    startDate: e.startDate,
    endDate: e.endDate,
    children: tasks
      .filter((t) => t.epic === e.id)
      .sort((a, b) => {
        const dateA = a.dates?.completed ?? a.dates?.created ?? '';
        const dateB = b.dates?.completed ?? b.dates?.created ?? '';
        return dateA.localeCompare(dateB);
      })
      .map((t) => ({
        type: 'task' as const,
        id: t.id,
        title: t.title,
        status: t.status,
        epic: t.epic,
        priority: t.priority,
        tool: t.tool,
        driver: t.driver,
        outputs: t.outputs ?? [],
        dates: t.dates ?? { created: '', started: null, completed: null },
        decisions: t.decisions ?? [],
        events: t.events ?? [],
      })),
  }));
}

// ── Display helpers ─────────────────────────────────────────────────

// Strip the project prefix for display. "meta-103" → "103", "shared-11" → "11".
// Callers have project context (epic, column, etc.) so the prefix is redundant in UI.
export function displayTaskId(id: string): string {
  const idx = id.indexOf('-');
  return idx >= 0 ? id.slice(idx + 1) : id;
}

// ── Lookups ─────────────────────────────────────────────────────────

export function getEpicById(epicId: string): Epic | undefined {
  return epics.find((e) => e.id === epicId);
}

export function getTasksByEpic(epicId: string): Task[] {
  return tasks.filter((t) => t.epic === epicId);
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function getAllEpics(): Epic[] {
  return epics;
}

export { generatedAt };

// ── Active Epic Progress: cumulative weekly series per epic ─────────

export interface EpicSeries {
  epicId: string;
  epicTitle: string;
  status: 'Queued' | 'In Progress' | 'Done' | 'Cancelled' | 'Retired';
  stalled: boolean;
  color: string;
  points: { weekStart: string; cumulative: number; delta: number }[];
  totalCompleted: number;
}

export interface EpicCumulativeOpts {
  now: Date;
  windowDays: number;
  plotWindowWeeks: number;
  cap: number;
  includeAll: boolean;
}

const EPIC_PALETTE_COLORS = [
  '#22d3ee', '#a78bfa', '#f59e0b', '#34d399', '#f43f5e',
  '#60a5fa', '#fbbf24', '#818cf8', '#2dd4bf', '#fb923c',
  '#94a3b8', '#c084fc', '#facc15', '#4ade80',
];

function mondayOfWeek(iso: string): string {
  const d = new Date(iso);
  const day = d.getUTCDay() || 7;
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

export function getEpicCumulativeSeries(opts: EpicCumulativeOpts): EpicSeries[] {
  const epicById = new Map(epics.map((e) => [e.id, e]));

  const perEpic = new Map<string, Map<string, number>>();
  for (const t of tasks) {
    if (t.status !== 'Done') continue;
    if (!t.epic) continue;
    if (!t.dates?.completed) continue;
    const week = mondayOfWeek(t.dates.completed);
    if (!perEpic.has(t.epic)) perEpic.set(t.epic, new Map());
    const em = perEpic.get(t.epic)!;
    em.set(week, (em.get(week) ?? 0) + 1);
  }

  const results: EpicSeries[] = [];
  let colorIdx = 0;
  for (const [epicId, byWeek] of perEpic) {
    const epic = epicById.get(epicId);
    if (!epic) continue;
    const weeks = [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b));
    const points: EpicSeries['points'] = [];
    let cum = 0;
    for (const [weekStart, delta] of weeks) {
      cum += delta;
      points.push({ weekStart, cumulative: cum, delta });
    }
    results.push({
      epicId,
      epicTitle: epic.title,
      status: epic.status,
      stalled: false,
      color: EPIC_PALETTE_COLORS[colorIdx % EPIC_PALETTE_COLORS.length],
      points,
      totalCompleted: cum,
    });
    colorIdx++;
  }

  if (opts.includeAll) return results;

  const cutoffMs = opts.now.getTime() - opts.windowDays * 24 * 60 * 60 * 1000;

  const active: EpicSeries[] = results.filter((s) => {
    const last = s.points[s.points.length - 1]?.weekStart;
    if (!last) return false;
    return new Date(last + 'T00:00:00Z').getTime() >= cutoffMs;
  });

  // Second pass: stalled In Progress epics
  const activeIds = new Set(active.map((s) => s.epicId));
  for (const epic of epics) {
    if (epic.status !== 'In Progress') continue;
    if (activeIds.has(epic.id)) continue;

    const existing = results.find((s) => s.epicId === epic.id);
    if (existing) {
      active.push({ ...existing, stalled: true, points: [...existing.points] });
    } else {
      // Never-started stalled epic: zero completed tasks. Return empty points;
      // component layer handles the flat-line placeholder render.
      active.push({
        epicId: epic.id,
        epicTitle: epic.title,
        status: epic.status,
        stalled: true,
        color: EPIC_PALETTE_COLORS[colorIdx % EPIC_PALETTE_COLORS.length],
        points: [],
        totalCompleted: 0,
      });
      colorIdx++;
    }
  }

  active.sort((a, b) => {
    const aLast = a.points[a.points.length - 1]?.weekStart ?? '';
    const bLast = b.points[b.points.length - 1]?.weekStart ?? '';
    if (aLast !== bLast) return bLast.localeCompare(aLast);
    if (a.totalCompleted !== b.totalCompleted) return b.totalCompleted - a.totalCompleted;
    return a.epicId.localeCompare(b.epicId);
  });

  return active.slice(0, opts.cap);
}
