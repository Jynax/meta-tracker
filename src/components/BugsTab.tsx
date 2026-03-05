import { useMemo, useState, useEffect } from 'react';
import { DonutBreakdown, C } from './MetricsCard';
import type { BugEntry } from '../data/metaMetrics';

interface BugsTabProps {
  bugs: BugEntry[];
  projectId: string;
}

export default function BugsTab({ bugs, projectId }: BugsTabProps) {
  const [animateBugDonuts, setAnimateBugDonuts] = useState(false);
  const [expandedBugSessions, setExpandedBugSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAnimateBugDonuts(false);
    const timer = window.setTimeout(() => setAnimateBugDonuts(true), 50);
    return () => window.clearTimeout(timer);
  }, []);

  const { bySeverity, byCategory, bySource, fixedBugs, openBugs } = useMemo(() => {
    const bySev = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.severity] = (acc[bug.severity] ?? 0) + 1; return acc; }, {});
    const byCat = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.category] = (acc[bug.category] ?? 0) + 1; return acc; }, {});
    const bySrc = bugs.reduce<Record<string, number>>((acc, bug) => { acc[bug.source] = (acc[bug.source] ?? 0) + 1; return acc; }, {});
    const fixed = bugs.filter((bug) => bug.status.toLowerCase() === 'fixed').length;
    return { bySeverity: bySev, byCategory: byCat, bySource: bySrc, fixedBugs: fixed, openBugs: bugs.length - fixed };
  }, [bugs]);

  const bugsBySession = useMemo(() => {
    const groups = new Map<string, { key: string; label: string; date: string; bugs: typeof bugs }>();
    bugs.forEach((bug) => {
      const key = bug.session;
      const existing = groups.get(key) ?? { key, label: bug.label, date: bug.date, bugs: [] };
      existing.bugs.push(bug);
      groups.set(key, existing);
    });
    return Array.from(groups.values()).reverse();
  }, [bugs]);

  useEffect(() => {
    if (bugsBySession.length > 0) {
      setExpandedBugSessions(new Set([bugsBySession[0].key]));
    }
  }, [projectId, bugsBySession]);

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
            { label: 'Critical', count: bySeverity.Critical ?? 0, color: '#ef4444' },
            { label: 'High', count: bySeverity.High ?? 0, color: '#f97316' },
            { label: 'Medium', count: bySeverity.Medium ?? 0, color: '#fbbf24' },
            { label: 'Low', count: bySeverity.Low ?? 0, color: '#64748b' },
          ]}
        />
        <DonutBreakdown animate={animateBugDonuts} label="Category"
          items={[
            { label: 'Technical', count: byCategory.Technical ?? 0, color: '#22d3ee' },
            { label: 'Functional', count: byCategory.Functional ?? 0, color: '#34d399' },
            { label: 'UX', count: byCategory.UX ?? 0, color: '#fbbf24' },
          ]}
        />
        <DonutBreakdown animate={animateBugDonuts} label="Source"
          items={[
            { label: 'ChatGPT Code Review', count: bySource['ChatGPT Code Review'] ?? 0, color: '#22d3ee' },
            { label: 'Cowork Audit', count: bySource['Cowork Audit'] ?? 0, color: '#34d399' },
            { label: 'Code Review', count: bySource['Code Review'] ?? 0, color: '#a78bfa' },
            { label: 'Cowork Code Review', count: bySource['Cowork Code Review'] ?? 0, color: '#fbbf24' },
            { label: 'User Report', count: bySource['User Report'] ?? 0, color: '#fb7185' },
            { label: 'Codex Auto-Review', count: bySource['Codex Auto-Review'] ?? 0, color: '#64748b' },
          ]}
        />
      </div>
      <div className="space-y-2">
        {bugsBySession.map((group) => {
          const isExpanded = expandedBugSessions.has(group.key);
          const fixedInGroup = group.bugs.filter(b => b.status.toLowerCase() === 'fixed').length;
          return (
            <div key={group.key} className="rounded-xl border" style={{ backgroundColor: C.cardBg, borderColor: C.border, overflow: 'hidden' }}>
              <button
                onClick={() => {
                  setExpandedBugSessions((prev) => {
                    const next = new Set(prev);
                    if (next.has(group.key)) next.delete(group.key);
                    else next.add(group.key);
                    return next;
                  });
                }}
                className="flex w-full items-center justify-between px-4 py-2.5"
                style={{ backgroundColor: C.cardBg }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{group.date} — {group.label}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>{group.bugs.length} bug{group.bugs.length > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 12, color: C.slate }}>{fixedInGroup} fixed</span>
                </div>
                <span style={{ color: C.muted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>&#9654;</span>
              </button>
              <div style={{ maxHeight: isExpanded ? 2000 : 0, overflow: 'hidden', transition: 'max-height 300ms ease' }}>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr style={{ backgroundColor: '#162136' }}>
                      {['#', 'Date', 'Summary', 'Decision', 'Severity', 'Category', 'Source', 'Status'].map((header) => (
                        <th key={header} className="px-3 py-2 text-left font-semibold" style={{ color: C.slate }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.bugs.map((bug) => (
                      <tr key={bug.id} className="border-t" style={{ borderColor: C.border }}>
                        <td className="px-3 py-2">{bug.id}</td>
                        <td className="px-3 py-2" style={{ color: C.cyan }}>{bug.date}</td>
                        <td className="px-3 py-2">{bug.summary}</td>
                        <td className="px-3 py-2" style={{ color: C.muted }}>&mdash;</td>
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
          );
        })}
      </div>
    </div>
  );
}
