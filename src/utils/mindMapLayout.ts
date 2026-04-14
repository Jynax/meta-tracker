import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
} from 'd3-force';
import type { NodeCategory, NodeType, Project, ProjectNode } from '../types';

export interface MindMapNodeDatum extends SimulationNodeDatum {
  id: string;
  type: NodeType;
  category?: NodeCategory;
  title: string;
  description: string;
  chosenPath?: string;
  alternatives?: string[];
  failureReason?: string;
  chapterId: string;
  chapterName: string;
  sessionIndex: number;
  featured?: boolean;
  degree: number;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface ChapterCentroid {
  chapterId: string;
  name: string;
  x: number;
  y: number;
  nodeCount: number;
}

export interface MindMapLayoutResult {
  nodes: MindMapNodeDatum[];
  edges: MindMapEdge[];
  chapterCentroids: ChapterCentroid[];
}

export interface MindMapLayoutFilters {
  categories?: Set<NodeCategory>;
  types?: Set<NodeType>;
}

const WEIGHT_SAME_CATEGORY = 10;
const WEIGHT_SAME_CHAPTER = 3;
const WEIGHT_ADJACENT_SESSION = 2;
const WEIGHT_SAME_TYPE = 1;
const K_NEAREST = 4;
const SIM_TICKS = 300;
const NODE_RADIUS = 18;

function flattenProject(project: Project): MindMapNodeDatum[] {
  const result: MindMapNodeDatum[] = [];
  project.chapters.forEach((chapter, sessionIndex) => {
    chapter.nodes.forEach((node: ProjectNode) => {
      const base: MindMapNodeDatum = {
        id: node.id,
        type: node.type,
        category: node.category,
        title: node.title,
        description: node.description,
        chapterId: chapter.id,
        chapterName: chapter.name,
        sessionIndex,
        featured: node.featured,
        degree: 0,
      };
      if (node.type === 'decision' || node.type === 'pivot') {
        base.chosenPath = node.chosenPath;
        base.alternatives = node.alternatives;
      }
      if (node.type === 'dead-end') {
        base.failureReason = node.failureReason;
      }
      result.push(base);
    });
  });
  return result;
}

function annotateDegrees(nodes: MindMapNodeDatum[], edges: MindMapEdge[]): void {
  const counts = new Map<string, number>();
  edges.forEach((e) => {
    counts.set(e.source, (counts.get(e.source) ?? 0) + 1);
    counts.set(e.target, (counts.get(e.target) ?? 0) + 1);
  });
  nodes.forEach((n) => {
    n.degree = counts.get(n.id) ?? 0;
  });
}

function scorePair(a: MindMapNodeDatum, b: MindMapNodeDatum): number {
  let score = 0;
  if (a.category && b.category && a.category === b.category) score += WEIGHT_SAME_CATEGORY;
  if (a.chapterId === b.chapterId) score += WEIGHT_SAME_CHAPTER;
  if (Math.abs(a.sessionIndex - b.sessionIndex) === 1) score += WEIGHT_ADJACENT_SESSION;
  if (a.type === b.type) score += WEIGHT_SAME_TYPE;
  return score;
}

function buildEdges(nodes: MindMapNodeDatum[]): MindMapEdge[] {
  if (nodes.length < 2) return [];

  const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const kept = new Map<string, MindMapEdge>();

  nodes.forEach((node) => {
    const scored: Array<{ other: MindMapNodeDatum; score: number }> = [];
    nodes.forEach((other) => {
      if (other.id === node.id) return;
      const score = scorePair(node, other);
      if (score > 0) scored.push({ other, score });
    });
    scored.sort((a, b) => b.score - a.score);
    const topK = scored.slice(0, K_NEAREST);
    topK.forEach(({ other, score }) => {
      const key = edgeKey(node.id, other.id);
      if (!kept.has(key)) {
        kept.set(key, {
          id: `mm-${key}`,
          source: node.id < other.id ? node.id : other.id,
          target: node.id < other.id ? other.id : node.id,
          weight: score,
        });
      }
    });
  });

  return Array.from(kept.values());
}

interface SimLink {
  source: string | MindMapNodeDatum;
  target: string | MindMapNodeDatum;
  weight: number;
}

function runSimulation(nodes: MindMapNodeDatum[], edges: MindMapEdge[]): void {
  if (nodes.length === 0) return;

  const links: SimLink[] = edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight }));

  const radius = Math.max(240, Math.sqrt(nodes.length) * 70);
  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    n.x = Math.cos(angle) * radius;
    n.y = Math.sin(angle) * radius;
  });

  const sim = forceSimulation<MindMapNodeDatum>(nodes)
    .force(
      'link',
      forceLink<MindMapNodeDatum, SimLink>(links)
        .id((d) => d.id)
        .distance((l) => 180 - Math.min(90, l.weight * 5))
        .strength((l) => Math.min(0.9, 0.15 + l.weight * 0.05)),
    )
    .force('charge', forceManyBody<MindMapNodeDatum>().strength(-400).distanceMax(1400))
    .force('center', forceCenter(0, 0))
    .force('collide', forceCollide<MindMapNodeDatum>(NODE_RADIUS + 15).strength(0.95))
    .stop();

  for (let i = 0; i < SIM_TICKS; i += 1) {
    sim.tick();
  }
}

