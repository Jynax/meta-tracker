import { C } from '../MetricsCard';
import { PROJECT_COLORS } from './colors';
import type { ChartProps } from './chartProps';

export function TimelineChart({ data }: ChartProps) {
  const allDates = Array.from(new Set(data.timeline.flatMap(r => [r.firstDate, r.lastDate, ...r.sessionDates]))).sort((a, b) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [am, ad] = a.split(' ');
    const [bm, bd] = b.split(' ');
    return (months.indexOf(am) * 100 + parseInt(ad)) - (months.indexOf(bm) * 100 + parseInt(bd));
  });

  if (allDates.length === 0) return <div style={{ color: C.muted }}>No timeline data</div>;

  const dateToX = (date: string) => {
    const idx = allDates.indexOf(date);
    return idx >= 0 ? idx : 0;
  };

  const laneHeight = 32;
  const laneGap = 8;
  const labelWidth = 160;
  const chartWidth = 660;
  const totalHeight = data.timeline.length * (laneHeight + laneGap) + 30;
  const dateRange = allDates.length - 1 || 1;

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth + labelWidth + 20} height={totalHeight} className="w-full" viewBox={`0 0 ${chartWidth + labelWidth + 20} ${totalHeight}`}>
        {allDates.filter((_, i) => i % Math.max(1, Math.floor(allDates.length / 8)) === 0 || i === allDates.length - 1).map(date => {
          const x = labelWidth + (dateToX(date) / dateRange) * chartWidth;
          return <text key={date} x={x} y={totalHeight - 4} fill={C.muted} fontSize={11} textAnchor="middle">{date}</text>;
        })}
        {data.timeline.map((row, i) => {
          const y = i * (laneHeight + laneGap) + 4;
          const x1 = labelWidth + (dateToX(row.firstDate) / dateRange) * chartWidth;
          const x2 = labelWidth + (dateToX(row.lastDate) / dateRange) * chartWidth;
          const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
          return (
            <g key={row.projectId}>
              <text x={labelWidth - 8} y={y + laneHeight / 2 + 4} textAnchor="end" fill={C.muted} fontSize={12}>{row.projectName}</text>
              <rect x={x1} y={y + 4} width={Math.max(x2 - x1, 4)} height={laneHeight - 8} rx={4} fill={color} opacity={0.2} />
              {row.sessionDates.map((date, di) => {
                const dx = labelWidth + (dateToX(date) / dateRange) * chartWidth;
                return <circle key={di} cx={dx} cy={y + laneHeight / 2} r={3} fill={color} opacity={0.9} />;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
