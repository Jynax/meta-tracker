import type { NodeProps } from '@xyflow/react';
import type { NodeType } from '../types';
import { NODE_TYPE_COLORS } from '../utils/mindMapLayout';

export interface MindMapNodeData extends Record<string, unknown> {
  title: string;
  nodeType: NodeType;
  tier: 1 | 2 | 3;
  selected: boolean;
  hovered: boolean;
  hasSelection: boolean;
  onSelect: (id: string) => void;
}

export function MindMapNode({ id, data }: NodeProps) {
  const d = data as unknown as MindMapNodeData;
  const color = NODE_TYPE_COLORS[d.nodeType];
  const tier = d.tier;
  const opacity = tier === 1 ? 1 : tier === 2 ? 0.6 : 0.15;
  const showLabel = d.selected || d.hovered || (d.hasSelection && tier === 1);
  const ring = d.selected ? '2px solid #ffffff' : d.hovered ? `2px solid ${color}` : 'none';
  const outline = d.selected ? `0 0 0 3px ${color}66` : 'none';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        d.onSelect(id);
      }}
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        backgroundColor: color,
        border: ring === 'none' ? '1px solid rgba(255,255,255,0.25)' : ring,
        boxShadow: outline === 'none' ? 'none' : outline,
        cursor: 'pointer',
        padding: 0,
        opacity,
        transition: 'opacity 120ms ease-out, transform 120ms ease-out, box-shadow 120ms ease-out',
        transform: d.hovered || d.selected ? 'scale(1.15)' : 'scale(1)',
        position: 'relative',
      }}
      aria-label={d.title}
    >
      {showLabel && (
        <span
          style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: 10,
            color: 'var(--theme-text-secondary, #cbd5e1)',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            maxWidth: 140,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {d.title.length > 32 ? `${d.title.slice(0, 32)}…` : d.title}
        </span>
      )}
    </button>
  );
}
