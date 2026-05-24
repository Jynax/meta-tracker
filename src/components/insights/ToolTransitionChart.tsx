import { C } from '../MetricsCard';
import { PHASE_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function ToolTransitionChart({ data }: ChartProps) {
  const mt = data.bugSummaries.find(b => b.projectId === 'meta-tracker');
  if (!mt || mt.phases.length === 0) return <div className="text-xs" style={{ color: C.muted }}>No Meta Tracker bug data.</div>;

  const maxBugs = Math.max(...mt.phases.map(p => p.bugCount), 1);
  const barHeight = 28;
  const labelWidth = 100;
  const chartWidth = 400;

  return (
    <div>
      <div className="text-xs mb-2" style={{ color: C.muted }}>Meta Tracker bugs by phase — highlighting integration regressions from tool transitions</div>
      <svg width={chartWidth + labelWidth + 60} height={mt.phases.length * (barHeight + 8) + 4} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 60} ${mt.phases.length * (barHeight + 8) + 4}`}>
        {mt.phases.map((phase, i) => {
          const y = i * (barHeight + 8) + 2;
          const w = (phase.bugCount / maxBugs) * chartWidth;
          const color = PHASE_COLORS[phase.phase] ?? C.muted;
          return (
            <g key={phase.phase}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{phase.phase}</text>
              <rect x={labelWidth} y={y} width={w} height={barHeight} rx={3} fill={color} opacity={0.85} />
              <text x={labelWidth + w + 6} y={y + barHeight / 2 + 4} fill={C.white} fontSize={11}>{phase.bugCount}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
