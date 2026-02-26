import { useEffect, useMemo, useState } from 'react';
import { bipProject } from '../data/bipProject';
import type { FilterType, Phase, ProjectNode } from '../types';

const FILTERS: Array<{ id: FilterType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'decision', label: 'Decisions only' },
  { id: 'dead-end', label: 'Dead Ends only' },
  { id: 'event', label: 'Events only' },
];

const SPEEDS = [0.5, 1, 2] as const;

const PHASE_TOOL_COLORS: Record<Phase['tool'], string> = {
  chatgpt: 'bg-emerald-500/90 border-emerald-300 text-emerald-100',
  mixed: 'bg-cyan-500/80 border-cyan-300 text-cyan-50',
  claude: 'bg-violet-500/85 border-violet-300 text-violet-50',
};

const NODE_COLORS: Record<ProjectNode['type'], string> = {
  decision: 'border-emerald-400/70 bg-emerald-950/40',
  event: 'border-sky-400/70 bg-sky-950/40',
  'dead-end': 'border-rose-400/70 bg-rose-950/40',
};

const iconForType = (type: ProjectNode['type']) => {
  if (type === 'decision') return '◆';
  if (type === 'event') return '●';
  return '✕';
};

const labelForType = (type: ProjectNode['type']) => {
  if (type === 'decision') return 'Decision';
  if (type === 'event') return 'Event';
  return 'Dead End';
};

const animationBaseMs = 2200;

function NodeDetail({ node }: { node: ProjectNode }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/80 p-4 text-sm text-slate-200">
      <p className="leading-relaxed text-slate-300">{node.description}</p>
      {node.type === 'decision' && (
        <div className="mt-3 space-y-2">
          <p className="text-emerald-300">
            <span className="font-semibold">Chosen path:</span> {node.chosenPath}
          </p>
          <div>
            <p className="font-semibold text-rose-300">Rejected alternatives:</p>
            <ul className="mt-1 list-disc space-y-1 pl-6 text-rose-200">
              {node.alternatives.map((alt) => (
                <li key={alt} className="line-through decoration-rose-500/80">
                  {alt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {node.type === 'dead-end' && (
        <p className="mt-3 text-rose-200">
          <span className="font-semibold">Why it failed:</span> {node.failureReason}
        </p>
      )}
    </div>
  );
}

function TimelineNode({
  node,
  isExpanded,
  onToggle,
}: {
  node: ProjectNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <article
      className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/60 ${NODE_COLORS[node.type]}`}
    >
      <button className="w-full text-left" onClick={() => onToggle(node.id)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{labelForType(node.type)}</p>
            <h4 className="mt-1 text-base font-semibold text-slate-100">{node.title}</h4>
          </div>
          <span className="rounded-full border border-slate-600 px-2 py-1 text-sm text-slate-200">
            {iconForType(node.type)}
          </span>
        </div>
      </button>
      {isExpanded && <NodeDetail node={node} />}
    </article>
  );
}

function PhaseColumn({
  phase,
  visible,
  active,
  filter,
  expandedNodeId,
  onToggleNode,
}: {
  phase: Phase;
  visible: boolean;
  active: boolean;
  filter: FilterType;
  expandedNodeId: string | null;
  onToggleNode: (id: string) => void;
}) {
  const nodes =
    filter === 'all' ? phase.nodes : phase.nodes.filter((node) => node.type === filter);

  if (!nodes.length) {
    return null;
  }

  return (
    <section
      className={`rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 transition-all duration-500 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-30'
      } ${active ? 'ring-2 ring-sky-400/60' : ''}`}
    >
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{phase.name}</h3>
          <p className="text-sm text-slate-400">{phase.period}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${PHASE_TOOL_COLORS[phase.tool]}`}>
          {phase.toolLabel}
        </span>
      </header>

      <div className="space-y-3">
        {nodes.map((node) => (
          <TimelineNode
            key={node.id}
            node={node}
            isExpanded={expandedNodeId === node.id}
            onToggle={onToggleNode}
          />
        ))}
      </div>
    </section>
  );
}

export default function DecisionTree() {
  const phases = bipProject.phases;
  const [visiblePhaseCount, setVisiblePhaseCount] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    if (visiblePhaseCount >= phases.length) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisiblePhaseCount((count) => Math.min(phases.length, count + 1));
    }, animationBaseMs / speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, phases.length, speed, visiblePhaseCount]);

  const progress = useMemo(() => (visiblePhaseCount / phases.length) * 100, [phases.length, visiblePhaseCount]);

  const handleReset = () => {
    setIsPlaying(false);
    setVisiblePhaseCount(1);
    setExpandedNodeId(null);
  };

  const jumpToPhase = (index: number) => {
    setVisiblePhaseCount(index + 1);
    setIsPlaying(false);
  };

  const showAll = () => {
    setVisiblePhaseCount(phases.length);
    setIsPlaying(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 text-slate-100 sm:px-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{bipProject.subtitle}</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{bipProject.name}</h1>
      </header>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPlaying((current) => !current)}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Reset
          </button>
          <button
            onClick={showAll}
            className="rounded-lg border border-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-900/20"
          >
            Show All
          </button>

          <div className="ml-auto flex items-center gap-2 text-sm text-slate-300">
            <span>Speed</span>
            {SPEEDS.map((option) => (
              <button
                key={option}
                onClick={() => setSpeed(option)}
                className={`rounded-md px-3 py-1 ${
                  speed === option ? 'bg-violet-500 text-white' : 'border border-slate-600 hover:bg-slate-800'
                }`}
              >
                {option}x
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {visiblePhaseCount}/{phases.length} phases revealed
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">Phase minimap</h2>
        <div className="flex flex-wrap gap-2">
          {phases.map((phase, index) => {
            const revealed = index < visiblePhaseCount;
            return (
              <button
                key={phase.id}
                onClick={() => jumpToPhase(index)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                  revealed
                    ? 'border-slate-500 bg-slate-800 text-slate-100'
                    : 'border-slate-700 bg-slate-900 text-slate-500'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${PHASE_TOOL_COLORS[phase.tool].split(' ')[0]}`} />
                {phase.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              filter === item.id
                ? 'bg-slate-100 text-slate-950'
                : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main className="grid gap-5 lg:grid-cols-2">
        {phases.map((phase, index) => (
          <PhaseColumn
            key={phase.id}
            phase={phase}
            visible={index < visiblePhaseCount}
            active={index + 1 === visiblePhaseCount}
            filter={filter}
            expandedNodeId={expandedNodeId}
            onToggleNode={(id) => setExpandedNodeId((current) => (current === id ? null : id))}
          />
        ))}
      </main>

      {visiblePhaseCount === phases.length && (
        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">Project Stats</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Total days', bipProject.stats.totalDays],
              ['ChatGPT messages', bipProject.stats.chatGptMessages],
              ['Cowork sessions', bipProject.stats.coworkSessions],
              ['PRs created', bipProject.stats.prsCreated],
              ['Codex tasks', bipProject.stats.codexTasks],
              ['Lines of code', bipProject.stats.linesOfCode],
              ['Dead ends', bipProject.stats.deadEnds],
              ['Major decisions', bipProject.stats.majorDecisions],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
