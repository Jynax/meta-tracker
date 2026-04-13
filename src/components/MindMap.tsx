import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  type Edge,
  type Node,
  type NodeTypes,
} from '@xyflow/react';
import type { Project } from '../types';
import {
  buildMindMapLayout,
  getTier1Neighbors,
  getTier2Relatives,
  NODE_TYPE_COLORS,
  NODE_TYPE_LABELS,
  type MindMapNodeDatum,
} from '../utils/mindMapLayout';
import { MindMapNode, type MindMapNodeData } from './MindMapNode';
import type { NodeType } from '../types';

interface MindMapProps {
  project: Project;
}

interface ChapterLabelData extends Record<string, unknown> {
  name: string;
  nodeCount: number;
}

function ChapterLabel({ data }: { data: ChapterLabelData }) {
  return (
    <div
      style={{
        pointerEvents: 'none',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        color: 'var(--theme-text-muted, #94a3b8)',
        textTransform: 'uppercase',
        opacity: 0.55,
        whiteSpace: 'nowrap',
        textShadow: '0 1px 3px rgba(15,23,42,0.9)',
      }}
    >
      {data.name}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  mindMapNode: MindMapNode,
  chapterLabel: ChapterLabel as unknown as NodeTypes[string],
};

export default function MindMap({ project }: MindMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const layout = useMemo(() => buildMindMapLayout(project), [project]);

  const tier1 = useMemo(() => (selectedId ? getTier1Neighbors(selectedId, layout.edges) : new Set<string>()), [selectedId, layout.edges]);
  const tier2 = useMemo(
    () => (selectedId ? getTier2Relatives(selectedId, layout.nodes, tier1) : new Set<string>()),
    [selectedId, layout.nodes, tier1],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const resolveTier = useCallback(
    (nodeId: string): 1 | 2 | 3 => {
      if (!selectedId) return 1;
      if (nodeId === selectedId) return 1;
      if (tier1.has(nodeId)) return 1;
      if (tier2.has(nodeId)) return 2;
      return 3;
    },
    [selectedId, tier1, tier2],
  );

  const flowNodes: Node[] = useMemo(() => {
    const base: Node[] = layout.nodes.map((n: MindMapNodeDatum) => {
      const data: MindMapNodeData = {
        title: n.title,
        nodeType: n.type,
        tier: resolveTier(n.id),
        selected: selectedId === n.id,
        hovered: hoveredId === n.id,
        onSelect: handleSelect,
      };
      return {
        id: n.id,
        type: 'mindMapNode',
        position: { x: n.x ?? 0, y: n.y ?? 0 },
        data: data as unknown as Record<string, unknown>,
        draggable: false,
        selectable: false,
      };
    });

    const labels: Node[] = layout.chapterCentroids.map((c) => ({
      id: `chapter-label-${c.chapterId}`,
      type: 'chapterLabel',
      position: { x: c.x - 60, y: c.y - 90 },
      data: { name: c.name, nodeCount: c.nodeCount } as unknown as Record<string, unknown>,
      draggable: false,
      selectable: false,
    }));

    return [...labels, ...base];
  }, [layout, resolveTier, selectedId, hoveredId, handleSelect]);

  const flowEdges: Edge[] = useMemo(() => {
    return layout.edges.map((e) => {
      const involvesSelected = selectedId && (e.source === selectedId || e.target === selectedId);
      const dimmed = selectedId && !involvesSelected;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'default',
        style: {
          stroke: dimmed ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.35)',
          strokeWidth: involvesSelected ? 1.8 : 1,
        },
      };
    });
  }, [layout.edges, selectedId]);

  return (
    <div
      className="h-[calc(100vh-220px)] overflow-hidden rounded-2xl border"
      style={{
        height: 'calc(100vh - 220px)',
        borderColor: 'var(--theme-border)',
        backgroundColor: 'var(--theme-bg)',
        position: 'relative',
      }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeMouseEnter={(_e, node) => {
          if (node.type === 'mindMapNode') setHoveredId(node.id);
        }}
        onNodeMouseLeave={() => setHoveredId(null)}
        onPaneClick={() => setSelectedId(null)}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.4, minZoom: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={'dots' as never} gap={24} size={1} color="rgba(148,163,184,0.08)" />
        <Controls className="!bg-slate-900 !border-slate-700" showInteractive={false} />
      </ReactFlow>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          gap: 12,
          fontSize: 10,
          color: 'var(--theme-text-muted, #94a3b8)',
          backgroundColor: 'rgba(15,23,42,0.75)',
          border: '1px solid var(--theme-border)',
          borderRadius: 8,
          padding: '6px 10px',
          pointerEvents: 'none',
        }}
      >
        {(Object.keys(NODE_TYPE_COLORS) as NodeType[]).map((t) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                backgroundColor: NODE_TYPE_COLORS[t],
                display: 'inline-block',
              }}
            />
            {NODE_TYPE_LABELS[t]}
          </span>
        ))}
      </div>
    </div>
  );
}
