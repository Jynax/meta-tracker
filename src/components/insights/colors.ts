// Color constants shared by Insights chart components.
// Console data palette — flat hex for SVG fill/stroke compatibility.

export const PROJECT_COLORS = [
  '#6CE0D4', '#5BD6A0', '#E8C56B', '#A6A0F0',
  '#F2768E', '#6BA8E6', '#E8975B', '#6B7A88', '#A6A0F0',
];

export const DRIVER_COLORS: Record<string, string> = {
  'agent-led': '#6CE0D4',
  collaborative: '#E8C56B',
  human: '#5BD6A0',
  'human-only': '#A6A0F0',
};

export const DRIVER_LABELS: Record<string, string> = {
  'agent-led': 'Agent-Led',
  collaborative: 'Collaborative',
  human: 'Human',
  'human-only': 'Human Only',
};

export const CATEGORY_COLORS: Record<string, string> = {
  Feature: '#6CE0D4', Bug: '#F2768E', Refactor: '#A6A0F0', UX: '#E8975B',
  Tooling: '#5BD6A0', Testing: '#A6A0F0', Docs: '#6B7A88', Scripting: '#5BD6A0',
  Data: '#6BA8E6', 'Local-Tooling': '#5BD6A0', Planning: '#E8C56B',
};

export const PHASE_COLORS: Record<string, string> = {
  'Build-time': '#6BA8E6',
  'Interaction': '#E8975B',
  'Code Quality': '#A6A0F0',
  'Systemic': '#F2768E',
  'Integration': '#6CE0D4',
};
