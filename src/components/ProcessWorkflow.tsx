import { useState } from "react";
import { colors, processHistory } from "./processWorkflowData";
import { FadeIn, RoleCard, WorkflowStep, DocCard, PatternCard } from "./ProcessWorkflowParts";
import type { TabItem } from "./ProcessWorkflowParts";
import { User, Brain, Terminal, Monitor } from "lucide-react";

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
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: colors.text,
        padding: "40px 24px",
        maxWidth: 960,
        margin: "0 auto",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

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
              background: `linear-gradient(135deg, ${colors.cyan}, ${colors.violet})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
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
                transition: "all 0.2s ease",
                letterSpacing: 0.3,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* === WORKFLOW TAB === */}
      {activeTab === "workflow" && (
        <>
          {/* Roles */}
          <FadeIn delay={150}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Roles
            </div>
            <div style={{ display: "flex", gap: 14, marginBottom: 8, flexWrap: "wrap" }}>
              <RoleCard
                id="michael"
                icon={<User size={20} color={colors.cyan} />}
                title="Michael"
                subtitle="Product Owner / Designer"
                color={colors.cyan}
                dimColor={colors.cyanDim}
                items={[
                  "Functional & design decisions",
                  "Priority calls — what to build, what to defer",
                  "UX review via annotated screenshots",
                  "Final merge authority (Claude never merges)",
                  "Tests on the live site, not in code",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
              <RoleCard
                id="claude"
                icon={<Brain size={20} color={colors.violet} />}
                title="Claude"
                subtitle="Architect / Tech Lead"
                color={colors.violet}
                dimColor={colors.violetDim}
                items={[
                  "Technical decisions & architecture",
                  "Design prototyping (JSX artifacts)",
                  "Research & best practices",
                  "Task briefs for Claude Code & Codex",
                  "Code review & quality checks",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
            </div>
          </FadeIn>

          <FadeIn delay={250}>
            <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
              <RoleCard
                id="claude-code"
                icon={<Terminal size={20} color={colors.emerald} />}
                title="Claude Code"
                subtitle="Terminal Agent"
                color={colors.emerald}
                dimColor={colors.emeraldDim}
                items={[
                  "Direct file edits & git operations",
                  "PR creation and branch management",
                  "Data file updates & constants",
                  "Sequential tasks — never parallel",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
              <RoleCard
                id="codex"
                icon={<Monitor size={20} color={colors.amber} />}
                title="Codex"
                subtitle="Heavy Lift / Overflow"
                color={colors.amber}
                dimColor={colors.amberDim}
                items={[
                  "New components & features from scratch",
                  "Large multi-file refactors (200+ lines)",
                  "Token-limit overflow from Claude Code",
                  "Sequential tasks only (never parallel)",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
            </div>
          </FadeIn>

          {/* The Loop */}
          <FadeIn delay={350}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              The Development Loop
            </div>
            <div
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "24px 26px",
                marginBottom: 28,
              }}
            >
              <WorkflowStep number={1} text="Michael describes what he wants (natural language, often dictated)" color={colors.cyan} tool="claude.ai" />
              <WorkflowStep number={2} text="Claude asks clarifying questions if needed, proposes approach" color={colors.violet} tool="claude.ai" />
              <WorkflowStep number={3} text="Michael approves or redirects" color={colors.cyan} />
              <WorkflowStep number={4} text="Claude builds JSX prototypes for UX/design changes" color={colors.violet} tool="claude.ai" />
              <WorkflowStep number={5} text="Michael tests prototypes, gives feedback with annotated screenshots" color={colors.cyan} />
              <WorkflowStep number={6} text="Claude writes task files for implementation" color={colors.violet} tool="claude.ai" />
              <WorkflowStep number={7} text="Claude Code executes the task (edits, commits, pushes)" color={colors.emerald} tool="claude-code" />
              <WorkflowStep number={8} text="Claude Code creates PR on GitHub" color={colors.emerald} tool="claude-code" />
              <WorkflowStep number={9} text="Michael reviews and merges the PR" color={colors.cyan} tool="github" />
              <WorkflowStep number={10} text="Cloudflare auto-deploys" color={colors.rose} tool="cloudflare" />
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: `1px solid ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `1.5px solid ${colors.cyan}60`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  ↻
                </div>
                <div style={{ fontSize: 13, color: colors.muted, fontStyle: "italic" }}>
                  Michael reviews on the live site → feedback → next iteration
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Shared Documents */}
          <FadeIn delay={450}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Shared Documents
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <DocCard
                title="START HERE.md"
                description="Entry point for every session. Points to STATUS.md and the task queue. Read first, no exceptions."
                color={colors.cyan}
              />
              <DocCard
                title="STATUS.md"
                description="Living state doc in each project root. Always current — replaces versioned passoff chains."
                color={colors.violet}
              />
              <DocCard
                title="tasks/ folder"
                description="Work queue per project. index.md for at-a-glance status, individual .md files for detail, done/ for completed."
                color={colors.emerald}
              />
              <DocCard
                title="decisions.md / metrics.md"
                description="Canonical data source for the Meta Tracker app. Updated as part of completing tasks."
                color={colors.amber}
              />
            </div>
          </FadeIn>

          {/* Infrastructure */}
          <FadeIn delay={550}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                color: colors.muted,
                textTransform: "uppercase",
                marginBottom: 12,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Infrastructure
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "16px 22px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                { label: "GitHub", sub: "PRs + Review", color: colors.text },
                null,
                { label: "Cloudflare Pages", sub: "Auto-deploy", color: colors.amber },
                null,
                { label: "meta.jynaxxapps.com", sub: "Live site", color: colors.emerald },
              ].map((item, i) =>
                item === null ? (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "0 8px" }}>
                    <span style={{ color: colors.muted, fontSize: 16 }}>→</span>
                  </div>
                ) : (
                  <div
                    key={i}
                    style={{
                      textAlign: "center",
                      padding: "6px 20px",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: colors.muted }}>{item.sub}</div>
                  </div>
                )
              )}
            </div>
          </FadeIn>
        </>
      )}

      {/* === TASK ROUTING TAB === */}
      {activeTab === "routing" && (
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
      )}

      {/* === PATTERNS TAB === */}
      {activeTab === "patterns" && (
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
            Iteration patterns — what works (22 sessions learned)
          </div>
          <div
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: "22px 26px",
            }}
          >
            <PatternCard
              number={1}
              title="Small, targeted PRs"
              description="One concern per PR. Easier to review, less risk of regression."
            />
            <PatternCard
              number={2}
              title="Test on the live site, not in code"
              description="Michael reviews in the browser, not in diffs. Visual feedback drives the next iteration."
            />
            <PatternCard
              number={3}
              title="The tight feedback loop"
              description="Code change → merge → deploy → Michael tests → feedback → next change. Each cycle is 5–15 minutes."
            />
            <PatternCard
              number={4}
              title="Screenshots are the spec"
              description="Annotated screenshots with red boxes around problem areas are the most precise bug reports."
            />
            <PatternCard
              number={5}
              title="Prototype in claude.ai, build in Claude Code"
              description="Design decisions get explored interactively with JSX prototypes before implementation begins."
            />
            <PatternCard
              number={6}
              title="Three-task pattern for new components"
              description="Create the component (Task 1), wire it into the app (Task 2), run a parity/polish pass (Task 3)."
            />
            <PatternCard
              number={7}
              title="Claude Code for speed, Codex for scale"
              description="Claude Code handles most tasks directly. When a task is too large for a single session, break it into a Codex task."
            />
            <PatternCard
              number={8}
              title="Match review effort to risk"
              description="Data updates get a quick scan; refactors get careful attention. Not every PR needs deep review."
            />
            <PatternCard
              number={9}
              title="Sequential tasks only"
              description="Never run parallel tasks. Later tasks can revert earlier changes if they branch from stale main."
            />
            <PatternCard
              number={10}
              title="Parity checks for alternative views"
              description="When adding a second view of the same data, verify filters, labels, and formatting match everywhere."
            />
            <div style={{ borderBottom: "none" }}>
              <PatternCard
                number={11}
                title="Living docs replace passoff chains"
                description="STATUS.md is always current. Tasks live in queues. No versioned handoff docs — the living docs are the context bridge."
              />
            </div>
          </div>
        </FadeIn>
      )}


      {/* === HISTORY TAB === */}
      {activeTab === "history" && (
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
            Process changelog — how our workflow evolved
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {processHistory.map((entry, i) => (
              <FadeIn key={i} delay={100 + i * 60}>
                <div
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 12,
                    padding: "20px 24px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: `linear-gradient(90deg, ${colors.violet}, ${colors.violet}00)`,
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>
                      {entry.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: colors.muted,
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: 0.5,
                      }}
                    >
                      {entry.date} · {entry.session}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        flex: 1,
                        background: `${colors.rose}08`,
                        border: `1px solid ${colors.rose}20`,
                        borderRadius: 8,
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: 1.5,
                          color: colors.rose,
                          textTransform: "uppercase",
                          marginBottom: 6,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        Before
                      </div>
                      <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>
                        {entry.before}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: `${colors.emerald}08`,
                        border: `1px solid ${colors.emerald}20`,
                        borderRadius: 8,
                        padding: "10px 14px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: 1.5,
                          color: colors.emerald,
                          textTransform: "uppercase",
                          marginBottom: 6,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        After
                      </div>
                      <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>
                        {entry.after}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: colors.slate,
                      lineHeight: 1.6,
                      borderTop: `1px solid ${colors.border}`,
                      paddingTop: 10,
                    }}
                  >
                    <span style={{ color: colors.violet, fontWeight: 600 }}>Why: </span>
                    {entry.rationale}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
