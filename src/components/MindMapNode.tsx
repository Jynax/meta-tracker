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
  featured: boolean;
  degree: number;
  zoom: number;
  onSelect: (id: string) => void;
}

const FEATURED_HALO = 'rgba(167,139,250,0.65)';
const FEATURED_GLOW = 'rgba(167,139,250,0.35)';
const HUB_ZOOM = 0.9;
const HUB_DEGREE = 4;
const DETAIL_ZOOM = 1.4;

export function MindMapNode({ id, data }: NodeProps) {
  const d = data as unknown as MindMapNodeData;
  const color = NODE_TYPE_COLORS[d.nodeType];
  const tier = d.tier;
  const opacity = tier === 1 ? 1 : tier === 2 ? 0.6 : 0.15;

  const showLabel =
    d.selected ||
    d.hovered ||
    d.featured ||
    (d.hasSelection && tier === 1) ||
    d.zoom >= DETAIL_ZOOM ||
    (d.zoom >= HUB_ZOOM && d.degree >= HUB_DEGREE);

  const size = d.featured ? 22 : 18;
  const ring = d.selected
    ? '2px solid #ffffff'
    : d.hovered
      ? `2px solid ${color}`
      : d.featured
        ? `2px solid ${FEATURED_HALO}`
        : 'none';
  const boxShadow = d.selected
    ? `0 0 0 3px ${color}66`
    : d.featured
      ? `0 0 0 3px ${FEATURED_HALO}, 0 0 14px ${FEATURED_GLOW}`
      : 'none';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        d.onSelect(id);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        border: ring === 'none' ? '1px solid rgba(255,255,255,0.25)' : ring,
        boxShadow,
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
            top: size + 4,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: d.featured ? 11 : 10,
            color: d.featured ? '#e2e8f0' : 'var(--theme-text-secondary, #cbd5e1)',
            fontWeight: d.featured ? 600 : 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {d.title.length > 36 ? `${d.title.slice(0, 36)}…` : d.title}
        </span>
      )}
    </button>
  );
}
