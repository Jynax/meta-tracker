import React from 'react';
import { C } from './MetricsCard';
import {
  Project,
  ProjectNode,
  NodeType,
  NodeCategory,
  FilterType,
  DayEntry,
  ProjectPhase,
  ChapterType,
} from '../types';
import type { EpicTreeNode } from '../utils/trackerDataAdapter';

interface DayGroup {
  dayId: string;
  title?: string;
  phase?: ProjectPhase;
  chapterName?: string;
  chapterType?: ChapterType;
  nodes: ProjectNode[];
}

type ViewMode = 'chapters' | 'epics';

interface StackedTreeViewProps {
  project: Project;
  filter: string;
  onFilterChange: (filter: string) => void;
  expandedChapters: Set<string>;
  onChapterToggle: (chapterId: string) => void;
  expandedNode: string | null;
  onNodeToggle: (nodeId: string) => void;
  highlightChapter?: string | null;
  onJumpToSession?: (session: string) => void;
  days?: DayEntry[];
  dayPhaseMap?: Record<string, ProjectPhase>;
  // Epic-mode props (used when mode === 'epics' for MT)
  mode?: ViewMode;
  epicTree?: EpicTreeNode[];
  expandedEpics?: Set<string>;
  onEpicToggle?: (epicId: string) => void;
}

const EPIC_STATUS_COLOR: Record<string, string> = {
  'In Progress': C.cyan,
  Done: C.emerald,
  Retired: C.slate,
  Cancelled: C.rose,
  Queued: C.amber,
};

const TASK_STATUS_COLOR: Record<string, string> = {
  Done: C.emerald,
  'In Progress': C.cyan,
  Queued: C.amber,
  Blocked: C.rose,
  Cancelled: C.slate,
  Retired: C.muted,
};

