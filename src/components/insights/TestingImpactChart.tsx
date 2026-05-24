import { C } from '../MetricsCard';
import type { ChartProps } from './chartProps';

export function TestingImpactChart({ data }: ChartProps) {
  const withTests = ['item-b-gone', 'note-worthy', 'on-the-move'];
  const withoutTests = ['meta-tracker', 'bip'];

  const getGroup = (ids: string[], label: string) => {
    const projects = data.bugSummaries.filter(b => ids.includes(b.projectId));
    const totalBugs = projects.reduce((s, p) => s + p.totalBugs, 0);
    return { label, projects, totalBugs };
  };

  const groups = [
    getGroup(withTests, 'With Playwright Tests'),
    getGroup(withoutTests, 'Without Playwright Tests'),
  ];

  const maxBugs = Math.max(...groups.flatMap(g => g.projects.map(p => p.totalBugs)), 1);
  const barHeight = 22;
  const labelWidth = 140;
  const chartWidth = 400;

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.label}>
          <div className="text-xs font-medium mb-2" style={{ color: group.label.includes('With') ? 'var(--theme-emerald)' : 'var(--theme-rose)' }}>
            {group.label} — {group.totalBugs} total bugs
          </div>
          <svg width={chartWidth + labelWidth + 40} height={group.projects.length * (barHeight + 6) + 4} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 40} ${group.projects.length * (barHeight + 6) + 4}`}>
            {group.projects.map((proj, i) => {
              const y = i * (barHeight + 6) + 2;
              const w = (proj.totalBugs / maxBugs) * chartWidth;
              const color = group.label.includes('With') ? 'var(--theme-emerald)' : 'var(--theme-rose)';
              return (
                <g key={proj.projectId}>
                  <text x={labelWidth - 8} y={y + barHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={11}>{proj.projectName}</text>
                  <rect x={labelWidth} y={y} width={w} height={barHeight} rx={3} fill={color} opacity={0.7} />
                  <text x={labelWidth + w + 6} y={y + barHeight / 2 + 4} fill={C.muted} fontSize={10}>{proj.totalBugs}</text>
                </g>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}
