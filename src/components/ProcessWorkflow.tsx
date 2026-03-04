import { useState } from "react";
import { colors } from "./processWorkflowData";
import { FadeIn, Arrow, FlowArrow, RoleCard, StepNumber, WorkflowStep, DocCard, PatternCard } from "./ProcessWorkflowParts";
import type { TabItem } from "./ProcessWorkflowParts";

export default function ProcessWorkflow() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("workflow");

  const tabs: TabItem[] = [
    { id: "workflow", label: "Workflow" },
    { id: "routing", label: "Task Routing" },
    { id: "patterns", label: "Patterns" },
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
            Meta Tracker ÃÂÃÂ· Process Reference
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
            Michael + Claude ÃÂÃÂ· Design ÃÂ¢ÃÂÃÂ Brief ÃÂ¢ÃÂÃÂ Build ÃÂ¢ÃÂÃÂ Review ÃÂ¢ÃÂÃÂ Ship
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
                icon="ÃÂ°ÃÂÃÂÃÂ¤"
                title="Michael"
                subtitle="Product Owner / Designer"
                color={colors.cyan}
                dimColor={colors.cyanDim}
                items={[
                  "Functional & design decisions",
                  "Priority calls ÃÂ¢ÃÂÃÂ what to build, what to defer",
                  "UX review via annotated screenshots",
                  "Final merge authority (Claude never merges)",
                  "Tests on the live site, not in code",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
              <RoleCard
                id="claude"
                icon="ÃÂ°ÃÂÃÂ§ÃÂ "
                title="Claude"
                subtitle="Architect / Tech Lead"
                color={colors.violet}
                dimColor={colors.violetDim}
                items={[
                  "Technical decisions & architecture",
                  "Design prototyping (JSX artifacts)",
                  "Research & best practices",
                  "Task briefs for Cowork & Codex",
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
                id="cowork"
                icon="ÃÂ°ÃÂÃÂÃÂ§"
                title="Cowork"
                subtitle="Orchestration & Light Edits"
                color={colors.emerald}
                dimColor={colors.emeraldDim}
                items={[
                  "Multi-file edits & UX polish",
                  "Data file updates & constants",
                  "Config changes & documentation",
                  "Browser automation for Codex submission",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
              <RoleCard
                id="codex"
                icon="ÃÂ°ÃÂÃÂÃÂ»"
                title="Codex"
                subtitle="Code Generation Engine"
                color={colors.amber}
                dimColor={colors.amberDim}
                items={[
                  "New components & features",
                  "Substantial refactors (50+ lines)",
                  "Multi-file logic changes",
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
              <WorkflowStep number={2} text="Claude asks clarifying questions if needed, then proposes a technical approach" color={colors.violet} tool="claude.ai" />
              <WorkflowStep number={3} text="Michael approves or redirects the approach" color={colors.cyan} />
              <WorkflowStep number={4} text="Claude builds interactive JSX prototypes for UX/design changes" color={colors.violet} tool="claude.ai" />
              <WorkflowStep number={5} text="Michael tests prototypes, gives feedback with annotated screenshots" color={colors.cyan} />
              <WorkflowStep number={6} text="Claude writes scoped, sequenced task briefs with acceptance criteria" color={colors.violet} tool="task briefs" />
              <WorkflowStep number={7} text="Cowork executes task briefs (or routes substantial code to Codex)" color={colors.emerald} tool="cowork" />
              <WorkflowStep number={8} text="Codex generates code for new components and large changes" color={colors.amber} tool="codex" />
              <WorkflowStep number={9} text="PRs created on GitHub ÃÂ¢ÃÂÃÂ Michael does the final merge" color={colors.cyan} tool="github" />
              <WorkflowStep number={10} text="Cloudflare auto-deploys on merge to main" color={colors.rose} tool="cloudflare" />
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
                  ÃÂ¢ÃÂÃÂ»
                </div>
                <div style={{ fontSize: 13, color: colors.muted, fontStyle: "italic" }}>
                  Michael reviews on the live site ÃÂ¢ÃÂÃÂ feedback ÃÂ¢ÃÂÃÂ next iteration (5ÃÂ¢ÃÂÃÂ15 min cycles)
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
                description="Living state doc in each project root. Always current â replaces versioned passoff chains."
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
                    <span style={{ color: colors.muted, fontSize: 16 }}>ÃÂ¢ÃÂÃÂ</span>
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
            {/* Codex */}
            <div
              style={{
                flex: 1,
                minWidth: 280,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "22px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>ÃÂ°ÃÂÃÂÃÂ»</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.amber }}>Codex</span>
                <span style={{ fontSize: 12, color: colors.muted }}>ÃÂ¢ÃÂÃÂ Heavy lifting</span>
              </div>
              {[
                "New components & major features",
                "Multi-file changes (50+ lines)",
                "Changes needing a local build to verify",
                "Complex logic, state management rewrites",
                "Dependency additions, build config changes",
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
                  <span style={{ color: colors.amber, fontSize: 8, marginTop: 5 }}>ÃÂ¢ÃÂÃÂ</span>
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
                ÃÂ¢ÃÂÃÂ  Sequential only ÃÂ¢ÃÂÃÂ never run parallel tasks. Later tasks can revert earlier changes if
                they branch from stale main.
              </div>
            </div>

            {/* Cowork */}
            <div
              style={{
                flex: 1,
                minWidth: 280,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "22px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>ÃÂ°ÃÂÃÂÃÂ§</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.emerald }}>Cowork</span>
                <span style={{ fontSize: 12, color: colors.muted }}>ÃÂ¢ÃÂÃÂ Direct edits</span>
              </div>
              {[
                "Data file updates (projects, metrics)",
                "Constant tweaks (spacing, colors, labels)",
                "Config changes (vite.config, tsconfig)",
                "Documentation and README updates",
                "Single-file edits under ~20 lines",
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
                  <span style={{ color: colors.emerald, fontSize: 8, marginTop: 5 }}>ÃÂ¢ÃÂÃÂ</span>
                  {item}
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  background: `${colors.emerald}08`,
                  borderRadius: 8,
                  border: `1px solid ${colors.emerald}20`,
                  fontSize: 12,
                  color: colors.emerald,
                  lineHeight: 1.5,
                }}
              >
                Principle: Don't route a 3-line constant change through a full Codex task.
              </div>
            </div>

            {/* Claude.ai */}
            <div
              style={{
                flex: 1,
                minWidth: 280,
                background: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: "22px 24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>ÃÂ°ÃÂÃÂ§ÃÂ </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.violet }}>Claude (claude.ai)</span>
                <span style={{ fontSize: 12, color: colors.muted }}>ÃÂ¢ÃÂÃÂ Design shop</span>
              </div>
              {[
                "Design prototyping (JSX artifacts)",
                "Planning & task brief writing",
                "Research & best practices",
                "Code review for large PRs (200+ lines)",
                "Process discussions & workflow design",
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
                  <span style={{ color: colors.violet, fontSize: 8, marginTop: 5 }}>ÃÂ¢ÃÂÃÂ</span>
                  {item}
                </div>
              ))}
              <div
                style={{
                  marginTop: 14,
                  padding: "10px 14px",
                  background: `${colors.violet}08`,
                  borderRadius: 8,
                  border: `1px solid ${colors.violet}20`,
                  fontSize: 12,
                  color: colors.violet,
                  lineHeight: 1.5,
                }}
              >
                Claude.ai is the design shop. Cowork is the build shop. Keep them separate.
              </div>
            </div>
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
                <span style={{ color: colors.rose, fontSize: 8, marginTop: 5 }}>ÃÂ¢ÃÂÃÂ</span>
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
            Iteration patterns ÃÂ¢ÃÂÃÂ what works (13 sessions learned)
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
              description="Code change ÃÂ¢ÃÂÃÂ merge ÃÂ¢ÃÂÃÂ deploy ÃÂ¢ÃÂÃÂ Michael tests ÃÂ¢ÃÂÃÂ feedback ÃÂ¢ÃÂÃÂ next change. Each cycle is 5ÃÂ¢ÃÂÃÂ15 minutes."
            />
            <PatternCard
              number={4}
              title="Screenshots are the spec"
              description="Annotated screenshots with red boxes around problem areas are the most precise bug reports."
            />
            <PatternCard
              number={5}
              title="Prototype in claude.ai, build in Cowork"
              description="Design decisions get explored interactively with JSX prototypes before implementation begins."
            />
            <PatternCard
              number={6}
              title="Three-task pattern for new components"
              description="Create the component (Task 1), wire it into the app (Task 2), run a parity/polish pass (Task 3)."
            />
            <PatternCard
              number={7}
              title="Route tasks to the right tool"
              description="Codex for heavy code gen, Cowork for light edits, claude.ai for design and planning."
            />
            <PatternCard
              number={8}
              title="Match review effort to risk"
              description="Data updates get a quick scan; refactors get careful attention. Not every PR needs deep review."
            />
            <PatternCard
              number={9}
              title="Sequential Codex tasks only"
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
                description="STATUS.md is always current. Tasks live in queues. No versioned handoff docs â the living docs are the context bridge."
              />
            </div>
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
            Last updated: March 3, 2026 ÃÂÃÂ· Session 13
          </span>
          <span
            style={{
              fontSize: 12,
              color: colors.muted,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 0.5,
            }}
          >
            Built with Claude Cowork & Codex
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
