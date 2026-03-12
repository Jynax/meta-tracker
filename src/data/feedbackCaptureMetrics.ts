import type { CodeVolumeEntry, SessionEntry, DerivedMetric, StackEntry } from './bipMetrics';
import type { BugEntry } from './remnantsMetrics';

// --- Code Volume ---
export const fcCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 39', date: 'Mar 10', label: 'Inception & Briefs', added: 0, deleted: 0, net: 0, total: 0 },
  { session: 'Session 40', date: 'Mar 11', label: 'Scaffolding & Command Brief', added: 0, deleted: 0, net: 0, total: 0 },
  { session: 'Session 42', date: 'Mar 12', label: 'Full Build & Annotations', added: 935, deleted: 0, net: 935, total: 935 },
  { session: 'Session 43', date: 'Mar 12', label: 'Placeholder + First-Click Fix', added: 15, deleted: 5, net: 10, total: 945 },
];

// --- Sessions ---
export const fcSessions: SessionEntry[] = [
  { session: 'Session 39', date: 'Mar 10', label: 'Inception & Briefs', duration: 0.5, prs: 0, decisions: 5, deadEnds: 0, focus: 'Replaced Vibe Annotations with custom Feedback Capture concept. Wrote extension + server brief and /feedback command brief.', chapterId: 'ch-inception', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative' },
  { session: 'Session 40', date: 'Mar 11', label: 'Scaffolding & Command Brief', duration: 0.5, prs: 0, decisions: 2, deadEnds: 0, focus: 'Scaffolded project directory structure. Wrote /feedback command brief. Created STATUS.md.', chapterId: 'ch-feedback-command', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative' },
  { session: 'Session 42', date: 'Mar 12', label: 'Full Build & Annotations', duration: 2, prs: 0, decisions: 3, deadEnds: 0, focus: 'Built complete extension (capture, annotations, note panel), server (loopback, JSON+PNG pairs), /captures command, auto-start scheduled task. Fixed CORS, injection, and flicker bugs. Added rectangle + arrow annotation tools.', chapterId: 'ch-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 43', date: 'Mar 12', label: 'Placeholder + First-Click Fix', duration: 0.25, prs: 0, decisions: 0, deadEnds: 0, focus: 'Updated textarea placeholder text. Fixed first-click race condition — content script listener not ready before startCapture message. Added readiness polling in background script.', chapterId: 'ch-build', workCategory: 'Bug', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
];

// --- Date Range ---
export const fcDateRange = {
  start: 'Mar 2026',
  end: 'Mar 2026',
};

// --- Bugs ---
export const fcBugs: BugEntry[] = [
  { id: 1, session: 'Session 42', date: 'Mar 12', label: 'Full Build & Annotations', summary: 'Content script not injected on pre-existing tabs', severity: 'High', source: 'User Report', status: 'Fixed (on-demand injection)', category: 'Technical' },
  { id: 2, session: 'Session 42', date: 'Mar 12', label: 'Full Build & Annotations', summary: 'CORS blocked content script fetch to localhost server', severity: 'High', source: 'User Report', status: 'Fixed (background proxy)', category: 'Technical' },
  { id: 3, session: 'Session 42', date: 'Mar 12', label: 'Full Build & Annotations', summary: 'Annotation canvas flickers during drawing', severity: 'Low', source: 'User Report', status: 'Fixed (cached image)', category: 'UX' },
  { id: 4, session: 'Session 43', date: 'Mar 12', label: 'Placeholder + First-Click Fix', summary: 'First click on Capture button does nothing — requires second click', severity: 'Medium', source: 'User Report', status: 'Fixed (readiness polling)', category: 'Technical' },
];

// --- Derived Metrics ---
export const fcDerived: DerivedMetric[] = [
  { label: 'Decision Density', value: '3.3/session', detail: '10 decisions across 3 sessions', color: '#8b5cf6' },
  { label: 'Build Speed', value: '935 LOC/session', detail: 'Full tool built in one session', color: '#22d3ee' },
  { label: 'Bug Discovery', value: '3 bugs', detail: 'All found and fixed same session', color: '#ef4444' },
  { label: 'Time to Ship', value: '1 session', detail: 'From spec to production in Session 42', color: '#10b981' },
];

// --- Stack ---
export const fcStack: StackEntry[] = [
  { name: 'Chromium Extension API (MV3)', cat: 'Core' },
  { name: 'Node.js', cat: 'Core' },
  { name: 'JavaScript (ES6+)', cat: 'Core' },
  { name: 'HTML5 Canvas', cat: 'Core' },
  { name: 'Claude Code Command', cat: 'Utility' },
];
