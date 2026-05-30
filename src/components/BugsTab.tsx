import { useMemo, useState, useEffect } from 'react';
import { DonutBreakdown, C } from './MetricsCard';
import type { BugEntry } from '../data/metaMetrics';

interface BugsTabProps {
  bugs: BugEntry[];
  projectId: string;
}

export default function BugsTab({ bugs, projectId }: BugsTabProps) {
  const [animateBugDonuts, setAnimateBugDonuts] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [prevProjectId, setPrevProjectId] = useState(projectId);

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimateBugDonuts(true), 50);
    return () => window.clearTimeout(timer);
  }, []); // mount-only animation trigger

  const { bySeverity, byCategory, bySource, fixedBugs, openBugs } = useMemo(() => {
    const bySev = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.severity] = (acc[bug.severity] ?? 0) + 1; return acc; }, {});
    const byCat = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.category] = (acc[bug.category] ?? 0) + 1; return acc; }, {});
    const bySrc = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.source] = (acc[bug.source] ?? 0) + 1; return acc; }, {});
    const fixed = bugs.filter((bug) => bug.status.toLowerCase().startsWith('fixed')).length;
    return { bySeverity: bySev, byCategory: byCat, bySource: bySrc, fixedBugs: fixed, openBugs: bugs.length - fixed };
  }, [bugs]);

  const bugsByDay = useMemo(() => {
    const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const groups = new Map<string, { isoKey: string; dayLabel: string; bugs: BugEntry[] }>();
    bugs.forEach((bug) => {
      const [month = 'Jan', day = '1'] = bug.date.split(' ');
      const d = new Date(2026, monthMap[month] ?? 0, parseInt(day, 10));
      const isoKey = d.toISOString().slice(0, 10);
      const existing = groups.get(isoKey) ?? { isoKey, dayLabel: bug.date, bugs: [] };
      existing.bugs.push(bug);
      groups.set(isoKey, existing);
    });
    return Array.from(groups.values()).sort((a, b) => b.isoKey.localeCompare(a.isoKey));
  }, [bugs]);

  if (prevProjectId !== projectId) {
    setPrevProjectId(projectId);
    setExpandedDays(bugsByDay.length > 0 ? new Set([bugsByDay[0].isoKey]) : new Set());
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border"
        style={{ backgroundColor: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 600 }}
      >
        <span style={{ color: C.white }}>{bugs.length} total</span>
        <span style={{ color: C.border, margin: '0 10px' }}>|</span>
        <span style={{ color: C.emerald }}>{fixedBugs} fixed</span>
        <span style={{ color: C.border, margin: '0 10px' }}>|</span>
        <span style={{ color: C.amber }}>{openBugs} open/deferred</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DonutBreakdown animate={animateBugDonuts} label="Severity"
          items={[
            { label: 'Critical', count: bySeverity.Critical ?? 0, color: '#F2768E' },
            { label: 'High', count: bySeverity.High ?? 0, color: '#E8975B' },
            { label: 'Medium', count: bySeverity.Medium ?? 0, color: C.amber },
            { label: 'Low', count: bySeverity.Low ?? 0, color: C.muted },
          ]}
        />
        <DonutBreakdown animate={animateBugDonuts} label="Category"
          items={[
            { label: 'Technical', count: byCategory.Technical ?? 0, color: C.cyan },
            { label: 'Functional', count: byCategory.Functional ?? 0, color: C.emerald },
            { label: 'UX', count: byCategory.UX ?? 0, color: C.amber },
          ]}
        />
        <DonutBreakdown animate={animateBugDonuts} label="Source"
          items={[
            { label: 'ChatGPT Code Review', count: bySource['ChatGPT Code Review'] ?? 0, color: C.cyan },
            { label: 'Cowork Audit', count: bySource['Cowork Audit'] ?? 0, color: C.emerald },
            { label: 'Code Review', count: bySource['Code Review'] ?? 0, color: C.violet },
            { label: 'Cowork Code Review', count: bySource['Cowork Code Review'] ?? 0, color: C.amber },
            { label: 'User Report', count: bySource['User Report'] ?? 0, color: C.rose },
            { label: 'Codex Auto-Review', count: bySource['Codex Auto-Review'] ?? 0, color: C.muted },
          ]}
        />
      </div>
      <div className="space-y-2">
        {bugsByDay.map((group) => {
          const isExpanded = expandedDays.has(group.isoKey);
          const fixedInGroup = group.bugs.filter(b => b.status.toLowerCase().startsWith('fixed')).length;
          return (
            <div key={group.isoKey} className="rounded-xl border" style={{ backgroundColor: C.cardBg, borderColor: C.border, overflow: 'hidden' }}>
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => {
                  setExpandedDays((prev) => {
                    const next = new Set(prev);
                    if (next.has(group.isoKey)) next.delete(group.isoKey);
                    else next.add(group.isoKey);
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between px-4 py-2.5"
                style={{ backgroundColor: C.cardBg }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{group.dayLabel}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{group.bugs.length} bug{group.bugs.length > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 12, color: C.emerald }}>{fixedInGroup} fixed</span>
                </div>
                <span style={{ color: C.muted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
              </button>
              <div style={{ display: isExpanded ? 'block' : 'none' }}>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr style={{ backgroundColor: '#18222B' }}>
                      {['#', 'Session', 'Summary', 'Decision', 'Severity', 'Category', 'Source', 'Status'].map((header) => (
                        <th key={header} className="px-3 py-2 text-left font-semibold" style={{ color: C.slate }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.bugs.map((bug) => (
                      <tr key={bug.id} className="border-t" style={{ borderColor: C.border }}>
                        <td className="px-3 py-2">{bug.id}</td>
                        <td className="px-3 py-2" style={{ color: C.cyan }}>{bug.session}</td>
                        <td className="px-3 py-2">{bug.summary}</td>
                        <td className="px-3 py-2" style={{ color: C.muted }}>&mdash;</td>
                        <td className="px-3 py-2" style={{ color: bug.severity === 'Critical' ? C.rose : bug.severity === 'High' ? C.amber : bug.severity === 'Medium' ? C.cyan : C.muted }}>{bug.severity}</td>
                        <td className="px-3 py-2">{bug.category}</td>
                        <td className="px-3 py-2">{bug.source}</td>
                        <td className="px-3 py-2" style={{ color: bug.status.toLowerCase().startsWith('fixed') ? C.emerald : C.amber }}>{bug.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
