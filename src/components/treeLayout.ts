import type { Edge, Node } from '@xyflow/react';
import type { FilterType, Phase, Project, ProjectNode } from '../types';

export type TreeNodeKind =
  | 'root'
  | 'phase'
  | 'decision'
  | 'event'
  | 'dead-end'
  | 'alternative';

export interface TreeNodeData {
  kind: TreeNodeKind;
  label: string;
  period?: string;
  toolLabel?: string;
  tool?: Phase['tool'];
  description?: string;
  chosenPath?: string;
  alternatives?: string[];
  failureReason?: string;
  expanded?: boolean;
  detailOpen?: boolean;
}

export interface TreeLayoutResult {
  nodes: Node<TreeNodeData>[];
  edges: Edge[];
}

interface TreeLayoutOptions {
  expandedPhases: Set<string>;
  detailNodes: Set<string>;
  filter: FilterType;
}

const NODE_WIDTH = 260;
const ALT_NODE_WIDTH = 200;
const CHILD_GAP = 80;
const ALT_GAP = 40;
const V_SPACING = 200;
const MIN_PHASE_GAP = 140;
const COLLAPSED_PHASE_WIDTH = NODE_WIDTH;

const matchesFilter = (node: ProjectNode, filter: FilterType) =>
  filter === 'all' || node.type === filter;

function calcSubtreeWidth(
  phase: Phase,
  expanded: boolean,
  filter: FilterType,
): number {
  if (!expanded) return COLLAPSED_PHASE_WIDTH;
  const children = phase.nodes.filter((n) => matchesFilter(n, filter));
  if (children.length === 0) return COLLAPSED_PHASE_WIDTH;
  const childColumnWidths = children.map((child) => {
    let width = NODE_WIDTH;
    if (child.type === 'decision' && child.alternatives.length > 0) {
      const altRowWidth =
        child.alternatives.length * ALT_NODE_WIDTH +
        (child.alternatives.length - 1) * ALT_GAP;
      width = Math.max(width, altRowWidth);
    }
    return width;
  });
  const totalChildrenWidth =
    childColumnWidths.reduce((sum, w) => sum + w, 0) +
    (children.length - 1) * CHILD_GAP;
  return Math.max(totalChildrenWidth, COLLAPSED_PHASE_WIDTH);
}

export function buildTreeLayout(
  project: Project,
  options: TreeLayoutOptions,
): TreeLayoutResult {
  const nodes: Node<TreeNodeData>[] = [];
  const edges: Edge[] = [];

  const subtreeWidths = project.phases.map((phase) =>
    calcSubtreeWidth(phase, options.expandedPhases.has(phase.id), options.filter),
  );

  const totalWidth =
    subtreeWidths.reduce((sum, w) => sum + w, 0) +
    (project.phases.length - 1) * MIN_PHASE_GAP;

  let cursorX = -totalWidth / 2;
  const phaseXPositions = subtreeWidths.map((w, i) => {
    const x = cursorX + w / 2;
    cursorX += w + (i < subtreeWidths.length - 1 ? MIN_PHASE_GAP : 0);
    return x;
  });

  nodes.push({
    id: project.id,
    type: 'phaseNode',
    position: { x: -NODE_WIDTH / 2, y: 0 },
    data: {
      kind: 'root',
      label: project.name,
      period: project.subtitle,
      toolLabel: 'Project Root',
      tool: 'mixed',
      expanded: true,
    },
    draggable: false,
  });

  project.phases.forEach((phase, phaseIndex) => {
    const phaseId = phase.id;
    const phaseX = phaseXPositions[phaseIndex];
    const phaseY = V_SPACING;
    const phaseExpanded = options.expandedPhases.has(phase.id);

    nodes.push({
      id: phaseId,
      type: 'phaseNode',
      position: { x: phaseX - NODE_WIDTH / 2, y: phaseY },
      data: {
        kind: 'phase',
        label: phase.name,
        period: phase.period,
        toolLabel: phase.toolLabel,
        tool: phase.tool,
        expanded: phaseExpanded,
      },
      draggable: false,
    });

    edges.push({
      id: `${project.id}-${phase.id}`,
      source: project.id,
      target: phase.id,
      type: 'straight',
      style: { stroke: 'rgba(56, 189, 248, 0.7)', strokeWidth: 1.7 },
    });

    if (!phaseExpanded) return;

    const children = phase.nodes.filter((node) => matchesFilter(node, options.filter));
    if (children.length === 0) return;

    const childColumnWidths = children.map((child) => {
      let width = NODE_WIDTH;
      if (child.type === 'decision' && child.alternatives.length > 0) {
        const altRowWidth =
          child.alternatives.length * ALT_NODE_WIDTH +
          (child.alternatives.length - 1) * ALT_GAP;
        width = Math.max(width, altRowWidth);
      }
      return width;
    });

    const totalChildrenWidth =
      childColumnWidths.reduce((sum, w) => sum + w, 0) +
      (children.length - 1) * CHILD_GAP;
    let childCursorX = phaseX - totalChildrenWidth / 2;

    children.forEach((node, childIndex) => {
      const childId = node.id;
      const colWidth = childColumnWidths[childIndex];
      const childX = childCursorX + colWidth / 2;
      const childY = phaseY + V_SPACING;
      childCursorX += colWidth + CHILD_GAP;

      const nodeType =
        node.type === 'dead-end' ? 'deadEndNode'
        : node.type === 'decision' ? 'decisionNode'
        : 'eventNode';

      nodes.push({
        id: childId,
        type: nodeType,
        position: { x: childX - NODE_WIDTH / 2, y: childY },
        data: {
          kind: node.type,
          label: node.title,
          description: node.description,
          chosenPath: node.type === 'decision' ? node.chosenPath : undefined,
          alternatives: node.type === 'decision' ? node.alternatives : undefined,
          failureReason: node.type === 'dead-end' ? node.failureReason : undefined,
          detailOpen: options.detailNodes.has(node.id),
        },
        draggable: false,
      });

      edges.push({
        id: `${phase.id}-${childId}`,
        source: phase.id,
        target: childId,
        type: 'smoothstep',
        style: { stroke: 'rgba(56, 189, 248, 0.6)', strokeWidth: 1.6 },
      });

      if (node.type !== 'decision') return;

      const altCount = node.alternatives.length;
      const altRowWidth = altCount * ALT_NODE_WIDTH + (altCount - 1) * ALT_GAP;
      let altCursorX = childX - altRowWidth / 2;

      node.alternatives.forEach((alternative, altIndex) => {
        const alternativeId = `${node.id}-alt-${altIndex}`;
        const altX = altCursorX + ALT_NODE_WIDTH / 2;
        altCursorX += ALT_NODE_WIDTH + ALT_GAP;

        nodes.push({
          id: alternativeId,
          type: 'alternativeNode',
          position: { x: altX - ALT_NODE_WIDTH / 2, y: childY + V_SPACING },
          data: { kind: 'alternative', label: alternative },
          draggable: false,
        });

        edges.push({
          id: `${childId}-${alternativeId}`,
          source: childId,
          target: alternativeId,
          type: 'default',
          style: { stroke: 'rgba(251, 113, 133, 0.85)', strokeDasharray: '6 5', strokeWidth: 1.3 },
        });
      });
    });
  });

  return { nodes, edges };
}
