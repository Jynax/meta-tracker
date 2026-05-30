// Shared color constants for the ProcessWorkflow view

const colors = {
  bg: "#0E1419",
  cardBg: "#141C23",
  border: "rgba(108,224,212,0.18)",
  borderHover: "rgba(108,224,212,0.33)",
  text: "#E8F0F5",
  muted: "#8BA3B0",
  slate: "#6B7A88",
  cyan: "#6CE0D4",
  cyanDim: "rgba(108,224,212,0.08)",
  violet: "#A6A0F0",
  violetDim: "rgba(166,160,240,0.08)",
  emerald: "#5BD6A0",
  emeraldDim: "rgba(91,214,160,0.08)",
  amber: "#E8C56B",
  amberDim: "rgba(232,197,107,0.08)",
  rose: "#F2768E",
  roseDim: "rgba(242,118,142,0.08)",
} as const;


type ColorsType = typeof colors;

export { colors };
export type { ColorsType };

export type ProcessCategory = 'tooling' | 'process' | 'ui';

export const categoryColors: Record<ProcessCategory, { full: string; dim: string; label: string }> = {
  tooling: { full: colors.cyan, dim: colors.cyanDim, label: 'Tooling' },
  process: { full: colors.violet, dim: colors.violetDim, label: 'Process' },
  ui: { full: colors.emerald, dim: colors.emeraldDim, label: 'UI / Presentation' },
};

export interface ProcessHistoryEntry {
  date: string;
  title: string;
  before: string;
  after: string;
  rationale: string;
  session: string;
  sessionNumber: number;
  category: ProcessCategory;
}

export const processHistory: ProcessHistoryEntry[] = [
  {
    date: 'Mar 5, 2026',
    title: 'Cowork retired — Claude Code promoted',
    before: 'Cowork (browser automation) handled direct edits, data file updates, config changes, and Codex task submission via browser scripting',
    after: 'Claude Code CLI handles all of the above directly from the terminal — no browser needed, no container crashes, no login loops',
    rationale: 'Claude Code proved dramatically faster and more reliable. Fewer moving parts, direct git access, and no browser automation overhead made it the clear replacement.',
    session: 'Session 22',
    sessionNumber: 22,
    category: 'tooling',
  },
  {
    date: 'Mar 5, 2026',
    title: 'All code changes go through PRs',
    before: 'Small/data changes committed directly to main; PRs only for substantial features',
    after: 'Every code change goes through a PR — no direct commits to main',
    rationale: 'Direct commits caused failed deploys to go unnoticed and made PR metrics inaccurate. PRs give better visibility, safety, and tracking.',
    session: 'Session 22',
    sessionNumber: 22,
    category: 'process',
  },
  {
    date: 'Mar 5, 2026',
    title: 'Claude Code CLI added as a build tool',
    before: 'Cowork (browser automation) and Codex were the two build tools',
    after: 'Claude Code CLI added — direct repo access, no browser needed',
    rationale: 'Claude Code can clone repos, run builds locally, push branches, and create PRs without browser automation overhead. Faster for batch tasks.',
    session: 'Session 20',
    sessionNumber: 20,
    category: 'tooling',
  },
  {
    date: 'Mar 4, 2026',
    title: 'Session passoffs replaced with living documents',
    before: 'Versioned session passoff docs (Session 1 Passoff → Session 2 Brief → ...) forming a chain',
    after: 'Living docs per project: STATUS.md (current state), tasks/ folder (work queue), decisions.md (history), metrics.md (quantitative). START HERE.md as universal entry point.',
    rationale: 'The passoff chain grew unwieldy (16 sessions). Living docs stay current without growing linearly. Any tool can read STATUS.md and pick up where the last left off.',
    session: 'Session 16',
    category: 'process',
    sessionNumber: 16,
  },
  {
    date: 'Mar 4, 2026',
    title: 'Task-based workflow adopted',
    before: 'Work described in session briefs and passoff docs; no persistent task queue',
    after: 'Individual task .md files in tasks/ folder with status, dependencies, acceptance criteria. Task index for at-a-glance view.',
    rationale: 'Tasks are atomic, trackable, and can be assigned to different tools (Claude Code, Codex). Dependencies and parallel safety are explicit.',
    category: 'process',
    session: 'Session 16',
    sessionNumber: 16,
  },
  {
    date: 'Mar 4, 2026',
    title: 'Date-based labeling replaces session numbers',
    before: 'All UI labels used "Session N" format (Session 1, Session 2, ...)',
    after: 'Labels show "Date — Descriptor" (e.g. "Feb 26 — Scaffold & Auth")',
    category: 'ui',
    rationale: 'Session numbers were meaningless to anyone who wasn\'t tracking them. Dates and descriptors make the timeline self-explanatory.',
    session: 'Session 19',
    sessionNumber: 19,
  },
  {
    date: 'Mar 3, 2026',
    title: 'How We Work view added as process reference',
    before: 'Process knowledge lived only in passoff docs and conversation history',
    category: 'ui',
    after: 'Dedicated "How We Work" view in the app with Workflow, Task Routing, and Patterns tabs',
    rationale: 'Makes the development process visible and browsable alongside the project data. Useful as onboarding for any new tool or session.',
    session: 'Session 15',
    sessionNumber: 15,
  },
];

