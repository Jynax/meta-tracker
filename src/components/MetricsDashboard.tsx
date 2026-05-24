import { useMemo, useState, type ReactNode } from 'react';
import { getBundle } from '../data/projectRegistry';

import { C } from "./MetricsCard";
import OverviewTab from './OverviewTab';
import CodeTab from './CodeTab';
import BugsTab from './BugsTab';
import SessionsTab from './SessionsTab';
import TasksTab from './TasksTab';
import InsightsView from './InsightsView';
import { extractPRNumbersInText } from '../utils/prRefs';

type MetricsTab = 'overview' | 'code' | 'bugs' | 'sessions';

interface MetricsDashboardProps {
  projectId: string;
  onJumpToChapter?: (chapterId: string) => void;
  initialTab?: MetricsTab;
  onTabChange?: (tab: MetricsTab) => void;
  onProjectChange?: (projectId: string) => void;
}

export default function MetricsDashboard({ projectId, onJumpToChapter, initialTab = 'overview', onTabChange, onProjectChange }: MetricsDashboardProps) {
  const tab = initialTab;
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredCodeEntry, setHoveredCodeEntry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);

  // For MT, the last tab is labeled "Tasks" and renders TasksTab from the new
  // Epic/Task data model. All other projects keep the legacy "Sessions" tab
  // and SessionsTab. Internal tab id stays 'sessions' to avoid state migration
  // when switching between MT and non-MT projects.
  const isMeta = projectId === 'meta';
  const TABS: Array<{ id: MetricsTab; label: string }> = useMemo(() => [
    { id: 'overview', label: 'Overview' },
    { id: 'code', label: 'Code' },
    { id: 'bugs', label: 'Bugs' },
    { id: 'sessions', label: isMeta ? 'Tasks' : 'Sessions' },
  ], [isMeta]);

  const selected = useMemo(() => getBundle(projectId), [projectId]);

  const chapterMap = useMemo(
    () => Object.fromEntries(selected.project.chapters.map((chapter) => [chapter.id, chapter.name])),
    [selected.project.chapters],
  );

  const sessionFocusMap = useMemo(() => {
    const map: Record<string, string> = {};
    selected.sessions.forEach((session) => { map[session.session] = session.focus; });
    return map;
  }, [selected.sessions]);

  const sessionDateMap = useMemo(() => {
    const map: Record<string, string> = {};
    selected.codeVolume.forEach((entry) => { map[entry.session] = entry.date; });
    return map;
  }, [selected.codeVolume]);

  const totalHours = useMemo(
    () => Math.round(selected.days.reduce((sum, d) => sum + d.metrics.totalTimeMinutes, 0) / 60),
    [selected.days],
  );
  // Day-derived codeVolume for the Code tab. Synthesizes one CodeVolumeEntry
  // per WorkBlock with running net total. Replaces the stale legacy
  // `*CodeVolume` arrays which stopped being maintained for 6 of 9 projects
  // around Mar 23.
  const daysCodeVolume = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const sortedDays = [...selected.days].sort((a, b) => {
      const [aM = 'Jan', aD = '1'] = a.date.split(' ');
      const [bM = 'Jan', bD = '1'] = b.date.split(' ');
      return new Date(2026, monthMap[aM] ?? 0, parseInt(aD, 10)).getTime() -
             new Date(2026, monthMap[bM] ?? 0, parseInt(bD, 10)).getTime();
    });
    let running = 0;
    const entries: typeof selected.codeVolume = [];
    for (const day of sortedDays) {
      for (const block of day.blocks) {
        const added = block.linesAdded ?? 0;
        const deleted = block.linesDeleted ?? 0;
        const net = added - deleted;
        running += net;
        entries.push({
          session: block.id,
          date: day.date,
          label: block.label,
          added,
          deleted,
          net,
          total: running,
        });
      }
    }
    return entries;
  }, [selected]);

  const codeTotalAdded = useMemo(
    () => daysCodeVolume.reduce((sum, e) => sum + e.added, 0),
    [daysCodeVolume],
  );
  const codeTotalDeleted = useMemo(
    () => daysCodeVolume.reduce((sum, e) => sum + e.deleted, 0),
    [daysCodeVolume],
  );
  const codeCurrentLoc = codeTotalAdded - codeTotalDeleted;

  // Day-derived values for the Overview stat cards (Task #95 follow-up).
  // Legacy `sessions` and `codeVolume` arrays have been stale for 6 of 9 projects
  // since ~Mar 23, so the Overview cards now derive from `days` blocks instead.
  // Scope is deliberately limited to Overview — Code/Sessions/Bugs tabs continue
  // reading legacy arrays and are queued for a follow-up sweep.
  const { overviewLoc, overviewPrs } = useMemo(() => {
    let loc = 0;
    const prSet = new Set<number>();
    for (const day of selected.days) {
      for (const block of day.blocks) {
        loc += block.linesAdded ?? 0;
        for (const pr of extractPRNumbersInText(block.note)) prSet.add(pr);
      }
    }
    for (const bug of selected.bugs) {
      for (const pr of extractPRNumbersInText(bug.status)) prSet.add(pr);
    }
    return { overviewLoc: loc, overviewPrs: prSet.size };
  }, [selected.days, selected.bugs]);
  const firstDate = selected.codeVolume[0]?.date ?? selected.dateRange.start;
  const lastDate = selected.codeVolume[selected.codeVolume.length - 1]?.date ?? selected.dateRange.end;
  const timelineRange = `${firstDate} \u2013 ${lastDate}/26`;

  return (
    <>
      <div className="rounded-2xl border p-4" style={{ backgroundColor: C.bg, borderColor: C.border }}>
        {projectId === 'all' ? (
          <InsightsView setTooltip={setTooltip} />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange?.(item.id);
                  }}
                  className="rounded-full border px-4 py-1.5 text-sm font-medium"
                  style={{
                    backgroundColor: tab === item.id ? 'color-mix(in srgb, var(--theme-cyan) 13%, transparent)' : C.cardBg,
                    borderColor: tab === item.id ? C.cyan : C.border,
                    color: tab === item.id ? C.cyan : C.slate,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <OverviewTab
                days={selected.days}
                codeVolume={selected.codeVolume}
                derived={selected.derived}
                stack={selected.stack}
                totalPRs={overviewPrs}
                currentLoc={overviewLoc}
                timelineRange={timelineRange}
                projectId={projectId}
                hoveredPointIndex={hoveredPointIndex}
                setHoveredPointIndex={setHoveredPointIndex}
                setTooltip={setTooltip}
                activeProjectId={projectId}
                onProjectChange={onProjectChange}
              />
            )}

            {tab === 'code' && (
              <CodeTab
                codeVolume={daysCodeVolume}
                days={selected.days}
                totalAdded={codeTotalAdded}
                totalDeleted={codeTotalDeleted}
                currentLoc={codeCurrentLoc}
                hoveredCodeEntry={hoveredCodeEntry}
                setHoveredCodeEntry={setHoveredCodeEntry}
                setTooltip={setTooltip}
              />
            )}

            {tab === 'bugs' && (
              <BugsTab
                bugs={selected.bugs}
                projectId={projectId}
              />
            )}

            {tab === 'sessions' && isMeta && (
              <TasksTab projectId={projectId} setTooltip={setTooltip} />
            )}

            {tab === 'sessions' && !isMeta && (
              <SessionsTab
                key={projectId}
                sessions={selected.sessions}
                days={selected.days}
                totalHours={totalHours}
                projectId={projectId}
                sessionFocusMap={sessionFocusMap}
                sessionDateMap={sessionDateMap}
                chapterMap={chapterMap}
                onJumpToChapter={onJumpToChapter}
                hoveredPointIndex={hoveredPointIndex}
                setHoveredPointIndex={setHoveredPointIndex}
                setTooltip={setTooltip}
              />
            )}
          </>
        )}
      </div>
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            background: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </>
  );
}
