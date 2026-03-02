import type { Project } from '../types';

export const metaProject: Project = {
  id: 'meta',
  name: 'Meta Tracker',
  subtitle: 'BUILT WITH CLAUDE COWORK · CODEX',
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
            'Same stack as BIP — Vite + React + TypeScript + Tailwind + Cloudflare Pages',
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
  ],
  stats: {
    totalDays: 3,
    chatGptMessages: '200+',
    coworkSessions: 5,
    prsCreated: '17+',
    codexTasks: '15+',
    linesOfCode: '2,000+',
    deadEnds: 3,
    majorDecisions: 10,
  },
};
