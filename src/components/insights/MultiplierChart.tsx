import { C } from '../MetricsCard';
import type { ChartProps } from './chartProps';

export function MultiplierChart({ data }: ChartProps) {
  return (
    <div className="space-y-3">
      {data.researchComparisons.map((row, i) => (
        <div key={i} className="rounded-lg border p-3" style={{ backgroundColor: C.bg, borderColor: C.border }}>
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--theme-amber)' }}>{row.source}</div>
          <div className="text-sm mb-1" style={{ color: C.muted }}><strong style={{ color: C.white }}>Finding:</strong> {row.finding}</div>
          <div className="text-sm" style={{ color: C.muted }}><strong style={{ color: C.white }}>Our result:</strong> {row.ourResult}</div>
        </div>
      ))}
    </div>
  );
}
