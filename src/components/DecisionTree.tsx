import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { remnantsProject } from '../data/remnantsProject';
import { itemBGoneProject } from '../data/itemBGoneProject';
import { vulnBankProject } from '../data/vulnBankProject';
import { landingProject } from '../data/landingProject';
import { feedbackCaptureProject } from '../data/feedbackCaptureProject';
import { noteWorthyProject } from '../data/noteWorthyProject';
import { onTheMoveProject } from '../data/onTheMoveProject';
import type { DayEntry, FilterType, NodeCategory, Project, ProjectNode, ProjectPhase } from '../types';
import { bipDays } from '../data/bipMetrics';
import { metaDays } from '../data/metaMetrics';
import { remnantsDays } from '../data/remnantsMetrics';
import { ibgDays } from '../data/itemBGoneMetrics';
import { vbDays } from '../data/vulnBankMetrics';
import { landingDays } from '../data/landingMetrics';
import { fcDays } from '../data/feedbackCaptureMetrics';
import { nwDays } from '../data/noteWorthyMetrics';
import { otmDays } from '../data/onTheMoveMetrics';
import { nodeTypes } from './CustomNodes';
import MetricsDashboard from './MetricsDashboard';
import ProcessWorkflow from './ProcessWorkflow';
import ErrorBoundary from './ErrorBoundary';
import StackedTreeView from './StackedTreeView';
import type { TreeNodeData } from './treeLayout';
import { buildTreeLayout } from './treeLayout';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ChangelogPage from './ChangelogPage';

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

const PROJECTS = [bipProject, metaProject, remnantsProject, itemBGoneProject, vulnBankProject, landingProject, feedbackCaptureProject, noteWorthyProject, onTheMoveProject];

const PROJECT_GROUPS: Array<{ label: string; projects: typeof PROJECTS }> = [
  { label: 'Solo', projects: PROJECTS.filter(p => p.trackingMode !== 'lightweight' && p.projectType !== 'joint') },
  { label: 'Micro', projects: PROJECTS.filter(p => p.trackingMode === 'lightweight') },
  { label: 'Joint', projects: PROJECTS.filter(p => p.projectType === 'joint') },
];

