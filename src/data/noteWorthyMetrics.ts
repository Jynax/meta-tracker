import type { DayEntry } from '../types/index';
import type { CodeVolumeEntry, SessionEntry, DerivedMetric, StackEntry } from './bipMetrics';
import type { BugEntry } from './remnantsMetrics';

// --- Code Volume ---
export const nwCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 54', date: 'Mar 19', label: 'Initial Scaffold', added: 50, deleted: 0, net: 50, total: 50 },
  { session: 'Session 55', date: 'Mar 20', label: 'Deploy + MVP Spec', added: 5, deleted: 0, net: 5, total: 55 },
  { session: 'Session 56', date: 'Mar 20', label: 'MVP Build (frontend)', added: 1212, deleted: 114, net: 1098, total: 1150 },
  { session: 'Session 56b', date: 'Mar 20', label: 'MVP Build (backend)', added: 300, deleted: 0, net: 300, total: 300 },
  { session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', added: 133, deleted: 10, net: 123, total: 423 },
  { session: 'Session 58', date: 'Mar 21', label: 'OMR Improvements + Key Detection', added: 250, deleted: 7, net: 243, total: 666 },
  { session: 'Session 59', date: 'Mar 21', label: 'MusicXML Note Editor', added: 1705, deleted: 19, net: 1686, total: 2352 },
  { session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', added: 281, deleted: 164, net: 117, total: 2469 },
];

// --- Sessions ---
export const nwSessions: SessionEntry[] = [
  { session: 'Session 54', date: 'Mar 19', label: 'Initial Scaffold', duration: 0.5, prs: 0, decisions: 6, deadEnds: 0, focus: 'Project creation, scaffold, research. Stack choice, MusicXML-first architecture, OSMD rendering, competitive positioning, OMR strategy deferred, PDF export approach.', chapterId: 'ch-inception', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative' },
  { session: 'Session 55', date: 'Mar 20', label: 'Deploy + MVP Spec', duration: 0.5, prs: 0, decisions: 0, deadEnds: 0, focus: 'Deployed to Cloudflare Pages. Wrote full MVP design spec covering OMR, transposition, and PDF export.', chapterId: 'ch-inception', workCategory: 'Planning', tool: 'Claude Code', taskCount: 1, phase: 'Spec', driver: 'collaborative' },
  { session: 'Session 56', date: 'Mar 20', label: 'MVP Build', duration: 2, prs: 2, decisions: 4, deadEnds: 0, focus: 'Built transposition (key dropdown + 18 instruments), PDF export (jsPDF + svg2pdf.js), OMR integration (image/PDF/camera input, loading overlay). Backend: FastAPI + homr OMR + PDF conversion + Dockerfile.', chapterId: 'ch-mvp-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 7, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', duration: 1.5, prs: 1, decisions: 3, deadEnds: 0, focus: 'Migrated backend from Fly.io to HF Spaces (free). Dockerfile updated (port 7860, non-root user, baked model weights). Build fix: added libgl1 for OpenCV. End-to-end OMR tested.', chapterId: 'ch-infrastructure', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 58', date: 'Mar 21', label: 'OMR Improvements + Key Detection', duration: 1.5, prs: 3, decisions: 2, deadEnds: 0, focus: 'Added NW to Meta Tracker dropdown (MT PR #126). OMR post-processing: title cleanup + slurs/ties re-enabled (BE PR #2). Original key detection from MusicXML (FE PR #4).', chapterId: 'ch-editor', workCategory: 'Feature', tool: 'Claude Code', taskCount: 3, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 59', date: 'Mar 21', label: 'MusicXML Note Editor', duration: 2, prs: 1, decisions: 2, deadEnds: 0, focus: 'Full MusicXML note editor (FE PR #5). Click-to-select, sidebar editing, keyboard shortcuts, MusicXML mutation service. 23 new tests (51 total). Subagent-driven development.', chapterId: 'ch-editor', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', duration: 2, prs: 4, decisions: 0, deadEnds: 0, focus: 'Fix note click selection (PR #6), keep editor open across edits (PR #7), save/cancel workflow (PR #8), toolbar redesign + highlight persistence + connector support (PR #9).', chapterId: 'ch-editor', workCategory: 'Bug', tool: 'Claude Code', taskCount: 4, phase: 'Build', driver: 'collaborative' },
];

// --- Date Range ---
export const nwDateRange = {
  start: 'Mar 2026',
  end: 'Mar 2026',
};

// --- Bugs ---
export const nwBugs: BugEntry[] = [
  { id: 1, session: 'Session 56', date: 'Mar 20', label: 'MVP Build', summary: 'OSMD TransposeCalculator not set — transposition silently ignored', severity: 'High', source: 'Testing', status: 'Fixed (PR #3)', category: 'Technical' },
  { id: 2, session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', summary: 'OpenCV missing libGL in slim Docker image', severity: 'Medium', source: 'Deploy', status: 'Fixed (direct push)', category: 'Technical' },
  { id: 3, session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', summary: 'OMR misses dynamics (fp, f, mp, etc.)', severity: 'Low', source: 'Testing', status: 'Known — homr limitation', category: 'Technical' },
  { id: 4, session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', summary: 'OMR confuses rests with staccato notes', severity: 'Medium', source: 'Testing', status: 'Open', category: 'Technical' },
  { id: 5, session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', summary: 'OMR misses slurs/ties', severity: 'Low', source: 'Testing', status: 'Fixed (BE PR #2, experimental)', category: 'Technical' },
  { id: 6, session: 'Session 57', date: 'Mar 21', label: 'HF Spaces Migration', summary: 'Tempo marking parsed as title', severity: 'Low', source: 'Testing', status: 'Fixed (BE PR #2)', category: 'Technical' },
  { id: 7, session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', summary: 'Note click selection broken — manual coordinate math failed', severity: 'High', source: 'User Report', status: 'Fixed (PR #6)', category: 'Technical' },
  { id: 8, session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', summary: 'Editor closes after each edit — xmlContent effect reset', severity: 'Medium', source: 'User Report', status: 'Fixed (PR #7)', category: 'UX' },
  { id: 9, session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', summary: 'Purple highlight disappears on re-render', severity: 'Medium', source: 'User Report', status: 'Fixed (PR #9)', category: 'UX' },
  { id: 10, session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', summary: 'Connectors handler missing in updateNote', severity: 'Low', source: 'Testing', status: 'Fixed (PR #9)', category: 'Technical' },
  { id: 11, session: 'Session 60', date: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', summary: 'Sidebar overlaps score on first appear', severity: 'Medium', source: 'User Report', status: 'Fixed (PR #9, toolbar redesign)', category: 'UX' },
];

// --- Derived Metrics ---
export const nwDerived: DerivedMetric[] = [
  { label: 'Decision Density', value: '2.6/session', detail: '18 decisions across 7 sessions', color: '#8b5cf6' },
  { label: 'Build Speed', value: '~2,500 LOC', detail: 'Across 5 build sessions', color: '#22d3ee' },
  { label: 'Time to MVP', value: '2 sessions', detail: 'Spec → live in Sessions 55-56', color: '#10b981' },
  { label: 'Time to Editor', value: '3 sessions', detail: 'Sessions 58-60: OMR fixes → full editor', color: '#f59e0b' },
];

// --- Stack ---
export const nwStack: StackEntry[] = [
  { name: 'React 19', cat: 'Core' },
  { name: 'TypeScript 5.9', cat: 'Core' },
  { name: 'Vite 8', cat: 'Core' },
  { name: 'Tailwind 4', cat: 'Core' },
  { name: 'OSMD 1.9', cat: 'Core' },
  { name: 'jsPDF + svg2pdf.js', cat: 'Utility' },
  { name: 'Python 3.11', cat: 'Backend' },
  { name: 'FastAPI', cat: 'Backend' },
  { name: 'homr (OMR)', cat: 'Backend' },
  { name: 'Hugging Face Spaces', cat: 'Hosting' },
  { name: 'Cloudflare Pages', cat: 'Hosting' },
];

/** Each Day groups work blocks that share a date. */
export const nwDays: DayEntry[] = [
  {
    date: 'Mar 19',
    title: 'Initial Scaffold',
    projectId: 'nw',
    phase: 'Spec',
    chapterId: 'ch-inception',
    blocks: [
      { id: 'nw-session-54', dayId: 'Mar 19', label: 'Initial Scaffold', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 50, linesDeleted: 0, note: 'Project creation, scaffold, research. Stack choice, MusicXML-first architecture, OSMD rendering, competitive positioning.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 50, linesDeleted: 0, totalDecisions: 6 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 20',
    title: 'Deploy + MVP Build',
    projectId: 'nw',
    phase: 'Build',
    chapterId: 'ch-mvp-build',
    blocks: [
      { id: 'nw-session-55', dayId: 'Mar 20', label: 'Deploy + MVP Spec', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 5, linesDeleted: 0, note: 'Deployed to Cloudflare Pages. Wrote full MVP design spec.', contextWindowOrigin: false },
      { id: 'nw-session-56', dayId: 'Mar 20', label: 'MVP Build', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 1512, linesDeleted: 114, note: 'Built transposition, PDF export, OMR integration (frontend + backend). PRs #2, #3 (FE). Backend pushed to main.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 150, linesAdded: 1517, linesDeleted: 114, totalDecisions: 4 },
    driverSummary: { human: 0, ai: 1, collaborative: 1 },
  },
  {
    date: 'Mar 21',
    title: 'HF Migration + OMR + Editor',
    projectId: 'nw',
    phase: 'Build',
    chapterId: 'ch-editor',
    blocks: [
      { id: 'nw-session-57', dayId: 'Mar 21', label: 'HF Spaces Migration', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 90, linesAdded: 133, linesDeleted: 10, note: 'Migrated backend from Fly.io to HF Spaces (free). Dockerfile updated, libgl1 fix. End-to-end OMR tested.', contextWindowOrigin: false },
      { id: 'nw-session-58', dayId: 'Mar 21', label: 'OMR Improvements + Key Detection', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 90, linesAdded: 250, linesDeleted: 7, note: 'Added NW to Meta Tracker dropdown (MT PR #126). OMR post-processing: title cleanup + slurs/ties re-enabled (BE PR #2). Original key detection from MusicXML (FE PR #4).', contextWindowOrigin: false },
      { id: 'nw-session-59', dayId: 'Mar 21', label: 'MusicXML Note Editor', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 1705, linesDeleted: 19, note: 'Full MusicXML note editor (FE PR #5). Click-to-select, sidebar editing, keyboard shortcuts, MusicXML mutation service. 23 new tests (51 total). Subagent-driven development.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 300, linesAdded: 2088, linesDeleted: 36, totalDecisions: 7 },
    driverSummary: { human: 0, ai: 3, collaborative: 0 },
  },
  {
    date: 'Mar 22',
    title: 'Editor Bug Fixes + Toolbar Redesign',
    projectId: 'nw',
    phase: 'Build',
    chapterId: 'ch-editor',
    blocks: [
      { id: 'nw-session-60', dayId: 'Mar 22', label: 'Editor Bug Fixes + Toolbar', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 281, linesDeleted: 164, note: 'Fix note click selection (PR #6), keep editor open across edits (PR #7), save/cancel workflow (PR #8), toolbar redesign + highlight persistence + connector support (PR #9). Michael tested, reported bugs, suggested toolbar.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 281, linesDeleted: 164, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
];
