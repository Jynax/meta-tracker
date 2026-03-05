import React from 'react';
import {
  Project,
  Chapter,
  ProjectNode,
  NodeType,
  NodeCategory,
  FilterType,
} from '../types';

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
}

const COLORS = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  border: '#334155',
  white: '#f8fafc',
  muted: '#94a3b8',
  slate: '#94a3b8',
  cyan: '#22d3ee',
  emerald: '#34d399',
  rose: '#fb7185',
  amber: '#fbbf24',
  violet: '#a78bfa',
};

const CATEGORY_ORDER: NodeCategory[] = ['technical', 'functional', 'ux-design', 'process'];

// type FilterOption = {
//   value: FilterType;
//   label: string;
//   color: string;
// };

// const FILTER_OPTIONS: FilterOption[] = [
//   { value: 'all', label: 'All', color: COLORS.cyan },
//   { value: 'decision', label: 'Decisions', color: COLORS.emerald },
//   { value: 'dead-end', label: 'Dead Ends', color: COLORS.rose },
//   { value: 'event', label: 'Events', color: COLORS.cyan },
//   { value: 'discovery', label: 'Discoveries', color: COLORS.amber },
//   { value: 'pivot', label: 'Pivots', color: COLORS.violet },
// ];

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
    onJumpToSession,
  } = props;

  // const [showFilters, setShowFilters] = React.useState(false);
  const activeFilter: FilterType = filter as FilterType;

  const allNodes = project.chapters.flatMap((chapter) => chapter.nodes);
  const totalEntries = allNodes.length;
  const deadEnds = allNodes.filter((node) => node.type === 'dead-end').length;
  const discoveries = allNodes.filter((node) => node.type === 'discovery').length;
  const pivots = allNodes.filter((node) => node.type === 'pivot').length;
  const categoryCounts = getCategoryCounts(allNodes);

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
                background: `${getCategoryColor(category)}cc`,
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

  const renderChapterHeader = (chapter: Chapter) => {
    const chapterCounts = getCategoryCounts(chapter.nodes);
    const chapterDeadEnds = chapter.nodes.filter((node) => node.type === 'dead-end').length;
    const chapterDiscoveries = chapter.nodes.filter((node) => node.type === 'discovery').length;
    const chapterPivots = chapter.nodes.filter((node) => node.type === 'pivot').length;
    const isExpanded = expandedChapters.has(chapter.id);
    const isHighlighted = highlightChapter === chapter.id;

    return (
      <button
        type="button"
        onClick={() => {
          onChapterToggle(chapter.id);
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
          boxShadow: isHighlighted ? `0 0 0 1px ${COLORS.cyan}30` : 'none',
          borderRadius: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: COLORS.muted,
              marginBottom: 4,
              fontWeight: 700,
            }}
          >
            Chapter
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.white }}>{chapter.name}</span>
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
              {chapter.nodes.length}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 13, color: COLORS.muted, fontWeight: 600 }}>
                <span>{chapter.nodes.length} entries</span>
                {chapterDeadEnds > 0 && <span style={{ color: COLORS.rose }}>{chapterDeadEnds} dead ends</span>}
                {chapterDiscoveries > 0 && <span style={{ color: COLORS.amber }}>{chapterDiscoveries} discoveries</span>}
                {chapterPivots > 0 && <span style={{ color: COLORS.violet }}>{chapterPivots} pivots</span>}
              </div>
              {renderCategoryBar(chapterCounts, chapter.nodes.length, false, 12, 120)}
            </div>

            <div style={{ fontSize: 13, color: COLORS.muted }}>{`${chapter.period} � ${chapter.toolLabel}`}</div>
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
                background: `${COLORS.rose}15`,
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
                background: `${COLORS.amber}15`,
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
                background: `${COLORS.violet}15`,
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

      {/* <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            style={{
              border: `1px solid ${COLORS.border}`,
              background: 'transparent',
              color: COLORS.white,
              borderRadius: 8,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Filter {showFilters ? '▾' : '▸'}
          </button>
          {activeFilter !== 'all' && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: getTypeColor(activeFilter),
                background: `${getTypeColor(activeFilter)}20`,
                border: `1px solid ${getTypeColor(activeFilter)}40`,
                borderRadius: 9999,
                padding: '2px 8px',
              }}
            >
              {FILTER_OPTIONS.find((option) => option.value === activeFilter)?.label ?? activeFilter}
            </span>
          )}
        </div>

        {showFilters && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTER_OPTIONS.map((option) => {
              const isActive = option.value === activeFilter;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterChange(option.value)}
                  style={{
                    borderRadius: 8,
                    border: `1px solid ${isActive ? `${option.color}40` : COLORS.border}`,
                    background: isActive ? `${option.color}20` : 'transparent',
                    color: isActive ? option.color : COLORS.muted,
                    fontSize: 14,
                    fontWeight: 700,
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div> */}

      {[...project.chapters].reverse().map((chapter) => {
        const isExpanded = expandedChapters.has(chapter.id);
        const filteredNodes = chapter.nodes.filter((node) => nodeMatchesFilter(node, activeFilter));

        return (
          <div
            key={chapter.id}
            style={{
              background: COLORS.cardBg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            {renderChapterHeader(chapter)}

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
                                background: `${categoryColor}15`,
                                borderRadius: 9999,
                                padding: '2px 7px',
                                fontWeight: 700,
                              }}
                            >
                              {formatCategory(node.category)}
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
                                      background: `${COLORS.rose}08`,
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
