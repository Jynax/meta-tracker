import type { WorkOperator } from '../../types/index';

export const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export const CHART_DIMS = { width: 920, height: 280, left: 48, right: 20, top: 16, bottom: 34 };
export const CHART_INNER_WIDTH = CHART_DIMS.width - CHART_DIMS.left - CHART_DIMS.right;
export const CHART_INNER_HEIGHT = CHART_DIMS.height - CHART_DIMS.top - CHART_DIMS.bottom;

export const OPERATOR_DISPLAY_NAMES: Record<WorkOperator, string> = {
  'claude-code': 'Claude Code',
  'claude-ai': 'Claude AI',
  cursor: 'Cursor',
  manual: 'Manual',
  mixed: 'Mixed',
};
