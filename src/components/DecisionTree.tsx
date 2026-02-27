import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { bipProject } from '../data/bipProject';
import type { FilterType } from '../types';
import { nodeTypes } from './CustomNodes';
import { buildTreeLayout } from './treeLayout';

const FILTERS: Array<{ id: FilterType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'decision', label: 'Decisions' },
  { id: 'dead-end', label: 'Dead Ends' },
  { id: 'event', label: 'Events' },
  { id: 'technical', label: 'Technical' },
  { id: 'functional', label: 'Functional' },
];

export default function DecisionTree() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['phase-1']));
  const [detailNodes, setDetailNodes] = useState<Set<string>>(new Set());

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((current) => {
      const next = new Set(current);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  const toggleDetail = (nodeId: string) => {
    setDetailNodes((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const { nodes, edges } = useMemo(() => {
    const result = buildTreeLayout(bipProject, { expandedPhases, detailNodes, filter });
    return {
      nodes: result.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onToggleExpand: togglePhase,
          onToggleDetail: toggleDetail,
        },
      })),
      edges: result.edges,
    };
  }, [detailNodes, expandedPhases, filter]);

  return (
    <section className="mx-auto max-w-[1800px] px-4 py-8 text-slate-100 sm:px-8">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{bipProject.subtitle}</p>
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{bipProject.name}</h1>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 p-3">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              filter === item.id
                ? 'bg-slate-100 text-slate-950'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:brightness-110'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className="h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-slate-700"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ maxZoom: 1, minZoom: 0.1, padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          className="bg-[#0f172a]"
          style={{ backgroundColor: '#0f172a' }}
        >
          <MiniMap pannable zoomable className="!bg-slate-900/90" nodeStrokeColor="#38bdf8" />
          <Controls className="!bg-slate-900 !border-slate-700" />
          <Background variant="dots" gap={18} size={1.2} color="rgba(148,163,184,0.08)" />
        </ReactFlow>
      </div>
    </section>
  );
}
