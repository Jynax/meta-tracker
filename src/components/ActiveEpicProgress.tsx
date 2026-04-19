import { useMemo, useState, type ReactNode } from 'react';
import { getEpicCumulativeSeries } from '../utils/trackerDataAdapter';

interface ActiveEpicProgressProps {
  projectId: string;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function ActiveEpicProgress({ projectId: _projectId, setTooltip: _setTooltip }: ActiveEpicProgressProps) {
  const [includeAll, setIncludeAll] = useState(false);

  const series = useMemo(
    () =>
      getEpicCumulativeSeries({
        now: new Date(),
        windowDays: 30,
        plotWindowWeeks: 8,
        cap: 6,
        includeAll,
      }),
    [includeAll],
  );

  return (
    <div
      style={{
        background: '#0f1419',
        border: '1px solid #1e293b',
        borderRadius: 10,
        padding: '16px 20px 20px',
        color: '#e2e8f0',
        fontFamily: 'ui-sans-serif, system-ui',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>Active Epic Progress</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Cumulative tasks completed — last 30 days + stalled
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setIncludeAll(false)}
            aria-pressed={!includeAll}
            style={toggleStyle(!includeAll)}
          >
            Active + stalled
          </button>
          <button
            type="button"
            onClick={() => setIncludeAll(true)}
            aria-pressed={includeAll}
            style={toggleStyle(includeAll)}
          >
            All epics
          </button>
        </div>
      </div>

      <svg viewBox="0 0 900 300" width="100%" style={{ marginTop: 14 }} role="img" aria-label={`Cumulative task completion chart, ${series.length} epics visible`}>
        {/* gridlines + axes + curves come in Tasks 7–9 */}
        <text x="450" y="150" textAnchor="middle" fill="#64748b" fontSize="12">
          {series.length} series loaded
        </text>
      </svg>
    </div>
  );
}

function toggleStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11,
    padding: '4px 10px',
    border: `1px solid ${active ? '#475569' : '#334155'}`,
    borderRadius: 14,
    background: active ? '#1e293b' : '#0f1419',
    color: active ? '#e2e8f0' : '#94a3b8',
    cursor: 'pointer',
  };
}
