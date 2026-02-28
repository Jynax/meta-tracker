import { useMemo, useState } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import type { FilterType, Project } from '../types';
import { nodeTypes } from './CustomNodes';
import { buildTreeLayout } from './treeLayout';

const FILTERS: Array<{ id: FilterType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'decision', label: 'Decisions' },
  { id: 'dead-end', label: 'Dead Ends' },
  { id: 'event', label: 'Events' },
  { id: 'discovery', label: 'Discoveries' },
  { id: 'pivot', label: 'Pivots' },
  { id: 'technical', label: 'Technical' },
  { id: 'functional', label: 'Functional' },
  { id: 'ux-design', label: 'UX/Design' },
  { id: 'process', label: 'Process' },
];

const PROJECTS = [bipProject, metaProject];

export default function DecisionTree() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeProject, setActiveProject] = useState<Project>(bipProject);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['ch-spark']));
  const [detailNodes, setDetailNodes] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((current) => {
      const next = new Set(current);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
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

  const switchProject = (projectId: string) => {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (project) {
      setActiveProject(project);
      setExpandedChapters(new Set([project.chapters[0]?.id].filter(Boolean)));
      setDetailNodes(new Set());
      setFilter('all');
    }
  };

  const { nodes, edges } = useMemo(() => {
    const result = buildTreeLayout(activeProject, { expandedChapters, detailNodes, filter });
    return {
      nodes: result.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onToggleExpand: toggleChapter,
          onToggleDetail: toggleDetail,
        },
      })),
      edges: result.edges,
    };
  }, [activeProject, detailNodes, expandedChapters, filter]);

  return (
    <section className="mx-auto max-w-[1800px] px-4 py-8 text-slate-100 sm:px-8">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{activeProject.subtitle}</p>
        {PROJECTS.length > 1 && (
          <div className="mt-2 flex items-center gap-2">
            {PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => switchProject(proj.id)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  activeProject.id === proj.id
                    ? 'bg-slate-100 text-slate-950'
                    : 'border border-slate-700 bg-slate-800 text-slate-300 hover:brightness-110'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>
        )}
        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{activeProject.name}</h1>
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
          <Controls className="!bg-slate-900 !border-slate-700" />
          <Background variant="dots" gap={18} size={1.2} color="rgba(148,163,184,0.08)" />
        </ReactFlow>
      </div>
    </section>
  );
}
