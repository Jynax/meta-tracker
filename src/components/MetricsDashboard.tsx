import { useMemo, useState, useEffect, type ReactNode } from 'react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDerived, bipStack, bipDateRange, bipDays } from '../data/bipMetrics';
import { metaCodeVolume, metaSessions, metaBugs, metaDerived, metaStack, metaDateRange, metaDays } from '../data/metaMetrics';
import { remnantsCodeVolume, remnantsSessions, remnantsBugs, remnantsDerived, remnantsStack, remnantsDateRange, remnantsDays } from '../data/remnantsMetrics';
import { remnantsProject } from '../data/remnantsProject';
import { itemBGoneProject } from '../data/itemBGoneProject';
import { ibgCodeVolume, ibgSessions, ibgBugs, ibgDerived, ibgStack, ibgDateRange, ibgDays } from '../data/itemBGoneMetrics';
import { vulnBankProject } from '../data/vulnBankProject';
import { vbCodeVolume, vbSessions, vbBugs, vbDerived, vbStack, vbDateRange, vbDays } from '../data/vulnBankMetrics';
import { landingProject } from '../data/landingProject';
import { landingCodeVolume, landingSessions, landingBugs, landingDerived, landingStack, landingDateRange, landingDays } from '../data/landingMetrics';
import { feedbackCaptureProject } from '../data/feedbackCaptureProject';
import { fcCodeVolume, fcSessions, fcBugs, fcDerived, fcStack, fcDateRange, fcDays } from '../data/feedbackCaptureMetrics';
import { noteWorthyProject } from '../data/noteWorthyProject';
import { nwCodeVolume, nwSessions, nwBugs, nwDerived, nwStack, nwDateRange, nwDays } from '../data/noteWorthyMetrics';

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
  onProjectChange?: (projectId: string) => void;
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
  const [hoveredCodeEntry, setHoveredCodeEntry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: ReactNode } | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const selected = useMemo(() => {
    const projectData: Record<string, { project: typeof bipProject; codeVolume: typeof bipCodeVolume; sessions: typeof bipSessions; bugs: typeof bipBugs; derived: typeof bipDerived; stack: typeof bipStack; dateRange: typeof bipDateRange; days: typeof bipDays }> = {
      bip: { project: bipProject, codeVolume: bipCodeVolume, sessions: bipSessions, bugs: bipBugs, derived: bipDerived, stack: bipStack, dateRange: bipDateRange, days: bipDays },
      meta: { project: metaProject, codeVolume: metaCodeVolume, sessions: metaSessions, bugs: metaBugs, derived: metaDerived, stack: metaStack, dateRange: metaDateRange, days: metaDays },
      remnants: { project: remnantsProject, codeVolume: remnantsCodeVolume, sessions: remnantsSessions, bugs: remnantsBugs, derived: remnantsDerived, stack: remnantsStack, dateRange: remnantsDateRange, days: remnantsDays },
      'item-b-gone': { project: itemBGoneProject, codeVolume: ibgCodeVolume, sessions: ibgSessions, bugs: ibgBugs, derived: ibgDerived, stack: ibgStack, dateRange: ibgDateRange, days: ibgDays },
      'vuln-bank': { project: vulnBankProject, codeVolume: vbCodeVolume, sessions: vbSessions, bugs: vbBugs, derived: vbDerived, stack: vbStack, dateRange: vbDateRange, days: vbDays },
      landing: { project: landingProject, codeVolume: landingCodeVolume, sessions: landingSessions, bugs: landingBugs, derived: landingDerived, stack: landingStack, dateRange: landingDateRange, days: landingDays },
      'feedback-capture': { project: feedbackCaptureProject, codeVolume: fcCodeVolume, sessions: fcSessions, bugs: fcBugs, derived: fcDerived, stack: fcStack, dateRange: fcDateRange, days: fcDays },
      'note-worthy': { project: noteWorthyProject, codeVolume: nwCodeVolume, sessions: nwSessions, bugs: nwBugs, derived: nwDerived, stack: nwStack, dateRange: nwDateRange, days: nwDays },
    };
    return projectData[projectId] ?? projectData.bip;
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
            days={selected.days}
            codeVolume={selected.codeVolume}
            derived={selected.derived}
            stack={selected.stack}
            totalPRs={totalPRs}
            currentLoc={currentLoc}
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
            codeVolume={selected.codeVolume}
            days={selected.days}
            totalAdded={totalAdded}
            totalDeleted={totalDeleted}
            currentLoc={currentLoc}
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

        {tab === 'sessions' && (
          <SessionsTab
            sessions={selected.sessions}
            days={selected.days}
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
