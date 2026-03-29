import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';
import type { DayEntry } from '../types/index';

// --- Code Volume ---
export const otmCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 62', date: 'Mar 23', label: 'Full MVP Build', added: 11462, deleted: 130, net: 11332, total: 11332 },
  { session: 'Session 64', date: 'Mar 24', label: 'OAuth Fix', added: 30, deleted: 20, net: 10, total: 11342 },
  { session: 'Session 66', date: 'Mar 25', label: 'Bug Fixes + LinkedIn PDF', added: 255, deleted: 12, net: 243, total: 11575 },
  { session: 'Session 67', date: 'Mar 26', label: 'Expandable Job Cards', added: 15, deleted: 1, net: 14, total: 11589 },
  { session: 'Session 68', date: 'Mar 27', label: 'Platform Data Prep + Parser Rewrite', added: 886, deleted: 159, net: 727, total: 12316 },
  { session: 'Session 69', date: 'Mar 28', label: 'Checklist Overhaul + Auto-Deploy', added: 220, deleted: 42, net: 178, total: 12494 },
  { session: 'Session 70', date: 'Mar 28', label: 'Unified PDF Import (Workers AI)', added: 1077, deleted: 480, net: 597, total: 13091 },
];

// --- Sessions ---
export const otmSessions: SessionEntry[] = [
  { session: 'Session 62', date: 'Mar 23', label: 'Full MVP Build', duration: 3, prs: 1, decisions: 5, deadEnds: 0, focus: 'All core features: auth, profile intake, platform onboarding (13 platforms), job search + scoring, admin dashboard. 16 commits, PR #1 merged.', chapterId: 'ch-mvp', workCategory: 'Feature', tool: 'Claude Code', taskCount: 14, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 64', date: 'Mar 24', label: 'OAuth Fix', duration: 1, prs: 1, decisions: 1, deadEnds: 1, focus: 'Diagnosed PKCE race condition with React Router. Switched to implicit OAuth flow + deferred React render.', chapterId: 'ch-polish', workCategory: 'Bug', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 65', date: 'Mar 25', label: 'UX Feedback Capture', duration: 0.5, prs: 0, decisions: 2, deadEnds: 0, focus: 'Michael tested the app. Captured 7 new tasks (#32-38). Analyzed LinkedIn export samples. Key decision: PDF is primary profile source.', chapterId: 'ch-polish', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 66', date: 'Mar 25', label: 'Deploy + Bugs + LinkedIn PDF', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: 'Deployed to CF Pages. Fixed 6 bugs (PR #3): new-user redirect, platform nav, checkboxes, job search. Built LinkedIn PDF parser (PR #4).', chapterId: 'ch-polish', workCategory: 'Bug', tool: 'Claude Code', taskCount: 10, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 67', date: 'Mar 26', label: 'Expandable Job Cards', duration: 0.5, prs: 1, decisions: 0, deadEnds: 0, focus: 'Expandable job cards (#29, PR #7). Show more toggle reveals full description, posted date, source. #27 superseded by #34.', chapterId: 'ch-polish', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 68', date: 'Mar 27', label: 'Platform Data Prep + Parser Rewrite', duration: 3, prs: 2, decisions: 0, deadEnds: 1, focus: 'Content generator + CopyBlock + 13 platform configs (PR #8). LinkedIn PDF parser rewrite with position-aware extraction (PR #9). Parser improved but still incomplete.', chapterId: 'ch-content', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 69', date: 'Mar 28', label: 'Checklist Overhaul + Auto-Deploy', duration: 1, prs: 2, decisions: 1, deadEnds: 0, focus: 'Rich checklist items with descriptions + auto-completion (PR #10). GitHub Actions auto-deploy to CF Pages (PR #11). Both merged.', chapterId: 'ch-polish', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 70', date: 'Mar 28', label: 'Unified PDF Import (Workers AI)', duration: 2.5, prs: 1, decisions: 2, deadEnds: 0, focus: 'Replaced split import with unified flow. CF Pages Function + Workers AI (Llama 3.1 8B) for parsing. Side-by-side review step. Guidance hints. Version history. PR #12 merged.', chapterId: 'ch-ai', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'agent-led' },
];

// --- Date Range ---
export const otmDateRange = {
  start: 'Mar 2026',
  end: 'present',
};

// --- Days (for Decision Tree) ---
export const otmDays: DayEntry[] = [
  {
    date: 'Mar 23',
    title: 'Full MVP Build',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-mvp',
    blocks: [
      { id: 'otm-session-62', dayId: 'Mar 23', label: 'Full MVP Build', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 180, linesAdded: 11462, linesDeleted: 130, note: 'All core features in one session: auth, profile intake, platform onboarding (13 platforms), job search + scoring, admin dashboard. 16 commits, PR #1 merged.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 180, linesAdded: 11462, linesDeleted: 130, totalDecisions: 5 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 24',
    title: 'OAuth Fix',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-polish',
    blocks: [
      { id: 'otm-session-64', dayId: 'Mar 24', label: 'OAuth Fix', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 30, linesDeleted: 20, note: 'Diagnosed PKCE race condition. Switched to implicit OAuth + deferred React render. PR #2.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 30, linesDeleted: 20, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 25',
    title: 'Deploy + Bugs + LinkedIn PDF',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-polish',
    blocks: [
      { id: 'otm-session-65', dayId: 'Mar 25', label: 'UX Feedback Capture', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 0, linesDeleted: 0, note: 'Michael tested the app. Captured 7 new tasks. Analyzed LinkedIn exports. PDF chosen as primary profile source.', contextWindowOrigin: false },
      { id: 'otm-session-66', dayId: 'Mar 25', label: 'Deploy + Bug Fixes + LinkedIn PDF', workCategory: 'Bug', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 255, linesDeleted: 12, note: 'Deployed to CF Pages. Fixed 6 bugs (PR #3). Built LinkedIn PDF parser (PR #4). 10 tasks completed.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 150, linesAdded: 255, linesDeleted: 12, totalDecisions: 2 },
    driverSummary: { human: 0, ai: 1, collaborative: 1 },
  },
  {
    date: 'Mar 26',
    title: 'Expandable Job Cards',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-polish',
    blocks: [
      { id: 'otm-session-67', dayId: 'Mar 26', label: 'Expandable Job Cards', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 30, linesAdded: 15, linesDeleted: 1, note: 'Expandable job cards (#29, PR #7). Show more toggle for full description, posted date, source.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 15, linesDeleted: 1, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 27',
    title: 'Platform Data Prep + Parser Rewrite',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-content',
    blocks: [
      { id: 'otm-session-68', dayId: 'Mar 27', label: 'Platform Data Prep + Parser Rewrite', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 180, linesAdded: 886, linesDeleted: 159, note: 'Content generator + CopyBlock + 13 platform configs (PR #8). LinkedIn PDF parser rewrite (PR #9, still incomplete).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 180, linesAdded: 886, linesDeleted: 159, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 28',
    title: 'Checklist Overhaul + Unified PDF Import',
    projectId: 'on-the-move',
    phase: 'Build',
    chapterId: 'ch-ai',
    blocks: [
      { id: 'otm-session-69', dayId: 'Mar 28', label: 'Checklist Overhaul + Auto-Deploy', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 220, linesDeleted: 42, note: 'Rich checklist items with auto-completion (PR #10). GH Actions auto-deploy (PR #11).', contextWindowOrigin: false },
      { id: 'otm-session-70', dayId: 'Mar 28', label: 'Unified PDF Import (Workers AI)', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 150, linesAdded: 1077, linesDeleted: 480, note: 'Replaced split import with unified flow. CF Workers AI (Llama 3.1 8B) for parsing. Side-by-side review. Guidance hints. Version history. PR #12 merged.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 210, linesAdded: 1297, linesDeleted: 522, totalDecisions: 3 },
    driverSummary: { human: 0, ai: 2, collaborative: 0 },
  },
];

// --- Bugs ---
export const otmBugs: BugEntry[] = [];

// --- Derived Metrics ---
export const otmDerived: DerivedMetric[] = [];

// --- Stack ---
export const otmStack: StackEntry[] = [];
