import { C } from '../MetricsCard';
import { CATEGORY_COLORS, PROJECT_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function LifecyclePhasesChart({ data }: ChartProps) {
  return (
    <div className="space-y-3">
      {data.workMix.perProject.map((row, pi) => {
        const projectTotal = Object.values(row.categories).reduce((s, n) => s + n, 0);
        if (projectTotal === 0) return null;
        const sorted = Object.entries(row.categories).sort((a, b) => b[1] - a[1]);
        return (
          <div key={row.projectId}>
            <div className="mb-1 text-xs" style={{ color: PROJECT_COLORS[pi % PROJECT_COLORS.length] }}>{row.projectName}</div>
            <div className="flex rounded-md overflow-hidden" style={{ height: 20 }}>
              {sorted.map(([cat, count]) => (
                <div
                  key={cat}
                  style={{
                    width: `${(count / projectTotal) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                    minWidth: count > 0 ? 3 : 0,
                    borderRight: '1px solid #0f172a',
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
      {/* Legend */}
      <div className="mt-0.5 flex flex-wrap gap-3 pt-1">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
