import { useState } from "react";
import { colors } from "./processWorkflowData";
import { FadeIn } from "./ProcessWorkflowParts";
import type { TabItem } from "./ProcessWorkflowParts";
import ProcessTimeline from "./ProcessTimeline";
import { WorkflowTab } from "./process-workflow/WorkflowTab";
import { RoutingTab } from "./process-workflow/RoutingTab";
import { PatternsTab } from "./process-workflow/PatternsTab";

export default function ProcessWorkflow() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("workflow");

  const tabs: TabItem[] = [
    { id: "workflow", label: "Workflow" },
    { id: "routing", label: "Task Routing" },
    { id: "patterns", label: "Patterns" },
    { id: "history", label: "History" },
  ];

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        color: colors.text,
        padding: "40px 24px",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <FadeIn>
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: colors.muted,
              textTransform: "uppercase",
              marginBottom: 8,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Meta Tracker — Process Reference
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              margin: 0,
              color: colors.text,
              fontFamily: "'Space Grotesk', 'Geist', system-ui, sans-serif",
              letterSpacing: -0.5,
            }}
          >
            How We Work
          </h1>
          <div style={{ fontSize: 14, color: colors.muted, marginTop: 6, lineHeight: 1.6 }}>
            Michael + Claude — Describe → Plan → Build → Review → Ship
          </div>
        </div>
      </FadeIn>

      {/* Tab Navigation */}
      <FadeIn delay={100}>
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 28,
            borderBottom: `1px solid ${colors.border}`,
            paddingBottom: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab.id ? colors.cyan : colors.muted,
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 16px",
                cursor: "pointer",
                borderBottom: `2px solid ${activeTab === tab.id ? colors.cyan : "transparent"}`,
                marginBottom: -1,
                transition: "color 200ms cubic-bezier(0.23, 1, 0.32, 1), border-color 200ms cubic-bezier(0.23, 1, 0.32, 1)",
                letterSpacing: 0.3,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {activeTab === "workflow" && (
        <WorkflowTab hoveredRole={hoveredRole} setHoveredRole={setHoveredRole} />
      )}

      {activeTab === "routing" && <RoutingTab />}

      {activeTab === "patterns" && <PatternsTab />}

      {activeTab === "history" && (
        <FadeIn delay={100}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              color: colors.muted,
              textTransform: "uppercase",
              marginBottom: 20,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Process timeline — how our workflow evolved
          </div>
          <ProcessTimeline />
        </FadeIn>
      )}

      {/* Footer */}
      <FadeIn delay={600}>
        <div
          style={{
            marginTop: 36,
            paddingTop: 16,
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 12, color: colors.muted }}>
            Last updated: March 5, 2026
          </span>
          <span
            style={{
              fontSize: 12,
              color: colors.muted,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 0.5,
            }}
          >
            Built with Claude Code & Codex
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
