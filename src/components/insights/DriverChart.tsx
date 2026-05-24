import { C } from '../MetricsCard';
import { DRIVER_COLORS, DRIVER_LABELS } from './colors';
import type { ChartProps } from './chartProps';

export function DriverChart({ data }: ChartProps) {
  const drivers = Object.entries(data.drivers).sort((a, b) => b[1].totalLoc - a[1].totalLoc);
  const maxLoc = Math.max(...drivers.map(([, s]) => s.totalLoc), 1);

  return (
    <div className="space-y-4">
      {drivers.map(([driver, stats]) => {
        const color = DRIVER_COLORS[driver] ?? C.muted;
        const label = DRIVER_LABELS[driver] ?? driver;
        const barPct = maxLoc > 0 ? (stats.totalLoc / maxLoc) * 100 : 0;
        return (
          <div key={driver}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
              <span className="text-xs" style={{ color: C.muted }}>{stats.blockCount} blocks</span>
            </div>
            <div className="h-5 rounded-md overflow-hidden" style={{ backgroundColor: C.bg }}>
              <div className="h-full rounded-md transition-all" style={{ width: `${barPct}%`, backgroundColor: color, opacity: 0.8 }} />
            </div>
            <div className="mt-1 flex gap-4 text-xs" style={{ color: C.muted }}>
              <span>{stats.totalLoc.toLocaleString()} LOC</span>
              <span>{Math.round(stats.totalHours)}h</span>
              <span>{stats.bugsPerBlock} bugs/block</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
