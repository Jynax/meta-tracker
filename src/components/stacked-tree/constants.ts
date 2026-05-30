import { C } from '../MetricsCard';
import type { NodeCategory } from '../../types';

export const EPIC_STATUS_COLOR: Record<string, string> = {
  'In Progress': C.cyan,
  Done: C.emerald,
  Retired: C.slate,
  Cancelled: C.rose,
  Queued: C.amber,
};

export const TASK_STATUS_COLOR: Record<string, string> = {
  Done: C.emerald,
  'In Progress': C.cyan,
  Queued: C.amber,
  Blocked: C.rose,
  Cancelled: C.slate,
  Retired: C.muted,
};

export const TASK_TOOL_COLOR: Record<string, string> = {
  'claude-code': C.emerald,
  'claude-ai': C.cyan,
  cursor: C.amber,
  cowork: C.slate,
  manual: C.violet,
  mixed: C.violet,
};

export const PHASE_COLORS: Record<string, string> = {
  Research: '#6BA8E6',
  Spec: C.violet,
  Build: C.amber,
  Review: '#E8975B',
  Shipped: C.emerald,
};

export const CATEGORY_ORDER: NodeCategory[] = ['technical', 'functional', 'ux-design', 'process'];

export const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
