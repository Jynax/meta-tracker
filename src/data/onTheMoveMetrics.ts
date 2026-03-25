import type { CodeVolumeEntry, SessionEntry } from './bipMetrics';
import type { DayEntry } from '../types/index';

// --- Code Volume ---
export const otmCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 62', date: 'Mar 23', label: 'Full MVP Build', added: 11462, deleted: 130, net: 11332, total: 11332 },
  { session: 'Session 64', date: 'Mar 24', label: 'OAuth Fix', added: 30, deleted: 20, net: 10, total: 11342 },
  { session: 'Session 66', date: 'Mar 25', label: 'Bug Fixes + LinkedIn PDF', added: 255, deleted: 12, net: 243, total: 11575 },
];

// --- Sessions ---
export const otmSessions: SessionEntry[] = [
  { session: 'Session 62', date: 'Mar 23', label: 'Full MVP Build', duration: 3, prs: 1, decisions: 5, deadEnds: 0, focus: 'All core features: auth, profile intake, platform onboarding (13 platforms), job search + scoring, admin dashboard. 16 commits, PR #1 merged.', chapterId: 'ch-mvp', workCategory: 'Feature', tool: 'Claude Code', taskCount: 14, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 64', date: 'Mar 24', label: 'OAuth Fix', duration: 1, prs: 1, decisions: 1, deadEnds: 1, focus: 'Diagnosed PKCE race condition with React Router. Switched to implicit OAuth flow + deferred React render.', chapterId: 'ch-polish', workCategory: 'Bug', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 65', date: 'Mar 25', label: 'UX Feedback Capture', duration: 0.5, prs: 0, decisions: 2, deadEnds: 0, focus: 'Michael tested the app. Captured 7 new tasks (#32-38). Analyzed LinkedIn export samples. Key decision: PDF is primary profile source.', chapterId: 'ch-polish', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 66', date: 'Mar 25', label: 'Deploy + Bugs + LinkedIn PDF', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: 'Deployed to CF Pages. Fixed 6 bugs (PR #3): new-user redirect, platform nav, checkboxes, job search. Built LinkedIn PDF parser (PR #4).', chapterId: 'ch-polish', workCategory: 'Bug', tool: 'Claude Code', taskCount: 10, phase: 'Build', driver: 'agent-led' },
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
];
