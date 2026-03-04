import { useState, useEffect, ReactNode, CSSProperties } from "react";

const colors = {
  bg: "#0a0f1a",
  cardBg: "#131b2e",
  border: "#1e2d4a",
  borderHover: "#2a3f66",
  text: "#f0f4f8",
  muted: "#7a8ba8",
  slate: "#94a3b8",
  cyan: "#22d3ee",
  cyanDim: "rgba(34,211,238,0.08)",
  violet: "#a78bfa",
  violetDim: "rgba(167,139,250,0.08)",
  emerald: "#34d399",
  emeraldDim: "rgba(52,211,153,0.08)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.08)",
  rose: "#fb7185",
  roseDim: "rgba(251,113,133,0.08)",
} as const;

type ColorsType = typeof colors;

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
}

const FadeIn = ({ children, delay = 0, style = {} }: FadeInProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface ArrowProps {
  from?: string;
  to?: string;
  color?: string;
  label?: string;
  dashed?: boolean;
}

const Arrow = ({ from, to, color = colors.muted, label = "", dashed = false }: ArrowProps) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "2px 0" }}>
      <div
        style={{
          flex: 1,
          height: dashed ? 0 : 2,
          borderTop: dashed ? `2px dashed ${color}40` : `2px solid ${color}40`,
        }}
      />
      {label && (
        <span
          style={{
            fontSize: 12,
            color: color,
            padding: "2px 8px",
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: `8px solid ${color}80`,
        }}
      />
    </div>
  );
};

interface FlowArrowProps {
  color?: string;
  label?: string;
  direction?: "down" | "up";
}

const FlowArrow = ({ color = colors.muted, label = "", direction = "down" }: FlowArrowProps) => {
  const isDown = direction === "down";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      <div style={{ width: 2, height: 20, background: `${color}40` }} />
      {label && (
        <span
          style={{
            fontSize: 12,
            color: `${color}99`,
            padding: "2px 6px",
            letterSpacing: 0.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
      {label && <div style={{ width: 2, height: 10, background: `${color}40` }} />}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          ...(isDown
            ? { borderTop: `8px solid ${color}80` }
            : { borderBottom: `8px solid ${color}80` }),
        }}
      />
    </div>
  );
};

interface RoleCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  items: string[];
  dimColor: string;
  hoveredRole: string | null;
  setHoveredRole: (role: string | null) => void;
  id: string;
}

const RoleCard = ({
  icon,
  title,
  subtitle,
  color,
  items,
  dimColor,
  hoveredRole,
  setHoveredRole,
  id,
}: RoleCardProps) => {
  const isHovered = hoveredRole === id;
  return (
    <div
      onMouseEnter={() => setHoveredRole(id)}
      onMouseLeave={() => setHoveredRole(null)}
      style={{
        background: isHovered ? dimColor : colors.cardBg,
        border: `1px solid ${isHovered ? color + "60" : colors.border}`,
        borderRadius: 12,
        padding: "20px 22px",
        flex: 1,
        minWidth: 200,
        transition: "all 0.3s ease",
        cursor: "default",
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
          background: `linear-gradient(90deg, ${color}, ${color}00)`,
          opacity: isHovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: color, letterSpacing: 0.3 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: colors.muted, letterSpacing: 0.5 }}>{subtitle}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: colors.slate,
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: `${color}80`, fontSize: 8, marginTop: 5, flexShrink: 0 }}>â</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

interface StepNumberProps {
  n: number;
  color: string;
}

const StepNumber = ({ n, color }: StepNumberProps) => (
  <div
    style={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      border: `1.5px solid ${color}60`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 700,
      color: color,
      fontFamily: "'JetBrains Mono', monospace",
      flexShrink: 0,
    }}
  >
    {n}
  </div>
);

interface WorkflowStepProps {
  number: number;
  text: string;
  color: string;
  tool?: string;
}

