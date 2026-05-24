import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { metaProject } from '../data/metaProject';
import type { FilterType, Project, ProjectPhase } from '../types';
import {
  ALL_PROJECTS,
  PROJECT_DAYS_MAP,
  SYNTHETIC_ALL_PROJECT,
} from '../data/projectRegistry';
import MetricsDashboard from './MetricsDashboard';
import ProcessWorkflow from './ProcessWorkflow';
import ErrorBoundary from './ErrorBoundary';
import StackedTreeView from './StackedTreeView';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import ChangelogPage from './ChangelogPage';
import { getEpicTree } from '../utils/trackerDataAdapter';

const PROJECTS = ALL_PROJECTS;

const PROJECT_GROUPS: Array<{ label: string; projects: typeof PROJECTS }> = [
  { label: 'Solo', projects: PROJECTS.filter(p => p.trackingMode !== 'lightweight' && p.projectType !== 'joint') },
  { label: 'Micro', projects: PROJECTS.filter(p => p.trackingMode === 'lightweight') },
  { label: 'Joint', projects: PROJECTS.filter(p => p.projectType === 'joint') },
];

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
  const [metricsTab, setMetricsTab] = useState<'overview' | 'code' | 'bugs' | 'sessions'>('overview');
  const [activeProject, setActiveProject] = useState<Project>(metaProject);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set());
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters((current) => {
      const next = new Set(current);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  }, []);

  const toggleEpic = useCallback((epicId: string) => {
    setExpandedEpics((current) => {
      const next = new Set(current);
      if (next.has(epicId)) next.delete(epicId);
      else next.add(epicId);
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
      setActiveProject(SYNTHETIC_ALL_PROJECT);
      setView('metrics');
      setMetricsTab('overview');
      return;
    }
    const project = PROJECTS.find((p) => p.id === newProjectId);
    if (project) {
      setActiveProject(project);
      setExpandedChapters(new Set());
      setExpandedNode(null);
      setFilter('all');
      setView('tree');
      setMetricsTab('overview');
    }
  };

  const activeDaysForTree = useMemo(
    () => PROJECT_DAYS_MAP[activeProject.id] ?? [],
    [activeProject.id],
  );

  const dayPhaseMap = useMemo(() => {
    const map: Record<string, ProjectPhase> = {};
    activeDaysForTree.forEach((d) => {
      if (d.phase && d.date) {
        map[d.date] = d.phase;
      }
    });
    return map;
  }, [activeDaysForTree]);

  const isMeta = activeProject.id === 'meta';
  const epicTree = useMemo(() => (isMeta ? getEpicTree() : undefined), [isMeta]);

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
              <span style={{ fontSize: 10, color: 'var(--theme-text-muted)', transform: projectDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
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
              🌳 {isMeta ? 'Epic Tree' : 'Decision Tree'}
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
        <ErrorBoundary fallbackLabel={isMeta ? 'Epic Tree' : 'Decision Tree'}>
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
            mode={isMeta ? 'epics' : 'chapters'}
            epicTree={epicTree}
            expandedEpics={expandedEpics}
            onEpicToggle={toggleEpic}
          />
        </ErrorBoundary>
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
