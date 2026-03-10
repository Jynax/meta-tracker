import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

export const vbCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', added: 629, deleted: 0, net: 629, total: 629 },
  { session: 'Session 3', date: 'Mar 9', label: 'Workflow Alignment', added: 111, deleted: 0, net: 111, total: 740 },
  { session: 'Session 4', date: 'Mar 9', label: 'Issues Coordination Guide', added: 323, deleted: 58, net: 265, total: 1005 },
  { session: 'Session 5', date: 'Mar 10', label: 'DRY Entry Points + Workflow Changes', added: 39, deleted: 88, net: -49, total: 956 },
];

export const vbSessions: SessionEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', duration: 1, prs: 2, decisions: 2, deadEnds: 0, focus: 'Workflow setup, multi-model coordination protocol, .workflow/ docs, .cursorrules, CLAUDE.md', chapterId: 'vb-ch-getting-organized', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'ai', operator: 'michael' },
  { session: 'Session 2', date: 'Mar 9', label: 'Workflow Alignment Prep', duration: 0.3, prs: 0, decisions: 0, deadEnds: 0, focus: 'Align workflow docs with Meta Tracker data model', chapterId: 'vb-ch-getting-organized', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 3', date: 'Mar 9', label: 'Repo Migration + Cursor Review', duration: 1.5, prs: 1, decisions: 1, deadEnds: 0, focus: 'Repo migration (remove fork), workflow alignment PR #3, Cursor review intake, task #05 design', chapterId: 'vb-ch-solving-coordination-gaps', workCategory: 'Planning', tool: 'Claude Code', taskCount: 1, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 4', date: 'Mar 9', label: 'Issues POC + Coordination Guide', duration: 1, prs: 1, decisions: 2, deadEnds: 0, focus: 'GitHub Issues POC validation, coordination guide, workflow doc updates (6 files)', chapterId: 'vb-ch-solving-coordination-gaps', workCategory: 'Planning', tool: 'Claude Code', taskCount: 1, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 5', date: 'Mar 10', label: 'DRY Entry Points + Workflow Changes', duration: 0, prs: 1, decisions: 2, deadEnds: 0, focus: 'DRY entry points, created-by labels, codebase audit, 26 issues created', chapterId: 'vb-ch-workflow-refinements', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
];

export const vbDateRange = { start: 'Mar 2026', end: 'Mar 2026' };

export const vbBugs: BugEntry[] = [];

export const vbDerived: DerivedMetric[] = [
  { label: 'Models Active', value: '2', detail: 'Claude Code + Cursor', color: '#22d3ee' },
  { label: 'Decisions', value: '7', detail: 'Workflow (2) + Coordination (3) + Refinements (2)', color: '#8b5cf6' },
  { label: 'Sessions', value: '5', detail: 'All Spec phase so far', color: '#f59e0b' },
  { label: 'PRs Created', value: '6', detail: '4 Claude Code + 1 Cursor + 1 shared', color: '#10b981' },
];

export const vbStack: StackEntry[] = [
  { name: 'Python', cat: 'Core' },
  { name: 'Flask', cat: 'Core' },
  { name: 'SQLite', cat: 'Core' },
  { name: 'Docker', cat: 'Build' },
  { name: 'HTML/CSS/JS', cat: 'UI' },
];
