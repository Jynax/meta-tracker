import { C } from '../MetricsCard';
import { PHASE_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function BugLifecycleChart({ data, setTooltip }: ChartProps) {
  const projects = data.bugSummaries.filter(p => p.totalBugs > 0);
  if (projects.length === 0) return <div className="text-xs" style={{ color: C.muted }}>No bug data available.</div>;

  const maxBugs = Math.max(...projects.map(p => p.totalBugs), 1);
  const barHeight = 24;
  const labelWidth = 120;
  const chartWidth = 500;
  const phaseOrder: string[] = ['Build-time', 'Interaction', 'Code Quality', 'Systemic', 'Integration'];

  return (
    <div>
      <svg width={chartWidth + labelWidth + 60} height={projects.length * (barHeight + 8) + 40} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 60} ${projects.length * (barHeight + 8) + 40}`}>
        {projects.map((proj, i) => {
          const y = i * (barHeight + 8) + 4;
          let xOffset = labelWidth;
          return (
            <g key={proj.projectId}>
              <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{proj.projectName}</text>
              {phaseOrder.map(phase => {
                const p = proj.phases.find(ph => ph.phase === phase);
                if (!p || p.bugCount === 0) return null;
                const w = (p.bugCount / maxBugs) * chartWidth;
                const x = xOffset;
                xOffset += w;
                return (
                  <rect
                    key={phase}
                    x={x} y={y} width={w} height={barHeight} rx={2}
                    fill={PHASE_COLORS[phase] ?? C.muted}
                    opacity={0.85}
                    onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, content: (
                      <div className="text-xs">
                        <span style={{ color: PHASE_COLORS[phase] ?? C.muted }}>{phase}</span>
                        <span style={{ color: C.muted }}>: {p.bugCount} bugs</span>
                      </div>
                    )})}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
              <text x={xOffset + 6} y={y + barHeight / 2 + 4} fill={C.muted} fontSize={10}>{proj.totalBugs}</text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div className="mt-0.5 flex flex-wrap justify-center gap-3 pt-1" style={{ maxWidth: chartWidth + labelWidth + 60, margin: '2px auto 0' }}>
        {phaseOrder.map(phase => (
          <div key={phase} className="flex items-center gap-1.5 text-xs" style={{ color: C.muted }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: PHASE_COLORS[phase] }} />
            {phase}
          </div>
        ))}
      </div>
    </div>
  );
}
