import { colors } from '../processWorkflowData';
import { FadeIn, RoleCard, WorkflowStep, DocCard } from '../ProcessWorkflowParts';
import { User, Brain, Terminal, Monitor } from 'lucide-react';

interface WorkflowTabProps {
  hoveredRole: string | null;
  setHoveredRole: (id: string | null) => void;
}

export function WorkflowTab({ hoveredRole, setHoveredRole }: WorkflowTabProps) {
  return (
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
  );
}
