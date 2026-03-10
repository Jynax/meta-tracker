import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

export const vbCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', added: 629, deleted: 0, net: 629, total: 629 },
  { session: 'Session 3', date: 'Mar 9', label: 'Workflow Alignment', added: 111, deleted: 0, net: 111, total: 740 },
  { session: 'Session 4', date: 'Mar 9', label: 'Issues Coordination Guide', added: 323, deleted: 58, net: 265, total: 1005 },
  { session: 'Session 6', date: 'Mar 10', label: 'DRY Entry Points + Workflow Changes', added: 39, deleted: 88, net: -49, total: 956 },
  { session: 'Session 7', date: 'Mar 10', label: 'Rebase Checklist + Workflow', added: 50, deleted: 10, net: 40, total: 996 },
  { session: 'Session 8', date: 'Mar 10', label: 'Bug Fixes + Session Close-Out', added: 159, deleted: 41, net: 118, total: 1114 },
];

export const vbSessions: SessionEntry[] = [
  { session: 'Session 1', date: 'Mar 6', label: 'Workflow Setup', duration: 1, prs: 2, decisions: 2, deadEnds: 0, focus: 'Workflow setup, multi-model coordination protocol, .workflow/ docs, .cursorrules, CLAUDE.md', chapterId: 'vb-ch-getting-organized', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'ai', operator: 'michael' },
  { session: 'Session 2', date: 'Mar 9', label: 'Workflow Alignment Prep', duration: 0.3, prs: 0, decisions: 0, deadEnds: 0, focus: 'Align workflow docs with Meta Tracker data model', chapterId: 'vb-ch-getting-organized', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 3', date: 'Mar 9', label: 'Repo Migration + Cursor Review', duration: 1.5, prs: 1, decisions: 1, deadEnds: 0, focus: 'Repo migration (remove fork), workflow alignment PR #3, Cursor review intake, task #05 design', chapterId: 'vb-ch-solving-coordination-gaps', workCategory: 'Planning', tool: 'Claude Code', taskCount: 1, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 4', date: 'Mar 9', label: 'Issues POC + Coordination Guide', duration: 1, prs: 1, decisions: 2, deadEnds: 0, focus: 'GitHub Issues POC validation, coordination guide, workflow doc updates (6 files)', chapterId: 'vb-ch-solving-coordination-gaps', workCategory: 'Planning', tool: 'Claude Code', taskCount: 1, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 5', date: 'Mar 10', label: 'Archive + Workflow Cleanup', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'Created .archive/, moved obsolete task files and workflow artifacts, updated workflow docs', chapterId: 'vb-ch-workflow-refinements', workCategory: 'Planning', tool: 'Cursor', taskCount: 0, phase: 'Spec', driver: 'ai', operator: 'hrpatel' },
  { session: 'Session 6', date: 'Mar 10', label: 'DRY Entry Points + Workflow Changes', duration: 0, prs: 1, decisions: 2, deadEnds: 0, focus: 'DRY entry points, created-by labels, codebase audit, 26 issues created', chapterId: 'vb-ch-workflow-refinements', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative', operator: 'michael' },
  { session: 'Session 7', date: 'Mar 10', label: 'Rebase Checklist + Workflow', duration: 0, prs: 1, decisions: 0, deadEnds: 0, focus: 'Issue #49: rebase-on-main in checklist, close issue only when PR merged', chapterId: 'vb-ch-workflow-refinements', workCategory: 'Planning', tool: 'Cursor', taskCount: 1, phase: 'Spec', driver: 'ai', operator: 'hrpatel' },
  { session: 'Session 8', date: 'Mar 10', label: 'Bug Fixes + Session Close-Out', duration: 0, prs: 3, decisions: 1, deadEnds: 0, focus: 'Fixed 4 bugs (#21, #22, #26, #36), Meta Tracker sync, session close-out workflow (#55)', chapterId: 'vb-ch-first-code-fixes', workCategory: 'Bug', tool: 'Claude Code', taskCount: 6, phase: 'Build', driver: 'collaborative', operator: 'michael' },
];

export const vbDateRange = { start: 'Mar 2026', end: 'Mar 2026' };

export const vbBugs: BugEntry[] = [
  { id: 21, session: 'Session 8', date: 'Mar 10', label: 'Commando-X References', summary: 'README, openapi.json, and index.html still referenced Commando-X/vuln-bank instead of hrpatel/vuln-bank', severity: 'Medium', source: 'Codebase audit', status: 'Fixed (PR #53)', category: 'Technical' },
  { id: 22, session: 'Session 8', date: 'Mar 10', label: 'Dead SQLite Code', summary: 'Three API endpoints in auth.py used sqlite3 but app runs PostgreSQL — endpoints would crash at runtime', severity: 'High', source: 'Codebase audit', status: 'Fixed (PR #53)', category: 'Technical' },
  { id: 26, session: 'Session 8', date: 'Mar 10', label: 'Upload Permissions', summary: 'Dockerfile set chmod 777 on static/uploads — overly permissive, not an intentional vulnerability', severity: 'Low', source: 'Codebase audit', status: 'Fixed (PR #53)', category: 'Technical' },
  { id: 36, session: 'Session 8', date: 'Mar 10', label: 'Debug Print Statements', summary: 'Login handler printed usernames, SQL queries, and JWT tokens to stdout — development artifacts, not intentional vulns', severity: 'Medium', source: 'Codebase audit', status: 'Fixed (PR #53)', category: 'Technical' },
];

export const vbDerived: DerivedMetric[] = [
  { label: 'Models Active', value: '2', detail: 'Claude Code + Cursor', color: '#22d3ee' },
  { label: 'Decisions', value: '8', detail: 'Workflow (2) + Coordination (3) + Refinements (3)', color: '#8b5cf6' },
  { label: 'Sessions', value: '8', detail: 'Spec (7) + Build (1)', color: '#f59e0b' },
  { label: 'PRs Created', value: '9', detail: '7 Claude Code + 2 Cursor', color: '#10b981' },
];

export const vbStack: StackEntry[] = [
  { name: 'Python', cat: 'Core' },
  { name: 'Flask', cat: 'Core' },
  { name: 'SQLite', cat: 'Core' },
  { name: 'Docker', cat: 'Build' },
  { name: 'HTML/CSS/JS', cat: 'UI' },
];
