import { C } from '../MetricsCard';
import type { TooltipState } from './types';

export function TooltipLayer({ tooltip }: { tooltip: TooltipState }) {
  if (!tooltip) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: tooltip.x + 12,
        top: tooltip.y - 10,
        zIndex: 50,
        pointerEvents: 'none',
        backgroundColor: C.cardBg,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '6px 10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        maxWidth: 360,
      }}
    >
      {tooltip.content}
    </div>
  );
}