function computeCentroids(nodes: MindMapNodeDatum[]): ChapterCentroid[] {
  const buckets = new Map<string, { name: string; members: MindMapNodeDatum[] }>();
  nodes.forEach((n) => {
    const entry = buckets.get(n.chapterId) ?? { name: n.chapterName, members: [] };
    entry.members.push(n);
    buckets.set(n.chapterId, entry);
  });
  return Array.from(buckets.entries()).map(([chapterId, v]) => {
    const count = v.members.length;
    if (count === 0) {
      return { chapterId, name: v.name, x: 0, y: 0, nodeCount: 0 };
    }
    const sumX = v.members.reduce((s, n) => s + (n.x ?? 0), 0);
    const sumY = v.members.reduce((s, n) => s + (n.y ?? 0), 0);
    const cx = sumX / count;
    const cy = sumY / count;
    let best = v.members[0];
    let bestDist = Infinity;
    v.members.forEach((m) => {
      const dx = (m.x ?? 0) - cx;
      const dy = (m.y ?? 0) - cy;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = m;
      }
    });
    return {
      chapterId,
      name: v.name,
      x: best.x ?? 0,
      y: best.y ?? 0,
      nodeCount: count,
    };
  });
}

function passesFilter(node: MindMapNodeDatum, filters?: MindMapLayoutFilters): boolean {
  if (!filters) return true;
  if (filters.categories && filters.categories.size > 0) {
    if (!node.category || !filters.categories.has(node.category)) return false;
  }
  if (filters.types && filters.types.size > 0) {
    if (!filters.types.has(node.type)) return false;
  }
  return true;
}

export function buildMindMapLayout(project: Project, filters?: MindMapLayoutFilters): MindMapLayoutResult {
  const all = flattenProject(project);
  const nodes = all.filter((n) => passesFilter(n, filters));
  const edges = buildEdges(nodes);
  annotateDegrees(nodes, edges);
  runSimulation(nodes, edges);
  const chapterCentroids = computeCentroids(nodes);
  return { nodes, edges, chapterCentroids };
}

export function getTier1Neighbors(nodeId: string, edges: MindMapEdge[]): Set<string> {
  const neighbors = new Set<string>();
  edges.forEach((e) => {
    if (e.source === nodeId) neighbors.add(e.target);
    else if (e.target === nodeId) neighbors.add(e.source);
  });
  return neighbors;
}

export function getTier2Relatives(
  nodeId: string,
  nodes: MindMapNodeDatum[],
  tier1: Set<string>,
): Set<string> {
  const focus = nodes.find((n) => n.id === nodeId);
  if (!focus) return new Set();
  const result = new Set<string>();
  nodes.forEach((other) => {
    if (other.id === nodeId || tier1.has(other.id)) return;
    const sameCategory = focus.category && other.category && focus.category === other.category;
    const sameChapter = focus.chapterId === other.chapterId;
    const adjacentSession = Math.abs(focus.sessionIndex - other.sessionIndex) <= 1;
    if (sameCategory || sameChapter || adjacentSession) {
      result.add(other.id);
    }
  });
  return result;
}

export const NODE_TYPE_COLORS: Record<NodeType, string> = {
  decision: '#34d399',
  pivot: '#a78bfa',
  discovery: '#fbbf24',
  'dead-end': '#fb7185',
  event: '#22d3ee',
};

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  decision: 'Decision',
  pivot: 'Pivot',
  discovery: 'Discovery',
  'dead-end': 'Dead End',
  event: 'Event',
};
