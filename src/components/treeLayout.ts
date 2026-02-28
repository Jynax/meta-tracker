import type { Edge, Node } from '@xyflow/react';
import type { Chapter, FilterType, Project, ProjectNode } from '../types';

export type TreeNodeKind =
  | 'root'
  | 'phase'
  | 'decision'
  | 'event'
  | 'dead-end'
  | 'discovery'
  | 'pivot'
  | 'alternative';

export interface TreeNodeData {
  kind: TreeNodeKind;
  label: string;
  period?: string;
  toolLabel?: string;
  tool?: Chapter['tool'];
  description?: string;
  chosenPath?: string;
  alternatives?: string[];
  failureReason?: string;
  expanded?: boolean;
  detailOpen?: boolean;
  nodeCount?: number;
  decisionCount?: number;
  eventCount?: number;
  deadEndCount?: number;
  discoveryCount?: number;
  pivotCount?: number;
}

export interface TreeLayoutResult {
  nodes: Node<TreeNodeData>[];
  edges: Edge[];
}

interface TreeLayoutOptions {
  expandedChapters: Set<string>;
  detailNodes: Set<string>;
  filter: FilterType;
}

const NODE_WIDTH = 260;
const PHASE_NODE_WIDTH = 280;
const ALT_NODE_WIDTH = 200;

const ROOT_TO_PHASE_GAP = 300;
const PHASE_V_GAP = 60;
const EXPANDED_PHASE_BOTTOM = 50;
const CHILD_V_GAP = 140;
const BRANCH_H_GAP = 100;
const ALT_H_GAP = 60;
const ALT_V_GAP = 70;
const COLLAPSED_PHASE_HEIGHT = 140;

const matchesFilter = (node: ProjectNode, filter: FilterType) => {
  if (filter === 'all') return true;
  if (filter === 'technical' || filter === 'functional' || filter === 'ux-design' || filter === 'process') {
    return node.category === filter;
  }
  return node.type === filter;
};

function countByType(nodes: ProjectNode[], filter: FilterType) {
  const filtered = nodes.filter((n) => matchesFilter(n, filter));
  return {
    total: filtered.length,
    decisions: filtered.filter((n) => n.type === 'decision').length,
    events: filtered.filter((n) => n.type === 'event').length,
    deadEnds: filtered.filter((n) => n.type === 'dead-end').length,
    discoveries: filtered.filter((n) => n.type === 'discovery').length,
    pivots: filtered.filter((n) => n.type === 'pivot').length,
  };
}

export function buildTreeLayout(
  project: Project,
  options: TreeLayoutOptions,
): TreeLayoutResult {
  const nodes: Node<TreeNodeData>[] = [];
  const edges: Edge[] = [];

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

  let cursorY = ROOT_TO_PHASE_GAP;

  project.chapters.forEach((chapter) => {
    const chapterExpanded = options.expandedChapters.has(chapter.id);
    const counts = countByType(chapter.nodes, options.filter);
    const chapterX = -PHASE_NODE_WIDTH / 2;

    nodes.push({
      id: chapter.id,
      type: 'phaseNode',
      position: { x: chapterX, y: cursorY },
      data: {
        kind: 'phase',
        label: chapter.name,
        period: chapter.period,
        toolLabel: chapter.toolLabel,
        tool: chapter.tool,
        expanded: chapterExpanded,
        nodeCount: counts.total,
        decisionCount: counts.decisions,
        eventCount: counts.events,
        deadEndCount: counts.deadEnds,
        discoveryCount: counts.discoveries,
        pivotCount: counts.pivots,
      },
      draggable: false,
    });

    edges.push({
      id: `${project.id}-${chapter.id}`,
      source: project.id,
      sourceHandle: 'bottom',
      target: chapter.id,
      targetHandle: 'top',
      type: 'default',
      style: { stroke: 'rgba(56, 189, 248, 0.7)', strokeWidth: 1.7 },
    });

    if (!chapterExpanded || counts.total === 0) {
      cursorY += COLLAPSED_PHASE_HEIGHT + PHASE_V_GAP;
      return;
    }

    const children = chapter.nodes.filter((n) => matchesFilter(n, options.filter));
    let childY = cursorY + 20;
    const childX = chapterX + PHASE_NODE_WIDTH + BRANCH_H_GAP;

    children.forEach((node) => {
      const nodeType =
        node.type === 'dead-end'
          ? 'deadEndNode'
          : node.type === 'decision'
          ? 'decisionNode'
          : node.type === 'discovery'
          ? 'discoveryNode'
          : node.type === 'pivot'
          ? 'pivotNode'
          : 'eventNode';

      nodes.push({
        id: node.id,
        type: nodeType,
        position: { x: childX, y: childY },
        data: {
          kind: node.type,
          label: node.title,
          description: node.description,
          chosenPath: (node.type === 'decision' || node.type === 'pivot') ? node.chosenPath : undefined,
          alternatives: (node.type === 'decision' || node.type === 'pivot') ? node.alternatives : undefined,
          failureReason: node.type === 'dead-end' ? node.failureReason : undefined,
          detailOpen: options.detailNodes.has(node.id),
        },
        draggable: false,
      });

      edges.push({
        id: `${chapter.id}-${node.id}`,
        source: chapter.id,
        sourceHandle: 'right',
        target: node.id,
        targetHandle: 'left',
        type: 'smoothstep',
        style: { stroke: 'rgba(56, 189, 248, 0.6)', strokeWidth: 1.6 },
      });

      const detailExtra = (options.detailNodes.has(node.id) && node.description) ? Math.max(60, Math.ceil(node.description.length / 40) * 25) : 0;

      if ((node.type === 'decision' || node.type === 'pivot') && node.alternatives.length > 0) {
        let altY = childY;
        const altX = childX + NODE_WIDTH + ALT_H_GAP;

        node.alternatives.forEach((alt, i) => {
          const altId = `${node.id}-alt-${i}`;

          nodes.push({
            id: altId,
            type: 'alternativeNode',
            position: { x: altX, y: altY },
            data: { kind: 'alternative', label: alt },
            draggable: false,
          });

          edges.push({
            id: `${node.id}-${altId}`,
            source: node.id,
            sourceHandle: 'right',
            target: altId,
            targetHandle: 'left',
            type: 'default',
            style: {
              stroke: 'rgba(251, 113, 133, 0.85)',
              strokeDasharray: '6 5',
              strokeWidth: 1.3,
            },
          });

          altY += ALT_V_GAP;
        });

        childY = Math.max(childY + CHILD_V_GAP + detailExtra, altY + detailExtra);
      } else {
        childY += CHILD_V_GAP + detailExtra;
      }
    });

    cursorY = childY + EXPANDED_PHASE_BOTTOM;
  });

  return { nodes, edges };
}