const WorkflowStep = ({ number, text, color, tool }: WorkflowStepProps) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
    <StepNumber n={number} color={color} />
    <div style={{ fontSize: 13, color: colors.text, lineHeight: 1.5, flex: 1 }}>{text}</div>
    {tool && (
      <span
        style={{
          fontSize: 12,
          color: color,
          background: `${color}15`,
          padding: "3px 8px",
          borderRadius: 4,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {tool}
      </span>
    )}
  </div>
);

interface DocCardProps {
  title: string;
  description: string;
  color: string;
}

const DocCard = ({ title, description, color }: DocCardProps) => (
  <div
    style={{
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 8,
      padding: "12px 16px",
      flex: 1,
      minWidth: 160,
    }}
  >
    <div style={{ fontSize: 12, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>{description}</div>
  </div>
);

interface PatternCardProps {
  number: number;
  title: string;
  description: string;
}

const PatternCard = ({ number, title, description }: PatternCardProps) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      padding: "10px 0",
      borderBottom: `1px solid ${colors.border}`,
    }}
  >
    <span
      style={{
        fontSize: 12,
        color: colors.amber,
        fontFamily: "'JetBrains Mono', monospace",
        marginTop: 2,
        flexShrink: 0,
      }}
    >
      {String(number).padStart(2, "0")}
    </span>
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5 }}>{description}</div>
    </div>
  </div>
);

interface TabItem {
  id: string;
  label: string;
}

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
            Meta Tracker Â· Process Reference
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
            Michael + Claude Â· Design â Brief â Build â Review â Ship
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
                icon="ð¤"
                title="Michael"
                subtitle="Product Owner / Designer"
                color={colors.cyan}
                dimColor={colors.cyanDim}
                items={[
                  "Functional & design decisions",
                  "Priority calls â what to build, what to defer",
                  "UX review via annotated screenshots",
                  "Final merge authority (Claude never merges)",
                  "Tests on the live site, not in code",
                ]}
                hoveredRole={hoveredRole}
                setHoveredRole={setHoveredRole}
              />
              <RoleCard
                id="claude"
                icon="ð§ "
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
                icon="ð§"
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
                icon="ð»"
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
              <WorkflowStep number={9} text="PRs created on GitHub â Michael does the final merge" color={colors.cyan} tool="github" />
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
                  â»
                </div>
                <div style={{ fontSize: 13, color: colors.muted, fontStyle: "italic" }}>
                  Michael reviews on the live site â feedback â next iteration (5â15 min cycles)
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
                title="Next Session Brief"
                description="Context bridge between sessions. Big picture, priorities, technical state, process notes."
                color={colors.cyan}
              />
              <DocCard
                title="How We Work.md"
                description="This document. Roles, workflow, routing, patterns, and communication style."
                color={colors.violet}
              />
              <DocCard
                title="Task Briefs"
                description="Scoped, sequenced instructions for Cowork/Codex. Numbered with acceptance criteria."
                color={colors.emerald}
              />
              <DocCard
                title="decisions.md / metrics.md"
                description="Canonical data source for the Meta Tracker app. Updated every session at passoff."
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
                    <span style={{ color: colors.muted, fontSize: 16 }}>â</span>
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
                <span style={{ fontSize: 18 }}>ð»</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.amber }}>Codex</span>
                <span style={{ fontSize: 12, color: colors.muted }}>â Heavy lifting</span>
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
                  <span style={{ color: colors.amber, fontSize: 8, marginTop: 5 }}>â</span>
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
                â  Sequential only â never run parallel tasks. Later tasks can revert earlier changes if
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
                <span style={{ fontSize: 18 }}>ð§</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.emerald }}>Cowork</span>
                <span style={{ fontSize: 12, color: colors.muted }}>â Direct edits</span>
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
                  <span style={{ color: colors.emerald, fontSize: 8, marginTop: 5 }}>â</span>
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
                <span style={{ fontSize: 18 }}>ð§ </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: colors.violet }}>Claude (claude.ai)</span>
                <span style={{ fontSize: 12, color: colors.muted }}>â Design shop</span>
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
                  <span style={{ color: colors.violet, fontSize: 8, marginTop: 5 }}>â</span>
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
                <span style={{ color: colors.rose, fontSize: 8, marginTop: 5 }}>â</span>
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
            Iteration patterns â what works (13 sessions learned)
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
              description="Code change â merge â deploy â Michael tests â feedback â next change. Each cycle is 5â15 minutes."
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
                title="Session passoff documents"
                description="Every session produces a passoff doc (what happened) and a next session brief (what to do). This is the context bridge."
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
            Last updated: March 3, 2026 Â· Session 13
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
