import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

export const vbCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', added: 629, deleted: 0, net: 629, total: 629 },
];

export const vbSessions: SessionEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', duration: 1, prs: 2, decisions: 2, deadEnds: 0, focus: 'Workflow setup, multi-model coordination protocol, .workflow/ docs, .cursorrules, CLAUDE.md', chapterId: 'vb-ch-getting-organized', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'ai', operator: 'michael' },
];

export const vbDateRange = { start: 'Mar 2026', end: 'Mar 2026' };

export const vbBugs: BugEntry[] = [];

export const vbDerived: DerivedMetric[] = [
  { label: 'Models Active', value: '2', detail: 'Claude Code + Cursor', color: '#22d3ee' },
  { label: 'Decisions', value: '2', detail: 'Session 1 (workflow)', color: '#8b5cf6' },
];

export const vbStack: StackEntry[] = [
  { name: 'Python', cat: 'Core' },
  { name: 'Flask', cat: 'Core' },
  { name: 'SQLite', cat: 'Core' },
  { name: 'Docker', cat: 'Build' },
  { name: 'HTML/CSS/JS', cat: 'UI' },
];
