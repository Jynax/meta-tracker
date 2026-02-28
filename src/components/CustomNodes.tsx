import { Handle, Position, type NodeTypes } from '@xyflow/react';
import type { TreeNodeData } from './treeLayout';

interface InteractiveData extends TreeNodeData {
  onToggleExpand?: (id: string) => void;
  onToggleDetail?: (id: string) => void;
}

function ToolBadge({ toolLabel, tool }: { toolLabel?: string; tool?: TreeNodeData['tool'] }) {
  const color =
    tool === 'chatgpt'
      ? 'border-emerald-400/60 text-emerald-200'
      : tool === 'claude'
      ? 'border-violet-400/60 text-violet-200'
      : 'border-cyan-400/60 text-cyan-200';
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${color}`}>{toolLabel}</span>;
}

function PhaseSummary({ data }: { data: InteractiveData }) {
  if (data.expanded || data.nodeCount === undefined || data.nodeCount === 0) return null;
  const parts: string[] = [];
  if (data.decisionCount) parts.push(`${data.decisionCount} decision${data.decisionCount > 1 ? 's' : ''}`);
  if (data.eventCount) parts.push(`${data.eventCount} event${data.eventCount > 1 ? 's' : ''}`);
  if (data.deadEndCount) parts.push(`${data.deadEndCount} dead end${data.deadEndCount > 1 ? 's' : ''}`);
  if (data.discoveryCount) parts.push(`${data.discoveryCount} discover${data.discoveryCount > 1 ? 'ies' : 'y'}`);
  if (data.pivotCount) parts.push(`${data.pivotCount} pivot${data.pivotCount > 1 ? 's' : ''}`);
  return <p className="mt-1 text-xs text-slate-400">{parts.join(' ' + String.fromCharCode(0x00B7) + ' ')}</p>;
}

export function PhaseNode({ id, data }: { id: string; data: InteractiveData }) {
  const isRoot = data.kind === 'root';
  return (
    <div className={`${isRoot ? 'w-64' : 'w-[280px]'} rounded-xl border border-sky-400/60 bg-slate-800/90 p-4 text-slate-100 shadow-lg transition hover:brightness-110`}>
      {!isRoot && <Handle type="target" position={Position.Top} id="top" className="!bg-sky-300" />}
      <button className="w-full text-left" onClick={() => data.onToggleExpand?.(id)}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">{isRoot ? 'Project' : 'Chapter'}</p>
            <h3 className="mt-1 text-lg font-semibold">{data.label}</h3>
            {data.period && <p className="mt-1 text-xs text-slate-300">{data.period}</p>}
          </div>
          {!isRoot && <span className="text-slate-300">{data.expanded ? String.fromCharCode(0x2212) : '+'}</span>}
        </div>
        {data.toolLabel && (
          <div className="mt-2">
            <ToolBadge toolLabel={data.toolLabel} tool={data.tool} />
          </div>
        )}
        {!isRoot && <PhaseSummary data={data} />}
      </button>
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-sky-300" />
      {!isRoot && <Handle type="source" position={Position.Right} id="right" className="!bg-sky-300" />}
      {!isRoot && <Handle type="source" position={Position.Left} id="left" className="!bg-sky-300" />}
    </div>
  );
}

export function DecisionNode({ id, data }: { id: string; data: InteractiveData }) {
  return (
    <div className="w-64 rounded-xl border border-emerald-400/70 bg-emerald-950/40 p-3 text-slate-100 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-emerald-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-emerald-300" />
      <button className="w-full text-left" onClick={() => data.onToggleDetail?.(id)}>
        <p className="text-xs uppercase text-emerald-200">Decision</p>
        <h4 className="mt-1 font-semibold">{data.label}</h4>
        <p className="mt-1 text-xs text-emerald-100">Chosen: {data.chosenPath}</p>
      </button>
      {data.detailOpen && data.description && (
        <p className="mt-2 border-t border-emerald-300/20 pt-2 text-xs text-slate-200">{data.description}</p>
      )}
      <Handle type="source" position={Position.Right} id="right" className="!bg-emerald-300" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-emerald-300" />
    </div>
  );
}

export function EventNode({ id, data }: { id: string; data: InteractiveData }) {
  return (
    <div className="w-56 rounded-xl border border-cyan-400/70 bg-cyan-950/40 p-3 text-slate-100 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-cyan-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-cyan-300" />
      <button className="w-full text-left" onClick={() => data.onToggleDetail?.(id)}>
        <p className="text-xs uppercase text-cyan-200">Event</p>
        <h4 className="mt-1 text-sm font-semibold">{data.label}</h4>
      </button>
      {data.detailOpen && data.description && (
        <p className="mt-2 text-xs text-cyan-100">{data.description}</p>
      )}
    </div>
  );
}

export function DeadEndNode({ id, data }: { id: string; data: InteractiveData }) {
  return (
    <div className="w-56 rounded-xl border border-rose-400/70 bg-rose-950/40 p-3 text-slate-100 opacity-60 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-rose-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-rose-300" />
      <button className="w-full text-left" onClick={() => data.onToggleDetail?.(id)}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase text-rose-200">Dead End</p>
          <span className="font-bold text-rose-300">{String.fromCharCode(0x2715)}</span>
        </div>
        <h4 className="mt-1 text-sm font-semibold">{data.label}</h4>
      </button>
      {data.detailOpen && data.failureReason && (
        <p className="mt-2 text-xs text-rose-100">{data.failureReason}</p>
      )}
    </div>
  );
}

export function DiscoveryNode({ id, data }: { id: string; data: InteractiveData }) {
  return (
    <div className="w-56 rounded-xl border border-amber-400/70 bg-amber-950/40 p-3 text-slate-100 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-amber-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-amber-300" />
      <button className="w-full text-left" onClick={() => data.onToggleDetail?.(id)}>
        <p className="text-xs uppercase text-amber-200">Discovery</p>
        <h4 className="mt-1 text-sm font-semibold">{data.label}</h4>
      </button>
      {data.detailOpen && data.description && (
        <p className="mt-2 text-xs text-amber-100">{data.description}</p>
      )}
    </div>
  );
}

export function PivotNode({ id, data }: { id: string; data: InteractiveData }) {
  return (
    <div className="w-64 rounded-xl border border-violet-400/70 bg-violet-950/40 p-3 text-slate-100 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-violet-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-violet-300" />
      <button className="w-full text-left" onClick={() => data.onToggleDetail?.(id)}>
        <p className="text-xs uppercase text-violet-200">Pivot</p>
        <h4 className="mt-1 font-semibold">{data.label}</h4>
        {data.chosenPath && <p className="mt-1 text-xs text-violet-100">New direction: {data.chosenPath}</p>}
      </button>
      {data.detailOpen && data.description && (
        <p className="mt-2 border-t border-violet-300/20 pt-2 text-xs text-slate-200">{data.description}</p>
      )}
      <Handle type="source" position={Position.Right} id="right" className="!bg-violet-300" />
      <Handle type="source" position={Position.Left} id="left" className="!bg-violet-300" />
    </div>
  );
}

export function AlternativeNode({ data }: { data: InteractiveData }) {
  return (
    <div className="w-48 rounded-xl border border-slate-600 bg-slate-900/60 p-2 text-xs text-slate-300 opacity-50 transition hover:brightness-110">
      <Handle type="target" position={Position.Left} id="left" className="!bg-rose-300" />
      <Handle type="target" position={Position.Right} id="right" className="!bg-rose-300" />
      <p className="uppercase tracking-wide text-slate-400">Alternative</p>
      <p className="mt-1">{data.label}</p>
    </div>
  );
}

export const nodeTypes: NodeTypes = {
  phaseNode: PhaseNode,
  decisionNode: DecisionNode,
  eventNode: EventNode,
  deadEndNode: DeadEndNode,
  discoveryNode: DiscoveryNode,
  pivotNode: PivotNode,
  alternativeNode: AlternativeNode,
};