const TASK_TOOL_COLOR: Record<string, string> = {
  'claude-code': C.emerald,
  'claude-ai': C.cyan,
  cursor: C.amber,
  cowork: C.slate,
  manual: C.violet,
  mixed: C.violet,
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const COLORS = C;

const PHASE_COLORS: Record<string, string> = {
  Research: '#60a5fa',
  Spec: COLORS.violet,
  Build: COLORS.amber,
  Review: '#fb923c',
  Shipped: COLORS.emerald,
};

const CATEGORY_ORDER: NodeCategory[] = ['technical', 'functional', 'ux-design', 'process'];

const MONTHS: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

function parseDateKey(dateStr: string): number {
  const parts = dateStr.trim().split(/\s+/);
  const month = MONTHS[parts[0]] || 0;
  const day = parseInt(parts[1], 10) || 0;
  return month * 100 + day;
}

function getTypeColor(type: NodeType): string {
  switch (type) {
    case 'decision':
      return COLORS.emerald;
    case 'event':
      return COLORS.cyan;
    case 'dead-end':
      return COLORS.rose;
    case 'discovery':
      return COLORS.amber;
    case 'pivot':
      return COLORS.violet;
    default:
      return COLORS.slate;
  }
}

function getCategoryColor(category?: NodeCategory): string {
  switch (category) {
    case 'technical':
      return COLORS.cyan;
    case 'functional':
      return COLORS.emerald;
    case 'ux-design':
      return COLORS.amber;
    case 'process':
      return COLORS.violet;
    default:
      return COLORS.slate;
  }
}

function formatCategory(category: NodeCategory): string {
  if (category === 'ux-design') {
    return 'UX/Design';
  }
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function getCategoryCounts(nodes: ProjectNode[]): Record<NodeCategory, number> {
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

function nodeMatchesFilter(node: ProjectNode, filter: FilterType): boolean {
  if (filter === 'all') return true;
  if (node.type === filter) return true;
  if (node.category === filter) return true;
  return false;
}

export default function StackedTreeView(props: StackedTreeViewProps) {
  const {
    project,
    filter,
    expandedChapters,
    onChapterToggle,
    expandedNode,
    onNodeToggle,
    highlightChapter,
    days,
    dayPhaseMap,
    mode = 'chapters',
    epicTree,
    expandedEpics,
    onEpicToggle,
  } = props;

  const activeFilter: FilterType = filter as FilterType;

  // ── Epic mode rendering ─────────────────────────────────────────
  if (mode === 'epics' && epicTree) {
    return (
      <EpicTreeView
        epicTree={epicTree}
        expandedEpics={expandedEpics ?? new Set<string>()}
        onEpicToggle={onEpicToggle ?? (() => {})}
        expandedNode={expandedNode}
        onNodeToggle={onNodeToggle}
        filter={activeFilter}
      />
    );
  }

  const allNodes = project.chapters.flatMap((chapter) => chapter.nodes);
  const totalEntries = allNodes.length;
  const deadEnds = allNodes.filter((node) => node.type === 'dead-end').length;
  const discoveries = allNodes.filter((node) => node.type === 'discovery').length;
  const pivots = allNodes.filter((node) => node.type === 'pivot').length;
  const categoryCounts = getCategoryCounts(allNodes);

  // Build day groups: group all nodes by dayId, sorted newest-first
  const dayGroups: DayGroup[] = React.useMemo(() => {
    // Build a day lookup from the days prop
    const dayLookup: Record<string, DayEntry> = {};
    if (days) {
      for (const d of days) {
        dayLookup[d.date] = d;
      }
    }

    // Group nodes by dayId
    const groupMap = new Map<string, ProjectNode[]>();
    for (const chapter of project.chapters) {
      for (const node of chapter.nodes) {
        const dayId = node.dayId || 'Unknown';
        if (!groupMap.has(dayId)) {
          groupMap.set(dayId, []);
        }
        groupMap.get(dayId)!.push(node);
      }
    }

    // Convert to array and sort newest-first
    const groups: DayGroup[] = [];
    for (const [dayId, nodes] of groupMap.entries()) {
      const dayEntry = dayLookup[dayId];
      const phase = dayPhaseMap?.[dayId] ?? dayEntry?.phase;
      // Find chapter name for the first node's chapter (for subtitle)
      const firstNodeChapter = project.chapters.find((ch) =>
        ch.nodes.some((n) => n.id === nodes[0]?.id),
      );
      groups.push({
        dayId,
        title: dayEntry?.title,
        phase,
        chapterName: firstNodeChapter?.name,
        chapterType: firstNodeChapter?.chapterType,
        nodes,
      });
    }

    groups.sort((a, b) => parseDateKey(b.dayId) - parseDateKey(a.dayId));
    return groups;
  }, [project.chapters, days, dayPhaseMap]);

  const renderCategoryBar = (
    counts: Record<NodeCategory, number>,
    total: number,
    showLabels: boolean,
    height: number,
    width: React.CSSProperties['width'] = '100%',
  ) => {
    const segments = CATEGORY_ORDER.filter((category) => counts[category] > 0);

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          gap: segments.length > 1 ? 2 : 0,
          borderRadius: 9999,
          overflow: 'hidden',
          background: COLORS.border,
        }}
      >
        {segments.map((category) => {
          const count = counts[category];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const showText = showLabels && percentage > 12;
          return (
            <div
              key={category}
              style={{
                width: `${percentage}%`,
                minWidth: 0,
                background: getCategoryColor(category),
                opacity: 0.8,
                color: COLORS.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: showText ? '0 6px' : 0,
              }}
              title={`${formatCategory(category)} (${count})`}
            >
              {showText ? `${formatCategory(category)} (${count})` : ''}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayHeader = (group: DayGroup) => {
    const dayCounts = getCategoryCounts(group.nodes);
    const dayDeadEnds = group.nodes.filter((node) => node.type === 'dead-end').length;
    const dayDiscoveries = group.nodes.filter((node) => node.type === 'discovery').length;
    const dayPivots = group.nodes.filter((node) => node.type === 'pivot').length;
    const isExpanded = expandedChapters.has(group.dayId);
    const isHighlighted = highlightChapter === group.dayId;

    return (
      <button
        type="button"
        onClick={() => {
          onChapterToggle(group.dayId);
        }}
        style={{
          width: '100%',
          textAlign: 'left',
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          cursor: 'pointer',
          boxShadow: isHighlighted ? `0 0 0 1px color-mix(in srgb, ${COLORS.cyan} 19%, transparent)` : 'none',
          borderRadius: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.white }}>{group.dayId}</span>
            {group.title && (
              <span style={{ fontSize: 15, color: COLORS.slate, fontWeight: 500 }}>{group.title}</span>
            )}
            <span style={{ fontSize: 15, color: COLORS.slate }}>{isExpanded ? '\u25BC' : '\u25B6'}</span>
            <span
              style={{
                fontSize: 13,
                color: COLORS.slate,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 9999,
                padding: '2px 8px',
                fontWeight: 700,
              }}
            >
              {group.nodes.length}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 13, color: COLORS.muted, fontWeight: 600 }}>
                <span>{group.nodes.length} entries</span>
                {dayDeadEnds > 0 && <span style={{ color: COLORS.rose }}>{dayDeadEnds} dead ends</span>}
                {dayDiscoveries > 0 && <span style={{ color: COLORS.amber }}>{dayDiscoveries} discoveries</span>}
                {dayPivots > 0 && <span style={{ color: COLORS.violet }}>{dayPivots} pivots</span>}
              </div>
              {renderCategoryBar(dayCounts, group.nodes.length, false, 12, 120)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {group.chapterName && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, color: COLORS.muted }}>{group.chapterName}</span>
                  {group.chapterType && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: group.chapterType === 'phase' ? COLORS.violet : COLORS.slate,
                        background: group.chapterType === 'phase'
                          ? `color-mix(in srgb, ${COLORS.violet} 10%, transparent)`
                          : `color-mix(in srgb, ${COLORS.slate} 8%, transparent)`,
                        borderRadius: 4,
                        padding: '1px 5px',
                      }}
                    >
                      {group.chapterType === 'phase' ? 'Phase' : 'Date'}
                    </span>
                  )}
                </span>
              )}
              {group.phase && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: PHASE_COLORS[group.phase] ?? COLORS.slate,
                    background: `color-mix(in srgb, ${PHASE_COLORS[group.phase] ?? COLORS.slate} 10%, transparent)`,
                    borderRadius: 9999,
                    padding: '1px 8px',
                  }}
                >
                  {group.phase}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span
            style={{
              color: COLORS.white,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {totalEntries} entries
          </span>
          <span style={{ color: COLORS.border }}>|</span>
          {deadEnds > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.rose,
                background: `color-mix(in srgb, ${COLORS.rose} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {deadEnds} dead ends
            </span>
          )}
          {discoveries > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.amber,
                background: `color-mix(in srgb, ${COLORS.amber} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {discoveries} discoveries
            </span>
          )}
          {pivots > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: COLORS.violet,
                background: `color-mix(in srgb, ${COLORS.violet} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {pivots} pivots
            </span>
          )}
        </div>

        {renderCategoryBar(categoryCounts, totalEntries, true, 24)}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {CATEGORY_ORDER.map((category) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: getCategoryColor(category),
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: 14, color: COLORS.muted }}>{`${formatCategory(category)} (${categoryCounts[category]})`}</span>
            </div>
          ))}
        </div>
      </div>

      {dayGroups.map((group) => {
        const isExpanded = expandedChapters.has(group.dayId);
        const filteredNodes = group.nodes.filter((node) => nodeMatchesFilter(node, activeFilter));

        return (
          <div
            key={group.dayId}
            style={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            {renderDayHeader(group)}

            {isExpanded && (
              <div style={{ padding: '0 16px 16px' }}>
                {filteredNodes.length === 0 ? (
                  <div style={{ color: COLORS.muted, fontSize: 12, padding: '8px 0 4px' }}>
                    No entries match filter
                  </div>
                ) : (
                  filteredNodes.map((node) => {
                    const isNodeExpanded = expandedNode === node.id;
                    const typeColor = getTypeColor(node.type);
                    const categoryColor = getCategoryColor(node.category);
                    // Find the chapter this node belongs to for a subtle label
                    const nodeChapter = project.chapters.find((ch) =>
                      ch.nodes.some((n) => n.id === node.id),
                    );

                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => onNodeToggle(node.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: COLORS.bg,
                          border: 'none',
                          borderLeft: `3px solid ${typeColor}`,
                          borderRadius: 8,
                          padding: '12px 16px',
                          marginBottom: 6,
                          cursor: 'pointer',
                          color: COLORS.white,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: typeColor, textTransform: 'uppercase' }}>
                            {node.type}
                          </span>
                          {node.category && (
                            <span
                              style={{
                                fontSize: 12,
                                color: categoryColor,
                                background: `color-mix(in srgb, ${categoryColor} 8%, transparent)`,
                                borderRadius: 9999,
                                padding: '2px 7px',
                                fontWeight: 700,
                              }}
                            >
                              {formatCategory(node.category)}
                            </span>
                          )}
                          {nodeChapter && (
                            <span
                              style={{
                                fontSize: 11,
                                color: COLORS.muted,
                                marginLeft: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              {nodeChapter.name}
                              {nodeChapter.chapterType === 'phase' && (
                                <span
                                  style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    color: COLORS.violet,
                                    background: `color-mix(in srgb, ${COLORS.violet} 10%, transparent)`,
                                    borderRadius: 4,
                                    padding: '1px 4px',
                                  }}
                                >
                                  Phase
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: 5, fontSize: 15, fontWeight: 700, color: COLORS.white }}>
                          {node.title}
                        </div>

                        {isNodeExpanded && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 14, color: COLORS.slate, lineHeight: 1.6 }}>{node.description}</div>

                            {'chosenPath' in node && node.chosenPath && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: COLORS.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                  }}
                                >
                                  Chosen Path
                                </div>
                                <div style={{ fontSize: 14, color: COLORS.emerald, marginTop: 2 }}>{node.chosenPath}</div>
                              </div>
                            )}

                            {'alternatives' in node && node.alternatives.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: COLORS.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                  }}
                                >
                                  Alternatives Considered
                                </div>
                                {node.alternatives.map((alternative, index) => (
                                  <div
                                    key={`${node.id}-alt-${index}`}
                                    style={{
                                      fontSize: 13,
                                      color: COLORS.rose,
                                      background: `color-mix(in srgb, ${COLORS.rose} 3%, transparent)`,
                                      borderLeft: `2px dashed ${COLORS.rose}`,
                                      padding: '4px 8px',
                                      marginBottom: 4,
                                      borderRadius: 4,
                                    }}
                                  >
                                    {alternative}
                                  </div>
                                ))}
                              </div>
                            )}

                            {node.lesson && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: COLORS.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                  }}
                                >
                                  Lesson
                                </div>
                                <div style={{ fontSize: 14, color: COLORS.amber, marginTop: 2, fontStyle: 'italic' }}>
                                  {node.lesson}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Epic Tree (MT-only) ─────────────────────────────────────────────

interface EpicTreeViewProps {
  epicTree: EpicTreeNode[];
  expandedEpics: Set<string>;
  onEpicToggle: (epicId: string) => void;
  expandedNode: string | null;
  onNodeToggle: (nodeId: string) => void;
  filter: FilterType;
}

function EpicTreeView({
  epicTree,
  expandedEpics,
  onEpicToggle,
  expandedNode,
  onNodeToggle,
  filter,
}: EpicTreeViewProps) {
  const allTasks = epicTree.flatMap((e) => e.children);
  const totalTasks = allTasks.length;
  const totalDecisions = allTasks.reduce((s, t) => s + t.decisions.length, 0);
  const totalEvents = allTasks.reduce((s, t) => s + t.events.length, 0);
  const totalPRs = allTasks.reduce(
    (s, t) => s + t.outputs.filter((o) => o.type === 'PR').length,
    0,
  );

  const taskMatchesFilter = (task: EpicTreeNode['children'][number]): boolean => {
    if (filter === 'all') return true;
    // Filter by event type or decision presence
    if (filter === 'decision') return task.decisions.length > 0;
    if (filter === 'discovery' || filter === 'pivot' || filter === 'dead-end') {
      return task.events.some((e) => e.type === filter);
    }
    if (filter === 'event') return task.events.length > 0;
    // Category filters don't apply to tasks (no category field)
    return true;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          background: C.cardBg,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ color: C.white, fontSize: 15, fontWeight: 600 }}>
            {epicTree.length} epic{epicTree.length === 1 ? '' : 's'}
          </span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.cyan }}>
            {totalTasks} task{totalTasks === 1 ? '' : 's'}
          </span>
          {totalPRs > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.emerald,
                background: `color-mix(in srgb, ${C.emerald} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {totalPRs} PRs
            </span>
          )}
          {totalDecisions > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.amber,
                background: `color-mix(in srgb, ${C.amber} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {totalDecisions} decisions
            </span>
          )}
          {totalEvents > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.violet,
                background: `color-mix(in srgb, ${C.violet} 8%, transparent)`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {totalEvents} events
            </span>
          )}
        </div>
      </div>

      {epicTree.map((epic) => {
        const isExpanded = expandedEpics.has(epic.id);
        const epicColor = EPIC_STATUS_COLOR[epic.status] ?? C.muted;
        const filteredTasks = epic.children.filter(taskMatchesFilter);

        return (
          <div
            key={epic.id}
            style={{
              background: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => onEpicToggle(epic.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 15, color: C.slate }}>
                  {isExpanded ? '\u25BC' : '\u25B6'}
                </span>
                <span style={{ fontSize: 18, fontWeight: 700, color: C.white }}>
                  {epic.title}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: epicColor,
                    background: `color-mix(in srgb, ${epicColor} 12%, transparent)`,
                    borderRadius: 9999,
                    padding: '2px 8px',
                  }}
                >
                  {epic.status}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: C.slate,
                    border: `1px solid ${C.border}`,
                    borderRadius: 9999,
                    padding: '2px 8px',
                    fontWeight: 700,
                  }}
                >
                  {epic.children.length} task{epic.children.length === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, fontSize: 12, color: C.muted }}>
                <span>
                  {formatDate(epic.startDate)} →{' '}
                  {epic.endDate ? formatDate(epic.endDate) : 'ongoing'}
                </span>
              </div>
            </button>

            {isExpanded && (
              <div style={{ padding: '0 16px 16px' }}>
                {filteredTasks.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: 12, padding: '8px 0 4px' }}>
                    No tasks match filter
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const taskNodeId = `task-${task.id}`;
                    const isTaskExpanded = expandedNode === taskNodeId;
                    const taskStatusColor = TASK_STATUS_COLOR[task.status] ?? C.muted;
                    const toolColor = task.tool ? TASK_TOOL_COLOR[task.tool] ?? C.muted : C.muted;

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onNodeToggle(taskNodeId)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: C.bg,
                          border: 'none',
                          borderLeft: `3px solid ${taskStatusColor}`,
                          borderRadius: 8,
                          padding: '12px 16px',
                          marginBottom: 6,
                          cursor: 'pointer',
                          color: C.white,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
                            #{task.id}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: taskStatusColor,
                              background: `color-mix(in srgb, ${taskStatusColor} 12%, transparent)`,
                              borderRadius: 9999,
                              padding: '2px 7px',
                              textTransform: 'uppercase',
                            }}
                          >
                            {task.status}
                          </span>
                          {task.tool && (
                            <span
                              style={{
                                fontSize: 11,
                                color: toolColor,
                                background: `color-mix(in srgb, ${toolColor} 8%, transparent)`,
                                borderRadius: 9999,
                                padding: '2px 7px',
                                fontWeight: 600,
                              }}
                            >
                              {task.tool}
                            </span>
                          )}
                          {task.outputs
                            .filter((o) => o.type === 'PR')
                            .map((o) => (
                              <span
                                key={`pr-${o.ref}`}
                                style={{
                                  fontSize: 11,
                                  color: C.emerald,
                                  background: `color-mix(in srgb, ${C.emerald} 8%, transparent)`,
                                  borderRadius: 9999,
                                  padding: '2px 7px',
                                  fontWeight: 600,
                                }}
                              >
                                PR #{o.ref}
                              </span>
                            ))}
                          {task.decisions.length > 0 && (
                            <span
                              title={`${task.decisions.length} decision${task.decisions.length === 1 ? '' : 's'}`}
                              style={{ color: C.amber, fontSize: 12 }}
                            >
                              ◆
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 11,
                              color: C.muted,
                              marginLeft: 'auto',
                            }}
                          >
                            {formatDate(task.dates.completed ?? task.dates.created)}
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.white,
                          }}
                        >
                          {task.title}
                        </div>

                        {isTaskExpanded && (
                          <div style={{ marginTop: 10 }}>
                            {task.decisions.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: C.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                  }}
                                >
                                  Decisions
                                </div>
                                {task.decisions.map((d) => (
                                  <div
                                    key={d.id}
                                    style={{
                                      padding: '6px 10px',
                                      borderLeft: `2px solid ${C.amber}`,
                                      background: `color-mix(in srgb, ${C.amber} 5%, transparent)`,
                                      borderRadius: 4,
                                      marginBottom: 4,
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 13,
                                        color: C.white,
                                        fontWeight: 600,
                                      }}
                                    >
                                      ◆ {d.title}
                                    </div>
                                    {d.chosen && (
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: C.emerald,
                                          marginTop: 2,
                                        }}
                                      >
                                        → {d.chosen}
                                      </div>
                                    )}
                                    {d.alternatives.length > 0 && (
                                      <div style={{ marginTop: 4 }}>
                                        {d.alternatives.map((alt, i) => (
                                          <div
                                            key={i}
                                            style={{
                                              fontSize: 12,
                                              color: C.rose,
                                              borderLeft: `2px dashed ${C.rose}`,
                                              padding: '2px 6px',
                                              marginTop: 2,
                                            }}
                                          >
                                            {alt}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {d.rationale && (
                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: C.slate,
                                          marginTop: 4,
                                          fontStyle: 'italic',
                                        }}
                                      >
                                        {d.rationale}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {task.events.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: C.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                  }}
                                >
                                  Events
                                </div>
                                {task.events.map((e, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      fontSize: 12,
                                      color: C.slate,
                                      padding: '2px 0',
                                    }}
                                  >
                                    <span style={{ color: C.violet, fontWeight: 600 }}>
                                      {e.type}
                                    </span>{' '}
                                    {formatDate(e.date)} — {e.note}
                                  </div>
                                ))}
                              </div>
                            )}

                            {task.outputs.filter((o) => o.type !== 'PR').length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: C.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                    marginBottom: 4,
                                  }}
                                >
                                  Other Outputs
                                </div>
                                {task.outputs
                                  .filter((o) => o.type !== 'PR')
                                  .map((o, i) => (
                                    <div
                                      key={i}
                                      style={{ fontSize: 12, color: C.slate }}
                                    >
                                      {o.type}: {String(o.ref)}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
