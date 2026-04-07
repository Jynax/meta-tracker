/* TIME MACHINE — commented out for ProcessTimeline replacement (Task #67)
 * Preserved for potential rollback.
 *
import { useState, useMemo } from "react";
import { colors, processHistory } from "./processWorkflowData";
import type { ProcessHistoryEntry } from "./processWorkflowData";
import { FadeIn } from "./ProcessWorkflowParts";
import { Clock, ChevronRight } from "lucide-react";

const sessionMilestones = (() => {
  const seen = new Map<number, { date: string; session: string }>();
  [...processHistory].reverse().forEach((e) => {
    if (!seen.has(e.sessionNumber)) {
      seen.set(e.sessionNumber, { date: e.date, session: e.session });
    }
  });
  return Array.from(seen.entries())
    .map(([num, info]) => ({ sessionNumber: num, ...info }))
    .sort((a, b) => a.sessionNumber - b.sessionNumber);
})();

const BASELINE_LABEL = "Before Session 15";

interface SnapshotItem {
  area: string;
  state: string;
  source: ProcessHistoryEntry;
}

function getSnapshotAt(sessionNum: number): SnapshotItem[] {
  const relevant = processHistory
    .filter((e) => e.sessionNumber <= sessionNum)
    .sort((a, b) => a.sessionNumber - b.sessionNumber);

  const stateMap = new Map<string, SnapshotItem>();
  relevant.forEach((e) => {
    stateMap.set(e.title, { area: e.title, state: e.after, source: e });
  });

  return Array.from(stateMap.values());
}

function getBaselineSnapshot(): SnapshotItem[] {
  const earliest = [...processHistory].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const seen = new Set<string>();
  const items: SnapshotItem[] = [];
  earliest.forEach((e) => {
    if (!seen.has(e.title)) {
      seen.add(e.title);
      items.push({ area: e.title, state: e.before, source: e });
    }
  });
  return items;
}

export default function TimeMachine() {
  const [sliderIndex, setSliderIndex] = useState(sessionMilestones.length);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isBaseline = sliderIndex === 0;
  const isNow = sliderIndex === sessionMilestones.length;
  const selectedMilestone = isBaseline ? null : sessionMilestones[sliderIndex - 1];

  const snapshot = useMemo(() => {
    if (isBaseline) return getBaselineSnapshot();
    return getSnapshotAt(selectedMilestone!.sessionNumber);
  }, [isBaseline, selectedMilestone]);

  const currentLabel = isBaseline
    ? BASELINE_LABEL
    : isNow
      ? "Now (Latest)"
      : `${selectedMilestone!.session} \u2014 ${selectedMilestone!.date}`;

  const changesApplied = isBaseline
    ? 0
    : processHistory.filter((e) => e.sessionNumber <= selectedMilestone!.sessionNumber).length;

  return (
    <div>
      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color={colors.violet} />
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{currentLabel}</span>
          </div>
          <span style={{ fontSize: 11, color: colors.muted, fontFamily: "'JetBrains Mono', monospace" }}>
            {changesApplied} of {processHistory.length} changes applied
          </span>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type="range"
            min={0}
            max={sessionMilestones.length}
            value={sliderIndex}
            onChange={(e) => { setSliderIndex(Number(e.target.value)); setExpandedItem(null); }}
            aria-label="Time machine session slider"
            style={{
              width: "100%",
              height: 6,
              appearance: "none",
              WebkitAppearance: "none",
              background: `linear-gradient(90deg, ${colors.violet} ${(sliderIndex / sessionMilestones.length) * 100}%, ${colors.border} ${(sliderIndex / sessionMilestones.length) * 100}%)`,
              borderRadius: 3,
              outline: "none",
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 2px" }}>
            <span
              style={{ fontSize: 10, color: sliderIndex === 0 ? colors.violet : colors.muted, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}
              onClick={() => { setSliderIndex(0); setExpandedItem(null); }}
            >
              Start
            </span>
            {sessionMilestones.map((m, i) => (
              <span
                key={m.sessionNumber}
                style={{ fontSize: 10, color: sliderIndex === i + 1 ? colors.violet : colors.muted, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", fontWeight: sliderIndex === i + 1 ? 600 : 400 }}
                onClick={() => { setSliderIndex(i + 1); setExpandedItem(null); }}
              >
                S{m.sessionNumber}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, letterSpacing: 1.5, color: colors.muted, textTransform: "uppercase", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        {isBaseline ? "Workflow state before any changes" : `Workflow state as of ${selectedMilestone!.session}`}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {snapshot.map((item, i) => {
          const isExpanded = expandedItem === item.area;
          return (
            <FadeIn key={item.area} delay={80 + i * 40}>
              <div
                style={{
                  background: colors.cardBg,
                  border: `1px solid ${isExpanded ? colors.violet + "40" : colors.border}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "border-color 200ms cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.area)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: colors.text }}
                >
                  <ChevronRight size={14} color={colors.violet} style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms cubic-bezier(0.23, 1, 0.32, 1)", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{item.area}</span>
                  <span style={{ fontSize: 10, color: colors.muted, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{item.source.session}</span>
                </button>
                {isExpanded && (
                  <div style={{ padding: "0 18px 14px 42px" }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: colors.slate,
                        lineHeight: 1.6,
                        marginBottom: 10,
                        padding: "10px 14px",
                        background: isBaseline ? `${colors.rose}08` : `${colors.emerald}08`,
                        border: `1px solid ${isBaseline ? colors.rose : colors.emerald}20`,
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ fontSize: 10, letterSpacing: 1.5, color: isBaseline ? colors.rose : colors.emerald, textTransform: "uppercase", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                        {isBaseline ? "State" : "Current State"}
                      </div>
                      {item.state}
                    </div>
                    <div style={{ fontSize: 11, color: colors.muted, lineHeight: 1.5 }}>
                      <span style={{ color: colors.violet, fontWeight: 600 }}>Why: </span>
                      {item.source.rationale}
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>

      {isBaseline && (
        <FadeIn delay={200}>
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              background: `${colors.violet}08`,
              border: `1px solid ${colors.violet}20`,
              borderRadius: 8,
              fontSize: 12,
              color: colors.muted,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            This is where we started. Drag the slider right to see how the workflow evolved.
          </div>
        </FadeIn>
      )}
    </div>
  );
}
*/
