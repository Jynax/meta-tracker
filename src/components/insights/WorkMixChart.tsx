import { C } from '../MetricsCard';
import { CATEGORY_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function WorkMixChart({ data }: ChartProps) {
  const totalBlocks = Object.values(data.workMix.aggregate).reduce((s, n) => s + n, 0);
  const sortedAggregate = Object.entries(data.workMix.aggregate).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {/* Aggregate bar */}
      <div className="mb-4">
        <div className="mb-1 text-xs" style={{ color: C.muted }}>Portfolio aggregate ({totalBlocks} blocks)</div>
        <div className="flex rounded-md overflow-hidden" style={{ height: 28 }}>
          {sortedAggregate.map(([cat, count]) => (
            <div
              key={cat}
              style={{
                width: `${(count / totalBlocks) * 100}%`,
                backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8',
                minWidth: count > 0 ? 4 : 0,
                borderRight: '1px solid #0f172a',
                transition: 'width 300ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Per-project stacked bars */}
      <div className="space-y-3">
        {data.workMix.perProject.map(row => {
          const projectTotal = Object.values(row.categories).reduce((s, n) => s + n, 0);
          if (projectTotal === 0) return null;
          const sorted = Object.entries(row.categories).sort((a, b) => b[1] - a[1]);
          return (
            <div key={row.projectId}>
              <div className="mb-1 text-xs" style={{ color: C.muted }}>{row.projectName}</div>
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
      </div>

      {/* Single legend at bottom, serving both aggregate and per-project */}
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {sortedAggregate.map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] ?? '#94a3b8' }} />
            {cat}: {Math.round((count / totalBlocks) * 100)}%
          </div>
        ))}
      </div>
    </div>
  );
}
