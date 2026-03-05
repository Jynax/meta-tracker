import { useCallback, useMemo, useState } from 'react';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { remnantsProject } from '../data/remnantsProject';
import type { FilterType, NodeCategory, Project, ProjectNode } from '../types';
import { nodeTypes } from './CustomNodes';
import MetricsDashboard from './MetricsDashboard';
import ProcessWorkflow from './ProcessWorkflow';
import ErrorBoundary from './ErrorBoundary';
import StackedTreeView from './StackedTreeView';
import type { TreeNodeData } from './treeLayout';
import { buildTreeLayout } from './treeLayout';
import { ExternalLink } from 'lucide-react';

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

const PROJECTS = [bipProject, metaProject, remnantsProject];

const CATEGORY_META: Array<{ id: NodeCategory; label: string; color: string }> = [
  { id: 'technical', label: 'Technical', color: '#22d3ee' },
  { id: 'functional', label: 'Functional', color: '#34d399' },
  { id: 'ux-design', label: 'UX/Design', color: '#fbbf24' },
  { id: 'process', label: 'Process', color: '#a78bfa' },
];

type ChapterStat = {
  entries: number;
  deadEnds: number;
  discoveries: number;
  pivots: number;
  bugs: number;
  categories: Record<NodeCategory, number>;
};

const getChapterStats = (chapterNodes: ProjectNode[]): ChapterStat => ({
  entries: chapterNodes.length,
  deadEnds: chapterNodes.filter((node) => node.type === 'dead-end').length,
  discoveries: chapterNodes.filter((node) => node.type === 'discovery').length,
  pivots: chapterNodes.filter((node) => node.type === 'pivot').length,
  bugs: chapterNodes.filter((node) => /\bbugs?\b/i.test(`${node.title} ${node.description} ${node.lesson ?? ''}`)).length,
  categories: {
    technical: chapterNodes.filter((node) => node.category === 'technical').length,
    functional: chapterNodes.filter((node) => node.category === 'functional').length,
    'ux-design': chapterNodes.filter((node) => node.category === 'ux-design').length,
    process: chapterNodes.filter((node) => node.category === 'process').length,
  },
});

function CategoryBar({ categories, total, compact = false }: { categories: Record<NodeCategory, number>; total: number; compact?: boolean }) {
  const visibleCategories = CATEGORY_META.filter((category) => categories[category.id] > 0);
  return (
    <div
      className="flex overflow-hidden rounded-full"
      style={{ height: compact ? 12 : 24, width: compact ? 120 : '100%', backgroundColor: '#0f172a' }}
    >
      {visibleCategories.map((category, idx) => {
        const count = categories[category.id];
        if (!count || !total) return null;
        const widthPercent = (count / total) * 100;
        return (
          <div
            key={category.id}
            className="flex items-center justify-center text-[10px] font-semibold"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: category.color,
              color: '#0f172a',
              borderRight: idx < visibleCategories.length - 1 ? '2px solid #0f172a' : 'none',
            }}
          >
            {!compact && widthPercent > 12 ? `${category.label} (${count})` : null}
          </div>
        );
      })}
    </div>
  );
}

function PhaseNodeWithStats({ id, data }: { id: string; data: TreeNodeData & { onToggleExpand?: (id: string) => void; chapterStats?: ChapterStat; onJumpToMetrics?: (tab: 'overview' | 'code' | 'bugs' | 'sessions') => void } }) {
  const isRoot = data.kind === 'root';
  const stats = data.chapterStats;

  return (
    <div className={`${isRoot ? 'w-64' : 'w-[280px]'} rounded-xl border border-sky-400/60 bg-slate-800/90 p-4 text-slate-100 shadow-lg transition hover:brightness-110`}>
      {!isRoot && <Handle type="target" position={Position.Top} id="top" className="!bg-sky-300" />}
      {!isRoot && <Handle type="target" position={Position.Top} id="top-right" style={{ left: 'calc(50% + 36px)' }} className="!bg-sky-300" />}

      <button className="w-full text-left" onClick={() => data.onToggleExpand?.(id)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{isRoot ? 'Project' : 'Chapter'}</p>
            <h3 className="mt-1 text-lg font-semibold">{data.label}</h3>
            {data.period && <p className="mt-1 text-xs text-slate-300">{data.period}</p>}
          </div>
          {!isRoot && <span className="text-slate-300">{data.expanded ? String.fromCharCode(0x2212) : '+'}</span>}
        </div>

        {!isRoot && !data.expanded && stats && (
          <div className="mt-2 flex items-center gap-[10px] text-xs text-slate-300">
            <CategoryBar categories={stats.categories} total={stats.entries} compact />
            <span>{stats.entries} entries</span>
            {stats.deadEnds > 0 && <span style={{ color: '#fb7185' }}>{stats.deadEnds} dead ends</span>}
            {stats.discoveries > 0 && <span style={{ color: '#fbbf24' }}>{stats.discoveries} discoveries</span>}
            {stats.pivots > 0 && <span style={{ color: '#a78bfa' }}>{stats.pivots} pivots</span>}
            {stats.bugs > 0 && (
              <button
                type="button"
                className="underline decoration-dotted"
                style={{ color: '#fb7185' }}
                onClick={(event) => {
                  event.stopPropagation();
                  data.onJumpToMetrics?.('bugs');
                }}
              >
                {stats.bugs} bugs
              </button>
            )}
          </div>
        )}
      </button>

      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-sky-300" />
      {!isRoot && <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ left: 'calc(50% + 36px)' }} className="!bg-sky-300" />}
      {!isRoot && <Handle type="source" position={Position.Right} id="right" className="!bg-sky-300" />}
      {!isRoot && <Handle type="source" position={Position.Left} id="left" className="!bg-sky-300" />}
    </div>
  );
}

