import type { Project } from '../types';

export const metaProject: Project = {
  id: 'meta',
  name: 'Meta Tracker',
  subtitle: 'BUILT WITH CLAUDE COWORK Â· CODEX',
  chapters: [
    {
      id: 'meta-ch-inception',
      name: 'Inception & Architecture',
      period: 'Session 1 (Feb 2026)',
      toolLabel: 'Claude Cowork',
      tool: 'claude',
      nodes: [
        {
          id: 'meta-concept-born',
          type: 'event',
          category: 'functional',
          title: 'Meta Tracker Concept Born',
          description:
            'During BIP development, Michael proposed building a meta app that tracks the decision history of AI-assisted projects.',
        },
        {
          id: 'meta-stack-selection',
          type: 'decision',
          category: 'technical',
          title: 'Architecture & Stack Selection',
          description:
            'Chose the same stack as BIP for consistency: Vite + React + TypeScript + Tailwind, hosted on Cloudflare Pages. JSON files in repo as data store.',
          chosenPath:
            'Same stack as BIP â Vite + React + TypeScript + Tailwind + Cloudflare Pages',
          alternatives: ['Different framework', 'Adding a backend with Cloudflare D1/KV'],
        },
        {
          id: 'meta-react-flow',
          type: 'decision',
          category: 'technical',
          title: 'React Flow for Visualization',
          description:
            'Selected React Flow (@xyflow/react v12) for the interactive decision tree. Provides node/edge primitives, pan/zoom, and custom node components.',
          chosenPath: 'React Flow (@xyflow/react v12)',
          alternatives: ['D3.js', 'Recharts (wrong tool for graphs)', 'Custom canvas rendering'],
        },
        {
          id: 'meta-hardcoded-json',
          type: 'decision',
          category: 'technical',
          title: 'Hardcoded JSON Data Model',
          description:
            'All project data hardcoded as a TypeScript file (bipProject.ts). Fastest to iterate on, type safety at build time.',
          chosenPath: 'TypeScript file with typed objects',
          alternatives: ['JSON files at runtime', 'Cloudflare Worker API', 'Simple CMS'],
        },
      ],
    },
    {
      id: 'meta-ch-horizontal',
      name: 'The Horizontal Era',
      period: 'Sessions 1-3',
      toolLabel: 'Claude, ChatGPT',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-horizontal-layout',
          type: 'decision',
          category: 'ux-design',
          title: 'Horizontal Tree Layout (v0.1-v0.3)',
          description:
            'Built a left-to-right branching tree. Worked for small datasets but became unwieldy as BIP data grew to 10 phases and 33 nodes.',
          chosenPath: 'Left-to-right branching tree with timeline metaphor',
          alternatives: ['Vertical stacking', 'Radial layout', 'Force-directed graph'],
        },
        {
          id: 'meta-filter-bar',
          type: 'decision',
          category: 'functional',
          title: 'Filter Bar Implementation',
          description:
            'Built a 6-button filter bar: All, Decisions, Dead Ends, Events, Technical, Functional. Buttons are immediately visible and one-click.',
          chosenPath: 'Inline button bar with fixed filter options',
          alternatives: ['Sidebar filter panel', 'Dropdown menu', 'Search/filter input'],
        },
        {
          id: 'meta-category-tagging',
          type: 'decision',
          category: 'functional',
          title: 'Category Tagging (Technical vs. Functional)',
          description:
            'Added a category field to every node, initially with two values. Later expanded to four (Technical, Functional, UX/Design, Process).',
          lesson: 'Start with fewer categories and expand based on real need.',
          chosenPath: 'Two categories: Technical and Functional',
          alternatives: ['More granular categories from the start', 'Freeform tags'],
        },
      ],
    },
    {
      id: 'meta-ch-layout-overhaul',
      name: 'The Layout Overhaul',
      period: 'Sessions 4-5',
      toolLabel: 'Claude, ChatGPT',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-vertical-layout',
          type: 'pivot',
          category: 'ux-design',
          title: 'Switching to Vertical Layout',
          description:
            "Michael suggested vertical stacking where phases stack top-to-bottom. Complete rewrite of treeLayout.ts. Major improvement in readability.",
          lesson: "Trust Michael's design instinct. He's the one using the app daily.",
          chosenPath: 'Vertical phase stacking with horizontal child branching',
          alternatives: [
            'Keeping horizontal with collapsing',
            'Switching to list/accordion view',
            'Timeline component',
          ],
        },
        {
          id: 'meta-expandable-phases',
          type: 'decision',
          category: 'ux-design',
          title: 'Expandable/Collapsible Phases',
          description:
            'Phases collapse to show summary counts. Phase 1 expands by default, others start collapsed. Click to toggle.',
          chosenPath: 'Collapsed-by-default with summary counts, first phase expanded',
          alternatives: [
            'All expanded by default',
            'Expand-on-hover',
            'Expand-all/collapse-all buttons',
          ],
        },
        {
          id: 'meta-handle-routing',
          type: 'decision',
          category: 'technical',
          title: 'Handle Routing Overhaul',
          description:
            'Implemented named handle IDs (top, bottom, right, left) with position-aware routing for clean edge connections.',
          chosenPath: 'Named handles with position-aware routing per edge type',
          alternatives: ['React Flow auto-route', 'Default handles only'],
        },
        {
          id: 'meta-dynamic-detail-height',
          type: 'decision',
          category: 'technical',
          title: 'Dynamic Detail Height',
          description:
            'Layout adds 60px detailExtra spacing when a node description is expanded to prevent overlap.',
          chosenPath: 'Dynamic 60px adjustment on detail expand',
          alternatives: [
            'Fixed large spacing for all nodes',
            'Text truncation',
            'Overflow scrolling within nodes',
          ],
        },
      ],
    },
    {
      id: 'meta-ch-spacing-wars',
      name: 'The Spacing Wars',
      period: 'Session 5',
      toolLabel: 'ChatGPT Codex',
      tool: 'chatgpt',
      nodes: [
        {
          id: 'meta-iterative-spacing',
          type: 'event',
          category: 'ux-design',
          title: 'Iterative Spacing Tuning',
          description:
            "Three separate Codex tasks adjusting spacing constants based on Michael's visual feedback from the live site.",
          lesson:
            "Don't try to calculate spacing theoretically. Small visual increments converge faster.",
        },
        {
          id: 'meta-codex-revert-issue',
          type: 'dead-end',
          category: 'process',
          title: 'Codex Task Revert Issue',
          description:
            'A spacing fix got reverted because a subsequent Codex task branched from pre-merge main.',
          failureReason:
            'Multiple Codex tasks in flight caused later tasks to silently revert earlier changes.',
          lesson: 'Codex branches from main at submission time. Keep tasks sequential.',
        },
        {
          id: 'meta-minimap-removal',
          type: 'decision',
          category: 'ux-design',
          title: 'MiniMap Removal',
          description:
            'Removed the React Flow MiniMap widget. Not useful at this stage with a single project.',
          chosenPath: 'Remove MiniMap entirely',
          alternatives: ['Styling it for dark theme', 'Moving it to a toggle'],
        },
        {
          id: 'meta-unicode-fix',
          type: 'dead-end',
          category: 'technical',
          title: 'Unicode Rendering Fix',
          description:
            'Special characters rendered as literal escape sequences. Switched to String.fromCharCode() calls.',
          failureReason:
            'Unicode escape sequences in JSX rendered as literal text instead of symbols.',
        },
      ],
    },
    {
      id: 'meta-ch-data-alignment',
      name: 'The Data Model Alignment',
      period: 'Session 7 (Feb 2026)',
      toolLabel: 'Claude Cowork, Codex',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-phases-to-chapters',
          type: 'decision',
          category: 'process',
          title: 'Phases Renamed to Chapters',
          description:
            'Renamed Phase to Chapter across the entire codebase: types, component names, state variables, UI labels, and data files. One vocabulary everywhere.',
          chosenPath: 'Full rename across codebase',
          alternatives: ['Keeping phases in code but showing chapters in UI only'],
        },
        {
          id: 'meta-discovery-pivot-types',
          type: 'decision',
          category: 'functional',
          title: 'Discovery and Pivot Node Types Added',
          description:
            'Added Discovery (amber, lightbulb-style) and Pivot (violet, direction changes) as first-class node types with distinct colors and filtering.',
          chosenPath: 'First-class types with visual distinction',
          alternatives: ['Mapping Discovery to Event and Pivot to Decision', 'Adding as subtypes'],
        },
        {
          id: 'meta-category-expansion',
          type: 'decision',
          category: 'functional',
          title: 'Category Expansion to Four',
          description:
            'Added UX/Design and Process to categories. Filter bar expanded from 6 to 10 buttons (All + 5 types + 4 categories).',
          chosenPath: 'Four categories: Technical, Functional, UX/Design, Process',
          alternatives: ['Keeping 2 categories and mapping the new ones'],
        },
        {
          id: 'meta-bip-data-loaded',
          type: 'event',
          category: 'functional',
          title: 'Full BIP Dataset Loaded',
          description:
            'Replaced placeholder bipProject.ts with full manual conversion from BIP/decisions.md. 10 chapters, ~30 entries across all 5 types and 4 categories.',
        },
        {
          id: 'meta-multi-project',
          type: 'decision',
          category: 'functional',
          title: 'Multi-Project Support with Project Selector',
          description:
            'Created metaProject.ts as second dataset. Added PROJECTS array and project selector buttons in the header.',
          chosenPath: 'Button selector with state reset on switch',
          alternatives: ['Dropdown menu', 'Separate routes per project', 'Tabs'],
        },
        {
          id: 'meta-parser-deferred',
          type: 'decision',
          category: 'technical',
          title: 'Build-Time Markdown Parser Deferred',
          description:
            'Deferred the decisions.md to JSON parser. Manual conversion was fast enough for 2 projects.',
          lesson: "Don't automate until the manual process is proven and painful.",
          chosenPath: 'Manual conversion now, automate later',
          alternatives: ['Building the parser this session'],
        },
        {
          id: 'meta-proportional-detail',
          type: 'decision',
          category: 'technical',
          title: 'Proportional Detail Height Fix',
          description:
            'Changed detailExtra from fixed 60px to proportional calculation: Math.max(60, Math.ceil(description.length / 40) * 25).',
          chosenPath: 'Proportional to character count',
          alternatives: ['Larger fixed value', 'Measuring rendered text height'],
        },
        {
          id: 'meta-alternating-layout',
          type: 'pivot',
          category: 'ux-design',
          title: 'Alternating Left/Right Child Layout',
          description:
            "Modified treeLayout.ts to alternate child positioning: odd right, even left. Michael's design instinct for better use of horizontal space.",
          lesson:
            'Layout paradigm changes driven by visual review are the highest-impact improvements.',
          chosenPath: 'Odd-indexed right, even-indexed left with bidirectional handles',
          alternatives: ['Keeping right-only with more spacing', 'Grid layout for children'],
        },
      ],
    },
    {
      id: 'meta-ch-spine-dashboard',
      name: 'The Spine Fix & Dashboard Infrastructure',
      period: 'Session 8 (Mar 2026)',
      toolLabel: 'Claude Cowork, Codex',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-spine-offset',
          type: 'decision',
          category: 'ux-design',
          title: 'Spine Edge Offset Fix',
          description:
            'Offset vertical spine edges ~30-40px right of chapter center to avoid clipping through left-side child nodes.',
          chosenPath: 'Offset spine right (Option A)',
          alternatives: ['Route edges around children', 'Increase horizontal gap', 'Z-index styling'],
        },
        {
          id: 'meta-view-switcher',
          type: 'decision',
          category: 'functional',
          title: 'View Switcher Added',
          description:
            'Added tab-style view switcher: Decision Tree and Metrics tabs with active/inactive styling.',
          chosenPath: 'Tab-style view switcher',
          alternatives: ['Dropdown menu', 'Sidebar navigation', 'Separate routes'],
        },
        {
          id: 'meta-summary-bar',
          type: 'pivot',
          category: 'ux-design',
          title: 'Summary Bar Replaces Summary Cards',
          description:
            'Removed metric summary cards. Replaced with compact horizontal bar showing entry count, notable type badges, stacked category bar with legend.',
          chosenPath: 'Option C: separated entry count from category visualization',
          alternatives: ['Option B: category bar + entry count in one line'],
        },
        {
          id: 'meta-collapsible-filters',
          type: 'decision',
          category: 'ux-design',
          title: 'Collapsible Filter Buttons',
          description:
            'Collapsed filters behind a Filter button. Expands on click, shows active filter name as badge when filtered.',
          chosenPath: 'Hidden by default with toggle',
          alternatives: ['Removing filters entirely', 'Keeping always visible'],
        },
        {
          id: 'meta-chapter-stats-simplified',
          type: 'decision',
          category: 'ux-design',
          title: 'Chapter Stats Simplified',
          description:
            'Simplified chapter stats to: mini category bar, entry count, notable types, clickable bug count linking to Metrics.',
          chosenPath: 'Decision context only, metrics in Metrics view',
          alternatives: ['Keeping all stats'],
        },
        {
          id: 'meta-metrics-data-files',
          type: 'event',
          category: 'technical',
          title: 'Metrics Data Files Created',
          description:
            'Created bipMetrics.ts and metaMetrics.ts with typed exports: CodeVolume, Sessions, Bugs, DerivedMetrics, Stack.',
        },
        {
          id: 'meta-metrics-dashboard',
          type: 'event',
          category: 'functional',
          title: 'Metrics Dashboard Built',
          description:
            'Built MetricsDashboard.tsx with 4 tabs (Overview, Code, Bugs, Sessions). All div-based charts. Bidirectional linking with Decision Tree.',
        },
      ],
    },
    {
      id: 'meta-ch-ux-polish',
      name: 'The UX Polish Pass',
      period: 'Session 9 (Mar 2026)',
      toolLabel: 'Claude Cowork, Codex',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-overview-cleanup',
          type: 'decision',
          category: 'ux-design',
          title: 'Overview Tab Decluttered',
          description:
            'Removed decision-related stat rows (type counts, category counts) and Bugs Found card from the Metrics Overview. Added project date range and dynamic subtitle listing tools used per project.',
          chosenPath: 'Code metrics only in Metrics view; decision data stays in tree',
          alternatives: ['Keeping all stats in both views'],
        },
        {
          id: 'meta-area-chart',
          type: 'decision',
          category: 'ux-design',
          title: 'Codebase Chart Converted to SVG Area Chart',
          description:
            'Replaced horizontal LOC bars with an SVG area/line chart showing codebase growth trajectory. Includes hover tooltips with session name and LOC.',
          chosenPath: 'Inline SVG area chart with gradient fill',
          alternatives: ['Keeping horizontal bars', 'Installing Recharts'],
        },
        {
          id: 'meta-donut-charts',
          type: 'decision',
          category: 'ux-design',
          title: 'Bug Breakdowns Converted to Donut Charts',
          description:
            'Replaced severity/category/source horizontal bars with SVG donut ring charts. Clockwise fill animation on load using CSS stroke-dashoffset transitions.',
          chosenPath: 'SVG donut rings with staggered animation',
          alternatives: ['Keeping horizontal bars', 'Pie charts'],
        },
        {
          id: 'meta-vertical-bar-chart',
          type: 'decision',
          category: 'ux-design',
          title: 'Session Activity Vertical Bar Chart',
          description:
            'Replaced Session Activity horizontal bars with vertical grouped bar chart (PRs, Decisions, Dead Ends per session) for visual variety.',
          chosenPath: 'Vertical grouped bars',
          alternatives: ['Keeping horizontal bars'],
        },
        {
          id: 'meta-hover-tooltips',
          type: 'decision',
          category: 'ux-design',
          title: 'Hover Tooltips Added Across All Charts',
          description:
            'Added consistent hover tooltips to all charts (area chart, Code tab bars, Sessions bars). Darker transparent blue highlight background, not pink/seashell.',
          chosenPath: 'Unified tooltip pattern with dark blue hover highlight',
          alternatives: ['No tooltips', 'Click-based detail panels'],
        },
        {
          id: 'meta-review-checklist',
          type: 'decision',
          category: 'process',
          title: 'Technical Review Checklist Added',
          description:
            'Added a tiered code review checklist to How We Work: always-check items, component-level concerns, visualization checks, and escalation criteria.',
          chosenPath: 'Checklist in How We Work doc, matched to change type',
          alternatives: ['Separate review doc', 'Ad-hoc review per PR'],
        },
      ],
    },
    {
      id: 'meta-ch-dashboard-data-overhaul',
      name: 'The Dashboard Data Overhaul',
      period: 'Session 12 (Mar 2026)',
      toolLabel: 'Claude Cowork, Codex',
      tool: 'mixed',
      nodes: [
        {
          id: 'meta-remnants-wired',
          type: 'event',
          category: 'technical',
          title: 'Remnants Project Wired into UI',
          description:
            'Imported remnantsProject and remnantsMetrics, registered Remnants in the PROJECTS array and project selector. All three projects now selectable in both Decision Tree and Metrics Dashboard.',
        },
        {
          id: 'meta-date-grouped-charts',
          type: 'decision',
          category: 'ux-design',
          title: 'Date-Grouped Collapsible Chart Sessions',
          description:
            'Redesigned both Code tab charts to group sessions by date with expand/collapse chevrons. An 8-row cap auto-merges oldest dates into a range row to keep the chart compact.',
          chosenPath: 'Date-grouped rows with 8-row cap and expand/collapse',
          alternatives: ['Pagination', 'Scroll-within-card', 'Show only latest N sessions'],
        },
        {
          id: 'meta-keep-both-charts',
          type: 'decision',
          category: 'ux-design',
          title: 'Keep Both Code Tab Charts',
          description:
            'Kept both Lines Added vs Deleted and Net Change charts. They answer different questions: volume/direction of work vs whether the codebase grew or shrank.',
          chosenPath: 'Both charts retained, both upgraded to date-grouped pattern',
          alternatives: ['Merging into a single chart'],
        },
        {
          id: 'meta-deep-code-review',
          type: 'decision',
          category: 'process',
          title: 'Deep Code Review via Source Analysis',
          description:
            'Developed a pattern of fetching full file source via GitHub API, rendering into DOM, then running targeted JavaScript analysis. Found 4 real bugs in MetricsDashboard.tsx.',
          lesson: 'Shallow diff-scanning misses edge case bugs. Full source analysis with targeted pattern matching catches real issues.',
          chosenPath: 'Fetch full source, DOM render, JavaScript pattern analysis',
          alternatives: ['Diff-only review', 'Manual line-by-line reading'],
        },
      ],
    },
    {
      id: 'meta-ch-stacked-tree-view',
      title: 'The Stacked Tree View',
      tool: 'mixed',
      summary:
        'Introduced StackedTreeView as an alternative to the React Flow canvas — a purely CSS-based, vertically-stacked chapter/card layout. Added a stacked/canvas toggle, then ran a parity polish pass fixing category filters, duplicate UI, and label mismatches.',
      entries: [
        {
          id: 'meta-stacked-tree-component',
          type: 'decision',
          category: 'ux-design',
          title: 'StackedTreeView Component Created',
          description:
            'Created a 585-line CSS-based alternative view. Renders chapters as expandable cards with entry cards, summary bar, filter buttons, and chapter stats. Uses inline styles to avoid CSS specificity conflicts.',
          chosenPath: 'Separate component with inline styles, no React Flow dependency',
          alternatives: ['Accordion within DecisionTree', 'Separate route/page', 'Markdown-rendered view'],
        },
        {
          id: 'meta-stacked-canvas-toggle',
          type: 'decision',
          category: 'ux-design',
          title: 'Stacked/Canvas Toggle',
          description:
            'Added treeMode state (stacked/canvas) defaulting to stacked. Toggle buttons below the project selector. Filter state, expanded chapter, and project selection shared between modes.',
          chosenPath: 'Inline toggle with shared state, default to stacked',
          alternatives: ['Separate view switcher tab', 'Dropdown selector', 'localStorage preference'],
        },
        {
          id: 'meta-parity-polish',
          type: 'event',
          category: 'technical',
          title: 'Parity Polish Pass (3 Bugs Fixed)',
          description:
            'Code review and live verification found 3 parity issues: category filter not checking node.category, duplicate summary bar in stacked mode, and UX Design label missing slash. All fixed in PR #39.',
        },
      ],
    },
  ],
  stats: {
    totalDays: 5,
    chatGptMessages: '250+',
    coworkSessions: 10,
    prsCreated: '39+',
    codexTasks: '38+',
    linesOfCode: '3,300+',
    deadEnds: 2,
    majorDecisions: 21,
  },
};
