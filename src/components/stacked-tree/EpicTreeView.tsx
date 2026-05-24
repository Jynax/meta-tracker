import { C } from '../MetricsCard';
import type { FilterType } from '../../types';
import { displayTaskId, type EpicTreeNode } from '../../utils/trackerDataAdapter';
import type { TooltipState } from './types';
import { EPIC_STATUS_COLOR, TASK_STATUS_COLOR, TASK_TOOL_COLOR } from './constants';
import { formatDate } from './helpers';

interface EpicTreeViewProps {
  epicTree: EpicTreeNode[];
  expandedEpics: Set<string>;
  onEpicToggle: (epicId: string) => void;
  expandedNode: string | null;
  onNodeToggle: (nodeId: string) => void;
  filter: FilterType;
  setTooltip: (tooltip: TooltipState | ((prev: TooltipState) => TooltipState)) => void;
}

export function EpicTreeView({
  epicTree,
  expandedEpics,
  onEpicToggle,
  expandedNode,
  onNodeToggle,
  filter,
  setTooltip,
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
              aria-expanded={isExpanded}
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
                  {isExpanded ? '▼' : '▶'}
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
                        aria-expanded={isTaskExpanded}
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
                            #{displayTaskId(task.id)}
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
                              role="img"
                              aria-label={`${task.decisions.length} decision${task.decisions.length === 1 ? '' : 's'}`}
                              onMouseEnter={(e) => {
                                setTooltip({
                                  x: e.clientX,
                                  y: e.clientY,
                                  content: (
                                    <>
                                      <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>
                                        {task.decisions.length} decision{task.decisions.length === 1 ? '' : 's'}
                                      </div>
                                      {task.decisions.map((d) => (
                                        <div key={d.id} style={{ color: C.amber, fontSize: 11 }}>
                                          • {d.title}
                                        </div>
                                      ))}
                                    </>
                                  ),
                                });
                              }}
                              onMouseMove={(e) => {
                                setTooltip((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : prev));
                              }}
                              onMouseLeave={() => setTooltip(null)}
                              style={{ color: C.amber, fontSize: 12, cursor: 'help' }}
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