export default function DecisionTree() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<'tree' | 'metrics'>('tree');
  const [showHowWeWork, setShowHowWeWork] = useState(false);
  const [treeMode, setTreeMode] = useState<'stacked' | 'canvas'>('stacked');
  const [metricsTab, setMetricsTab] = useState<'overview' | 'code' | 'bugs' | 'sessions'>('overview');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project>(metaProject);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [detailNodes, setDetailNodes] = useState<Set<string>>(new Set());

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters((current) => {
      const next = new Set(current);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  }, []);

  const toggleDetail = useCallback((nodeId: string) => {
    setDetailNodes((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const switchProject = (projectId: string) => {
    const project = PROJECTS.find((p) => p.id === projectId);
    if (project) {
      setActiveProject(project);
      setExpandedChapters(new Set());
      setExpandedNode(null);
      setDetailNodes(new Set());
      setFilter('all');
      setFiltersExpanded(false);
      setView('tree');
      setTreeMode('stacked');
      setMetricsTab('overview');
    }
  };

  const activeFilterLabel = FILTERS.find((item) => item.id === filter)?.label;

  const projectSummary = useMemo(() => {
    const chapterStats = Object.fromEntries(activeProject.chapters.map((chapter) => [chapter.id, getChapterStats(chapter.nodes)]));
    const allNodes = activeProject.chapters.flatMap((chapter) => chapter.nodes);
    const allStats = getChapterStats(allNodes);
    return {
      chapterStats,
      entries: allStats.entries,
      deadEnds: allStats.deadEnds,
      discoveries: allStats.discoveries,
      pivots: allStats.pivots,
      categories: allStats.categories,
    };
  }, [activeProject]);

  const { nodes, edges } = useMemo(() => {
    const result = buildTreeLayout(activeProject, { expandedChapters, detailNodes, filter });
    return {
      nodes: result.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onToggleExpand: toggleChapter,
          onToggleDetail: toggleDetail,
          onJumpToMetrics: (tab: 'overview' | 'code' | 'bugs' | 'sessions') => {
            setMetricsTab(tab);
            setView('metrics');
          },
          chapterStats: projectSummary.chapterStats[node.id],
        },
      })),
      edges: result.edges,
    };
  }, [activeProject, detailNodes, expandedChapters, filter, projectSummary.chapterStats]);

  const enhancedNodeTypes = useMemo(() => ({ ...nodeTypes, phaseNode: PhaseNodeWithStats }), []);

  return (
    <section className="mx-auto max-w-[1800px] px-4 py-8 text-slate-100 sm:px-8">
      <header className="mb-5 border-b border-slate-700 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{activeProject.subtitle}</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {activeProject.name}
              {activeProject.url && (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 inline-flex items-center align-middle rounded-md px-2 py-1 text-xs font-medium transition hover:brightness-125"
                  style={{ backgroundColor: '#22d3ee15', color: '#22d3ee', border: '1px solid #22d3ee33', verticalAlign: 'middle' }}
                >
                  <ExternalLink size={12} className="mr-1" />
                  Visit App
                </a>
              )}
            </h1>
          </div>
          <button
            onClick={() => setShowHowWeWork(true)}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
            style={{ borderColor: '#334155', backgroundColor: '#1e293b', color: '#94a3b8' }}
          >
            ℹ️ How We Work
          </button>
        </div>

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

        <div className="mt-3 flex items-end gap-2">
          <button
            onClick={() => setView('tree')}
            className="rounded-t-[8px] border-b-2 px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: view === 'tree' ? '#1e293b' : 'transparent',
              color: view === 'tree' ? '#f8fafc' : '#64748b',
              borderBottomColor: view === 'tree' ? '#22d3ee' : 'transparent',
            }}
          >
            🌳 Decision Tree
          </button>
          <button
            onClick={() => setView('metrics')}
            className="rounded-t-[8px] border-b-2 px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: view === 'metrics' ? '#1e293b' : 'transparent',
              color: view === 'metrics' ? '#f8fafc' : '#64748b',
              borderBottomColor: view === 'metrics' ? '#22d3ee' : 'transparent',
            }}
          >
            📊 Metrics
          </button>
        </div>
      </header>

      {view === 'tree' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', fontWeight: 700 }}>View:</span>
            {(['stacked', 'canvas'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTreeMode(mode)}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: `1px solid ${treeMode === mode ? '#22d3ee40' : '#334155'}`,
                  background: treeMode === mode ? '#22d3ee20' : 'transparent',
                  color: treeMode === mode ? '#22d3ee' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                {mode === 'stacked' ? 'Stacked' : 'Canvas'}
              </button>
            ))}
          </div>

          {treeMode === 'canvas' && (
            <>
              <div
                className="mb-4 rounded-xl border"
                style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '14px 20px' }}
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <span>{projectSummary.entries} entries</span>
                  <span className="text-slate-500">|</span>
                  {projectSummary.deadEnds > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: '#fb718522', color: '#fb7185' }}>{projectSummary.deadEnds} dead ends</span>}
                  {projectSummary.discoveries > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: '#fbbf2422', color: '#fbbf24' }}>{projectSummary.discoveries} discoveries</span>}
                  {projectSummary.pivots > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: '#a78bfa22', color: '#a78bfa' }}>{projectSummary.pivots} pivots</span>}
                </div>
                <div className="mt-2">
                  <CategoryBar categories={projectSummary.categories} total={projectSummary.entries} />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-[14px] text-[10px] text-slate-300">
                  {CATEGORY_META.map((category) => (
                    <span key={category.id} className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-[2px]" style={{ backgroundColor: category.color }} />
                      {category.label} {projectSummary.categories[category.id]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/80 p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFiltersExpanded((current) => !current)}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 transition hover:brightness-110"
                  >
                    Filter
                  </button>
                  {filter !== 'all' && (
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-300">{activeFilterLabel}</span>
                  )}
                </div>
                {(filtersExpanded || filter !== 'all') && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {FILTERS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setFilter(item.id);
                          setFiltersExpanded(false);
                        }}
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
                )}
              </div>
            </>
          )}

          {treeMode === 'stacked' ? (
            <ErrorBoundary fallbackLabel="Decision Tree">
            <StackedTreeView
              project={activeProject}
              filter={filter}
              onFilterChange={(nextFilter) => setFilter(nextFilter as FilterType)}
              expandedChapters={expandedChapters}
              onChapterToggle={toggleChapter}
              expandedNode={expandedNode}
              onNodeToggle={(id) => setExpandedNode((current) => (current === id ? null : id))}
              highlightChapter={null}
            />
            </ErrorBoundary>
          ) : (
            <div
              className="h-[calc(100vh-140px)] overflow-hidden rounded-2xl border border-slate-700"
              style={{ height: 'calc(100vh - 140px)' }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={enhancedNodeTypes}
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
          )}
        </>
      )}

      {view === 'metrics' && (
        <ErrorBoundary fallbackLabel="Metrics">
        <MetricsDashboard
          projectId={activeProject.id}
          initialTab={metricsTab}
          onTabChange={(t) => setMetricsTab(t)}
          onJumpToChapter={(chapterId) => {
            setView('tree');
            setExpandedChapters((current) => new Set([...current, chapterId]));
          }}
        />
        </ErrorBoundary>
      )}

      {showHowWeWork && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: '#0f172a', overflowY: 'auto' }}>
          <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowHowWeWork(false)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:brightness-125"
                style={{ borderColor: '#334155', backgroundColor: '#1e293b', color: '#94a3b8' }}
              >
                ✕ Close
              </button>
            </div>
            <ErrorBoundary fallbackLabel="How We Work"><ProcessWorkflow /></ErrorBoundary>
          </div>
        </div>
      )}
    </section>
  );
}
