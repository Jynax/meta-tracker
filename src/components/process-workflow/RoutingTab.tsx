import { colors } from '../processWorkflowData';
import { FadeIn } from '../ProcessWorkflowParts';
import { Brain, Terminal, Monitor } from 'lucide-react';

export function RoutingTab() {
  return (
    <FadeIn delay={100}>
      <div
        style={{
          fontSize: 12,
          letterSpacing: 2,
          color: colors.muted,
          textTransform: "uppercase",
          marginBottom: 16,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Use the right tool for the scope
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
        {/* Claude Code */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${colors.emerald}`,
            borderRadius: 12,
            padding: "22px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Terminal size={18} color={colors.emerald} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.emerald }}>Claude Code</span>
              <span style={{ fontSize: 12, color: colors.muted, marginLeft: 8 }}>— Build shop</span>
            </div>
          </div>
          {[
            "All direct file edits",
            "Data files, constants, config",
            "Single & multi-file changes (~200 lines)",
            "Git operations: commits, branches, PRs",
            "Documentation updates",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: colors.slate,
                padding: "5px 0",
                display: "flex",
                gap: 8,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: colors.emerald, fontSize: 8, marginTop: 5 }}>●</span>
              {item}
            </div>
          ))}
        </div>

        {/* Codex */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${colors.amber}`,
            borderRadius: 12,
            padding: "22px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Monitor size={18} color={colors.amber} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.amber }}>Codex</span>
              <span style={{ fontSize: 12, color: colors.muted, marginLeft: 8 }}>— Heavy lift / overflow</span>
            </div>
          </div>
          {[
            "New components from scratch (200+ lines)",
            "Large multi-file refactors",
            "Complex scaffolding tasks",
            "Token-limit overflow from Claude Code",
            "Sequential only — never parallel",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: colors.slate,
                padding: "5px 0",
                display: "flex",
                gap: 8,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: colors.amber, fontSize: 8, marginTop: 5 }}>●</span>
              {item}
            </div>
          ))}
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: `${colors.amber}08`,
              borderRadius: 8,
              border: `1px solid ${colors.amber}20`,
              fontSize: 12,
              color: colors.amber,
              lineHeight: 1.5,
            }}
          >
            ⚠ Sequential only — later tasks can revert earlier changes if they branch from stale main.
          </div>
        </div>

        {/* Claude.ai */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${colors.violet}`,
            borderRadius: 12,
            padding: "22px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Brain size={18} color={colors.violet} />
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.violet }}>Claude.ai</span>
              <span style={{ fontSize: 12, color: colors.muted, marginLeft: 8 }}>— Design shop</span>
            </div>
          </div>
          {[
            "Planning & task file creation",
            "JSX design prototypes",
            "Code review for large/risky PRs",
            "Research & best practices",
            "Process decisions & workflow design",
          ].map((item, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: colors.slate,
                padding: "5px 0",
                display: "flex",
                gap: 8,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: colors.violet, fontSize: 8, marginTop: 5 }}>●</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Principle callout */}
      <div
        style={{
          background: `${colors.violet}08`,
          border: `1px solid ${colors.violet}30`,
          borderRadius: 12,
          padding: "16px 22px",
          marginBottom: 28,
          fontSize: 13,
          color: colors.text,
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        "Claude.ai is the design shop. Claude Code is the build shop. Codex is the heavy lifter when needed."
      </div>

      {/* Escalation Guide */}
      <div
        style={{
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: "22px 24px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: colors.rose,
            textTransform: "uppercase",
            marginBottom: 14,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          When to escalate to claude.ai review
        </div>
        {[
          "PR is over 200 lines and involves logic changes (not just data)",
          "Switching visualization approaches (e.g., div-based to SVG)",
          "Changes to shared state, routing, or the view switcher",
          "Anything touching treeLayout.ts (the layout engine is fragile)",
        ].map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: colors.slate,
              padding: "5px 0",
              display: "flex",
              gap: 8,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: colors.rose, fontSize: 8, marginTop: 5 }}>●</span>
            {item}
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
