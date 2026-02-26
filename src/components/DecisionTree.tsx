import { useMemo, useState } from 'react';
import { bipProject } from '../data/bipProject';
import type { FilterType, Phase, ProjectNode } from '../types';

const FILTERS: Array<{ id: FilterType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'decision', label: 'Decisions only' },
  { id: 'dead-end', label: 'Dead Ends only' },
  { id: 'event', label: 'Events only' },
];

const PHASE_TOOL_COLORS: Record<Phase['tool'], string> = {
  chatgpt: 'bg-emerald-500/20 border-emerald-300/70 text-emerald-100',
  mixed: 'bg-cyan-500/20 border-cyan-300/70 text-cyan-100',
  claude: 'bg-violet-500/20 border-violet-300/70 text-violet-100',
};

const NODE_STYLES: Record<ProjectNode['type'], string> = {
  decision: 'border-emerald-400/70 bg-emerald-950/35',
  event: 'border-cyan-400/70 bg-cyan-950/30',
  'dead-end': 'border-rose-400/70 bg-rose-950/35 opacity-60',
};

function NodeDetail({ node }: { node: ProjectNode }) {
  return (
    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-200">
      <p className="leading-relaxed text-slate-300">{node.description}</p>
      {node.type === 'decision' && (
        <>
          <p className="mt-3 text-emerald-200">
            <span className="font-semibold text-emerald-100">Chosen path:</span> {node.chosenPath}
          </p>
          <div className="mt-2">
            <p className="font-semibold text-rose-200">Alternatives:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-rose-100/90">
              {node.alternatives.map((alternative) => (
                <li key={alternative}>{alternative}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      {node.type === 'dead-end' && (
        <p className="mt-2 text-rose-200">
          <span className="font-semibold text-rose-100">Reason:</span> {node.failureReason}
        </p>
      )}
    </div>
  );
}

function DecisionFork({ chosenPath, alternatives }: { chosenPath: string; alternatives: string[] }) {
  const forkHeight = 220;
  const trunkX = 84;
  const splitY = 70;

  const alternativeTargets = alternatives.map((_, index) => {
    const spacing = forkHeight / (alternatives.length + 1);
    const targetY = spacing * (index + 1);
    return Math.max(20, Math.min(forkHeight - 18, targetY));
  });

  return (
    <div className="mt-3 rounded-md border border-emerald-600/40 bg-slate-900/60 p-3">
      <svg viewBox="0 0 360 220" className="h-56 w-full">
        <path d={`M${trunkX} 8 L${trunkX} ${splitY}`} stroke="rgba(45,212,191,0.6)" strokeWidth="1.5" fill="none" />
        <path d={`M${trunkX} ${splitY} L${trunkX} ${forkHeight - 6}`} stroke="rgba(45,212,191,1)" strokeWidth="3" fill="none" />

        {alternativeTargets.map((targetY, index) => {
          const controlX = trunkX + 70;
          const endX = 250;
          return (
            <path
              key={`${alternatives[index]}-${index}`}
              d={`M${trunkX} ${splitY} Q ${controlX} ${targetY} ${endX} ${targetY}`}
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="1.5"
              fill="none"
            />
          );
        })}

        <text x={trunkX + 12} y={forkHeight - 10} fill="rgba(167,243,208,0.95)" fontSize="13" fontWeight={700}>
          {chosenPath}
        </text>

        {alternatives.map((alternative, index) => (
          <text
            key={`${alternative}-label-${index}`}
            x={258}
            y={alternativeTargets[index] + 4}
            fill="rgba(148,163,184,0.85)"
            fontSize="12"
          >
            {alternative}
          </text>
        ))}
      </svg>
    </div>
  );
}

function TreeNode({
  node,
  index,
  total,
  isExpanded,
  onToggle,
}: {
  node: ProjectNode;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}) {
  const isDecision = node.type === 'decision';
  const isDeadEnd = node.type === 'dead-end';

  return (
    <div className="relative flex gap-3 pb-4 pl-1">
      <div className="relative w-24 shrink-0">
        <svg className="absolute inset-0 h-full w-full" viewBox="-16 0 92 100" preserveAspectRatio="none">
          {index > 0 && <path d="M30 0 L30 40" stroke="rgba(125,211,252,0.35)" strokeWidth="1.5" fill="none" />}
          {index < total - 1 && <path d="M30 56 L30 100" stroke="rgba(125,211,252,0.35)" strokeWidth="1.5" fill="none" />}
          {!isDeadEnd && <path d="M30 48 L62 48" stroke="rgba(125,211,252,0.5)" strokeWidth="1.5" fill="none" />}
          {isDeadEnd && (
            <>
              <path d="M30 48 L-12 48" stroke="rgba(251,113,133,0.7)" strokeWidth="1.8" fill="none" />
              <path d="M-12 48 L-5 42 M-12 48 L-5 54" stroke="rgba(251,113,133,0.8)" strokeWidth="1.6" />
            </>
          )}
        </svg>
      </div>

      <article
        className={`w-full rounded-xl border p-3 transition hover:-translate-y-0.5 ${NODE_STYLES[node.type]} ${
          node.type === 'event' ? 'max-w-2xl' : ''
        } ${isDeadEnd ? '-ml-14 mr-14' : ''}`}
      >
        <button className="w-full text-left" onClick={() => onToggle(node.id)}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                {node.type === 'decision' ? 'Decision' : node.type === 'event' ? 'Event' : 'Dead End'}
              </p>
              <h4 className={`mt-1 font-semibold text-slate-100 ${node.type === 'event' ? 'text-sm' : 'text-base'}`}>
                {node.title}
              </h4>
            </div>
            <span className="text-slate-400">{isExpanded ? '−' : '+'}</span>
          </div>
        </button>

        {isDecision && <DecisionFork chosenPath={node.chosenPath} alternatives={node.alternatives} />}
        {isExpanded && <NodeDetail node={node} />}
      </article>
    </div>
  );
}

export default function DecisionTree() {
  const phases = bipProject.phases;
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const allExpanded = expandedPhases.size === phases.length;

  const toggleAllPhases = () => {
    setExpandedPhases(allExpanded ? new Set() : new Set(phases.map((phase) => phase.id)));
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((current) => {
      const next = new Set(current);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const visibleCounts = useMemo(
    () =>
      phases.map((phase) =>
        filter === 'all' ? phase.nodes.length : phase.nodes.filter((node) => node.type === filter).length,
      ),
    [filter, phases],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 text-slate-100 sm:px-8">
      <header className="mb-6 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{bipProject.subtitle}</p>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{bipProject.name}</h1>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/75 p-4">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              filter === item.id
                ? 'bg-slate-100 text-slate-950'
                : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={toggleAllPhases}
          className="ml-auto rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/20"
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <main className="relative space-y-5 pb-8">
        <svg className="pointer-events-none absolute left-[1.55rem] top-0 h-full w-20" viewBox="0 0 80 100" preserveAspectRatio="none">
          <path d="M40 0 L40 100" stroke="rgba(125,211,252,0.45)" strokeWidth="1.6" fill="none" />
        </svg>

        {phases.map((phase, phaseIndex) => {
          const isOpen = expandedPhases.has(phase.id);
          const nodes = filter === 'all' ? phase.nodes : phase.nodes.filter((node) => node.type === filter);

          return (
            <section key={phase.id} className="relative pl-12">
              <svg className="pointer-events-none absolute left-0 top-0 h-24 w-16" viewBox="0 0 64 96" preserveAspectRatio="none">
                <path d="M28 0 L28 46 L52 46" stroke="rgba(125,211,252,0.55)" strokeWidth="1.6" fill="none" />
                {phaseIndex < phases.length - 1 && (
                  <path d="M28 46 L28 96" stroke="rgba(125,211,252,0.35)" strokeWidth="1.4" fill="none" />
                )}
              </svg>

              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80">
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left hover:bg-slate-800/60"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-slate-100">{phase.name}</h2>
                    <p className="text-sm text-slate-400">{phase.period}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${PHASE_TOOL_COLORS[phase.tool]}`}>
                      {phase.toolLabel}
                    </span>
                    <span className="text-lg text-slate-300">{isOpen ? '⌄' : '›'}</span>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-700/70 px-3 pb-4 pt-4 sm:px-5">
                      {nodes.length === 0 ? (
                        <p className="rounded-lg border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-400">
                          No nodes match this filter in this phase.
                        </p>
                      ) : (
                        nodes.map((node, index) => (
                          <TreeNode
                            key={node.id}
                            node={node}
                            index={index}
                            total={nodes.length}
                            isExpanded={expandedNodeId === node.id}
                            onToggle={(id) => setExpandedNodeId((current) => (current === id ? null : id))}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-2 pl-4 text-xs text-slate-500">
                {visibleCounts[phaseIndex]} visible node{visibleCounts[phaseIndex] === 1 ? '' : 's'}
              </p>
            </section>
          );
        })}
      </main>
    </div>
  );
}
