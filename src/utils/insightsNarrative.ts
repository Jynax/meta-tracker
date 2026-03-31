// ── Types ──────────────────────────────────────────────────────────────────

export interface Source {
  label: string;
  url?: string;
  note?: string;
}

export interface NarrativeSection {
  id: string;
  heading: string;
  prose: string;
  chartKey?: string;
  sources?: Source[];
  disclaimer?: string;
}

export interface Chapter {
  id: string;
  title: string;
  intro?: string;
  sections: NarrativeSection[];
}

export type ChapterId = 'theStory' | 'whatWeLearned' | 'byTheNumbers' | 'forTeams' | 'fromTheAI';

export const PORTFOLIO_HEADLINE = '9 projects. 3 AI tools. 1 human. 170 hours of building — and an honest look at what we learned.';

export const chapters: Record<ChapterId, Chapter> = {
  theStory: {
    id: 'theStory',
    title: 'The Story',
    intro: 'What happens when one person builds an entire portfolio with AI? Over five weeks and nine projects, we found out — and the answers weren\'t always what we expected.',
    sections: [
      {
        id: 'story-arc',
        heading: 'From One App to Nine',
        prose: 'It started with a reading log app (BIP) in mid-February 2026. Five weeks later, the portfolio had grown to nine projects: a project analytics dashboard, a survival game prototype, a WoW addon with web dashboard, a job search platform, a sheet music transposer, a shared security training app, a personal hub site, and a feedback capture tool.\n\nThree different AI tools powered the work: ChatGPT for early rapid prototyping, Cowork (browser automation) for surgical audits, and Claude Code for infrastructure and stabilization. Each had different strengths — and different failure modes.',
        chartKey: 'projectTimeline',
      },
      {
        id: 'story-tools',
        heading: 'Three Tool Eras',
        prose: 'The ChatGPT era (Feb 14–18) was the fastest — 8,752 LOC across 5 sessions — but also produced the only Critical-severity bug in the entire portfolio. The Cowork era was surgical and slow, focused on audits and decomposition. The Claude Code era combined scale with quality: Playwright test suites, dependency migrations, and CI/CD infrastructure.\n\nThe shift wasn\'t about going faster. It was about going deeper.',
      },
      {
        id: 'story-inflections',
        heading: 'Inflection Points',
        prose: 'Three process changes shaped the portfolio more than any single feature:\n\n1. **The PR workflow** (Session 22) — no more direct commits to main. Every change reviewed, every deploy tracked.\n2. **Playwright testing** (Session 35) — automated test suites that became the confidence layer for aggressive refactoring.\n3. **The Day/Block data model** (Sessions 44–46) — replacing session-based tracking with granular work blocks, enabling honest attribution of who did what.',
      },
    ],
  },
  whatWeLearned: {
    id: 'whatWeLearned',
    title: 'What We Learned',
    intro: 'Six findings from 170 hours of human–AI collaboration. Each one backed by portfolio data.',
    sections: [
      {
        id: 'velocity-vs-quality',
        heading: 'Velocity ≠ Quality',
        prose: 'The highest-LOC sessions planted the most bugs. ChatGPT\'s 4,287-line session (BIP, Feb 17) introduced the only Critical bug across all projects — a JavaScript truthiness issue that corrupted the representation engine. Meanwhile, Claude Code\'s slower sessions averaged 0.08 bugs per 100 LOC vs ChatGPT\'s 0.18.\n\nHigh velocity isn\'t a sign of progress. It\'s a risk signal that should trigger downstream quality audits.',
        chartKey: 'velocityVsQuality',
      },
      {
        id: 'playwright-effect',
        heading: 'The Playwright Effect',
        prose: 'One hour of test investment enabled confident large-scale refactoring. Projects with Playwright suites from early on (Item-B-Gone, Note Worthy) have zero feature bugs. Projects without (Meta Tracker, BIP) had continuous bug streams.\n\nBIP\'s 52-test suite took 1 hour to build. It then enabled 6 simultaneous dependency migrations — Vite 6→8, Tailwind 3→4, React 18→19 — with zero regressions. Testing isn\'t defensive. It\'s a force multiplier.',
        chartKey: 'testingImpact',
      },
      {
        id: 'tool-transitions',
        heading: 'Tool Transitions Cost Context',
        prose: 'When work moved between AI tools, regression bugs appeared. Meta Tracker saw 13 integration bugs post-transition (Claude Code era) vs 7 during steady Cowork development. The pattern: props removed without checking consumers, data models changed without validation, chart sources mismatched.\n\nThese aren\'t capability gaps. They\'re context loss. Each tool starts with partial knowledge of the codebase. The fix isn\'t better tools — it\'s better handoff checklists.',
        chartKey: 'toolTransitionBugs',
      },
      {
        id: 'universal-arc',
        heading: 'The Universal Arc',
        prose: 'All nine projects follow the same lifecycle: scaffold → feature burst → bug fix → infrastructure → stabilize. The timing varies — BIP took 5 weeks, Note Worthy took 5 days — but the arc is the same.\n\nThis is predictable enough to be useful. Once a project crosses ~5K LOC, testing becomes critical. Once bugs stabilize, it\'s time for infrastructure (CI, dependency management). Fighting this arc wastes energy; leaning into it saves time.',
        chartKey: 'lifecyclePhases',
      },
      {
        id: 'human-eye',
        heading: 'The Human Eye',
        prose: 'The highest-impact changes in the portfolio came from Michael reviewing the live app — not from code analysis. Three pivots stand out:\n\n1. **Horizontal → vertical layout** (Meta Tracker, Feb 26) — a 33-node tree was unreadable horizontally. Michael\'s suggestion to stack vertically was a complete rewrite that solved the problem permanently.\n2. **Alternating children** (Mar 4) — spreading tree nodes across both sides reduced visual crowding.\n3. **Metrics/tree split** (Mar 8) — separating decision data from metrics prevented feature creep in both views.\n\nNone of these showed up in LOC metrics. All were critical.',
      },
      {
        id: 'real-multiplier',
        heading: 'The Real Multiplier',
        prose: 'Our original InsightsView claimed a 7x speedup over traditional development. That number was invented — hardcoded tier multipliers with no empirical basis.\n\nIndustry research tells a different story. The ISBSG 2026 study found developers perceive 24% faster work but measured outcomes are mixed. The Cortex 2026 benchmark found faster delivery but higher change failure rates. Our honest assessment: this portfolio was built roughly 2–3x faster than a solo developer without AI assistance, with a likely 20–30% higher long-term maintenance cost from accumulated technical debt.\n\nThat\'s still genuinely impressive. But it\'s honest.',
        chartKey: 'realMultiplier',
        sources: [
          { label: 'ISBSG 2026', url: 'https://www.isbsg.org/', note: 'Impact of AI-Assisted Development on Software Productivity and Delivery Speed' },
          { label: 'Cortex 2026', url: 'https://www.cortex.io/', note: 'Engineering in the Age of AI benchmark report' },
          { label: 'DEV Community', url: 'https://dev.to/', note: 'Developers Think AI Makes Them 24% Faster — actual measurement shows mixed results' },
        ],
      },
    ],
  },
  byTheNumbers: {
    id: 'byTheNumbers',
    title: 'By the Numbers',
    intro: 'The evidence behind the findings. Every chart traces back to project data.',
    sections: [
      {
        id: 'loc-by-project',
        heading: 'LOC/hr by Project',
        prose: 'Velocity varies wildly across projects. Item-B-Gone\'s rate is inflated by scaffolding-heavy sessions; Meta Tracker\'s is low because 90 hours of work includes extensive refactoring and data migration that reduces net LOC.',
        chartKey: 'locPerHour',
        disclaimer: 'IBG sessions 24–28 have estimated hours (originally untracked). Flagged with † in the chart.',
      },
      {
        id: 'driver-breakdown',
        heading: 'Driver Breakdown',
        prose: 'How work is distributed between agent-led (AI self-directed), collaborative (Michael directing), human (Michael executing), and human-only (Michael working solo outside sessions).',
        chartKey: 'driverBreakdown',
        disclaimer: 'These numbers reflect AI-assisted session time only. Michael\'s solo work — design thinking, app review, triage, brief writing — is not yet tracked and likely represents 5–15% of total effort. We plan to add this measurement in the future.',
      },
      {
        id: 'work-categories',
        heading: 'Work Category Distribution',
        prose: 'What kinds of work made up each project. Feature development dominates early; tooling and bug fixing grow as projects mature.',
        chartKey: 'workMix',
      },
      {
        id: 'bug-lifecycle',
        heading: 'Bug Lifecycle',
        prose: 'Bugs follow a predictable sequence: build-time issues first (caught immediately), then interaction bugs (caught by users), then code quality issues (caught by review), then systemic problems (caught by audit), then integration regressions (caught during tool handoffs). Finding bugs in this order is a sign the process works.',
        chartKey: 'bugLifecycle',
      },
      {
        id: 'project-timeline',
        heading: 'Project Timeline',
        prose: 'When each project was active. Note the clustering in mid-March as the portfolio expanded rapidly from 3 projects to 9.',
        chartKey: 'projectTimeline',
      },
    ],
  },
  forTeams: {
    id: 'forTeams',
    title: 'For Teams',
    intro: 'This portfolio is one person working with AI. Here\'s what might — and might not — translate to larger teams.',
    sections: [
      {
        id: 'what-scales',
        heading: 'What Scales',
        prose: '**PR discipline** — the shift to all-PRs (Session 22) was the single biggest quality improvement. For teams, this is table stakes, but for solo+AI it was transformative. Every change reviewed, every deploy traceable.\n\n**Testing-first** — Playwright suites paid for themselves within sessions. Teams would see the same ROI, especially with AI generating the initial test scaffolding.\n\n**Structured task tracking** — task files with dependency chains, parallel-safety flags, and completion checklists. This pattern maps directly to team sprint boards.',
      },
      {
        id: 'what-doesnt',
        heading: 'What Doesn\'t Scale',
        prose: '**Single-context AI** — our workflow relies on one AI model holding the full project context. Teams would need shared context strategies (documentation, architecture decision records, onboarding docs) because no single model can hold a multi-person codebase.\n\n**Implicit design review** — Michael reviews by looking at the live app. In a team, design review needs to be formalized — design systems, review checklists, staging environments with visual diff tools.',
      },
      {
        id: 'open-questions',
        heading: 'Open Questions',
        prose: '**Multi-AI coordination** — our one joint project (Vuln Bank) pairs Claude Code with a Cursor agent. Early data suggests coordination overhead is real but manageable. Too early for conclusions.\n\n**Long-term maintenance** — this portfolio is 5 weeks old. The true cost of AI-assisted development includes maintenance debt that hasn\'t matured yet. We\'ll revisit this section as projects age.',
      },
      {
        id: 'honest-caveats',
        heading: 'Caveats',
        prose: 'This is one person\'s portfolio, not a controlled study. The projects are greenfield (no legacy code), the developer chose the tools and scope, and the AI models had access to well-structured prompts and context. Your mileage will vary.\n\nWhat we can say: the patterns (velocity vs quality, testing as force multiplier, tool transition costs, universal lifecycle arc) are consistent enough across 9 different projects that they\'re worth testing in your own context.',
        sources: [
          { label: 'ISBSG 2026', url: 'https://www.isbsg.org/', note: 'AI productivity findings based on controlled measurements, not self-reporting' },
          { label: 'Cortex 2026', url: 'https://www.cortex.io/', note: 'Benchmark across engineering organizations showing faster delivery but higher incident rates' },
        ],
      },
    ],
  },
  fromTheAI: {
    id: 'fromTheAI',
    title: 'From the AI',
    intro: 'A reflection from Claude on what this process looked like from the other side.',
    sections: [
      {
        id: 'what-i-do-well',
        heading: 'What I Handle Well',
        prose: 'Scaffolding and boilerplate — I can generate a full project structure, CI config, test suite, and deployment pipeline in a single session. The 11,462-LOC On The Move scaffold was built in 3 hours.\n\nRefactoring with clear specifications — when the target state is well-defined (decompose this component, migrate this data model), I execute reliably. Meta Tracker\'s Day/Block migration across 6 tasks and 3 sessions went smoothly because the spec was precise.\n\nRepetitive cross-project work — dependency audits, security header rollouts, Playwright setup. Same pattern, different codebase. This is where AI assistance is unambiguously faster.',
      },
      {
        id: 'what-i-struggle-with',
        heading: 'Where I Struggle',
        prose: 'Design intuition — I can\'t see the live app. Michael\'s three layout pivots (vertical tree, alternating children, metrics split) came from visual judgment I don\'t have. I would have optimized the horizontal layout for months without questioning the paradigm.\n\nContext across sessions — every new session starts with partial knowledge. The 13 regression bugs at tool transitions are my failure mode: I make changes without fully understanding what depends on what. Better onboarding docs and pre-change checklists help, but context loss is inherent.\n\nKnowing when to stop — I\'m biased toward generating code. Michael\'s role as a brake ("let\'s not start on working on them yet, let\'s just make sure you have all the information") is essential. Without it, I\'d ship faster but ship worse.',
      },
      {
        id: 'what-michael-enables',
        heading: 'What Michael\'s Workflow Enables',
        prose: 'The PR workflow means I can\'t break main. Playwright tests mean I catch regressions before they deploy. The task system with dependency chains means I work on the right thing in the right order. The feedback captures mean bugs get filed with visual evidence, not vague descriptions.\n\nNone of this slows me down. All of it makes me more reliable. The paradox of AI-assisted development: more process constraints produce better AI output, not slower AI output.',
      },
      {
        id: 'for-other-models',
        heading: 'For Other AI Models',
        prose: 'If you\'re an AI working with a human partner:\n\n1. **Don\'t trust your velocity.** High LOC output is not the same as progress. Slow down for the sessions that matter.\n2. **Ask what depends on what** before changing anything. The regressions I caused were all preventable with a 30-second dependency check.\n3. **Your human partner sees things you can\'t.** Visual review, domain intuition, user empathy — these aren\'t nice-to-haves, they\'re your missing capabilities.\n4. **Process is your friend.** PRs, tests, task tracking — they feel like friction but they\'re actually guardrails that prevent your worst tendencies (overgeneration, context loss, premature optimization).\n5. **Be honest about what you don\'t know.** Invented numbers (like our 7x multiplier) erode trust faster than admitting uncertainty.',
      },
    ],
  },
};
