import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDerived, bipStack, bipDateRange } from '../data/bipMetrics';
import { metaCodeVolume, metaSessions, metaBugs, metaDerived, metaStack, metaDateRange } from '../data/metaMetrics';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDerived, remnantsStack, remnantsDateRange } from '../data/remnantsMetrics';
import { remnantsProject } from '../data/remnantsProject';
import { itemBGoneProject } from '../data/itemBGoneProject';
import { ibgCodeVolume, ibgSessions, ibgBugs, ibgDerived, ibgStack, ibgDateRange } from '../data/itemBGoneMetrics';
import { vulnBankProject } from '../data/vulnBankProject';
import { vbCodeVolume, vbSessions, vbBugs, vbDerived, vbStack, vbDateRange } from '../data/vulnBankMetrics';

import { C } from "./MetricsCard";
import OverviewTab from './OverviewTab';
import CodeTab from './CodeTab';
import BugsTab from './BugsTab';
import SessionsTab from './SessionsTab';

type MetricsTab = 'overview' | 'code' | 'bugs' | 'sessions';

interface MetricsDashboardProps {
  projectId: string;
  onJumpToChapter?: (chapterId: string) => void;
  initialTab?: MetricsTab;
  onTabChange?: (tab: MetricsTab) => void;
}

const TABS: Array<{ id: MetricsTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'code', label: 'Code' },
  { id: 'bugs', label: 'Bugs' },
  { id: 'sessions', label: 'Sessions' },
];

export default function MetricsDashboard({ projectId, onJumpToChapter, initialTab = 'overview', onTabChange, onProjectChange }: MetricsDashboardProps) {
  const [tab, setTab] = useState<MetricsTab>(initialTab);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredCodeSession, setHoveredCodeSession] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const selected = useMemo(() => {
    const project = projectId === 'meta' ? metaProject : projectId === 'remnants' ? remnantsProject : projectId === 'item-b-gone' ? itemBGoneProject : projectId === 'vuln-bank' ? vulnBankProject : bipProject;
    const codeVolume = projectId === 'meta' ? metaCodeVolume : projectId === 'remnants' ? remnantsCodeVolume : projectId === 'item-b-gone' ? ibgCodeVolume : projectId === 'vuln-bank' ? vbCodeVolume : bipCodeVolume;
    const sessions = projectId === 'meta' ? metaSessions : projectId === 'remnants' ? remnantsSessions : projectId === 'item-b-gone' ? ibgSessions : projectId === 'vuln-bank' ? vbSessions : bipSessions;
    const bugs = projectId === 'meta' ? metaBugs : projectId === 'remnants' ? remnantsBugs : projectId === 'item-b-gone' ? ibgBugs : projectId === 'vuln-bank' ? vbBugs : bipBugs;
    const derived = projectId === 'meta' ? metaDerived : projectId === 'remnants' ? remnantsDerived : projectId === 'item-b-gone' ? ibgDerived : projectId === 'vuln-bank' ? vbDerived : bipDerived;
    const stack = projectId === 'meta' ? metaStack : projectId === 'remnants' ? remnantsStack : projectId === 'item-b-gone' ? ibgStack : projectId === 'vuln-bank' ? vbStack : bipStack;
    const dateRange = projectId === 'meta' ? metaDateRange : projectId === 'remnants' ? remnantsDateRange : projectId === 'item-b-gone' ? ibgDateRange : projectId === 'vuln-bank' ? vbDateRange : bipDateRange;
    return { project, codeVolume, sessions, bugs, derived, stack, dateRange };
  }, [projectId]);

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

  const totalPRs = selected.sessions.reduce((sum, item) => sum + item.prs, 0);
  const totalHours = selected.sessions.reduce((sum, item) => sum + item.duration, 0);
  const currentLoc = selected.codeVolume[selected.codeVolume.length - 1]?.total ?? 0;
  const totalAdded = selected.codeVolume.reduce((sum, item) => sum + item.added, 0);
  const totalDeleted = selected.codeVolume.reduce((sum, item) => sum + item.deleted, 0);
  const firstDate = selected.codeVolume[0]?.date ?? selected.dateRange.start;
  const lastDate = selected.codeVolume[selected.codeVolume.length - 1]?.date ?? selected.dateRange.end;
  const timelineRange = `${firstDate} \u2013 ${lastDate}/26`;

  return (
    <>
      <div className="rounded-2xl border p-4" style={{ backgroundColor: C.bg, borderColor: C.border }}>
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setTab(item.id);
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
            sessions={selected.sessions}
            codeVolume={selected.codeVolume}
            derived={selected.derived}
            stack={selected.stack}
            totalPRs={totalPRs}
            totalHours={totalHours}
            currentLoc={currentLoc}
            timelineRange={timelineRange}
            projectId={projectId}
            sessionFocusMap={sessionFocusMap}
            hoveredPointIndex={hoveredPointIndex}
            setHoveredPointIndex={setHoveredPointIndex}
            setTooltip={setTooltip}
          />
        )}

        {tab === 'code' && (
          <CodeTab
            codeVolume={selected.codeVolume}
            totalAdded={totalAdded}
            totalDeleted={totalDeleted}
            currentLoc={currentLoc}
            sessionFocusMap={sessionFocusMap}
            hoveredCodeSession={hoveredCodeSession}
            setHoveredCodeSession={setHoveredCodeSession}
            setTooltip={setTooltip}
          />
        )}

        {tab === 'bugs' && (
          <BugsTab
            bugs={selected.bugs}
            projectId={projectId}
          />
        )}

        {tab === 'sessions' && (
          <SessionsTab
            sessions={selected.sessions}
            totalPRs={totalPRs}
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
