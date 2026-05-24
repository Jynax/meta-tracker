// Color constants shared by Insights chart components.

export const PROJECT_COLORS = [
  'var(--theme-cyan)', 'var(--theme-emerald)', 'var(--theme-amber)', '#a78bfa',
  'var(--theme-rose)', '#60a5fa', '#f472b6', '#34d399', '#fbbf24',
];

export const DRIVER_COLORS: Record<string, string> = {
  'agent-led': 'var(--theme-cyan)',
  collaborative: 'var(--theme-amber)',
  human: 'var(--theme-emerald)',
  'human-only': '#a78bfa',
};

export const DRIVER_LABELS: Record<string, string> = {
  'agent-led': 'Agent-Led',
  collaborative: 'Collaborative',
  human: 'Human',
  'human-only': 'Human Only',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Feature: '#22d3ee', Bug: '#f43f5e', Refactor: '#a78bfa', UX: '#f59e0b',
  Tooling: '#34d399', Testing: '#818cf8', Docs: '#94a3b8', Scripting: '#34d399',
  Data: '#60a5fa', 'Local-Tooling': '#34d399', Planning: '#fbbf24',
};

export const PHASE_COLORS: Record<string, string> = {
  'Build-time': '#60a5fa',
  'Interaction': '#f59e0b',
  'Code Quality': '#a78bfa',
  'Systemic': '#f43f5e',
  'Integration': '#22d3ee',
};
