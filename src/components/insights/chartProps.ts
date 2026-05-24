import type { ReactNode } from 'react';
import type { InsightsData } from '../../utils/insightsData';

export interface ChartProps {
  data: InsightsData;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}
