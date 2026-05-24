import { C } from '../MetricsCard';
import type {
  NodeType,
  NodeCategory,
  FilterType,
  ProjectNode,
} from '../../types';
import { formatIsoDateShort } from '../../utils/dateUtils';
import { CATEGORY_ORDER, MONTHS } from './constants';

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return formatIsoDateShort(iso);
}

export function parseDateKey(dateStr: string): number {
  const parts = dateStr.trim().split(/\s+/);
  const month = MONTHS[parts[0]] || 0;
  const day = parseInt(parts[1], 10) || 0;
  return month * 100 + day;
}

export function getTypeColor(type: NodeType): string {
  switch (type) {
    case 'decision':
      return C.emerald;
    case 'event':
      return C.cyan;
    case 'dead-end':
      return C.rose;
    case 'discovery':
      return C.amber;
    case 'pivot':
      return C.violet;
    default:
      return C.slate;
  }
}

export function getCategoryColor(category?: NodeCategory): string {
  switch (category) {
    case 'technical':
      return C.cyan;
    case 'functional':
      return C.emerald;
    case 'ux-design':
      return C.amber;
    case 'process':
      return C.violet;
    default:
      return C.slate;
  }
}

export function formatCategory(category: NodeCategory): string {
  if (category === 'ux-design') {
    return 'UX/Design';
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function getCategoryCounts(nodes: ProjectNode[]): Record<NodeCategory, number> {
  return CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = nodes.filter((node) => node.category === category).length;
      return acc;
    },
    {
      technical: 0,
      functional: 0,
      'ux-design': 0,
      process: 0,
    } as Record<NodeCategory, number>,
  );
}

export function nodeMatchesFilter(node: ProjectNode, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (node.type === filter) return true;
  if (node.category === filter) return true;
  return false;
}
