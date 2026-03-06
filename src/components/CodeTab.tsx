import { useMemo, useState, type ReactNode } from 'react';
import { Card, C } from './MetricsCard';
import type { CodeVolumeEntry } from '../data/metaMetrics';

interface CodeTabProps {
  codeVolume: CodeVolumeEntry[];
  totalAdded: number;
  totalDeleted: number;
  currentLoc: number;
  sessionFocusMap: Record<string, string>;
  hoveredCodeSession: string | null;
  setHoveredCodeSession: (session: string | null) => void;
  setTooltip: (tooltip: { x: number; y: number; content: ReactNode } | null) => void;
}

export default function CodeTab({
  codeVolume, totalAdded, totalDeleted, currentLoc,
  sessionFocusMap, hoveredCodeSession, setHoveredCodeSession, setTooltip,
}: CodeTabProps) {
  const [expandedCodeRows, setExpandedCodeRows] = useState<Set<string>>(new Set());

  const codeEntriesWithActivity = useMemo(
    () => codeVolume.filter((entry) => entry.added > 0 || entry.deleted > 0),
    [codeVolume],
  );

  const dateGroups = useMemo(() => {
    const grouped = new Map<string, { date: string; entries: Array<(typeof codeEntriesWithActivity)[number]>; added: number; deleted: number }>();
    codeEntriesWithActivity.forEach((entry) => {
      const existing = grouped.get(entry.date);
      if (existing) {
        existing.entries.push(entry);
        existing.added += entry.added;
        existing.deleted += entry.deleted;
        return;
      }
      grouped.set(entry.date, { date: entry.date, entries: [entry], added: entry.added, deleted: entry.deleted });
    });
    return Array.from(grouped.values());
  }, [codeEntriesWithActivity]);

  const codeTopRows = useMemo(() => {
    if (dateGroups.length <= 8) {
      return [...dateGroups].reverse().map((group) => ({
        kind: 'date' as const,
        key: group.date,
        label: group.date,
        added: group.added,
        deleted: group.deleted,
        dates: [group],
      }));
    }

    const mergedDateCount = dateGroups.length - 7;
    const mergedDates = dateGroups.slice(0, mergedDateCount);
    const firstDate = mergedDates[0]?.date ?? '';
    const lastDate = mergedDates[mergedDates.length - 1]?.date ?? '';
    const [firstMonth, firstDay] = firstDate.split(' ');
    const [lastMonth, lastDay] = lastDate.split(' ');
    const rangeLabel = firstMonth === lastMonth ? `${firstMonth} ${firstDay}-${lastDay}` : `${firstDate}-${lastDate}`;

    const rangeRow = {
      kind: 'range' as const,
      key: rangeLabel,
      label: rangeLabel,
      added: mergedDates.reduce((sum, date) => sum + date.added, 0),
      deleted: mergedDates.reduce((sum, date) => sum + date.deleted, 0),
      dates: [...mergedDates].reverse(),
    };

    const remainingRows = [...dateGroups.slice(mergedDateCount)].reverse().map((group) => ({
      kind: 'date' as const,
      key: group.date,
      label: group.date,
      added: group.added,
      deleted: group.deleted,
      dates: [group],
    }));

    return [...remainingRows, rangeRow];
  }, [dateGroups]);

  const codeDeltaMax = useMemo(
    () => Math.max(
      ...codeEntriesWithActivity.map((item) => Math.max(item.added, item.deleted)),
      ...codeTopRows.map((row) => Math.max(row.added, row.deleted)),
      1,
    ),
    [codeEntriesWithActivity, codeTopRows],
  );


  const renderCodeRow = (row: (typeof codeTopRows)[number]) => {
    const isRowExpanded = expandedCodeRows.has(row.key);
    const hasMultipleDates = row.kind === 'range' && row.dates.length > 1;
    const isDateExpandable = row.kind === 'date' && row.dates[0].entries.length > 1;
    const isExpandable = hasMultipleDates || isDateExpandable;

    const toggleRow = () => {
      if (!isExpandable) return;
      setExpandedCodeRows((prev) => {
        const next = new Set(prev);
        if (next.has(row.key)) next.delete(row.key);
        else next.add(row.key);
        return next;
      });
    };

    return (
      <div key={row.key} className="rounded-md" style={{ border: `1px solid ${C.border}` }}>
        <button
          type="button"
          onClick={toggleRow}
          onMouseEnter={(event) => {
            setHoveredCodeSession(row.key);
            setTooltip({
              x: event.clientX, y: event.clientY,
              content: (
                <>
                  <div style={{ color: C.slate, fontSize: 12, fontWeight: 600 }}>{row.label}</div>
                  <div style={{ color: C.cyan, fontSize: 11 }}>Added: {row.added.toLocaleString()}</div>
                  <div style={{ color: C.rose, fontSize: 11 }}>Deleted: {row.deleted.toLocaleString()}</div>
                </>
              ),
            });
          }}
          onMouseMove={(event) => {
            setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
          }}
          onMouseLeave={() => { setHoveredCodeSession(null); setTooltip(null); }}
          style={{
            backgroundColor: hoveredCodeSession === row.key ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
            borderRadius: 6, padding: 8,
            cursor: isExpandable ? 'pointer' : 'default',
          }}
        >
          <div className="mb-1 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
            <span style={{ width: 12, display: 'inline-block', color: C.muted, transform: isExpandable && isRowExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>
              {isExpandable ? '\u25B6' : ''}
            </span>
            <span>{row.label}</span>
          </div>
          <div className="flex gap-2">
            <div className="h-3 rounded" style={{ width: `${(row.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
            <div className="h-3 rounded" style={{ width: `${(row.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
          </div>
        </button>

        <div style={{ maxHeight: isRowExpanded ? 500 : 0, overflow: 'hidden', transition: 'max-height 150ms ease' }}>
          {row.kind === 'range' && row.dates.map((dateGroup) => {
            const isDateExpanded = expandedCodeRows.has(dateGroup.date);
            const isNestedExpandable = dateGroup.entries.length > 1;
            return (
              <div key={dateGroup.date} style={{ paddingLeft: 20, paddingBottom: 4 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!isNestedExpandable) return;
                    setExpandedCodeRows((prev) => {
                      const next = new Set(prev);
                      if (next.has(dateGroup.date)) next.delete(dateGroup.date);
                      else next.add(dateGroup.date);
                      return next;
                    });
                  }}
                  className="w-full text-left pt-1"
                  style={{ cursor: isNestedExpandable ? 'pointer' : 'default' }}
                >
                  <div className="mb-1 flex items-center gap-1 text-xs" style={{ color: C.muted }}>
                    <span style={{ width: 12, display: 'inline-block', transform: isNestedExpandable && isDateExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}>
                      {isNestedExpandable ? '\u25B6' : ''}
                    </span>
                    <span>{dateGroup.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2.5 rounded" style={{ width: `${(dateGroup.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                    <div className="h-2.5 rounded" style={{ width: `${(dateGroup.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                  </div>
                </button>

                <div style={{ maxHeight: isDateExpanded ? 400 : 0, overflow: 'hidden', transition: 'max-height 150ms ease' }}>
                  {dateGroup.entries.map((entry) => (
                    <div
                      key={entry.session}
                      style={{ paddingLeft: 20, paddingTop: 4 }}
                      onMouseEnter={(event) => {
                        setHoveredCodeSession(entry.session);
                        const focusText = sessionFocusMap[entry.session] ?? 'No focus recorded';
                        setTooltip({
                          x: event.clientX, y: event.clientY,
                          content: (
                            <>
                              <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.date} — {entry.label}</div>
                              <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic' }}>{focusText}</div>
                              <div style={{ color: C.cyan, fontSize: 11 }}>Added: {entry.added.toLocaleString()}</div>
                              <div style={{ color: C.rose, fontSize: 11 }}>Deleted: {entry.deleted.toLocaleString()}</div>
                            </>
                          ),
                        });
                      }}
                      onMouseMove={(event) => {
                        setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                      }}
                      onMouseLeave={() => { setHoveredCodeSession(null); setTooltip(null); }}
                    >
                      <div className="mb-1 text-[11px]" style={{ color: C.white }}>{entry.label}</div>
                      <div className="flex gap-2">
                        <div className="h-2 rounded" style={{ width: `${(entry.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                        <div className="h-2 rounded" style={{ width: `${(entry.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {row.kind === 'date' && row.dates[0].entries.length > 1 && (
            <div style={{ paddingLeft: 20, paddingBottom: 6 }}>
              {row.dates[0].entries.map((entry) => (
                <div
                  key={entry.session}
                  style={{ paddingTop: 4 }}
                  onMouseEnter={(event) => {
                    setHoveredCodeSession(entry.session);
                    const focusText = sessionFocusMap[entry.session] ?? 'No focus recorded';
                    setTooltip({
                      x: event.clientX, y: event.clientY,
                      content: (
                        <>
                          <div style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{entry.date} — {entry.label}</div>
                          <div style={{ color: C.muted, fontSize: 11, fontStyle: 'italic' }}>{focusText}</div>
                          <div style={{ color: C.cyan, fontSize: 11 }}>Added: {entry.added.toLocaleString()}</div>
                          <div style={{ color: C.rose, fontSize: 11 }}>Deleted: {entry.deleted.toLocaleString()}</div>
                        </>
                      ),
                    });
                  }}
                  onMouseMove={(event) => {
                    setTooltip((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
                  }}
                  onMouseLeave={() => { setHoveredCodeSession(null); setTooltip(null); }}
                >
                  <div className="mb-1 text-[11px]" style={{ color: C.white }}>{entry.label}</div>
                  <div className="flex gap-2">
                    <div className="h-2 rounded" style={{ width: `${(entry.added / codeDeltaMax) * 100}%`, backgroundColor: C.cyan }} />
                    <div className="h-2 rounded" style={{ width: `${(entry.deleted / codeDeltaMax) * 100}%`, backgroundColor: C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Total Added" value={totalAdded.toLocaleString()} color={C.emerald} />
        <Card label="Total Deleted" value={totalDeleted.toLocaleString()} color={C.rose} />
        <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
      </div>
      <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
        <h3 className="mb-3 text-sm font-semibold">Lines Added vs Deleted</h3>
        <div className="space-y-2">
          {codeTopRows.map(renderCodeRow)}
        </div>
      </div>
    </div>
  );
}
