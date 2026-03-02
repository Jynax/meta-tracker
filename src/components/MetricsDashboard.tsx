import { useMemo, useState, useEffect } from 'react';
import { bipProject } from '../data/bipProject';
import { metaProject } from '../data/metaProject';
import { bipCodeVolume, bipSessions, bipBugs, bipDerived, bipStack, bipDateRange } from '../data/bipMetrics';
import { metaCodeVolume, metaSessions, metaBugs, metaDerived, metaStack, metaDateRange } from '../data/metaMetrics';

type MetricsTab = 'overview' | 'code' | 'bugs' | 'sessions';

interface MetricsDashboardProps {
  projectId: string;
  onJumpToChapter?: (chapterId: string) => void;
  initialTab?: MetricsTab;
}

const C = {
  cyan: '#22d3ee', emerald: '#34d399', rose: '#fb7185', amber: '#fbbf24',
  violet: '#a78bfa', slate: '#94a3b8', white: '#f8fafc', muted: '#64748b',
  bg: '#0f172a', cardBg: '#1e293b', border: '#334155',
};

const TABS: Array<{ id: MetricsTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'code', label: 'Code' },
  { id: 'bugs', label: 'Bugs' },
  { id: 'sessions', label: 'Sessions' },
];

export default function MetricsDashboard({ projectId, onJumpToChapter, initialTab = 'overview' }: MetricsDashboardProps) {
  const [tab, setTab] = useState<MetricsTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const selected = useMemo(() => {
    const project = projectId === 'meta' ? metaProject : bipProject;
    const codeVolume = projectId === 'meta' ? metaCodeVolume : bipCodeVolume;
    const sessions = projectId === 'meta' ? metaSessions : bipSessions;
    const bugs = projectId === 'meta' ? metaBugs : bipBugs;
    const derived = projectId === 'meta' ? metaDerived : bipDerived;
    const stack = projectId === 'meta' ? metaStack : bipStack;
    const dateRange = projectId === 'meta' ? metaDateRange : bipDateRange;
    return { project, codeVolume, sessions, bugs, derived, stack, dateRange };
  }, [projectId]);

  const chapterMap = useMemo(
    () => Object.fromEntries(selected.project.chapters.map((chapter) => [chapter.id, chapter.name])),
    [selected.project.chapters],
  );

  const totalPRs = selected.sessions.reduce((sum, item) => sum + item.prs, 0);
  const totalHours = selected.sessions.reduce((sum, item) => sum + item.duration, 0);
  const currentLoc = selected.codeVolume[selected.codeVolume.length - 1]?.total ?? 0;
  const totalAdded = selected.codeVolume.reduce((sum, item) => sum + item.added, 0);
  const totalDeleted = selected.codeVolume.reduce((sum, item) => sum + item.deleted, 0);
  const maxTotal = Math.max(...selected.codeVolume.map((item) => item.total), 1);
  const maxDelta = Math.max(...selected.codeVolume.map((item) => Math.max(item.added, item.deleted)), 1);
  const maxNetAbs = Math.max(...selected.codeVolume.map((item) => Math.abs(item.net)), 1);

  const bySeverity = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.severity] = (acc[bug.severity] ?? 0) + 1;
    return acc;
  }, {});
  const byCategory = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.category] = (acc[bug.category] ?? 0) + 1;
    return acc;
  }, {});
  const bySource = selected.bugs.reduce<Record<string, number>>((acc, bug) => {
    acc[bug.source] = (acc[bug.source] ?? 0) + 1;
    return acc;
  }, {});
  const maxGroup = Math.max(...Object.values(bySource), ...Object.values(byCategory), ...Object.values(bySeverity), 1);

  const fixedBugs = selected.bugs.filter((bug) => bug.status.toLowerCase() === 'fixed').length;
  const openBugs = selected.bugs.length - fixedBugs;

  const Card = ({ label, value, color = C.white, detail }: { label: string; value: string | number; color?: string; detail?: string }) => (
    <div className="rounded-lg border" style={{ backgroundColor: C.cardBg, borderColor: C.border, padding: '8px 14px' }}>
      <div className="text-xl font-bold" style={{ color }}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide" style={{ color: C.muted }}>{label}</div>
      {detail && <div className="text-xs" style={{ color: C.muted }}>{detail}</div>}
    </div>
  );

  const Breakdown = ({ title, data, colors }: { title: string; data: Record<string, number>; colors: Record<string, string> }) => (
    <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-xs" style={{ color: C.slate }}>
              <span>{key}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded" style={{ backgroundColor: '#0b1220' }}>
              <div className="h-2 rounded" style={{ width: `${(value / maxGroup) * 100}%`, backgroundColor: colors[key] ?? C.violet }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: C.bg, borderColor: C.border }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className="rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{
              backgroundColor: tab === item.id ? `${C.cyan}22` : C.cardBg,
              borderColor: tab === item.id ? C.cyan : C.border,
              color: tab === item.id ? C.cyan : C.slate,
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card label="Sessions" value={selected.sessions.length} color={C.cyan} />
            <Card label="PRs Merged" value={totalPRs} color={C.emerald} />
            <Card label="Hours" value={`${totalHours}h`} color={C.amber} />
            <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
            <Card label="Timeline" value={`${selected.dateRange.start} – ${selected.dateRange.end}`} color={C.violet} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {selected.derived.map((metric) => (
              <Card key={metric.label} label={metric.label} value={metric.value} color={metric.color} detail={metric.detail} />
            ))}
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-2 text-sm font-semibold">Codebase Size Over Time</h3>
            <div className="space-y-2">
              {selected.codeVolume.map((entry) => (
                <div key={entry.session}>
                  <div className="mb-1 flex justify-between text-xs" style={{ color: C.slate }}>
                    <span>{entry.label}</span>
                    <span>{entry.total.toLocaleString()} LOC</span>
                  </div>
                  <div className="h-3 rounded" style={{ backgroundColor: '#0b1220' }}>
                    <div className="h-3 rounded" style={{ width: `${(entry.total / maxTotal) * 100}%`, backgroundColor: C.cyan }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Stack Profile</h3>
            <div className="flex flex-wrap gap-2">
              {selected.stack.map((item) => {
                const dot = item.cat === 'Core' ? C.cyan : item.cat === 'UI' ? C.emerald : item.cat === 'Build' ? C.amber : C.violet;
                return (
                  <div key={`${item.name}-${item.cat}`} className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style={{ borderColor: C.border, backgroundColor: '#111b30' }}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: dot }} />
                    <span>{item.name}</span>
                    <span style={{ color: C.muted }}>({item.cat})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Total Added" value={totalAdded.toLocaleString()} color={C.emerald} />
            <Card label="Total Deleted" value={totalDeleted.toLocaleString()} color={C.rose} />
            <Card label="Net Change" value={(totalAdded - totalDeleted).toLocaleString()} color={C.cyan} />
            <Card label="Current LOC" value={currentLoc.toLocaleString()} color={C.white} />
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Lines Added vs Deleted</h3>
            <div className="space-y-3">
              {selected.codeVolume.filter((entry) => entry.added > 0 || entry.deleted > 0).map((entry) => (
                <div key={entry.session}>
                  <div className="mb-1 text-xs" style={{ color: C.slate }}>{entry.session}</div>
                  <div className="flex gap-2">
                    <div className="h-3 rounded" style={{ width: `${(entry.added / maxDelta) * 100}%`, backgroundColor: C.emerald }} />
                    <div className="h-3 rounded" style={{ width: `${(entry.deleted / maxDelta) * 100}%`, backgroundColor: C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Net Change by Session</h3>
            <div className="space-y-3">
              {selected.codeVolume.map((entry) => (
                <div key={`${entry.session}-net`}>
                  <div className="mb-1 flex justify-between text-xs" style={{ color: C.slate }}>
                    <span>{entry.session}</span>
                    <span>{entry.net > 0 ? '+' : ''}{entry.net}</span>
                  </div>
                  <div className="h-3 rounded" style={{ backgroundColor: '#0b1220' }}>
                    <div className="h-3 rounded" style={{ width: `${(Math.abs(entry.net) / maxNetAbs) * 100}%`, backgroundColor: entry.net >= 0 ? C.emerald : C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'bugs' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card label="Total" value={selected.bugs.length} color={C.rose} />
            <Card label="Fixed" value={fixedBugs} color={C.emerald} />
            <Card label="Open / Deferred" value={openBugs} color={C.amber} />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Breakdown title="By Severity" data={bySeverity} colors={{ Critical: C.rose, High: C.amber, Medium: C.cyan, Low: C.muted }} />
            <Breakdown title="By Category" data={byCategory} colors={{ Technical: C.cyan, Functional: C.emerald, UX: C.amber }} />
            <Breakdown title="By Source" data={bySource} colors={{}} />
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: '#162136' }}>
                  {['#', 'Summary', 'Severity', 'Category', 'Source', 'Status'].map((header) => (
                    <th key={header} className="px-3 py-2 text-left font-semibold" style={{ color: C.slate }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.bugs.map((bug) => (
                  <tr key={bug.id} className="border-t" style={{ borderColor: C.border }}>
                    <td className="px-3 py-2">{bug.id}</td>
                    <td className="px-3 py-2">{bug.summary}</td>
                    <td className="px-3 py-2" style={{ color: bug.severity === 'Critical' ? C.rose : bug.severity === 'High' ? C.amber : bug.severity === 'Medium' ? C.cyan : C.muted }}>{bug.severity}</td>
                    <td className="px-3 py-2">{bug.category}</td>
                    <td className="px-3 py-2">{bug.source}</td>
                    <td className="px-3 py-2" style={{ color: bug.status.toLowerCase() === 'fixed' ? C.emerald : C.amber }}>{bug.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'sessions' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Total PRs" value={totalPRs} color={C.emerald} />
            <Card label="Total Decisions" value={selected.sessions.reduce((sum, item) => sum + item.decisions, 0)} color={C.cyan} />
            <Card label="Total Dead Ends" value={selected.sessions.reduce((sum, item) => sum + item.deadEnds, 0)} color={C.rose} />
            <Card label="Total Hours" value={`${totalHours}h`} color={C.amber} />
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
            <h3 className="mb-3 text-sm font-semibold">Session Activity</h3>
            <div className="space-y-3">
              {selected.sessions.map((entry) => (
                <div key={`${entry.session}-activity`}>
                  <div className="mb-1 text-xs" style={{ color: C.slate }}>{entry.session}</div>
                  <div className="flex gap-2">
                    <div className="h-3 rounded" style={{ width: `${entry.prs * 14}px`, backgroundColor: C.emerald }} />
                    <div className="h-3 rounded" style={{ width: `${entry.decisions * 14}px`, backgroundColor: C.cyan }} />
                    <div className="h-3 rounded" style={{ width: `${entry.deadEnds * 14}px`, backgroundColor: C.rose }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {selected.sessions.map((entry) => (
              <div key={`${entry.session}-detail`} className="rounded-xl border p-4" style={{ backgroundColor: C.cardBg, borderColor: C.border }}>
                <h4 className="text-base font-semibold">{entry.session}</h4>
                <p className="mb-3 text-sm" style={{ color: C.cyan }}>{entry.focus}</p>
                <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: C.slate }}>
                  <span>Duration</span><span>{entry.duration}h</span>
                  <span>PRs</span><span>{entry.prs}</span>
                  <span>Decisions</span><span>{entry.decisions}</span>
                  <span>Dead Ends</span><span>{entry.deadEnds}</span>
                </div>
                <button
                  onClick={() => onJumpToChapter?.(entry.chapterId)}
                  className="mt-3 rounded-md border px-2.5 py-1 text-xs"
                  style={{ color: C.cyan, backgroundColor: '#22d3ee1a', borderColor: '#22d3ee55' }}
                >
                  🌳 View chapter: {chapterMap[entry.chapterId] ?? entry.chapterId}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
