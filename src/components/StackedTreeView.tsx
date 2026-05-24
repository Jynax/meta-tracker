import React, { useState } from 'react';
import { C } from './MetricsCard';
import type {
  ProjectNode,
  NodeCategory,
  FilterType,
  DayEntry,
} from '../types';
import type { DayGroup, TooltipState, StackedTreeViewProps } from './stacked-tree/types';
import { CATEGORY_ORDER, PHASE_COLORS } from './stacked-tree/constants';
import {
  parseDateKey,
  getTypeColor,
  getCategoryColor,
  formatCategory,
  getCategoryCounts,
  nodeMatchesFilter,
} from './stacked-tree/helpers';
import { TooltipLayer } from './stacked-tree/TooltipLayer';
import { EpicTreeView } from './stacked-tree/EpicTreeView';

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

  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const activeFilter: FilterType = filter as FilterType;

  // NOTE: All hooks must be called unconditionally before any early return,
  // so the hook call order stays stable across mode switches (epic ↔ chapters).
  // dayGroups is only used in chapters mode but computing it in epic mode is cheap
  // and avoids "Rendered more hooks than during previous render" violations.
  const dayGroups: DayGroup[] = React.useMemo(() => {
    const dayLookup: Record<string, DayEntry> = {};
    if (days) {
      for (const d of days) {
        dayLookup[d.date] = d;
      }
    }

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

    const groups: DayGroup[] = [];
    for (const [dayId, nodes] of groupMap.entries()) {
      const dayEntry = dayLookup[dayId];
      const phase = dayPhaseMap?.[dayId] ?? dayEntry?.phase;
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

  // ── Epic mode rendering ─────────────────────────────────────────
  if (mode === 'epics' && epicTree) {
    return (
      <>
        <EpicTreeView
          epicTree={epicTree}
          expandedEpics={expandedEpics ?? new Set<string>()}
          onEpicToggle={onEpicToggle ?? (() => {})}
          expandedNode={expandedNode}
          onNodeToggle={onNodeToggle}
          filter={activeFilter}
          setTooltip={setTooltip}
        />
        <TooltipLayer tooltip={tooltip} />
      </>
    );
  }

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
          background: C.border,
        }}
      >
        {segments.map((category) => {
          const count = counts[category];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const showText = showLabels && percentage > 12;
          return (
            <div
              key={category}
              role="img"
              aria-label={`${formatCategory(category)} (${count})`}
              style={{
                width: `${percentage}%`,
                minWidth: 0,
                background: getCategoryColor(category),
                opacity: 0.8,
                color: C.white,
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
              onMouseEnter={(e) => {
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  content: (
                    <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>
                      {formatCategory(category)} ({count})
                    </div>
                  ),
                });
              }}
              onMouseMove={(e) => {
                setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
              }}
              onMouseLeave={() => setTooltip(null)}
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
        aria-expanded={isExpanded}
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
          boxShadow: isHighlighted ? `0 0 0 1px color-mix(in srgb, ${C.cyan} 19%, transparent)` : 'none',
          borderRadius: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{group.dayId}</span>
            {group.title && (
              <span style={{ fontSize: 15, color: C.slate, fontWeight: 500 }}>{group.title}</span>
            )}
            <span style={{ fontSize: 15, color: C.slate }}>{isExpanded ? '▼' : '▶'}</span>
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
              {group.nodes.length}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <div style={{ display: 'flex', gap: 8, fontSize: 13, color: C.muted, fontWeight: 600 }}>
                <span>{group.nodes.length} entries</span>
                {dayDeadEnds > 0 && <span style={{ color: C.rose }}>{dayDeadEnds} dead ends</span>}
                {dayDiscoveries > 0 && <span style={{ color: C.amber }}>{dayDiscoveries} discoveries</span>}
                {dayPivots > 0 && <span style={{ color: C.violet }}>{dayPivots} pivots</span>}
              </div>
              {renderCategoryBar(dayCounts, group.nodes.length, false, 12, 120)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {group.chapterName && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>{group.chapterName}</span>
                  {group.chapterType && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        color: group.chapterType === 'phase' ? C.violet : C.slate,
                        background: group.chapterType === 'phase'
                          ? `color-mix(in srgb, ${C.violet} 10%, transparent)`
                          : `color-mix(in srgb, ${C.slate} 8%, transparent)`,
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
                    color: PHASE_COLORS[group.phase] ?? C.slate,
                    background: `color-mix(in srgb, ${PHASE_COLORS[group.phase] ?? C.slate} 10%, transparent)`,
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
    <>
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
          <span
            style={{
              color: C.white,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            {totalEntries} entries
          </span>
          <span style={{ color: C.border }}>|</span>
          {deadEnds > 0 && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.rose,
                background: `color-mix(in srgb, ${C.rose} 8%, transparent)`,
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
                color: C.amber,
                background: `color-mix(in srgb, ${C.amber} 8%, transparent)`,
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
                color: C.violet,
                background: `color-mix(in srgb, ${C.violet} 8%, transparent)`,
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
              <span style={{ fontSize: 14, color: C.muted }}>{`${formatCategory(category)} (${categoryCounts[category]})`}</span>
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
              background: C.cardBg,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            {renderDayHeader(group)}

            {isExpanded && (
              <div style={{ padding: '0 16px 16px' }}>
                {filteredNodes.length === 0 ? (
                  <div style={{ color: C.muted, fontSize: 12, padding: '8px 0 4px' }}>
                    No entries match filter
                  </div>
                ) : (
                  filteredNodes.map((node) => {
                    const isNodeExpanded = expandedNode === node.id;
                    const typeColor = getTypeColor(node.type);
                    const categoryColor = getCategoryColor(node.category);
                    const nodeChapter = project.chapters.find((ch) =>
                      ch.nodes.some((n) => n.id === node.id),
                    );

                    return (
                      <button
                        key={node.id}
                        type="button"
                        aria-expanded={expandedNode === node.id}
                        onClick={() => onNodeToggle(node.id)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: C.bg,
                          border: 'none',
                          borderLeft: `3px solid ${typeColor}`,
                          borderRadius: 8,
                          padding: '12px 16px',
                          marginBottom: 6,
                          cursor: 'pointer',
                          color: C.white,
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
                                color: C.muted,
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
                                    color: C.violet,
                                    background: `color-mix(in srgb, ${C.violet} 10%, transparent)`,
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
                        <div style={{ marginTop: 5, fontSize: 15, fontWeight: 700, color: C.white }}>
                          {node.title}
                        </div>

                        {isNodeExpanded && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.6 }}>{node.description}</div>

                            {'chosenPath' in node && node.chosenPath && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    textTransform: 'uppercase',
                                    color: C.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                  }}
                                >
                                  Chosen Path
                                </div>
                                <div style={{ fontSize: 14, color: C.emerald, marginTop: 2 }}>{node.chosenPath}</div>
                              </div>
                            )}

                            {'alternatives' in node && node.alternatives.length > 0 && (
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
                                  Alternatives Considered
                                </div>
                                {node.alternatives.map((alternative, index) => (
                                  <div
                                    key={`${node.id}-alt-${index}`}
                                    style={{
                                      fontSize: 13,
                                      color: C.rose,
                                      background: `color-mix(in srgb, ${C.rose} 3%, transparent)`,
                                      borderLeft: `2px dashed ${C.rose}`,
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
                                    color: C.muted,
                                    letterSpacing: 1.2,
                                    fontWeight: 700,
                                  }}
                                >
                                  Lesson
                                </div>
                                <div style={{ fontSize: 14, color: C.amber, marginTop: 2, fontStyle: 'italic' }}>
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
    <TooltipLayer tooltip={tooltip} />
    </>
  );
}
