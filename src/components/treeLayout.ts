import type { Edge, Node } from '@xyflow/react';
import type { FilterType, Phase, Project, ProjectNode } from '../types';

export type TreeNodeKind = 'root' | 'phase' | 'decision' | 'event' | 'dead-end' | 'alternative';

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

const H_SPACING = 300;
const V_SPACING = 150;

const matchesFilter = (node: ProjectNode, filter: FilterType) => filter === 'all' || node.type === filter;

const phaseColumnX = (index: number, total: number) => (index - (total - 1) / 2) * H_SPACING;

export function buildTreeLayout(project: Project, options: TreeLayoutOptions): TreeLayoutResult {
  const nodes: Node<TreeNodeData>[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: project.id,
    type: 'phaseNode',
    position: { x: -150, y: 0 },
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
    const phaseX = phaseColumnX(phaseIndex, project.phases.length);
    const phaseY = V_SPACING;
    const phaseExpanded = options.expandedPhases.has(phase.id);

    nodes.push({
      id: phaseId,
      type: 'phaseNode',
      position: { x: phaseX, y: phaseY },
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
      type: 'smoothstep',
      style: { stroke: 'rgba(56, 189, 248, 0.7)', strokeWidth: 1.7 },
    });

    if (!phaseExpanded) {
      return;
    }

    const children = phase.nodes.filter((node) => matchesFilter(node, options.filter));
    children.forEach((node, childIndex) => {
      const childId = node.id;
      const childX = phaseX + (childIndex - (children.length - 1) / 2) * H_SPACING;
      const childY = phaseY + V_SPACING;
      const nodeType = node.type === 'dead-end' ? 'deadEndNode' : node.type === 'decision' ? 'decisionNode' : 'eventNode';

      nodes.push({
        id: childId,
        type: nodeType,
        position: { x: childX, y: childY },
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

      if (node.type !== 'decision') {
        return;
      }

      node.alternatives.forEach((alternative, altIndex) => {
        const alternativeId = `${node.id}-alt-${altIndex}`;
        nodes.push({
          id: alternativeId,
          type: 'alternativeNode',
          position: {
            x: childX + (altIndex - (node.alternatives.length - 1) / 2) * (H_SPACING * 0.72),
            y: childY + V_SPACING,
          },
          data: {
            kind: 'alternative',
            label: alternative,
          },
          draggable: false,
        });

        edges.push({
          id: `${childId}-${alternativeId}`,
          source: childId,
          target: alternativeId,
          type: 'smoothstep',
          style: { stroke: 'rgba(251, 113, 133, 0.85)', strokeDasharray: '6 5', strokeWidth: 1.3 },
        });
      });
    });
  });

  return { nodes, edges };
}
