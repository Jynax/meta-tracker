import { C } from '../MetricsCard';
import type { ChartProps } from './chartProps';

export function VelocityChart({ data, setTooltip }: ChartProps) {
  const maxLoc = Math.max(...data.velocity.map(v => v.locPerHour), 1);
  const barHeight = 28;
  const labelWidth = 130;
  const chartWidth = 700;

  return (
    <div>
      <svg width={chartWidth + labelWidth + 80} height={data.velocity.length * (barHeight + 8) + 8} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 80} ${data.velocity.length * (barHeight + 8) + 8}`}>
        {data.velocity.map((row, i) => {
          const y = i * (barHeight + 8) + 4;
          const barW = maxLoc > 0 ? (row.locPerHour / maxLoc) * chartWidth : 0;
          const label = row.hasEstimatedHours ? `${row.projectName} †` : row.projectName;
          return (
            <g key={row.projectId}
              onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: (
                <div className="text-xs space-y-1">
                  <div style={{ color: C.white }} className="font-medium">{row.projectName}{row.hasEstimatedHours ? ' (estimated hours)' : ''}</div>
                  <div style={{ color: C.muted }}>{row.locPerHour.toLocaleString()} LOC/hr | {row.totalHours}h total | {row.prsPerSession} PRs/session</div>
                </div>
              )})}
              onMouseLeave={() => setTooltip(null)}
            >
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={12}>{label}</text>
              <rect x={labelWidth} y={y} width={barW} height={barHeight} rx={4} fill="var(--theme-cyan)" opacity={0.8} />
              <text x={labelWidth + barW + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={11}>{row.locPerHour.toLocaleString()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