const CATEGORY_META: Array<{ id: NodeCategory; label: string; color: string }> = [
  { id: 'technical', label: 'Technical', color: 'var(--theme-cyan)' },
  { id: 'functional', label: 'Functional', color: 'var(--theme-emerald)' },
  { id: 'ux-design', label: 'UX/Design', color: 'var(--theme-amber)' },
  { id: 'process', label: 'Process', color: 'var(--theme-violet)' },
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
      style={{ height: compact ? 12 : 24, width: compact ? 120 : '100%', backgroundColor: 'var(--theme-bg)' }}
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
              color: 'var(--theme-bg)',
              borderRight: idx < visibleCategories.length - 1 ? '2px solid var(--theme-bg)' : 'none',
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
            {stats.deadEnds > 0 && <span style={{ color: 'var(--theme-rose)' }}>{stats.deadEnds} dead ends</span>}
            {stats.discoveries > 0 && <span style={{ color: 'var(--theme-amber)' }}>{stats.discoveries} discoveries</span>}
            {stats.pivots > 0 && <span style={{ color: 'var(--theme-violet)' }}>{stats.pivots} pivots</span>}
            {stats.bugs > 0 && (
              <button
                type="button"
                className="underline decoration-dotted"
                style={{ color: 'var(--theme-rose)' }}
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
  const { theme, toggleTheme } = useTheme();
  const [easterEggToast, setEasterEggToast] = useState<string | null>(null);
  const handleRoguePixel = useCallback(() => {
    toggleTheme();
    setEasterEggToast(theme === 'sc' ? 'Default theme restored' : 'SC Mode activated');
    setTimeout(() => setEasterEggToast(null), 2000);
  }, [theme, toggleTheme]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<'tree' | 'metrics' | 'changelog'>('tree');
  const [showHowWeWork, setShowHowWeWork] = useState(false);
  const [treeMode, setTreeMode] = useState<'stacked' | 'canvas'>('stacked');
  const [metricsTab, setMetricsTab] = useState<'overview' | 'code' | 'bugs' | 'sessions'>('overview');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeProject, setActiveProject] = useState<Project>(metaProject);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchProject = (newProjectId: string) => {
    if (newProjectId === 'all') {
      setActiveProject({ id: 'all', name: 'All Projects', subtitle: '', chapters: [], stats: { totalDays: 0, chatGptMessages: '0', coworkSessions: 0, prsCreated: '0', codexTasks: '0', linesOfCode: '0', deadEnds: 0, majorDecisions: 0 } } as typeof bipProject);
      setView('metrics');
      setMetricsTab('overview');
      return;
    }
    const project = PROJECTS.find((p) => p.id === newProjectId);
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

  const activeDaysForTree = useMemo(() => {
    const dayMap: Record<string, DayEntry[]> = {
      bip: bipDays,
      meta: metaDays,
      remnants: remnantsDays,
      'item-b-gone': ibgDays,
      'vuln-bank': vbDays,
      'landing': landingDays,
      'feedback-capture': fcDays,
      'note-worthy': nwDays,
      'on-the-move': otmDays,
    };
    return dayMap[activeProject.id] ?? [];
  }, [activeProject.id]);

  const dayPhaseMap = useMemo(() => {
    const map: Record<string, ProjectPhase> = {};
    activeDaysForTree.forEach((d) => {
      if (d.phase && d.date) {
        map[d.date] = d.phase;
      }
    });
    return map;
  }, [activeDaysForTree]);

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
      <header className="mb-5 border-b border-slate-700 pb-3 relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 cursor-default select-none">{activeProject.subtitle}</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {activeProject.name}
              {activeProject.url && (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 inline-flex items-center align-middle rounded-md px-2 py-1 text-xs font-medium transition hover:brightness-125"
                  style={{ backgroundColor: 'var(--theme-accent-10)', color: 'var(--theme-cyan)', border: '1px solid var(--theme-accent-20)', verticalAlign: 'middle' }}
                >
                  <ExternalLink size={12} className="mr-1" />
                  Visit App
                </a>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('changelog')}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
              style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-secondary)' }}
              title="Changelog"
            >
              📋 Changelog
            </button>
            <button
              onClick={() => setShowHowWeWork(true)}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:brightness-125"
              style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-secondary)' }}
            >
              ℹ️ How We Work
            </button>
          </div>
        </div>

        {PROJECTS.length > 1 && (
          <nav aria-label="Project switcher" className="mt-2 relative" ref={dropdownRef}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:brightness-110"
              style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-primary)' }}
              aria-haspopup="listbox"
              aria-expanded={projectDropdownOpen}
            >
              {activeProject.name}
              <span style={{ fontSize: 10, color: 'var(--theme-text-muted)', transform: projectDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>&#9660;</span>
            </button>
            {projectDropdownOpen && (
              <div
                className="absolute left-0 top-full mt-1 z-50 rounded-xl border shadow-lg"
                style={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-border)', minWidth: 220 }}
                role="listbox"
              >
                {/* All Projects entry */}
                <button
                  role="option"
                  aria-selected={activeProject.id === 'all'}
                  onClick={() => { switchProject('all'); setProjectDropdownOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium transition hover:brightness-125"
                  style={{
                    color: activeProject.id === 'all' ? 'var(--theme-cyan)' : 'var(--theme-text-secondary)',
                    backgroundColor: activeProject.id === 'all' ? 'color-mix(in srgb, var(--theme-cyan) 8%, transparent)' : 'transparent',
                  }}
                >
                  All Projects
                </button>
                <div className="mx-2 my-1 border-t" style={{ borderColor: 'var(--theme-border)' }} />
                {PROJECT_GROUPS.filter(g => g.projects.length > 0).map((group) => (
                  <div key={group.label}>
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>
                      {group.label}
                    </div>
                    {group.projects.map((proj) => (
                      <button
                        key={proj.id}
                        role="option"
                        aria-selected={activeProject.id === proj.id}
                        onClick={() => { switchProject(proj.id); setProjectDropdownOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:brightness-125"
                        style={{
                          color: activeProject.id === proj.id ? 'var(--theme-cyan)' : 'var(--theme-text-secondary)',
                          backgroundColor: activeProject.id === proj.id ? 'color-mix(in srgb, var(--theme-cyan) 8%, transparent)' : 'transparent',
                        }}
                      >
                        {proj.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </nav>
        )}

        {activeProject.id !== 'all' && (
          <nav aria-label="View switcher" className="mt-3 flex items-end gap-2">
            <button
              onClick={() => setView('tree')}
              aria-current={view === 'tree' ? 'page' : undefined}
              className="rounded-t-[8px] border-b-2 px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: view === 'tree' ? 'var(--theme-card-bg)' : 'transparent',
                color: view === 'tree' ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                borderBottomColor: view === 'tree' ? 'var(--theme-cyan)' : 'transparent',
              }}
            >
              🌳 Decision Tree
            </button>
            <button
              onClick={() => setView('metrics')}
              aria-current={view === 'metrics' ? 'page' : undefined}
              className="rounded-t-[8px] border-b-2 px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: view === 'metrics' ? 'var(--theme-card-bg)' : 'transparent',
                color: view === 'metrics' ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                borderBottomColor: view === 'metrics' ? 'var(--theme-cyan)' : 'transparent',
              }}
            >
              📊 Metrics
            </button>
          </nav>
        )}
        <button
          onClick={handleRoguePixel}
          aria-hidden="true"
          className="absolute bottom-[-1px] right-12 block opacity-40 hover:opacity-80 transition-opacity"
          style={{ width: '3px', height: '3px', backgroundColor: '#94a3b8', border: 'none', padding: 0, cursor: 'default' }}
          title=""
        />
      </header>

      {view === 'tree' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--theme-text-muted)', fontWeight: 700 }}>View:</span>
            {(['stacked', 'canvas'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTreeMode(mode)}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 8,
                  border: `1px solid ${treeMode === mode ? 'var(--theme-accent-40)' : 'var(--theme-border)'}`,
                  background: treeMode === mode ? 'var(--theme-accent-20)' : 'transparent',
                  color: treeMode === mode ? 'var(--theme-cyan)' : 'var(--theme-text-muted)',
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
                style={{ backgroundColor: 'var(--theme-card-bg)', borderColor: 'var(--theme-border)', padding: '14px 20px' }}
              >
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                  <span>{projectSummary.entries} entries</span>
                  <span className="text-slate-500">|</span>
                  {projectSummary.deadEnds > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: 'var(--theme-rose)', opacity: 0.15, color: 'var(--theme-rose)' }}>{projectSummary.deadEnds} dead ends</span>}
                  {projectSummary.discoveries > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-amber) 13%, transparent)', color: 'var(--theme-amber)' }}>{projectSummary.discoveries} discoveries</span>}
                  {projectSummary.pivots > 0 && <span className="rounded-full px-2 py-0.5" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-violet) 13%, transparent)', color: 'var(--theme-violet)' }}>{projectSummary.pivots} pivots</span>}
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
              days={activeDaysForTree}
              dayPhaseMap={dayPhaseMap}
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
                style={{ backgroundColor: 'var(--theme-bg)' }}
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
          onProjectChange={switchProject}
        />
        </ErrorBoundary>
      )}

      {view === 'changelog' && <ChangelogPage onClose={() => setView('tree')} />}

      {showHowWeWork && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'var(--theme-bg)', overflowY: 'auto' }}>
          <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowHowWeWork(false)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition hover:brightness-125"
                style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text-secondary)' }}
              >
                ✕ Close
              </button>
            </div>
            <ErrorBoundary fallbackLabel="How We Work"><ProcessWorkflow /></ErrorBoundary>
          </div>
        </div>
      )}
          {easterEggToast && (
        <div
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg transition-opacity"
          style={{
            backgroundColor: theme === 'sc' ? 'var(--theme-cyan)' : 'var(--theme-card-bg)',
            color: theme === 'sc' ? '#fff' : 'var(--theme-text-primary)',
            border: '1px solid var(--theme-border)',
          }}
        >
          {easterEggToast}
        </div>
      )}
    </section>
  );
}
