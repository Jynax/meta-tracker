import { useState, useMemo } from "react";
import { colors, processHistory, categoryColors } from "./processWorkflowData";
import type { ProcessHistoryEntry, ProcessCategory } from "./processWorkflowData";
import { FadeIn } from "./ProcessWorkflowParts";

interface SessionCluster {
  sessionNumber: number;
  session: string;
  date: string;
  entries: ProcessHistoryEntry[];
}

function buildClusters(entries: ProcessHistoryEntry[]): SessionCluster[] {
  const map = new Map<number, SessionCluster>();
  entries.forEach((e) => {
    if (!map.has(e.sessionNumber)) {
      map.set(e.sessionNumber, {
        sessionNumber: e.sessionNumber,
        session: e.session,
        date: e.date,
        entries: [],
      });
    }
    map.get(e.sessionNumber)!.entries.push(e);
  });
  return Array.from(map.values()).sort((a, b) => a.sessionNumber - b.sessionNumber);
}

export default function ProcessTimeline() {
  const allCategories: ProcessCategory[] = ['tooling', 'process', 'ui'];

  const [activeCategories, setActiveCategories] = useState<Set<ProcessCategory>>(
    new Set(allCategories)
  );

  const toggleCategory = (cat: ProcessCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const showAll = activeCategories.size === 0 || activeCategories.size === allCategories.length;

  const allClusters = useMemo(() => buildClusters(processHistory), []);

  const filteredClusters = useMemo(() => {
    return allClusters.map((c) => ({
      ...c,
      entries: showAll ? c.entries : c.entries.filter((e) => activeCategories.has(e.category)),
    }));
  }, [allClusters, activeCategories, showAll]);

  return (
    <FadeIn>
      {/* Filter chips */}
      <div style={{ display: "flex", flexDirection: "row", gap: 8, marginBottom: 24 }}>
        {allCategories.map((cat) => {
          const isActive = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: 20,
                cursor: "pointer",
                border: isActive
                  ? `1px solid ${categoryColors[cat].full}60`
                  : `1px solid ${colors.border}`,
                background: isActive ? categoryColors[cat].dim : "transparent",
                color: isActive ? categoryColors[cat].full : colors.muted,
              }}
            >
              {categoryColors[cat].label}
            </button>
          );
        })}
      </div>

      {/* Timeline scroll container */}
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        {/* Inner wrapper */}
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            gap: 16,
            minWidth: "100%",
            paddingBottom: 48,
          }}
        >
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              height: 2,
              background: colors.border,
            }}
          />

          {/* Cluster columns */}
          {filteredClusters.map((cluster) => {
            const hasEntries = cluster.entries.length > 0;
            return (
              <div
                key={cluster.sessionNumber}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 280,
                }}
              >
                {/* Card */}
                {hasEntries && (
                  <div
                    style={{
                      width: 280,
                      background: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 12,
                      padding: "16px 18px",
                      marginBottom: 0,
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        fontSize: 11,
                        color: colors.muted,
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: 12,
                      }}
                    >
                      {cluster.session} — {cluster.date.replace(/, d{4}$/, "")}
                    </div>

                    {/* Entry list */}
                    {cluster.entries.map((entry, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderLeft: `3px solid ${categoryColors[entry.category].full}`,
                          background: categoryColors[entry.category].dim,
                          borderRadius: 8,
                          padding: "12px 14px",
                          marginBottom: idx < cluster.entries.length - 1 ? 8 : 0,
                        }}
                      >
                        {/* Title */}
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: colors.text,
                            marginBottom: 8,
                          }}
                        >
                          {entry.title}
                        </div>

                        {/* Before block */}
                        <div
                          style={{
                            background: colors.roseDim,
                            border: `1px solid ${colors.rose}20`,
                            borderRadius: 6,
                            padding: "8px 10px",
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: 1.5,
                              color: colors.rose,
                              textTransform: "uppercase",
                              marginBottom: 4,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            BEFORE
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: colors.muted,
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.before}
                          </div>
                        </div>

                        {/* After block */}
                        <div
                          style={{
                            background: colors.emeraldDim,
                            border: `1px solid ${colors.emerald}20`,
                            borderRadius: 6,
                            padding: "8px 10px",
                            marginBottom: 6,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              letterSpacing: 1.5,
                              color: colors.emerald,
                              textTransform: "uppercase",
                              marginBottom: 4,
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            AFTER
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: colors.muted,
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.after}
                          </div>
                        </div>

                        {/* Rationale */}
                        <div
                          style={{
                            fontSize: 11,
                            color: colors.muted,
                            lineHeight: 1.5,
                            marginTop: 8,
                          }}
                        >
                          <span
                            style={{
                              color: colors.violet,
                              fontWeight: 600,
                            }}
                          >
                            {"Why: "}
                          </span>
                          {entry.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stem only if card visible */}
                {hasEntries && (
                  <div
                    style={{
                      width: 2,
                      height: 20,
                      background: colors.border,
                    }}
                  />
                )}

                {/* Dot always visible */}
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: colors.violet,
                    flexShrink: 0,
                  }}
                />

                {/* Session label below dot always visible */}
                <div
                  style={{
                    fontSize: 10,
                    color: colors.muted,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginTop: 4,
                  }}
                >
                  {"S"}{cluster.sessionNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
