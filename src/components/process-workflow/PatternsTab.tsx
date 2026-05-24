import { colors } from '../processWorkflowData';
import { FadeIn, PatternCard } from '../ProcessWorkflowParts';

export function PatternsTab() {
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
        <PatternCard
          number={11}
          title="Living docs replace passoff chains"
          description="STATUS.md is always current. Tasks live in queues. No versioned handoff docs — the living docs are the context bridge."
        />
        <div style={{ borderBottom: "none" }}>
          <PatternCard
            number={12}
            title="Research before implementing"
            description="Don’t default to the first approach. Research best-in-class patterns, check what leading tools do, and verify the stack doesn’t already solve it — before writing code."
          />
        </div>
      </div>
    </FadeIn>
  );
}
